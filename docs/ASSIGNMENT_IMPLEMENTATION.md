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
orders, order_item, shipment, payment
review, review_media, return_request
```

Each table has a primary key. Relationship integrity is enforced using foreign keys. The database also contains meaningful sample data, with at least 5 rows per table. `user_account` has 15 rows because it contains 5 buyers, 5 sellers, and 5 administrators.

### How Tables Were Created

The tables were created with MySQL `CREATE TABLE` statements using:

```text
PRIMARY KEY
FOREIGN KEY
NOT NULL
UNIQUE
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

Domain constraints are also enforced at table level for finite status/type fields. Examples:

```sql
product_variant.status IN ('active', 'available', 'out_of_stock', 'discontinued')
orders.order_status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'return_requested')
payment.payment_status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')
voucher.discount_type IN ('percentage', 'fixed_amount')
```

These checks prevent invalid values from being inserted directly into the database, even if someone bypasses the application or stored procedures.

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

The table-level constraints added in Section 1 should not be duplicated as triggers, because the assignment says constraints that can be checked in table creation statements should not be validated using triggers.

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
Joins store, product, product_variant, order_item, and orders.
Uses SUM, COUNT, AVG, GROUP BY, HAVING, WHERE, and ORDER BY.
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
