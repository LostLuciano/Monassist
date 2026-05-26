# User Journey - MoneyAssist

---

## 1. User Journey: Sebelum Login (Guest Mode)

### Persona: Budi, 28 tahun, karyawan swasta yang ingin mengelola keuangan

#### Journey Map

```
STAGE 1: AWARENESS
├─ Budi membuka website MoneyAssist
├─ Melihat landing page dengan navbar (logo, Login, Register)
└─ Tertarik dengan headline "Asisten Keuangan AI Kamu"

STAGE 2: ENGAGEMENT
├─ Melihat AI Chat greeting yang menyapa
├─ AI: "Halo Budi 👋, saya MoneyAssist, asisten keuangan AI kamu"
├─ Budi membaca penjelasan singkat tentang fungsi aplikasi
├─ Budi melihat contoh pertanyaan yang bisa diajukan
└─ Budi merasa tertarik untuk mencoba

STAGE 3: INTERACTION
├─ Budi mengetik pertanyaan: "Gimana cara cek kondisi keuangan saya?"
├─ AI merespons dengan penjelasan simulasi
├─ Budi mencoba pertanyaan lain: "Berapa target tabungan yang bagus?"
├─ AI memberikan saran simulasi
└─ Budi merasa aplikasi ini berguna

STAGE 4: CONSIDERATION
├─ Budi melihat feature preview section
├─ Melihat card yang menjelaskan:
│  ├─ "📊 Dashboard Keuangan" - Lihat overview keuangan
│  ├─ "💰 Input Transaksi" - Catat pengeluaran dengan mudah
│  ├─ "🎯 Target Tabungan" - Buat dan pantau target
│  ├─ "🤖 Rekomendasi AI" - Dapatkan saran personal
│  └─ "📈 Analisis Mendalam" - Lihat tren pengeluaran
├─ Budi tertarik dengan fitur-fitur tersebut
└─ Budi ingin mencoba fitur lengkapnya

STAGE 5: DECISION
├─ Budi melihat CTA button: "Login untuk Analisis Lengkap"
├─ Budi juga melihat button: "Mulai Audit Keuangan"
├─ Budi klik tombol "Login untuk Analisis Lengkap"
└─ Redirect ke halaman Login

STAGE 6: ACTION
├─ Budi masuk ke halaman Login
├─ Budi belum punya akun, jadi klik "Daftar di sini"
├─ Redirect ke halaman Register
├─ Budi mengisi form: email, password, nama
├─ Budi klik tombol "Daftar"
└─ Sistem membuat akun baru
```

#### Touchpoints & Emotions

| Stage | Touchpoint | Emotion | Action |
|-------|-----------|---------|--------|
| Awareness | Landing page | Curious | Scroll down |
| Engagement | AI greeting | Interested | Read more |
| Interaction | Chat demo | Engaged | Type question |
| Consideration | Feature preview | Excited | Explore features |
| Decision | CTA button | Motivated | Click login |
| Action | Register form | Hopeful | Submit form |

#### Pain Points & Solutions

| Pain Point | Solution |
|-----------|----------|
| Tidak tahu apa fungsi aplikasi | AI greeting yang jelas dan feature preview |
| Takut data tidak aman | Tampilkan security badge dan privacy policy |
| Bingung cara menggunakan | Chat demo yang interaktif dan intuitif |
| Tidak yakin perlu aplikasi ini | Contoh kasus nyata dan testimonial |

---

## 2. User Journey: Setelah Login (Authenticated Mode)

### Persona: Budi, sudah login dan ingin mengelola keuangan

#### Journey Map

```
STAGE 1: ONBOARDING
├─ Budi berhasil login
├─ Sistem redirect ke Dashboard
├─ Budi melihat welcome message: "Selamat datang, Budi! 👋"
├─ Dashboard menampilkan overview keuangan (kosong karena baru)
└─ Budi melihat prompt: "Mulai dengan input transaksi pertama kamu"

STAGE 2: INITIAL SETUP
├─ Budi klik tombol "Input Transaksi"
├─ Budi melihat form input dengan field:
│  ├─ Tipe: Pemasukan / Pengeluaran
│  ├─ Jumlah: 5.000.000 (gaji bulanan)
│  ├─ Kategori: Gaji
│  ├─ Deskripsi: Gaji bulan Mei
│  └─ Tanggal: 26 Mei 2026
├─ Budi submit form
├─ Sistem menyimpan transaksi
└─ Budi kembali ke dashboard

STAGE 3: DATA ENTRY
├─ Dashboard sekarang menampilkan:
│  ├─ Total Pemasukan: Rp 5.000.000
│  ├─ Total Pengeluaran: Rp 0
│  ├─ Saldo: Rp 5.000.000
│  └─ Status: Irit ✅ (Hijau)
├─ Budi input beberapa pengeluaran:
│  ├─ Makan: Rp 150.000
│  ├─ Transportasi: Rp 100.000
│  ├─ Hiburan: Rp 200.000
│  └─ Belanja: Rp 500.000
├─ Budi bisa upload foto struk untuk transaksi tertentu
└─ Sistem OCR ekstrak data dari struk

STAGE 4: ANALYSIS & INSIGHTS
├─ Dashboard sekarang menampilkan:
│  ├─ Total Pengeluaran: Rp 950.000
│  ├─ Saldo: Rp 4.050.000
│  ├─ Status: Irit ✅ (Hijau)
│  ├─ Grafik pengeluaran per kategori (pie chart)
│  ├─ Grafik tren pengeluaran (line chart)
│  └─ Rekomendasi AI: "Pengeluaran kamu terkontrol. Bagus! 👍"
├─ Budi melihat rekomendasi AI:
│  ├─ "Kategori Belanja adalah pengeluaran terbesar kamu (52%)"
│  ├─ "Coba kurangi belanja non-essential untuk tabungan lebih banyak"
│  └─ "Target tabungan yang realistis: Rp 2.000.000/bulan"
└─ Budi merasa termotivasi

STAGE 5: GOAL SETTING
├─ Budi klik "Buat Target Tabungan"
├─ Budi mengisi form:
│  ├─ Nama Target: "Liburan ke Bali"
│  ├─ Target Nominal: Rp 10.000.000
│  ├─ Target Tanggal: 31 Desember 2026
│  └─ Kategori: Liburan
├─ Sistem menghitung:
│  ├─ Sisa waktu: 7 bulan
│  ├─ Target per bulan: Rp 1.428.571
│  └─ Progress: 0%
├─ Budi submit form
└─ Target muncul di dashboard dengan progress bar

STAGE 6: ONGOING MANAGEMENT
├─ Setiap hari Budi input transaksi
├─ Dashboard terus update dengan data terbaru
├─ Budi menerima reminder: "Sudah input transaksi hari ini?"
├─ Budi melihat summary harian/mingguan
├─ Budi melihat progress target tabungan
├─ AI memberikan rekomendasi baru setiap minggu
└─ Budi merasa terkontrol dan termotivasi

STAGE 7: REVIEW & OPTIMIZATION
├─ Budi membuka halaman Summary Mingguan
├─ Melihat:
│  ├─ Total pengeluaran minggu ini: Rp 2.100.000
│  ├─ Perbandingan dengan minggu lalu: +15%
│  ├─ Kategori terboros: Belanja (Rp 1.200.000)
│  └─ Saran: "Pengeluaran belanja naik 20%. Coba kurangi minggu depan"
├─ Budi membuka halaman Riwayat Transaksi
├─ Budi filter transaksi berdasarkan kategori
├─ Budi bisa edit atau delete transaksi jika ada kesalahan
└─ Budi merasa punya kontrol penuh atas keuangan

STAGE 8: PROFILE & SETTINGS
├─ Budi klik menu Profil
├─ Budi bisa:
│  ├─ Edit nama, email, foto profil
│  ├─ Ubah pengaturan reminder (frekuensi, waktu)
│  ├─ Ubah pengaturan notifikasi
│  ├─ Lihat privacy policy dan terms
│  └─ Logout
├─ Budi merasa aplikasi fleksibel sesuai kebutuhan
└─ Budi merasa aman dengan kontrol privasi
```

#### Touchpoints & Emotions

| Stage | Touchpoint | Emotion | Action |
|-------|-----------|---------|--------|
| Onboarding | Welcome message | Excited | Explore dashboard |
| Initial Setup | Input form | Motivated | Enter first transaction |
| Data Entry | Multiple inputs | Engaged | Keep adding data |
| Analysis | AI insights | Surprised | Read recommendations |
| Goal Setting | Target form | Hopeful | Create goal |
| Ongoing | Daily reminder | Committed | Input transaction |
| Review | Summary report | Satisfied | Analyze progress |
| Settings | Profile menu | Confident | Customize app |

#### Success Metrics

- User input minimal 5 transaksi dalam 3 hari pertama
- User membuat minimal 1 target tabungan dalam minggu pertama
- User kembali ke app minimal 5 hari per minggu
- User satisfaction score > 4.0/5.0
- User retention rate > 80% setelah 30 hari

---

## 3. Comparison: Guest Mode vs Authenticated Mode

### Guest Mode Experience
```
Landing Page
    ↓
AI Chat Greeting (Simulasi)
    ↓
Feature Preview
    ↓
CTA: Login/Register
    ↓
Tidak ada data yang tersimpan
```

**Duration**: 2-5 menit  
**Engagement**: Medium  
**Value**: Awareness & Education

### Authenticated Mode Experience
```
Dashboard (Overview)
    ↓
Input Transaksi
    ↓
View Analytics & Insights
    ↓
Set Goals & Targets
    ↓
Receive Recommendations
    ↓
Track Progress
    ↓
Ongoing Management
```

**Duration**: 10+ menit per session  
**Engagement**: High  
**Value**: Action & Results

---

## 4. Critical Moments (Moments of Truth)

### Moment 1: First Landing
- **What**: User membuka website pertama kali
- **Why**: Kesan pertama sangat penting
- **How**: Landing page harus menarik, jelas, dan tidak overwhelming

### Moment 2: AI Greeting
- **What**: AI menyapa dan menjelaskan fungsi
- **Why**: User perlu memahami value proposition
- **How**: Sapaan harus ramah, jelas, dan relevan

### Moment 3: First Login
- **What**: User berhasil login dan masuk dashboard
- **Why**: Ini adalah transisi dari guest ke user
- **How**: Dashboard harus welcoming dan tidak kosong (show sample data atau prompt)

### Moment 4: First Transaction
- **What**: User input transaksi pertama
- **Why**: Ini adalah commitment point
- **How**: Form harus simple, intuitif, dan memberikan feedback positif

### Moment 5: First Insight
- **What**: User melihat rekomendasi AI pertama
- **Why**: Ini membuktikan value aplikasi
- **How**: Insight harus actionable, personal, dan akurat

### Moment 6: First Goal
- **What**: User membuat target tabungan pertama
- **Why**: Ini adalah engagement point yang kuat
- **How**: Goal setting harus mudah dan motivating

---

## 5. Retention Strategy

### Week 1
- Welcome email dengan tips menggunakan aplikasi
- Reminder untuk input transaksi harian
- Celebrate first transaction milestone

### Week 2-4
- Weekly summary email
- Personalized recommendations
- Celebrate first goal milestone

### Month 2+
- Monthly summary report
- Comparison dengan bulan sebelumnya
- New features announcement
- Community challenges (optional)

---

**Document End**
