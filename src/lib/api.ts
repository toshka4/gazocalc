import type { CalculatorInput, CalculatorResult } from "@/types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ── Types ─────────────────────────────────────────────

export interface CreateLeadPayload {
  name: string;
  phone: string;
  email: string;
  city: string;
  comment: string;
  calculation: {
    input: {
      houseLength: number;
      houseWidth: number;
      wallHeight: number;
      wallThickness: number;
      blockLength: number;
      blockHeight: number;
      blockThickness: number;
      density: string;
      windowArea: number;
      doorArea: number;
      reservePercent: number;
      pricePerM3: number;
      glueBagPrice: number;
      deliveryPrice: number;
      hasPartitions: boolean;
      partitionArea: number;
      hasPediments: boolean;
      pedimentArea: number;
      hasDelivery: boolean;
    };
    result: {
      totalVolume: number;
      totalBlocks: number;
      totalPallets: number;
      totalGlueBags: number;
      totalWeight: number;
      blocksCost: number;
      glueCost: number;
      deliveryCost: number;
      totalCost: number;
    };
  };
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
}

// ── Маппинг frontend → backend ────────────────────────

export function buildLeadPayload(
  form: { name: string; phone: string; email: string; city: string; comment: string },
  input: CalculatorInput,
  result: CalculatorResult,
): CreateLeadPayload {
  return {
    ...form,
    calculation: {
      input: {
        houseLength: input.houseLength,
        houseWidth: input.houseWidth,
        wallHeight: input.wallHeight,
        wallThickness: input.wallThickness,
        blockLength: input.blockSize.length,
        blockHeight: input.blockSize.height,
        blockThickness: input.blockSize.width,
        density: input.density,
        windowArea: input.windowArea,
        doorArea: input.doorArea,
        reservePercent: input.reservePercent,
        pricePerM3: input.pricePerCubicMeter,
        glueBagPrice: input.glueBagPrice,
        deliveryPrice: input.deliveryCost,
        hasPartitions: input.hasPartitions,
        partitionArea: input.partitionArea,
        hasPediments: input.hasPediments,
        pedimentArea: input.pedimentArea,
        hasDelivery: input.hasDelivery,
      },
      result: {
        totalVolume: result.concreteVolume,
        totalBlocks: result.blockCount,
        totalPallets: result.palletCount,
        totalGlueBags: result.glueBagCount,
        totalWeight: result.estimatedWeight,
        blocksCost: result.blocksCost,
        glueCost: result.glueCost,
        deliveryCost: result.deliveryCost,
        totalCost: result.totalCost,
      },
    },
  };
}

// ── API client ────────────────────────────────────────

export async function submitLead(
  payload: CreateLeadPayload,
): Promise<ApiResponse<{ id: string; status: string }>> {
  const response = await fetch(`${API_BASE}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: ApiResponse<{ id: string; status: string }> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || "Ошибка отправки заявки");
  }

  return data;
}

export async function downloadPdf(leadId: string): Promise<Blob> {
  const response = await fetch(`${API_BASE}/api/pdf/generate/${leadId}`, {
    method: "POST",
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(
      (err as ApiResponse<unknown>)?.error?.message || "Ошибка генерации PDF",
    );
  }

  return response.blob();
}
