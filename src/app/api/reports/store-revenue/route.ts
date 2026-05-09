import { handleRouteError, ok, parseOptionalNumber } from "@/lib/api";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type StoreRevenueRow = {
  revenue: number;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const storeId = parseOptionalNumber(url.searchParams.get("storeId"));
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const rows = await query<StoreRevenueRow[]>(
      "SELECT fn_CalculateActualStoreRevenue(?, ?, ?) AS revenue",
      [storeId, startDate, endDate],
    );

    return ok({ revenue: rows[0]?.revenue ?? null });
  } catch (error) {
    return handleRouteError(error);
  }
}
