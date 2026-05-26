-- DROP existing tables in reverse order of dependencies to avoid errors
DROP TABLE IF EXISTS reminders CASCADE;
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS savings_goals CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NULL,
    avatar_url VARCHAR(255) NULL,
    bio TEXT NULL,
    currency VARCHAR(255) DEFAULT 'USD',
    language VARCHAR(255) DEFAULT 'en',
    theme VARCHAR(255) DEFAULT 'light',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATEGORIES Table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255) NULL,
    color VARCHAR(255) NULL,
    type VARCHAR(50) DEFAULT 'expense' CHECK (type IN ('income', 'expense')),
    budget_limit DECIMAL(12, 2) NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TRANSACTIONS Table
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(12, 2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    receipt_url VARCHAR(255) NULL,
    tags JSON NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date);

-- 4. SAVINGS_GOALS Table
CREATE TABLE savings_goals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0.00,
    deadline TIMESTAMP NOT NULL,
    category VARCHAR(255) NULL,
    icon VARCHAR(255) NULL,
    color VARCHAR(255) NULL,
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. CHAT_MESSAGES Table
CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'financial', 'goal', 'transaction')),
    context JSON NULL,
    sentiment VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_chat_messages_user_created ON chat_messages(user_id, created_at);

-- 6. RECOMMENDATIONS Table
CREATE TABLE recommendations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(255) NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    potential_savings DECIMAL(12, 2) NULL,
    implementation_difficulty VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    data JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_recommendations_user_status ON recommendations(user_id, status);

-- 7. REMINDERS Table
CREATE TABLE reminders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    type VARCHAR(255) NOT NULL,
    due_date TIMESTAMP NOT NULL,
    frequency VARCHAR(255) NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    notification_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_reminders_user_due ON reminders(user_id, due_date);

--------------------------------------------------------------------------------
-- DUMMY SEED DATA
--------------------------------------------------------------------------------

-- Insert a Default User
-- Hashed password represents 'password' (bcrypt format)
INSERT INTO users (id, name, email, password, phone, currency, language, theme, created_at, updated_at)
VALUES (1, 'Demo Account', 'demo@moneyassist.com', '$2y$12$DqHqVp1Zp1XmD0.zH.l2DeYI0K.F3fL7t84Gk3hE7jB0Jj3L4z8dG', '08123456789', 'IDR', 'id', 'dark', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Default Categories for user_id = 1
INSERT INTO categories (id, user_id, name, icon, color, type, budget_limit, description, created_at, updated_at) VALUES
(1, 1, 'Salary', 'briefcase', '#10b981', 'income', NULL, 'Gaji utama bulanan', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 'Investment', 'trending-up', '#0ea5e9', 'income', NULL, 'Dividen dan imbal hasil investasi', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 1, 'Food', 'coffee', '#f59e0b', 'expense', 1500000.00, 'Kebutuhan makan dan minum harian', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 'Utilities', 'zap', '#6366f1', 'expense', 1000000.00, 'Tagihan listrik, air, dan internet', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 1, 'Rent', 'home', '#ec4899', 'expense', 1500000.00, 'Biaya sewa rumah / kosan', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 1, 'Entertainment', 'film', '#8b5cf6', 'expense', 500000.00, 'Hiburan dan hobi', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Some Dummy Transactions
INSERT INTO transactions (id, user_id, category_id, type, amount, description, date, receipt_url, tags, notes, created_at, updated_at) VALUES
(1, 1, 1, 'income', 15000000.00, 'Gaji Bulanan', '2026-05-25', NULL, '["salary", "monthly"]', 'Gaji utama', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 3, 'expense', 350000.00, 'Makan Malam Bersama Keluarga', '2026-05-25', NULL, '["family", "dinner"]', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 1, 4, 'expense', 800000.00, 'Tagihan Listrik & Internet', '2026-05-24', NULL, '["electricity", "internet"]', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 5, 'expense', 1200000.00, 'Kontrakan Rumah', '2026-05-01', NULL, '["rent", "monthly"]', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 1, 2, 'income', 2500000.00, 'Dividen Saham', '2026-05-20', NULL, '["investment", "stocks"]', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Some Dummy Savings Goals
INSERT INTO savings_goals (id, user_id, name, description, target_amount, current_amount, deadline, category, icon, color, priority, status, created_at, updated_at) VALUES
(1, 1, 'Beli Laptop Baru', 'Untuk menunjang produktivitas kerja remote', 20000000.00, 15000000.00, '2026-12-31 23:59:59', 'Gadget', 'laptop', '#38bdf8', 'high', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 'Dana Darurat', 'Alokasi 6 bulan pengeluaran rutin harian', 50000000.00, 20000000.00, '2027-06-30 23:59:59', 'Savings', 'shield', '#10b981', 'high', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Some Dummy Recommendations
INSERT INTO recommendations (id, user_id, title, description, type, priority, potential_savings, implementation_difficulty, status, data, created_at, updated_at) VALUES
(1, 1, 'Kurangi Biaya Hiburan', 'Anda menghabiskan 25% lebih banyak untuk kategori hiburan bulan ini dibandingkan bulan lalu.', 'saving', 'high', 500000.00, 'Easy', 'pending', '{"category": "Entertainment"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 'Maksimalkan Tabungan Bunga Tinggi', 'Pindahkan sebagian dana darurat Anda ke rekening dengan imbal hasil tinggi.', 'investment', 'medium', 200000.00, 'Medium', 'pending', '{"source": "emergency_fund"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Update Sequence values so Postgres serial auto-increments correctly after manual seeding
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('transactions_id_seq', (SELECT MAX(id) FROM transactions));
SELECT setval('savings_goals_id_seq', (SELECT MAX(id) FROM savings_goals));
SELECT setval('recommendations_id_seq', (SELECT MAX(id) FROM recommendations));
