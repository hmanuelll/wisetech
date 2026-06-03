-- PostgreSQL version of the WISE-TECH database schema
-- Run this in the Aiven web console

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  specs JSONB DEFAULT NULL,
  image VARCHAR(255) DEFAULT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','PROCESSING','DELIVERED','CANCELLED')),
  address TEXT NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT INTO products (name, brand, price, description, specs, image, stock) VALUES
('HP ZBook 15 G6', 'HP', 12500.00, 'A powerful mobile workstation designed for heavy workloads, rendering, and professional use.', '{"CPU": "i7-9850H", "RAM": "32GB", "GPU": "Quadro T1000", "Storage": "1TB SSD", "Display": "15.6\""}', '/images/zbook.jpg', 5),
('HP Victus 15', 'HP', 18000.00, 'Experience high-end gaming with the HP Victus. Packed with a dedicated GPU and high refresh rate screen.', '{"CPU": "Ryzen 5", "RAM": "16GB", "GPU": "RTX 4050", "Storage": "512GB SSD", "Display": "15.6\" 144Hz"}', '/images/victus.jpg', 12),
('Lenovo LOQ', 'Lenovo', 19500.00, 'Affordable gaming without compromise. The Lenovo LOQ series is built for modern gamers.', '{"CPU": "Ryzen 7", "RAM": "16GB", "GPU": "RTX 4060", "Storage": "1TB SSD", "Display": "15.6\" 144Hz"}', '/images/loq.jpg', 8),
('Lenovo ThinkPad T14', 'Lenovo', 10000.00, 'The legendary business laptop. Unmatched keyboard, durable build, and all-day battery life.', '{"CPU": "i5-1135G7", "RAM": "16GB", "GPU": "Intel Iris Xe", "Storage": "512GB SSD", "Display": "14\""}', '/images/thinkpad.jpg', 20),
('Dell Precision 3560', 'Dell', 14000.00, 'Entry-level workstation for CAD professionals and engineering students.', '{"CPU": "i7-1165G7", "RAM": "32GB", "GPU": "Quadro T500", "Storage": "512GB SSD", "Display": "15.6\""}', '/images/precision.jpg', 4);
