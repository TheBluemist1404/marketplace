# Section 1 Table Schemas

Generated from the live `marketplace_eerd` MySQL database after the enum-domain conversion, the `orders` to `` `order` `` table rename, and the `AUTO_INCREMENT` surrogate-key update.

Note: `` `order` `` is quoted because `ORDER` is a MySQL keyword.

## `address`

```sql
CREATE TABLE `address` (
  `address_id` bigint NOT NULL AUTO_INCREMENT,
  `street` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ward` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `administrator`

```sql
CREATE TABLE `administrator` (
  `account_id` bigint NOT NULL,
  `employee_id` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `staff_name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `management_role` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `working_status` enum('working','on_leave','inactive','terminated') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  CONSTRAINT `fk_administrator_account` FOREIGN KEY (`account_id`) REFERENCES `user_account` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `buyer`

```sql
CREATE TABLE `buyer` (
  `account_id` bigint NOT NULL,
  `first_name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other','prefer_not_to_say') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`account_id`),
  CONSTRAINT `fk_buyer_account` FOREIGN KEY (`account_id`) REFERENCES `user_account` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `buyer_address`

```sql
CREATE TABLE `buyer_address` (
  `buyer_address_id` bigint NOT NULL AUTO_INCREMENT,
  `buyer_id` bigint NOT NULL,
  `address_id` bigint NOT NULL,
  `recipient_name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_phone` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `default_buyer_id` bigint GENERATED ALWAYS AS ((case when `is_default` then `buyer_id` else NULL end)) STORED,
  PRIMARY KEY (`buyer_address_id`),
  UNIQUE KEY `uq_buyer_address_recipient` (`buyer_id`,`address_id`,`recipient_name`,`recipient_phone`),
  UNIQUE KEY `uq_buyer_default_address` (`default_buyer_id`),
  KEY `idx_buyer_address_buyer` (`buyer_id`),
  KEY `idx_buyer_address_address` (`address_id`),
  CONSTRAINT `fk_buyer_address_address` FOREIGN KEY (`address_id`) REFERENCES `address` (`address_id`),
  CONSTRAINT `fk_buyer_address_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `buyer` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `buyer_voucher`

```sql
CREATE TABLE `buyer_voucher` (
  `buyer_voucher_id` bigint NOT NULL AUTO_INCREMENT,
  `buyer_id` bigint NOT NULL,
  `voucher_code` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL DEFAULT '1',
  `usage_count` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`buyer_voucher_id`),
  UNIQUE KEY `uq_buyer_voucher` (`buyer_id`,`voucher_code`),
  KEY `idx_buyer_voucher_buyer` (`buyer_id`),
  KEY `idx_buyer_voucher_voucher` (`voucher_code`),
  CONSTRAINT `fk_buyer_voucher_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `buyer` (`account_id`),
  CONSTRAINT `fk_buyer_voucher_voucher` FOREIGN KEY (`voucher_code`) REFERENCES `voucher` (`voucher_code`),
  CONSTRAINT `buyer_voucher_chk_1` CHECK ((`amount` >= 0)),
  CONSTRAINT `buyer_voucher_chk_2` CHECK ((`usage_count` >= 0)),
  CONSTRAINT `chk_buyer_voucher_usage` CHECK ((`usage_count` <= `amount`))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `cart`

```sql
CREATE TABLE `cart` (
  `cart_id` bigint NOT NULL AUTO_INCREMENT,
  `buyer_id` bigint NOT NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `buyer_id` (`buyer_id`),
  CONSTRAINT `fk_cart_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `buyer` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `cart_item`

```sql
CREATE TABLE `cart_item` (
  `cart_id` bigint NOT NULL,
  `variant_id` bigint NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `time_added` datetime NOT NULL,
  PRIMARY KEY (`cart_id`,`variant_id`),
  KEY `idx_cart_item_variant` (`variant_id`),
  CONSTRAINT `fk_cart_item_cart` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`),
  CONSTRAINT `fk_cart_item_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variant` (`variant_id`),
  CONSTRAINT `cart_item_chk_1` CHECK ((`quantity` > 0)),
  CONSTRAINT `cart_item_chk_2` CHECK ((`unit_price` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `category`

```sql
CREATE TABLE `category` (
  `category_id` bigint NOT NULL AUTO_INCREMENT,
  `category_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `notification`

```sql
CREATE TABLE `notification` (
  `notification_id` bigint NOT NULL AUTO_INCREMENT,
  `account_id` bigint NOT NULL,
  `title` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('order','voucher','shipment','payment','return','system','promotion') COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime NOT NULL,
  `status` enum('read','unread','archived') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `idx_notification_account` (`account_id`),
  CONSTRAINT `fk_notification_account` FOREIGN KEY (`account_id`) REFERENCES `user_account` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `order`

```sql
CREATE TABLE `order` (
  `order_id` bigint NOT NULL AUTO_INCREMENT,
  `buyer_id` bigint NOT NULL,
  `buyer_address_id` bigint NOT NULL,
  `buyer_voucher_id` bigint DEFAULT NULL,
  `order_date` datetime NOT NULL,
  `order_status` enum('pending','paid','processing','shipped','delivered','cancelled','return_requested') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `idx_orders_buyer` (`buyer_id`),
  KEY `idx_orders_buyer_address` (`buyer_address_id`),
  KEY `idx_orders_buyer_voucher` (`buyer_voucher_id`),
  CONSTRAINT `fk_orders_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `buyer` (`account_id`),
  CONSTRAINT `fk_orders_buyer_address` FOREIGN KEY (`buyer_address_id`) REFERENCES `buyer_address` (`buyer_address_id`),
  CONSTRAINT `fk_orders_buyer_voucher` FOREIGN KEY (`buyer_voucher_id`) REFERENCES `buyer_voucher` (`buyer_voucher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1018 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `order_item`

```sql
CREATE TABLE `order_item` (
  `order_id` bigint NOT NULL,
  `variant_id` bigint NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  PRIMARY KEY (`order_id`,`variant_id`),
  KEY `idx_order_item_variant` (`variant_id`),
  CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`),
  CONSTRAINT `fk_order_item_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variant` (`variant_id`),
  CONSTRAINT `order_item_chk_1` CHECK ((`quantity` > 0)),
  CONSTRAINT `order_item_chk_2` CHECK ((`unit_price` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `payment`

```sql
CREATE TABLE `payment` (
  `payment_id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `payment_method` enum('e_wallet','credit_card','bank_transfer','cash_on_delivery') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_time` datetime NOT NULL,
  `payment_status` enum('pending','paid','failed','refunded','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL,
  `paid_amount` decimal(12,2) NOT NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `order_id` (`order_id`),
  CONSTRAINT `fk_payment_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`),
  CONSTRAINT `payment_chk_1` CHECK ((`paid_amount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=5018 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `product`

```sql
CREATE TABLE `product` (
  `product_id` bigint NOT NULL AUTO_INCREMENT,
  `store_id` bigint NOT NULL,
  `category_id` bigint NOT NULL,
  `product_name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `creation_time` datetime NOT NULL,
  PRIMARY KEY (`product_id`),
  KEY `idx_product_store` (`store_id`),
  KEY `idx_product_category` (`category_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  CONSTRAINT `fk_product_store` FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `product_variant`

```sql
CREATE TABLE `product_variant` (
  `variant_id` bigint NOT NULL AUTO_INCREMENT,
  `product_id` bigint NOT NULL,
  `option_value` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `status` enum('active','available','out_of_stock','discontinued') COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock_quantity` int NOT NULL,
  `creation_time` datetime NOT NULL,
  PRIMARY KEY (`variant_id`),
  UNIQUE KEY `uq_product_variant_option` (`product_id`,`option_value`),
  KEY `idx_variant_product` (`product_id`),
  CONSTRAINT `fk_variant_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `product_variant_chk_1` CHECK ((`price` >= 0)),
  CONSTRAINT `product_variant_chk_2` CHECK ((`stock_quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `return_request`

```sql
CREATE TABLE `return_request` (
  `request_id` bigint NOT NULL AUTO_INCREMENT,
  `buyer_id` bigint NOT NULL,
  `admin_id` bigint DEFAULT NULL,
  `order_id` bigint NOT NULL,
  `variant_id` bigint NOT NULL,
  `request_date` date NOT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `request_status` enum('pending','reviewing','approved','rejected','closed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `requested_refund_amount` decimal(12,2) NOT NULL,
  `handling_result` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`request_id`),
  KEY `idx_return_buyer` (`buyer_id`),
  KEY `idx_return_admin` (`admin_id`),
  KEY `idx_return_order_item` (`order_id`,`variant_id`),
  CONSTRAINT `fk_return_admin` FOREIGN KEY (`admin_id`) REFERENCES `administrator` (`account_id`),
  CONSTRAINT `fk_return_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `buyer` (`account_id`),
  CONSTRAINT `fk_return_order_item` FOREIGN KEY (`order_id`, `variant_id`) REFERENCES `order_item` (`order_id`, `variant_id`),
  CONSTRAINT `return_request_chk_1` CHECK ((`requested_refund_amount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=3007 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `review`

```sql
CREATE TABLE `review` (
  `review_id` bigint NOT NULL AUTO_INCREMENT,
  `buyer_id` bigint NOT NULL,
  `order_id` bigint NOT NULL,
  `variant_id` bigint NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating_score` int NOT NULL,
  `review_date` date NOT NULL,
  PRIMARY KEY (`review_id`),
  UNIQUE KEY `uq_buyer_order_variant_review` (`buyer_id`,`order_id`,`variant_id`),
  KEY `idx_review_buyer` (`buyer_id`),
  KEY `idx_review_order_item` (`order_id`,`variant_id`),
  CONSTRAINT `fk_review_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `buyer` (`account_id`),
  CONSTRAINT `fk_review_order_item` FOREIGN KEY (`order_id`, `variant_id`) REFERENCES `order_item` (`order_id`, `variant_id`),
  CONSTRAINT `review_chk_1` CHECK ((`rating_score` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=9013 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `review_media`

```sql
CREATE TABLE `review_media` (
  `review_id` bigint NOT NULL,
  `media_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`review_id`,`media_url`),
  CONSTRAINT `fk_review_media_review` FOREIGN KEY (`review_id`) REFERENCES `review` (`review_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `seller`

```sql
CREATE TABLE `seller` (
  `account_id` bigint NOT NULL,
  `tax_id` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `business_type` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `owner_name` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verification_status` enum('pending','verified','rejected','suspended') COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_management` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `tax_id` (`tax_id`),
  CONSTRAINT `fk_seller_account` FOREIGN KEY (`account_id`) REFERENCES `user_account` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `shipment`

```sql
CREATE TABLE `shipment` (
  `shipment_id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `buyer_address_id` bigint NOT NULL,
  `tracking_code` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_method` enum('standard','express','same_day','pickup') COLLATE utf8mb4_unicode_ci NOT NULL,
  `shipping_status` enum('processing','in_transit','delivered','failed','returned','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL,
  `estimated_delivery_date` date DEFAULT NULL,
  `actual_delivery_date` date DEFAULT NULL,
  PRIMARY KEY (`shipment_id`),
  UNIQUE KEY `order_id` (`order_id`),
  UNIQUE KEY `tracking_code` (`tracking_code`),
  KEY `idx_shipment_address` (`buyer_address_id`),
  CONSTRAINT `fk_shipment_buyer_address` FOREIGN KEY (`buyer_address_id`) REFERENCES `buyer_address` (`buyer_address_id`),
  CONSTRAINT `fk_shipment_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7018 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `store`

```sql
CREATE TABLE `store` (
  `store_id` bigint NOT NULL AUTO_INCREMENT,
  `seller_id` bigint NOT NULL,
  `store_name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `creation_date` datetime NOT NULL,
  `phone_number` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`store_id`),
  KEY `idx_store_seller` (`seller_id`),
  CONSTRAINT `fk_store_seller` FOREIGN KEY (`seller_id`) REFERENCES `seller` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `user_account`

```sql
CREATE TABLE `user_account` (
  `account_id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creation_date` datetime NOT NULL,
  `account_status` enum('active','inactive','suspended','locked','pending') COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_type` enum('buyer','seller','administrator') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `voucher`

```sql
CREATE TABLE `voucher` (
  `voucher_code` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `store_id` bigint NOT NULL,
  `discount_type` enum('percentage','fixed_amount') COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` decimal(12,2) NOT NULL,
  `global_usage_limit` int DEFAULT NULL,
  `applicable_conditions` text COLLATE utf8mb4_unicode_ci,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  PRIMARY KEY (`voucher_code`),
  KEY `idx_voucher_store` (`store_id`),
  CONSTRAINT `fk_voucher_store` FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`),
  CONSTRAINT `chk_voucher_dates` CHECK ((`end_date` >= `start_date`)),
  CONSTRAINT `voucher_chk_1` CHECK ((`discount_value` >= 0)),
  CONSTRAINT `voucher_chk_2` CHECK (((`global_usage_limit` is null) or (`global_usage_limit` >= 0)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## `voucher_condition`

```sql
CREATE TABLE `voucher_condition` (
  `condition_id` bigint NOT NULL AUTO_INCREMENT,
  `voucher_code` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `condition_type` enum('minimum_order_amount','category_id') COLLATE utf8mb4_unicode_ci NOT NULL,
  `operator` enum('=','>','>=','<','<=','!=') COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`condition_id`),
  KEY `idx_voucher_condition_voucher` (`voucher_code`),
  CONSTRAINT `fk_condition_voucher` FOREIGN KEY (`voucher_code`) REFERENCES `voucher` (`voucher_code`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
