USE marketplace_eerd;

-- These finite-domain columns are implemented as MySQL ENUMs.
-- The old domain CHECK constraints were removed so the domain is carried
-- by the column type itself.

ALTER TABLE buyer
  MODIFY COLUMN gender ENUM('male','female','other','prefer_not_to_say') NULL;

ALTER TABLE administrator
  MODIFY COLUMN working_status ENUM('working','on_leave','inactive','terminated') NOT NULL;

ALTER TABLE notification
  MODIFY COLUMN type ENUM('order','voucher','shipment','payment','return','system','promotion') NOT NULL;

ALTER TABLE notification
  MODIFY COLUMN status ENUM('read','unread','archived') NOT NULL;

ALTER TABLE user_account
  MODIFY COLUMN account_status ENUM('active','inactive','suspended','locked','pending') NOT NULL;

ALTER TABLE seller
  MODIFY COLUMN verification_status ENUM('pending','verified','rejected','suspended') NOT NULL;

ALTER TABLE product_variant
  MODIFY COLUMN status ENUM('active','available','out_of_stock','discontinued') NOT NULL;

ALTER TABLE `order`
  MODIFY COLUMN order_status ENUM('pending','paid','processing','shipped','delivered','cancelled','return_requested') NOT NULL;

ALTER TABLE shipment
  MODIFY COLUMN shipping_method ENUM('standard','express','same_day','pickup') NOT NULL;

ALTER TABLE shipment
  MODIFY COLUMN shipping_status ENUM('processing','in_transit','delivered','failed','returned','cancelled') NOT NULL;

ALTER TABLE payment
  MODIFY COLUMN payment_method ENUM('e_wallet','credit_card','bank_transfer','cash_on_delivery') NOT NULL;

ALTER TABLE payment
  MODIFY COLUMN payment_status ENUM('pending','paid','failed','refunded','cancelled') NOT NULL;

ALTER TABLE return_request
  MODIFY COLUMN request_status ENUM('pending','reviewing','approved','rejected','closed') NOT NULL;

ALTER TABLE voucher
  MODIFY COLUMN discount_type ENUM('percentage','fixed_amount') NOT NULL;

ALTER TABLE voucher_condition
  MODIFY COLUMN condition_type ENUM('minimum_order_amount','category_id') NOT NULL;

ALTER TABLE voucher_condition
  MODIFY COLUMN `operator` ENUM('=','>','>=','<','<=','!=') NOT NULL;

-- For manual Workbench testing, use a strict session so invalid ENUM values
-- are rejected instead of converted to MySQL's empty enum value.
SET SESSION sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
