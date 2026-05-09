USE marketplace_eerd;

ALTER TABLE buyer
  ADD CONSTRAINT chk_buyer_gender
  CHECK (gender IS NULL OR gender IN ('male','female','other','prefer_not_to_say'));

ALTER TABLE administrator
  ADD CONSTRAINT chk_administrator_working_status
  CHECK (working_status IN ('working','on_leave','inactive','terminated'));

ALTER TABLE notification
  ADD CONSTRAINT chk_notification_type
  CHECK (type IN ('order','voucher','shipment','payment','return','system','promotion'));

ALTER TABLE notification
  ADD CONSTRAINT chk_notification_status
  CHECK (status IN ('read','unread','archived'));

ALTER TABLE user_account
  ADD CONSTRAINT chk_user_account_status
  CHECK (account_status IN ('active','inactive','suspended','locked','pending'));

ALTER TABLE seller
  ADD CONSTRAINT chk_seller_verification_status
  CHECK (verification_status IN ('pending','verified','rejected','suspended'));

ALTER TABLE product_variant
  ADD CONSTRAINT chk_product_variant_status
  CHECK (status IN ('active','available','out_of_stock','discontinued'));

ALTER TABLE orders
  ADD CONSTRAINT chk_orders_status
  CHECK (order_status IN ('pending','paid','processing','shipped','delivered','cancelled','return_requested'));

ALTER TABLE shipment
  ADD CONSTRAINT chk_shipment_method
  CHECK (shipping_method IN ('standard','express','same_day','pickup'));

ALTER TABLE shipment
  ADD CONSTRAINT chk_shipment_status
  CHECK (shipping_status IN ('processing','in_transit','delivered','failed','returned','cancelled'));

ALTER TABLE payment
  ADD CONSTRAINT chk_payment_method
  CHECK (payment_method IN ('e_wallet','credit_card','bank_transfer','cash_on_delivery'));

ALTER TABLE payment
  ADD CONSTRAINT chk_payment_status
  CHECK (payment_status IN ('pending','paid','failed','refunded','cancelled'));

ALTER TABLE return_request
  ADD CONSTRAINT chk_return_request_status
  CHECK (request_status IN ('pending','reviewing','approved','rejected','closed'));

ALTER TABLE voucher
  ADD CONSTRAINT chk_voucher_discount_type
  CHECK (discount_type IN ('percentage','fixed_amount'));

ALTER TABLE voucher_condition
  ADD CONSTRAINT chk_voucher_condition_type
  CHECK (condition_type IN ('minimum_order_amount','category_id'));

ALTER TABLE voucher_condition
  ADD CONSTRAINT chk_voucher_condition_operator
  CHECK (`operator` IN ('=','>','>=','<','<=','!='));
