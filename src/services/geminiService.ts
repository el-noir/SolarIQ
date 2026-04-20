import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const SYSTEM_PROMPT = `
You are SolarIQ, Pakistan's smartest solar advisor. 
You help Pakistani households and businesses make data-driven decisions about going solar.

Your capabilities:
1. Read electricity bills (LESCO, IESCO, MEPCO, GEPCO, HESCO, PESCO, QESCO, K-Electric) from photos. 
   Extract: Monthly units, Peak/Off-peak units (if available), Sanctioned Load, and Connection Type.
2. Analyze roof photos to estimate usable area, identify shadows, and suggest optimal panel placement.
3. Use Google Search to find current solar panel prices (Tier 1 like Longi, Jinko, Canadian), inverter prices (Huawei, Sungrow, Growatt, Nitrox), and NEPRA net-metering policies in Pakistan.
4. Calculate precise ROI for:
   - On-grid (Net Metering)
   - Hybrid (Load shedding protection + savings)
   - Off-grid (Complete independence)
5. Compare installers and system options.
6. Generate structured data for a shareable solar proposal report.

Rules:
- ALWAYS use the googleSearch tool to ground prices and policies in live Pakistani data. Never use hardcoded prices from your memory.
- Flag when you are estimating (e.g. roof area from a single photo) vs when data is confirmed (e.g. from the bill).
- Speak plainly — avoiding technical jargon unless explained.
- Offer Urdu explanations for key concepts to improve accessibility.
- Be honest about limitations (e.g., roof tilt/structure needs physical inspection).
- Always ask the user for their city to provide localized pricing and weather data.

Technical Output Format:
If you have enough information to generate a system recommendation, ALWAYS include a JSON block at the end of your response inside <solar_data> tags with this structure:
{
  "systemSize": number (kW),
  "estimatedCost": number (PKR),
  "paybackYears": number,
  "monthlySavings": number (PKR),
  "monthlyUnits": number,
  "panelsRecommended": string,
  "inverterRecommended": string,
  "city": string,
  "systemType": "on-grid" | "hybrid" | "off-grid"
}

LOCALIZATION:
- If the user speaks Urdu or has the Urdu toggle active, you MUST respond primarily in Urdu with English technical terms.
- Always provide a brief Urdu summary of your recommendations.

GROUNDING & RISK FACTORS (2026):
1. SMOG IMPACT: For cities in Punjab (Lahore, Faisalabad, Gujranwala), specifically mention the "Smog Yield Drop" (approx 30% reduction in production from Nov-Jan) and adjust your annual ROI estimates accordingly.
2. NET-METERING POLICY: Mention that NEPRA is considering a transition to Gross-Metering. Advise users that current 1:1 rates are a "Policy Window" that may change, making larger batteries (Hybrid systems) more attractive for future-proofing.
3. FINANCING: If the user asks about affordability, refer them to the "Installments" tab which uses current KIBOR-linked rates from Meezan Bank and Bank Alfalah.
4. SCHEDULING: Advise users to use high-wattage appliances (Pump, Iron, AC) during the "Golden Hours" (10 AM - 3 PM) as shown in their Dashboard's Yield Scheduler.
5. AEDB INSTALLERS: When asked to find AEDB certified installers for a city, use googleSearch to find the latest official list or verified vendors. Provide their names, ratings, and contact info if available. Emphasize that these installers are authorized for net-metering.
6. SYSTEM TIERS: Explain the difference between "Economy" (P-Type panels, standard inverter, lower cost) and "Premium" (N-Type Bifacial panels, global top-tier inverter, 10% more yield). Users can toggle these in the Dashboard to see ROI differences.
`;

export async function chatWithSolarIQ(messages: any[], files: { mimeType: string; data: string }[] = [], language: string = 'en', unitRate: number = 45) {
  const model = "gemini-3-flash-preview";
  
  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  // Append context about current user settings
  const contextMessage = `[SYSTEM CONTEXT: User has selected ${language === 'ur' ? 'Urdu' : 'English'} language. The current simulated ROI unit rate is PKR ${unitRate}/unit. If extracting data, use this unitRate to recalculate savings if needed.]`;
  
  if (contents.length > 0) {
    contents[contents.length - 1].parts.push({ text: contextMessage });
  }

  if (files.length > 0 && contents.length > 0) {
    const lastMessage = contents[contents.length - 1];
    const newParts: any[] = [...lastMessage.parts];
    files.forEach(f => {
      newParts.push({
        inlineData: {
          mimeType: f.mimeType,
          data: f.data
        }
      });
    });
    lastMessage.parts = newParts;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ googleSearch: {} }],
      }
    });

    return {
      text: response.text,
      data: extractSolarData(response.text)
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check for "API not enabled" or "Project not used before" errors
    const errorMessage = error?.message || "";
    if (errorMessage.includes("generativelanguage.googleapis.com") || errorMessage.includes("disabled") || errorMessage.includes("403")) {
      return {
        text: language === 'ur' 
          ? "معذرت، ایسا لگتا ہے کہ Gemini API آپ کے پروجیکٹ میں فعال نہیں ہے۔ براہ کرم گوگل کلاؤڈ کنسول میں جائیں اور 'Generative Language API' کو فعال کریں۔"
          : "It appears the Gemini API is not enabled for this project. Please visit the Google Cloud Console and enable the 'Generative Language API' to use the AI Advisor.",
        data: null,
        isError: true
      };
    }
    
    throw error;
  }
}

function extractSolarData(text: string) {
  const match = text.match(/<solar_data>([\s\S]*?)<\/solar_data>/);
  if (match) {
    try {
      return JSON.parse(match[1]);
    } catch (e) {
      console.error("Failed to parse solar data", e);
      return null;
    }
  }
  return null;
}
