# <img src="public/smart-mobility-roadcare-logo.png" height="40" alt="Smart Mobility Roadcare" /> Smart Mobility Roadcare

**Administration platform for Smart Mobility Roadcare roadside services.**

Smart Mobility Roadcare is a high-performance, real-time administration dashboard for roadside assistance. It features real-time geolocation tracking, secure internal communications, and a multi-layered permission system.

[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-F05A28?style=for-the-badge&logo=github)](LICENSE)

---

## ✨ Core Intelligence Modules

### 🚨 Command Center (Dashboard)
- **Real-Time Visualization**: Instant overview of service requests, active providers, and platform health.
- **Dynamic Metrics**: Data-driven calculations for acceptance rates, response times, and completion efficiency.
- **Intelligent Trends**: 7-day trailing analytics based on live operational data.

### 🛡️ Security & Access
- **Granular Permissions**: 4-tier action control (View, Add, Edit, Delete) for every module.
- **Two-Factor Authentication (2FA)**: Mandatory security layer for all administrative access.
- **System Audit Logs**: Complete trail of all administrative actions with side-by-side diff viewers.
- **Firewall Management**: Advanced IP-based access control and security rules.

### 🗺️ Live Operations Map
- **Geo-Tracking**: Real-time GPS tracking for active Mechanics and service requests.
- **Interactive Clusters**: High-performance rendering of dense service areas.
- **Status Context**: Visual indicators for en-route, arrived, and pending assignments.

### 💬 Admin Messenger (Internal)
- **Secure Persistence**: Centralized message history storage with automatic 24-hour cleanup.
- **Real-Time Sync**: Hybrid Polling + BroadcastChannel for instant communication across multiple tabs and users.
- **Team Communications**: Dedicated "Encrypted Tunnel" for internal administrative coordination.

---

## 🛠️ Technical Architecture

### Frontend Ecosystem
- **Framework**: Next.js 15+ (App Router, Turbopack)
- **Design System**: Custom Glassmorphism built with **Tailwind CSS 4**
- **Visualization**: Recharts for high-performance data rendering
- **Mapping**: Leaflet with custom Google-style theme implementation

### Backend & Data
- **Engine**: Node.js via Next.js API Routes
- **Persistence**: Hybrid SQLite + JSON Document Store (`json-db.ts`)
- **Persistence Layer**: Custom state management for dashboard configurations

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: 18.x or 20.x (Recommended)
- **Package Manager**: npm

### Installation
1. **Clone & Install**:
   ```bash
   git clone https://github.com/Vehix-Dev/Admin-Dashboard.git
   cd Admin-Dashboard
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env.local` file:
   ```env
   # Django backend API (served directly; no Next.js API proxy)
   NEXT_PUBLIC_API_URL=https://backend.vehix.ug
   NEXT_PUBLIC_APP_URL=http://201.79.44.165

   # Admin Credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password
   
   # Email Gateway (Gmail)
   GMAIL_USER=your_email@gmail.com
   GMAIL_APP_PASSWORD=your_app_password
   ```

3. **Launch Platform**:
   ```bash
   npm run dev
   ```

---

## 📁 System Blueprint

| Directory | Core Responsibility |
| :--- | :--- |
| `app/admin` | Core UI modules (Reports, Requests, Users, Wallet, etc.) |
| `app/api` | REST endpoints for internal operations and CRM data |
| `components/global` | Mission-critical platform components (Messenger, Command Center) |
| `lib/` | Core logic engines (`auth.ts`, `api.ts`, `json-db.ts`) |

---

## 🎨 Professional Design Philosophy

The platform utilizes a **Mantis-inspired design system** with specific brand alignment:
- **Brand Navy (#1F2A44)**: Precision and Professionalism (used in Navigation & Core Borders)
- **Brand Orange (#F05A28)**: Action and Urgency (used for Primary CTAs & Highlights)
- **Glassmorphism**: Visual depth with `backdrop-filter` for a premium, modern feel.

---

## 🔐 Security Policy

Security is a primary pillar of the Smart Mobility Roadcare administration platform. We use modern authentication standards and granular permission guards. For more details, see [SECURITY.md](SECURITY.md).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Smart Mobility Roadcare — roadside assistance operations.**
