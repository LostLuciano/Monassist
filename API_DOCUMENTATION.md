# API Documentation - MoneyAssist
# Dokumentasi API - MoneyAssist

**Version:** 1.0.0  
**Base URL:** `https://api.moneyassist.com/api`  
**Authentication:** JWT Bearer Token

---

## 1. Authentication Endpoints / Endpoint Autentikasi

### 1.1 Register User / Daftar Pengguna

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "password_confirmation": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-05-26T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (422 Unprocessable Entity):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Email already exists"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

---

### 1.2 Login User / Login Pengguna

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 1.3 Logout User / Logout Pengguna

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 1.4 Refresh Token

**Endpoint:** `POST /auth/refresh`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 1.5 Get Current User / Dapatkan User Saat Ini

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+62812345678",
    "profile_photo_path": "https://...",
    "monthly_income": 5000000,
    "reminder_frequency": "daily",
    "reminder_time": "08:00:00",
    "notification_enabled": true,
    "created_at": "2026-05-26T10:00:00Z"
  }
}
```

---

## 2. User Endpoints / Endpoint Pengguna

### 2.1 Get User Profile / Dapatkan Profil Pengguna

**Endpoint:** `GET /users/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+62812345678",
    "profile_photo_path": "https://...",
    "monthly_income": 5000000,
    "created_at": "2026-05-26T10:00:00Z"
  }
}
```

---

### 2.2 Update User Profile / Perbarui Profil Pengguna

**Endpoint:** `PUT /users/profile`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "phone": "+62812345678",
  "monthly_income": 6000000
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "phone": "+62812345678",
    "monthly_income": 6000000
  }
}
```

---

### 2.3 Update User Settings / Perbarui Pengaturan Pengguna

**Endpoint:** `PUT /users/settings`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "reminder_frequency": "weekly",
  "reminder_time": "09:00:00",
  "notification_enabled": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "reminder_frequency": "weekly",
    "reminder_time": "09:00:00",
    "notification_enabled": true
  }
}
```

---

### 2.4 Get Financial Summary / Dapatkan Ringkasan Keuangan

**Endpoint:** `GET /users/summary`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?month=2026-05&year=2026
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_income": 5000000,
    "total_expense": 2500000,
    "balance": 2500000,
    "financial_status": "controlled",
    "expense_by_category": [
      {
        "category": "Food",
        "amount": 800000,
        "percentage": 32
      },
      {
        "category": "Transportation",
        "amount": 600000,
        "percentage": 24
      }
    ],
    "savings_goals_progress": [
      {
        "id": 1,
        "name": "Bali Vacation",
        "target_amount": 10000000,
        "current_amount": 2500000,
        "progress_percentage": 25
      }
    ]
  }
}
```

---

## 3. Transaction Endpoints / Endpoint Transaksi

### 3.1 List Transactions / Daftar Transaksi

**Endpoint:** `GET /transactions`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?page=1&per_page=20&type=expense&category_id=1&start_date=2026-05-01&end_date=2026-05-31&sort=-created_at
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "category_id": 2,
      "type": "expense",
      "amount": 150000,
      "description": "Lunch at restaurant",
      "receipt_image_path": "https://...",
      "transaction_date": "2026-05-26",
      "category": {
        "id": 2,
        "name": "Food",
        "icon": "utensils",
        "color": "#FF6B6B"
      },
      "created_at": "2026-05-26T12:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "last_page": 8
  }
}
```

---

### 3.2 Create Transaction / Buat Transaksi

**Endpoint:** `POST /transactions`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "expense",
  "category_id": 2,
  "amount": 150000,
  "description": "Lunch at restaurant",
  "transaction_date": "2026-05-26"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "category_id": 2,
    "type": "expense",
    "amount": 150000,
    "description": "Lunch at restaurant",
    "transaction_date": "2026-05-26",
    "created_at": "2026-05-26T12:30:00Z"
  }
}
```

---

### 3.3 Get Transaction Detail / Dapatkan Detail Transaksi

**Endpoint:** `GET /transactions/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "category_id": 2,
    "type": "expense",
    "amount": 150000,
    "description": "Lunch at restaurant",
    "receipt_image_path": "https://...",
    "transaction_date": "2026-05-26",
    "category": {
      "id": 2,
      "name": "Food",
      "icon": "utensils",
      "color": "#FF6B6B"
    },
    "created_at": "2026-05-26T12:30:00Z",
    "updated_at": "2026-05-26T12:30:00Z"
  }
}
```

---

### 3.4 Update Transaction / Perbarui Transaksi

**Endpoint:** `PUT /transactions/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "amount": 160000,
  "description": "Lunch at restaurant (updated)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": {
    "id": 1,
    "amount": 160000,
    "description": "Lunch at restaurant (updated)",
    "updated_at": "2026-05-26T13:00:00Z"
  }
}
```

---

### 3.5 Delete Transaction / Hapus Transaksi

**Endpoint:** `DELETE /transactions/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

---

### 3.6 Upload Receipt Image / Upload Gambar Struk

**Endpoint:** `POST /transactions/upload-receipt`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary image file]
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Receipt uploaded successfully",
  "data": {
    "receipt_image_path": "https://...",
    "extracted_data": {
      "amount": 150000,
      "merchant": "Restaurant ABC",
      "date": "2026-05-26",
      "items": ["Item 1", "Item 2"]
    }
  }
}
```

---

## 4. Savings Goals Endpoints / Endpoint Target Tabungan

### 4.1 List Savings Goals / Daftar Target Tabungan

**Endpoint:** `GET /savings-goals`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?status=active&sort=-created_at
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Bali Vacation",
      "target_amount": 10000000,
      "current_amount": 2500000,
      "target_date": "2026-12-31",
      "category": "Travel",
      "status": "active",
      "progress_percentage": 25,
      "remaining_amount": 7500000,
      "days_remaining": 219,
      "created_at": "2026-05-26T10:00:00Z"
    }
  ]
}
```

---

### 4.2 Create Savings Goal / Buat Target Tabungan

**Endpoint:** `POST /savings-goals`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Bali Vacation",
  "target_amount": 10000000,
  "target_date": "2026-12-31",
  "category": "Travel"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Savings goal created successfully",
  "data": {
    "id": 1,
    "name": "Bali Vacation",
    "target_amount": 10000000,
    "current_amount": 0,
    "target_date": "2026-12-31",
    "category": "Travel",
    "status": "active",
    "progress_percentage": 0,
    "created_at": "2026-05-26T10:00:00Z"
  }
}
```

---

### 4.3 Get Savings Goal Detail / Dapatkan Detail Target Tabungan

**Endpoint:** `GET /savings-goals/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Bali Vacation",
    "target_amount": 10000000,
    "current_amount": 2500000,
    "target_date": "2026-12-31",
    "category": "Travel",
    "status": "active",
    "progress_percentage": 25,
    "remaining_amount": 7500000,
    "days_remaining": 219,
    "monthly_target": 1428571,
    "created_at": "2026-05-26T10:00:00Z"
  }
}
```

---

### 4.4 Update Savings Goal / Perbarui Target Tabungan

**Endpoint:** `PUT /savings-goals/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Bali Vacation Updated",
  "target_amount": 12000000,
  "target_date": "2027-01-31"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Savings goal updated successfully",
  "data": {
    "id": 1,
    "name": "Bali Vacation Updated",
    "target_amount": 12000000,
    "target_date": "2027-01-31"
  }
}
```

---

### 4.5 Delete Savings Goal / Hapus Target Tabungan

**Endpoint:** `DELETE /savings-goals/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Savings goal deleted successfully"
}
```

---

## 5. AI Chat Endpoints / Endpoint Chat AI

### 5.1 Send Chat Message (Authenticated) / Kirim Pesan Chat (Terautentikasi)

**Endpoint:** `POST /chat/message`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "How can I reduce my spending on food?"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "message": "How can I reduce my spending on food?",
    "response": "Based on your spending patterns, here are some suggestions...",
    "created_at": "2026-05-26T14:30:00Z"
  }
}
```

---

### 5.2 Send Chat Message (Guest) / Kirim Pesan Chat (Tamu)

**Endpoint:** `POST /chat/guest-message`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "What is MoneyAssist?"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "What is MoneyAssist?",
    "response": "MoneyAssist is an AI-powered personal finance assistant that helps you manage your spending...",
    "created_at": "2026-05-26T14:30:00Z"
  }
}
```

---

### 5.3 Get Chat History / Dapatkan Riwayat Chat

**Endpoint:** `GET /chat/history`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?page=1&per_page=50&sort=-created_at
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "message": "How can I reduce my spending?",
      "response": "Based on your data...",
      "created_at": "2026-05-26T14:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 50,
    "total": 25,
    "last_page": 1
  }
}
```

---

## 6. Recommendations Endpoints / Endpoint Rekomendasi

### 6.1 Get Recommendations / Dapatkan Rekomendasi

**Endpoint:** `GET /recommendations`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?is_read=false&sort=-created_at
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "type": "spending_alert",
      "title": "High Spending Alert",
      "description": "Your food spending increased by 30% this week",
      "priority": "high",
      "is_read": false,
      "created_at": "2026-05-26T10:00:00Z"
    }
  ]
}
```

---

### 6.2 Mark Recommendation as Read / Tandai Rekomendasi Sebagai Dibaca

**Endpoint:** `PUT /recommendations/{id}/read`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Recommendation marked as read",
  "data": {
    "id": 1,
    "is_read": true
  }
}
```

---

## 7. Analytics Endpoints / Endpoint Analitik

### 7.1 Get Daily Summary / Dapatkan Ringkasan Harian

**Endpoint:** `GET /analytics/daily-summary`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?date=2026-05-26
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "date": "2026-05-26",
    "total_income": 0,
    "total_expense": 450000,
    "balance": -450000,
    "transactions_count": 3,
    "top_category": "Food"
  }
}
```

---

### 7.2 Get Weekly Summary / Dapatkan Ringkasan Mingguan

**Endpoint:** `GET /analytics/weekly-summary`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?week=21&year=2026
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "week": 21,
    "year": 2026,
    "start_date": "2026-05-25",
    "end_date": "2026-05-31",
    "total_income": 0,
    "total_expense": 2100000,
    "balance": -2100000,
    "transactions_count": 15,
    "comparison_with_previous_week": {
      "expense_change_percentage": 15,
      "trend": "increased"
    }
  }
}
```

---

### 7.3 Get Expense Breakdown / Dapatkan Breakdown Pengeluaran

**Endpoint:** `GET /analytics/expense-breakdown`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
?month=2026-05
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "category_id": 2,
      "category_name": "Food",
      "amount": 800000,
      "percentage": 32,
      "transactions_count": 8
    },
    {
      "category_id": 3,
      "category_name": "Transportation",
      "amount": 600000,
      "percentage": 24,
      "transactions_count": 6
    }
  ]
}
```

---

## 8. Error Handling / Penanganan Error

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Error detail"]
  }
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## 9. Rate Limiting / Pembatasan Laju

```
- 100 requests per minute for authenticated users
- 20 requests per minute for guest users
- 5 requests per minute for auth endpoints
```

---

## 10. Pagination / Paginasi

All list endpoints support pagination with the following parameters:

```
?page=1&per_page=20&sort=-created_at
```

Response includes pagination metadata:

```json
{
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "last_page": 8
  }
}
```

---

**Document End**
