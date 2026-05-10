-- Marketplace sample data snapshot
-- Generated from the live marketplace_eerd database.
-- The seed is intentionally richer than the minimum assignment data so Section 3 can demo realistic marketplace behavior.
-- Surrogate primary keys are AUTO_INCREMENT in the live schema; explicit IDs are kept here so the demo data is reproducible.
-- Table `order` is quoted because ORDER is a MySQL keyword.

USE marketplace_eerd;

-- user_account: 15 rows
INSERT INTO `user_account` (`account_id`, `username`, `password_hash`, `email`, `phone_number`, `creation_date`, `account_status`, `account_type`) VALUES
  (1, 'buyer_anna', 'hash_demo_001', 'anna.buyer@example.com', '+84900000001', '2026-01-01 09:00:00', 'active', 'buyer'),
  (2, 'buyer_binh', 'hash_demo_002', 'binh.buyer@example.com', '+84900000002', '2026-01-02 09:00:00', 'active', 'buyer'),
  (3, 'buyer_chi', 'hash_demo_003', 'chi.buyer@example.com', '+84900000003', '2026-01-03 09:00:00', 'active', 'buyer'),
  (4, 'buyer_dung', 'hash_demo_004', 'dung.buyer@example.com', '+84900000004', '2026-01-04 09:00:00', 'active', 'buyer'),
  (5, 'buyer_emma', 'hash_demo_005', 'emma.buyer@example.com', '+84900000005', '2026-01-05 09:00:00', 'active', 'buyer'),
  (6, 'seller_freshmart', 'hash_demo_006', 'freshmart@example.com', '+84900000006', '2026-01-06 09:00:00', 'active', 'seller'),
  (7, 'seller_techhub', 'hash_demo_007', 'techhub@example.com', '+84900000007', '2026-01-07 09:00:00', 'active', 'seller'),
  (8, 'seller_homeplus', 'hash_demo_008', 'homeplus@example.com', '+84900000008', '2026-01-08 09:00:00', 'active', 'seller'),
  (9, 'seller_stylebox', 'hash_demo_009', 'stylebox@example.com', '+84900000009', '2026-01-09 09:00:00', 'active', 'seller'),
  (10, 'seller_booknest', 'hash_demo_010', 'booknest@example.com', '+84900000010', '2026-01-10 09:00:00', 'active', 'seller'),
  (11, 'admin_lan', 'hash_demo_011', 'lan.admin@example.com', '+84900000011', '2026-01-11 09:00:00', 'active', 'administrator'),
  (12, 'admin_minh', 'hash_demo_012', 'minh.admin@example.com', '+84900000012', '2026-01-12 09:00:00', 'active', 'administrator'),
  (13, 'admin_ngoc', 'hash_demo_013', 'ngoc.admin@example.com', '+84900000013', '2026-01-13 09:00:00', 'active', 'administrator'),
  (14, 'admin_phuc', 'hash_demo_014', 'phuc.admin@example.com', '+84900000014', '2026-01-14 09:00:00', 'active', 'administrator'),
  (15, 'admin_quynh', 'hash_demo_015', 'quynh.admin@example.com', '+84900000015', '2026-01-15 09:00:00', 'active', 'administrator');

-- buyer: 5 rows
INSERT INTO `buyer` (`account_id`, `first_name`, `last_name`, `date_of_birth`, `gender`) VALUES
  (1, 'Anna', 'Tran', '1997-02-11', 'female'),
  (2, 'Binh', 'Nguyen', '1995-06-21', 'male'),
  (3, 'Chi', 'Le', '1999-08-14', 'female'),
  (4, 'Dung', 'Pham', '1993-12-03', 'male'),
  (5, 'Emma', 'Vo', '2000-04-25', 'female');

-- seller: 5 rows
INSERT INTO `seller` (`account_id`, `tax_id`, `business_type`, `owner_name`, `verification_status`, `product_management`) VALUES
  (6, 'TAX-FM-001', 'specialty grocery', 'Mai Hoang', 'verified', 'Coffee, pantry bundles, and fresh grocery promotions'),
  (7, 'TAX-TH-002', 'electronics retailer', 'Khoa Tran', 'verified', 'Mice, keyboards, adapters, and accessory stock control'),
  (8, 'TAX-HP-003', 'home workspace', 'Linh Do', 'verified', 'Lighting and ergonomic home-office goods'),
  (9, 'TAX-SB-004', 'fashion studio', 'Nhi Phan', 'pending', 'Apparel sizing, tote colorways, and seasonal fashion stock'),
  (10, 'TAX-BN-005', 'education bookseller', 'Son Vu', 'verified', 'Database books, ebooks, and academic learning resources');

-- administrator: 5 rows
INSERT INTO `administrator` (`account_id`, `employee_id`, `staff_name`, `management_role`, `working_status`) VALUES
  (11, 'EMP-001', 'Lan Nguyen', 'support lead', 'working'),
  (12, 'EMP-002', 'Minh Tran', 'returns specialist', 'working'),
  (13, 'EMP-003', 'Ngoc Le', 'payments analyst', 'working'),
  (14, 'EMP-004', 'Phuc Pham', 'seller operations', 'working'),
  (15, 'EMP-005', 'Quynh Vo', 'compliance officer', 'working');

-- notification: 8 rows
INSERT INTO `notification` (`notification_id`, `account_id`, `title`, `content`, `type`, `timestamp`, `status`) VALUES
  (1, 1, 'Refund approved', 'Your cold brew refund from order #1006 was approved.', 'return', '2026-03-09 10:15:00', 'read'),
  (2, 2, 'Voucher fully used', 'Your TECH5 voucher has now been used twice.', 'voucher', '2026-03-09 13:30:00', 'unread'),
  (3, 3, 'Return received', 'Home Plus received your cushion return request.', 'return', '2026-03-14 09:20:00', 'read'),
  (4, 4, 'Shipment update', 'Your Style Box order #1014 is in transit.', 'shipment', '2026-03-18 08:10:00', 'unread'),
  (5, 5, 'Book refund pending', 'Your Book Nest return request is pending warehouse inspection.', 'return', '2026-03-11 16:40:00', 'unread'),
  (6, 6, 'Fresh Mart sales update', 'Fresh Mart has multiple delivered March orders using FRESH10.', 'system', '2026-03-20 18:00:00', 'read'),
  (7, 7, 'Keyboard order paid', 'A paid order includes Mechanical Keyboard and USB-C hub variants.', 'order', '2026-03-13 10:00:00', 'read'),
  (8, 11, 'Return queue changed', 'Several requests now cover approved, rejected, pending, reviewing, and closed states.', 'system', '2026-03-18 17:30:00', 'unread');

-- category: 5 rows
INSERT INTO `category` (`category_id`, `category_name`, `description`) VALUES
  (1, 'Groceries', 'Food, drinks, and household essentials'),
  (2, 'Electronics', 'Devices and technology accessories'),
  (3, 'Home', 'Home goods and decor'),
  (4, 'Fashion', 'Clothing, shoes, and accessories'),
  (5, 'Books', 'Books and stationery');

-- store: 5 rows
INSERT INTO `store` (`store_id`, `seller_id`, `store_name`, `description`, `creation_date`, `phone_number`) VALUES
  (1, 6, 'Fresh Mart Market', 'Fresh groceries, coffee, pantry bundles, and ready-to-drink items.', '2026-01-20 08:00:00', '+84910000001'),
  (2, 7, 'Tech Hub Pro', 'Computer peripherals, keyboards, mice, and travel adapters.', '2026-01-21 08:00:00', '+84910000002'),
  (3, 8, 'Home Plus Living', 'Lighting, workspace comfort, and compact home upgrades.', '2026-01-22 08:00:00', '+84910000003'),
  (4, 9, 'Style Box Studio', 'Casual clothing, tote bags, and everyday accessories.', '2026-01-23 08:00:00', '+84910000004'),
  (5, 10, 'Book Nest Academy', 'Database books, study guides, and learning resources.', '2026-01-24 08:00:00', '+84910000005');

-- product: 12 rows
INSERT INTO `product` (`product_id`, `store_id`, `category_id`, `product_name`, `description`, `creation_time`) VALUES
  (1, 1, 1, 'Organic Arabica Coffee', 'Medium roast whole bean coffee for home brewing.', '2026-02-01 08:00:00'),
  (2, 2, 2, 'Wireless Mouse', 'Compact bluetooth mouse for office and study setups.', '2026-02-02 08:00:00'),
  (3, 3, 3, 'Adjustable Desk Lamp', 'LED desk lamp with brightness and warmth controls.', '2026-02-03 08:00:00'),
  (4, 4, 4, 'Canvas Tote Bag', 'Reusable cotton tote bag for daily shopping.', '2026-02-04 08:00:00'),
  (5, 5, 5, 'SQL Practice Workbook', 'Beginner-friendly database exercise book.', '2026-02-05 08:00:00'),
  (6, 1, 1, 'Fresh Breakfast Bundle', 'Oats, honey, and coffee bundle for weekly pantry restock.', '2026-02-06 08:00:00'),
  (7, 1, 1, 'Cold Brew Starter Pack', 'Ready-to-drink cold brew bottles for office fridges.', '2026-02-07 08:00:00'),
  (8, 2, 2, 'Mechanical Keyboard', 'Hot-swap compact mechanical keyboard.', '2026-02-08 08:00:00'),
  (9, 2, 2, 'USB-C Travel Hub', 'Portable multiport hub for laptops and tablets.', '2026-02-09 08:00:00'),
  (10, 3, 3, 'Ergonomic Chair Cushion', 'Memory foam cushion for long study sessions.', '2026-02-10 08:00:00'),
  (11, 4, 4, 'Linen Shirt', 'Breathable linen shirt in multiple sizes.', '2026-02-11 08:00:00'),
  (12, 5, 5, 'Data Modeling Handbook', 'Intermediate guide to ERD and relational modeling.', '2026-02-12 08:00:00');

-- product_variant: 24 rows
INSERT INTO `product_variant` (`variant_id`, `product_id`, `option_value`, `price`, `status`, `stock_quantity`, `creation_time`) VALUES
  (1, 1, '500g bag', 12.5, 'active', 120, '2026-02-01 09:00:00'),
  (2, 2, 'matte black', 18.9, 'active', 80, '2026-02-02 09:00:00'),
  (3, 3, 'warm white', 24, 'active', 45, '2026-02-03 09:00:00'),
  (4, 4, 'natural canvas', 9.75, 'active', 200, '2026-02-04 09:00:00'),
  (5, 5, 'paperback', 15, 'active', 60, '2026-02-05 09:00:00'),
  (6, 1, '1kg family bag', 22, 'active', 55, '2026-02-06 09:00:00'),
  (7, 6, 'oats honey coffee bundle', 18, 'active', 40, '2026-02-06 10:00:00'),
  (8, 7, '6 bottle pack', 16.5, 'active', 30, '2026-02-07 09:00:00'),
  (9, 2, 'silent white', 20.5, 'available', 65, '2026-02-07 10:00:00'),
  (10, 8, 'blue switch', 59, 'active', 25, '2026-02-08 09:00:00'),
  (11, 8, 'brown switch', 61, 'active', 18, '2026-02-08 10:00:00'),
  (12, 9, '6-in-1 aluminum', 34.9, 'active', 42, '2026-02-09 09:00:00'),
  (13, 3, 'matte black', 24, 'active', 38, '2026-02-09 10:00:00'),
  (14, 10, 'grey memory foam', 29.5, 'active', 22, '2026-02-10 09:00:00'),
  (15, 4, 'black canvas', 10.5, 'active', 150, '2026-02-10 10:00:00'),
  (16, 11, 'linen shirt small', 28, 'active', 35, '2026-02-11 09:00:00'),
  (17, 11, 'linen shirt medium', 28, 'active', 30, '2026-02-11 10:00:00'),
  (18, 5, 'ebook license', 9, 'active', 999, '2026-02-12 09:00:00'),
  (19, 12, 'paperback', 32, 'active', 40, '2026-02-12 10:00:00'),
  (20, 12, 'hardcover', 45, 'active', 20, '2026-02-12 11:00:00'),
  (21, 7, '12 bottle office case', 30, 'out_of_stock', 0, '2026-02-13 09:00:00'),
  (22, 9, '9-in-1 pro discontinued', 49, 'discontinued', 0, '2026-02-13 10:00:00'),
  (23, 10, 'navy mesh', 27.5, 'out_of_stock', 0, '2026-02-13 11:00:00'),
  (24, 11, 'linen shirt large', 28, 'available', 28, '2026-02-13 12:00:00');

-- address: 5 rows
INSERT INTO `address` (`address_id`, `street`, `ward`, `district`, `city`, `country`) VALUES
  (1, '12 Nguyen Hue', 'Ben Nghe', 'District 1', 'Ho Chi Minh City', 'Vietnam'),
  (2, '44 Le Loi', 'Ben Thanh', 'District 1', 'Ho Chi Minh City', 'Vietnam'),
  (3, '88 Tran Phu', 'Ward 4', 'District 5', 'Ho Chi Minh City', 'Vietnam'),
  (4, '19 Vo Van Tan', 'Ward 6', 'District 3', 'Ho Chi Minh City', 'Vietnam'),
  (5, '72 Ly Thuong Kiet', 'Ward 14', 'District 10', 'Ho Chi Minh City', 'Vietnam');

-- buyer_address: 5 rows
INSERT INTO `buyer_address` (`buyer_address_id`, `buyer_id`, `address_id`, `recipient_name`, `recipient_phone`, `is_default`) VALUES
  (1, 1, 1, 'Anna Tran', '+84920000001', 1),
  (2, 2, 1, 'Binh Nguyen', '+84920000002', 1),
  (3, 3, 3, 'Chi Le', '+84920000003', 1),
  (4, 4, 4, 'Dung Pham', '+84920000004', 1),
  (5, 5, 5, 'Emma Vo', '+84920000005', 1);

-- cart: 5 rows
INSERT INTO `cart` (`cart_id`, `buyer_id`) VALUES
  (1, 1),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);

-- cart_item: 10 rows
INSERT INTO `cart_item` (`cart_id`, `variant_id`, `quantity`, `unit_price`, `time_added`) VALUES
  (1, 10, 1, 59, '2026-03-23 11:00:00'),
  (1, 19, 1, 32, '2026-03-23 11:05:00'),
  (2, 1, 2, 12.5, '2026-03-23 12:00:00'),
  (2, 8, 1, 16.5, '2026-03-23 12:08:00'),
  (3, 4, 2, 9.75, '2026-03-23 13:12:00'),
  (3, 12, 1, 34.9, '2026-03-23 13:00:00'),
  (4, 14, 1, 29.5, '2026-03-23 14:00:00'),
  (4, 20, 1, 45, '2026-03-23 14:20:00'),
  (5, 2, 1, 18.9, '2026-03-23 15:00:00'),
  (5, 15, 2, 10.5, '2026-03-23 15:09:00');

-- voucher: 7 rows
INSERT INTO `voucher` (`voucher_code`, `store_id`, `discount_type`, `discount_value`, `global_usage_limit`, `applicable_conditions`, `start_date`, `end_date`) VALUES
  ('BIGCART12', 1, 'fixed_amount', 12, 150, 'Fixed 12 off marketplace baskets over 80.', '2026-02-01', '2026-12-31'),
  ('BOOK20', 5, 'percentage', 20, 200, 'Book category discount for orders over 25.', '2026-02-01', '2026-12-31'),
  ('FRESH10', 1, 'percentage', 10, 500, 'Grocery voucher for baskets over 40.', '2026-02-01', '2026-12-31'),
  ('HOME15', 3, 'percentage', 15, 250, 'Home category voucher for orders over 50.', '2026-02-01', '2026-12-31'),
  ('READMORE', 5, 'fixed_amount', 10, 120, 'Fixed discount for larger book baskets.', '2026-02-01', '2026-12-31'),
  ('STYLE8', 4, 'fixed_amount', 8, 400, 'Style category voucher for fashion orders over 30.', '2026-02-01', '2026-12-31'),
  ('TECH5', 2, 'fixed_amount', 5, 300, 'Electronics category discount.', '2026-02-01', '2026-12-31');

-- voucher_condition: 12 rows
INSERT INTO `voucher_condition` (`condition_id`, `voucher_code`, `condition_type`, `operator`, `value`) VALUES
  (1, 'FRESH10', 'minimum_order_amount', '>=', '40'),
  (2, 'FRESH10', 'category_id', '=', '1'),
  (3, 'TECH5', 'category_id', '=', '2'),
  (4, 'HOME15', 'category_id', '=', '3'),
  (5, 'HOME15', 'minimum_order_amount', '>=', '50'),
  (6, 'STYLE8', 'category_id', '=', '4'),
  (7, 'STYLE8', 'minimum_order_amount', '>=', '30'),
  (8, 'BOOK20', 'category_id', '=', '5'),
  (9, 'BOOK20', 'minimum_order_amount', '>=', '25'),
  (10, 'BIGCART12', 'minimum_order_amount', '>=', '80'),
  (11, 'READMORE', 'category_id', '=', '5'),
  (12, 'READMORE', 'minimum_order_amount', '>=', '50');

-- buyer_voucher: 10 rows
INSERT INTO `buyer_voucher` (`buyer_voucher_id`, `buyer_id`, `voucher_code`, `amount`, `usage_count`) VALUES
  (1, 1, 'FRESH10', 3, 2),
  (2, 2, 'TECH5', 2, 2),
  (3, 3, 'HOME15', 1, 1),
  (4, 4, 'STYLE8', 2, 2),
  (5, 5, 'BOOK20', 3, 2),
  (6, 3, 'FRESH10', 1, 1),
  (7, 5, 'TECH5', 1, 1),
  (8, 1, 'BIGCART12', 1, 1),
  (9, 5, 'READMORE', 1, 0),
  (10, 2, 'FRESH10', 1, 0);

-- order: 17 rows
INSERT INTO `order` (`order_id`, `buyer_id`, `buyer_address_id`, `buyer_voucher_id`, `order_date`, `order_status`) VALUES
  (1001, 1, 1, 1, '2026-03-01 10:15:00', 'delivered'),
  (1002, 2, 2, 2, '2026-03-02 11:20:00', 'delivered'),
  (1003, 3, 3, NULL, '2026-03-03 14:05:00', 'shipped'),
  (1004, 4, 4, 4, '2026-03-04 15:45:00', 'delivered'),
  (1005, 5, 5, 5, '2026-03-05 09:35:00', 'return_requested'),
  (1006, 1, 1, 1, '2026-03-08 08:40:00', 'delivered'),
  (1007, 2, 2, 2, '2026-03-09 13:10:00', 'paid'),
  (1008, 3, 3, 3, '2026-03-10 16:00:00', 'delivered'),
  (1009, 4, 4, NULL, '2026-03-11 12:25:00', 'cancelled'),
  (1010, 5, 5, 5, '2026-03-12 18:30:00', 'delivered'),
  (1011, 1, 1, NULL, '2026-03-13 09:55:00', 'processing'),
  (1012, 2, 2, NULL, '2026-03-14 10:10:00', 'delivered'),
  (1013, 3, 3, 6, '2026-03-16 11:05:00', 'delivered'),
  (1014, 4, 4, 4, '2026-03-17 13:45:00', 'shipped'),
  (1015, 5, 5, 7, '2026-03-18 14:20:00', 'delivered'),
  (1016, 1, 1, 8, '2026-03-20 10:35:00', 'delivered'),
  (1017, 2, 2, NULL, '2026-03-22 09:15:00', 'delivered');

-- order_item: 47 rows
INSERT INTO `order_item` (`order_id`, `variant_id`, `quantity`, `unit_price`) VALUES
  (1001, 1, 2, 12.5),
  (1001, 2, 1, 18.9),
  (1001, 7, 1, 18),
  (1002, 2, 2, 18.9),
  (1002, 10, 1, 59),
  (1002, 12, 1, 34.9),
  (1003, 3, 1, 24),
  (1003, 4, 2, 9.75),
  (1004, 5, 1, 15),
  (1004, 15, 1, 10.5),
  (1004, 16, 2, 28),
  (1005, 6, 1, 22),
  (1005, 19, 1, 32),
  (1005, 20, 1, 45),
  (1006, 1, 1, 12.5),
  (1006, 7, 1, 18),
  (1006, 8, 1, 16.5),
  (1007, 9, 1, 20.5),
  (1007, 11, 1, 61),
  (1007, 12, 2, 34.9),
  (1008, 3, 1, 24),
  (1008, 13, 1, 24),
  (1008, 14, 1, 29.5),
  (1009, 4, 1, 9.75),
  (1009, 17, 1, 28),
  (1010, 5, 2, 15),
  (1010, 18, 1, 9),
  (1010, 19, 1, 32),
  (1011, 10, 1, 59),
  (1011, 12, 1, 34.9),
  (1012, 1, 1, 12.5),
  (1012, 6, 1, 22),
  (1012, 15, 2, 10.5),
  (1013, 1, 3, 12.5),
  (1013, 8, 1, 16.5),
  (1014, 4, 1, 9.75),
  (1014, 16, 1, 28),
  (1014, 24, 1, 28),
  (1015, 2, 1, 18.9),
  (1015, 12, 1, 34.9),
  (1015, 20, 1, 45),
  (1016, 10, 1, 59),
  (1016, 14, 1, 29.5),
  (1016, 19, 1, 32),
  (1017, 1, 1, 12.5),
  (1017, 2, 1, 18.9),
  (1017, 5, 1, 15);

-- shipment: 17 rows
INSERT INTO `shipment` (`shipment_id`, `order_id`, `buyer_address_id`, `tracking_code`, `shipping_method`, `shipping_status`, `estimated_delivery_date`, `actual_delivery_date`) VALUES
  (7001, 1001, 1, 'TRK-1001-FM', 'standard', 'delivered', '2026-03-04', '2026-03-03'),
  (7002, 1002, 2, 'TRK-1002-TH', 'express', 'delivered', '2026-03-05', '2026-03-04'),
  (7003, 1003, 3, 'TRK-1003-MIX', 'standard', 'in_transit', '2026-03-07', NULL),
  (7004, 1004, 4, 'TRK-1004-SB', 'standard', 'delivered', '2026-03-08', '2026-03-07'),
  (7005, 1005, 5, 'TRK-1005-BN', 'express', 'returned', '2026-03-09', '2026-03-10'),
  (7006, 1006, 1, 'TRK-1006-FM', 'same_day', 'delivered', '2026-03-08', '2026-03-08'),
  (7007, 1007, 2, 'TRK-1007-TH', 'standard', 'processing', '2026-03-14', NULL),
  (7008, 1008, 3, 'TRK-1008-HP', 'express', 'delivered', '2026-03-13', '2026-03-12'),
  (7009, 1009, 4, 'TRK-1009-CAN', 'standard', 'cancelled', '2026-03-15', NULL),
  (7010, 1010, 5, 'TRK-1010-BN', 'standard', 'delivered', '2026-03-16', '2026-03-15'),
  (7011, 1011, 1, 'TRK-1011-TH', 'express', 'processing', '2026-03-18', NULL),
  (7012, 1012, 2, 'TRK-1012-MIX', 'standard', 'delivered', '2026-03-18', '2026-03-17'),
  (7013, 1013, 3, 'TRK-1013-FM', 'standard', 'delivered', '2026-03-20', '2026-03-19'),
  (7014, 1014, 4, 'TRK-1014-SB', 'express', 'in_transit', '2026-03-21', NULL),
  (7015, 1015, 5, 'TRK-1015-MIX', 'standard', 'delivered', '2026-03-23', '2026-03-22'),
  (7016, 1016, 1, 'TRK-1016-BIG', 'express', 'delivered', '2026-03-24', '2026-03-24'),
  (7017, 1017, 2, 'TRK-1017-MIX', 'standard', 'delivered', '2026-03-26', '2026-03-25');

-- payment: 17 rows
INSERT INTO `payment` (`payment_id`, `order_id`, `payment_method`, `payment_time`, `payment_status`, `paid_amount`) VALUES
  (5001, 1001, 'e_wallet', '2026-03-01 10:17:00', 'paid', 55.71),
  (5002, 1002, 'credit_card', '2026-03-02 11:22:00', 'paid', 126.7),
  (5003, 1003, 'bank_transfer', '2026-03-03 14:20:00', 'paid', 43.5),
  (5004, 1004, 'e_wallet', '2026-03-04 15:47:00', 'paid', 73.5),
  (5005, 1005, 'credit_card', '2026-03-05 09:40:00', 'paid', 79.2),
  (5006, 1006, 'e_wallet', '2026-03-08 08:42:00', 'paid', 42.3),
  (5007, 1007, 'bank_transfer', '2026-03-09 13:15:00', 'paid', 146.3),
  (5008, 1008, 'credit_card', '2026-03-10 16:02:00', 'paid', 65.88),
  (5009, 1009, 'cash_on_delivery', '2026-03-11 12:26:00', 'cancelled', 0),
  (5010, 1010, 'e_wallet', '2026-03-12 18:33:00', 'paid', 56.8),
  (5011, 1011, 'credit_card', '2026-03-13 09:57:00', 'paid', 93.9),
  (5012, 1012, 'cash_on_delivery', '2026-03-14 10:12:00', 'paid', 55.5),
  (5013, 1013, 'e_wallet', '2026-03-16 11:08:00', 'paid', 48.6),
  (5014, 1014, 'bank_transfer', '2026-03-17 13:49:00', 'paid', 57.75),
  (5015, 1015, 'credit_card', '2026-03-18 14:23:00', 'paid', 93.8),
  (5016, 1016, 'e_wallet', '2026-03-20 10:39:00', 'paid', 108.5),
  (5017, 1017, 'cash_on_delivery', '2026-03-22 09:17:00', 'paid', 46.4);

-- review: 12 rows
INSERT INTO `review` (`review_id`, `buyer_id`, `order_id`, `variant_id`, `content`, `rating_score`, `review_date`) VALUES
  (9001, 1, 1001, 1, 'Coffee arrived fresh and the aroma was strong.', 5, '2026-03-04'),
  (9002, 1, 1001, 2, 'Mouse paired quickly and feels light.', 4, '2026-03-04'),
  (9003, 2, 1002, 10, 'Keyboard is responsive, though the blue switches are loud.', 3, '2026-03-05'),
  (9004, 4, 1004, 16, 'The linen shirt fabric feels much better than expected.', 5, '2026-03-08'),
  (9005, 1, 1006, 7, 'Breakfast bundle is convenient for weekday mornings.', 5, '2026-03-09'),
  (9006, 3, 1008, 3, 'Desk lamp is bright and easy to adjust.', 4, '2026-03-13'),
  (9007, 5, 1010, 19, 'The handbook examples are useful for ERD practice.', 5, '2026-03-16'),
  (9008, 2, 1012, 15, 'Black tote looks clean and holds groceries well.', 4, '2026-03-18'),
  (9009, 3, 1013, 1, 'Third bag of this coffee and still consistent.', 5, '2026-03-20'),
  (9010, 5, 1015, 20, 'Hardcover is sturdy and good for team reference.', 4, '2026-03-23'),
  (9011, 1, 1016, 14, 'Cushion helped posture but the shape is a bit narrow.', 3, '2026-03-25'),
  (9012, 2, 1017, 5, 'Workbook exercises match our class topics well.', 5, '2026-03-26');

-- review_media: 7 rows
INSERT INTO `review_media` (`review_id`, `media_url`) VALUES
  (9001, 'https://example.com/reviews/9001-coffee.jpg'),
  (9003, 'https://example.com/reviews/9003-keyboard.mp4'),
  (9004, 'https://example.com/reviews/9004-shirt.jpg'),
  (9006, 'https://example.com/reviews/9006-lamp.jpg'),
  (9007, 'https://example.com/reviews/9007-handbook.jpg'),
  (9010, 'https://example.com/reviews/9010-hardcover.jpg'),
  (9011, 'https://example.com/reviews/9011-cushion.jpg');

-- return_request: 6 rows
INSERT INTO `return_request` (`request_id`, `buyer_id`, `admin_id`, `order_id`, `variant_id`, `request_date`, `reason`, `request_status`, `requested_refund_amount`, `handling_result`) VALUES
  (3001, 3, 12, 1008, 14, '2026-03-14', 'Chair cushion foam collapsed after two days.', 'approved', 29.5, 'Refund approved and item removed from actual revenue.'),
  (3002, 5, 12, 1005, 19, '2026-03-11', 'Book corners were damaged during return shipment.', 'pending', 32, 'Waiting for warehouse inspection.'),
  (3003, 2, 11, 1002, 10, '2026-03-06', 'Keyboard switch sound was louder than expected.', 'rejected', 59, 'Rejected because blue switch noise was disclosed in listing.'),
  (3004, 1, 13, 1006, 8, '2026-03-09', 'One cold brew bottle leaked in the pack.', 'approved', 16.5, 'Refund approved for leaked bottle pack.'),
  (3005, 4, 12, 1004, 16, '2026-03-09', 'Requested size exchange for linen shirt.', 'closed', 0, 'Exchange completed without refund.'),
  (3006, 5, 14, 1010, 18, '2026-03-18', 'Ebook activation code appeared redeemed.', 'reviewing', 9, 'Support is checking license activation logs.');
