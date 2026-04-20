# ☀️ SolarIQ: Pakistan's Smartest Solar Advisor

SolarIQ is a high-performance, mobile-first web application designed to help Pakistani households and businesses transition to solar energy with confidence. It combines professional-grade financial modeling with advanced AI-driven analysis to provide accurate, localized solar recommendations.

## 🚀 Key Features

### 1. AI-Powered Advisor (Chat)
*   **Bilingual Support:** Full support for English and Urdu (Noto Nastaliq) with a "Mobile-First" luxury UI.
*   **Bill Analysis (OCR):** Upload photos of your electricity bill (LESCO, K-Electric, etc.) for automatic unit extraction.
*   **Real-time Grounding:** Uses Google Search to fetch live Tier-1 solar panel prices and current NEPRA net-metering policies.

### 2. Intelligent ROI Dashboard
*   **Production Forecasting:** Hourly yield estimation based on local weather and smog patterns (Punjab specific).
*   **Scenario Comparison:** Instantly switch between **On-Grid**, **Hybrid**, and **Off-Grid** configurations to see payback periods.
*   **System Tiers:** Compare "Economy" vs. "Premium" hardware options.

### 3. Smart Scheduler
*   **Golden Hours:** Visualization of peak production windows (10 AM - 3 PM) to optimize appliance usage (AC, Pumps).
*   **Appliance Impact:** Real-time calculation of how high-wattage loads affect your battery and grid dependency.

### 4. Financing & Installments
*   **KIBOR-linked Rates:** Financing calculator featuring current rates from major Pakistani banks (Meezan, Alfalah).
*   **Net Monthly Impact:** Visualizes the true cost-benefit after subtracting solar savings from monthly installments.

## 🛠️ Tech Stack

*   **Frontend:** React 18 + Vite
*   **Styling:** Tailwind CSS (Mobile-First Design System)
*   **AI Engine:** Google Gemini API (`@google/genai`)
*   **Animations:** Framer Motion (`motion/react`)
*   **Charts:** Recharts
*   **Icons:** Lucide React

## 🇵🇰 Pakistan-Specific Logic
*   **Smog Yield Adjustment:** Accounts for 30% production drops in major Punjab cities during winter (Nov-Jan).
*   **Policy Awareness:** Alerts users to NEPRA's shift towards Gross Metering and advises on battery future-proofing.
*   **Vendor Verification:** Direct grounding to find AEDB-certified installers near the user's city.

## 🚦 Getting Started

### Prerequisites
*   Node.js 18+
*   Google Gemini API Key

### Installation
1.  Clone the repository
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables in `.env`:
    ```env
    GEMINI_API_KEY=your_key_here
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

## 🛡️ Disclaimer
SolarIQ provides estimates based on typical data and AI analysis. Roof conditions, shading, and local grid stability vary. Always consult with an AEDB-certified solar engineer for a physical site inspection before making a purchase.

---
*Built with ❤️ for a Greener Pakistan.*
