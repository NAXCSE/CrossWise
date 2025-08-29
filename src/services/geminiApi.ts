import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(API_KEY);

export interface GeminiResponse {
  product_name: string;
  hs_code: string;
  duty_rate: string;
  base_price: number;
  destination_country: string;
  incentive_info: string;
}

export const queryGeminiAPI = async (userQuery: string): Promise<GeminiResponse> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
    You are an expert in Indian export compliance and HS code classification. 
    
    User Query: "${userQuery}"
    
    Please analyze the product and destination country mentioned in the query and provide a structured response with the following information:
    
    IMPORTANT: Respond ONLY with valid JSON in exactly this format:
    {
      "product_name": "extracted or inferred product name",
      "hs_code": "6-8 digit HS code for the product",
      "duty_rate": "duty rate percentage with % symbol (e.g., 10%)",
      "base_price": numeric_value_in_USD,
      "destination_country": "country name from query",
      "incentive_info": "brief description of applicable Indian export incentives for this product-country combination"
    }
    
    If the user query doesn't contain enough information, make reasonable assumptions based on common export scenarios for Indian SMBs.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const parsedData = JSON.parse(jsonMatch[0]) as GeminiResponse;
    
    // Validate required fields
    if (!parsedData.product_name || !parsedData.hs_code || !parsedData.destination_country) {
      throw new Error('Incomplete data from AI response');
    }
    
    return parsedData;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get AI response. Please try again.');
  }
};