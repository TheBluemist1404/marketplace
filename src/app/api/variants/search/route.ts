import { handleRouteError, ok, parseOptionalNumber } from "@/lib/api";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export type VariantSearchRow = {
  variant_id: number;
  option_value: string;
  price: number;
  stock_quantity: number;
  status: string;
  product_id: number;
  product_name: string;
  store_id: number;
  store_name: string;
  category_name: string;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword") ?? "";
    const minPrice = parseOptionalNumber(url.searchParams.get("minPrice"));
    const maxPrice = parseOptionalNumber(url.searchParams.get("maxPrice"));
    const storeId = parseOptionalNumber(url.searchParams.get("storeId"));

    const rows = await query<unknown>("CALL sp_search_variants(?, ?, ?, ?)", [
      keyword,
      minPrice,
      maxPrice,
      storeId,
    ]);
    const resultSets = rows as VariantSearchRow[][];

    return ok(resultSets[0] ?? []);
  } catch (error) {
    return handleRouteError(error);
  }
}
