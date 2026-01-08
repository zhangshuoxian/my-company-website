

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { TechSpec, CategoryItem, NewsItem, HistoryEvent, CertificateItem, DownloadItem, Branch, PatternSpec, SocialItem, CustomPageData } from '../types';
import { CODE_DEFINITIONS } from '../constants';
import { Trash2, Plus, Edit, X, ChevronRight, ChevronDown, Upload, Globe, Home as HomeIcon, Settings as SettingsIcon, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';

// --- TOAST NOTIFICATION SYSTEM ---
interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
}

// --- HELPER: FILE UPLOAD (BASE64) ---
const FileUploader = ({ onUpload, hint, onError }: { onUpload: (base64: string) => void, hint?: string, onError?: (msg: string) => void }) => {
    const fileInput = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Safety Check: LocalStorage usually has 5MB limit. 
            if (file.size > 500 * 1024) {
                if (onError) onError('File too large (Max 500KB). Please optimize image.');
                else alert('File too large (Max 500KB). Please optimize image.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    try {
                        onUpload(reader.result.toString());
                    } catch (err) {
                        if (onError) onError('Storage Quota Exceeded! Image too large.');
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="relative inline-flex items-center gap-2">
            <input type="file" ref={fileInput} className="hidden" accept="image/*,.pdf" onChange={handleFile} />
            <button type="button" onClick={() => fileInput.current?.click()} className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded" title="Upload File (Img/PDF)">
                <Upload size={16} />
            </button>
            {hint && <span className="text-[10px] text-gray-400">{hint}</span>}
        </div>
    );
};

// --- ADMIN LABELS DICTIONARY ---
const ADMIN_LABELS = {
    CN: {
        dashboard: '网站后台管理系统',
        editLang: '正在编辑语言',
        switchAdmin: '切换后台语言',
        backToSite: '返回网站',
        tabs: { settings: '全局设置', home: '首页', industry: '行业应用', product: '产品中心', patterns: '花纹管理', intro: '公司介绍', tech: '技术参数', news: '新闻动态', contact: '联系 & 反馈', custom: '自定义产品' },
        settings: {
            title: '全局设置',
            logo: '网站 Logo',
            rights: '底部版权文字',
        },
        contact: {
            title: '联系页面管理',
            mainInfo: '主公司信息',
            branches: '分公司管理',
            feedback: '客户留言',
            socials: '关注我们 (底部图片)',
            addBranch: '添加分公司'
        },
        patterns: {
            title: '花纹 & 面料管理',
            name: '名称',
            code: '代号',
            thick: '厚度',
            width: '宽度',
            feat: '特性',
            app: '应用',
            img: '图片',
            add: '添加花纹'
        },
        product: {
             catTitle: '产品分类',
             newRoot: '新建根分类',
             id: 'ID',
             title: '标题',
             img: '图片',
             desc: '描述',
             save: '保存',
             cancel: '取消'
        },
        custom: {
            intro: '介绍文本',
            tolerance: '公差文本',
            tables: '数据表格',
            tableTitle: '表格标题',
            tableImage: '表格配图',
            cols: '列名',
            rows: '行数据',
            action: '操作'
        },
        tech: {
            model: '型号',
            material: '材质',
            ply: '层数',
            color: '颜色',
            hex: '色值',
            pattern: '花纹',
            thick: '总厚度',
            weight: '重量',
            force: '1%受力',
            minPulley: '最小轮径',
            temp: '温度',
            coating: '涂层',
            conveying: '输送方式',
            features: '特性',
            // Code Definition Labels
            cdFabric: '织物类型',
            cdColorCode: '颜色代码',
            cdCoverAttr: '涂层属性',
            cdOtherCover: '涂层其他',
            cdOtherFabric: '织物其他'
        },
        common: { save: '保存', cancel: '取消', delete: '删除', edit: '编辑', add: '新增' }
    },
    EN: {
        dashboard: 'Site Admin Dashboard',
        editLang: 'Editing Content Language',
        switchAdmin: 'Switch Admin Lang',
        backToSite: 'Return to Website',
        tabs: { settings: 'Settings', home: 'Home Page', industry: 'Industries', product: 'Products', patterns: 'Patterns', intro: 'Company Intro', tech: 'Tech Specs', news: 'News', contact: 'Contact & Feedback', custom: 'Custom Pages' },
        settings: {
            title: 'Global Settings',
            logo: 'Website Logo',
            rights: 'Footer Copyright Text',
        },
        contact: {
            title: 'Contact Management',
            mainInfo: 'Main Company Info',
            branches: 'Branch Management',
            feedback: 'Customer Feedback',
            socials: 'Follow Us (Footer Images)',
            addBranch: 'Add Branch'
        },
        patterns: {
            title: 'Patterns & Fabrics Management',
            name: 'Name',
            code: 'Code',
            thick: 'Thickness',
            width: 'Width',
            feat: 'Features',
            app: 'Application',
            img: 'Image',
            add: 'Add Pattern'
        },
        product: {
             catTitle: 'Product Categories',
             newRoot: 'New Root Category',
             id: 'ID',
             title: 'Title',
             img: 'Image',
             desc: 'Description',
             save: 'Save',
             cancel: 'Cancel'
        },
        custom: {
            intro: 'Intro Text',
            tolerance: 'Tolerance Text',
            tables: 'Data Tables',
            tableTitle: 'Table Title',
            tableImage: 'Table Image',
            cols: 'Columns',
            rows: 'Row Data',
            action: 'Action'
        },
        tech: {
            model: 'Model',
            material: 'Material',
            ply: 'Ply',
            color: 'Color',
            hex: 'Hex Code',
            pattern: 'Pattern',
            thick: 'Thickness',
            weight: 'Weight',
            force: '1% Force',
            minPulley: 'Min Pulley',
            temp: 'Temp',
            coating: 'Coating',
            conveying: 'Conveying',
            features: 'Features',
            cdFabric: 'Fabric Type',
            cdColorCode: 'Color Code',
            cdCoverAttr: 'Cover Attr',
            cdOtherCover: 'Other Cover',
            cdOtherFabric: 'Other Fabric'
        },
        common: { save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', add: 'Add' }
    }
};

const SettingsEditor = ({ labels, showToast }: any) => {
    const { content, updateLogo, updateFooterRights } = useLanguage();
    const [logoUrl, setLogoUrl] = useState(content.logo);
    const [rightsText, setRightsText] = useState(content.footerRights);

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded border">
                <h3 className="font-bold text-lg mb-4">{labels.settings.logo}</h3>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-40 h-20 border bg-gray-50 flex items-center justify-center overflow-hidden">
                        <img src={logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain"/>
                    </div>
                    <div className="flex-grow space-y-2 w-full">
                        <div className="flex w-full">
                            <input className="border p-2 rounded flex-grow" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
                            <FileUploader onUpload={setLogoUrl} onError={msg => showToast(msg, 'error')} hint="Rec H: 80px" />
                        </div>
                        <button onClick={() => { updateLogo(logoUrl); showToast('Logo Saved!'); }} className="bg-blue-600 text-white px-4 py-2 rounded">{labels.common.save}</button>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded border">
                <h3 className="font-bold text-lg mb-4">{labels.settings.rights}</h3>
                <div className="flex space-x-2">
                    <input className="border p-2 rounded flex-grow" value={rightsText} onChange={e => setRightsText(e.target.value)} />
                    <button onClick={() => { updateFooterRights(rightsText); showToast('Rights Text Saved!'); }} className="bg-blue-600 text-white px-4 py-2 rounded">{labels.common.save}</button>
                </div>
            </div>
        </div>
    );
};

const HomeEditor = ({ labels, showToast }: any) => {
    const { content, updateHeroSlide, updateCompanyStat } = useLanguage();
    const [editingSlideIdx, setEditingSlideIdx] = useState<number | null>(null);
    const [editingStatIdx, setEditingStatIdx] = useState<number | null>(null);
    const [slideData, setSlideData] = useState({ title: '', subtitle: '', image: '' });
    const [statData, setStatData] = useState({ label: '', value: '', image: '' });

    const startEditSlide = (idx: number) => { setEditingSlideIdx(idx); setSlideData({ ...content.heroSlides[idx] }); };
    const saveSlide = () => { if (editingSlideIdx !== null) { updateHeroSlide(editingSlideIdx, slideData); showToast('Slide Saved!'); } };
    const startEditStat = (idx: number) => { setEditingStatIdx(idx); const stat = content.stats[idx]; setStatData({ label: stat.label, value: stat.value, image: stat.image || '' }); };
    const saveStat = () => { if (editingStatIdx !== null) { updateCompanyStat(editingStatIdx, statData); showToast('Stat Saved!'); } };

    return (
        <div className="space-y-10">
            <div>
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Hero Carousel</h3>
                <div className="space-y-4">
                    {content.heroSlides.map((slide, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded border flex flex-col md:flex-row gap-4 items-start">
                            <div className="w-32 h-20 bg-gray-200 shrink-0"><img src={slide.image} className="w-full h-full object-cover" /></div>
                            {editingSlideIdx === idx ? (
                                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    <div><label className="text-xs font-bold">Title</label><input className="w-full border p-1" value={slideData.title} onChange={e => setSlideData({...slideData, title: e.target.value})} /></div>
                                    <div><label className="text-xs font-bold">Subtitle</label><input className="w-full border p-1" value={slideData.subtitle} onChange={e => setSlideData({...slideData, subtitle: e.target.value})} /></div>
                                    <div className="col-span-2"><label className="text-xs font-bold">Image</label><div className="flex"><input className="w-full border p-1" value={slideData.image} onChange={e => setSlideData({...slideData, image: e.target.value})} /><FileUploader onUpload={b => setSlideData({...slideData, image: b})} onError={msg => showToast(msg, 'error')} hint="Rec: 1920x800px" /></div></div>
                                    <div className="col-span-2 flex space-x-2"><button onClick={saveSlide} className="bg-green-600 text-white px-2 py-1 rounded">{labels.common.save}</button><button onClick={() => setEditingSlideIdx(null)} className="bg-gray-400 text-white px-2 py-1 rounded">{labels.common.cancel}</button></div>
                                </div>
                            ) : (
                                <div className="flex-grow flex justify-between"><div><h4 className="font-bold">{slide.title}</h4><p className="text-sm">{slide.subtitle}</p></div><button onClick={() => startEditSlide(idx)} className="text-blue-600"><Edit size={18} /></button></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold mb-4 border-b pb-2">Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {content.stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-4 rounded border">
                             {editingStatIdx === idx ? (
                                 <div className="space-y-2">
                                     <div><label className="text-xs font-bold">Label</label><input className="w-full border p-1" value={statData.label} onChange={e => setStatData({...statData, label: e.target.value})} /></div>
                                     <div><label className="text-xs font-bold">Value</label><input className="w-full border p-1" value={statData.value} onChange={e => setStatData({...statData, value: e.target.value})} /></div>
                                     <div><label className="text-xs font-bold">Image (Background)</label><div className="flex"><input className="w-full border p-1" value={statData.image} onChange={e => setStatData({...statData, image: e.target.value})} /><FileUploader onUpload={b => setStatData({...statData, image: b})} onError={msg => showToast(msg, 'error')} hint="Rec: 400x300px" /></div></div>
                                     <button onClick={saveStat} className="bg-green-600 text-white px-2 py-1 rounded text-xs">{labels.common.save}</button><button onClick={() => setEditingStatIdx(null)} className="bg-gray-400 text-white px-2 py-1 rounded text-xs ml-2">{labels.common.cancel}</button>
                                 </div>
                             ) : (
                                 <div className="flex justify-between items-center"><div className="flex items-center gap-2">{stat.image && <img src={stat.image} className="w-10 h-10 object-cover rounded" alt="Stat" />}<div><div className="text-2xl font-bold">{stat.value}</div><div className="text-sm">{stat.label}</div></div></div><button onClick={() => startEditStat(idx)} className="text-blue-600"><Edit size={16} /></button></div>
                             )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const IndustryEditor = ({ labels, showToast }: any) => {
    const { content, updateIndustry, addIndustry, deleteIndustry } = useLanguage();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<{title: string, desc: string, image: string, models: string[], commonPatterns: string[]}>({ title: '', desc: '', image: '', models: [], commonPatterns: [] });
    const [isNew, setIsNew] = useState(false);
    
    // Helper States for sub-lists
    const [newModel, setNewModel] = useState('');
    const [newPattern, setNewPattern] = useState('');

    const startEdit = (ind: CategoryItem) => {
      setEditingId(ind.id);
      const detail = content.industryDetails[ind.id];
      setFormData({ 
          title: ind.title, 
          desc: detail?.description || '', 
          image: ind.image, 
          models: detail?.productModels || [], 
          commonPatterns: detail?.commonPatterns || [] 
      });
      setIsNew(false);
    };

    const startAdd = () => {
        setEditingId('new_ind');
        setFormData({ title: '', desc: '', image: '', models: [], commonPatterns: [] });
        setIsNew(true);
    };
    
    const handleSave = () => {
      if (isNew) {
          const newId = `ind_${Date.now()}`;
          const newIndItem: CategoryItem = {
              id: newId,
              title: formData.title,
              description: '',
              image: formData.image,
              type: 'industry'
          };
          const newDetail = {
              id: newId,
              description: formData.desc, // In simplified context, mapped to CN/EN inside context but here we send generic
              descriptionCN: formData.desc,
              descriptionEN: formData.desc,
              productModels: formData.models,
              commonPatterns: formData.commonPatterns
          };
          addIndustry(newIndItem, newDetail);
          showToast('Industry Added!');
          setIsNew(false);
          setEditingId(null);
      } else if (editingId) {
          updateIndustry(editingId, { title: formData.title, image: formData.image }, { description: formData.desc, productModels: formData.models, commonPatterns: formData.commonPatterns });
          showToast('Industry Saved!');
      }
    };

    const handleDelete = (id: string) => {
        if(window.confirm('Delete Industry?')) {
            deleteIndustry(id);
            if(editingId === id) setEditingId(null);
            showToast('Deleted!');
        }
    };

    // Sub-list handlers
    const addModel = () => { if(newModel.trim()){ setFormData({...formData, models: [...formData.models, newModel.trim()]}); setNewModel(''); }};
    const removeModel = (idx: number) => { const n = [...formData.models]; n.splice(idx, 1); setFormData({...formData, models: n}); };
    
    const addPattern = () => { if(newPattern.trim() && !formData.commonPatterns.includes(newPattern)){ setFormData({...formData, commonPatterns: [...formData.commonPatterns, newPattern.trim()]}); setNewPattern(''); }};
    const removePattern = (idx: number) => { const n = [...formData.commonPatterns]; n.splice(idx, 1); setFormData({...formData, commonPatterns: n}); };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-xl font-bold">{labels.tabs.industry}</h3>
            <button onClick={startAdd} className="bg-brand-green text-white px-3 py-1 rounded flex items-center text-sm"><Plus size={14} className="mr-1"/> Add Industry</button>
        </div>

        {editingId && (
            <div className="bg-blue-50 p-6 rounded border border-blue-200 mb-6 sticky top-4 z-20 shadow-lg">
                <h4 className="font-bold mb-4">{isNew ? 'New Industry' : 'Edit Industry'}</h4>
                <div className="space-y-4">
                    <div><label className="block text-xs font-bold">Title</label><input className="w-full border p-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold">Description</label><textarea className="w-full border p-2 h-24" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} /></div>
                    <div><label className="block text-xs font-bold">Image</label><div className="flex"><input className="w-full border p-2" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} /><FileUploader onUpload={b => setFormData({...formData, image: b})} onError={msg => showToast(msg, 'error')} hint="Rec: 600x600px" /></div></div>
                    
                    {/* Models Management */}
                    <div className="bg-white p-3 rounded border">
                        <label className="block text-xs font-bold mb-2">Matching Product Models</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.models.map((m, idx) => (
                                <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded flex items-center">{m} <button onClick={()=>removeModel(idx)} className="ml-1 text-red-500 hover:text-red-700"><X size={12}/></button></span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input className="border p-1 text-sm flex-grow" placeholder="Add Model ID (e.g. 20P21)" value={newModel} onChange={e => setNewModel(e.target.value)} onKeyDown={e => e.key === 'Enter' && addModel()} />
                            <button onClick={addModel} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">Add</button>
                        </div>
                    </div>

                    {/* Patterns Management */}
                    <div className="bg-white p-3 rounded border">
                        <label className="block text-xs font-bold mb-2">Common Patterns (Enter Code)</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.commonPatterns.map((p, idx) => (
                                <span key={idx} className="bg-green-50 text-xs px-2 py-1 rounded flex items-center border border-green-100 text-green-700 font-bold">{p} <button onClick={()=>removePattern(idx)} className="ml-1 text-red-500 hover:text-red-700"><X size={12}/></button></span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <select className="border p-1 text-sm flex-grow" value={newPattern} onChange={e => setNewPattern(e.target.value)}>
                                <option value="">Select Pattern...</option>
                                {content.patterns.map(p => <option key={p.code} value={p.code}>{p.code} - {p.name}</option>)}
                            </select>
                            <button onClick={addPattern} className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">Add</button>
                        </div>
                    </div>

                    <div className="flex space-x-2"><button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">{labels.common.save}</button><button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">{labels.common.cancel}</button></div>
                </div>
            </div>
        )}

        {content.industries.map(ind => (
          <div key={ind.id} className="bg-white p-6 rounded shadow border flex justify-between">
            <div className="flex space-x-4">
               <img src={ind.image} className="w-16 h-16 object-cover rounded" />
               <div><h4 className="font-bold">{ind.title}</h4><p className="text-sm text-gray-500 line-clamp-2">{content.industryDetails[ind.id]?.description}</p></div>
            </div>
            <div className="flex space-x-2">
                <button onClick={() => startEdit(ind)} className="text-blue-600"><Edit size={20}/></button>
                <button onClick={() => handleDelete(ind.id)} className="text-red-600"><Trash2 size={20}/></button>
            </div>
          </div>
        ))}
      </div>
    );
};

// --- Product Editor (RenderItem Extracted) ---
const ProductRenderItem = ({ item, level, expanded, toggleExpand, startAdd, startEdit, handleDelete, labels }: any) => {
    // This component is now stable and won't remount on parent state changes unrelated to props
    const { content } = useLanguage();
    const children = content.products.filter(p => p.parentId === item.id);
    const hasChildren = children.length > 0;
    return (
        <div className="mb-2">
            <div className={`flex justify-between items-center p-3 rounded border hover:bg-gray-50 ${level === 0 ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200 ml-8 border-l-4 border-l-brand-blue'}`}>
                <div className="flex items-center space-x-3">
                    {level === 0 && <button onClick={() => toggleExpand(item.id)}>{expanded[item.id] ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}</button>}
                    <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden shrink-0"><img src={item.image} alt="" className="w-full h-full object-cover"/></div>
                    <div><div className="font-bold text-gray-800">{item.title}</div><div className="text-xs text-gray-500">{labels.product.id}: {item.id}</div></div>
                </div>
                <div className="flex items-center space-x-2">
                    {level === 0 && <button onClick={() => startAdd(item.id)} className="text-green-600 p-1 text-xs font-bold flex items-center bg-green-50 rounded px-2"><Plus size={12}/> Sub</button>}
                    <button onClick={() => startEdit(item)} className="text-blue-600 p-2"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 p-2"><Trash2 size={16} /></button>
                </div>
            </div>
            {expanded[item.id] && hasChildren && <div className="mt-2">{children.map((c: any) => <ProductRenderItem key={c.id} item={c} level={level + 1} expanded={expanded} toggleExpand={toggleExpand} startAdd={startAdd} startEdit={startEdit} handleDelete={handleDelete} labels={labels} />)}</div>}
        </div>
    );
};

const ProductEditor = ({ labels, showToast }: any) => {
    const { content, addProduct, updateProduct, deleteProduct } = useLanguage();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CategoryItem>({} as CategoryItem);
    const [isNew, setIsNew] = useState(false);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => setExpanded(prev => ({...prev, [id]: !prev[id]}));
    const startEdit = (item: CategoryItem) => { setEditingId(item.id); setFormData({ ...item }); setIsNew(false); };
    const startAdd = (parentId?: string) => { setEditingId('new_temp'); setFormData({ id: `prod_${Date.now()}`, title: '', description: '', image: '', type: 'product', parentId: parentId }); setIsNew(true); if(parentId) setExpanded(prev => ({...prev, [parentId]: true})); };
    
    const handleSave = () => { 
        if (isNew) {
            addProduct(formData); 
            showToast('Product Added!');
            setIsNew(false);
            setEditingId(formData.id);
        } else if (editingId) {
            updateProduct(editingId, formData);
            showToast('Product Saved!');
        }
    };
    
    const handleDelete = (id: string) => { 
        if (window.confirm("Delete?")) {
            deleteProduct(id); 
            if (editingId === id) setEditingId(null);
            showToast('Deleted!');
        }
    };

    const rootItems = content.products.filter(p => !p.parentId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4"><h3 className="text-xl font-bold">{labels.product.catTitle}</h3><button onClick={() => startAdd()} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"><Plus size={16} className="mr-2"/> {labels.product.newRoot}</button></div>
            {editingId && (
                <div className="bg-blue-50 p-6 rounded border border-blue-200 mb-6 sticky top-4 z-20 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-bold">{labels.product.id}</label><input disabled={!isNew} className="w-full border p-2" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} /></div>
                        <div><label className="block text-sm font-bold">{labels.product.title}</label><input className="w-full border p-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                        <div className="col-span-2"><label className="block text-sm font-bold">{labels.product.img}</label><div className="flex"><input className="w-full border p-2" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} /><FileUploader onUpload={b => setFormData({...formData, image: b})} onError={msg => showToast(msg, 'error')} hint="Rec: 600x600px" /></div></div>
                        <div className="col-span-2"><label className="block text-sm font-bold">{labels.product.desc}</label><input className="w-full border p-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                    </div>
                    <div className="mt-4 flex space-x-2"><button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">{labels.product.save}</button><button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-4 py-2 rounded">{labels.product.cancel}</button></div>
                </div>
            )}
            <div className="space-y-1">
                {rootItems.map(r => <ProductRenderItem key={r.id} item={r} level={0} expanded={expanded} toggleExpand={toggleExpand} startAdd={startAdd} startEdit={startEdit} handleDelete={handleDelete} labels={labels} />)}
            </div>
        </div>
    );
};

// --- TechSpec Editor (Updated) ---
const TechSpecEditor = ({ labels, showToast, adminLanguage }: any) => {
    const { content, addTechSpec, updateTechSpec, deleteTechSpec, addTechCategory } = useLanguage();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<TechSpec>({} as TechSpec);
    const [isNew, setIsNew] = useState(false);
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20); 
    const [newCategoryName, setNewCategoryName] = useState('');

    const tl = labels.tech;

    const startEdit = (item: TechSpec) => { 
        setEditingId(item.id); 
        setFormData({ ...item, ruleData: item.ruleData || {} }); 
        setIsNew(false); 
    };
    const startAdd = () => { 
        setEditingId('new'); 
        setFormData({ 
            id: Date.now().toString(), 
            model: '', materialType: 'PVC', ply: '', color: '', colorHex: '#000000', 
            pattern: '', totalThickness: '', coatingThickness: '', weight: '', 
            force1pct: '', minPulley: '', workingTemp: '',
            conveying: { plate: false, roller: false, trough: false },
            features: {},
            ruleData: {} 
        }); 
        setIsNew(true); 
    };
    
    const handleSave = () => { 
        const exists = content.techSpecs.some(i => i.model === formData.model && i.id !== editingId);
        if (exists) { showToast(adminLanguage === 'CN' ? '产品型号已存在' : 'Product Model already exists!', 'error'); return; }
        if(isNew) { addTechSpec(formData); setIsNew(false); showToast('Spec Added!'); }
        else if(editingId) { updateTechSpec(editingId, formData); showToast('Spec Saved!'); }
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        addTechCategory(newCategoryName.trim());
        setNewCategoryName('');
        showToast('Category Added & Default Model Created!');
    };
    
    const filteredSpecs = content.techSpecs.filter(s => s.model.toLowerCase().includes(filter.toLowerCase()));
    
    const totalPages = Math.ceil(filteredSpecs.length / itemsPerPage);
    const paginatedSpecs = filteredSpecs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const updateRuleData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, ruleData: { ...prev.ruleData, [field]: value } }));
    };
    const renderCodeLabel = (item: { cn: string, en: string }) => adminLanguage === 'CN' ? item.cn : item.en;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-xl font-bold">Technical Specifications</h3>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                        <input className="border p-1 rounded text-sm" placeholder="New Category Name" value={newCategoryName} onChange={e=>setNewCategoryName(e.target.value)} />
                        <button onClick={handleAddCategory} className="bg-blue-600 text-white px-2 py-1 rounded text-sm whitespace-nowrap">Add Cat</button>
                    </div>
                    <button onClick={startAdd} className="bg-brand-green text-white px-4 py-1 rounded flex items-center text-sm"><Plus size={16} className="mr-1"/> {labels.common.add}</button>
                </div>
            </div>
            
            <div className="flex justify-between items-center gap-4">
                <input className="border p-2 rounded w-full md:w-1/3" placeholder="Filter by Model..." value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }} />
                <select className="border p-2 rounded" value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))}>
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                </select>
            </div>

            {editingId && (
                <div className="bg-white p-6 rounded shadow border sticky top-4 z-20 max-h-[90vh] overflow-y-auto">
                    <h4 className="font-bold mb-4 border-b pb-2">{isNew ? 'New Spec' : 'Edit Spec'}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="col-span-2"><label className="block text-xs font-bold">{tl.model} <span className="text-red-500">*</span></label><input className="w-full border p-1 bg-yellow-50" value={formData.model} onChange={e=>setFormData({...formData, model:e.target.value})}/></div>
                        
                        <div>
                            <label className="block text-xs font-bold">{tl.material} <span className="text-red-500">*</span></label>
                            <select className="w-full border p-1" value={formData.materialType} onChange={e=>setFormData({...formData, materialType:e.target.value})}>
                                {content.techCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div><label className="block text-xs font-bold">{tl.thick} <span className="text-red-500">*</span></label><input className="w-full border p-1" value={formData.totalThickness} onChange={e=>setFormData({...formData, totalThickness:e.target.value})}/></div>
                        <div><label className="block text-xs font-bold">{tl.ply}</label><input className="w-full border p-1" value={formData.ply} onChange={e=>setFormData({...formData, ply:e.target.value})}/></div>
                        <div><label className="block text-xs font-bold">{tl.color}</label><input className="w-full border p-1" value={formData.color} onChange={e=>setFormData({...formData, color:e.target.value})}/></div>
                        <div><label className="block text-xs font-bold">{tl.hex}</label><input type="color" className="w-full border p-1 h-8" value={formData.colorHex} onChange={e=>setFormData({...formData, colorHex:e.target.value})}/></div>
                        <div><label className="block text-xs font-bold">{tl.pattern}</label><input className="w-full border p-1" value={formData.pattern} onChange={e=>setFormData({...formData, pattern:e.target.value})}/></div>
                        <div><label className="block text-xs font-bold">{tl.weight}</label><input className="w-full border p-1" value={formData.weight} onChange={e=>setFormData({...formData, weight:e.target.value})}/></div>
                        <div><label className="block text-xs font-bold">{tl.force}</label><input className="w-full border p-1" value={formData.force1pct} onChange={e=>setFormData({...formData, force1pct:e.target.value})}/></div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded border mb-4">
                        <h5 className="font-bold text-sm mb-3 text-brand-blue">Rules Filter Data</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div><label className="block text-xs font-bold text-gray-600">Material Code</label><select className="w-full border p-1 text-sm" value={formData.ruleData?.coverMaterial || ''} onChange={e => updateRuleData('coverMaterial', e.target.value)}><option value="">Select...</option>{CODE_DEFINITIONS.coverMaterial.map(m => <option key={m.code} value={m.code}>{m.code} ({renderCodeLabel(m)})</option>)}</select></div>
                            <div><label className="block text-xs font-bold text-gray-600">{tl.cdFabric}</label><select className="w-full border p-1 text-sm" value={formData.ruleData?.fabricType || ''} onChange={e => updateRuleData('fabricType', e.target.value)}><option value="">Select...</option>{CODE_DEFINITIONS.fabricType.map(f => <option key={f.code} value={f.code}>{f.code} ({renderCodeLabel(f)})</option>)}</select></div>
                            <div><label className="block text-xs font-bold text-gray-600">{tl.cdColorCode}</label><select className="w-full border p-1 text-sm" value={formData.ruleData?.colorCode || ''} onChange={e => updateRuleData('colorCode', e.target.value)}><option value="">Select...</option>{CODE_DEFINITIONS.color.map(c => <option key={c.code} value={c.code}>{c.code} ({renderCodeLabel(c)})</option>)}</select></div>
                            <div><label className="block text-xs font-bold text-gray-600">{tl.cdCoverAttr}</label><select className="w-full border p-1 text-sm" value={formData.ruleData?.coverAttr || ''} onChange={e => updateRuleData('coverAttr', e.target.value)}><option value="">Select...</option>{CODE_DEFINITIONS.coverAttr.map(c => <option key={c.code} value={c.code}>{c.code} ({renderCodeLabel(c)})</option>)}</select></div>
                        </div>
                    </div>
                    <div className="mt-4 border-t pt-2 flex space-x-2"><button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">{labels.common.save}</button><button onClick={()=>setEditingId(null)} className="bg-gray-400 text-white px-4 py-2 rounded">{labels.common.cancel}</button></div>
                </div>
            )}
            <div className="overflow-x-auto"><table className="min-w-full text-xs"><thead><tr className="bg-gray-100 border-b"><th className="p-2 text-left">{tl.model}</th><th className="p-2">{tl.material}</th><th className="p-2">{tl.color}</th><th className="p-2">{tl.thick}</th><th className="p-2">{labels.custom.action}</th></tr></thead><tbody>{paginatedSpecs.map(s => (<tr key={s.id} className="border-b hover:bg-gray-50"><td className="p-2 font-bold">{s.model}</td><td className="p-2">{s.materialType}</td><td className="p-2 flex items-center"><div className="w-3 h-3 rounded-full mr-1" style={{backgroundColor: s.colorHex}}></div>{s.color}</td><td className="p-2">{s.totalThickness}</td><td className="p-2 text-center space-x-2"><button onClick={()=>startEdit(s)} className="text-blue-600"><Edit size={14}/></button><button onClick={()=>{if(window.confirm('Delete?')) deleteTechSpec(s.id)}} className="text-red-600"><Trash2 size={14}/></button></td></tr>))}</tbody></table></div>
            {totalPages > 1 && <div className="flex justify-center items-center space-x-2 mt-4"><button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={16}/></button><span className="text-sm">Page {page} of {totalPages}</span><button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"><ChevronRight size={16}/></button></div>}
        </div>
    );
};

// --- Pattern Editor (Updated) ---
const PatternEditor = ({ labels, showToast }: any) => {
    const { content, addPattern, updatePattern, deletePattern } = useLanguage();
    const [editingCode, setEditingCode] = useState<string | null>(null);
    const [formData, setFormData] = useState<PatternSpec>({} as PatternSpec);
    const [isNew, setIsNew] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const pageSize = 15; 
    const pl = labels.patterns;

    const startEdit = (p: PatternSpec) => { setEditingCode(p.code); setFormData({ ...p }); setIsNew(false); };
    const startAdd = () => { setEditingCode('new_pattern'); setFormData({ name: '', code: '', thickness: '', width: '', features: '', application: '', image: '' }); setIsNew(true); };
    const handleSave = () => { 
        if(isNew) { addPattern(formData); setIsNew(false); showToast('Pattern Added!'); }
        else if(editingCode) { updatePattern(editingCode, formData); showToast('Pattern Saved!'); }
    };
    const handleDelete = (code: string) => { if(window.confirm('Delete Pattern?')) { deletePattern(code); if(editingCode === code) setEditingCode(null); showToast('Deleted!'); } };

    const filteredPatterns = content.patterns.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.ceil(filteredPatterns.length / pageSize);
    const paginatedPatterns = filteredPatterns.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-4">
                <h3 className="text-xl font-bold">{pl.title}</h3>
                <div className="flex gap-2 w-full md:w-auto">
                    <input className="border p-2 rounded flex-grow" placeholder="Search patterns..." value={search} onChange={e => {setSearch(e.target.value); setPage(1);}} />
                    <button onClick={startAdd} className="bg-brand-green text-white px-4 py-2 rounded flex items-center whitespace-nowrap"><Plus size={16} className="mr-2"/> {pl.add}</button>
                </div>
            </div>

            {editingCode && (
                <div className="bg-blue-50 p-6 rounded border border-blue-200 mb-6 sticky top-4 z-20 shadow-lg">
                    <h4 className="font-bold mb-4 text-brand-blue">{isNew ? labels.common.add : labels.common.edit}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div><label className="block text-xs font-bold">{pl.name}</label><input className="w-full border p-2 rounded" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})}/></div>
                        <div><label className="block text-xs font-bold">{pl.code}</label><input className="w-full border p-2 rounded" value={formData.code} onChange={e=>setFormData({...formData, code:e.target.value})}/></div>
                        <div><label className="block text-xs font-bold">{pl.thick}</label><input className="w-full border p-2 rounded" value={formData.thickness} onChange={e=>setFormData({...formData, thickness:e.target.value})}/></div>
                        <div><label className="block text-xs font-bold">{pl.width}</label><input className="w-full border p-2 rounded" value={formData.width} onChange={e=>setFormData({...formData, width:e.target.value})}/></div>
                        <div className="col-span-2"><label className="block text-xs font-bold">{pl.feat}</label><input className="w-full border p-2 rounded" value={formData.features} onChange={e=>setFormData({...formData, features:e.target.value})}/></div>
                        <div className="col-span-2"><label className="block text-xs font-bold">{pl.app}</label><input className="w-full border p-2 rounded" value={formData.application} onChange={e=>setFormData({...formData, application:e.target.value})}/></div>
                        <div className="col-span-4"><label className="block text-xs font-bold">{pl.img}</label><div className="flex"><input className="w-full border p-2 rounded" value={formData.image || ''} onChange={e=>setFormData({...formData, image:e.target.value})}/><FileUploader onUpload={b=>setFormData({...formData, image:b})} onError={msg => showToast(msg, 'error')} hint="Rec: 400x400px"/></div></div>
                    </div>
                    <div className="mt-4 flex space-x-2"><button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">{labels.common.save}</button><button onClick={()=>setEditingCode(null)} className="bg-gray-400 text-white px-4 py-2 rounded">{labels.common.cancel}</button></div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedPatterns.map(p => (
                    <div key={p.code} className="border rounded p-4 flex gap-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-20 h-20 bg-gray-100 rounded shrink-0 overflow-hidden border">{p.image ? <img src={p.image} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>}</div>
                        <div className="flex-grow"><div className="font-bold text-gray-800">{p.name} <span className="text-gray-500 font-normal">({p.code})</span></div><div className="text-xs text-gray-500 mt-1">{p.features}</div><div className="text-xs text-gray-400 mt-1">{p.thickness} | {p.width}</div><div className="mt-2 flex space-x-2"><button onClick={()=>startEdit(p)} className="text-blue-600 text-xs flex items-center"><Edit size={12} className="mr-1"/>{labels.common.edit}</button><button onClick={()=>handleDelete(p.code)} className="text-red-600 text-xs flex items-center"><Trash2 size={12} className="mr-1"/>{labels.common.delete}</button></div></div>
                    </div>
                ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                    <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={20}/></button>
                    <span className="text-sm font-bold">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"><ChevronRight size={20}/></button>
                </div>
            )}
        </div>
    );
};

const CompanyIntroEditor = ({ labels, showToast }: any) => {
    const { content, updateIntro, updateAboutPage, addHistory, updateHistory, deleteHistory, addCertificate, updateCertificate, deleteCertificate, addDownload, updateDownload, deleteDownload } = useLanguage();
    const [subTab, setSubTab] = useState<'menu' | 'content' | 'history' | 'ip' | 'downloads'>('menu');

    // Menu Items
    const MenuEditor = () => {
        const [editingId, setEditingId] = useState<string | null>(null);
        const [formData, setFormData] = useState<{title: string, desc: string, image: string}>({ title: '', desc: '', image: '' });
        const startEdit = (item: CategoryItem) => { setEditingId(item.id); setFormData({ title: item.title, desc: item.description || '', image: item.image }); };
        const handleSave = () => { if (editingId) { updateIntro(editingId, { title: formData.title, description: formData.desc, image: formData.image }); showToast('Saved!'); } };
        return (<div className="space-y-6"><h4 className="font-bold text-lg mb-4">Edit Menu Items</h4>{content.intros.map(item => (<div key={item.id} className="bg-white p-4 rounded shadow border">{editingId === item.id ? (<div className="space-y-4"><div><label className="block text-xs font-bold">Title</label><input className="w-full border p-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div><div><label className="block text-xs font-bold">Description</label><textarea className="w-full border p-2 h-20" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} /></div><div><label className="block text-xs font-bold">Image</label><div className="flex"><input className="w-full border p-2" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} /><FileUploader onUpload={b => setFormData({...formData, image: b})} onError={msg => showToast(msg, 'error')} hint="Rec: 600x600px" /></div></div><div className="flex space-x-2"><button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">{labels.common.save}</button><button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">{labels.common.cancel}</button></div></div>) : (<div className="flex justify-between items-center"><div className="flex space-x-4 items-center"><img src={item.image} className="w-12 h-12 object-cover rounded" /><div><h4 className="font-bold">{item.title}</h4><p className="text-xs text-gray-500">ID: {item.id}</p></div></div><button onClick={() => startEdit(item)} className="text-blue-600"><Edit size={18}/></button></div>)}</div>))}</div>);
    };

    // Page Content
    const PageContentEditor = () => {
        const [selectedPageId, setSelectedPageId] = useState('profile');
        const pageData = content.about.pages[selectedPageId] || { id: selectedPageId, content: '', images: [] };
        const [editData, setEditData] = useState(pageData);
        useEffect(() => setEditData(content.about.pages[selectedPageId] || { id: selectedPageId, content: '', images: [] }), [selectedPageId, content.about.pages]); // Sync on tab switch
        const handleSave = () => { updateAboutPage(selectedPageId, editData); showToast('Saved!'); };
        return (<div className="space-y-4"><div className="flex space-x-2 border-b pb-2 mb-4">{['profile','culture','strategy'].map(id => (<button key={id} onClick={() => setSelectedPageId(id)} className={`px-3 py-1 rounded ${selectedPageId===id?'bg-blue-600 text-white':'bg-gray-200'}`}>{id.toUpperCase()}</button>))}</div><div><label className="block font-bold mb-1">Content</label><textarea className="w-full border p-2 h-64" value={editData.content} onChange={e => setEditData({...editData, content: e.target.value})} /></div><div><label className="block font-bold mb-1">Images</label><div className="flex flex-wrap gap-2">{editData.images.map((img, idx) => (<div key={idx} className="relative w-24 h-24 group"><img src={img} className="w-full h-full object-cover" /><button onClick={() => setEditData({...editData, images: editData.images.filter((_, i) => i !== idx)})} className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl"><X size={12}/></button></div>))}<div className="w-24 h-24 bg-gray-100 flex items-center justify-center border-2 border-dashed"><FileUploader onUpload={(b64) => setEditData({...editData, images: [...editData.images, b64]})} onError={msg => showToast(msg, 'error')} hint="Rec: 800x600px" /></div></div></div><button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">{labels.common.save}</button></div>);
    };

    // History
    const HistoryEditor = () => {
        const [editingId, setEditingId] = useState<string | null>(null);
        const [formData, setFormData] = useState<HistoryEvent>({} as HistoryEvent);
        const [isNew, setIsNew] = useState(false);
        const startEdit = (item: HistoryEvent) => { setEditingId(item.id); setFormData({ ...item }); setIsNew(false); };
        const startAdd = () => { setEditingId('new'); setFormData({ id: Date.now().toString(), year: '', title: '', description: '', image: '' }); setIsNew(true); };
        const handleSave = () => { if(isNew) { addHistory(formData); setIsNew(false); showToast('Added!'); } else if(editingId) { updateHistory(formData); showToast('Saved!'); } };
        return (<div><div className="flex justify-between items-center mb-4"><h4 className="font-bold">History Timeline</h4><button onClick={startAdd} className="bg-green-600 text-white px-3 py-1 rounded text-sm">{labels.common.add}</button></div>{editingId && (<div className="bg-gray-50 p-4 mb-4 border rounded"><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold">Year</label><input className="w-full border p-1" value={formData.year} onChange={e=>setFormData({...formData, year:e.target.value})}/></div><div><label className="text-xs font-bold">Title</label><input className="w-full border p-1" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})}/></div><div className="col-span-2"><label className="text-xs font-bold">Desc</label><input className="w-full border p-1" value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})}/></div><div className="col-span-2"><label className="text-xs font-bold">Image</label><div className="flex"><input className="w-full border p-1" value={formData.image} onChange={e=>setFormData({...formData, image:e.target.value})}/><FileUploader onUpload={b=>setFormData({...formData, image:b})} onError={msg => showToast(msg, 'error')} hint="Rec: 600x400px"/></div></div></div><div className="mt-2 flex space-x-2"><button onClick={handleSave} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">{labels.common.save}</button><button onClick={()=>setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded text-sm">{labels.common.cancel}</button></div></div>)}<div className="space-y-2">{content.about.history.map(h => (<div key={h.id} className="flex justify-between border p-2 bg-white rounded"><span><span className="font-bold text-brand-blue">{h.year}</span> - {h.title}</span><div className="space-x-2"><button onClick={()=>startEdit(h)} className="text-blue-600"><Edit size={16}/></button><button onClick={()=>deleteHistory(h.id)} className="text-red-600"><Trash2 size={16}/></button></div></div>))}</div></div>);
    };

    // IP
    const IPEditor = () => {
        const [editingId, setEditingId] = useState<string | null>(null);
        const [formData, setFormData] = useState<CertificateItem>({} as CertificateItem);
        const [isNew, setIsNew] = useState(false);
        const startEdit = (item: CertificateItem) => { setEditingId(item.id); setFormData({ ...item }); setIsNew(false); };
        const startAdd = () => { setEditingId('new'); setFormData({ id: Date.now().toString(), title: '', category: 'Certificate', image: '' }); setIsNew(true); };
        const handleSave = () => { if(isNew) { addCertificate(formData); setIsNew(false); showToast('Added!'); } else if(editingId) { updateCertificate(formData); showToast('Saved!'); } };
        return (<div><div className="flex justify-between items-center mb-4"><h4 className="font-bold">Certificates & Patents</h4><button onClick={startAdd} className="bg-green-600 text-white px-3 py-1 rounded text-sm">{labels.common.add}</button></div>{editingId && (<div className="bg-gray-50 p-4 mb-4 border rounded sticky top-4 z-10 shadow-lg"><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold">Title</label><input className="w-full border p-1" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})}/></div><div><label className="text-xs font-bold">Category</label><select className="w-full border p-1" value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value})}><option>Certificate</option><option>Patent</option></select></div><div className="col-span-2"><label className="text-xs font-bold">Image</label><div className="flex"><input className="w-full border p-1" value={formData.image} onChange={e=>setFormData({...formData, image:e.target.value})}/><FileUploader onUpload={b=>setFormData({...formData, image:b})} onError={msg => showToast(msg, 'error')} hint="Rec: 600x800px"/></div></div></div><div className="mt-2 flex space-x-2"><button onClick={handleSave} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">{labels.common.save}</button><button onClick={()=>setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded text-sm">{labels.common.cancel}</button></div></div>)}<div className="grid grid-cols-2 md:grid-cols-4 gap-4">{content.about.certificates.map(c => (<div key={c.id} className="border p-2 rounded bg-white relative group"><div className="aspect-[3/4] bg-gray-100 mb-2 overflow-hidden"><img src={c.image} className="w-full h-full object-contain"/></div><div className="text-xs font-bold truncate">{c.title}</div><div className="text-xs text-gray-500">{c.category}</div><div className="absolute top-2 right-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>startEdit(c)} className="bg-blue-100 p-1 rounded text-blue-600"><Edit size={12}/></button><button onClick={()=>deleteCertificate(c.id)} className="bg-red-100 p-1 rounded text-red-600"><Trash2 size={12}/></button></div></div>))}</div></div>);
    };

    // Downloads
    const DownloadsEditor = () => {
        const [editingId, setEditingId] = useState<string | null>(null);
        const [formData, setFormData] = useState<DownloadItem>({} as DownloadItem);
        const [isNew, setIsNew] = useState(false);
        const startEdit = (item: DownloadItem) => { setEditingId(item.id); setFormData({ ...item }); setIsNew(false); };
        const startAdd = () => { setEditingId('new'); setFormData({ id: Date.now().toString(), title: '', fileName: '', fileUrl: '', category: 'Catalog' }); setIsNew(true); };
        const handleSave = () => { if(isNew) { addDownload(formData); setIsNew(false); showToast('Added!'); } else if(editingId) { updateDownload(formData); showToast('Saved!'); } };
        return (<div><div className="flex justify-between items-center mb-4"><h4 className="font-bold">Downloads</h4><button onClick={startAdd} className="bg-green-600 text-white px-3 py-1 rounded text-sm">{labels.common.add}</button></div>{editingId && (<div className="bg-gray-50 p-4 mb-4 border rounded sticky top-4 z-10 shadow-lg"><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold">Title</label><input className="w-full border p-1" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})}/></div><div><label className="text-xs font-bold">File Name</label><input className="w-full border p-1" value={formData.fileName} onChange={e=>setFormData({...formData, fileName:e.target.value})}/></div><div className="col-span-2"><label className="text-xs font-bold">File URL / Base64</label><div className="flex"><input className="w-full border p-1" value={formData.fileUrl} onChange={e=>setFormData({...formData, fileUrl:e.target.value})}/><FileUploader onUpload={b=>setFormData({...formData, fileUrl:b})} onError={msg => showToast(msg, 'error')} hint="PDF/Doc/Img" /></div></div></div><div className="mt-2 flex space-x-2"><button onClick={handleSave} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">{labels.common.save}</button><button onClick={()=>setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded text-sm">{labels.common.cancel}</button></div></div>)}<div className="space-y-2">{content.about.downloads.map(d => (<div key={d.id} className="flex justify-between items-center border p-2 bg-white rounded hover:bg-gray-50"><div><div className="font-bold text-sm">{d.title}</div><div className="text-xs text-gray-500">{d.fileName}</div></div><div className="space-x-2"><button onClick={()=>startEdit(d)} className="text-blue-600"><Edit size={16}/></button><button onClick={()=>deleteDownload(d.id)} className="text-red-600"><Trash2 size={16}/></button></div></div>))}</div></div>);
    };

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 border-b pb-2 mb-4 overflow-x-auto">
                <button onClick={() => setSubTab('menu')} className={`px-4 py-2 font-bold uppercase ${subTab==='menu'?'text-brand-blue border-b-2 border-brand-blue':'text-gray-500'}`}>Menu Items</button>
                <button onClick={() => setSubTab('content')} className={`px-4 py-2 font-bold uppercase ${subTab==='content'?'text-brand-blue border-b-2 border-brand-blue':'text-gray-500'}`}>Page Content</button>
                <button onClick={() => setSubTab('history')} className={`px-4 py-2 font-bold uppercase ${subTab==='history'?'text-brand-blue border-b-2 border-brand-blue':'text-gray-500'}`}>History</button>
                <button onClick={() => setSubTab('ip')} className={`px-4 py-2 font-bold uppercase ${subTab==='ip'?'text-brand-blue border-b-2 border-brand-blue':'text-gray-500'}`}>IP/Certs</button>
                <button onClick={() => setSubTab('downloads')} className={`px-4 py-2 font-bold uppercase ${subTab==='downloads'?'text-brand-blue border-b-2 border-brand-blue':'text-gray-500'}`}>Downloads</button>
            </div>
            {subTab === 'menu' && <MenuEditor />}
            {subTab === 'content' && <PageContentEditor />}
            {subTab === 'history' && <HistoryEditor />}
            {subTab === 'ip' && <IPEditor />}
            {subTab === 'downloads' && <DownloadsEditor />}
        </div>
    );
};

const CustomPageEditor = ({ labels, showToast }: any) => {
    const { content, updateCustomPage } = useLanguage();
    const [pageId, setPageId] = useState('pu-timing-belts');
    const data = content.customPages[pageId];
    // Sync state when pageId changes
    const [editData, setEditData] = useState<CustomPageData>(data);
    useEffect(() => { setEditData(content.customPages[pageId] || { id: pageId, introText: '', tables: [] }); }, [pageId, content.customPages]);

    const cl = labels.custom;
    const handleSave = () => { updateCustomPage(pageId, editData); showToast('Saved!'); };
    const updateTableRow = (tIdx: number, rIdx: number, cIdx: number, val: string) => { const nt = [...editData.tables]; nt[tIdx].rows[rIdx][cIdx] = val; setEditData({ ...editData, tables: nt }); };
    const addTableRow = (tIdx: number) => { const nt = [...editData.tables]; nt[tIdx].rows.push(new Array(nt[tIdx].cols.length).fill('')); setEditData({ ...editData, tables: nt }); };
    const removeTableRow = (tIdx: number, rIdx: number) => { const nt = [...editData.tables]; nt[tIdx].rows.splice(rIdx, 1); setEditData({ ...editData, tables: nt }); };

    if(!data) return <div>Invalid</div>;

    return (
        <div className="space-y-6">
            <div className="flex gap-4 mb-4"><button className={`px-4 py-2 border rounded ${pageId==='pu-timing-belts'?'bg-blue-50 border-blue-500':''}`} onClick={()=>setPageId('pu-timing-belts')}>PU Timing</button><button className={`px-4 py-2 border rounded ${pageId==='round-v-belts'?'bg-blue-50 border-blue-500':''}`} onClick={()=>setPageId('round-v-belts')}>Round Belts</button></div>
            <div><label className="block font-bold mb-1">{cl.intro}</label><textarea className="w-full border p-2 h-32" value={editData.introText} onChange={e => setEditData({...editData, introText: e.target.value})} /></div>
            {editData.toleranceText !== undefined && (<div><label className="block font-bold mb-1">{cl.tolerance}</label><textarea className="w-full border p-2 h-24" value={editData.toleranceText} onChange={e => setEditData({...editData, toleranceText: e.target.value})} /></div>)}
            <div><h4 className="font-bold text-lg mb-2">{cl.tables}</h4>{editData.tables.map((table, tIdx) => (<div key={tIdx} className="bg-gray-50 p-4 rounded border mb-4"><div className="flex gap-4 mb-2"><div className="w-1/2"><label className="text-xs font-bold">{cl.tableTitle}</label><input className="w-full border p-1" value={table.title} onChange={e => { const nt = [...editData.tables]; nt[tIdx].title = e.target.value; setEditData({...editData, tables: nt}); }} /></div><div className="w-1/2"><label className="text-xs font-bold">{cl.tableImage}</label><div className="flex"><input className="w-full border p-1" value={table.image} onChange={e => { const nt = [...editData.tables]; nt[tIdx].image = e.target.value; setEditData({...editData, tables: nt}); }} /><FileUploader onUpload={(b) => { const nt = [...editData.tables]; nt[tIdx].image = b; setEditData({...editData, tables: nt}); }} onError={msg => showToast(msg, 'error')} hint="Rec: 300x300px"/></div></div></div><div className="overflow-x-auto"><table className="w-full text-sm border-collapse border border-gray-300"><thead><tr>{table.cols.map((col, cIdx) => <th key={cIdx} className="border p-1 bg-gray-200">{col}</th>)}<th className="border p-1 bg-gray-200 w-10">{cl.action}</th></tr></thead><tbody>{table.rows.map((row, rIdx) => (<tr key={rIdx}>{row.map((cell, cIdx) => (<td key={cIdx} className="border p-0"><input className="w-full p-1 outline-none" value={cell} onChange={e => updateTableRow(tIdx, rIdx, cIdx, e.target.value)} /></td>))}<td className="border p-1 text-center"><button onClick={() => removeTableRow(tIdx, rIdx)} className="text-red-500"><X size={14}/></button></td></tr>))}</tbody></table><button onClick={() => addTableRow(tIdx)} className="mt-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">+ Row</button></div></div>))}</div>
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">{labels.common.save}</button>
        </div>
    );
};

const NewsEditor = ({ labels, showToast }: any) => {
    const { content, addNews, updateNews, deleteNews } = useLanguage();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<NewsItem>({} as NewsItem);
    const [isNew, setIsNew] = useState(false);
    const startEdit = (item: NewsItem) => { setEditingId(item.id); setFormData({ ...item }); setIsNew(false); };
    const startAdd = () => { setEditingId('new'); setFormData({ id: Date.now().toString(), title: 'New Article', date: '2025-01-01', summary: '', content: '', image: '' }); setIsNew(true); };
    const handleSave = () => { if(isNew) { addNews(formData); setIsNew(false); showToast('News Added!'); } else if(editingId) { updateNews(editingId, formData); showToast('News Saved!'); } };
    return (<div className="space-y-6"><div className="flex justify-between items-center border-b pb-2"><h3 className="text-xl font-bold">{labels.tabs.news}</h3><button className="bg-green-600 text-white px-3 py-1 rounded text-sm" onClick={() => addNews({id: Date.now().toString(), title: 'New Article', date: '2025-01-01', summary: '', content: '', image: ''})}>+ Add News</button></div><div className="space-y-4">{content.news.map(n => (<div key={n.id} className="border p-4 rounded flex gap-4"><div className="w-32 h-24 shrink-0 bg-gray-100 relative">{n.image && <img src={n.image} className="w-full h-full object-cover"/>}<div className="absolute top-0 right-0"><FileUploader onUpload={url => updateNews(n.id, {...n, image: url})} onError={msg => showToast(msg, 'error')}/></div></div><div className="flex-1 space-y-2"><input className="font-bold w-full border p-1" value={n.title} onChange={e => updateNews(n.id, {...n, title: e.target.value})}/><textarea className="w-full border p-1 text-sm h-16" value={n.summary} onChange={e => updateNews(n.id, {...n, summary: e.target.value})}/></div><button onClick={()=>deleteNews(n.id)} className="text-red-500"><Trash2/></button></div>))}</div></div>);
};

const ContactEditor = ({ labels, showToast }: any) => {
    const { content, updateMainContact, addBranch, updateBranch, deleteBranch, deleteFeedback, updateSocial, addSocial, deleteSocial } = useLanguage();
    const [subTab, setSubTab] = useState<'main' | 'branches' | 'socials' | 'feedback'>('main');

    const MainInfoEditor = () => {
        const [data, setData] = useState(content.contact);
        const handleSave = () => { updateMainContact(data); showToast(labels.common.save + '!'); };
        return (<div className="space-y-4 max-w-2xl"><div className="grid grid-cols-2 gap-4"><div className="col-span-2"><label className="block text-xs font-bold">Company Name</label><input className="w-full border p-2" value={data.companyName} onChange={e => setData({...data, companyName: e.target.value})} /></div><div><label className="block text-xs font-bold">Office Address</label><input className="w-full border p-2" value={data.address} onChange={e => setData({...data, address: e.target.value})} /></div><div><label className="block text-xs font-bold">Office Zip</label><input className="w-full border p-2" value={data.zip} onChange={e => setData({...data, zip: e.target.value})} /></div><div><label className="block text-xs font-bold">Factory Address</label><input className="w-full border p-2" value={data.factoryAddress} onChange={e => setData({...data, factoryAddress: e.target.value})} /></div><div><label className="block text-xs font-bold">Factory Zip</label><input className="w-full border p-2" value={data.factoryZip} onChange={e => setData({...data, factoryZip: e.target.value})} /></div><div><label className="block text-xs font-bold">Phone</label><input className="w-full border p-2" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} /></div></div><button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">{labels.common.save}</button></div>);
    };

    const BranchesEditor = () => {
        const [editingId, setEditingId] = useState<string | null>(null);
        const [formData, setFormData] = useState<Branch>({} as Branch);
        const [isNew, setIsNew] = useState(false);
        const startEdit = (b: Branch) => { setEditingId(b.id); setFormData(b); setIsNew(false); };
        const startAdd = () => { setEditingId('new'); setFormData({ id: Date.now().toString(), name: '', image: '', address: '', zip: '', phone: '', fax: '', email: '' }); setIsNew(true); };
        const handleSave = () => { if(isNew) { addBranch(formData); setIsNew(false); showToast('Branch Added!'); } else if(editingId) { updateBranch(editingId, formData); showToast('Branch Saved!'); } };
        return (<div><button onClick={startAdd} className="bg-green-600 text-white px-4 py-2 rounded mb-4">{labels.contact.addBranch}</button>{editingId && (<div className="bg-gray-100 p-4 rounded mb-4"><div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold">Name</label><input className="w-full border p-1" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})}/></div><div><label className="text-xs font-bold">Phone</label><input className="w-full border p-1" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})}/></div><div><label className="text-xs font-bold">Address</label><input className="w-full border p-1" value={formData.address} onChange={e=>setFormData({...formData, address:e.target.value})}/></div><div><label className="text-xs font-bold">Zip</label><input className="w-full border p-1" value={formData.zip || ''} onChange={e=>setFormData({...formData, zip:e.target.value})}/></div></div><div className="mt-2 flex space-x-2"><button onClick={handleSave} className="bg-blue-600 text-white px-3 py-1 rounded">{labels.common.save}</button><button onClick={()=>setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">{labels.common.cancel}</button></div></div>)}<div className="space-y-2">{content.branches.map(b => (<div key={b.id} className="flex justify-between items-center border p-2 bg-white rounded"><div className="font-bold">{b.name} <span className="font-normal text-gray-500 text-xs">({b.zip})</span></div><div className="space-x-2"><button onClick={()=>startEdit(b)} className="text-blue-600"><Edit size={16}/></button><button onClick={()=>deleteBranch(b.id)} className="text-red-600"><Trash2 size={16}/></button></div></div>))}</div></div>);
    };

    const SocialsEditor = () => {
        const [editingId, setEditingId] = useState<string | null>(null);
        const [formData, setFormData] = useState<SocialItem>({ id: '', image: '', text: '' });
        const [isNew, setIsNew] = useState(false);
        const startEdit = (s: SocialItem) => { setEditingId(s.id); setFormData(s); setIsNew(false); };
        const startAdd = () => { if (content.socials.length >= 2) return alert('Max 2 items allowed'); setEditingId('new'); setFormData({ id: Date.now().toString(), image: '', text: '' }); setIsNew(true); };
        const handleSave = () => { if (isNew) { addSocial(formData); setIsNew(false); showToast('Added!'); } else if (editingId) { updateSocial(editingId, formData); showToast('Saved!'); } };
        const handleDelete = (id: string) => { if (content.socials.length <= 1) return alert('Min 1 item required'); deleteSocial(id); };
        return (<div><div className="flex justify-between items-center mb-4"><h4 className="font-bold">Follow Us (Max 2)</h4>{content.socials.length < 2 && <button onClick={startAdd} className="bg-green-600 text-white px-3 py-1 rounded text-sm"><Plus size={14} className="inline mr-1"/> Add</button>}</div>{editingId && (<div className="bg-gray-100 p-4 rounded mb-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-xs font-bold">Text (Below Image)</label><input className="w-full border p-1" value={formData.text} onChange={e=>setFormData({...formData, text:e.target.value})}/></div><div><label className="text-xs font-bold">Image (QR Code)</label><div className="flex"><input className="w-full border p-1" value={formData.image} onChange={e=>setFormData({...formData, image:e.target.value})}/><FileUploader onUpload={b=>setFormData({...formData, image:b})} onError={msg => showToast(msg, 'error')} hint="Rec: 200x200px"/></div></div></div><div className="mt-2 flex space-x-2"><button onClick={handleSave} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">{labels.common.save}</button><button onClick={()=>setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded text-sm">{labels.common.cancel}</button></div></div>)}<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{content.socials.map(s => (<div key={s.id} className="border p-4 rounded flex flex-col items-center bg-white relative group"><img src={s.image} className="w-20 h-20 object-contain mb-2" /><p className="font-bold">{s.text}</p><div className="absolute top-2 right-2 space-x-1"><button onClick={()=>startEdit(s)} className="bg-blue-100 p-1 rounded text-blue-600"><Edit size={14}/></button><button onClick={()=>handleDelete(s.id)} className="bg-red-100 p-1 rounded text-red-600"><Trash2 size={14}/></button></div></div>))}</div></div>);
    };

    const FeedbackViewer = () => (<div><h4 className="font-bold mb-4">{labels.contact.feedback}</h4><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-gray-200"><tr><th className="p-2 text-left">Date</th><th className="p-2 text-left">Name</th><th className="p-2 text-left">Message</th><th className="p-2">Action</th></tr></thead><tbody>{content.feedback.map(f => (<tr key={f.id} className="border-b"><td className="p-2">{f.date}</td><td className="p-2">{f.firstName}</td><td className="p-2">{f.message}</td><td className="p-2"><button onClick={()=>deleteFeedback(f.id)} className="text-red-600"><Trash2 size={16}/></button></td></tr>))}</tbody></table></div></div>);

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 border-b pb-2 mb-4 overflow-x-auto">
                <button onClick={()=>setSubTab('main')} className={`px-4 py-2 font-bold whitespace-nowrap ${subTab==='main'?'text-brand-blue border-b-2 border-brand-blue':'text-gray-500'}`}>{labels.contact.mainInfo}</button>
                <button onClick={()=>setSubTab('branches')} className={`px-4 py-2 font-bold whitespace-nowrap ${subTab==='branches'?'text-brand-blue border-b-2 border-brand-blue':'text-gray-500'}`}>{labels.contact.branches}</button>
                <button onClick={()=>setSubTab('socials')} className={`px-4 py-2 font-bold whitespace-nowrap ${subTab==='socials'?'text-brand-blue border-b-2 border-brand-blue':'text-gray-500'}`}>{labels.contact.socials}</button>
                <button onClick={()=>setSubTab('feedback')} className={`px-4 py-2 font-bold whitespace-nowrap ${subTab==='feedback'?'text-brand-blue border-b-2 border-brand-blue':'text-gray-500'}`}>{labels.contact.feedback}</button>
            </div>
            {subTab === 'main' && <MainInfoEditor />}
            {subTab === 'branches' && <BranchesEditor />}
            {subTab === 'socials' && <SocialsEditor />}
            {subTab === 'feedback' && <FeedbackViewer />}
        </div>
    );
};

// --- MAIN ADMIN COMPONENT ---
const Admin = () => {
  const { language, setLanguage, adminLanguage, setAdminLanguage, content } = useLanguage();
  const [activeTab, setActiveTab] = useState<'settings' | 'home' | 'industry' | 'intro' | 'product' | 'patterns' | 'techSpec' | 'news' | 'contact' | 'custom'>('settings');
  const labels = ADMIN_LABELS[adminLanguage];
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
       {/* Toast Container */}
       <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
           {toasts.map(t => (
               <div key={t.id} className={`p-4 rounded shadow-lg flex items-center space-x-2 text-white animate-bounce-in ${t.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                   {t.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                   <span>{t.message}</span>
               </div>
           ))}
       </div>

       <div className="bg-gray-800 text-white p-4 sticky top-0 z-40">
          <div className="container mx-auto flex justify-between items-center">
             <div className="flex items-center space-x-4">
                 <h1 className="text-xl font-bold">{labels.dashboard}</h1>
                 <Link to="/" className="flex items-center text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors" title="Return to Website">
                    <HomeIcon size={14} className="mr-2" />
                    {labels.backToSite}
                 </Link>
             </div>
             <div className="flex items-center space-x-4">
                 <div className="text-sm">{labels.editLang}: <span className="font-bold text-yellow-400">{language}</span></div>
                 <button onClick={() => setAdminLanguage(adminLanguage === 'CN' ? 'EN' : 'CN')} className="flex items-center text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">
                     <Globe size={12} className="mr-1"/> {labels.switchAdmin}
                 </button>
             </div>
          </div>
       </div>

       <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6 mt-6">
          <div className="w-full md:w-64 bg-white rounded shadow h-fit sticky top-20">
             <nav className="flex flex-col p-2">
                <button onClick={() => setActiveTab('settings')} className={`p-3 text-left rounded mb-1 flex items-center ${activeTab === 'settings' ? 'bg-brand-blue text-white' : 'hover:bg-gray-100'}`}><SettingsIcon size={16} className="mr-2"/> {labels.tabs.settings}</button>
                <button onClick={() => setActiveTab('home')} className={`p-3 text-left rounded mb-1 ${activeTab === 'home' ? 'bg-brand-blue text-white' : 'hover:bg-gray-100'}`}>{labels.tabs.home}</button>
                <button onClick={() => setActiveTab('industry')} className={`p-3 text-left rounded mb-1 ${activeTab === 'industry' ? 'bg-brand-blue text-white' : 'hover:bg-gray-100'}`}>{labels.tabs.industry}</button>
                <button onClick={() => setActiveTab('product')} className={`p-3 text-left rounded mb-1 ${activeTab === 'product' ? 'bg-brand-blue text-white' : 'hover:bg-gray-100'}`}>{labels.tabs.product}</button>
                <button onClick={() => setActiveTab('patterns')} className={`p-3 text-left rounded mb-1 ${activeTab === 'patterns' ? 'bg-brand-blue text-white' : 'hover:bg-gray-100'}`}>{labels.tabs.patterns}</button>
                <button onClick={() => setActiveTab('intro')} className={`p-3 text-left rounded mb-1 ${activeTab === 'intro' ? 'bg-brand-blue text-white' : 'hover:bg-gray-100'}`}>{labels.tabs.intro}</button>
                <button onClick={() => setActiveTab('custom')} className={`p-3 text-left rounded mb-1 ${activeTab === 'custom' ? 'bg-brand-blue text-white' : 'hover:bg-gray-100'}`}>{labels.tabs.custom}</button>
                <button onClick={() => setActiveTab('techSpec')} className={`p-3 text-left rounded mb-1 ${activeTab === 'techSpec' ? 'bg-brand-blue text-white' : 'hover:bg-gray-100'}`}>{labels.tabs.tech}</button>
                <button onClick={() => setActiveTab('news')} className={`p-3 text-left rounded mb-1 ${activeTab === 'news' ? 'bg-brand-blue text-white' : 'hover:bg-gray-100'}`}>{labels.tabs.news}</button>
                <button onClick={() => setActiveTab('contact')} className={`p-3 text-left rounded mb-1 ${activeTab === 'contact' ? 'bg-brand-blue text-white' : 'hover:bg-gray-100'}`}>{labels.tabs.contact}</button>
             </nav>
          </div>

          <div className="flex-1 bg-white rounded shadow p-6 min-h-screen">
             {activeTab === 'settings' && <SettingsEditor labels={labels} showToast={showToast} />}
             {activeTab === 'home' && <HomeEditor labels={labels} showToast={showToast} />}
             {activeTab === 'industry' && <IndustryEditor labels={labels} showToast={showToast} />}
             {activeTab === 'intro' && <CompanyIntroEditor labels={labels} showToast={showToast} />} 
             {activeTab === 'product' && <ProductEditor labels={labels} showToast={showToast} />}
             {activeTab === 'patterns' && <PatternEditor labels={labels} showToast={showToast} />}
             {activeTab === 'custom' && <CustomPageEditor labels={labels} showToast={showToast} />}
             {activeTab === 'techSpec' && <TechSpecEditor labels={labels} showToast={showToast} adminLanguage={adminLanguage} />}
             {activeTab === 'news' && <NewsEditor labels={labels} showToast={showToast} />}
             {activeTab === 'contact' && <ContactEditor labels={labels} showToast={showToast} />}
          </div>
       </div>
    </div>
  );
};

export default Admin;