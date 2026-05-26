# Wireframes & UI/UX Design - MoneyAssist
# Wireframe dan Desain UI/UX - MoneyAssist

**Version:** 1.0.0  
**Design System:** Modern Financial Technology  
**Platforms:** Web, iOS, Android

---

## 1. Design System / Sistem Desain

### 1.1 Color Palette

```
Primary Blue:
  - Light: #E3F2FD
  - Main: #1E40AF
  - Dark: #0C2340

Secondary Green:
  - Light: #ECFDF5
  - Main: #10B981
  - Dark: #047857

Accent Orange:
  - Light: #FEF3C7
  - Main: #F97316
  - Dark: #EA580C

Neutral:
  - White: #FFFFFF
  - Light Gray: #F9FAFB
  - Medium Gray: #E5E7EB
  - Dark Gray: #374151
  - Black: #111827

Status Colors:
  - Success (Controlled): #10B981
  - Warning (Elevated): #F59E0B
  - Error (Critical): #EF4444
  - Info: #3B82F6
```

### 1.2 Typography

```
Font Family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

Heading 1: 32px, Bold (700), Line Height 1.2
Heading 2: 24px, Bold (700), Line Height 1.3
Heading 3: 20px, Semi-bold (600), Line Height 1.4
Heading 4: 18px, Semi-bold (600), Line Height 1.4

Body Large: 16px, Regular (400), Line Height 1.5
Body: 14px, Regular (400), Line Height 1.5
Body Small: 12px, Regular (400), Line Height 1.4

Caption: 12px, Regular (400), Line Height 1.4
Overline: 11px, Semi-bold (600), Line Height 1.4, Letter Spacing 0.5px
```

### 1.3 Spacing System

```
Base Unit: 4px

Spacing Scale:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
```

### 1.4 Border Radius

```
Small: 4px
Medium: 8px
Large: 12px
Full: 9999px
```

### 1.5 Shadows

```
Elevation 1: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
Elevation 2: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
Elevation 3: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
Elevation 4: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

---

## 2. Guest Mode Wireframes / Wireframe Mode Tamu

### 2.1 Landing Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                 │
│  Logo          [Home] [Features] [About]  [Login] [Sign Up]
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HERO SECTION                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Welcome to MoneyAssist                          │   │
│  │ Your Personal AI Financial Assistant            │   │
│  │                                                 │   │
│  │ [Start Free Trial]  [Learn More]                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  AI CHAT SECTION                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │ MoneyAssist AI                                  │   │
│  │ ─────────────────────────────────────────────── │   │
│  │                                                 │   │
│  │ Welcome! I'm MoneyAssist, your AI financial    │   │
│  │ assistant. I can help you understand your      │   │
│  │ spending patterns and achieve your goals.      │   │
│  │                                                 │   │
│  │ Sample Questions:                              │   │
│  │ • How can I reduce my spending?                │   │
│  │ • What's a good savings target?                │   │
│  │ • Where am I spending the most?                │   │
│  │                                                 │   │
│  │ [Type your question...]                        │   │
│  │                                    [Send]      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FEATURES SECTION                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Dashboard    │  │ Transactions │  │ Goals        │ │
│  │ Overview     │  │ Track all    │  │ Set & track  │ │
│  │ keuangan     │  │ expenses     │  │ savings      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Analytics    │  │ AI Chat      │  │ Reminders    │ │
│  │ Detailed     │  │ Personal     │  │ Daily        │ │
│  │ insights     │  │ recommendations  │ notifications   │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  CTA SECTION                                            │
│  [Login for Complete Analysis]  [Sign Up Now]          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
│  About | Privacy | Terms | Contact | Social Links      │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Login Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (Minimal)                                       │
│  Logo                                    [Sign Up]      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    LOGIN FORM                           │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Welcome Back                                    │   │
│  │ Sign in to your account                         │   │
│  │                                                 │   │
│  │ Email Address                                   │   │
│  │ [_____________________________]                 │   │
│  │                                                 │   │
│  │ Password                                        │   │
│  │ [_____________________________]                 │   │
│  │                                                 │   │
│  │ [Remember me]  [Forgot password?]              │   │
│  │                                                 │   │
│  │ [Sign In]                                       │   │
│  │                                                 │   │
│  │ Don't have an account? [Sign Up]               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.3 Register Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (Minimal)                                       │
│  Logo                                    [Login]        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                  REGISTRATION FORM                      │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Create Account                                  │   │
│  │ Join MoneyAssist today                          │   │
│  │                                                 │   │
│  │ Full Name                                       │   │
│  │ [_____________________________]                 │   │
│  │                                                 │   │
│  │ Email Address                                   │   │
│  │ [_____________________________]                 │   │
│  │                                                 │   │
│  │ Password                                        │   │
│  │ [_____________________________]                 │   │
│  │ Password must be at least 8 characters          │   │
│  │                                                 │   │
│  │ Confirm Password                                │   │
│  │ [_____________________________]                 │   │
│  │                                                 │   │
│  │ [I agree to Terms & Conditions]                │   │
│  │                                                 │   │
│  │ [Create Account]                                │   │
│  │                                                 │   │
│  │ Already have an account? [Login]               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Authenticated Mode Wireframes / Wireframe Mode Terautentikasi

### 3.1 Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                 │
│  Logo  [Dashboard] [Transactions] [Goals] [Profile]     │
│                                    [Notifications] [Menu]
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HEADER                                                 │
│  Welcome back, John!                                    │
│  Your financial status: Controlled (Green)              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  STATISTICS CARDS                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Total Income │  │ Total Expense│  │ Balance      │ │
│  │ Rp 5.000.000 │  │ Rp 2.500.000 │  │ Rp 2.500.000 │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  CHARTS SECTION                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐   │
│  │ Expense by Category  │  │ Spending Trend       │   │
│  │ (Pie Chart)          │  │ (Line Chart)         │   │
│  │                      │  │                      │   │
│  │ Food: 32%            │  │ May 20-26            │   │
│  │ Transport: 24%       │  │ Rp 2.1M              │   │
│  │ Shopping: 20%        │  │                      │   │
│  │ Other: 24%           │  │                      │   │
│  └──────────────────────┘  └──────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  SAVINGS GOALS SECTION                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Bali Vacation                                    │  │
│  │ Target: Rp 10.000.000  |████████░░░░░░░░░░░░░░| 25%│
│  │ Current: Rp 2.500.000  |  Rp 7.500.000 remaining   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  RECENT TRANSACTIONS                                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Date      │ Category      │ Amount    │ Status   │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ May 26    │ Food          │ -150.000  │ Expense  │  │
│  │ May 26    │ Transportation│ -100.000  │ Expense  │  │
│  │ May 25    │ Salary        │ +5.000.000│ Income   │  │
│  │ May 25    │ Shopping      │ -500.000  │ Expense  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [View All Transactions]                                │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  AI RECOMMENDATIONS                                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Your food spending increased 30% this week.     │  │
│  │ Consider reducing dining out to save more.      │  │
│  │                                                 │  │
│  │ At your current savings rate, you'll reach      │  │
│  │ your Bali goal in 4 months!                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Transactions Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HEADER                                                 │
│  Transactions                                           │
│  [Add Transaction] [Upload Receipt]                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FILTERS                                                │
│  Type: [All ▼] Category: [All ▼] Date: [May 2026 ▼]   │
│  [Search...]                                            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  TRANSACTION LIST                                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ May 26, 2026                                     │  │
│  │ ┌────────────────────────────────────────────┐  │  │
│  │ │ Food - Lunch at Restaurant                 │  │  │
│  │ │ -Rp 150.000                                │  │  │
│  │ │ 12:30 PM                                   │  │  │
│  │ └────────────────────────────────────────────┘  │  │
│  │ ┌────────────────────────────────────────────┐  │  │
│  │ │ Transportation - Grab                      │  │  │
│  │ │ -Rp 100.000                                │  │  │
│  │ │ 08:15 AM                                   │  │  │
│  │ └────────────────────────────────────────────┘  │  │
│  │                                                 │  │
│  │ May 25, 2026                                     │  │
│  │ ┌────────────────────────────────────────────┐  │  │
│  │ │ Salary - Monthly Income                    │  │  │
│  │ │ +Rp 5.000.000                              │  │  │
│  │ │ 10:00 AM                                   │  │  │
│  │ └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  [Load More]                                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Add Transaction Modal

```
┌─────────────────────────────────────────────────────────┐
│  Add Transaction                                    [X] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Transaction Type                                       │
│  [Expense ▼]                                            │
│                                                         │
│  Category                                               │
│  [Select Category ▼]                                    │
│                                                         │
│  Amount                                                 │
│  [_____________________________]                        │
│                                                         │
│  Description                                            │
│  [_____________________________]                        │
│                                                         │
│  Date                                                   │
│  [May 26, 2026]                                         │
│                                                         │
│  Receipt Image (Optional)                               │
│  [Upload Image]                                         │
│                                                         │
│  [Cancel]  [Save Transaction]                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.4 Savings Goals Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HEADER                                                 │
│  Savings Goals                                          │
│  [Create New Goal]                                      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  GOALS LIST                                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Bali Vacation                                    │  │
│  │ Target: Rp 10.000.000  |████████░░░░░░░░░░░░░░| 25%│
│  │ Current: Rp 2.500.000                              │  │
│  │ Target Date: Dec 31, 2026 (219 days remaining)     │  │
│  │ Monthly Target: Rp 1.428.571                        │  │
│  │ [Edit] [Delete]                                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ New Laptop                                       │  │
│  │ Target: Rp 15.000.000  |████░░░░░░░░░░░░░░░░░░| 10%│
│  │ Current: Rp 1.500.000                              │  │
│  │ Target Date: Sep 30, 2026 (127 days remaining)     │  │
│  │ Monthly Target: Rp 3.750.000                        │  │
│  │ [Edit] [Delete]                                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 3.5 Profile Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PROFILE SECTION                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [Profile Photo]                                 │  │
│  │ John Doe                                         │  │
│  │ john@example.com                                 │  │
│  │ [Edit Profile]                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  SETTINGS SECTION                                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Reminder Settings                                │  │
│  │ Frequency: [Daily ▼]                             │  │
│  │ Time: [08:00 AM]                                 │  │
│  │                                                 │  │
│  │ Notifications                                    │  │
│  │ [✓] Email Notifications                         │  │
│  │ [✓] Push Notifications                          │  │
│  │ [✓] Spending Alerts                             │  │
│  │                                                 │  │
│  │ Privacy                                          │  │
│  │ [View Privacy Policy]                            │  │
│  │ [View Terms & Conditions]                        │  │
│  │                                                 │  │
│  │ [Save Changes]                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  ACCOUNT SECTION                                        │
│  [Change Password]  [Logout]  [Delete Account]         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Mobile Wireframes / Wireframe Mobile

### 4.1 Mobile Dashboard

```
┌──────────────────────────┐
│ MoneyAssist        [≡]   │
├──────────────────────────┤
│ Welcome, John!           │
│ Status: Controlled       │
│                          │
│ ┌────────────────────┐   │
│ │ Income             │   │
│ │ Rp 5.000.000       │   │
│ └────────────────────┘   │
│ ┌────────────────────┐   │
│ │ Expense            │   │
│ │ Rp 2.500.000       │   │
│ └────────────────────┘   │
│ ┌────────────────────┐   │
│ │ Balance            │   │
│ │ Rp 2.500.000       │   │
│ └────────────────────┘   │
│                          │
│ Expense by Category      │
│ [Pie Chart]              │
│                          │
│ Recent Transactions      │
│ Food - Rp 150.000        │
│ Transport - Rp 100.000   │
│ [View All]               │
│                          │
├──────────────────────────┤
│ [+] [📊] [🎯] [👤]      │
└──────────────────────────┘
```

### 4.2 Mobile Add Transaction

```
┌──────────────────────────┐
│ Add Transaction      [X] │
├──────────────────────────┤
│                          │
│ Type                     │
│ [Expense ▼]              │
│                          │
│ Category                 │
│ [Select ▼]               │
│                          │
│ Amount                   │
│ [_________________]      │
│                          │
│ Description              │
│ [_________________]      │
│                          │
│ Date                     │
│ [May 26, 2026]           │
│                          │
│ [Upload Receipt]         │
│                          │
│ [Cancel] [Save]          │
│                          │
└──────────────────────────┘
```

---

## 5. Component Specifications / Spesifikasi Komponen

### 5.1 Button Component

```
Primary Button:
- Background: #1E40AF
- Text: White
- Padding: 12px 24px
- Border Radius: 6px
- Font Size: 14px
- Font Weight: 600
- Hover: Background #0C2340
- Active: Background #0A1F3F

Secondary Button:
- Background: #F3F4F6
- Text: #1F2937
- Border: 1px #E5E7EB
- Padding: 12px 24px
- Border Radius: 6px
- Hover: Background #E5E7EB
```

### 5.2 Card Component

```
- Background: White
- Border Radius: 8px
- Padding: 16px
- Box Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
- Border: 1px #E5E7EB
- Hover Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
```

### 5.3 Input Field Component

```
- Background: White
- Border: 1px #E5E7EB
- Border Radius: 6px
- Padding: 12px
- Font Size: 14px
- Focus Border: 2px #1E40AF
- Focus Shadow: 0 0 0 3px rgba(30, 64, 175, 0.1)
```

### 5.4 Badge Component

```
Success (Green):
- Background: #ECFDF5
- Text: #047857
- Padding: 4px 12px
- Border Radius: 9999px
- Font Size: 12px
- Font Weight: 600

Warning (Orange):
- Background: #FEF3C7
- Text: #92400E
- Padding: 4px 12px
- Border Radius: 9999px

Error (Red):
- Background: #FEE2E2
- Text: #991B1B
- Padding: 4px 12px
- Border Radius: 9999px
```

---

## 6. Responsive Design / Desain Responsif

### 6.1 Breakpoints

```
Mobile: 320px - 640px
Tablet: 641px - 1024px
Desktop: 1025px+
```

### 6.2 Layout Adjustments

```
Mobile:
- Single column layout
- Full-width cards
- Bottom navigation
- Hamburger menu

Tablet:
- Two column layout
- Sidebar navigation
- Optimized spacing

Desktop:
- Multi-column layout
- Full sidebar
- Expanded features
```

---

## 7. Animation & Transitions / Animasi dan Transisi

```
Standard Transition: 200ms ease-in-out
Hover Effects: 150ms ease-out
Page Transitions: 300ms ease-in-out
Loading Animation: Smooth spinner
Success Animation: Checkmark with scale
Error Animation: Shake effect
```

---

## 8. Accessibility / Aksesibilitas

```
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly
- Color contrast ratio 4.5:1 minimum
- Focus indicators visible
- Alt text for images
- Semantic HTML
- ARIA labels where needed
```

---

**Document End**
