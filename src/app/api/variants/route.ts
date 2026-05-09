import { badRequest, handleRouteError, ok, parseRequiredNumber } from "@/lib/api";
import { withConnection } from "@/lib/db";

export const dynamic = "force-dynamic";

type CreateVariantBody = {
  productId?: unknown;
  optionValue?: unknown;
  price?: unknown;
  stockQuantity?: unknown;
  status?: unknown;
};

type NewVariantRow = {
  newVariantId: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateVariantBody;
    const productId = parseRequiredNumber(body.productId);
    const price = parseRequiredNumber(body.price);
    const stockQuantity = parseRequiredNumber(body.stockQuantity);
    const optionValue = typeof body.optionValue === "string" ? body.optionValue.trim() : "";
    const status = typeof body.status === "string" ? body.status.trim() : "";

    if (productId === null || price === null || stockQuantity === null) {
      return badRequest("Product, price, and stock quantity are required.");
    }

    if (!optionValue || !status) {
      return badRequest("Option value and status are required.");
    }

    const newVariantId = await withConnection(async (connection) => {
      await connection.query("CALL sp_variant_insert(?, ?, ?, ?, ?, @new_variant_id)", [
        productId,
        optionValue,
        price,
        stockQuantity,
        status,
      ]);

      const [rows] = await connection.query("SELECT @new_variant_id AS newVariantId");
      return (rows as NewVariantRow[])[0]?.newVariantId;
    });

    return ok({ variantId: newVariantId });
  } catch (error) {
    return handleRouteError(error);
  }
}
