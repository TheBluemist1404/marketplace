import {
  badRequest,
  handleRouteError,
  normalizeOptionalString,
  ok,
  parseRequiredNumber,
} from "@/lib/api";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateVariantBody = {
  optionValue?: unknown;
  price?: unknown;
  stockQuantity?: unknown;
  status?: unknown;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const variantId = parseRequiredNumber(id);
    if (variantId === null) {
      return badRequest("Variant ID must be a number.");
    }

    const body = (await request.json()) as UpdateVariantBody;
    const optionValue = normalizeOptionalString(body.optionValue);
    const price = parseRequiredNumber(body.price);
    const stockQuantity = parseRequiredNumber(body.stockQuantity);
    const status = normalizeOptionalString(body.status);

    await query("CALL sp_variant_update(?, ?, ?, ?, ?)", [
      variantId,
      optionValue,
      price,
      stockQuantity,
      status,
    ]);

    return ok({ variantId });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const variantId = parseRequiredNumber(id);
    if (variantId === null) {
      return badRequest("Variant ID must be a number.");
    }

    await query("CALL sp_variant_delete(?)", [variantId]);
    return ok({ variantId });
  } catch (error) {
    return handleRouteError(error);
  }
}
