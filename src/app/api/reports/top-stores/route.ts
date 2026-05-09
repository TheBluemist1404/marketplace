import { handleRouteError, ok, parseOptionalNumber } from "@/lib/api";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export type TopStoreRow = {
  store_id: number;
  store_name: string;
  total_orders: number;
  variants_sold: number;
  total_units: number;
  total_revenue: number;
  avg_unit_price: number;
  delivered_rate: number;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const fromDate = url.searchParams.get("fromDate");
    const toDate = url.searchParams.get("toDate");
    const minRevenue = parseOptionalNumber(url.searchParams.get("minRevenue"));

    const rows = await query<unknown>("CALL sp_top_selling_stores(?, ?, ?)", [
      fromDate,
      toDate,
      minRevenue,
    ]);
    const resultSets = rows as TopStoreRow[][];

    return ok(resultSets[0] ?? []);
  } catch (error) {
    return handleRouteError(error);
  }
}
