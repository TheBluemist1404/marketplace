# Assignment Implementation Notes

This document explains what has been implemented for the database assignment, how it was implemented, and why the design choices were made.

## Section 1 - Create Tables And Sample Data

### What We Implemented

The database was implemented in MySQL 8.4 on AWS RDS using the database:

```sql
marketplace_eerd
```

The schema contains the marketplace tables from the EERD:

```text
user_account, buyer, seller, administrator, notification
store, category, product, product_variant
address, buyer_address
cart, cart_item
voucher, voucher_condition, buyer_voucher
`order`, order_item, shipment, payment
review, review_media, return_request
```

Each table has a primary key. Relationship integrity is enforced using foreign keys. The database also contains meaningful sample data, with at least 5 rows per table. `user_account` has 15 rows because it contains 5 buyers, 5 sellers, and 5 administrators.

The order entity is implemented as the table `` `order` ``. Because `ORDER` is a MySQL keyword, SQL statements quote the table name with backticks.

Surrogate primary keys use MySQL `AUTO_INCREMENT` so new rows can be inserted safely without manually calculating the next ID. This applies to IDs such as `account_id`, `store_id`, `product_id`, `variant_id`, `order_id`, `payment_id`, `shipment_id`, `review_id`, and `request_id`.

Natural or composite identifiers do not use `AUTO_INCREMENT`. Examples are `voucher_code`, `cart_item(cart_id, variant_id)`, `order_item(order_id, variant_id)`, and `review_media(review_id, media_url)`.

### Actual Table Schemas

Before explaining Section 2, we document the concrete schema used in Section 1 so every later procedure, function, and application screen has a clear table foundation.

The actual MySQL `CREATE TABLE` statements for all 23 tables are recorded here:

```text
docs/SECTION_1_TABLE_SCHEMAS.md
```

That schema reference was generated from the live `marketplace_eerd` database after the enum conversion, `orders` to `` `order` `` rename, and `AUTO_INCREMENT` update. It includes the columns, primary keys, foreign keys, unique keys, generated column for default address handling, enum domains, and table-level numeric/date checks for each table.

### How Tables Were Created

The tables were created with MySQL `CREATE TABLE` statements using:

```text
PRIMARY KEY
FOREIGN KEY
NOT NULL
UNIQUE
AUTO_INCREMENT
CHECK
ENUM where appropriate
```

For example:

```sql
product_variant.variant_id
```

is the primary key of `product_variant`, while:

```sql
product_variant.product_id
```

is a foreign key referencing:

```sql
product.product_id
```

This guarantees that every variant belongs to an existing product.

### How Sample Data Was Initialized

Sample data was inserted using SQL `INSERT` statements. The data was chosen to be meaningful for the marketplace domain:

```text
buyers, sellers, stores, products, variants, vouchers, orders, payments, shipments, reviews, and return requests
```

The sample data is connected across tables. For example, orders reference real buyers, order items reference real product variants, reviews reference purchased order items, and vouchers reference existing stores.

The seed data was expanded beyond the minimum requirement so Section 3 has a more realistic workflow:

```text
12 products
24 product variants
17 orders
47 order items
7 vouchers
12 voucher conditions
6 return requests
```

This creates realistic test cases: one order can contain many items, the same variant can appear in many orders, one buyer voucher can be used by more than one order, and approved returns change the actual revenue calculation.

### Important Table-Level Constraints

Numeric constraints are enforced at table level. Examples:

```sql
price >= 0
stock_quantity >= 0
quantity > 0
rating_score BETWEEN 1 AND 5
usage_count <= amount
end_date >= start_date
```

Finite status/type domains are implemented as actual MySQL `ENUM` columns. Examples:

```sql
product_variant.status ENUM('active', 'available', 'out_of_stock', 'discontinued')
`order`.order_status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'return_requested')
payment.payment_status ENUM('pending', 'paid', 'failed', 'refunded', 'cancelled')
voucher.discount_type ENUM('percentage', 'fixed_amount')
```

The Next.js API sets strict SQL mode for each database session so invalid enum values are rejected instead of being converted to MySQL's empty enum value. For direct Workbench demos, run the same session setting before testing invalid enum values:

```sql
SET SESSION sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
```

### Special Constraint: One Default Address Per Buyer

The EERD separates the physical address from the buyer-specific delivery profile:

```text
Address = physical location
BuyerAddress = buyer's recipient information for that location
```

`recipient_name`, `recipient_phone`, and `is_default` belong to `buyer_address`, not `address`, because the same physical address can be used by many buyers with different recipient information.

To enforce that each buyer can have only one default address, MySQL uses a generated column:

```sql
default_buyer_id BIGINT GENERATED ALWAYS AS (
  CASE WHEN is_default THEN buyer_id ELSE NULL END
) STORED
```

Then a unique key is placed on that generated column:

```sql
UNIQUE KEY uq_buyer_default_address (default_buyer_id)
```

Why this works:

- When `is_default = TRUE`, `default_buyer_id` becomes the buyer ID.
- MySQL prevents the same buyer ID from appearing twice in that unique key.
- When `is_default = FALSE`, `default_buyer_id` is `NULL`.
- MySQL allows multiple `NULL` values in a unique key, so a buyer may have many non-default addresses.

This enforces the business rule at table level instead of relying only on application code.

### Other Design Choices

`Product` and `ProductVariant` are separated because product-level information and sellable option-level information are different:

```text
Product: product name, description, store, category
ProductVariant: option value, price, stock quantity, status
```

`CartItem` and `OrderItem` are separated because cart data is temporary and editable, while order item data is historical purchase data.

`BuyerVoucher` is used as a relationship table because voucher ownership and usage are buyer-specific:

```text
Buyer 1 - N BuyerVoucher
Voucher 1 - N BuyerVoucher
```

This allows the database to track how many voucher uses a specific buyer owns and how many have already been used.

## Section 2 - Triggers, Stored Procedures, And Functions

### Section 2.1 - Insert, Update, Delete Procedures

Task:

```text
Write stored procedures to insert, update, and delete data from one table.
Each procedure must validate data and return meaningful errors.
```

Implemented table:

```text
product_variant
```

Implemented procedures:

```text
sp_variant_insert
sp_variant_update
sp_variant_delete
```

Why `product_variant` was chosen:

- It is central to the marketplace system.
- It has meaningful validation rules.
- It connects to products, carts, orders, reviews, and return requests.
- It is useful for the application demo in Section 3.

Validation handled by the procedures:

```text
option_value must not be empty
price must be greater than 0
stock_quantity must not be negative
status must be one of active, available, out_of_stock, discontinued
product_id must reference an existing product
option_value must not be duplicated within the same product
```

Special handling:

```text
If stock_quantity = 0 and status is active or available, the procedure automatically changes status to out_of_stock.
The new variant_id is generated by product_variant.variant_id AUTO_INCREMENT and returned with LAST_INSERT_ID().
```

Delete rule:

```text
sp_variant_delete blocks deletion when the variant is still in active orders or carts.
```

This is necessary because deleting an in-use variant can break shopping carts or order history. The recommended business alternative is to set the variant status to `discontinued`.

### Section 2.2 - Triggers

Task:

```text
2.2.1 Create trigger(s) for a business constraint that cannot be fully handled by table constraints.
2.2.2 Create trigger(s) to calculate a derived attribute.
```

Current database status:

```text
No triggers are currently present in the live database.
```

This means Section 2.2 still needs to be added before the final assignment submission if the group has not implemented triggers elsewhere.

Good trigger candidates for this schema:

```text
Update cart.total_items when cart_item changes.
Update store rating when review changes.
Prevent return requests for orders that are not delivered.
Prevent voucher usage_count from exceeding buyer voucher amount during order changes.
```

The table-level numeric/date constraints and enum domains from Section 1 should not be duplicated as triggers, because the assignment says constraints that can be checked in table creation statements should not be validated using triggers.

### Section 2.3 - Display Procedures

Task:

```text
Write two stored procedures that display data.
Each procedure must take input parameters for WHERE and/or HAVING.
One query must join two or more tables with WHERE and ORDER BY.
One query must use aggregate functions with GROUP BY, HAVING, WHERE, ORDER BY, and joins.
```

Implemented procedures:

```text
sp_search_variants
sp_top_selling_stores
```

`sp_search_variants`:

```text
Searches product variants by keyword, price range, and optional store.
Joins product_variant, product, store, and category.
Uses WHERE and ORDER BY.
```

Why it is useful:

- It is directly related to the `product_variant` table used in Section 2.1.
- It supports the application search screen in Section 3.2.

`sp_top_selling_stores`:

```text
Shows store sales performance for a date range and minimum revenue.
Joins store, product, product_variant, order_item, and `` `order` ``.
Uses SUM, COUNT, AVG, GROUP BY, HAVING, WHERE, and ORDER BY.
The delivered rate counts distinct delivered orders, not delivered order-item rows, so multi-item orders do not inflate the rate.
```

Why it is useful:

- It is a realistic marketplace report.
- It demonstrates aggregate querying over multiple related tables.
- It supports the report screen in Section 3.3.

### Section 2.4 - Functions

Task:

```text
Write two functions with input parameters, validation, stored data queries, IF and/or LOOP logic, and cursors.
```

Implemented functions:

```text
fn_CalculateActualStoreRevenue
fn_ValidateVoucher
```

`fn_CalculateActualStoreRevenue`:

```text
Inputs: store ID, start date, end date
Output: actual revenue
```

How it works:

- Validates missing inputs.
- Validates the date range.
- Checks that the store exists.
- Uses a cursor to loop through order item rows.
- Adds revenue only from delivered orders.
- Excludes approved returns from revenue.

Why it is useful:

```text
It calculates a business metric that cannot be represented by a simple stored column.
```

`fn_ValidateVoucher`:

```text
Inputs: order ID, voucher code
Output: validation code
```

Result meanings:

```text
1  = voucher is valid
0  = voucher exists but conditions are not satisfied
-1 = missing order ID or voucher code
-2 = voucher does not exist
-3 = order has no items
```

How it works:

- Validates input.
- Checks voucher existence.
- Calculates order total.
- Uses a cursor to loop through voucher conditions.
- Supports minimum order amount and category conditions.

Why it is useful:

```text
It models real marketplace voucher validation logic and demonstrates cursor-based computation.
```

## Section 3 - Application Implementation

The application is implemented with Next.js. It does not connect to MySQL directly from the browser. Instead:

```text
Browser UI -> Next.js API route -> MySQL stored procedure/function -> JSON response
```

This protects database credentials and keeps all SQL execution on the server side.

Section 3.1 is demonstrated by the Product Variant Management screen:

```text
Insert -> sp_variant_insert
Update -> sp_variant_update
Delete -> sp_variant_delete
```

Section 3.2 is demonstrated by the Variant Search/List screen:

```text
Search/list -> sp_search_variants
```

The screen supports search, filtering, row selection, update, delete, validation, and error messages.

Section 3.3 is demonstrated by the Reports screen:

```text
Top stores -> sp_top_selling_stores
Actual revenue -> fn_CalculateActualStoreRevenue
Voucher validation -> fn_ValidateVoucher
```

The goal of the app is not to implement a full marketplace. The goal is to prove real connectivity to the database and demonstrate the stored procedures/functions required by the assignment.
