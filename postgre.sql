-- Tạo database
CREATE DATABASE smartshipd;


-- Tạo bảng Users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'USER', 'DRIVER')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Drivers
CREATE TABLE drivers (
    driver_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('AVAILABLE', 'BUSY', 'OFFLINE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Orders
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES users(user_id),
    product_details JSONB NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PROCESSING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
    assigned_driver_id INT REFERENCES drivers(driver_id),
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    expected_delivery_date DATE,
    delivery_cost DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Notifications
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    recipient_id INT NOT NULL REFERENCES users(user_id),
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng Reports
CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    report_type VARCHAR(50) NOT NULL,
    report_data JSONB NOT NULL,
    created_by INT REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo các index để tối ưu truy vấn
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_driver_id ON orders(assigned_driver_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
