CREATE DATABASE IF NOT EXISTS wisetech;
USE wisetech;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('USER','ADMIN') DEFAULT 'USER',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `products`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text NOT NULL,
  `specs` json DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `orders`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('PENDING','PROCESSING','DELIVERED','CANCELLED') DEFAULT 'PENDING',
  `address` text NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `order_items`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `reviews`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Dumping data for table `products` (Mock Laptops)
-- --------------------------------------------------------
INSERT INTO `products` (`name`, `brand`, `price`, `description`, `specs`, `image`, `stock`) VALUES
('HP ZBook 15 G6', 'HP', 12500.00, 'A powerful mobile workstation designed for heavy workloads, rendering, and professional use.', '{"CPU": "i7-9850H", "RAM": "32GB", "GPU": "Quadro T1000", "Storage": "1TB SSD", "Display": "15.6\\""}', '/images/zbook.jpg', 5),
('HP Victus 15', 'HP', 18000.00, 'Experience high-end gaming with the HP Victus. Packed with a dedicated GPU and high refresh rate screen.', '{"CPU": "Ryzen 5", "RAM": "16GB", "GPU": "RTX 4050", "Storage": "512GB SSD", "Display": "15.6\\" 144Hz"}', '/images/victus.jpg', 12),
('Lenovo LOQ', 'Lenovo', 19500.00, 'Affordable gaming without compromise. The Lenovo LOQ series is built for modern gamers.', '{"CPU": "Ryzen 7", "RAM": "16GB", "GPU": "RTX 4060", "Storage": "1TB SSD", "Display": "15.6\\" 144Hz"}', '/images/loq.jpg', 8),
('Lenovo ThinkPad T14', 'Lenovo', 10000.00, 'The legendary business laptop. Unmatched keyboard, durable build, and all-day battery life.', '{"CPU": "i5-1135G7", "RAM": "16GB", "GPU": "Intel Iris Xe", "Storage": "512GB SSD", "Display": "14\\""}', '/images/thinkpad.jpg', 20),
('Dell Precision 3560', 'Dell', 14000.00, 'Entry-level workstation for CAD professionals and engineering students.', '{"CPU": "i7-1165G7", "RAM": "32GB", "GPU": "Quadro T500", "Storage": "512GB SSD", "Display": "15.6\\""}', '/images/precision.jpg', 4);
