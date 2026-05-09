import { ok, handleRouteError } from "@/lib/api";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type ProductOption = {
  product_id: number;
  product_name: string;
};

type StoreOption = {
  store_id: number;
  store_name: string;
};

type OrderOption = {
  order_id: number;
  order_status: string;
};

type VoucherOption = {
  voucher_code: string;
  discount_type: string;
};

export async function GET() {
  try {
    const [products, stores, orders, vouchers] = await Promise.all([
      query<ProductOption[]>(
        "SELECT product_id, product_name FROM product ORDER BY product_name ASC",
      ),
      query<StoreOption[]>("SELECT store_id, store_name FROM store ORDER BY store_name ASC"),
      query<OrderOption[]>("SELECT order_id, order_status FROM orders ORDER BY order_id ASC"),
      query<VoucherOption[]>(
        "SELECT voucher_code, discount_type FROM voucher ORDER BY voucher_code ASC",
      ),
    ]);

    return ok({ products, stores, orders, vouchers });
  } catch (error) {
    return handleRouteError(error);
  }
}
