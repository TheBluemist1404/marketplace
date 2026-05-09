import { handleRouteError, ok, parseOptionalNumber } from "@/lib/api";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type VoucherValidationRow = {
  validationCode: number;
};

const meanings: Record<number, string> = {
  1: "Voucher is valid for this order.",
  0: "Voucher exists but does not satisfy its conditions.",
  "-1": "Missing order ID or voucher code.",
  "-2": "Voucher code does not exist.",
  "-3": "Order has no items.",
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = parseOptionalNumber(url.searchParams.get("orderId"));
    const voucherCode = url.searchParams.get("voucherCode");

    const rows = await query<VoucherValidationRow[]>(
      "SELECT fn_ValidateVoucher(?, ?) AS validationCode",
      [orderId, voucherCode],
    );
    const validationCode = rows[0]?.validationCode ?? -1;

    return ok({
      validationCode,
      meaning: meanings[validationCode] ?? "Unknown validation result.",
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
