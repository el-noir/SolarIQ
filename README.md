# ☀️ SolarIQ: Pakistan's Smartest Solar Advisor

SolarIQ is a high-performance, mobile-first web application designed to help Pakistani households and businesses transition to solar energy with confidence. It combines professional-grade financial modeling with advanced AI-driven analysis to provide accurate, localized solar recommendations.

## 🚀 Key Features

### 1. AI-Powered Advisor (Chat)
*   **Bilingual Support:** Full support for English and Urdu (Noto Nastaliq) with a "Mobile-First" luxury UI.
*   **Bill Analysis (OCR):** Multimodal processing for automatic unit extraction from bill photos.
*   **Hybrid AI Agency (Grounded):** Combines **Google Search** for live market prices with **Custom Function Calling** for deterministic ROI calculations.
*   **Trust Indicators:** Visual "Live Market Data" verification badges for grounded AI responses.

### 2. Intelligent ROI Dashboard
*   **Mind of SolarIQ:** Dedicated technical specs modal (#VibeKaregaPakistan) detailing the AI model architecture and tool selection for hackathon evaluation.
*   **Production Forecasting:** Hourly yield estimation based on local weather and smog patterns (Punjab specific).
*   **Hardware Sensitivity:** Compare "Economy" vs. "Premium" hardware options with live ROI shifts.

### 3. Smart Scheduler
*   **Golden Hours:** Visualization of peak production windows (10 AM - 3 PM) to optimize appliance usage (AC, Pumps).
*   **Appliance Impact:** Real-time calculation of how high-wattage loads affect your battery and grid dependency.

### 4. Advanced Reliability
*   **Defensive Error Handling:** Specialized bilingal guidance for Gemini API lifecycle events (e.g., Service Disabled, 403 errors).
*   **Deterministic Logic:** Uses a custom `calculateROI` tool execution loop to eliminate AI hallucinations in financial projections.

## 🛠️ Tech Stack

*   **Frontend:** React 18 + Vite
*   **Styling:** Tailwind CSS (Mobile-First Design System)
*   **AI Engine:** Google Gemini SDK (`@google/genai`)
*   **Cloud Infrastructure:** Google Cloud Service (Cloud Run Ready)
*   **Modeling Tools:** Gemini Function Calling + Google Search Grounding

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
