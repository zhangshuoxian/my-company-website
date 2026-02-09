
import { GoogleGenAI } from "@google/genai";
import { InventoryItem, Transaction } from "../types";

// Analyze inventory health using gemini-3-flash-preview
export const analyzeInventory = async (items: InventoryItem[], transactions: Transaction[]) => {
  // Initialize ai instance with named apiKey parameter as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    作为仓库分析专家，请基于以下仓库数据提供分析报告。
    
    当前库存:
    ${JSON.stringify(items.map(i => ({ name: i.name, stock: i.quantity, min: i.minThreshold })))}
    
    最近交易:
    ${JSON.stringify(transactions.slice(0, 5))}
    
    请提供：
    1. 库存健康状况评估（哪些可能积压，哪些短缺）。
    2. 补货建议。
    3. 潜在风险点。
    
    请用专业且简洁的中文回复。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Access response text using the .text property
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "暂时无法获取AI分析报告，请稍后再试。";
  }
};

// Handle interactive chat with inventory context
export const chatWithInventory = async (query: string, items: InventoryItem[]) => {
  // Initialize ai instance with named apiKey parameter as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const context = `当前仓库库存信息：${JSON.stringify(items.map(i => `${i.name}(SKU:${i.sku}): ${i.quantity}${i.unit}`))}`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${context}\n\n用户问题：${query}`,
      config: {
        systemInstruction: "你是一个专业的仓库管理助手，请基于提供的库存信息回答用户的问题。如果信息中没有相关产品，请礼貌地告知。",
      }
    });
    // Access response text using the .text property
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "抱歉，我现在无法处理您的请求。";
  }
};

// Analyze specific product health based on selected history
export const analyzeProductHealth = async (item: InventoryItem, history: Transaction[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    作为仓库管理AI，请分析以下物料的库存情况。
    
    物料名称: ${item.name}
    当前库存: ${item.quantity} ${item.unit}
    预警阈值: ${item.minThreshold} ${item.unit}
    
    该时段出入库记录:
    ${JSON.stringify(history.map(t => ({ type: t.type, qty: t.quantity, time: t.timestamp })))}
    
    请根据消耗趋势判断：
    1. 是否需要立即备货？
    2. 预估目前的库存在当前消耗速度下还能维持多久？
    3. 给出简单的备货预警意见。
    
    回复请保持简洁、专业（50字左右）。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Product Analysis Error:", error);
    return "暂时无法进行AI预测分析。";
  }
};
