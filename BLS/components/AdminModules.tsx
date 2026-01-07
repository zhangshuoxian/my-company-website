import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
// 👇 核心引用：防止白屏
import { DatabaseService } from '../services/db';
import { TechSpec, CategoryItem, NewsItem, HistoryEvent, CertificateItem, DownloadItem, Branch, PatternSpec, SocialItem, CustomPageData, CompanyStat, ContactInfo } from '../types';
import { CODE_DEFINITIONS } from '../constants';
// 🟢 这一步非常关键！请完整替换顶部的图标引入
import { 
    Trash2, Plus, Edit, X, ChevronRight, ChevronDown, ChevronLeft, Upload, 
    Layers, FileText, Mail, Table, Image as ImageIcon, LayoutDashboard, 
    Share2, ClipboardList, ListTree, History, ShieldCheck, DownloadCloud, 
    RefreshCw, ArrowRight, Building2, MapPin, Phone, Printer, CheckCircle, 
    Globe, 
    // 👇 这些是你之前底部删掉后缺失的图标，必须补在这里！
    User, Lock, Unlock, Shield, Clock, LogOut, Users, AlertTriangle
} from 'lucide-react';
// --- UI 工具: 文件上传组件 ---
const FileUploader = ({ onUpload, hint, sizeLimit = 2048 }: { onUpload: (base64: string) => void, hint?: string, sizeLimit?: number }) => {
    const fileInput = useRef<HTMLInputElement>(null);
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > sizeLimit * 1024) { alert(`文件超过限制 (${sizeLimit}KB)`); return; }
            const reader = new FileReader();
            reader.onloadend = () => { if (reader.result) onUpload(reader.result.toString()); };
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className="relative inline-flex items-center gap-2">
            <input type="file" ref={fileInput} className="hidden" accept="image/*,.pdf" onChange={handleFile} />
            <button type="button" onClick={() => fileInput.current?.click()} className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded border transition-colors shadow-sm"><Upload size={14} /></button>
            {hint && <span className="text-[10px] text-gray-400 whitespace-nowrap">{hint}</span>}
        </div>
    );
};

// 1. 全局设置
export const SettingsEditor = ({ showToast }: any) => {
    const { content, updateLogo, updateFooterRights } = useLanguage();
    if (!content) return null;
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
                <h3 className="font-black text-xl mb-8 flex items-center gap-3 text-brand-blue"><ImageIcon size={24}/> 品牌标志与版权声明</h3>
                <div className="space-y-8">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">网站 Logo</label>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-56 h-24 border-2 border-dashed border-gray-100 bg-gray-50 flex items-center justify-center rounded-2xl overflow-hidden p-4">
                                <img src={content.logo || ''} className="max-w-full max-h-full object-contain" alt="Logo" />
                            </div>
                            <div className="flex-grow space-y-3 w-full">
                                <FileUploader onUpload={async (b) => { await updateLogo(b); showToast('Logo已同步'); }} sizeLimit={1024} hint="建议透明PNG" />
                            </div>
                        </div>
                    </div>
                    <div><label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">页脚版权文字</label><input className="w-full border-2 p-4 rounded-xl text-sm font-bold bg-gray-50 focus:bg-white transition-all" value={content.footerRights || ''} onChange={e => updateFooterRights(e.target.value)} /></div>
                </div>
            </div>
        </div>
    );
};

// 2. 首页板块编辑器 (全双语同步版 - 包含轮播图和数据统计)
export const HomeEditor = ({ showToast }: any) => {
    const { content, updateHeroSlide, updateCompanyStat } = useLanguage();
    
    // 轮播图编辑状态
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [slideData, setSlideData] = useState({ titleCN: '', subtitleCN: '', titleEN: '', subtitleEN: '', image: '' });

    // 数据统计编辑状态
    const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null);
    const [statData, setStatData] = useState({ labelCN: '', labelEN: '', value: '', image: '' });

    if (!content) return null;

    // --- 轮播图逻辑 ---
    const startEditSlide = async (idx: number) => {
        setEditingIndex(idx);
        setEditingStatIndex(null); // 关闭另一个编辑器
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            const sCN = dbCN?.heroSlides[idx];
            const sEN = dbEN?.heroSlides[idx];
            setSlideData({
                titleCN: sCN?.title || '', subtitleCN: sCN?.subtitle || '',
                titleEN: sEN?.title || '', subtitleEN: sEN?.subtitle || '',
                image: sCN?.image || ''
            });
        } catch(e) { console.error(e); }
    };

    const saveSlide = async () => {
        if (editingIndex === null) return;
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            if (!dbCN || !dbEN) return;

            dbCN.heroSlides[editingIndex] = { image: slideData.image, title: slideData.titleCN, subtitle: slideData.subtitleCN };
            dbEN.heroSlides[editingIndex] = { image: slideData.image, title: slideData.titleEN, subtitle: slideData.subtitleEN };

            await DatabaseService.saveContent('CN', dbCN);
            await DatabaseService.saveContent('EN', dbEN);
            updateHeroSlide(editingIndex, { image: slideData.image, title: slideData.titleCN, subtitle: slideData.subtitleCN });
            showToast('双语轮播图已保存');
            setEditingIndex(null);
        } catch(e) { showToast('保存失败', 'error'); }
    };

    // --- 数据统计逻辑 ---
    const startEditStat = async (idx: number) => {
        setEditingStatIndex(idx);
        setEditingIndex(null); // 关闭另一个编辑器
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            const sCN = dbCN?.stats[idx];
            const sEN = dbEN?.stats[idx];
            setStatData({
                labelCN: sCN?.label || '',
                labelEN: sEN?.label || '',
                value: sCN?.value || '', // 数值通常共享
                image: sCN?.image || ''  // 图片共享
            });
        } catch(e) { console.error(e); }
    };

    const saveStat = async () => {
        if (editingStatIndex === null) return;
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            if (!dbCN || !dbEN) return;

            dbCN.stats[editingStatIndex] = { value: statData.value, label: statData.labelCN, image: statData.image };
            dbEN.stats[editingStatIndex] = { value: statData.value, label: statData.labelEN, image: statData.image };

            await DatabaseService.saveContent('CN', dbCN);
            await DatabaseService.saveContent('EN', dbEN);
            updateCompanyStat(editingStatIndex, { value: statData.value, label: statData.labelCN, image: statData.image });
            
            showToast('双语统计数据已保存');
            setEditingStatIndex(null);
        } catch(e) { showToast('保存失败', 'error'); }
    };

    return (
        <div className="space-y-12 animate-fade-in">
            {/* 轮播图板块 */}
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-brand-blue"><ImageIcon /> 首页大图轮播 (双语版)</h3>
                {editingIndex !== null && (
                    <div className="mb-8 p-6 bg-blue-50 rounded-[2rem] border-2 border-blue-200 shadow-lg">
                        <h4 className="font-bold mb-4 text-blue-800">正在编辑第 {editingIndex + 1} 张轮播图</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div className="space-y-3 p-4 bg-white rounded-xl border-l-4 border-red-400">
                                <label className="text-xs font-black text-gray-400">中文主标题</label>
                                <input className="w-full border-2 p-2 rounded-lg font-black" value={slideData.titleCN} onChange={e=>setSlideData({...slideData, titleCN: e.target.value})}/>
                                <label className="text-xs font-black text-gray-400">中文副标题</label>
                                <input className="w-full border-2 p-2 rounded-lg" value={slideData.subtitleCN} onChange={e=>setSlideData({...slideData, subtitleCN: e.target.value})}/>
                            </div>
                            <div className="space-y-3 p-4 bg-white rounded-xl border-l-4 border-blue-400">
                                <label className="text-xs font-black text-gray-400">英文主标题 (EN)</label>
                                <input className="w-full border-2 p-2 rounded-lg font-black" value={slideData.titleEN} onChange={e=>setSlideData({...slideData, titleEN: e.target.value})}/>
                                <label className="text-xs font-black text-gray-400">英文副标题 (EN)</label>
                                <input className="w-full border-2 p-2 rounded-lg" value={slideData.subtitleEN} onChange={e=>setSlideData({...slideData, subtitleEN: e.target.value})}/>
                            </div>
                        </div>
                        <div className="mb-4"><label className="text-xs font-black text-gray-400">配图 (共用)</label><div className="flex gap-2"><input className="w-full border-2 p-2 rounded-lg bg-white" value={slideData.image} onChange={e=>setSlideData({...slideData, image: e.target.value})}/><FileUploader onUpload={b=>setSlideData({...slideData, image: b})} hint="1920x800"/></div></div>
                        <div className="flex gap-4"><button onClick={saveSlide} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black">保存双语更改</button><button onClick={()=>setEditingIndex(null)} className="bg-gray-200 text-gray-600 px-6 py-2 rounded-xl font-black">取消</button></div>
                    </div>
                )}
                <div className="grid grid-cols-1 gap-4">{content.heroSlides.map((slide, idx) => (<div key={idx} className="p-4 rounded-2xl border bg-gray-50 flex items-center justify-between"><div className="flex items-center gap-4"><img src={slide.image} className="w-24 h-16 object-cover rounded-lg bg-gray-200" /><div><div className="font-black text-sm">{slide.title}</div><div className="text-xs text-gray-500">{slide.subtitle}</div></div></div><button onClick={() => startEditSlide(idx)} className="bg-white border text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-50">编辑 / Edit</button></div>))}</div>
            </div>

            {/* 公司实力数据统计板块 */}
            <div className="bg-white p-8 rounded-3xl border shadow-sm">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-brand-blue"><Layers /> 公司实力数据统计 (双语版)</h3>
                
                {editingStatIndex !== null && (
                    <div className="mb-8 p-6 bg-green-50 rounded-[2rem] border-2 border-green-200 shadow-lg">
                        <h4 className="font-bold mb-4 text-green-800">正在编辑统计项 #{editingStatIndex + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div className="col-span-2">
                                <label className="text-xs font-black text-gray-400">数值 (共用, e.g. 5000+)</label>
                                <input className="w-full border-2 p-3 rounded-lg font-black text-xl text-blue-600" value={statData.value} onChange={e=>setStatData({...statData, value: e.target.value})}/>
                            </div>
                            <div className="p-4 bg-white rounded-xl border-l-4 border-red-400">
                                <label className="text-xs font-black text-gray-400">中文标签 (CN)</label>
                                <input className="w-full border-2 p-2 rounded-lg" value={statData.labelCN} onChange={e=>setStatData({...statData, labelCN: e.target.value})} placeholder="例如：全球客户"/>
                            </div>
                            <div className="p-4 bg-white rounded-xl border-l-4 border-blue-400">
                                <label className="text-xs font-black text-gray-400">英文标签 (EN)</label>
                                <input className="w-full border-2 p-2 rounded-lg" value={statData.labelEN} onChange={e=>setStatData({...statData, labelEN: e.target.value})} placeholder="e.g. Global Clients"/>
                            </div>
                        </div>
                        <div className="mb-4"><label className="text-xs font-black text-gray-400">背景图 (共用)</label><div className="flex gap-2"><input className="w-full border-2 p-2 rounded-lg bg-white" value={statData.image} onChange={e=>setStatData({...statData, image: e.target.value})}/><FileUploader onUpload={b=>setStatData({...statData, image: b})} hint="背景图"/></div></div>
                        <div className="flex gap-4"><button onClick={saveStat} className="bg-green-600 text-white px-6 py-2 rounded-xl font-black">保存统计项</button><button onClick={()=>setEditingStatIndex(null)} className="bg-gray-200 text-gray-600 px-6 py-2 rounded-xl font-black">取消</button></div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.stats.map((stat, idx) => (
                        <div key={idx} className="p-6 rounded-3xl border-2 border-gray-50 bg-gray-50/50 space-y-4 relative">
                             <div className="flex justify-between items-start">
                                 <div>
                                     <div className="text-2xl font-black text-blue-600">{stat.value}</div>
                                     <div className="text-sm font-bold text-gray-500">{stat.label}</div>
                                 </div>
                                 <button onClick={() => startEditStat(idx)} className="text-blue-600 bg-white p-2 rounded-lg border hover:bg-blue-50"><Edit size={16}/></button>
                             </div>
                             <div className="w-full h-12 rounded-lg overflow-hidden opacity-50"><img src={stat.image} className="w-full h-full object-cover"/></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 3. 技术参数录入 (双语智能同步版 + 行业自动关联)
// 3. 技术参数录入 (双语智能同步版 + 批量导入导出)
// 3. 技术参数录入 (左侧导航布局 + 批量导入导出)
// 3. 技术参数录入 (全功能版：含14项新增属性 + 批量导入)
export const TechSpecEditor = ({ labels, showToast, adminLanguage }: any) => {
    const { content, addTechSpec, updateTechSpec, deleteTechSpec, updateIndustry } = useLanguage();
    
    // 编辑状态
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(20); 

    // 基础数据
    const [commonData, setCommonData] = useState({
        model: '', totalThickness: '', coatingThickness: '', ply: '', weight: '', force1pct: '', minPulley: '', workingTemp: '', hex: '#000000'
    });
    const [dataCN, setDataCN] = useState({ material: 'PVC', color: '', pattern: '' });
    const [dataEN, setDataEN] = useState({ material: 'PVC', color: '', pattern: '' });
    const [selectedInds, setSelectedInds] = useState<string[]>([]);
    const [oldModelName, setOldModelName] = useState('');

    // 🔥 新增：特性状态管理 (14项属性)
    const [features, setFeatures] = useState({
        // 输送方式
        plate: false, roller: false, trough: false,
        // 物理/化学特性
        lateralStable: false, nonStickCover: false, foodGrade: false, 
        oilRes: false, lowNoise: false, flameRetardant: false, 
        conductivity: false, curve: false, fragile: false, 
        nonAdhesive: false, antiMicrobial: false
    });

    if (!content) return null;

    // --- CSV 模板下载 (含新属性) ---
    const downloadTemplate = () => {
        // 扩展表头：增加了14个特性列
        const headers = "型号(必填)*,材质(中),材质(英),颜色(中),颜色(英),花纹(中),花纹(英),总厚度,涂层厚度,层数,重量,1%受力,最小轮径,温度范围,关联行业(逗号隔开),滑动,滚筒,沟槽,横向稳定性,防粘覆盖层,食品级,耐油,低噪音,阻燃,耐电流,弯曲,易脆,不粘,抗微生物\n";
        const example = "E8/2 U0/V5,PVC,PVC,绿色,Green,钻石纹,Diamond,2.0,0.5,2,2.2,10,60,-10/80,物流航空,1,1,0,1,0,0,1,1,0,0,0,0,0,0\n";
        const blob = new Blob(["\uFEFF" + headers + example], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "技术参数完整模板.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- CSV 批量上传 (含新属性解析) ---
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
            const text = evt.target?.result as string;
            if (!text) return;
            try {
                const rows = text.split(/\r\n|\n/);
                let successCount = 0;
                const dbCN = await DatabaseService.getContent('CN');
                const dbEN = await DatabaseService.getContent('EN');
                if (!dbCN || !dbEN) return;

                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i].trim();
                    if (!row) continue;
                    const cols = row.split(',').map(c => c.trim());
                    const model = cols[0];
                    if (!model) continue;

                    const id = `spec_${Date.now()}_${i}`;
                    
                    // 辅助函数：解析 CSV 中的 Boolean (1, Y, Yes, true)
                    const parseBool = (val: string) => ['1', 'y', 'yes', 'true'].includes((val || '').toLowerCase());

                    const newItemCommon = {
                        id, model, colorHex: '#000000',
                        totalThickness: cols[7] || '', coatingThickness: cols[8] || '', 
                        ply: cols[9] || '', weight: cols[10] || '', force1pct: cols[11] || '', 
                        minPulley: cols[12] || '', workingTemp: cols[13] || '',
                        // 解析输送方式 (cols 15-17)
                        conveying: { 
                            plate: parseBool(cols[15]), 
                            roller: parseBool(cols[16]), 
                            trough: parseBool(cols[17]) 
                        },
                        // 解析特性 (cols 18-28)
                        features: {
                            lateralStable: parseBool(cols[18]), nonStickCover: parseBool(cols[19]), 
                            foodGrade: parseBool(cols[20]), oilRes: parseBool(cols[21]), 
                            lowNoise: parseBool(cols[22]), flameRetardant: parseBool(cols[23]), 
                            conductivity: parseBool(cols[24]), curve: parseBool(cols[25]), 
                            fragile: parseBool(cols[26]), nonAdhesive: parseBool(cols[27]), 
                            antiMicrobial: parseBool(cols[28])
                        },
                        ruleData: {}
                    };
                    const newItemCN = { ...newItemCommon, materialType: cols[1] || 'PVC', color: cols[3] || '', pattern: cols[5] || '' };
                    const newItemEN = { ...newItemCommon, materialType: cols[2] || 'PVC', color: cols[4] || '', pattern: cols[6] || '' };

                    // 存入数据库逻辑 (省略部分与之前相同，仅更新对象结构)
                    const existIdx = dbCN.techSpecs.findIndex(s => s.model === model);
                    if (existIdx > -1) {
                        const existId = dbCN.techSpecs[existIdx].id;
                        dbCN.techSpecs[existIdx] = { ...dbCN.techSpecs[existIdx], ...newItemCN, id: existId };
                        dbEN.techSpecs[existIdx] = { ...dbEN.techSpecs[existIdx], ...newItemEN, id: existId };
                    } else {
                        dbCN.techSpecs.push(newItemCN);
                        dbEN.techSpecs.push(newItemEN);
                    }
                    
                    // 行业关联逻辑 (同上，省略以节省篇幅，逻辑保持不变)
                    const indNames = cols[14] ? cols[14].split('，').join(',').split(',') : [];
                    if (indNames.length > 0) {
                        indNames.forEach(name => {
                            const cleanName = name.trim();
                            if (!cleanName) return;
                            const targetInd = dbCN.industries.find(ind => ind.title.includes(cleanName));
                            if (targetInd) {
                                const indId = targetInd.id;
                                if (!dbCN.industryDetails[indId]) dbCN.industryDetails[indId] = { id: indId, description: '', productModels: [] };
                                if (!dbEN.industryDetails[indId]) dbEN.industryDetails[indId] = { id: indId, description: '', productModels: [] };
                                const listCN = dbCN.industryDetails[indId].productModels || []; if (!listCN.includes(model)) listCN.push(model); dbCN.industryDetails[indId].productModels = listCN;
                                const listEN = dbEN.industryDetails[indId].productModels || []; if (!listEN.includes(model)) listEN.push(model); dbEN.industryDetails[indId].productModels = listEN;
                            }
                        });
                    }
                    successCount++;
                }
                await DatabaseService.saveContent('CN', dbCN);
                await DatabaseService.saveContent('EN', dbEN);
                showToast(`成功导入 ${successCount} 条完整数据！`);
                setTimeout(() => window.location.reload(), 1500);
            } catch (e) { console.error(e); showToast('导入错误', 'error'); }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    // --- 编辑回显逻辑 ---
    const startEdit = async (item: any) => {
        setEditingId(item.id); setIsNew(false); setOldModelName(item.model);
        setCommonData({
            model: item.model, totalThickness: item.totalThickness, coatingThickness: item.coatingThickness, ply: item.ply, weight: item.weight, force1pct: item.force1pct, minPulley: item.minPulley, workingTemp: item.workingTemp, hex: item.colorHex || '#000000'
        });
        setDataCN({ material: item.materialType, color: item.color, pattern: item.pattern });
        setDataEN({ material: item.materialType, color: item.color, pattern: item.pattern });
        
        // 🔥 回显特性
        setFeatures({
            plate: item.conveying?.plate || false,
            roller: item.conveying?.roller || false,
            trough: item.conveying?.trough || false,
            lateralStable: item.features?.lateralStable || false,
            nonStickCover: item.features?.nonStickCover || false,
            foodGrade: item.features?.foodGrade || false,
            oilRes: item.features?.oilRes || false,
            lowNoise: item.features?.lowNoise || false,
            flameRetardant: item.features?.flameRetardant || false,
            conductivity: item.features?.conductivity || false,
            curve: item.features?.curve || false,
            fragile: item.features?.fragile || false,
            nonAdhesive: item.features?.nonAdhesive || false,
            antiMicrobial: item.features?.antiMicrobial || false
        });

        const currentRelatedInds = content.industries.filter(ind => content.industryDetails[ind.id]?.productModels?.includes(item.model)).map(ind => ind.id);
        setSelectedInds(currentRelatedInds);
        
        // 读取双语数据 (省略)
        try {
            const dbCN = await DatabaseService.getContent('CN'); const dbEN = await DatabaseService.getContent('EN');
            const itemCN = dbCN?.techSpecs.find(i => i.id === item.id); const itemEN = dbEN?.techSpecs.find(i => i.id === item.id);
            if (itemCN) setDataCN({ material: itemCN.materialType, color: itemCN.color, pattern: itemCN.pattern });
            if (itemEN) setDataEN({ material: itemEN.materialType, color: itemEN.color, pattern: itemEN.pattern });
        } catch (e) {}
    };

    const startAdd = () => {
        setEditingId('new'); setIsNew(true); setOldModelName('');
        setCommonData({ model: '', totalThickness: '', coatingThickness: '', ply: '', weight: '', force1pct: '', minPulley: '', workingTemp: '', hex: '#000000' });
        setDataCN({ material: 'PVC', color: '', pattern: '' });
        setDataEN({ material: 'PVC', color: '', pattern: '' });
        // 重置特性
        setFeatures({ plate: false, roller: false, trough: false, lateralStable: false, nonStickCover: false, foodGrade: false, oilRes: false, lowNoise: false, flameRetardant: false, conductivity: false, curve: false, fragile: false, nonAdhesive: false, antiMicrobial: false });
        setSelectedInds([]);
    };

    const handleSave = async () => {
        if (!commonData.model) { showToast('必须填写型号', 'error'); return; }
        const id = isNew ? `spec_${Date.now()}` : editingId!;
        const newModelName = commonData.model;
        
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            if (!dbCN || !dbEN) return;

            const updateItem = (list: any[], langData: any) => {
                const newItem = {
                    id: id, model: newModelName, materialType: langData.material, color: langData.color, pattern: langData.pattern, colorHex: commonData.hex, 
                    totalThickness: commonData.totalThickness, coatingThickness: commonData.coatingThickness, ply: commonData.ply, weight: commonData.weight, force1pct: commonData.force1pct, minPulley: commonData.minPulley, workingTemp: commonData.workingTemp, 
                    // 🔥 保存新属性
                    conveying: { plate: features.plate, roller: features.roller, trough: features.trough },
                    features: { 
                        lateralStable: features.lateralStable, nonStickCover: features.nonStickCover, 
                        foodGrade: features.foodGrade, oilRes: features.oilRes, lowNoise: features.lowNoise, 
                        flameRetardant: features.flameRetardant, conductivity: features.conductivity, 
                        curve: features.curve, fragile: features.fragile, nonAdhesive: features.nonAdhesive, 
                        antiMicrobial: features.antiMicrobial 
                    },
                    ruleData: {}
                };
                const idx = list.findIndex(i => i.id === id);
                if (idx > -1) list[idx] = { ...list[idx], ...newItem }; else list.push(newItem);
            };
            updateItem(dbCN.techSpecs, dataCN); updateItem(dbEN.techSpecs, dataEN);

            // 行业关联同步 (省略以节省篇幅，同前)
            content.industries.forEach(ind => {
                const indId = ind.id;
                const isSelected = selectedInds.includes(indId);
                const updateIndustryDb = (db: any) => {
                    if (!db.industryDetails[indId]) db.industryDetails[indId] = { id: indId, description: '', productModels: [] };
                    let models = db.industryDetails[indId].productModels || [];
                    if (oldModelName && (oldModelName !== newModelName || !isSelected)) models = models.filter(m => m !== oldModelName);
                    if (isSelected && !models.includes(newModelName)) models.push(newModelName);
                    db.industryDetails[indId].productModels = models;
                };
                updateIndustryDb(dbCN); updateIndustryDb(dbEN);
                const currentDetail = content.industryDetails[indId] || { description: '', productModels: [] };
                let currentModels = [...(currentDetail.productModels || [])];
                if (oldModelName && (oldModelName !== newModelName || !isSelected)) currentModels = currentModels.filter(m => m !== oldModelName);
                if (isSelected && !currentModels.includes(newModelName)) currentModels.push(newModelName);
                if (JSON.stringify(currentModels) !== JSON.stringify(currentDetail.productModels)) {
                    updateIndustry(indId, { title: ind.title, image: ind.image, type: 'industry' }, { description: currentDetail.description, productModels: currentModels });
                }
            });

            await DatabaseService.saveContent('CN', dbCN); await DatabaseService.saveContent('EN', dbEN);
            const currentItem = { 
                id, model: newModelName, materialType: dataCN.material, color: dataCN.color, pattern: dataCN.pattern, colorHex: commonData.hex, 
                totalThickness: commonData.totalThickness, coatingThickness: commonData.coatingThickness, ply: commonData.ply, weight: commonData.weight, force1pct: commonData.force1pct, minPulley: commonData.minPulley, workingTemp: commonData.workingTemp,
                conveying: { plate: features.plate, roller: features.roller, trough: features.trough },
                features: features // 保存所有特性
            };
            if (isNew) addTechSpec(currentItem); else updateTechSpec(id, currentItem);
            showToast('保存成功 (含新属性)'); setEditingId(null);
        } catch (e) { showToast('保存失败', 'error'); }
    };

    const handleDeleteSync = async (id: string) => {
        if (!window.confirm('确定删除?')) return;
        try {
            const dbCN = await DatabaseService.getContent('CN'); const dbEN = await DatabaseService.getContent('EN');
            const targetModel = content.techSpecs.find(i => i.id === id)?.model;
            if (dbCN && dbEN) {
                dbCN.techSpecs = dbCN.techSpecs.filter(i => i.id !== id);
                dbEN.techSpecs = dbEN.techSpecs.filter(i => i.id !== id);
                if (targetModel) {
                    const removeModelFromInd = (db: any) => {
                        Object.keys(db.industryDetails).forEach(key => {
                            if (db.industryDetails[key].productModels) db.industryDetails[key].productModels = db.industryDetails[key].productModels.filter((m: string) => m !== targetModel);
                        });
                    };
                    removeModelFromInd(dbCN); removeModelFromInd(dbEN);
                }
                await DatabaseService.saveContent('CN', dbCN); await DatabaseService.saveContent('EN', dbEN);
                deleteTechSpec(id); showToast('删除成功');
            }
        } catch (e) { showToast('删除失败', 'error'); }
    };

    const filteredSpecs = content.techSpecs.filter(s => s.model.toLowerCase().includes(filter.toLowerCase()));
    const paginatedSpecs = filteredSpecs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div className="flex flex-col xl:flex-row gap-8 items-start">
            {/* 左侧控制栏 */}
            <div className="w-full xl:w-72 shrink-0 xl:sticky xl:top-32 space-y-6 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div><h3 className="text-xl font-black text-blue-900 mb-2">技术参数库</h3><div className="text-xs text-gray-400 font-bold">Total: {content.techSpecs.length} items</div></div>
                <div className="space-y-3">
                    <input className="w-full border-2 p-3 rounded-xl bg-gray-50 focus:bg-white transition-all font-bold text-sm" placeholder="搜索型号 Model..." value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} />
                    <button onClick={startAdd} className="w-full bg-brand-green text-white py-3 rounded-xl flex justify-center items-center text-sm font-black shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95"><Plus size={18} className="mr-2"/> 新增型号</button>
                </div>
                <div className="pt-6 border-t border-gray-100 space-y-3">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">批量操作 / Batch</div>
                    <button onClick={downloadTemplate} className="w-full bg-white border-2 border-blue-50 text-blue-600 py-3 rounded-xl flex justify-center items-center text-xs font-bold hover:bg-blue-50 transition-all"><DownloadCloud size={16} className="mr-2"/> 下载模板</button>
                    <label className="w-full bg-blue-50 border-2 border-blue-100 text-blue-600 py-3 rounded-xl flex justify-center items-center text-xs font-bold hover:bg-blue-100 cursor-pointer transition-all"><Upload size={16} className="mr-2"/> 上传 CSV<input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} /></label>
                </div>
            </div>

            {/* 右侧内容区 */}
            <div className="flex-grow w-full min-w-0 space-y-6">
                {editingId && (
                    <div className="bg-white p-8 rounded-[2.5rem] border-4 border-blue-50 shadow-2xl mb-8 animate-fade-in-up">
                        <div className="flex justify-between items-center border-b-2 pb-4 mb-6"><h4 className="font-black text-2xl text-blue-900 flex items-center gap-2">{isNew ? 'New Product' : 'Edit Product'}<span className="text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-lg">ID: {isNew ? 'Auto' : editingId}</span></h4><button onClick={()=>setEditingId(null)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button></div>

                        {/* 物理参数 */}
                        <div className="bg-gray-50 p-6 rounded-2xl mb-6 border border-gray-100">
                            <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Core Specs (物理参数)</div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="col-span-2"><label className="block text-[10px] font-black text-gray-400 mb-1">型号 Model *</label><input className="w-full border-2 border-blue-200 p-3 rounded-xl font-black text-blue-900" value={commonData.model} onChange={e=>setCommonData({...commonData, model:e.target.value})} placeholder="例如 E8/2 U0/V5"/></div>
                                <div><label className="block text-[10px] font-black text-gray-400 mb-1">总厚度</label><input className="w-full border-2 p-3 rounded-xl font-bold" value={commonData.totalThickness} onChange={e=>setCommonData({...commonData, totalThickness:e.target.value})}/></div>
                                <div><label className="block text-[10px] font-black text-gray-400 mb-1">涂层厚度</label><input className="w-full border-2 p-3 rounded-xl font-bold" value={commonData.coatingThickness} onChange={e=>setCommonData({...commonData, coatingThickness:e.target.value})}/></div>
                                <div><label className="block text-[10px] font-black text-gray-400 mb-1">层数</label><input className="w-full border-2 p-3 rounded-xl font-bold" value={commonData.ply} onChange={e=>setCommonData({...commonData, ply:e.target.value})}/></div>
                                <div><label className="block text-[10px] font-black text-gray-400 mb-1">重量</label><input className="w-full border-2 p-3 rounded-xl font-bold" value={commonData.weight} onChange={e=>setCommonData({...commonData, weight:e.target.value})}/></div>
                                <div><label className="block text-[10px] font-black text-gray-400 mb-1">1%受力</label><input className="w-full border-2 p-3 rounded-xl font-bold" value={commonData.force1pct} onChange={e=>setCommonData({...commonData, force1pct:e.target.value})}/></div>
                                <div><label className="block text-[10px] font-black text-gray-400 mb-1">最小轮径</label><input className="w-full border-2 p-3 rounded-xl font-bold" value={commonData.minPulley} onChange={e=>setCommonData({...commonData, minPulley:e.target.value})}/></div>
                                <div><label className="block text-[10px] font-black text-gray-400 mb-1">温度范围</label><input className="w-full border-2 p-3 rounded-xl font-bold" value={commonData.workingTemp} onChange={e=>setCommonData({...commonData, workingTemp:e.target.value})}/></div>
                                <div><label className="block text-[10px] font-black text-gray-400 mb-1">色块 (Hex)</label><div className="flex items-center gap-2"><input type="color" className="h-10 w-10 rounded cursor-pointer border-0" value={commonData.hex} onChange={e=>setCommonData({...commonData, hex:e.target.value})}/><input className="w-full border-2 p-2 rounded-xl text-xs" value={commonData.hex} onChange={e=>setCommonData({...commonData, hex:e.target.value})}/></div></div>
                            </div>
                        </div>

                        {/* 双语描述 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 space-y-3"><div className="text-red-800 font-bold text-xs bg-red-200 inline-block px-2 py-1 rounded">中文 CN</div><select className="w-full border-2 border-red-200 p-2 rounded-xl bg-white" value={dataCN.material} onChange={e=>setDataCN({...dataCN, material:e.target.value})}>{content.techCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select><input className="w-full border-2 border-red-200 p-2 rounded-xl" value={dataCN.color} onChange={e=>setDataCN({...dataCN, color:e.target.value})} placeholder="颜色名称"/><input className="w-full border-2 border-red-200 p-2 rounded-xl" value={dataCN.pattern} onChange={e=>setDataCN({...dataCN, pattern:e.target.value})} placeholder="花纹名称"/></div>
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-3"><div className="text-blue-800 font-bold text-xs bg-blue-200 inline-block px-2 py-1 rounded">英文 EN</div><input className="w-full border-2 border-blue-200 p-2 rounded-xl bg-white" value={dataEN.material} onChange={e=>setDataEN({...dataEN, material:e.target.value})} placeholder="Material"/><input className="w-full border-2 border-blue-200 p-2 rounded-xl" value={dataEN.color} onChange={e=>setDataEN({...dataEN, color:e.target.value})} placeholder="Color Name"/><input className="w-full border-2 border-blue-200 p-2 rounded-xl" value={dataEN.pattern} onChange={e=>setDataEN({...dataEN, pattern:e.target.value})} placeholder="Pattern Name"/></div>
                        </div>

                        {/* 🔥 新增：输送方式与特性选择 🔥 */}
                        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mb-6">
                            <div className="text-orange-800 font-bold text-xs bg-orange-200 inline-block px-2 py-1 rounded mb-4">输送方式 & 产品特性</div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {/* 3项输送方式 */}
                                {['plate', 'roller', 'trough'].map(key => (
                                    <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${features[key as keyof typeof features] ? 'bg-white border-orange-400 text-orange-700' : 'border-transparent hover:bg-white/50'}`}>
                                        <input type="checkbox" checked={features[key as keyof typeof features]} onChange={e => setFeatures({...features, [key]: e.target.checked})} className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400"/>
                                        <span className="text-xs font-bold">{key === 'plate' ? '滑动' : key === 'roller' ? '滚筒' : '沟槽'}</span>
                                    </label>
                                ))}
                                {/* 11项特性 (中英文对照或直接用中文) */}
                                {[
                                    {k:'lateralStable', l:'横向稳定性'}, {k:'nonStickCover', l:'防粘覆盖层'},
                                    {k:'foodGrade', l:'食品级标准'}, {k:'oilRes', l:'耐油耐脂肪'},
                                    {k:'lowNoise', l:'低噪音'}, {k:'flameRetardant', l:'阻燃'},
                                    {k:'conductivity', l:'耐电流'}, {k:'curve', l:'适用于弯曲'},
                                    {k:'fragile', l:'易脆'}, {k:'nonAdhesive', l:'不粘'},
                                    {k:'antiMicrobial', l:'抗微生物'}
                                ].map(({k, l}) => (
                                    <label key={k} className={`flex items-center gap-2 p-2 rounded-lg border-2 cursor-pointer transition-all ${features[k as keyof typeof features] ? 'bg-white border-blue-400 text-blue-700' : 'border-transparent hover:bg-white/50'}`}>
                                        <input type="checkbox" checked={features[k as keyof typeof features]} onChange={e => setFeatures({...features, [k]: e.target.checked})} className="w-4 h-4 text-blue-500 rounded focus:ring-blue-400"/>
                                        <span className="text-xs font-bold">{l}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 行业关联 */}
                        <div className="bg-green-50 p-6 rounded-2xl border border-green-100 mb-6"><div className="text-green-800 font-bold text-xs bg-green-200 inline-block px-2 py-1 rounded mb-4">行业应用关联</div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{content.industries.map(ind => (<label key={ind.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedInds.includes(ind.id) ? 'bg-white border-green-500 shadow-sm' : 'border-transparent hover:bg-white/50'}`}><input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500" checked={selectedInds.includes(ind.id)} onChange={e => { if (e.target.checked) setSelectedInds([...selectedInds, ind.id]); else setSelectedInds(selectedInds.filter(id => id !== ind.id)); }} /><span className={`text-xs font-bold ${selectedInds.includes(ind.id) ? 'text-green-700' : 'text-gray-600'}`}>{ind.title}</span></label>))}</div></div>

                        <div className="flex gap-4 border-t-2 border-gray-100 pt-6"><button onClick={handleSave} className="bg-blue-600 text-white px-12 py-3 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all">保存全部</button><button onClick={()=>setEditingId(null)} className="bg-gray-100 text-gray-500 px-10 py-3 rounded-2xl font-black">取消</button></div>
                    </div>
                )}

                {/* 底部数据列表 (省略以保持简洁，核心是上面的编辑逻辑) */}
                <div className="overflow-hidden rounded-[2.5rem] border-2 border-gray-100 shadow-sm bg-white">
                    <table className="min-w-full text-sm">
                        <thead><tr className="bg-gray-900 text-white"><th className="p-5 text-left text-[10px] font-bold uppercase tracking-widest">Model</th><th className="p-5 text-center text-[10px] font-bold uppercase tracking-widest">Material</th><th className="p-5 text-center text-[10px] font-bold uppercase tracking-widest">Color</th><th className="p-5 text-center text-[10px] font-bold uppercase tracking-widest">Thick</th><th className="p-5 text-center text-[10px] font-bold uppercase tracking-widest">Action</th></tr></thead>
                        <tbody className="divide-y divide-gray-100">{paginatedSpecs.map(s => (<tr key={s.id} className="hover:bg-blue-50/30 transition-colors group"><td className="p-5 font-black text-blue-900">{s.model}</td><td className="p-5 text-center font-bold text-gray-500 text-xs">{s.materialType}</td><td className="p-5 text-center flex justify-center items-center gap-2"><div className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{backgroundColor: s.colorHex}}></div><span className="text-xs font-bold text-gray-400">{s.color}</span></td><td className="p-5 text-center font-bold text-gray-500">{s.totalThickness}</td><td className="p-5 text-center space-x-2 opacity-60 group-hover:opacity-100 transition-opacity"><button onClick={()=>startEdit(s)} className="text-blue-600 bg-blue-50 p-2 rounded-lg hover:bg-blue-100"><Edit size={16}/></button><button onClick={()=>handleDeleteSync(s.id)} className="text-red-400 bg-red-50 p-2 rounded-lg hover:bg-red-100"><Trash2 size={16}/></button></td></tr>))}</tbody>
                    </table>
                </div>
                <div className="flex justify-center gap-2 text-xs font-bold text-gray-400 pt-4"><button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="hover:text-blue-600 disabled:opacity-30">Prev</button><span>Page {page}</span><button disabled={paginatedSpecs.length < itemsPerPage} onClick={()=>setPage(p=>p+1)} className="hover:text-blue-600 disabled:opacity-30">Next</button></div>
            </div>
        </div>
    );
};

// 4. 产品分类目录 (双语同步版)
const ProductRenderItem = ({ item, level, expanded, toggleExpand, startAdd, startEdit, handleDelete }: any) => {
    const { content } = useLanguage();
    const children = content.products.filter(p => p.parentId === item.id);
    return (
        <div className="mb-2">
            <div className={`flex justify-between items-center p-4 rounded-2xl border-2 hover:bg-gray-50 transition-all ${level === 0 ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-100 ml-8 border-l-4 border-l-blue-600'}`}>
                <div className="flex items-center space-x-4">
                    {level === 0 && <button onClick={() => toggleExpand(item.id)}>{expanded[item.id] ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}</button>}
                    <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0 border-2 border-gray-50"><img src={item.image} className="w-full h-full object-cover"/></div>
                    <div><div className="font-black text-blue-900 text-sm uppercase tracking-tight">{item.title}</div><div className="text-[10px] font-bold text-gray-400">ID: {item.id}</div></div>
                </div>
                <div className="flex items-center space-x-2">
                    {level === 0 && <button onClick={() => startAdd(item.id)} className="text-green-600 p-2 text-[10px] font-black uppercase flex items-center bg-green-50 rounded-lg hover:bg-green-100 transition-all"><Plus size={12} className="mr-1"/> Sub</button>}
                    <button onClick={() => startEdit(item)} className="text-blue-600 p-2"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-400 p-2"><Trash2 size={16} /></button>
                </div>
            </div>
            {expanded[item.id] && children.length > 0 && <div className="mt-2 animate-fade-in">{children.map((c: any) => <ProductRenderItem key={c.id} item={c} level={level + 1} expanded={expanded} toggleExpand={toggleExpand} startAdd={startAdd} startEdit={startEdit} handleDelete={handleDelete} />)}</div>}
        </div>
    );
};

export const ProductTreeEditor = ({ showToast }: any) => {
    const { content, addProduct, updateProduct, deleteProduct } = useLanguage();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [titleCN, setTitleCN] = useState('');
    const [titleEN, setTitleEN] = useState('');
    const [commonData, setCommonData] = useState({ image: '', parentId: undefined as string | undefined });

    if (!content) return null;

    const startEdit = async (item: CategoryItem) => {
        setEditingId(item.id); setIsNew(false); setCommonData({ image: item.image, parentId: item.parentId });
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            setTitleCN(dbCN?.products.find(p => p.id === item.id)?.title || '');
            setTitleEN(dbEN?.products.find(p => p.id === item.id)?.title || '');
        } catch (e) { console.error(e); setTitleCN(item.title); }
    };

    const startAdd = (parentId?: string) => { setEditingId('new_temp'); setIsNew(true); setTitleCN(''); setTitleEN(''); setCommonData({ image: '', parentId: parentId }); if(parentId) setExpanded(prev => ({...prev, [parentId]: true})); };

    const handleSave = async () => {
        const id = isNew ? `prod_${Date.now()}` : editingId!;
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            if (!dbCN || !dbEN) return;

            const updateList = (db: any, title: string) => {
                const idx = db.products.findIndex((p: any) => p.id === id);
                const newItem = { id, title, image: commonData.image, parentId: commonData.parentId, type: 'product', description: '' };
                if (idx > -1) db.products[idx] = { ...db.products[idx], ...newItem }; else db.products.push(newItem);
            };

            updateList(dbCN, titleCN); updateList(dbEN, titleEN);
            await DatabaseService.saveContent('CN', dbCN); await DatabaseService.saveContent('EN', dbEN);

            if (isNew) addProduct({ id, title: titleCN, image: commonData.image, parentId: commonData.parentId, type: 'product', description: '' });
            else updateProduct(id, { title: (content === dbCN ? titleCN : titleEN), image: commonData.image });
            showToast('双语分类已保存！'); setEditingId(null);
        } catch (e) { showToast('保存失败', 'error'); }
    };

    const handleDeleteSync = async (id: string) => {
        if (!window.confirm('确定要删除该分类及其子分类吗？(双语同步删除)')) return;
        try {
            const dbCN = await DatabaseService.getContent('CN'); const dbEN = await DatabaseService.getContent('EN');
            if (dbCN && dbEN) {
                dbCN.products = dbCN.products.filter(p => p.id !== id && p.parentId !== id);
                dbEN.products = dbEN.products.filter(p => p.id !== id && p.parentId !== id);
                await DatabaseService.saveContent('CN', dbCN); await DatabaseService.saveContent('EN', dbEN);
                deleteProduct(id); showToast('已同步删除');
            }
        } catch (e) { showToast('删除出错', 'error'); }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center border-b-2 pb-6"><h3 className="text-2xl font-black text-blue-900">产品目录树 (双语版)</h3><button onClick={() => startAdd()} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black flex items-center shadow-lg hover:bg-blue-700 transition-all"><Plus size={18} className="mr-2"/> 新建一级分类</button></div>
            {editingId && (
                <div className="bg-blue-50 p-8 rounded-[2.5rem] border-4 border-blue-100 mb-8 sticky top-4 z-20 space-y-6 shadow-xl">
                    <h4 className="font-black text-xl mb-4">{isNew ? '新建分类' : '编辑分类'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-xl border-2 border-red-100"><label className="block text-[10px] font-black text-red-400 mb-2 uppercase">中文标题 (CN)</label><input className="w-full border-2 border-gray-100 p-3 rounded-xl font-black focus:border-red-300 outline-none" value={titleCN} onChange={e => setTitleCN(e.target.value)} placeholder="输入中文名称" /></div>
                        <div className="bg-white p-4 rounded-xl border-2 border-blue-100"><label className="block text-[10px] font-black text-blue-400 mb-2 uppercase">英文标题 (EN)</label><input className="w-full border-2 border-gray-100 p-3 rounded-xl font-black focus:border-blue-300 outline-none" value={titleEN} onChange={e => setTitleEN(e.target.value)} placeholder="Enter English Title" /></div>
                        <div className="col-span-1 md:col-span-2"><label className="block text-[10px] font-black text-gray-400 mb-2">分类封面图 (共用)</label><div className="flex"><input className="w-full border-2 p-3 rounded-xl bg-white" value={commonData.image} onChange={e => setCommonData({...commonData, image: e.target.value})} /><FileUploader onUpload={b => setCommonData({...commonData, image: b})} /></div></div>
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-blue-200"><button onClick={handleSave} className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black shadow-md hover:scale-105 transition-transform">保存双语分类</button><button onClick={() => setEditingId(null)} className="bg-gray-100 text-gray-500 px-10 py-3 rounded-2xl font-black">取消</button></div>
                </div>
            )}
            <div className="space-y-2">{content.products.filter(p => !p.parentId).map(r => <ProductRenderItem key={r.id} item={r} level={0} expanded={expanded} toggleExpand={(id:any)=>setExpanded(p=>({...p,[id]:!p[id]}))} startAdd={startAdd} startEdit={startEdit} handleDelete={handleDeleteSync} />)}</div>
        </div>
    );
};

// 5. 行业应用方案 (双语同步版)
export const IndustryEditor = ({ showToast }: any) => {
    const { content, updateIndustry, addIndustry } = useLanguage();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [dataCN, setDataCN] = useState({ title: '', desc: '' });
    const [dataEN, setDataEN] = useState({ title: '', desc: '' });
    const [commonData, setCommonData] = useState({ image: '', models: [] as string[] });

    if (!content) return null;

    const startEdit = async (ind: CategoryItem) => {
        setEditingId(ind.id); setIsNew(false);
        setCommonData({ image: ind.image, models: content.industryDetails[ind.id]?.productModels || [] });
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            setDataCN({ title: dbCN?.industries.find(i => i.id === ind.id)?.title || '', desc: dbCN?.industryDetails[ind.id]?.description || '' });
            setDataEN({ title: dbEN?.industries.find(i => i.id === ind.id)?.title || '', desc: dbEN?.industryDetails[ind.id]?.description || '' });
        } catch (e) { console.error(e); }
    };

    const handleSave = async () => {
        const id = isNew ? `ind_${Date.now()}` : editingId!;
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            if (!dbCN || !dbEN) return;

            const updateLangData = (db: any, langData: {title: string, desc: string}) => {
                let itemIndex = db.industries.findIndex((i: any) => i.id === id);
                if (itemIndex > -1) { db.industries[itemIndex].title = langData.title; db.industries[itemIndex].image = commonData.image; }
                else if (isNew) { db.industries.push({ id: id, title: langData.title, image: commonData.image, type: 'industry' }); }
                if (!db.industryDetails[id]) { db.industryDetails[id] = { id: id, description: '', productModels: [] }; }
                db.industryDetails[id].description = langData.desc; db.industryDetails[id].productModels = commonData.models;
            };

            updateLangData(dbCN, dataCN); updateLangData(dbEN, dataEN);
            await DatabaseService.saveContent('CN', dbCN); await DatabaseService.saveContent('EN', dbEN);

            if (isNew) addIndustry({ id, title: dataCN.title, image: commonData.image, type: 'industry' }, { id, description: dataCN.desc, productModels: commonData.models });
            else updateIndustry(id, { title: (content === dbCN ? dataCN.title : dataEN.title), image: commonData.image }, { description: (content === dbCN ? dataCN.desc : dataEN.desc), productModels: commonData.models });

            showToast('双语数据已同步保存！'); setEditingId(null); setIsNew(false);
        } catch (e) { showToast('保存失败', 'error'); }
    };

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center border-b-2 pb-6"><h3 className="text-2xl font-black text-blue-900">行业应用模块 (双语版)</h3><button onClick={() => { setIsNew(true); setEditingId('new'); setDataCN({ title: '', desc: '' }); setDataEN({ title: '', desc: '' }); setCommonData({ image: '', models: [] }); }} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all">+ 新增行业板块</button></div>
        {editingId && (
            <div className="bg-white p-8 rounded-[2.5rem] border-4 border-blue-50 shadow-2xl sticky top-4 z-20 space-y-6">
                <h4 className="font-black text-xl text-blue-900 border-b pb-2 mb-4">{isNew ? '新建双语方案' : '编辑双语方案'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-red-50 rounded-2xl border border-red-100">
                    <div className="col-span-2 text-red-800 font-bold flex items-center gap-2"><span className="bg-red-500 text-white text-xs px-2 py-1 rounded">中文 CN</span> 内容设置</div>
                    <div><label className="block text-[10px] font-black text-gray-400 mb-2">行业名称 (中文)</label><input className="w-full border-2 border-red-100 p-3 rounded-xl font-black focus:border-red-300 outline-none" value={dataCN.title} onChange={e => setDataCN({...dataCN, title: e.target.value})} placeholder="例如：纺织印染"/></div>
                    <div className="col-span-2 md:col-span-2"><label className="block text-[10px] font-black text-gray-400 mb-2">方案描述 (中文)</label><textarea className="w-full border-2 border-red-100 p-3 rounded-xl h-24 focus:border-red-300 outline-none" value={dataCN.desc} onChange={e => setDataCN({...dataCN, desc: e.target.value})} placeholder="请输入中文描述..."/></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="col-span-2 text-blue-800 font-bold flex items-center gap-2"><span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">英文 EN</span> Content Settings</div>
                    <div><label className="block text-[10px] font-black text-gray-400 mb-2">Industry Title (EN)</label><input className="w-full border-2 border-blue-100 p-3 rounded-xl font-black focus:border-blue-300 outline-none" value={dataEN.title} onChange={e => setDataEN({...dataEN, title: e.target.value})} placeholder="e.g. Textile Industry"/></div>
                    <div className="col-span-2 md:col-span-2"><label className="block text-[10px] font-black text-gray-400 mb-2">Description (EN)</label><textarea className="w-full border-2 border-blue-100 p-3 rounded-xl h-24 focus:border-blue-300 outline-none" value={dataEN.desc} onChange={e => setDataEN({...dataEN, desc: e.target.value})} placeholder="Enter English description..."/></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t"><div className="col-span-2"><label className="block text-[10px] font-black text-gray-400 mb-2">行业图片 (共用)</label><div className="flex"><input className="w-full border-2 p-3 rounded-xl bg-white" value={commonData.image} onChange={e => setCommonData({...commonData, image: e.target.value})} /><FileUploader onUpload={b => setCommonData({...commonData, image: b})} /></div></div></div>
                <div className="flex gap-4 pt-4"><button onClick={handleSave} className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform">保存双语数据</button><button onClick={() => setEditingId(null)} className="bg-gray-100 text-gray-500 px-10 py-3 rounded-2xl font-black">取消</button></div>
            </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{content.industries.map(ind => (<div key={ind.id} className="p-6 bg-white border-2 border-gray-50 rounded-[2rem] shadow-sm flex items-center gap-6"><div className="w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0"><img src={ind.image} className="w-full h-full object-cover" /></div><div className="flex-grow"><div className="font-black text-blue-900 text-lg">{ind.title}</div><div className="text-xs text-gray-400 truncate max-w-[200px]">{content.industryDetails[ind.id]?.description}</div></div><button onClick={() => startEdit(ind)} className="p-3 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"><Edit size={20}/></button></div>))}</div>
      </div>
    );
};

// 6. 花纹代号管理 (双语同步版)
// 6. 花纹代号管理 (修复重复代号导致的搜索卡死 Bug)
export const PatternEditor = ({ showToast }: any) => {
    const { content, addPattern, updatePattern, deletePattern } = useLanguage();
    const [editingCode, setEditingCode] = useState<string | null>(null);
    const [isNew, setIsNew] = useState(false);
    
    // 搜索词状态
    const [search, setSearch] = useState('');

    const [dataCN, setDataCN] = useState<PatternSpec>({} as PatternSpec);
    const [dataEN, setDataEN] = useState<PatternSpec>({} as PatternSpec);

    if (!content) return null;

    // 🌟 修复核心：使用 useMemo 缓存过滤结果
    const filteredPatterns = useMemo(() => {
        const s = search.toLowerCase().trim();
        // 1. 如果没有搜索词，返回全部
        if (!s) return content.patterns;
        
        // 2. 过滤逻辑 (增加空值保护)
        return content.patterns.filter(p => {
            const name = (p.name || '').toLowerCase();
            const code = (p.code || '').toLowerCase();
            return name.includes(s) || code.includes(s);
        });
    }, [content.patterns, search]);

    const startEdit = async (p: PatternSpec) => {
        setEditingCode(p.code); setIsNew(false);
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            // 注意：如果有重复 code，find 可能会找到第一个。这是数据结构决定的，建议尽量保持 code 唯一。
            const pCN = dbCN?.patterns.find(i => i.code === p.code);
            const pEN = dbEN?.patterns.find(i => i.code === p.code);
            setDataCN(pCN || p); setDataEN(pEN || p);
        } catch(e) { console.error(e); }
    };

    const startAdd = () => {
        setEditingCode('new_pattern'); setIsNew(true);
        const empty = { name: '', code: '', thickness: '', width: '', features: '', application: '', image: '' };
        setDataCN(empty); setDataEN(empty);
    };

    const handleSave = async () => {
        const code = isNew ? dataCN.code : editingCode!;
        if(!code) { alert('必须输入代号 Code'); return; }
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            if (!dbCN || !dbEN) return;

            const saveToDb = (db: any, data: PatternSpec) => {
                const idx = db.patterns.findIndex((i: any) => i.code === code);
                const finalData = {
                    ...data,
                    code: dataCN.code,
                    thickness: dataCN.thickness,
                    width: dataCN.width,
                    image: dataCN.image
                };
                
                if (idx > -1) db.patterns[idx] = finalData; else db.patterns.push(finalData);
            };
            saveToDb(dbCN, dataCN); saveToDb(dbEN, dataEN);
            await DatabaseService.saveContent('CN', dbCN); await DatabaseService.saveContent('EN', dbEN);
            if(isNew) addPattern(dataCN); else updatePattern(code, dataCN);
            showToast('双语花纹已保存'); setEditingCode(null);
        } catch (e) { showToast('保存失败', 'error'); }
    };

    return (
        <div className="flex flex-col xl:flex-row gap-8 items-start">
            
            {/* === 左侧控制栏 (Sticky) === */}
            <div className="w-full xl:w-72 shrink-0 xl:sticky xl:top-32 space-y-6 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div>
                    <h3 className="text-xl font-black text-blue-900 mb-2">花纹代号库</h3>
                    <div className="text-xs text-gray-400 font-bold">Total: {content.patterns.length} items</div>
                </div>
                
                <div className="space-y-3">
                    <div className="relative">
                        <input 
                            className="w-full border-2 p-3 pr-10 rounded-xl bg-gray-50 focus:bg-white transition-all font-bold text-sm outline-none focus:border-blue-300" 
                            placeholder="搜索名称或代码..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                        />
                        {/* 搜索清除按钮 */}
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    <button onClick={startAdd} className="w-full bg-blue-600 text-white py-3 rounded-xl flex justify-center items-center text-sm font-black shadow-lg hover:bg-blue-700 transition-all active:scale-95">
                        + 新录入花纹
                    </button>
                </div>
            </div>
            
            {/* === 右侧内容区 === */}
            <div className="flex-grow w-full min-w-0 space-y-6">
                {editingCode && (
                    <div className="bg-white p-8 rounded-[2.5rem] border-4 border-blue-50 shadow-2xl mb-8 animate-fade-in-up">
                        <div className="flex justify-between items-center border-b pb-4 mb-6">
                            <h4 className="font-black text-xl text-blue-900">{isNew ? 'New Pattern' : 'Edit Pattern'}</h4>
                            <button onClick={()=>setEditingCode(null)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                        </div>
                        
                        {/* 共用属性 */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-gray-50 rounded-2xl mb-6">
                             <div className="col-span-2"><label className="block text-[10px] font-black text-gray-400 mb-2">代号 Code (共用)</label><input className="w-full border-2 p-3 rounded-xl font-black" value={dataCN.code} onChange={e=>{setDataCN({...dataCN, code:e.target.value}); setDataEN({...dataEN, code:e.target.value})}}/></div>
                             <div><label className="block text-[10px] font-black text-gray-400 mb-2">厚度</label><input className="w-full border-2 p-3 rounded-xl font-black" value={dataCN.thickness} onChange={e=>{setDataCN({...dataCN, thickness:e.target.value}); setDataEN({...dataEN, thickness:e.target.value})}}/></div>
                             <div><label className="block text-[10px] font-black text-gray-400 mb-2">宽度</label><input className="w-full border-2 p-3 rounded-xl font-black" value={dataCN.width} onChange={e=>{setDataCN({...dataCN, width:e.target.value}); setDataEN({...dataEN, width:e.target.value})}}/></div>
                             <div className="col-span-2"><label className="block text-[10px] font-black text-gray-400 mb-2">图片</label><div className="flex"><input className="w-full border-2 p-3 rounded-xl" value={dataCN.image} onChange={e=>{setDataCN({...dataCN, image:e.target.value}); setDataEN({...dataEN, image:e.target.value})}} /><FileUploader onUpload={b=>{setDataCN({...dataCN, image:b}); setDataEN({...dataEN, image:b})}} /></div></div>
                        </div>

                        {/* 双语属性 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 space-y-3">
                                <div className="text-red-800 font-bold text-xs bg-red-200 inline-block px-2 py-1 rounded">中文 CN</div>
                                <input className="w-full border-2 border-red-200 p-2 rounded-xl" value={dataCN.name} onChange={e=>setDataCN({...dataCN, name:e.target.value})} placeholder="花纹名称"/>
                                <input className="w-full border-2 border-red-200 p-2 rounded-xl" value={dataCN.features} onChange={e=>setDataCN({...dataCN, features:e.target.value})} placeholder="特性"/>
                                <input className="w-full border-2 border-red-200 p-2 rounded-xl" value={dataCN.application} onChange={e=>setDataCN({...dataCN, application:e.target.value})} placeholder="应用"/>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-3">
                                <div className="text-blue-800 font-bold text-xs bg-blue-200 inline-block px-2 py-1 rounded">英文 EN</div>
                                <input className="w-full border-2 border-blue-200 p-2 rounded-xl" value={dataEN.name} onChange={e=>setDataEN({...dataEN, name:e.target.value})} placeholder="Pattern Name"/>
                                <input className="w-full border-2 border-blue-200 p-2 rounded-xl" value={dataEN.features} onChange={e=>setDataEN({...dataEN, features:e.target.value})} placeholder="Features"/>
                                <input className="w-full border-2 border-blue-200 p-2 rounded-xl" value={dataEN.application} onChange={e=>setDataEN({...dataEN, application:e.target.value})} placeholder="Application"/>
                            </div>
                        </div>

                        <div className="flex gap-4 border-t pt-4">
                            <button onClick={handleSave} className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black shadow-lg">保存</button>
                            <button onClick={()=>setEditingCode(null)} className="bg-gray-100 text-gray-500 px-10 py-3 rounded-2xl font-black">取消</button>
                        </div>
                    </div>
                )}

                {/* 列表渲染 (带空状态提示) */}
                {filteredPatterns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* 👇 这里的 map 是关键修改点：
                           p: 当前花纹对象
                           idx: 当前在过滤列表中的索引
                           key: `${p.code}-${idx}`  <-- 结合索引生成唯一ID，即使 code 重复也不会卡死
                        */}
                        {filteredPatterns.map((p, idx) => (
                            <div key={`${p.code}-${idx}`} className="p-6 bg-white border-2 border-gray-50 rounded-[2rem] shadow-sm group hover:shadow-md transition-all relative">
                                <div className="w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 border-2 border-gray-100 shadow-inner">
                                    <img src={p.image || ''} className="w-full h-full object-cover" />
                                </div>
                                <div className="font-black text-blue-900 text-sm">{p.name || '未命名'} <span className="text-gray-400 text-xs ml-1">#{p.code}</span></div>
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => startEdit(p)} className="flex-grow bg-blue-50 text-blue-600 py-2 rounded-xl text-xs font-black uppercase hover:bg-blue-600 hover:text-white transition-all">编辑</button>
                                    <button onClick={()=> { if(window.confirm('确定删除?')) deletePattern(p.code); }} className="bg-red-50 text-red-400 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 text-gray-400">
                        <LayoutDashboard size={48} className="mx-auto mb-4 opacity-20"/>
                        <p className="font-bold">未找到匹配的花纹</p>
                        {/* 提示用户可能输入了不存在的关键词 */}
                        <button onClick={() => setSearch('')} className="mt-4 text-blue-600 text-xs underline">清除搜索条件</button>
                    </div>
                )}
            </div>
        </div>
    );
};
// 7. 公司介绍管理 (双语同步版 - 防崩溃版)
// 7. 公司介绍管理 (修复图片上传 & 增加历程图片)
export const IntroManager = ({ showToast }: any) => {
    const { content, updateAboutPage, addHistory, updateHistory, deleteHistory, addCertificate, updateCertificate, deleteCertificate, addDownload, updateDownload, deleteDownload } = useLanguage();
    const [subTab, setSubTab] = useState<'base' | 'history' | 'certs' | 'files'>('base');
    const [fullData, setFullData] = useState<{ CN: any, EN: any } | null>(null);
    const [loading, setLoading] = useState(false);

    // 1. 发展历程编辑状态 (新增 image 字段)
    const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
    const [historyData, setHistoryData] = useState({ year: '', titleCN: '', titleEN: '', image: '' });

    // 2. 荣誉资质编辑状态
    const [editingCertId, setEditingCertId] = useState<string | null>(null);
    const [certData, setCertData] = useState({ image: '', titleCN: '', titleEN: '', categoryCN: '', categoryEN: '' });

    // 3. 下载中心编辑状态
    const [editingFileId, setEditingFileId] = useState<string | null>(null);
    const [fileData, setFileData] = useState({ fileName: '', fileUrl: '', titleCN: '', titleEN: '' });

    // 初始化数据
    useEffect(() => {
        const loadDualData = async () => {
            setLoading(true);
            try {
                if (typeof DatabaseService === 'undefined') throw new Error("DatabaseService import missing");
                const cn = await DatabaseService.getContent('CN');
                const en = await DatabaseService.getContent('EN');
                if (cn && en) setFullData({ CN: cn, EN: en });
            } catch (e: any) { console.error(e); } finally { setLoading(false); }
        };
        loadDualData();
    }, [subTab]);

    if (!content) return null;

    // --- 核心板块保存逻辑 ---
    const handleSaveSection = async (secId: string, images: string[]) => {
        if (!fullData) return;
        try {
            const cnPage = fullData.CN?.about?.pages?.[secId] || { id: secId, content: '', images: [] };
            const enPage = fullData.EN?.about?.pages?.[secId] || { id: secId, content: '', images: [] };
            
            const newDbCN = { ...fullData.CN };
            const newDbEN = { ...fullData.EN };
            
            // 确保结构存在
            if (!newDbCN.about.pages) newDbCN.about.pages = {};
            if (!newDbEN.about.pages) newDbEN.about.pages = {};
            
            // 更新数据
            newDbCN.about.pages[secId] = { ...cnPage, images }; // 写入最新图片列表
            newDbEN.about.pages[secId] = { ...enPage, images }; // 写入最新图片列表
            
            await DatabaseService.saveContent('CN', newDbCN);
            await DatabaseService.saveContent('EN', newDbEN);
            
            // 更新视图
            updateAboutPage(secId, { content: newDbCN.about.pages[secId].content, images });
            showToast('双语内容及图片已保存！');
        } catch (e) { showToast('保存出错', 'error'); }
    };

    const handleTextChange = (lang: 'CN' | 'EN', secId: string, newText: string) => {
        if (!fullData) return;
        setFullData(prev => {
            if (!prev) return null;
            const newData = { ...prev };
            if (!newData[lang].about.pages[secId]) newData[lang].about.pages[secId] = { id: secId, content: '', images: [] };
            newData[lang].about.pages[secId].content = newText;
            return newData;
        });
    };

    // --- 发展历程逻辑 (已修复图片) ---
    const startEditHistory = (h: any) => {
        setEditingHistoryId(h.id);
        const hCN = fullData?.CN?.about?.history?.find((x:any) => x.id === h.id);
        const hEN = fullData?.EN?.about?.history?.find((x:any) => x.id === h.id);
        // 读取图片 (如果没有则为空)
        const img = hCN?.image || h.image || ''; 
        setHistoryData({ year: h.year, titleCN: hCN?.title || h.title, titleEN: hEN?.title || h.title, image: img });
    };

    const saveHistory = async () => {
        const id = editingHistoryId === 'new' ? Date.now().toString() : editingHistoryId!;
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            if(!dbCN || !dbEN) return;

            const updateList = (db:any, title: string) => {
                if (!db.about.history) db.about.history = [];
                // 保存图片字段
                const item = { id, year: historyData.year, title, image: historyData.image, description: '' };
                const idx = db.about.history.findIndex((x:any) => x.id === id);
                if(idx > -1) db.about.history[idx] = item; else db.about.history.push(item);
                db.about.history.sort((a:any,b:any) => parseInt(b.year) - parseInt(a.year));
            };

            updateList(dbCN, historyData.titleCN);
            updateList(dbEN, historyData.titleEN);
            
            await DatabaseService.saveContent('CN', dbCN);
            await DatabaseService.saveContent('EN', dbEN);

            // 更新当前视图
            if(editingHistoryId === 'new') addHistory({ id, year: historyData.year, title: historyData.titleCN, description: '', image: historyData.image });
            else updateHistory({ id, year: historyData.year, title: historyData.titleCN, description: '', image: historyData.image });
            
            setEditingHistoryId(null); 
            showToast('发展历程(含图片)已保存');
        } catch(e) { showToast('保存失败'); }
    };

    // --- 荣誉资质逻辑 ---
    const startEditCert = (c: any) => {
        setEditingCertId(c.id);
        const cCN = fullData?.CN?.about?.certificates?.find((x:any) => x.id === c.id);
        const cEN = fullData?.EN?.about?.certificates?.find((x:any) => x.id === c.id);
        setCertData({ image: c.image, titleCN: cCN?.title || c.title, titleEN: cEN?.title || c.title, categoryCN: cCN?.category || '', categoryEN: cEN?.category || '' });
    };
    const saveCert = async () => {
        const id = editingCertId === 'new' ? Date.now().toString() : editingCertId!;
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            if(!dbCN || !dbEN) return;
            const updateList = (db:any, title: string, cat: string) => {
                if (!db.about.certificates) db.about.certificates = [];
                const item = { id, image: certData.image, title, category: cat };
                const idx = db.about.certificates.findIndex((x:any) => x.id === id);
                if(idx > -1) db.about.certificates[idx] = item; else db.about.certificates.push(item);
            };
            updateList(dbCN, certData.titleCN, certData.categoryCN);
            updateList(dbEN, certData.titleEN, certData.categoryEN);
            await DatabaseService.saveContent('CN', dbCN);
            await DatabaseService.saveContent('EN', dbEN);
            if(editingCertId === 'new') addCertificate({ id, image: certData.image, title: certData.titleCN, category: certData.categoryCN });
            else updateCertificate({ id, image: certData.image, title: certData.titleCN, category: certData.categoryCN });
            setEditingCertId(null); showToast('荣誉资质已保存');
        } catch(e) { showToast('保存失败'); }
    };

    // --- 下载中心逻辑 ---
    const startEditFile = (f: any) => {
        setEditingFileId(f.id);
        const fCN = fullData?.CN?.about?.downloads?.find((x:any) => x.id === f.id);
        const fEN = fullData?.EN?.about?.downloads?.find((x:any) => x.id === f.id);
        setFileData({ fileName: f.fileName, fileUrl: f.fileUrl, titleCN: fCN?.title || f.title, titleEN: fEN?.title || f.title });
    };
    const saveFile = async () => {
        const id = editingFileId === 'new' ? Date.now().toString() : editingFileId!;
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            if(!dbCN || !dbEN) return;
            const updateList = (db:any, title: string) => {
                if (!db.about.downloads) db.about.downloads = [];
                const item = { id, title, fileName: fileData.fileName, fileUrl: fileData.fileUrl, category: 'General' };
                const idx = db.about.downloads.findIndex((x:any) => x.id === id);
                if(idx > -1) db.about.downloads[idx] = item; else db.about.downloads.push(item);
            };
            updateList(dbCN, fileData.titleCN);
            updateList(dbEN, fileData.titleEN);
            await DatabaseService.saveContent('CN', dbCN);
            await DatabaseService.saveContent('EN', dbEN);
            if(editingFileId === 'new') addDownload({ id, title: fileData.titleCN, fileName: fileData.fileName, fileUrl: fileData.fileUrl, category: 'General' });
            else updateDownload({ id, title: fileData.titleCN, fileName: fileData.fileName, fileUrl: fileData.fileUrl, category: 'General' });
            setEditingFileId(null); showToast('资源已保存');
        } catch(e) { showToast('保存失败'); }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex gap-4 border-b-2 border-gray-100 pb-1 overflow-x-auto">
                {['base', 'history', 'certs', 'files'].map((tab: any) => (
                    <button key={tab} onClick={() => setSubTab(tab)} className={`pb-4 px-8 font-black whitespace-nowrap transition-all uppercase tracking-widest text-sm ${subTab === tab ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
                        {tab === 'base' ? '核心板块' : tab === 'history' ? '发展历程' : tab === 'certs' ? '荣誉资质' : '下载中心'}
                    </button>
                ))}
            </div>
            {loading && <div className="p-8 text-center text-gray-400">正在读取双语数据库...</div>}
            
            {/* === Tab 1: 核心板块 (修复图片上传) === */}
            {!loading && subTab === 'base' && fullData && (
                <div className="grid grid-cols-1 gap-10">
                    {content.about.sections.map(sec => {
                        // 1. 实时读取 fullData 中的数据
                        const cnPage = fullData.CN?.about?.pages?.[sec.id] || { content: '', images: [] };
                        const enPage = fullData.EN?.about?.pages?.[sec.id] || { content: '', images: [] };
                        const currentImages = cnPage.images || [];

                        // 图片添加函数：直接修改 fullData
                        const addImg = (b64: string) => {
                            setFullData(prev => {
                                if(!prev) return null;
                                const next = {...prev};
                                if(!next.CN.about.pages[sec.id]) next.CN.about.pages[sec.id] = {id: sec.id, content: '', images: []};
                                if(!next.EN.about.pages[sec.id]) next.EN.about.pages[sec.id] = {id: sec.id, content: '', images: []};
                                // 添加到两边
                                next.CN.about.pages[sec.id].images = [b64, ...next.CN.about.pages[sec.id].images];
                                next.EN.about.pages[sec.id].images = [b64, ...next.EN.about.pages[sec.id].images];
                                return next;
                            });
                        };

                        // 图片删除函数
                        const delImg = (idx: number) => {
                            setFullData(prev => {
                                if(!prev) return null;
                                const next = {...prev};
                                const cnImgs = [...(next.CN.about.pages[sec.id]?.images || [])]; cnImgs.splice(idx, 1);
                                const enImgs = [...(next.EN.about.pages[sec.id]?.images || [])]; enImgs.splice(idx, 1);
                                if(next.CN.about.pages[sec.id]) next.CN.about.pages[sec.id].images = cnImgs;
                                if(next.EN.about.pages[sec.id]) next.EN.about.pages[sec.id].images = enImgs;
                                return next;
                            });
                        };

                        return (
                            <div key={sec.id} className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-sm space-y-6">
                                <h4 className="font-black text-2xl text-blue-900 border-l-8 border-blue-600 pl-6">{sec.title}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100"><label className="block text-[10px] font-black text-red-400 mb-2 uppercase">中文内容 (CN)</label><textarea className="w-full border-2 border-white p-4 rounded-xl h-64 text-sm bg-white/50 focus:bg-white transition-all outline-none" value={cnPage.content} onChange={e => handleTextChange('CN', sec.id, e.target.value)} placeholder="请输入中文介绍..."/></div>
                                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100"><label className="block text-[10px] font-black text-blue-400 mb-2 uppercase">英文内容 (EN)</label><textarea className="w-full border-2 border-white p-4 rounded-xl h-64 text-sm bg-white/50 focus:bg-white transition-all outline-none" value={enPage.content} onChange={e => handleTextChange('EN', sec.id, e.target.value)} placeholder="Please enter English introduction..."/></div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase">板块配图 (双语共用)</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {currentImages.map((img: string, idx: number) => (
                                            <div key={idx} className="relative aspect-video group border-2 border-gray-100 rounded-2xl overflow-hidden bg-gray-100">
                                                <img src={img} className="w-full h-full object-cover" alt="" />
                                                <button onClick={() => delImg(idx)} className="absolute inset-0 bg-red-600/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2/></button>
                                            </div>
                                        ))}
                                        {/* 修复：将 FileUploader 放在可见位置，不使用 hidden 遮罩 */}
                                        <div className="aspect-video border-4 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all gap-2 p-4">
                                            <div className="scale-125"><FileUploader onUpload={addImg} /></div>
                                            <span className="text-[10px] font-bold text-gray-400">点击添加</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end"><button onClick={() => handleSaveSection(sec.id, currentImages)} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all flex items-center"><CheckCircle size={18} className="mr-2"/> 保存此板块 (双语)</button></div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            {/* === Tab 2: 发展历程 (双语 + 图片上传) === */}
            {subTab === 'history' && (
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 space-y-8">
                    <div className="flex justify-between items-center"><h4 className="text-xl font-black flex items-center gap-2 text-blue-900"><History /> 发展历程管理</h4><button onClick={() => { setEditingHistoryId('new'); setHistoryData({ year: '2025', titleCN: '', titleEN: '', image: '' }); }} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black">+ 新增年份</button></div>
                    
                    {/* 编辑弹窗 */}
                    {editingHistoryId && (
                        <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-200 shadow-xl space-y-4">
                            <h5 className="font-bold text-blue-800">编辑年份数据</h5>
                            <div className="flex gap-4 items-start">
                                {/* 图片上传区域 */}
                                <div className="w-24 h-24 border-2 rounded-xl bg-white flex items-center justify-center relative flex-shrink-0 overflow-hidden">
                                    {historyData.image ? <img src={historyData.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-200"/>}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                                        <FileUploader onUpload={b => setHistoryData({...historyData, image: b})} />
                                    </div>
                                </div>
                                
                                <div className="flex-grow space-y-2">
                                    <div className="flex gap-4">
                                        <input className="w-24 border-2 p-2 rounded-xl text-center font-black" placeholder="年份" value={historyData.year} onChange={e=>setHistoryData({...historyData, year:e.target.value})} />
                                        <div className="text-xs text-gray-400 flex items-center">* 图片非必填，点击左侧方框上传</div>
                                    </div>
                                    <input className="w-full border-2 p-2 rounded-xl border-red-200" placeholder="中文标题 (CN)" value={historyData.titleCN} onChange={e=>setHistoryData({...historyData, titleCN:e.target.value})} />
                                    <input className="w-full border-2 p-2 rounded-xl border-blue-200" placeholder="English Title (EN)" value={historyData.titleEN} onChange={e=>setHistoryData({...historyData, titleEN:e.target.value})} />
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button onClick={saveHistory} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black">保存双语</button>
                                <button onClick={()=>setEditingHistoryId(null)} className="bg-gray-200 text-gray-500 px-6 py-2 rounded-xl">取消</button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {(content.about.history || []).map(h => (
                            <div key={h.id} className="flex gap-4 items-center p-5 border-2 border-gray-50 rounded-2xl bg-gray-50/50 hover:bg-white transition-all">
                                <div className="w-16 h-16 bg-white rounded-xl border overflow-hidden shrink-0">
                                    {h.image ? <img src={h.image} className="w-full h-full object-cover"/> : <div className="w-full h-full bg-gray-100 flex items-center justify-center"><ImageIcon size={16} className="text-gray-300"/></div>}
                                </div>
                                <div className="w-16 font-black text-blue-600 text-xl">{h.year}</div>
                                <div className="flex-grow font-bold">{h.title}</div>
                                <button onClick={()=>startEditHistory(h)} className="text-blue-500 p-2 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
                                <button onClick={() => deleteHistory(h.id)} className="text-red-300 hover:text-red-600 p-3"><Trash2/></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* === Tab 3: 荣誉资质 (双语版) === */}
            {subTab === 'certs' && (
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 space-y-8">
                    <div className="flex justify-between items-center"><h4 className="text-xl font-black flex items-center gap-2 text-blue-900"><ShieldCheck /> 荣誉资质管理</h4><button onClick={() => { setEditingCertId('new'); setCertData({ image: '', titleCN: '', titleEN: '', categoryCN: '', categoryEN: '' }); }} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black">+ 添加新资质</button></div>
                    {editingCertId && (
                        <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-200 shadow-xl space-y-4">
                            <h5 className="font-bold text-blue-800">编辑证书</h5>
                            <div className="flex gap-4"><div className="w-32 aspect-[3/4] bg-white rounded-xl border flex items-center justify-center relative"><img src={certData.image} className="w-full h-full object-contain" /><div className="absolute inset-0 opacity-0 hover:opacity-100 bg-black/30 flex items-center justify-center cursor-pointer"><FileUploader onUpload={b=>setCertData({...certData, image:b})} hint="更换图片" /></div></div><div className="flex-grow space-y-2"><input className="w-full border-2 p-2 rounded-xl border-red-200" placeholder="中文名称 (CN)" value={certData.titleCN} onChange={e=>setCertData({...certData, titleCN:e.target.value})} /><input className="w-full border-2 p-2 rounded-xl border-blue-200" placeholder="English Name (EN)" value={certData.titleEN} onChange={e=>setCertData({...certData, titleEN:e.target.value})} /></div></div>
                            <div className="flex gap-2 justify-end"><button onClick={saveCert} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black">保存双语</button><button onClick={()=>setEditingCertId(null)} className="bg-gray-200 text-gray-500 px-6 py-2 rounded-xl">取消</button></div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">{(content.about.certificates || []).map(c => (<div key={c.id} className="bg-gray-50 p-4 rounded-3xl border-2 border-gray-100 relative group"><div className="aspect-[3/4] bg-white rounded-2xl overflow-hidden border-2 mb-3 relative shadow-inner"><img src={c.image || ''} className="w-full h-full object-contain" /></div><div className="text-xs font-black text-center text-blue-900 truncate">{c.title}</div><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2"><button onClick={()=>startEditCert(c)} className="bg-white text-blue-600 p-2 rounded-full"><Edit size={16}/></button><button onClick={() => { if(window.confirm('确定删除?')) deleteCertificate(c.id); }} className="bg-red-500 text-white p-2 rounded-full"><X size={16}/></button></div></div>))}</div>
                </div>
            )}

            {/* === Tab 4: 下载中心 (双语版) === */}
            {subTab === 'files' && (
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 space-y-8">
                    <div className="flex justify-between items-center"><h4 className="text-xl font-black flex items-center gap-2 text-blue-900"><DownloadCloud /> 下载中心管理</h4><button onClick={() => { setEditingFileId('new'); setFileData({ fileName: 'file.pdf', fileUrl: '', titleCN: '', titleEN: '' }); }} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black">+ 新增资源</button></div>
                    {editingFileId && (
                        <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-200 shadow-xl space-y-4">
                            <h5 className="font-bold text-blue-800">编辑文件</h5>
                            <div className="flex gap-4 flex-col md:flex-row"><div className="flex-grow space-y-2"><input className="w-full border-2 p-2 rounded-xl border-red-200" placeholder="中文显示名称" value={fileData.titleCN} onChange={e=>setFileData({...fileData, titleCN:e.target.value})} /><input className="w-full border-2 p-2 rounded-xl border-blue-200" placeholder="English Display Name" value={fileData.titleEN} onChange={e=>setFileData({...fileData, titleEN:e.target.value})} /></div><div className="flex-grow space-y-2"><div className="flex gap-2"><input className="w-full border-2 p-2 rounded-xl bg-white" placeholder="文件地址 (URL)" value={fileData.fileUrl} onChange={e=>setFileData({...fileData, fileUrl:e.target.value})} /><FileUploader onUpload={b=>setFileData({...fileData, fileUrl:b})} hint="上传PDF" /></div><input className="w-full border-2 p-2 rounded-xl bg-gray-100 text-gray-500" placeholder="物理文件名 (用于显示格式)" value={fileData.fileName} onChange={e=>setFileData({...fileData, fileName:e.target.value})} /></div></div>
                            <div className="flex gap-2 justify-end"><button onClick={saveFile} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black">保存双语</button><button onClick={()=>setEditingFileId(null)} className="bg-gray-200 text-gray-500 px-6 py-2 rounded-xl">取消</button></div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{(content.about.downloads || []).map(d => (<div key={d.id} className="flex items-center gap-4 p-5 bg-gray-50 rounded-[2rem] border-2 border-gray-100 group transition-all hover:border-blue-200"><div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 shrink-0"><FileText /></div><div className="flex-grow"><div className="font-black text-sm text-blue-900">{d.title}</div><div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{d.fileName}</div></div><div className="flex items-center gap-2"><button onClick={()=>startEditFile(d)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button><button onClick={() => { if(window.confirm('确定删除?')) deleteDownload(d.id); }} className="p-3 text-red-300 hover:text-red-500"><Trash2 size={20}/></button></div></div>))}</div>
                </div>
            )}
        </div>
    );
};

// 8. 特殊产品详情 (PU同步带/圆带 - 双语同步版)
export const CustomPageEditor = ({ showToast }: any) => {
    const { content, updateCustomPage } = useLanguage();
    const [pageId, setPageId] = useState('pu-timing-belts');
    
    // 双语表格数据
    const [fullData, setFullData] = useState<{CN: CustomPageData, EN: CustomPageData} | null>(null);
    const [tableLang, setTableLang] = useState<'CN' | 'EN'>('CN'); // 控制下方表格显示语言

    // 切换页面时重新加载双语数据
    useEffect(() => {
        const load = async () => {
            try {
                const dbCN = await DatabaseService.getContent('CN');
                const dbEN = await DatabaseService.getContent('EN');
                if(dbCN && dbEN) {
                    setFullData({ CN: dbCN.customPages[pageId], EN: dbEN.customPages[pageId] });
                }
            } catch(e) { console.error(e); }
        };
        load();
    }, [pageId]);

    if (!content || !fullData) return <div className="p-8">正在加载双语表格数据...</div>;

    const handleSave = async () => {
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            if(!dbCN || !dbEN) return;

            dbCN.customPages[pageId] = fullData.CN;
            dbEN.customPages[pageId] = fullData.EN;

            await DatabaseService.saveContent('CN', dbCN);
            await DatabaseService.saveContent('EN', dbEN);

            updateCustomPage(pageId, fullData.CN); // 仅更新当前显示为中文 (简单处理)
            showToast('双语详情已保存');
        } catch(e) { showToast('保存失败', 'error'); }
    };

    // 辅助更新: 同时更新 CN 和 EN 的某个字段 (如 introText)
    const updateBoth = (field: keyof CustomPageData, valCN: any, valEN: any) => {
        setFullData(prev => {
            if(!prev) return null;
            return {
                CN: { ...prev.CN, [field]: valCN },
                EN: { ...prev.EN, [field]: valEN }
            };
        });
    };

    // 辅助更新: 表格操作 (仅操作当前选中的语言)
    // 注意: 添加/删除行时，尝试同步结构，内容设为空
    const updateTable = (updates: (data: CustomPageData) => void) => {
        setFullData(prev => {
            if(!prev) return null;
            const newData = { ...prev };
            // 如果是添加行，两边都加
            updates(newData[tableLang]);
            return newData;
        });
    };

    const addRow = (tIdx: number) => {
        setFullData(prev => {
            if(!prev) return null;
            const next = { ...prev };
            // 两边都加行，保持结构一致
            next.CN.tables[tIdx].rows.push(new Array(next.CN.tables[tIdx].cols.length).fill(''));
            next.EN.tables[tIdx].rows.push(new Array(next.EN.tables[tIdx].cols.length).fill(''));
            return next;
        });
    };
    
    const removeRow = (tIdx: number, rIdx: number) => {
        setFullData(prev => {
            if(!prev) return null;
            const next = { ...prev };
            next.CN.tables[tIdx].rows.splice(rIdx, 1);
            next.EN.tables[tIdx].rows.splice(rIdx, 1);
            return next;
        });
    };

    const activeData = fullData[tableLang]; // 当前编辑的表格数据源

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex gap-4 border-b-2 pb-4"><button className={`px-8 py-3 rounded-2xl font-black ${pageId==='pu-timing-belts'?'bg-blue-600 text-white shadow-lg':'bg-gray-100 text-gray-50'}`} onClick={()=>setPageId('pu-timing-belts')}>PU 同步带</button><button className={`px-8 py-3 rounded-2xl font-black ${pageId==='round-v-belts'?'bg-blue-600 text-white shadow-lg':'bg-gray-100 text-gray-50'}`} onClick={()=>setPageId('round-v-belts')}>PU 圆带</button></div>
            
            {/* 双语介绍文本 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                    <label className="block text-[10px] font-black text-red-400 mb-2">介绍导语 (CN)</label>
                    <textarea className="w-full border-2 p-3 rounded-xl h-32" value={fullData.CN.introText} onChange={e => updateBoth('introText', e.target.value, fullData.EN.introText)} />
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <label className="block text-[10px] font-black text-blue-400 mb-2">Intro Text (EN)</label>
                    <textarea className="w-full border-2 p-3 rounded-xl h-32" value={fullData.EN.introText} onChange={e => updateBoth('introText', fullData.CN.introText, e.target.value)} />
                </div>
            </div>

            {/* 表格编辑区域 */}
            <div className="border-t-2 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-black">参数表格</h3>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button onClick={()=>setTableLang('CN')} className={`px-4 py-1 rounded-lg font-bold text-sm ${tableLang==='CN'?'bg-red-500 text-white shadow':'text-gray-500'}`}>编辑中文表格</button>
                        <button onClick={()=>setTableLang('EN')} className={`px-4 py-1 rounded-lg font-bold text-sm ${tableLang==='EN'?'bg-blue-600 text-white shadow':'text-gray-500'}`}>Edit EN Table</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-10">
                    {activeData.tables.map((table, tIdx) => (
                        <div key={tIdx} className={`p-8 rounded-[2.5rem] border-4 shadow-sm space-y-6 ${tableLang==='CN'?'bg-red-50/30 border-red-50':'bg-blue-50/30 border-blue-50'}`}>
                            <div className="flex flex-col md:flex-row gap-8 mb-6">
                                <div className="flex-grow">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">表格名称 ({tableLang})</label>
                                    <input className="w-full border-2 p-3 rounded-xl font-black bg-white" value={table.title} onChange={e => updateTable(d => d.tables[tIdx].title = e.target.value)} />
                                </div>
                                <div className="w-40 h-24 border-2 rounded-xl bg-gray-50 shrink-0 overflow-hidden relative group">
                                    <img src={table.image} className="w-full h-full object-contain" alt="" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><FileUploader onUpload={b => { 
                                        // 图片同步更新两边
                                        setFullData(prev => prev ? ({ CN: {...prev.CN, tables: prev.CN.tables.map((t,i)=>i===tIdx?{...t,image:b}:t)}, EN: {...prev.EN, tables: prev.EN.tables.map((t,i)=>i===tIdx?{...t,image:b}:t)} }) : null);
                                    }} /></div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-xs border-collapse">
                                    <thead className="bg-white/50">
                                        <tr>
                                            {table.cols.map((col, cIdx) => (
                                                <th key={cIdx} className="p-1 border-2 border-gray-200">
                                                    <input className="w-full bg-transparent p-2 text-center font-black outline-none" value={col} onChange={e => updateTable(d => d.tables[tIdx].cols[cIdx] = e.target.value)} />
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {table.rows.map((row, rIdx) => (
                                            <tr key={rIdx} className="bg-white">
                                                {row.map((cell, cIdx) => (
                                                    <td key={cIdx} className="p-0 border-2 border-gray-100">
                                                        <input className="w-full p-3 font-bold text-center outline-none focus:bg-yellow-50" value={cell} onChange={e => updateTable(d => d.tables[tIdx].rows[rIdx][cIdx] = e.target.value)} />
                                                    </td>
                                                ))}
                                                <td className="p-3 border-2 border-gray-100 text-center w-10">
                                                    <button onClick={() => removeRow(tIdx, rIdx)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex gap-4 mt-4">
                                    <button onClick={() => addRow(tIdx)} className="px-6 py-2 bg-green-50 text-green-600 rounded-xl font-black text-xs hover:bg-green-100 transition-all">+ 插入空行 (双语同步)</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={handleSave} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all active:scale-95">发布双语更新</button>
        </div>
    );
};

// 9. 综合编辑器 (新闻/联络/反馈 - News部分为双语同步版)
export const MiscEditor = ({ showToast }: any) => {
    const { content, updateMainContact, addNews, updateNews, deleteNews, deleteFeedback, addSocial, updateSocial, deleteSocial, addBranch, updateBranch, deleteBranch } = useLanguage();
    const [subTab, setSubTab] = useState<'news' | 'contact' | 'branches' | 'socials' | 'feedback'>('news');
    
    // News 编辑状态
    const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
    const [newsDataCN, setNewsDataCN] = useState<NewsItem>({} as NewsItem);
    const [newsDataEN, setNewsDataEN] = useState<NewsItem>({} as NewsItem);
    // ... (在 newsDataEN 定义之后插入) ...

    // 1. 总部信息状态
    const [contactDual, setContactDual] = useState<{CN: ContactInfo, EN: ContactInfo} | null>(null);

    // 2. 分公司编辑状态
    const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
    const [branchData, setBranchData] = useState({ nameCN: '', nameEN: '', addressCN: '', addressEN: '', phone: '', fax: '', email: '', image: '' });

    // 3. 社交图标编辑状态
    const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
    const [socialData, setSocialData] = useState({ textCN: '', textEN: '', image: '' });

    // 自动加载总部双语信息 (切换到 contact 标签时)
    useEffect(() => {
        if (subTab === 'contact') {
            const load = async () => {
                try {
                    const c = await DatabaseService.getContent('CN');
                    const e = await DatabaseService.getContent('EN');
                    if (c && e) setContactDual({ CN: c.contact, EN: e.contact });
                } catch(e) {}
            };
            load();
        }
    }, [subTab]);

    if (!content) return null;

    // --- 逻辑 A: 总部信息保存 (双语) ---
    const saveContact = async () => {
        if (!contactDual) return;
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            
            // 电话、传真、邮箱、图片是共用的，强制以中文版输入为准同步过去
            const shared = { 
                phone: contactDual.CN.phone, 
                fax: contactDual.CN.fax, 
                email: contactDual.CN.email, 
                image: contactDual.CN.image 
            };

            dbCN.contact = { ...contactDual.CN, ...shared };
            dbEN.contact = { ...contactDual.EN, ...shared };

            await DatabaseService.saveContent('CN', dbCN);
            await DatabaseService.saveContent('EN', dbEN);
            updateMainContact(dbCN.contact); // 更新界面显示
            showToast('双语总部信息已保存');
        } catch(e) { showToast('保存失败', 'error'); }
    };

    // --- 逻辑 B: 分公司管理 (双语) ---
    const startEditBranch = async (b: any) => {
        setEditingBranchId(b.id);
        // 从数据库读取最新的双语数据
        const dbCN = await DatabaseService.getContent('CN');
        const dbEN = await DatabaseService.getContent('EN');
        const bCN = dbCN?.branches.find((i:any)=>i.id===b.id);
        const bEN = dbEN?.branches.find((i:any)=>i.id===b.id);
        
        setBranchData({
            nameCN: bCN?.name||'', nameEN: bEN?.name||'',
            addressCN: bCN?.address||'', addressEN: bEN?.address||'',
            phone: b.phone, fax: b.fax, email: b.email, image: b.image
        });
    };

    const saveBranch = async () => {
        const id = editingBranchId === 'new' ? `b_${Date.now()}` : editingBranchId!;
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            
            // 辅助更新函数
            const updateList = (db: any, name: string, addr: string) => {
                const item = { id, name, address: addr, phone: branchData.phone, fax: branchData.fax, email: branchData.email, image: branchData.image };
                const idx = db.branches.findIndex((x:any) => x.id === id);
                if(idx > -1) db.branches[idx] = item; else db.branches.push(item);
            };

            updateList(dbCN, branchData.nameCN, branchData.addressCN);
            updateList(dbEN, branchData.nameEN, branchData.addressEN);

            await DatabaseService.saveContent('CN', dbCN);
            await DatabaseService.saveContent('EN', dbEN);

            if(editingBranchId==='new') addBranch({ id, name: branchData.nameCN, address: branchData.addressCN, phone: branchData.phone, fax: branchData.fax, email: branchData.email, image: branchData.image });
            else updateBranch(id, { name: branchData.nameCN, address: branchData.addressCN, phone: branchData.phone, fax: branchData.fax, email: branchData.email, image: branchData.image });
            
            setEditingBranchId(null); 
            showToast('分公司信息已保存');
        } catch(e) { showToast('保存失败', 'error'); }
    };

    // --- 逻辑 C: 社交图标 (双语) ---
    const startEditSocial = async (s: any) => {
        setEditingSocialId(s.id);
        const dbCN = await DatabaseService.getContent('CN');
        const dbEN = await DatabaseService.getContent('EN');
        const sCN = dbCN?.socials.find((i:any)=>i.id===s.id);
        const sEN = dbEN?.socials.find((i:any)=>i.id===s.id);
        setSocialData({ textCN: sCN?.text||'', textEN: sEN?.text||'', image: s.image });
    };

    const saveSocial = async () => {
        const id = editingSocialId === 'new' ? Date.now().toString() : editingSocialId!;
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            
            const updateList = (db: any, text: string) => {
                const item = { id, text, image: socialData.image };
                const idx = db.socials.findIndex((x:any) => x.id === id);
                if(idx > -1) db.socials[idx] = item; else db.socials.push(item);
            };

            updateList(dbCN, socialData.textCN);
            updateList(dbEN, socialData.textEN);

            await DatabaseService.saveContent('CN', dbCN);
            await DatabaseService.saveContent('EN', dbEN);

            if(editingSocialId==='new') addSocial({ id, text: socialData.textCN, image: socialData.image });
            else updateSocial(id, { text: socialData.textCN, image: socialData.image });
            
            setEditingSocialId(null); 
            showToast('社交信息已保存');
        } catch(e) { showToast('保存失败', 'error'); }
    };

    const startEditNews = async (item: NewsItem) => {
        setEditingNewsId(item.id);
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            const nCN = dbCN?.news.find(n => n.id === item.id);
            const nEN = dbEN?.news.find(n => n.id === item.id);
            setNewsDataCN(nCN || item);
            setNewsDataEN(nEN || item);
        } catch(e) { console.error(e); }
    };

    const startAddNews = () => {
        setEditingNewsId('new_news');
        const empty = { id: Date.now().toString(), title: '', date: new Date().toISOString().split('T')[0], summary: '', content: '', image: '' };
        setNewsDataCN(empty);
        setNewsDataEN(empty);
    };

    const saveNews = async () => {
        const id = editingNewsId === 'new_news' ? newsDataCN.id : editingNewsId!;
        try {
            const dbCN = await DatabaseService.getContent('CN');
            const dbEN = await DatabaseService.getContent('EN');
            if(!dbCN || !dbEN) return;

            const updateList = (db: any, data: NewsItem) => {
                const idx = db.news.findIndex((n: any) => n.id === id);
                // 强制共用图片和日期
                const finalData = { ...data, id, date: newsDataCN.date, image: newsDataCN.image };
                if (idx > -1) db.news[idx] = finalData;
                else db.news.unshift(finalData); // 新闻插在最前
            };

            updateList(dbCN, newsDataCN);
            updateList(dbEN, newsDataEN);

            await DatabaseService.saveContent('CN', dbCN);
            await DatabaseService.saveContent('EN', dbEN);

            if(editingNewsId === 'new_news') addNews(newsDataCN);
            else updateNews(id, newsDataCN);

            showToast('双语新闻已保存');
            setEditingNewsId(null);
        } catch(e) { showToast('保存失败', 'error'); }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex gap-4 border-b-2 border-gray-100 pb-1 overflow-x-auto">{['news', 'contact', 'branches', 'socials', 'feedback'].map((tab: any) => (<button key={tab} onClick={() => setSubTab(tab)} className={`pb-4 px-8 font-black whitespace-nowrap transition-all uppercase tracking-widest text-sm ${subTab === tab ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>{tab === 'news' ? '新闻动态' : tab === 'contact' ? '总部信息' : tab === 'branches' ? '分公司' : tab === 'socials' ? '底部社交' : '客户留言'}</button>))}</div>
            
            {subTab === 'news' && (
                <div className="space-y-6">
                    <button onClick={startAddNews} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all">+ 发布新动态</button>
                    
                    {editingNewsId && (
                        <div className="bg-white p-8 rounded-[2.5rem] border-4 border-blue-50 shadow-2xl sticky top-4 z-20 space-y-6">
                            <h4 className="font-black text-xl text-blue-900 border-b pb-2">编辑新闻</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2 flex gap-4">
                                    <div><label className="text-xs font-bold text-gray-400">日期 (共用)</label><input className="border-2 p-2 rounded-xl" type="date" value={newsDataCN.date} onChange={e=>{setNewsDataCN({...newsDataCN, date:e.target.value}); setNewsDataEN({...newsDataEN, date:e.target.value})}} /></div>
                                    <div className="flex-grow"><label className="text-xs font-bold text-gray-400">封面图 (共用)</label><div className="flex"><input className="w-full border-2 p-2 rounded-xl" value={newsDataCN.image} onChange={e=>{setNewsDataCN({...newsDataCN, image:e.target.value}); setNewsDataEN({...newsDataEN, image:e.target.value})}} /><FileUploader onUpload={b=>{setNewsDataCN({...newsDataCN, image:b}); setNewsDataEN({...newsDataEN, image:b})}} /></div></div>
                                </div>
                                <div className="bg-red-50 p-4 rounded-xl space-y-3">
                                    <div className="text-red-800 font-bold text-xs bg-red-200 inline-block px-2 py-1 rounded">中文 CN</div>
                                    <input className="w-full border-2 p-2 rounded-lg font-bold" placeholder="标题" value={newsDataCN.title} onChange={e=>setNewsDataCN({...newsDataCN, title: e.target.value})}/>
                                    <textarea className="w-full border-2 p-2 rounded-lg h-24 text-sm" placeholder="摘要" value={newsDataCN.summary} onChange={e=>setNewsDataCN({...newsDataCN, summary: e.target.value})}/>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl space-y-3">
                                    <div className="text-blue-800 font-bold text-xs bg-blue-200 inline-block px-2 py-1 rounded">英文 EN</div>
                                    <input className="w-full border-2 p-2 rounded-lg font-bold" placeholder="Title" value={newsDataEN.title} onChange={e=>setNewsDataEN({...newsDataEN, title: e.target.value})}/>
                                    <textarea className="w-full border-2 p-2 rounded-lg h-24 text-sm" placeholder="Summary" value={newsDataEN.summary} onChange={e=>setNewsDataEN({...newsDataEN, summary: e.target.value})}/>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4"><button onClick={saveNews} className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black">保存双语新闻</button><button onClick={()=>setEditingNewsId(null)} className="bg-gray-100 text-gray-500 px-10 py-3 rounded-2xl font-black">取消</button></div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">{content.news.map(n => (<div key={n.id} className="p-6 bg-white border-2 border-gray-50 rounded-[2rem] flex items-center gap-6 shadow-sm group"><div className="w-24 h-24 rounded-2xl overflow-hidden border-2 shrink-0 relative"><img src={n.image || ''} className="w-full h-full object-cover" alt="" /><div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><FileUploader onUpload={b => updateNews(n.id, {...n, image: b})} /></div></div><div className="flex-grow"><div className="font-black text-lg text-blue-900">{n.title}</div><div className="text-xs font-bold text-gray-400">{n.date}</div></div><button onClick={()=>startEditNews(n)} className="bg-blue-50 text-blue-600 p-3 rounded-xl hover:bg-blue-100 mr-2"><Edit size={16}/></button><button onClick={() => { if(window.confirm('删除动态?')) deleteNews(n.id); }} className="text-red-300 hover:text-red-600 p-4 transition-colors"><Trash2/></button></div>))}</div>
                </div>
            )}
            
            {/* === Tab 2: 总部信息 (双语版) === */}
            {subTab === 'contact' && contactDual && (
                <div className="bg-white p-8 rounded-[3rem] border-2 border-gray-100 shadow-sm max-w-5xl space-y-8">
                    <h4 className="text-2xl font-black text-blue-900 border-l-8 border-blue-600 pl-6 flex items-center gap-3"><Building2 size={24}/> 总部联络信息库</h4>
                    
                    {/* 共用信息 */}
                    <div className="bg-gray-50 p-6 rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="col-span-2 md:col-span-4 text-xs font-black text-gray-400 uppercase tracking-widest">共用联系方式 (Shared)</div>
                        <div><label className="block text-[10px] font-bold text-gray-400 mb-1">服务热线</label><input className="w-full border-2 p-2 rounded-xl font-black text-green-600" value={contactDual.CN.phone} onChange={e => setContactDual({...contactDual, CN: {...contactDual.CN, phone: e.target.value}})} /></div>
                        <div><label className="block text-[10px] font-bold text-gray-400 mb-1">传真 Fax</label><input className="w-full border-2 p-2 rounded-xl font-bold" value={contactDual.CN.fax} onChange={e => setContactDual({...contactDual, CN: {...contactDual.CN, fax: e.target.value}})} /></div>
                        <div className="col-span-2"><label className="block text-[10px] font-bold text-gray-400 mb-1">电子邮箱 Email</label><input className="w-full border-2 p-2 rounded-xl font-bold" value={contactDual.CN.email} onChange={e => setContactDual({...contactDual, CN: {...contactDual.CN, email: e.target.value}})} /></div>
                    </div>

                    {/* 双语对照输入 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 中文 */}
                        <div className="space-y-4">
                            <div className="text-red-800 font-bold text-xs bg-red-50 inline-block px-3 py-1 rounded-full">中文信息 (CN)</div>
                            <div><label className="text-[10px] font-bold text-gray-400">公司全称</label><input className="w-full border-2 border-red-100 p-3 rounded-xl font-black text-blue-900" value={contactDual.CN.companyName} onChange={e => setContactDual({...contactDual, CN: {...contactDual.CN, companyName: e.target.value}})} /></div>
                            <div><label className="text-[10px] font-bold text-gray-400">办公地址</label><input className="w-full border-2 border-red-100 p-3 rounded-xl" value={contactDual.CN.address} onChange={e => setContactDual({...contactDual, CN: {...contactDual.CN, address: e.target.value}})} /></div>
                            <div><label className="text-[10px] font-bold text-gray-400">办公邮编</label><input className="w-full border-2 border-red-100 p-3 rounded-xl" value={contactDual.CN.zip} onChange={e => setContactDual({...contactDual, CN: {...contactDual.CN, zip: e.target.value}})} /></div>
                            <div><label className="text-[10px] font-bold text-gray-400">工厂地址</label><input className="w-full border-2 border-red-100 p-3 rounded-xl" value={contactDual.CN.factoryAddress} onChange={e => setContactDual({...contactDual, CN: {...contactDual.CN, factoryAddress: e.target.value}})} /></div>
                            <div><label className="text-[10px] font-bold text-gray-400">工厂邮编</label><input className="w-full border-2 border-red-100 p-3 rounded-xl" value={contactDual.CN.factoryZip} onChange={e => setContactDual({...contactDual, CN: {...contactDual.CN, factoryZip: e.target.value}})} /></div>
                        </div>

                        {/* 英文 */}
                        <div className="space-y-4">
                            <div className="text-blue-800 font-bold text-xs bg-blue-50 inline-block px-3 py-1 rounded-full">英文信息 (EN)</div>
                            <div><label className="text-[10px] font-bold text-gray-400">Company Name</label><input className="w-full border-2 border-blue-100 p-3 rounded-xl font-black text-blue-900" value={contactDual.EN.companyName} onChange={e => setContactDual({...contactDual, EN: {...contactDual.EN, companyName: e.target.value}})} /></div>
                            <div><label className="text-[10px] font-bold text-gray-400">Office Address</label><input className="w-full border-2 border-blue-100 p-3 rounded-xl" value={contactDual.EN.address} onChange={e => setContactDual({...contactDual, EN: {...contactDual.EN, address: e.target.value}})} /></div>
                            <div><label className="text-[10px] font-bold text-gray-400">Zip Code</label><input className="w-full border-2 border-blue-100 p-3 rounded-xl" value={contactDual.EN.zip} onChange={e => setContactDual({...contactDual, EN: {...contactDual.EN, zip: e.target.value}})} /></div>
                            <div><label className="text-[10px] font-bold text-gray-400">Factory Address</label><input className="w-full border-2 border-blue-100 p-3 rounded-xl" value={contactDual.EN.factoryAddress} onChange={e => setContactDual({...contactDual, EN: {...contactDual.EN, factoryAddress: e.target.value}})} /></div>
                            <div><label className="text-[10px] font-bold text-gray-400">Factory Zip</label><input className="w-full border-2 border-blue-100 p-3 rounded-xl" value={contactDual.EN.factoryZip} onChange={e => setContactDual({...contactDual, EN: {...contactDual.EN, factoryZip: e.target.value}})} /></div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-32 h-20 border-2 rounded-xl bg-gray-50 overflow-hidden relative group">
                                <img src={contactDual.CN.image} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <FileUploader onUpload={b => setContactDual({...contactDual, CN: {...contactDual.CN, image: b}, EN: {...contactDual.EN, image: b}})} />
                                </div>
                            </div>
                            <span className="text-xs text-gray-400 font-bold">总部形象配图 (共用)</span>
                        </div>
                        <button onClick={saveContact} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all active:scale-95">发布双语总部信息</button>
                    </div>
                </div>
            )}
            {/* === Tab 3: 分公司 (双语版) === */}
            {subTab === 'branches' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center mb-6"><h4 className="text-xl font-black text-blue-900 flex items-center gap-2 uppercase tracking-tighter"><Building2/> 分公司与办事处</h4><button onClick={() => { setEditingBranchId('new'); setBranchData({ nameCN: '', nameEN: '', addressCN: '', addressEN: '', phone: '', fax: '', email: '', image: '' }); }} className="bg-brand-green text-white px-8 py-3 rounded-2xl font-black shadow-lg">+ 新增分机构</button></div>
                    
                    {/* 编辑弹窗 */}
                    {editingBranchId && (
                        <div className="bg-white p-8 rounded-[2.5rem] border-4 border-green-50 shadow-2xl mb-8 sticky top-4 z-20">
                            <h4 className="font-black text-xl text-green-800 border-b pb-2 mb-4">编辑分公司信息</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 共用 */}
                                <div className="col-span-1 md:col-span-2 grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-2xl">
                                    <div className="col-span-4 text-xs font-bold text-gray-400 uppercase">共用信息 (Shared)</div>
                                    <input className="border-2 p-2 rounded-xl" placeholder="Phone" value={branchData.phone} onChange={e=>setBranchData({...branchData, phone:e.target.value})} />
                                    <input className="border-2 p-2 rounded-xl" placeholder="Fax" value={branchData.fax} onChange={e=>setBranchData({...branchData, fax:e.target.value})} />
                                    <input className="col-span-2 border-2 p-2 rounded-xl" placeholder="Email" value={branchData.email} onChange={e=>setBranchData({...branchData, email:e.target.value})} />
                                    <div className="col-span-4 flex items-center gap-2">
                                        <input className="w-full border-2 p-2 rounded-xl bg-white" placeholder="Image URL" value={branchData.image} onChange={e=>setBranchData({...branchData, image:e.target.value})} />
                                        <FileUploader onUpload={b=>setBranchData({...branchData, image:b})} />
                                    </div>
                                </div>
                                {/* 中文 */}
                                <div className="bg-red-50 p-4 rounded-2xl space-y-2">
                                    <div className="text-red-800 text-xs font-bold">中文 (CN)</div>
                                    <input className="w-full border-2 border-red-100 p-2 rounded-xl" placeholder="分公司名称" value={branchData.nameCN} onChange={e=>setBranchData({...branchData, nameCN:e.target.value})} />
                                    <input className="w-full border-2 border-red-100 p-2 rounded-xl" placeholder="地址" value={branchData.addressCN} onChange={e=>setBranchData({...branchData, addressCN:e.target.value})} />
                                </div>
                                {/* 英文 */}
                                <div className="bg-blue-50 p-4 rounded-2xl space-y-2">
                                    <div className="text-blue-800 text-xs font-bold">English (EN)</div>
                                    <input className="w-full border-2 border-blue-100 p-2 rounded-xl" placeholder="Branch Name" value={branchData.nameEN} onChange={e=>setBranchData({...branchData, nameEN:e.target.value})} />
                                    <input className="w-full border-2 border-blue-100 p-2 rounded-xl" placeholder="Address" value={branchData.addressEN} onChange={e=>setBranchData({...branchData, addressEN:e.target.value})} />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4 mt-4 border-t">
                                <button onClick={saveBranch} className="bg-green-600 text-white px-8 py-2 rounded-xl font-black">保存分公司</button>
                                <button onClick={()=>setEditingBranchId(null)} className="bg-gray-100 text-gray-500 px-8 py-2 rounded-xl">取消</button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">{content.branches.map(b => (<div key={b.id} className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-start relative group"><div className="w-full md:w-64 aspect-video bg-gray-50 rounded-2xl overflow-hidden relative shrink-0 border-2 border-gray-100"><img src={b.image || ''} className="w-full h-full object-cover" alt="" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><FileUploader onUpload={img => updateBranch(b.id, {...b, image: img})} /></div></div><div className="flex-grow grid grid-cols-1 gap-2 w-full"><div className="font-black text-xl text-blue-900">{b.name}</div><div className="text-sm font-bold text-gray-500">{b.address}</div><div className="text-xs text-gray-400 mt-2">{b.phone} | {b.email}</div></div><button onClick={()=>startEditBranch(b)} className="md:absolute top-8 right-20 p-3 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100"><Edit size={20}/></button><button onClick={() => { if(window.confirm('确定移除?')) deleteBranch(b.id); }} className="md:absolute top-8 right-8 p-3 text-red-300 hover:text-red-500 bg-red-50 rounded-xl transition-all"><Trash2 size={20}/></button></div>))}</div>
                </div>
            )}
            {/* === Tab 4: 底部社交 (双语版) === */}
            {subTab === 'socials' && (
                <div className="space-y-6">
                    {/* 编辑弹窗 */}
                    {editingSocialId && (
                        <div className="bg-white p-6 rounded-[2.5rem] border-4 border-blue-50 shadow-xl mb-6 flex flex-col md:flex-row gap-6 items-center">
                            <div className="w-32 h-32 border-2 rounded-2xl overflow-hidden relative flex-shrink-0">
                                <img src={socialData.image} className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all"><FileUploader onUpload={b=>setSocialData({...socialData, image:b})}/></div>
                            </div>
                            <div className="flex-grow w-full space-y-3">
                                <label className="text-xs font-bold text-gray-400">悬停提示文字 (Tooltip)</label>
                                <input className="w-full border-2 border-red-100 p-2 rounded-xl" placeholder="中文提示 (如：官方微信)" value={socialData.textCN} onChange={e=>setSocialData({...socialData, textCN:e.target.value})} />
                                <input className="w-full border-2 border-blue-100 p-2 rounded-xl" placeholder="English Tooltip (e.g. Official WeChat)" value={socialData.textEN} onChange={e=>setSocialData({...socialData, textEN:e.target.value})} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={saveSocial} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black">保存</button>
                                <button onClick={()=>setEditingSocialId(null)} className="bg-gray-100 text-gray-500 px-6 py-2 rounded-xl">取消</button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {content.socials.map(s => (
                            <div key={s.id} className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 flex flex-col items-center gap-4 group shadow-sm transition-all hover:shadow-md relative">
                                <div className="w-40 h-40 border-4 border-gray-50 rounded-[2rem] overflow-hidden bg-white p-2">
                                    <img src={s.image} className="w-full h-full object-contain" />
                                </div>
                                <div className="font-black text-blue-900">{s.text}</div>
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={()=>startEditSocial(s)} className="bg-blue-50 text-blue-600 p-2 rounded-full"><Edit size={16}/></button>
                                    <button onClick={() => { if(content.socials.length > 1) deleteSocial(s.id); }} className="bg-red-50 text-red-500 p-2 rounded-full"><Trash2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                        {content.socials.length < 3 && !editingSocialId && (
                            <button onClick={() => { setEditingSocialId('new'); setSocialData({ textCN: '', textEN: '', image: '' }); }} className="aspect-square border-4 border-dashed border-gray-100 rounded-[2.5rem] flex items-center justify-center text-gray-300 hover:text-blue-600 transition-all font-black uppercase text-xs">+ 添加社交入口</button>
                        )}
                    </div>
                </div>
            )}
            
            {subTab === 'feedback' && (<div className="overflow-hidden rounded-[2.5rem] border-2 border-gray-50 shadow-sm"><table className="min-w-full text-sm"><thead><tr className="bg-gray-900 text-white"><th className="p-5 text-left font-black text-[10px] uppercase tracking-widest">日期</th><th className="p-5 text-left font-black text-[10px] uppercase tracking-widest">客户</th><th className="p-5 text-left font-black text-[10px] uppercase tracking-widest">留言内容</th><th className="p-5 text-[10px] uppercase tracking-widest">操作</th></tr></thead><tbody className="divide-y divide-gray-100 bg-white">{content.feedback.map(f => (<tr key={f.id} className="hover:bg-blue-50/20 transition-colors"><td className="p-5 font-bold text-gray-400 text-xs">{f.date}</td><td className="p-5"><div className="font-black text-blue-900">{f.firstName} {f.lastName}</div><div className="text-[10px] text-gray-400 font-bold uppercase">{f.email}</div><div className="text-[10px] text-gray-400">{f.phone}</div></td><td className="p-5 text-gray-600 text-xs leading-relaxed max-w-md">{f.message}</td><td className="p-5 text-center"><button onClick={() => deleteFeedback(f.id)} className="text-red-300 hover:text-red-500 p-2 transition-colors"><Trash2 size={18}/></button></td></tr>))}</tbody></table></div>)}
        </div>
    );
};

// 10. 页面文案管理 (副标题 & Slogan)
export const TextContentEditor = ({ showToast }: any) => {
    // 状态：存储中英文数据
    const [data, setData] = useState<{ CN: any, EN: any } | null>(null);

    // 加载双语数据
    useEffect(() => {
        const load = async () => {
            try {
                const c = await DatabaseService.getContent('CN');
                const e = await DatabaseService.getContent('EN');
                
                // 给旧数据打补丁 (如果没字段，赋默认值)
                if (c && !c.pageSubtitles) {
                    c.footerSlogan = "全球自动化行业的可靠合作伙伴，卓越品质，传动未来。";
                    c.pageSubtitles = {
                        industry: "专注细分领域的输送解决方案",
                        product: "高性能工业皮带技术",
                        tech: "全系列产品详细规格参数",
                        news: "最新企业动态与行业资讯",
                        about: "专业的传动技术解决方案提供商"
                    };
                }
                if (e && !e.pageSubtitles) {
                    e.footerSlogan = "Reliable Solutions for Global Automation Industries. Excellence in Every Belt.";
                    e.pageSubtitles = {
                        industry: "Industry-Specific Conveyor Solutions",
                        product: "High-Performance Technological Belts",
                        tech: "Comprehensive specifications for all belt series",
                        news: "Latest Corporate Updates",
                        about: "Professional Technological Solutions Provider"
                    };
                }

                if (c && e) setData({ CN: c, EN: e });
            } catch (e) { console.error(e); }
        };
        load();
    }, []);

    if (!data) return <div className="p-8 text-center text-gray-400">正在加载配置...</div>;

    // 保存功能
    const handleSave = async () => {
        try {
            await DatabaseService.saveContent('CN', data.CN);
            await DatabaseService.saveContent('EN', data.EN);
            showToast('页面文案已更新，请刷新页面查看效果！');
        } catch (e) {
            showToast('保存失败', 'error');
        }
    };

    // 修改字段辅助函数
    const updateField = (lang: 'CN' | 'EN', field: string, val: string) => {
        const newData = { ...data };
        if (field === 'footerSlogan') {
            newData[lang].footerSlogan = val;
        } else {
            // 如果该语言下还没有 pageSubtitles 对象，先初始化一个
            if (!newData[lang].pageSubtitles) {
                newData[lang].pageSubtitles = { industry: '', product: '', tech: '', news: '', about: '' };
            }
            newData[lang].pageSubtitles[field] = val;
        }
        setData(newData);
    };

    const rows = [
        { key: 'industry', label: '行业应用 (Industry)' },
        { key: 'product', label: '产品中心 (Product)' },
        { key: 'tech', label: '技术参数 (Tech Data)' },
        { key: 'news', label: '新闻动态 (News)' },
        { key: 'about', label: '公司介绍 (About Us)' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-8 rounded-[3rem] border-2 border-gray-100 shadow-sm">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-brand-blue"><FileText /> 页面文案管理</h3>
                
                {/* 1. 各板块副标题 */}
                <div className="space-y-6 mb-10">
                    <h4 className="font-bold text-gray-800 border-b pb-2">各板块副标题 (Subtitles)</h4>
                    {rows.map(row => (
                        <div key={row.key} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <div className="md:col-span-2 text-xs font-black text-gray-400 uppercase tracking-widest">{row.label}</div>
                            <div>
                                <div className="text-[10px] text-red-400 font-bold mb-1">中文 (CN)</div>
                                <input className="w-full border-2 border-red-100 p-3 rounded-xl font-bold text-gray-700 focus:border-red-300 outline-none" 
                                    value={data.CN.pageSubtitles?.[row.key] || ''} 
                                    onChange={e => updateField('CN', row.key, e.target.value)} 
                                />
                            </div>
                            <div>
                                <div className="text-[10px] text-blue-400 font-bold mb-1">英文 (EN)</div>
                                <input className="w-full border-2 border-blue-100 p-3 rounded-xl font-bold text-gray-700 focus:border-blue-300 outline-none" 
                                    value={data.EN.pageSubtitles?.[row.key] || ''} 
                                    onChange={e => updateField('EN', row.key, e.target.value)} 
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. 页脚 Slogan */}
                <div className="space-y-6 mb-10">
                    <h4 className="font-bold text-gray-800 border-b pb-2">页脚标语 (Footer Slogan)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                        <div>
                            <div className="text-[10px] text-red-400 font-bold mb-1">中文 Slogan</div>
                            <textarea className="w-full border-2 border-red-100 p-3 rounded-xl font-bold text-gray-700 focus:border-red-300 outline-none h-24 resize-none" 
                                value={data.CN.footerSlogan || ''} 
                                onChange={e => updateField('CN', 'footerSlogan', e.target.value)} 
                            />
                        </div>
                        <div>
                            <div className="text-[10px] text-blue-400 font-bold mb-1">英文 Slogan</div>
                            <textarea className="w-full border-2 border-blue-100 p-3 rounded-xl font-bold text-gray-700 focus:border-blue-300 outline-none h-24 resize-none" 
                                value={data.EN.footerSlogan || ''} 
                                onChange={e => updateField('EN', 'footerSlogan', e.target.value)} 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button onClick={handleSave} className="bg-brand-blue text-white px-12 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all active:scale-95">
                        保存全部文案
                    </button>
                </div>
            </div>
        </div>
    );
};

// ... (其他 imports 保持不变)
// 👇 确保引入了 useAuth (如果没有请在顶部加上)
import { useAuth } from '../context/AuthContext';

// 11. 超级管理员用户管理 (新增)
export const UserManagement = ({ showToast }: any) => {
    const { isAdmin, allUsers, approveUser, unlockUser, deleteUser } = useAuth();
    
    if (!isAdmin) return <div className="p-10 text-center font-black text-red-400">权限不足：仅主账号可访问此页面</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-8 rounded-[3rem] border-2 border-gray-100 shadow-sm">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-brand-blue"><Shield /> 子账号权限管理</h3>
                
                <div className="overflow-hidden rounded-[2rem] border-2 border-gray-50 shadow-sm">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-900 text-white">
                                <th className="p-5 text-left font-black text-[10px] uppercase tracking-widest">账号 (邮箱)</th>
                                <th className="p-5 text-center font-black text-[10px] uppercase tracking-widest">状态</th>
                                <th className="p-5 text-center font-black text-[10px] uppercase tracking-widest">登录日志 (IP)</th>
                                <th className="p-5 text-center font-black text-[10px] uppercase tracking-widest">申请时间</th>
                                <th className="p-5 text-center font-black text-[10px] uppercase tracking-widest">操作</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {allUsers.filter(u => u.role !== 'super_admin').map(u => (
                                <tr key={u.id} className="hover:bg-blue-50/20 transition-colors">
                                    <td className="p-5">
                                        <div className="font-black text-blue-900 flex items-center gap-2"><User size={16}/> {u.email}</div>
                                        {u.failedAttempts > 0 && <div className="text-[10px] text-red-400 font-bold mt-1">错误尝试: {u.failedAttempts}/5</div>}
                                    </td>
                                    <td className="p-5 text-center">
                                        {u.status === 'active' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">正常</span>}
                                        {u.status === 'pending' && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-black animate-pulse">待审核</span>}
                                        {u.status === 'locked' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-black">已锁定</span>}
                                    </td>
                                    <td className="p-5">
                                        <div className="h-16 overflow-y-auto custom-scrollbar text-[10px] text-gray-500 bg-gray-50 p-2 rounded-xl border">
                                            {u.logs.length === 0 ? '暂无记录' : u.logs.map((log, i) => (
                                                <div key={i} className="flex justify-between border-b last:border-0 border-gray-100 py-1">
                                                    <span>{log.date.split(' ')[0]}</span>
                                                    <span className="font-mono text-blue-400">{log.ip}</span>
                                                    <span className={log.success ? 'text-green-500' : 'text-red-500'}>{log.success ? '成功' : '失败'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-5 text-center text-xs font-bold text-gray-400">{u.applyDate}</td>
                                    <td className="p-5 text-center space-x-2">
                                        {u.status === 'pending' && (
                                            <button onClick={() => { approveUser(u.id); showToast('已通过审核'); }} className="bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-100" title="通过审核"><CheckCircle size={18}/></button>
                                        )}
                                        {u.status === 'locked' && (
                                            <button onClick={() => { unlockUser(u.id); showToast('已解封账号'); }} className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100" title="解封账号"><Unlock size={18}/></button>
                                        )}
                                        <button onClick={() => { if(window.confirm('确定删除此账号？')) deleteUser(u.id); }} className="bg-red-50 text-red-400 p-2 rounded-lg hover:bg-red-100" title="删除"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                            {allUsers.filter(u => u.role !== 'super_admin').length === 0 && (
                                <tr><td colSpan={5} className="p-10 text-center text-gray-300 font-bold">暂无子账号申请</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};