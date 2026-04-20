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
  "panelsRecommended": string,
  "inverterRecommended": string,
  "city": string,
  "systemType": "on-grid" | "hybrid" | "off-grid"
}
`;

export async function chatWithSolarIQ(messages: any[], files: { mimeType: string; data: string }[] = []) {
  const model = "gemini-3-flash-preview";
  
  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

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
