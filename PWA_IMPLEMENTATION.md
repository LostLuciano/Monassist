# Progressive Web App (PWA) Implementation - MoneyAssist
# Implementasi Progressive Web App (PWA) - MoneyAssist

**Version:** 1.0.0  
**Purpose:** Make web app work like native mobile app

---

## 1. PWA Overview / Gambaran PWA

### 1.1 What is PWA?

Progressive Web App adalah aplikasi web yang menggunakan teknologi modern untuk memberikan pengalaman seperti native app:

```
Features:
- Installable on home screen
- Works offline
- Push notifications
- Fast loading
- Responsive design
- Secure (HTTPS)
```

### 1.2 Benefits / Manfaat

```
For Users:
- No app store installation
- Smaller download size
- Works offline
- Fast performance
- Push notifications

For Business:
- Lower development cost
- Easier updates
- Better SEO
- Cross-platform
- Higher engagement
```

---

## 2. PWA Manifest / Manifest PWA

### 2.1 manifest.json

```json
{
  "name": "MoneyAssist - Personal Finance Assistant",
  "short_name": "MoneyAssist",
  "description": "AI-powered personal finance management application",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#1E40AF",
  "background_color": "#FFFFFF",
  "categories": ["finance", "productivity"],
  "screenshots": [
    {
      "src": "/images/screenshot-1.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/images/screenshot-2.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "icons": [
    {
      "src": "/images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/images/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/images/icon-maskable-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/images/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Add Transaction",
      "short_name": "Add",
      "description": "Quickly add a new transaction",
      "url": "/transactions/add",
      "icons": [
        {
          "src": "/images/shortcut-add.png",
          "sizes": "192x192"
        }
      ]
    },
    {
      "name": "View Dashboard",
      "short_name": "Dashboard",
      "description": "View your financial dashboard",
      "url": "/dashboard",
      "icons": [
        {
          "src": "/images/shortcut-dashboard.png",
          "sizes": "192x192"
        }
      ]
    }
  ],
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url",
      "files": [
        {
          "name": "receipt",
          "accept": ["image/*"]
        }
      ]
    }
  }
}
```

### 2.2 HTML Head Tags

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta Tags -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="AI-powered personal finance management">
  <meta name="theme-color" content="#1E40AF">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="MoneyAssist">
  
  <!-- Manifest -->
  <link rel="manifest" href="/manifest.json">
  
  <!-- Icons -->
  <link rel="icon" type="image/png" href="/images/favicon-32.png" sizes="32x32">
  <link rel="icon" type="image/png" href="/images/favicon-192.png" sizes="192x192">
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
  
  <!-- Splash Screen (iOS) -->
  <link rel="apple-touch-startup-image" href="/images/splash-1125x2436.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)">
  <link rel="apple-touch-startup-image" href="/images/splash-1170x2532.png" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)">
  
  <!-- Stylesheet -->
  <link rel="stylesheet" href="/styles/main.css">
  
  <title>MoneyAssist</title>
</head>
<body>
  <div id="root"></div>
  <script src="/js/main.js"></script>
</body>
</html>
```

---

## 3. Service Worker / Service Worker

### 3.1 service-worker.js

```javascript
const CACHE_NAME = 'moneyassist-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/js/main.js',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/offline.html'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network First Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - Network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets - Cache first
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          return caches.match('/offline.html');
        });
    })
  );
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncTransactions());
  }
});

async function syncTransactions() {
  try {
    const db = await openDB();
    const transactions = await db.getAll('pending-transactions');
    
    for (const transaction of transactions) {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}`
        },
        body: JSON.stringify(transaction)
      });
      
      await db.delete('pending-transactions', transaction.id);
    }
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
}

// Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/images/icon-192.png',
    badge: '/images/badge-72.png',
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});
```

### 3.2 Register Service Worker

```javascript
// In your main React component or app initialization
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
```

---

## 4. Offline Support / Dukungan Offline

### 4.1 Offline Page

```html
<!-- offline.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - MoneyAssist</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #f9fafb;
    }
    .container {
      text-align: center;
      padding: 20px;
    }
    .icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 24px;
      margin: 0 0 10px 0;
      color: #111827;
    }
    p {
      font-size: 16px;
      color: #6b7280;
      margin: 0 0 20px 0;
    }
    button {
      background: #1e40af;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
    }
    button:hover {
      background: #0c2340;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📡</div>
    <h1>You're Offline</h1>
    <p>It looks like you've lost your internet connection.</p>
    <p>Some features may not be available until you're back online.</p>
    <button onclick="location.reload()">Try Again</button>
  </div>
</body>
</html>
```

### 4.2 Offline Data Storage (IndexedDB)

```javascript
// db.js - IndexedDB wrapper
class MoneyAssistDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('MoneyAssist', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains('transactions')) {
          db.createObjectStore('transactions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('pending-transactions')) {
          db.createObjectStore('pending-transactions', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('goals')) {
          db.createObjectStore('goals', { keyPath: 'id' });
        }
      };
    });
  }

  async add(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async get(storeName, key) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAll(storeName) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async delete(storeName, key) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(storeName) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const db = new MoneyAssistDB();
```

---

## 5. Installation Prompt / Prompt Instalasi

### 5.1 Install Prompt Handler

```javascript
// installPrompt.js
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showInstallPrompt();
});

function showInstallPrompt() {
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.style.display = 'block';
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        installButton.style.display = 'none';
      }
    });
  }
}

window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  deferredPrompt = null;
});
```

### 5.2 Install Button Component (React)

```jsx
// InstallPrompt.jsx
import { useEffect, useState } from 'react';

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setInstallPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="install-prompt">
      <div className="install-content">
        <h3>Install MoneyAssist</h3>
        <p>Get quick access to your finances</p>
        <button onClick={handleInstall} className="btn-primary">
          Install
        </button>
        <button onClick={() => setShowPrompt(false)} className="btn-secondary">
          Not Now
        </button>
      </div>
    </div>
  );
}
```

---

## 6. Push Notifications / Notifikasi Push

### 6.1 Request Permission

```javascript
// notifications.js
async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

async function subscribeToPushNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.REACT_APP_VAPID_PUBLIC_KEY
      )
    });

    // Send subscription to backend
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(subscription)
    });

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
```

### 6.2 Send Notifications (Backend - Laravel)

```php
// NotificationController.php
use Illuminate\Support\Facades\Http;

class NotificationController extends Controller
{
    public function sendPushNotification(User $user, $title, $body, $data = [])
    {
        $subscriptions = $user->pushSubscriptions;

        foreach ($subscriptions as $subscription) {
            $this->sendToSubscription($subscription, $title, $body, $data);
        }
    }

    private function sendToSubscription($subscription, $title, $body, $data)
    {
        $payload = [
            'notification' => [
                'title' => $title,
                'body' => $body,
                'icon' => '/images/icon-192.png',
                'badge' => '/images/badge-72.png',
            ],
            'data' => $data
        ];

        Http::post('https://fcm.googleapis.com/fcm/send', [
            'to' => $subscription->endpoint,
            'notification' => $payload['notification'],
            'data' => $payload['data']
        ])->header('Authorization', 'key=' . config('services.fcm.key'));
    }
}
```

---

## 7. App Shell Architecture / Arsitektur App Shell

### 7.1 App Shell Pattern

```
App Shell:
├── HTML Structure (minimal)
├── CSS (critical path)
├── JavaScript (app logic)
└── Static Assets

Content:
├── Dynamic Data
├── User-specific Content
└── Real-time Updates
```

### 7.2 Implementation

```jsx
// App.jsx
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      {!isOnline && <OfflineBanner />}
      
      {isAuthenticated && <Navbar />}
      
      <main className="app-content">
        <Outlet />
      </main>
      
      {isAuthenticated && <BottomNav />}
    </div>
  );
}
```

---

## 8. Performance Optimization / Optimasi Performa

### 8.1 Lighthouse Scores Target

```
Performance: 90+
Accessibility: 90+
Best Practices: 90+
SEO: 90+
PWA: 90+
```

### 8.2 Optimization Checklist

```
Code:
- [ ] Code splitting
- [ ] Tree shaking
- [ ] Minification
- [ ] Compression (gzip/brotli)

Images:
- [ ] Responsive images
- [ ] WebP format
- [ ] Lazy loading
- [ ] Compression

Fonts:
- [ ] System fonts
- [ ] Font subsetting
- [ ] Font loading strategy
- [ ] WOFF2 format

Caching:
- [ ] Service Worker caching
- [ ] HTTP caching headers
- [ ] Browser caching
- [ ] CDN caching

Network:
- [ ] HTTP/2
- [ ] Preconnect
- [ ] DNS prefetch
- [ ] Resource hints
```

---

## 9. Security / Keamanan

### 9.1 HTTPS Requirement

```
- All PWAs must be served over HTTPS
- Use valid SSL certificate
- Redirect HTTP to HTTPS
- Enable HSTS headers
```

### 9.2 Content Security Policy

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.moneyassist.com;
  frame-ancestors 'none';
```

---

## 10. Testing PWA / Testing PWA

### 10.1 Chrome DevTools

```
1. Open DevTools (F12)
2. Go to Application tab
3. Check Manifest
4. Check Service Worker
5. Check Storage
6. Run Lighthouse audit
```

### 10.2 Testing Checklist

```
- [ ] Manifest.json valid
- [ ] Service Worker registered
- [ ] Works offline
- [ ] Install prompt appears
- [ ] App installs successfully
- [ ] Push notifications work
- [ ] Responsive design
- [ ] Performance score > 90
- [ ] HTTPS enabled
- [ ] Icons display correctly
```

---

## 11. Deployment / Deployment

### 11.1 Build for Production

```bash
npm run build
```

### 11.2 Serve with HTTPS

```bash
# Using Vercel (automatic HTTPS)
vercel deploy

# Using Netlify (automatic HTTPS)
netlify deploy

# Using AWS S3 + CloudFront
aws s3 sync build/ s3://moneyassist-bucket/
```

### 11.3 Verify PWA

```bash
# Check manifest
curl https://moneyassist.com/manifest.json

# Check service worker
curl https://moneyassist.com/service-worker.js

# Run Lighthouse
lighthouse https://moneyassist.com
```

---

## 12. Browser Support / Dukungan Browser

```
Chrome: 40+
Firefox: 44+
Safari: 11.1+
Edge: 17+
Samsung Internet: 4+
Opera: 27+

Mobile:
iOS Safari: 11.3+
Chrome Android: 40+
Firefox Android: 68+
Samsung Internet: 4+
```

---

## 13. Troubleshooting / Troubleshooting

### Issue: Service Worker not registering

```javascript
// Check browser console
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Registered:', reg))
    .catch(err => console.error('Failed:', err));
}
```

### Issue: Install prompt not showing

```
- Check manifest.json is valid
- Check HTTPS is enabled
- Check icons are accessible
- Check start_url is correct
- Wait 30 seconds after first visit
```

### Issue: Push notifications not working

```
- Check notification permission granted
- Check service worker is active
- Check VAPID keys are correct
- Check backend is sending notifications
```

---

**Document End**
