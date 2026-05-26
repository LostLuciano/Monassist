# Mobile App Design - MoneyAssist
# Desain Aplikasi Mobile - MoneyAssist

**Version:** 1.0.0  
**Platform:** iOS & Android  
**Design Approach:** Native Mobile App Experience

---

## 1. Mobile Design Principles / Prinsip Desain Mobile

### 1.1 Key Principles

```
1. Touch-First Design
   - Large touch targets (minimum 44x44pt)
   - Comfortable thumb reach zones
   - Gesture-based navigation

2. Vertical Scrolling
   - Content flows top to bottom
   - Minimal horizontal scrolling
   - Clear visual hierarchy

3. Bottom Navigation
   - Primary navigation at bottom
   - Easy thumb access
   - Maximum 5 tabs

4. Full-Screen Experience
   - Maximize content area
   - Minimal chrome/UI elements
   - Immersive experience

5. Performance
   - Fast load times
   - Smooth animations
   - Minimal data usage
```

### 1.2 Safe Areas & Notches

```
iOS:
- Top safe area: 44pt (notch) or 20pt (no notch)
- Bottom safe area: 34pt (home indicator) or 0pt
- Side margins: 16pt minimum

Android:
- Top safe area: 24pt (status bar)
- Bottom safe area: 0pt (system navigation)
- Side margins: 16pt minimum
```

---

## 2. Guest Mode Mobile Screens / Layar Mode Tamu Mobile

### 2.1 Mobile Landing Page - Screen 1: Hero

```
┌─────────────────────────────┐
│ ▲ Status Bar (Dark)         │
├─────────────────────────────┤
│                             │
│  MoneyAssist                │
│  Your AI Financial          │
│  Assistant                  │
│                             │
│  [Hero Image/Illustration]  │
│                             │
│  Welcome to MoneyAssist     │
│  Manage your finances       │
│  with AI assistance         │
│                             │
│  [Start Free Trial]         │
│  [Learn More]               │
│                             │
├─────────────────────────────┤
│ [Home] [Features] [About]   │
└─────────────────────────────┘
```

**Specifications:**
- Screen Height: Full viewport
- Hero Image: 280x280pt
- Button Size: 48pt height
- Font: 28pt heading, 16pt body
- Spacing: 16pt margins

---

### 2.2 Mobile Landing Page - Screen 2: AI Chat

```
┌─────────────────────────────┐
│ ▲ Status Bar                │
├─────────────────────────────┤
│                             │
│  MoneyAssist AI             │
│  ─────────────────────────  │
│                             │
│  Welcome! I'm MoneyAssist,  │
│  your AI financial          │
│  assistant.                 │
│                             │
│  I can help you:            │
│  • Understand spending      │
│  • Set savings goals        │
│  • Get recommendations      │
│                             │
│  Sample Questions:          │
│  ┌─────────────────────┐   │
│  │ How to save money?  │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ Reduce spending?    │   │
│  └─────────────────────┘   │
│  ┌─────────────────────┐   │
│  │ Set goals?          │   │
│  └─────────────────────┘   │
│                             │
│  [Type message...]          │
│                    [Send]   │
│                             │
├─────────────────────────────┤
│ [Home] [Features] [About]   │
└─────────────────────────────┘
```

**Specifications:**
- Chat bubble width: 280pt
- Button height: 44pt
- Font: 14pt body, 12pt caption
- Padding: 16pt horizontal, 12pt vertical

---

### 2.3 Mobile Landing Page - Screen 3: Features

```
┌─────────────────────────────┐
│ ▲ Status Bar                │
├─────────────────────────────┤
│                             │
│  Features                   │
│                             │
│  ┌─────────────────────┐   │
│  │ Dashboard           │   │
│  │ [Icon]              │   │
│  │ Overview keuangan   │   │
│  │ Anda dengan jelas   │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Transactions        │   │
│  │ [Icon]              │   │
│  │ Catat pengeluaran   │   │
│  │ dengan mudah        │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Savings Goals       │   │
│  │ [Icon]              │   │
│  │ Buat dan pantau     │   │
│  │ target tabungan     │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ AI Chat             │   │
│  │ [Icon]              │   │
│  │ Dapatkan saran      │   │
│  │ personal dari AI    │   │
│  └─────────────────────┘   │
│                             │
│  [Login] [Sign Up]          │
│                             │
├─────────────────────────────┤
│ [Home] [Features] [About]   │
└─────────────────────────────┘
```

**Specifications:**
- Card width: Full width - 32pt margins
- Card height: 120pt
- Icon size: 48x48pt
- Font: 16pt title, 14pt description

---

### 2.4 Mobile Login Screen

```
┌─────────────────────────────┐
│ ▲ Status Bar                │
├─────────────────────────────┤
│                             │
│  MoneyAssist                │
│  [Logo]                     │
│                             │
│  Welcome Back               │
│                             │
│  Email Address              │
│  ┌─────────────────────┐   │
│  │ [email@example.com] │   │
│  └─────────────────────┘   │
│                             │
│  Password                   │
│  ┌─────────────────────┐   │
│  │ [••••••••••]        │   │
│  └─────────────────────┘   │
│                             │
│  [Remember me]              │
│  [Forgot password?]         │
│                             │
│  [Sign In]                  │
│                             │
│  Don't have account?        │
│  [Sign Up]                  │
│                             │
├─────────────────────────────┤
│ [Home] [Features] [About]   │
└─────────────────────────────┘
```

**Specifications:**
- Input field height: 48pt
- Button height: 48pt
- Font: 16pt body, 14pt labels
- Padding: 16pt horizontal

---

### 2.5 Mobile Register Screen

```
┌─────────────────────────────┐
│ ▲ Status Bar                │
├─────────────────────────────┤
│                             │
│  Create Account             │
│                             │
│  Full Name                  │
│  ┌─────────────────────┐   │
│  │ [John Doe]          │   │
│  └─────────────────────┘   │
│                             │
│  Email Address              │
│  ┌─────────────────────┐   │
│  │ [email@example.com] │   │
│  └─────────────────────┘   │
│                             │
│  Password                   │
│  ┌─────────────────────┐   │
│  │ [••••••••••]        │   │
│  └─────────────────────┘   │
│  Min 8 characters           │
│                             │
│  Confirm Password           │
│  ┌─────────────────────┐   │
│  │ [••••••••••]        │   │
│  └─────────────────────┘   │
│                             │
│  [✓] I agree to Terms       │
│                             │
│  [Create Account]           │
│                             │
│  Already have account?      │
│  [Login]                    │
│                             │
├─────────────────────────────┤
│ [Home] [Features] [About]   │
└─────────────────────────────┘
```

---

## 3. Authenticated Mode Mobile Screens / Layar Mode Terautentikasi Mobile

### 3.1 Mobile Dashboard - Screen 1: Overview

```
┌─────────────────────────────┐
│ ▲ Status Bar                │
├─────────────────────────────┤
│ Welcome, John!          [≡] │
│ Status: Controlled (Green)  │
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐   │
│  │ Total Income        │   │
│  │ Rp 5.000.000        │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Total Expense       │   │
│  │ Rp 2.500.000        │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Balance             │   │
│  │ Rp 2.500.000        │   │
│  └─────────────────────┘   │
│                             │
│  Expense by Category        │
│  [Pie Chart - Full Width]   │
│                             │
│  Food: 32%                  │
│  Transport: 24%             │
│  Shopping: 20%              │
│  Other: 24%                 │
│                             │
│  Recent Transactions        │
│  ┌─────────────────────┐   │
│  │ Food - Lunch        │   │
│  │ -Rp 150.000         │   │
│  │ Today, 12:30 PM     │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Transport - Grab    │   │
│  │ -Rp 100.000         │   │
│  │ Today, 08:15 AM     │   │
│  └─────────────────────┘   │
│                             │
│  [View All]                 │
│                             │
├─────────────────────────────┤
│ [+] [📊] [🎯] [👤]         │
└─────────────────────────────┘
```

**Specifications:**
- Card width: Full width - 16pt margins
- Card height: 100pt
- Chart height: 200pt
- Bottom nav height: 56pt
- Font: 14pt body, 12pt caption

---

### 3.2 Mobile Dashboard - Screen 2: Savings Goals

```
┌─────────────────────────────┐
│ ▲ Status Bar                │
├─────────────────────────────┤
│ Savings Goals           [≡] │
├─────────────────────────────┤
│                             │
│  [+ Create New Goal]        │
│                             │
│  ┌─────────────────────┐   │
│  │ Bali Vacation       │   │
│  │ Target: Rp 10M      │   │
│  │ ████████░░░░░░░░░░ │   │
│  │ 25% - Rp 2.5M       │   │
│  │ 219 days remaining  │   │
│  │ [Edit] [Delete]     │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ New Laptop          │   │
│  │ Target: Rp 15M      │   │
│  │ ████░░░░░░░░░░░░░░ │   │
│  │ 10% - Rp 1.5M       │   │
│  │ 127 days remaining  │   │
│  │ [Edit] [Delete]     │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Emergency Fund      │   │
│  │ Target: Rp 20M      │   │
│  │ ██░░░░░░░░░░░░░░░░ │   │
│  │ 5% - Rp 1M          │   │
│  │ 365 days remaining  │   │
│  │ [Edit] [Delete]     │   │
│  └─────────────────────┘   │
│                             │
├─────────────────────────────┤
│ [+] [📊] [🎯] [👤]         │
└─────────────────────────────┘
```

---

### 3.3 Mobile Add Transaction Screen

```
┌─────────────────────────────┐
│ ▲ Status Bar                │
├─────────────────────────────┤
│ Add Transaction         [X] │
├─────────────────────────────┤
│                             │
│  Type                       │
│  ┌─────────────────────┐   │
│  │ Expense ▼           │   │
│  └─────────────────────┘   │
│                             │
│  Category                   │
│  ┌─────────────────────┐   │
│  │ Select Category ▼   │   │
│  └─────────────────────┘   │
│                             │
│  Amount                     │
│  ┌─────────────────────┐   │
│  │ Rp [_____________]  │   │
│  └─────────────────────┘   │
│                             │
│  Description                │
│  ┌─────────────────────┐   │
│  │ [_____________]     │   │
│  └─────────────────────┘   │
│                             │
│  Date                       │
│  ┌─────────────────────┐   │
│  │ May 26, 2026 ▼      │   │
│  └─────────────────────┘   │
│                             │
│  [Upload Receipt]           │
│                             │
│  [Cancel] [Save]            │
│                             │
├─────────────────────────────┤
│ [+] [📊] [🎯] [👤]         │
└─────────────────────────────┘
```

---

### 3.4 Mobile Transactions List

```
┌─────────────────────────────┐
│ ▲ Status Bar                │
├─────────────────────────────┤
│ Transactions            [≡] │
│ [Add] [Upload Receipt]      │
├─────────────────────────────┤
│                             │
│  Filters                    │
│  [All ▼] [All ▼] [May ▼]   │
│  [Search...]                │
│                             │
│  May 26, 2026               │
│  ┌─────────────────────┐   │
│  │ Food - Lunch        │   │
│  │ -Rp 150.000         │   │
│  │ 12:30 PM            │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Transport - Grab    │   │
│  │ -Rp 100.000         │   │
│  │ 08:15 AM            │   │
│  └─────────────────────┘   │
│                             │
│  May 25, 2026               │
│  ┌─────────────────────┐   │
│  │ Salary - Income     │   │
│  │ +Rp 5.000.000       │   │
│  │ 10:00 AM            │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Shopping - Mall     │   │
│  │ -Rp 500.000         │   │
│  │ 03:45 PM            │   │
│  └─────────────────────┘   │
│                             │
│  [Load More]                │
│                             │
├─────────────────────────────┤
│ [+] [📊] [🎯] [👤]         │
└─────────────────────────────┘
```

---

### 3.5 Mobile Profile Screen

```
┌─────────────────────────────┐
│ ▲ Status Bar                │
├─────────────────────────────┤
│ Profile                 [≡] │
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐   │
│  │  [Profile Photo]    │   │
│  │  John Doe           │   │
│  │  john@example.com   │   │
│  │  [Edit Profile]     │   │
│  └─────────────────────┘   │
│                             │
│  Settings                   │
│  ┌─────────────────────┐   │
│  │ Reminder Settings   │   │
│  │ Daily at 08:00 AM   │   │
│  │ [Edit]              │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Notifications       │   │
│  │ [✓] Email           │   │
│  │ [✓] Push            │   │
│  │ [✓] Alerts          │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ Privacy & Security  │   │
│  │ [Change Password]   │   │
│  │ [Privacy Policy]    │   │
│  │ [Terms & Conditions]│   │
│  └─────────────────────┘   │
│                             │
│  [Logout]                   │
│  [Delete Account]           │
│                             │
├─────────────────────────────┤
│ [+] [📊] [🎯] [👤]         │
└─────────────────────────────┘
```

---

## 4. Bottom Navigation / Navigasi Bawah

### 4.1 Bottom Tab Bar

```
┌─────────────────────────────┐
│ [+]      [📊]    [🎯]   [👤]│
│ Add      Dashboard Goals Profile
│ Trans.   
└─────────────────────────────┘

Specifications:
- Height: 56pt (including safe area)
- Tab width: Equal distribution
- Icon size: 24x24pt
- Label size: 10pt
- Active color: #1E40AF
- Inactive color: #9CA3AF
- Background: White with top border
```

---

## 5. Mobile Gestures & Interactions / Gesture dan Interaksi Mobile

### 5.1 Supported Gestures

```
Tap:
- Button press
- Navigation
- Selection

Swipe:
- Horizontal: Tab navigation
- Vertical: Scroll content
- Left/Right: Go back/forward

Long Press:
- Context menu
- Edit/Delete options

Pull to Refresh:
- Refresh data
- Update transactions

Pinch:
- Zoom charts (optional)
```

### 5.2 Animations

```
Page Transition: 300ms slide
Button Press: 150ms scale
Loading: Smooth spinner
Success: Checkmark animation
Error: Shake effect
Scroll: Smooth momentum
```

---

## 6. Mobile Typography / Tipografi Mobile

```
Heading 1: 28px, Bold (700)
Heading 2: 24px, Bold (700)
Heading 3: 20px, Semi-bold (600)
Heading 4: 18px, Semi-bold (600)

Body Large: 16px, Regular (400)
Body: 14px, Regular (400)
Body Small: 12px, Regular (400)

Caption: 12px, Regular (400)
Overline: 11px, Semi-bold (600)

Line Height: 1.5 for body, 1.2 for headings
```

---

## 7. Mobile Spacing / Spacing Mobile

```
Safe Margins: 16pt horizontal
Card Padding: 16pt
Button Height: 48pt minimum
Input Height: 48pt minimum
Touch Target: 44x44pt minimum
Spacing Between Elements: 12pt or 16pt
```

---

## 8. Mobile Colors / Warna Mobile

```
Primary: #1E40AF (Blue)
Secondary: #10B981 (Green)
Accent: #F97316 (Orange)

Status:
- Success: #10B981 (Green)
- Warning: #F59E0B (Orange)
- Error: #EF4444 (Red)
- Info: #3B82F6 (Blue)

Neutral:
- White: #FFFFFF
- Light Gray: #F9FAFB
- Medium Gray: #E5E7EB
- Dark Gray: #374151
- Black: #111827
```

---

## 9. Mobile Safe Areas / Area Aman Mobile

### 9.1 iOS Safe Areas

```
Portrait:
- Top: 44pt (notch) or 20pt
- Bottom: 34pt (home indicator)
- Left/Right: 0pt

Landscape:
- Top: 0pt
- Bottom: 21pt
- Left/Right: 44pt (notch) or 0pt
```

### 9.2 Android Safe Areas

```
Portrait:
- Top: 24pt (status bar)
- Bottom: 0pt
- Left/Right: 0pt

Landscape:
- Top: 0pt
- Bottom: 0pt
- Left/Right: 0pt
```

---

## 10. Mobile Performance / Performa Mobile

```
Target Metrics:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3.5s

Optimization:
- Image compression
- Code splitting
- Lazy loading
- Caching strategy
- Minimal animations
```

---

## 11. Mobile Accessibility / Aksesibilitas Mobile

```
Touch Targets: 44x44pt minimum
Color Contrast: 4.5:1 minimum
Font Size: 14pt minimum
Readable Line Length: 40-60 characters
Screen Reader Support: Full
Keyboard Navigation: Full
Focus Indicators: Visible
```

---

## 12. Mobile Orientation / Orientasi Mobile

### 12.1 Portrait Mode (Primary)

```
- Full-width layout
- Vertical scrolling
- Bottom navigation
- Optimized for thumb reach
```

### 12.2 Landscape Mode (Secondary)

```
- Adjusted layout
- Horizontal scrolling for charts
- Side navigation (optional)
- Optimized for landscape viewing
```

---

## 13. Mobile Status Bar / Status Bar Mobile

### 13.1 iOS Status Bar

```
- Height: 44pt (notch) or 20pt
- Content: Time, signal, battery
- Style: Dark or Light
- Background: Transparent or Solid
```

### 13.2 Android Status Bar

```
- Height: 24pt
- Content: Time, signal, battery, notifications
- Style: Dark or Light
- Background: Transparent or Solid
```

---

## 14. Mobile Keyboard / Keyboard Mobile

```
Input Types:
- Text: Default keyboard
- Email: Email keyboard
- Number: Numeric keyboard
- Phone: Phone keyboard
- URL: URL keyboard

Keyboard Behavior:
- Dismiss on return
- Avoid covering input
- Adjust view on appearance
- Handle safe area
```

---

## 15. Mobile Notifications / Notifikasi Mobile

### 15.1 Push Notifications

```
Title: 30 characters max
Body: 150 characters max
Icon: 192x192pt
Image: 1200x628pt
Action Buttons: 2 maximum
```

### 15.2 In-App Notifications

```
Toast: Bottom, 3 seconds
Banner: Top, dismissible
Alert: Modal, requires action
Badge: Icon with count
```

---

## 16. Mobile App Icons / Ikon Aplikasi Mobile

```
App Icon Sizes:
- iOS: 180x180pt (3x), 120x120pt (2x), 60x60pt (1x)
- Android: 192x192dp, 144x144dp, 96x96dp, 72x72dp, 48x48dp

Splash Screen:
- iOS: 1125x2436pt (iPhone 12 Pro Max)
- Android: 1080x1920pt (xxhdpi)

Safe Area: 20% margin from edges
```

---

## 17. Mobile Testing / Testing Mobile

```
Devices to Test:
- iPhone 12, 13, 14, 15
- iPhone SE
- Samsung Galaxy S21, S22, S23
- Google Pixel 6, 7, 8
- Tablets: iPad, Samsung Tab

Orientations:
- Portrait
- Landscape

Network Conditions:
- 4G
- 3G
- WiFi
- Offline

Screen Sizes:
- Small: 320px
- Medium: 375px
- Large: 414px
- XL: 480px+
```

---

## 18. Mobile Responsive Breakpoints / Breakpoint Responsif Mobile

```
Extra Small (XS): 320px - 374px
Small (SM): 375px - 424px
Medium (MD): 425px - 767px
Large (LG): 768px - 1023px
Extra Large (XL): 1024px+

Mobile-First Approach:
- Design for mobile first
- Enhance for larger screens
- Progressive enhancement
```

---

## 19. Mobile App Store Guidelines / Panduan App Store Mobile

### 19.1 iOS App Store

```
- App Name: 30 characters max
- Subtitle: 30 characters max
- Description: 4000 characters max
- Keywords: 100 characters max
- Support URL: Required
- Privacy Policy URL: Required
- Screenshots: 2-5 per language
- Preview Video: Optional
```

### 19.2 Google Play Store

```
- App Name: 50 characters max
- Short Description: 80 characters max
- Full Description: 4000 characters max
- Screenshots: 2-8
- Feature Graphic: 1024x500px
- Icon: 512x512px
- Privacy Policy: Required
```

---

**Document End**
