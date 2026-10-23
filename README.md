# AuraAgent: Multi-Agent AI Business Manager & Booking System

An ultra-modern, autonomous multi-agent business manager and appointment booking platform built with **React (Next.js 16 App Router)**, **Tailwind CSS**, **Framer Motion**, and a simulated **MongoDB / Mongoose** backend architecture.

---

## 🌟 Key Highlights & Architecture

### 1. Multi-Agent Swarm Intelligence
- **Agent Nova (Front-Desk AI Coordinator)**: Handles customer intake, conversational natural language understanding, entity extraction (date, time, service track), and triggers the interactive booking confirmation flow.
- **Agent Atlas (Resource & Calendar Optimization Agent)**: Performs real-time schedule conflict resolution, checks slot availability, coordinates reschedules/postponements, and synchronizes the dynamic calendar matrix.
- **Agent Vera (Policy & Compliance Guardian)**: Verifies cancellation rules and windows, issues credit tokens, enforces policy compliance, and writes immutable audit traces.
- **Agent Nexus (Business Analytics & Revenue Manager)**: Aggregates real-time KPIs, calculates projected MRR, tracks capacity velocity, and monitors agent swarm workloads.

### 2. Design System & UI/UX Guidelines (Ultra-Modern)
- **Theme**: Ultra-clean Light Theme on `#FAFAFA` with animated multi-layer Mesh Gradients (Electric Blue `#3B82F6` and Soft Violet `#8B5CF6`).
- **Glassmorphism**: Translucent panels (`backdrop-blur-md`), subtle white borders (`border-white/80`), gentle soft drop shadows, and delicate glare reflections.
- **Typography**: Geometric modern typography with **Plus Jakarta Sans** and **JetBrains Mono**.
- **Bento Box Grid**: Dashboard displaying animated counters for *Total Bookings*, *Active AI Sessions*, *Pipeline Revenue*, and *AI Accuracy*.
- **Interactions**: Micro-animations with Framer Motion, hover lifts, glow pulses, and celebratory `canvas-confetti` upon booking confirmation.

---

## 📁 Clean Component-Based Architecture

```
/
├── .env                              # MongoDB connection string & agent configurations
├── .env.example                      # Production environment template
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── bookings/             # GET, POST /api/bookings
│   │   │   ├── bookings/[id]/        # GET, PUT, DELETE /api/bookings/:id
│   │   │   ├── audit-logs/           # GET, POST /api/audit-logs
│   │   │   ├── stats/                # GET /api/stats (Bento metrics)
│   │   │   └── command/              # POST /api/command (Multi-agent orchestration)
│   │   ├── globals.css               # Glassmorphism utilities & mesh gradient keyframes
│   │   ├── layout.tsx                # Plus Jakarta Sans font & metadata setup
│   │   └── page.tsx                  # Master application orchestrator
│   ├── components/
│   │   ├── ui/                       # Button, GlassCard, Badge, Modal, Input, Counter, MeshGradient, Toast
│   │   └── layout/                   # Sidebar, Topbar, Logo
│   ├── context/
│   │   └── AgentContext.tsx          # React Context connecting UI to mockMongo with reactive events
│   ├── features/
│   │   ├── booking/                  # CommandChat, CommandVisualizer, BookingConfirmModal, Postpone & Cancel modals
│   │   └── admin/                    # OverviewBentoGrid, DynamicBookingCalendar, AiAuditLog, MongoSchemaManager
│   ├── services/
│   │   ├── commandParser.ts          # NLP entity extractor & intent classifier
│   │   └── mockMongo/
│   │       ├── index.ts              # In-memory Mongoose simulator with subscriber bus
│   │       ├── seedData.ts           # Realistic seed appointments and audit logs
│   │       └── models/
│   │           ├── Booking.ts        # Mongoose schema comments + find, findById, create, updateOne
│   │           └── AuditLog.ts       # Mongoose schema comments + find, create
│   └── types/                        # Core TypeScript models and interfaces
```

---

## ⚡ Actionable Commands to Test

1. **Book a slot**:
   ```
   "Book a slot for tomorrow at 10:00 AM"
   "Book a slot for Friday at 2:00 PM for System Architecture"
   ```
   *Triggers the sleek animated glass modal confirming the booking with celebratory confetti.*

2. **Postpone a booking**:
   ```
   "Postpone my booking to Monday at 04:00 PM"
   "Reschedule my appointment to Friday"
   ```
   *Agent Atlas checks schedule conflicts, updates the MongoDB document status to `RESCHEDULED`, and shows a success toast.*

3. **Cancel a booking**:
   ```
   "Cancel my booking"
   ```
   *Prompts the glass-styled confirmation box where Agent Vera verifies policy compliance and marks the record as `CANCELLED`.*

---

## 🍃 Connecting Real MongoDB (Atlas or Local)

The codebase is 100% prepared for instant plug-and-play with real MongoDB:

1. **Configure `.env`**:
   ```env
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/multi_agent_db?retryWrites=true&w=majority"
   MONGODB_DB_NAME="multi_agent_db"
   USE_REAL_MONGODB="true"
   ```
2. **Install Mongoose**:
   ```bash
   npm install mongoose
   ```
3. **Uncomment Schemas**:
   In [src/services/mockMongo/models/Booking.ts](file:///f:/Multi-Agent/src/services/mockMongo/models/Booking.ts) and [src/services/mockMongo/models/AuditLog.ts](file:///f:/Multi-Agent/src/services/mockMongo/models/AuditLog.ts), uncomment the provided `new mongoose.Schema({...})` blocks.

---

## 🚀 Getting Started

```bash
# Clone or navigate to the directory
cd f:/Multi-Agent

# Install dependencies (already installed)
npm install

# Run the Next.js Turbopack development server
npm run dev

# Open in your browser
http://localhost:3000
```
