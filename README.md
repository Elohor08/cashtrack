# 💸 CashTrack

**CashTrack** is a smart finance and habit-building Progressive Web App (PWA) designed to help you effortlessly track income, expenses, and savings. Take control of your financial journey by organizing your money into dedicated pockets, planning meticulous budgets, and building better spending habits through data-driven insights, reminders, and motivational quotes.

---

## 🌟 Key Features

- 💼 **Pocket Management**: Organize your finances into custom pockets (e.g., Salary, Business, Side Hustle, Savings).
- 📊 **Transaction Tracking**: Easily log your daily income and expenses. Track exactly where your money goes with clear visualizations.
- 🎯 **Smart Budgeting**: Set monthly budgets for specific categories (Food, Transport, Rent) and monitor your spending limits in real time.
- 💡 **AI-Powered Insights**: Get personalized, actionable financial advice based on your recent spending behaviors to help you build better long-term habits.
- 🔔 **Alerts & Motivation**: Receive notifications when approaching budget limits, along with daily financial motivation quotes to keep you on track.
- 📱 **Progressive Web App (PWA)**: Installable on both desktop and mobile devices for a native-like experience.

## 🛠️ Technology Stack

CashTrack is built as a complete Full-Stack web application using modern, industry-standard tools:
- **Framework**: [Next.js (App Router)](https://nextjs.org/) for both React components and Serverless API Route Handlers.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a fully responsive, beautiful, and highly polished interface.
- **Icons**: [Lucide React](https://lucide.dev/) for crisp SVGs.
- **Database**: [MongoDB](https://www.mongodb.com/) via Mongoose for robust data persistence.
- **Charts**: [Recharts](https://recharts.org/) for beautiful, responsive pie charts and data visualization.
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` for secure password hashing.
- **AI Integration**: [OpenAI API](https://openai.com/) to process transactions and return actionable financial insights.

## 🚀 Getting Started

To run CashTrack locally on your machine, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) connection string (or local MongoDB server)
- An [OpenAI](https://openai.com/) API Key for the AI Insights feature.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/yourusername/cashtrack.git
   cd cashtrack
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` (or `.env`) file in the root of the project and define the necessary keys:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cashtrack
   JWT_SECRET=your_super_secret_jwt_key
   OPENAI_API_KEY=sk-your-openai-api-key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser. 

## 🏗️ Project Structure
```text
cashtrack-next/
├── src/
│   ├── app/                 # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── (dashboard)/     # Authenticated pages (Dashboard, Pockets, Budgets)
│   │   ├── api/             # API Route Handlers (Auth, Pockets, AI, etc.)
│   │   ├── login/           # Login Page
│   │   └── signup/          # Signup Page
│   ├── components/          # Reusable UI Components (Layout, Providers)
│   ├── context/             # React Context for Global State (Auth, Data)
│   └── lib/                 # Core Utilities
│       ├── db.js            # MongoDB Singleton Database Connection
│       ├── auth.js          # JWT Verification Logic
│       └── models/        # Mongoose Schemas (User, Budget, Pocket, Transaction)
```

## 📜 License

This project is licensed under the MIT License - feel free to build upon it and use it for your own financial journey!
