# Database Schema - MoneyAssist
# Skema Database - MoneyAssist

**Version:** 1.0.0  
**Database:** PostgreSQL 14+  
**Language:** SQL

---

## 1. Users Table / Tabel Pengguna

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_photo_path VARCHAR(255),
    monthly_income DECIMAL(15, 2) DEFAULT 0,
    reminder_frequency VARCHAR(50) DEFAULT 'daily',
    reminder_time TIME DEFAULT '08:00:00',
    notification_enabled BOOLEAN DEFAULT TRUE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);
```

---

## 2. Categories Table / Tabel Kategori

```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type ENUM('income', 'expense') NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7),
    description TEXT,
    is_default BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_name (name)
);
```

**Default Categories:**

Income Categories:
- Salary (Gaji)
- Freelance (Freelance)
- Investment (Investasi)
- Bonus (Bonus)
- Other Income (Pendapatan Lain)

Expense Categories:
- Food (Makanan)
- Transportation (Transportasi)
- Entertainment (Hiburan)
- Shopping (Belanja)
- Utilities (Utilitas)
- Healthcare (Kesehatan)
- Education (Pendidikan)
- Subscription (Langganan)
- Other Expense (Pengeluaran Lain)

---

## 3. Transactions Table / Tabel Transaksi

```sql
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description VARCHAR(255),
    receipt_image_path VARCHAR(255),
    receipt_extracted_data JSONB,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    
    INDEX idx_user_id (user_id),
    INDEX idx_user_date (user_id, transaction_date),
    INDEX idx_category_id (category_id),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
);
```

---

## 4. Savings Goals Table / Tabel Target Tabungan

```sql
CREATE TABLE savings_goals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) DEFAULT 0,
    target_date DATE NOT NULL,
    category VARCHAR(100),
    status ENUM('active', 'completed', 'abandoned') DEFAULT 'active',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_target_date (target_date)
);
```

---

## 5. Chat History Table / Tabel Riwayat Chat

```sql
CREATE TABLE chat_histories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    session_id VARCHAR(255),
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text',
    is_guest BOOLEAN DEFAULT FALSE,
    ai_model VARCHAR(50) DEFAULT 'gemini-pro',
    tokens_used INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id),
    INDEX idx_is_guest (is_guest),
    INDEX idx_created_at (created_at)
);
```

---

## 6. Recommendations Table / Tabel Rekomendasi

```sql
CREATE TABLE recommendations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    action_url VARCHAR(255),
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
);
```

---

## 7. Notifications Table / Tabel Notifikasi

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
);
```

---

## 8. API Tokens Table / Tabel Token API

```sql
CREATE TABLE api_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    abilities TEXT[],
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user_id (user_id),
    INDEX idx_token (token)
);
```

---

## 9. Audit Logs Table / Tabel Log Audit

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(255) NOT NULL,
    model_type VARCHAR(255),
    model_id BIGINT,
    changes JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);
```

---

## 10. Password Resets Table / Tabel Reset Password

```sql
CREATE TABLE password_resets (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    
    INDEX idx_email (email),
    INDEX idx_token (token)
);
```

---

## 11. Indexes / Indeks

```sql
-- Performance indexes
CREATE INDEX idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_category ON transactions(category_id);
CREATE INDEX idx_savings_goals_user ON savings_goals(user_id);
CREATE INDEX idx_chat_histories_user ON chat_histories(user_id);
CREATE INDEX idx_recommendations_user ON recommendations(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Search indexes
CREATE INDEX idx_transactions_description ON transactions USING GIN(to_tsvector('english', description));
CREATE INDEX idx_savings_goals_name ON savings_goals USING GIN(to_tsvector('english', name));
```

---

## 12. Views / View

### Monthly Summary View

```sql
CREATE VIEW monthly_summary AS
SELECT 
    u.id as user_id,
    DATE_TRUNC('month', t.transaction_date)::DATE as month,
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as total_income,
    SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as total_expense,
    SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END) as balance
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.id, DATE_TRUNC('month', t.transaction_date);
```

### Category Summary View

```sql
CREATE VIEW category_summary AS
SELECT 
    t.user_id,
    c.id as category_id,
    c.name as category_name,
    c.type,
    SUM(t.amount) as total_amount,
    COUNT(t.id) as transaction_count,
    DATE_TRUNC('month', t.transaction_date)::DATE as month
FROM transactions t
JOIN categories c ON t.category_id = c.id
GROUP BY t.user_id, c.id, c.name, c.type, DATE_TRUNC('month', t.transaction_date);
```

---

## 13. Triggers / Trigger

### Update Savings Goal Current Amount

```sql
CREATE OR REPLACE FUNCTION update_savings_goal_amount()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'expense' AND NEW.category_id IN (
        SELECT id FROM categories WHERE name = 'Savings'
    ) THEN
        UPDATE savings_goals 
        SET current_amount = current_amount + NEW.amount
        WHERE user_id = NEW.user_id 
        AND status = 'active'
        AND target_date > NEW.transaction_date
        LIMIT 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_savings_goal
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_savings_goal_amount();
```

### Update Savings Goal Status

```sql
CREATE OR REPLACE FUNCTION update_savings_goal_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.current_amount >= NEW.target_amount THEN
        NEW.status = 'completed';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_goal_status
BEFORE UPDATE ON savings_goals
FOR EACH ROW
EXECUTE FUNCTION update_savings_goal_status();
```

---

## 14. Migrations / Migrasi

### Laravel Migration Example

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->string('profile_photo_path')->nullable();
            $table->decimal('monthly_income', 15, 2)->default(0);
            $table->string('reminder_frequency')->default('daily');
            $table->time('reminder_time')->default('08:00:00');
            $table->boolean('notification_enabled')->default(true);
            $table->boolean('two_factor_enabled')->default(false);
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('email');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

---

## 15. Data Types Reference / Referensi Tipe Data

| Type | Description | Example |
|------|-------------|---------|
| BIGSERIAL | Auto-incrementing 64-bit integer | 1, 2, 3... |
| VARCHAR(n) | Variable-length string | 'John Doe' |
| TEXT | Large text | Long descriptions |
| DECIMAL(15,2) | Fixed-point decimal | 1234567.89 |
| DATE | Date only | 2026-05-26 |
| TIME | Time only | 08:00:00 |
| TIMESTAMP | Date and time | 2026-05-26 08:00:00 |
| BOOLEAN | True/False | TRUE, FALSE |
| ENUM | Enumerated type | 'income', 'expense' |
| JSONB | JSON binary | {"key": "value"} |

---

## 16. Backup & Recovery / Backup dan Pemulihan

### Backup Database

```bash
pg_dump -U postgres -h localhost moneyassist > backup.sql
```

### Restore Database

```bash
psql -U postgres -h localhost moneyassist < backup.sql
```

### Automated Backup (Cron)

```bash
0 2 * * * pg_dump -U postgres moneyassist | gzip > /backups/moneyassist_$(date +\%Y\%m\%d).sql.gz
```

---

**Document End**
