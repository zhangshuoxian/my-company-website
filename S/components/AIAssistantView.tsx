
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, BrainCircuit, Activity, BarChart3, Bot, Loader2 } from 'lucide-react';
import { InventoryItem, Transaction } from '../types';
import { analyzeInventory, chatWithInventory } from '../services/geminiService';

interface AIAssistantViewProps {
  inventory: InventoryItem[];
  transactions: Transaction[];
}

const AIAssistantView: React.FC<AIAssistantViewProps> = ({ inventory, transactions }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    handleAnalyze();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatting]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeInventory(inventory, transactions);
    setAnalysis(result || "分析失败");
    setIsAnalyzing(false);
  };

  const handleSendChat = async () => {
    if (!chatQuery.trim()) return;
    
    const userText = chatQuery;
    setChatQuery('');
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    
    setIsChatting(true);
    const aiText = await chatWithInventory(userText, inventory);
    setChatHistory(prev => [...prev, { role: 'ai', text: aiText || "系统繁忙，请稍后再试。" }]);
    setIsChatting(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full min-h-[600px] animate-in fade-in duration-700">
      {/* Analysis Panel */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-xl text-white">
              <BrainCircuit size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">库存智能洞察</h3>
              <p className="text-xs text-slate-400">由 Gemini AI 实时分析</p>
            </div>
          </div>
          <button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing}
            className="p-2 text-slate-400 hover:text-purple-600 transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Activity size={20} />}
          </button>
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto">
          {isAnalyzing ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm font-medium">深度学习模型正在处理您的仓库大数据...</p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">
                {analysis}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-purple-50 flex items-center gap-3">
           <BarChart3 size={16} className="text-purple-600" />
           <span className="text-xs text-purple-700 font-medium">建议关注 SKU: GPU-NVD-4080-002 的出库趋势</span>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white border border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold">库存智能助手</h3>
            <p className="text-xs text-slate-400">您可以询问具体库存数量或存放位置</p>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-12 opacity-40">
              <Bot size={48} className="mb-4" />
              <p className="text-sm">“三星硬盘还有多少个？”<br/>“RTX 4080 放在哪里了？”</p>
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isChatting && (
            <div className="flex justify-start">
               <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none flex gap-2">
                 <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-slate-800/50 border-t border-slate-800">
          <div className="relative">
            <input 
              type="text" 
              placeholder="输入您的问题..."
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-5 pr-14 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              value={chatQuery}
              onChange={(e) => setChatQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
            />
            <button 
              onClick={handleSendChat}
              disabled={isChatting}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 p-3 rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 shadow-lg shadow-blue-900/20"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantView;
