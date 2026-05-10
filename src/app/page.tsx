"use client";

import {
  BarChart3,
  CheckCircle2,
  Database,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type ApiResponse<T> = {
  data?: T;
  error?: string;
};

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

type ReferenceData = {
  products: ProductOption[];
  stores: StoreOption[];
  orders: OrderOption[];
  vouchers: VoucherOption[];
};

type VariantRow = {
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

type TopStoreRow = {
  store_id: number;
  store_name: string;
  total_orders: number;
  variants_sold: number;
  total_units: number;
  total_revenue: number;
  avg_unit_price: number;
  delivered_rate: number;
};

type VariantForm = {
  productId: string;
  optionValue: string;
  price: string;
  stockQuantity: string;
  status: string;
};

type VariantUpdateForm = {
  optionValue: string;
  price: string;
  stockQuantity: string;
  status: string;
};

const statuses = ["active", "available", "out_of_stock", "discontinued"];

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload.data as T;
}

function buildQuery(params: Record<string, string>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value.trim() !== "") {
      search.set(key, value.trim());
    }
  });

  return search.toString();
}

function formatMoney(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "-";
  }

  return money.format(Number(value));
}

export default function Home() {
  const [activeView, setActiveView] = useState<"variants" | "reports">("variants");
  const [referenceData, setReferenceData] = useState<ReferenceData>({
    products: [],
    stores: [],
    orders: [],
    vouchers: [],
  });
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<VariantRow | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "",
    minPrice: "0",
    maxPrice: "100",
    storeId: "",
  });
  const [createForm, setCreateForm] = useState<VariantForm>({
    productId: "2",
    optionValue: "demo blue",
    price: "19.99",
    stockQuantity: "10",
    status: "active",
  });
  const [updateForm, setUpdateForm] = useState<VariantUpdateForm>({
    optionValue: "",
    price: "",
    stockQuantity: "",
    status: "",
  });
  const [topStoreParams, setTopStoreParams] = useState({
    fromDate: "2026-03-01",
    toDate: "2026-03-31",
    minRevenue: "0",
  });
  const [topStores, setTopStores] = useState<TopStoreRow[]>([]);
  const [revenueParams, setRevenueParams] = useState({
    storeId: "1",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
  });
  const [revenue, setRevenue] = useState<number | null>(null);
  const [voucherParams, setVoucherParams] = useState({
    orderId: "1001",
    voucherCode: "FRESH10",
  });
  const [voucherResult, setVoucherResult] = useState<{
    validationCode: number;
    meaning: string;
  } | null>(null);

  const selectedLabel = useMemo(() => {
    if (!selectedVariant) {
      return "No row selected";
    }

    return `#${selectedVariant.variant_id} - ${selectedVariant.product_name} / ${selectedVariant.option_value}`;
  }, [selectedVariant]);

  async function searchVariants(nextFilters = filters) {
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const query = buildQuery(nextFilters);
      const data = await requestJson<VariantRow[]>(`/api/variants/search?${query}`);
      setVariants(data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not search variants.");
    } finally {
      setLoading(false);
    }
  }

  function selectVariant(variant: VariantRow) {
    setSelectedVariant(variant);
    setUpdateForm({
      optionValue: variant.option_value,
      price: String(variant.price),
      stockQuantity: String(variant.stock_quantity),
      status: variant.status,
    });
    setNotice(`Selected variant ${variant.variant_id}.`);
    setError("");
  }

  async function createVariant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const result = await requestJson<{ variantId: number }>("/api/variants", {
        method: "POST",
        body: JSON.stringify(createForm),
      });
      setNotice(`Inserted variant ${result.variantId}.`);
      await searchVariants();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not insert variant.");
    } finally {
      setLoading(false);
    }
  }

  async function updateVariant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedVariant) {
      setError("Select a variant row before updating.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      await requestJson(`/api/variants/${selectedVariant.variant_id}`, {
        method: "PUT",
        body: JSON.stringify(updateForm),
      });
      setNotice(`Updated variant ${selectedVariant.variant_id}.`);
      await searchVariants();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update variant.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteVariant() {
    if (!selectedVariant) {
      setError("Select a variant row before deleting.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      await requestJson(`/api/variants/${selectedVariant.variant_id}`, {
        method: "DELETE",
      });
      setNotice(`Deleted variant ${selectedVariant.variant_id}.`);
      setSelectedVariant(null);
      await searchVariants();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not delete variant.");
    } finally {
      setLoading(false);
    }
  }

  async function loadTopStores(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const query = buildQuery(topStoreParams);
      const data = await requestJson<TopStoreRow[]>(`/api/reports/top-stores?${query}`);
      setTopStores(data);
      setNotice(`Loaded ${data.length} store report rows.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load store report.");
    } finally {
      setLoading(false);
    }
  }

  async function calculateRevenue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const query = buildQuery(revenueParams);
      const data = await requestJson<{ revenue: number | null }>(
        `/api/reports/store-revenue?${query}`,
      );
      setRevenue(data.revenue);
      setNotice("Calculated actual store revenue.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not calculate revenue.");
    } finally {
      setLoading(false);
    }
  }

  async function validateVoucher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const query = buildQuery(voucherParams);
      const data = await requestJson<{ validationCode: number; meaning: string }>(
        `/api/vouchers/validate?${query}`,
      );
      setVoucherResult(data);
      setNotice("Voucher validation finished.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not validate voucher.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      try {
        const query = buildQuery({
          keyword: "",
          minPrice: "0",
          maxPrice: "100",
          storeId: "",
        });
        const [references, initialVariants] = await Promise.all([
          requestJson<ReferenceData>("/api/reference"),
          requestJson<VariantRow[]>(`/api/variants/search?${query}`),
        ]);

        if (!cancelled) {
          setReferenceData(references);
          setVariants(initialVariants);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Could not load initial data.");
        }
      }
    }

    void loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
              <Database size={16} aria-hidden="true" />
              Database Systems Assignment 2
            </div>
            <h1 className="text-3xl font-semibold tracking-normal text-slate-950">
              Marketplace Database Demo
            </h1>
          </div>
          <div className="flex rounded-md border border-slate-300 bg-white p-1 shadow-sm">
            <button
              className={`rounded px-4 py-2 text-sm font-medium ${
                activeView === "variants"
                  ? "bg-slate-950 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => setActiveView("variants")}
              type="button"
            >
              Variants
            </button>
            <button
              className={`rounded px-4 py-2 text-sm font-medium ${
                activeView === "reports"
                  ? "bg-slate-950 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              onClick={() => setActiveView("reports")}
              type="button"
            >
              Reports
            </button>
          </div>
        </header>

        {(notice || error || loading) && (
          <section className="flex flex-col gap-2">
            {loading && (
              <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                <RefreshCw className="animate-spin" size={16} aria-hidden="true" />
                Working with the database...
              </div>
            )}
            {notice && (
              <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                <CheckCircle2 size={16} aria-hidden="true" />
                {notice}
              </div>
            )}
            {error && (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                {error}
              </div>
            )}
          </section>
        )}

        {activeView === "variants" ? (
          <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-md border border-slate-200 bg-white shadow-sm">
              <form
                className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[1fr_130px_130px_160px_auto]"
                onSubmit={(event) => {
                  event.preventDefault();
                  void searchVariants();
                }}
              >
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                  Search
                  <input
                    className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                    value={filters.keyword}
                    onChange={(event) =>
                      setFilters((current) => ({ ...current, keyword: event.target.value }))
                    }
                    placeholder="product or option"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                  Min
                  <input
                    className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.minPrice}
                    onChange={(event) =>
                      setFilters((current) => ({ ...current, minPrice: event.target.value }))
                    }
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                  Max
                  <input
                    className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.maxPrice}
                    onChange={(event) =>
                      setFilters((current) => ({ ...current, maxPrice: event.target.value }))
                    }
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                  Store
                  <select
                    className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                    value={filters.storeId}
                    onChange={(event) =>
                      setFilters((current) => ({ ...current, storeId: event.target.value }))
                    }
                  >
                    <option value="">All stores</option>
                    {referenceData.stores.map((store) => (
                      <option key={store.store_id} value={store.store_id}>
                        {store.store_name}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                  type="submit"
                >
                  <Search size={16} aria-hidden="true" />
                  Search
                </button>
              </form>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Variant</th>
                      <th className="px-4 py-3 font-semibold">Product</th>
                      <th className="px-4 py-3 font-semibold">Store</th>
                      <th className="px-4 py-3 font-semibold">Price</th>
                      <th className="px-4 py-3 font-semibold">Stock</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {variants.map((variant) => (
                      <tr
                        className={`cursor-pointer ${
                          selectedVariant?.variant_id === variant.variant_id
                            ? "bg-slate-100"
                            : "hover:bg-slate-50"
                        }`}
                        key={variant.variant_id}
                        onClick={() => selectVariant(variant)}
                      >
                        <td className="px-4 py-3 font-medium text-slate-950">
                          #{variant.variant_id} {variant.option_value}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{variant.product_name}</td>
                        <td className="px-4 py-3 text-slate-700">{variant.store_name}</td>
                        <td className="px-4 py-3 text-slate-700">
                          {formatMoney(variant.price)}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{variant.stock_quantity}</td>
                        <td className="px-4 py-3">
                          <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                            {variant.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <form
                className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
                onSubmit={createVariant}
              >
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Plus size={18} aria-hidden="true" />
                  Insert Variant
                </h2>
                <div className="grid gap-3">
                  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    Product
                    <select
                      className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                      value={createForm.productId}
                      onChange={(event) =>
                        setCreateForm((current) => ({
                          ...current,
                          productId: event.target.value,
                        }))
                      }
                    >
                      {referenceData.products.map((product) => (
                        <option key={product.product_id} value={product.product_id}>
                          #{product.product_id} {product.product_name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    Option value
                    <input
                      className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                      value={createForm.optionValue}
                      onChange={(event) =>
                        setCreateForm((current) => ({
                          ...current,
                          optionValue: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                      Price
                      <input
                        className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                        min="0"
                        step="0.01"
                        type="number"
                        value={createForm.price}
                        onChange={(event) =>
                          setCreateForm((current) => ({
                            ...current,
                            price: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                      Stock
                      <input
                        className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                        min="0"
                        step="1"
                        type="number"
                        value={createForm.stockQuantity}
                        onChange={(event) =>
                          setCreateForm((current) => ({
                            ...current,
                            stockQuantity: event.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    Status
                    <select
                      className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                      value={createForm.status}
                      onChange={(event) =>
                        setCreateForm((current) => ({ ...current, status: event.target.value }))
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="inline-flex h-10 items-center justify-center gap-2 rounded bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                    type="submit"
                  >
                    <Plus size={16} aria-hidden="true" />
                    Insert
                  </button>
                </div>
              </form>

              <form
                className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
                onSubmit={updateVariant}
              >
                <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
                  <Pencil size={18} aria-hidden="true" />
                  Update Variant
                </h2>
                <p className="mb-4 text-sm text-slate-500">{selectedLabel}</p>
                <div className="grid gap-3">
                  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    Option value
                    <input
                      className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                      value={updateForm.optionValue}
                      onChange={(event) =>
                        setUpdateForm((current) => ({
                          ...current,
                          optionValue: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                      Price
                      <input
                        className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                        min="0"
                        step="0.01"
                        type="number"
                        value={updateForm.price}
                        onChange={(event) =>
                          setUpdateForm((current) => ({
                            ...current,
                            price: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                      Stock
                      <input
                        className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                        min="0"
                        step="1"
                        type="number"
                        value={updateForm.stockQuantity}
                        onChange={(event) =>
                          setUpdateForm((current) => ({
                            ...current,
                            stockQuantity: event.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    Status
                    <select
                      className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                      value={updateForm.status}
                      onChange={(event) =>
                        setUpdateForm((current) => ({ ...current, status: event.target.value }))
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      className="inline-flex h-10 items-center justify-center gap-2 rounded bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                      type="submit"
                    >
                      <Pencil size={16} aria-hidden="true" />
                      Update
                    </button>
                    <button
                      className="inline-flex h-10 items-center justify-center gap-2 rounded border border-rose-300 px-4 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                      onClick={() => void deleteVariant()}
                      type="button"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        ) : (
          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <BarChart3 size={18} aria-hidden="true" />
                Top Selling Stores
              </h2>
              <form className="grid gap-3 md:grid-cols-4" onSubmit={loadTopStores}>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                  From
                  <input
                    className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                    type="date"
                    value={topStoreParams.fromDate}
                    onChange={(event) =>
                      setTopStoreParams((current) => ({
                        ...current,
                        fromDate: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                  To
                  <input
                    className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                    type="date"
                    value={topStoreParams.toDate}
                    onChange={(event) =>
                      setTopStoreParams((current) => ({ ...current, toDate: event.target.value }))
                    }
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                  Min revenue
                  <input
                    className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                    min="0"
                    step="0.01"
                    type="number"
                    value={topStoreParams.minRevenue}
                    onChange={(event) =>
                      setTopStoreParams((current) => ({
                        ...current,
                        minRevenue: event.target.value,
                      }))
                    }
                  />
                </label>
                <button
                  className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                  type="submit"
                >
                  <BarChart3 size={16} aria-hidden="true" />
                  Run
                </button>
              </form>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-3">Store</th>
                      <th className="px-3 py-3">Orders</th>
                      <th className="px-3 py-3">Units</th>
                      <th className="px-3 py-3">Revenue</th>
                      <th className="px-3 py-3">Delivered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topStores.map((store) => (
                      <tr key={store.store_id}>
                        <td className="px-3 py-3 font-medium">{store.store_name}</td>
                        <td className="px-3 py-3">{store.total_orders}</td>
                        <td className="px-3 py-3">{store.total_units}</td>
                        <td className="px-3 py-3">{formatMoney(store.total_revenue)}</td>
                        <td className="px-3 py-3">
                          {Math.round(Number(store.delivered_rate) * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <form
                className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
                onSubmit={calculateRevenue}
              >
                <h2 className="mb-4 text-lg font-semibold">Actual Store Revenue</h2>
                <div className="grid gap-3 md:grid-cols-4">
                  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    Store
                    <select
                      className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                      value={revenueParams.storeId}
                      onChange={(event) =>
                        setRevenueParams((current) => ({
                          ...current,
                          storeId: event.target.value,
                        }))
                      }
                    >
                      {referenceData.stores.map((store) => (
                        <option key={store.store_id} value={store.store_id}>
                          {store.store_name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    Start
                    <input
                      className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                      type="date"
                      value={revenueParams.startDate}
                      onChange={(event) =>
                        setRevenueParams((current) => ({
                          ...current,
                          startDate: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    End
                    <input
                      className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                      type="date"
                      value={revenueParams.endDate}
                      onChange={(event) =>
                        setRevenueParams((current) => ({
                          ...current,
                          endDate: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <button
                    className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                    type="submit"
                  >
                    Calculate
                  </button>
                </div>
                <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-4 text-2xl font-semibold">
                  {formatMoney(revenue)}
                </div>
              </form>

              <form
                className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
                onSubmit={validateVoucher}
              >
                <h2 className="mb-4 text-lg font-semibold">Voucher Validation</h2>
                <div className="grid gap-3 md:grid-cols-3">
                  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    Order
                    <select
                      className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                      value={voucherParams.orderId}
                      onChange={(event) =>
                        setVoucherParams((current) => ({
                          ...current,
                          orderId: event.target.value,
                        }))
                      }
                    >
                      {referenceData.orders.map((order) => (
                        <option key={order.order_id} value={order.order_id}>
                          #{order.order_id} {order.order_status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                    Voucher
                    <select
                      className="h-10 rounded border border-slate-300 px-3 text-slate-950 outline-none focus:border-slate-950"
                      value={voucherParams.voucherCode}
                      onChange={(event) =>
                        setVoucherParams((current) => ({
                          ...current,
                          voucherCode: event.target.value,
                        }))
                      }
                    >
                      {referenceData.vouchers.map((voucher) => (
                        <option key={voucher.voucher_code} value={voucher.voucher_code}>
                          {voucher.voucher_code}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                    type="submit"
                  >
                    Validate
                  </button>
                </div>
                {voucherResult && (
                  <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-medium text-slate-500">
                      Result code {voucherResult.validationCode}
                    </div>
                    <div className="mt-1 text-lg font-semibold">{voucherResult.meaning}</div>
                  </div>
                )}
              </form>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
