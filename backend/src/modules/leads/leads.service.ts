import type { LeadStatus, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { notificationsService } from "../notifications/notifications.service.js";
import { AppError } from "../../common/errors.js";
import type { CreateLeadPayload, LeadListQuery, UpdateLeadInput } from "./leads.schema.js";

export const leadsService = {
  /**
   * Создать заявку + расчёт в одной транзакции + отправить уведомления.
   * Уведомления не блокируют сохранение — ошибки логируются, но не бросаются.
   */
  async create(payload: CreateLeadPayload, logger?: { info: (...args: unknown[]) => void; warn: (...args: unknown[]) => void; error: (...args: unknown[]) => void }) {
    const { calculation, ...leadData } = payload;

    // Одна транзакция: Lead + Calculation
    const lead = await prisma.$transaction(async (tx) => {
      const newLead = await tx.lead.create({
        data: {
          name: leadData.name,
          phone: leadData.phone,
          email: leadData.email,
          city: leadData.city,
          comment: leadData.comment,
        },
      });

      await tx.calculation.create({
        data: {
          leadId: newLead.id,
          ...calculation.input,
          ...calculation.result,
        },
      });

      return tx.lead.findUniqueOrThrow({
        where: { id: newLead.id },
        include: { calculation: true },
      });
    });

    logger?.info({ leadId: lead.id, city: lead.city }, "Lead created");

    // Отправляем уведомления (async, non-blocking)
    if (lead.calculation) {
      notificationsService.notifyNewLead(lead, lead.calculation, logger).catch(() => {
        // catch уже внутри notificationsService — это fallback
      });
    }

    return { id: lead.id, status: lead.status, createdAt: lead.createdAt };
  },

  /** Список заявок с пагинацией, фильтрами и сортировкой */
  async list(query: LeadListQuery) {
    const { page, limit, status, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.LeadWhereInput = {};

    if (status) {
      where.status = status as LeadStatus;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Сортировка по totalCost — через relation
    const orderBy: Prisma.LeadOrderByWithRelationInput =
      sortBy === "totalCost"
        ? { calculation: { totalCost: sortOrder } }
        : { [sortBy]: sortOrder };

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { calculation: true },
      }),
      prisma.lead.count({ where }),
    ]);

    return {
      leads,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  /** Детали заявки с расчётом */
  async findById(id: string) {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { calculation: true },
    });

    if (!lead) {
      throw AppError.notFound(`Заявка ${id} не найдена`);
    }

    return lead;
  },

  /** Обновить заявку (статус и/или managerNotes) */
  async update(id: string, data: UpdateLeadInput) {
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      throw AppError.notFound(`Заявка ${id} не найдена`);
    }

    const updateData: Prisma.LeadUpdateInput = {};
    if (data.status !== undefined) {
      updateData.status = data.status as LeadStatus;
    }
    if (data.managerNotes !== undefined) {
      updateData.managerNotes = data.managerNotes;
    }

    // Если статус изменился — записываем в историю
    if (data.status && data.status !== existing.status) {
      return prisma.$transaction(async (tx) => {
        await tx.leadStatusHistory.create({
          data: {
            leadId: id,
            fromStatus: existing.status,
            toStatus: data.status as LeadStatus,
          },
        });
        return tx.lead.update({
          where: { id },
          data: updateData,
          include: { calculation: true },
        });
      });
    }

    return prisma.lead.update({
      where: { id },
      data: updateData,
      include: { calculation: true },
    });
  },

  /** Удалить заявку и связанные данные */
  async remove(id: string) {
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) {
      throw AppError.notFound(`Заявка ${id} не найдена`);
    }

    await prisma.$transaction(async (tx) => {
      await tx.leadStatusHistory.deleteMany({ where: { leadId: id } });
      await tx.calculation.deleteMany({ where: { leadId: id } });
      await tx.lead.delete({ where: { id } });
    });
  },

  /** Метрики для дашборда */
  async dashboard() {
    const [statusCounts, totals, recentLeads] = await Promise.all([
      prisma.lead.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.calculation.aggregate({
        _avg: { totalCost: true },
        _sum: { totalCost: true },
        _count: { id: true },
      }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { calculation: true },
      }),
    ]);

    const byStatus: Record<string, number> = {};
    let totalLeads = 0;
    for (const row of statusCounts) {
      byStatus[row.status] = row._count.id;
      totalLeads += row._count.id;
    }

    return {
      totalLeads,
      byStatus,
      avgCost: totals._avg.totalCost ?? 0,
      totalRevenue: totals._sum.totalCost ?? 0,
      calculationsCount: totals._count.id,
      recentLeads,
    };
  },
};
