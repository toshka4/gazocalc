import { prisma } from "../../lib/prisma.js";
import type { CalculationInput, CalculationResult } from "./calculations.schema.js";

export const calculationsService = {
  async create(leadId: string, input: CalculationInput, result: CalculationResult) {
    return prisma.calculation.create({
      data: {
        leadId,
        ...input,
        ...result,
      },
    });
  },

  async findByLeadId(leadId: string) {
    return prisma.calculation.findUnique({
      where: { leadId },
    });
  },
};
