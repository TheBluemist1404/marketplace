# Demo Guide

## Service Architecture

The app uses Next.js as both frontend and backend:

```text
Next.js Client UI
  -> Next.js API Route
  -> mysql2 connection pool
  -> MySQL RDS stored procedure/function
  -> JSON response
  -> UI table/form/result panel
```

Database credentials live in `.env.local`. API routes run on the server, so the password is not exposed to the browser.

## Section 3.1 Demo: Insert / Update / Delete

Screen:

```text
Variants
```

Table:

```text
product_variant
```

Stored procedures:

```text
sp_variant_insert
sp_variant_update
sp_variant_delete
```

Demo flow:

1. Use the insert form with product `#2 Wireless Mouse`.
2. Enter option value `demo blue`, price `19.99`, stock `10`, status `active`.
3. Click Insert.
4. Search for `demo blue`.
5. Select the inserted row.
6. Change price to `21.99` or stock to `0`.
7. Click Update.
8. Select the same row and click Delete.

Error demo:

1. Try inserting with price `-1`.
2. The stored procedure should reject it and the UI should display the database error message.

## Section 3.2 Demo: Data List From Query Procedure

Screen:

```text
Variants
```

Stored procedure:

```text
sp_search_variants(p_keyword, p_min_price, p_max_price, p_store_id)
```

Demo flow:

1. Search keyword `mouse`.
2. Set min price `0` and max price `100`.
3. Run search.
4. Filter by a specific store.
5. Select a row from the result list.
6. Update or delete from the selected row.

This satisfies the requirement that the list is retrieved from a Section 2.3 stored procedure and is related to the Section 2.1 table.

## Section 3.3 Demo: Other Procedure / Function

Screen:

```text
Reports
```

Demo A:

```text
sp_top_selling_stores('2026-03-01', '2026-03-31', 0)
```

Expected output:

```text
store name, total orders, variants sold, units, revenue, delivered rate
```

Demo B:

```text
fn_CalculateActualStoreRevenue(1, '2026-03-01', '2026-03-31')
```

Expected output:

```text
actual revenue for the selected store and date range
```

Demo C:

```text
fn_ValidateVoucher(1, 'FRESH10')
```

Possible result codes:

```text
1  = valid
0  = invalid by condition
-1 = missing input
-2 = voucher does not exist
-3 = order has no items
```

## What To Say In The Presentation

Use this short explanation:

```text
Our application is built with Next.js. The React interface does not connect directly to MySQL. Instead, every button calls a Next.js API route. The API route runs on the server and calls the stored procedures or functions in the MySQL RDS database.

For Section 3.1, the Variant screen calls the insert, update, and delete procedures from Section 2.1.

For Section 3.2, the same screen retrieves the product variant list by calling sp_search_variants from Section 2.3. The user can search, filter, select a row, update it, or delete it.

For Section 3.3, the Reports screen demonstrates another stored procedure and two functions: top selling stores, actual store revenue, and voucher validation.
```

## Quick Checks

Run:

```bash
npm run lint
npm run build
```

If the app cannot connect to the database, check:

```text
.env.local
RDS security group inbound rule
Database name marketplace_eerd
Stored procedure/function names
```
