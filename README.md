# Marketplace Database Demo

Next.js app for Database Systems Assignment 2, Section 3. It connects to the MySQL RDS database and demonstrates the stored procedures/functions from Section 2 through a small admin-style interface.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- MySQL via `mysql2/promise`
- Tailwind CSS

## Setup

Create `.env.local` from `.env.example` and fill in the database password.

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Database Calls

The browser never connects directly to MySQL. The flow is:

```text
Client UI -> Next.js API route -> mysql2 pool -> MySQL stored procedure/function
```

Implemented API routes:

```text
GET    /api/reference
GET    /api/variants/search       -> CALL sp_search_variants
POST   /api/variants              -> CALL sp_variant_insert
PUT    /api/variants/:id          -> CALL sp_variant_update
DELETE /api/variants/:id          -> CALL sp_variant_delete
GET    /api/reports/top-stores    -> CALL sp_top_selling_stores
GET    /api/reports/store-revenue -> SELECT fn_CalculateActualStoreRevenue
GET    /api/vouchers/validate     -> SELECT fn_ValidateVoucher
```

## Assignment Mapping

Section 3.1:

- Product Variant Management screen.
- Insert, update, and delete use the procedures from Section 2.1.

Section 3.2:

- Variant list/search uses `sp_search_variants` from Section 2.3.
- The list is related to the Section 2.1 table, `product_variant`.
- The screen includes search, filtering, row selection, update, delete, validation, and error display.

Section 3.3:

- Store Sales Report uses `sp_top_selling_stores`.
- Actual Store Revenue uses `fn_CalculateActualStoreRevenue`.
- Voucher Validation uses `fn_ValidateVoucher`.

## Notes

- `.env.local` is ignored by git.
- Existing seeded variants can be blocked from deletion if they are referenced by cart/order data. For the clean delete demo, insert a new unused variant first, then delete that new row.

## Documentation

- [Demo guide](docs/DEMO_GUIDE.md)
- [Assignment implementation notes](docs/ASSIGNMENT_IMPLEMENTATION.md)
- [Section 1 table schemas](docs/SECTION_1_TABLE_SCHEMAS.md)
- [Sample data inserts](docs/SAMPLE_DATA_INSERTS.sql)
- [Enum domain columns](docs/ENUM_DOMAIN_COLUMNS.sql)
