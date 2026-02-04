
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Save, ArrowLeft, Image as ImageIcon, Layout, Info, Package, Newspaper, Mail, Plus, Trash2,
  CheckCircle, Edit2, X, PlusCircle, AlertCircle, MessageSquare, Phone, MapPin, Printer, Check, Layers, History, Award, Star, List , LogOut , Grid, Type, ArrowUp, ArrowDown  // 👈 新增这两个
} from 'lucide-react';
import { NewsItem, Product, CustomTableData } from '../types';

// 引入阿里云 SDK
import OSS from 'ali-oss';

// --- 阿里云 OSS 配置 (请填入第一步里你记下来的信息) ---
const client = new OSS({
  region: 'oss-cn-hongkong', // 你的Bucket所在区域，比如 oss-cn-hangzhou (注意没有 .aliyuncs.com)
  accessKeyId: 'LTAI5tLxUE3rnFddJ69hJdS1',
  accessKeySecret: 'RkFvzh75UhKtzEAHxUqA1ni48nSWUh',
  bucket: 'kangyitai-data', // 你创建的 Bucket 名字
  secure: true, // 使用 HTTPS
});
// ------------------------------------------------


// --- 新增：智能文本框组件 (SmartTextarea) ---
// 这个组件自带一个“插入缩进”按钮，点击即可插入两个全角空格
const SmartTextarea: React.FC<{
  value: string;
  onChange: (e: any) => void;
  className?: string;
  placeholder?: string;
  rows?: number;
}> = ({ value, onChange, className, placeholder, rows = 3 }) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertIndent = (e: React.MouseEvent) => {
    e.preventDefault(); // 防止按钮点击导致失去焦点
    const el = textareaRef.current;
    if (!el) return;

    // 获取光标位置
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const txt = el.value;

    // 在光标处插入两个全角空格
    const indentChar = '　　';
    const newVal = txt.substring(0, start) + indentChar + txt.substring(end);

    // 模拟触发 onChange 事件，更新数据
    onChange({ target: { value: newVal } });

    // 重新定位光标到插入内容之后
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + indentChar.length, start + indentChar.length);
    }, 0);
  };

  return (
    <div className="relative group">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
        rows={rows}
      />
      {/* 悬浮按钮：平时隐藏，鼠标放上去显示 */}
      <button
        onClick={insertIndent}
        className="absolute right-2 top-2 bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-blue-200"
        title="在光标处插入首行缩进"
      >
        + 插入缩进
      </button>
    </div>
  );
};
// -------------------------------------------

// ... SmartTextarea 的代码 ...
// -------------------------------------------

// ▼▼▼▼▼▼▼▼▼▼ 在这里插入 TableEditor 组件 ▼▼▼▼▼▼▼▼▼▼

// --- 组件2: 核心表格编辑器 (TableEditor) ---
const TableEditor: React.FC<{
  data: CustomTableData;
  onChange: (newData: CustomTableData) => void;
}> = ({ data, onChange }) => {
  const safeData = data || { columns: [], rows: [] };

  const addColumn = () => {
    const newColId = Date.now().toString();
    const newCols = [...safeData.columns, { id: newColId, label: { zh: '新列', en: 'New Col' } }];
    const newRows = safeData.rows.map(row => ({
      ...row,
      cells: [...row.cells, { zh: '', en: '' }]
    }));
    onChange({ columns: newCols, rows: newRows });
  };

  const removeColumn = (colIdx: number) => {
    const newCols = safeData.columns.filter((_, i) => i !== colIdx);
    const newRows = safeData.rows.map(row => ({
      ...row,
      cells: row.cells.filter((_, i) => i !== colIdx)
    }));
    onChange({ columns: newCols, rows: newRows });
  };

  const addRow = () => {
    const newCells = safeData.columns.map(() => ({ zh: '', en: '' }));
    const newRows = [...safeData.rows, { id: Date.now().toString(), cells: newCells }];
    onChange({ ...safeData, rows: newRows });
  };

  const removeRow = (rowIdx: number) => {
    const newRows = safeData.rows.filter((_, i) => i !== rowIdx);
    onChange({ ...safeData, rows: newRows });
  };

  const updateColumnLabel = (colIdx: number, field: 'zh' | 'en', val: string) => {
    const newCols = [...safeData.columns];
    newCols[colIdx].label = { ...newCols[colIdx].label, [field]: val };
    onChange({ ...safeData, columns: newCols });
  };

  const updateCell = (rowIdx: number, colIdx: number, field: 'zh' | 'en', val: string) => {
    const newRows = [...safeData.rows];
    if (!newRows[rowIdx].cells[colIdx]) {
        newRows[rowIdx].cells[colIdx] = { zh: '', en: '' };
    }
    newRows[rowIdx].cells[colIdx] = { ...newRows[rowIdx].cells[colIdx], [field]: val };
    onChange({ ...safeData, rows: newRows });
  };

  return (
    <div className="space-y-6 bg-white p-4 rounded-2xl border border-gray-200">
      {/* 1. 列配置区域 */}
      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
        <div className="flex justify-between items-center">
            <h5 className="font-bold text-gray-700 text-sm uppercase">1. 定义表格列 (Columns)</h5>
            <button onClick={addColumn} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700">+ 添加一列</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
            {safeData.columns.map((col, idx) => (
                <div key={col.id} className="min-w-[150px] bg-white p-2 rounded-lg border shadow-sm relative group">
                    <button onClick={() => removeColumn(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">×</button>
                    <div className="space-y-1">
                        <input value={col.label.zh} onChange={e => updateColumnLabel(idx, 'zh', e.target.value)} className="w-full text-xs font-bold border-b p-1 text-center focus:border-blue-500 outline-none" placeholder="列名(中)" />
                        <input value={col.label.en} onChange={e => updateColumnLabel(idx, 'en', e.target.value)} className="w-full text-xs text-gray-400 border-b p-1 text-center focus:border-blue-500 outline-none" placeholder="Col(EN)" />
                    </div>
                </div>
            ))}
            {safeData.columns.length === 0 && <div className="text-gray-400 text-xs italic py-2">暂无列，请先添加列</div>}
        </div>
      </div>

      {/* 2. 行数据录入区域 */}
      <div>
         <div className="flex justify-between items-center mb-2">
            <h5 className="font-bold text-gray-700 text-sm uppercase">2. 录入数据 (Rows)</h5>
            <button onClick={addRow} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-green-700">+ 添加一行数据</button>
         </div>
         {safeData.columns.length > 0 ? (
             <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-500">
                            {safeData.columns.map(col => (
                                <th key={col.id} className="p-2 border">{col.label.zh} <span className="text-[10px] opacity-70">/ {col.label.en}</span></th>
                            ))}
                            <th className="p-2 border w-10">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {safeData.rows.map((row, rIdx) => (
                            <tr key={row.id}>
                                {safeData.columns.map((col, cIdx) => (
                                    <td key={col.id + cIdx} className="p-2 border bg-white min-w-[120px]">
                                        <div className="space-y-1">
                                            <input value={row.cells[cIdx]?.zh || ''} onChange={e => updateCell(rIdx, cIdx, 'zh', e.target.value)} className="w-full border rounded px-1 py-0.5 focus:border-blue-500 outline-none" placeholder="中文值" />
                                            <input value={row.cells[cIdx]?.en || ''} onChange={e => updateCell(rIdx, cIdx, 'en', e.target.value)} className="w-full border rounded px-1 py-0.5 bg-gray-50 text-gray-500 focus:border-blue-500 outline-none" placeholder="EN Value" />
                                        </div>
                                    </td>
                                ))}
                                <td className="p-2 border text-center">
                                    <button onClick={() => removeRow(rIdx)} className="text-red-400 hover:text-red-600"><Trash2 size={14}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
         ) : (
             <div className="p-8 text-center bg-gray-50 border border-dashed rounded-xl text-gray-400 text-sm">请先在上方定义列，然后才能添加数据行</div>
         )}
      </div>
    </div>
  );
};
// ▲▲▲▲▲▲▲▲▲▲ 插入结束 ▲▲▲▲▲▲▲▲▲▲


export const Admin: React.FC = () => {
  const { data, setData, t, messages, lang , deleteMessage} = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'base' | 'home' | 'about' | 'products' | 'news' | 'contact' | 'messages'>('base');
  const [toast, setToast] = useState<{ show: boolean, msg: string, type: 'success' | 'error' }>({ show: false, msg: '', type: 'success' });
  
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  // ▼▼▼▼▼▼▼▼▼▼ 请复制这一整段代码，粘贴到 showToast 下面 ▼▼▼▼▼▼▼▼▼▼

  // 1. 定义上传函数 (之前缺失的那个)
  const uploadImageToOSS = async (file: File): Promise<string> => {
    try {
      // client 是文件最上面定义的那个阿里云连接对象
      const filename = `images/${Date.now()}_${Math.floor(Math.random() * 1000)}.${file.name.split('.').pop()}`;
      const result = await client.put(filename, file);
      
      let url = result.url;
      if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }
      console.log('✅ 上传成功:', url);
      return url;
    } catch (e) {
      console.error('❌ 上传失败:', e);
      throw e;
    }
  };

  // 2. 修改后的总指挥函数 (调用上面的函数)
  const simulateUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showToast(lang === 'zh' ? '正在上传图片到阿里云...' : 'Uploading to OSS...', 'success');
        
        // 现在这里就能找到 uploadImageToOSS 了！
        const ossUrl = await uploadImageToOSS(file);
        
        callback(ossUrl);
        showToast(lang === 'zh' ? '✅ 图片上传成功' : 'Upload success');
      } catch (error) {
        console.error(error);
        showToast(lang === 'zh' ? '❌ 图片上传失败' : 'Upload failed', 'error');
      }
    }
  };
  // ▲▲▲▲▲▲▲▲▲▲ 粘贴结束 ▲▲▲▲▲▲▲▲▲▲

  /**
   * 图片压缩逻辑 - 保持以节省 localStorage 空间
   */
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200; 

          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressed);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // --- 新增：产品排序移动函数 ---
  const moveProduct = (index: number, direction: 'up' | 'down') => {
    // 1. 获取当前产品列表
    const newProducts = [...(data.products || [])];
    
    // 2. 边界检查（如果是第一个就不能上移，如果是最后一个就不能下移）
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === newProducts.length - 1) return;

    // 3. 计算目标位置
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // 4. 交换位置 (Magic!)
    [newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]];

    // 5. 保存更新
    handleUpdate('products', newProducts);
  };

  const handleUpdate = (path: string, value: any) => {
    try {
      const newData = JSON.parse(JSON.stringify(data));
      const keys = path.split('.');
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      setData(newData);
      showToast(lang === 'zh' ? '更新成功' : 'Update success');
    } catch (e) {
      showToast(lang === 'zh' ? '数据处理失败' : 'Data processing failed', 'error');
    }
  };



  const menu = [
    { id: 'base', label: '基础设置', icon: Layout },
    { id: 'home', label: '首页模块', icon: ImageIcon },
    { id: 'about', label: '关于/历史', icon: Info },
    { id: 'products', label: '产品中心', icon: Package },
    { id: 'news', label: '新闻动态', icon: Newspaper },
    { id: 'contact', label: '联系方式', icon: Mail },
    { id: 'messages', label: '留言查看', icon: MessageSquare },
  ];

  const globalSave = async () => {
    try {
      showToast('正在同步到阿里云...', 'success');

      // 1. 把当前数据转成文件对象
      const jsonString = JSON.stringify(data);
      const blob = new Blob([jsonString], { type: 'application/json' });

      // 2. 上传到阿里云 OSS
      // 'site_data.json' 是保存在云端的文件名
      const result = await client.put('site_data.json', blob);

      console.log('阿里云上传成功:', result);
      showToast(lang === 'zh' ? '✅ 已同步到阿里云' : 'Synced to Aliyun');
      
      // 本地也存一份备用
      localStorage.setItem('site_data', JSON.stringify(data));

    } catch (e) {
      console.error(e);
      showToast(lang === 'zh' ? '❌ 同步失败，请检查控制台' : 'Sync failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex text-gray-900">
      {toast.show && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[999] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
          toast.type === 'success' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
          <span className="font-bold">{toast.msg}</span>
        </div>
      )}

      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">C</div>
          <h1 className="font-bold text-lg text-gray-900 tracking-tight">管理后台</h1>
        </div>
        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {menu.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <item.icon size={20} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t space-y-2">
           <button 
             onClick={() => {
               localStorage.removeItem('is_admin_logged_in'); // 清除登录状态
               navigate('/login'); // 跳回登录页
             }} 
             className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors"
           >
             <LogOut size={16} /> 退出登录
           </button>
           <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 rounded-lg text-gray-600 font-bold hover:bg-gray-100">
             <ArrowLeft size={16} /> 返回前台
           </button>
        </div>
      </aside>

      <main className="flex-grow ml-72 p-10 pb-32">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{menu.find(m => m.id === activeTab)?.label}</h2>
          <button onClick={globalSave} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all">
            <Save size={20} /> 全局保存
          </button>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-10">
          {/* 1. 基础设置 */}
          {activeTab === 'base' && (
                      <div className="space-y-10 max-w-3xl">
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700 uppercase">公司 Logo</label>
                            <div className="flex items-center gap-8">
                              <img src={data.logo} className="h-16 p-3 border rounded-xl bg-gray-50" alt="Logo" />
                              <label className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl cursor-pointer font-bold border border-blue-200 hover:bg-blue-100 transition-all">
                                上传 Logo
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => simulateUpload(e, (url) => handleUpdate('logo', url))} />
                              </label>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            {/* ▼▼▼▼▼▼ 新增：浏览器标题 & 语言设置 ▼▼▼▼▼▼ */}
                            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 space-y-6">
                              <h4 className="font-bold text-purple-800 flex items-center gap-2">🌐 网站全局配置</h4>

                              {/* ▼▼▼▼▼▼ 新增：加载页面文案设置 ▼▼▼▼▼▼ */}
                                <div className="space-y-3 pt-6 border-t border-purple-100">
                                    <label className="block text-sm font-bold text-gray-600 uppercase">加载页面 (Loading) 欢迎语</label>
                                    <div className="grid grid-cols-1 gap-4">
                                      <div>
                                        <span className="text-xs text-gray-400 mb-1 block">中文提示语</span>
                                        <input 
                                          value={data.loadingText?.zh || ''} 
                                          onChange={e => handleUpdate('loadingText.zh', e.target.value)} 
                                          className="w-full p-3 border rounded-xl outline-none focus:border-purple-500" 
                                          placeholder="例如: 数据加载中..."
                                        />
                                      </div>
                                      <div>
                                        <span className="text-xs text-gray-400 mb-1 block">英文提示语 (English)</span>
                                        <input 
                                          value={data.loadingText?.en || ''} 
                                          onChange={e => handleUpdate('loadingText.en', e.target.value)} 
                                          className="w-full p-3 border rounded-xl outline-none focus:border-purple-500" 
                                          placeholder="e.g. Loading..."
                                        />
                                      </div>
                                    </div>
                                </div>
                              {/* ▲▲▲▲▲▲ 新增结束 ▲▲▲▲▲▲ */}
                              
                              {/* 1. 浏览器标题设置 */}
                              <div className="space-y-3">
                                  <label className="block text-sm font-bold text-gray-600 uppercase">浏览器标签页标题后缀</label>
                                  <div className="grid grid-cols-2 gap-6">
                                    <div>
                                      <span className="text-xs text-gray-400 mb-1 block">中文后缀 (例如: 广东康以泰...)</span>
                                      <input 
                                        value={data.siteTitleSuffix?.zh || ''} 
                                        onChange={e => handleUpdate('siteTitleSuffix.zh', e.target.value)} 
                                        className="w-full p-3 border rounded-xl outline-none focus:border-purple-500" 
                                      />
                                    </div>
                                    <div>
                                      <span className="text-xs text-gray-400 mb-1 block">英文后缀 (例如: Kangyitai Tech...)</span>
                                      <input 
                                        value={data.siteTitleSuffix?.en || ''} 
                                        onChange={e => handleUpdate('siteTitleSuffix.en', e.target.value)} 
                                        className="w-full p-3 border rounded-xl outline-none focus:border-purple-500" 
                                      />
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-400">效果预览：首页 - {data.siteTitleSuffix?.zh}</p>
                              </div>

                              {/* 2. 默认语言设置 */}
                              <div className="space-y-3">
                                  <label className="block text-sm font-bold text-gray-600 uppercase">网站默认打开语言</label>
                                  <div className="flex gap-4">
                                    <button 
                                      onClick={() => handleUpdate('defaultLang', 'zh')}
                                      className={`px-6 py-2 rounded-lg font-bold border transition-all ${data.defaultLang === 'zh' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300'}`}
                                    >
                                      🇨🇳 中文 (Chinese)
                                    </button>
                                    <button 
                                      onClick={() => handleUpdate('defaultLang', 'en')}
                                      className={`px-6 py-2 rounded-lg font-bold border transition-all ${data.defaultLang === 'en' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300'}`}
                                    >
                                      🇺🇸 英文 (English)
                                    </button>
                                  </div>
                              </div>
                            </div>
                            {/* ▲▲▲▲▲▲ 新增结束 ▲▲▲▲▲▲ */}
                            <label className="block text-sm font-bold text-gray-500 uppercase">公司名称</label>
                            <div className="grid grid-cols-2 gap-6">
                              <input value={data.companyName.zh} onChange={e => handleUpdate('companyName.zh', e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-blue-500" placeholder="中文名称" />
                              <input value={data.companyName.en} onChange={e => handleUpdate('companyName.en', e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-blue-500" placeholder="English Name" />
                            </div>
                        </div>
                        {/* ▼▼▼▼▼▼▼▼▼▼ 新增：公司简称编辑框 ▼▼▼▼▼▼▼▼▼▼ */}
                          <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-500 uppercase text-blue-600">公司简称 (手机端显示)</label>
                            <div className="grid grid-cols-2 gap-6">
                              <input 
                                // 注意：这里加了 || '' 防止旧数据没有这个字段导致报错
                                value={data.companyNameShort?.zh || ''} 
                                onChange={e => handleUpdate('companyNameShort.zh', e.target.value)} 
                                className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 bg-blue-50/50" 
                                placeholder="例如: 康以泰" 
                              />
                              <input 
                                value={data.companyNameShort?.en || ''} 
                                onChange={e => handleUpdate('companyNameShort.en', e.target.value)} 
                                className="w-full p-3 border rounded-xl outline-none focus:border-blue-500 bg-blue-50/50" 
                                placeholder="e.g. KYT" 
                              />
                            </div>
                            <p className="text-xs text-gray-400">提示：当手机屏幕太窄时，会自动隐藏上面的长名称，只显示这个简称。</p>
                          </div>
                          {/* ▲▲▲▲▲▲▲▲▲▲ 新增结束 ▲▲▲▲▲▲▲▲▲▲ */}

                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-500 uppercase">页脚版权信息</label>
                            <div className="grid grid-cols-2 gap-6">
                              <input value={data.copyright.zh} onChange={e => handleUpdate('copyright.zh', e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-blue-500" placeholder="中文版权" />
                              <input value={data.copyright.en} onChange={e => handleUpdate('copyright.en', e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-blue-500" placeholder="English Copyright" />
                            </div>
                        </div>

                        {/* 关注我们设置 (已包含双语) */}
                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            <label className="block text-sm font-bold text-gray-700 uppercase">页脚 "关注我们" 设置</label>
                            <div className="flex items-center gap-8 mb-4">
                              <div className="flex flex-col items-center gap-2">
                                <img src={data.followUs.qrCode} className="w-24 h-24 p-2 border rounded-xl bg-gray-50 object-contain" alt="QR Code" />
                                <span className="text-xs text-gray-400">二维码</span>
                              </div>
                              <label className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl cursor-pointer font-bold border border-blue-200 hover:bg-blue-100 transition-all">
                                更换二维码
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => simulateUpload(e, (url) => handleUpdate('followUs.qrCode', url))} />
                              </label>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <input value={data.followUs.text.zh} onChange={e => handleUpdate('followUs.text.zh', e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-blue-500" placeholder="提示文案 (中文)" />
                              <input value={data.followUs.text.en} onChange={e => handleUpdate('followUs.text.en', e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:border-blue-500" placeholder="Prompt Text (EN)" />
                          </div>
                        </div>
                      </div>
                    )}

          {/* 2. 首页模块 */}
          {activeTab === 'home' && (
                      <div className="space-y-12">
                        {/* 轮播图部分保持不变... (省略代码以节省篇幅，这部分之前已经是双语了) */}
                        <section className="space-y-6">
                            {/* ... 轮播图代码保持原样 ... */}
                            <div className="flex justify-between items-center border-b pb-2">
                              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2"><ImageIcon size={20}/> 首页轮播图</h3>
                              <button onClick={() => handleUpdate('heroSlides', [...data.heroSlides, { id: Date.now().toString(), image: 'https://via.placeholder.com/1920x800', title: { zh: '新标题', en: 'New Title' }, desc: { zh: '新描述', en: 'New Desc' } }])} className="text-sm font-bold text-blue-600 flex items-center gap-1"><PlusCircle size={16}/> 新增</button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              {data.heroSlides.map((slide, i) => (
                                <div key={slide.id} className="p-6 bg-gray-50 rounded-2xl border relative flex flex-col md:flex-row gap-6">
                                  <button onClick={() => handleUpdate('heroSlides', data.heroSlides.filter(s => s.id !== slide.id))} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                                  <div className="w-48 aspect-video rounded-xl overflow-hidden relative group shrink-0">
                                      <img src={slide.image} className="w-full h-full object-cover" />
                                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity text-xs font-bold text-center p-2">
                                        更换背景 <input type="file" className="hidden" accept="image/*" onChange={e => simulateUpload(e, url => { const n = [...data.heroSlides]; n[i].image = url; handleUpdate('heroSlides', n); })} />
                                      </label>
                                  </div>
                                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <input value={slide.title.zh} onChange={e => { const n = [...data.heroSlides]; n[i].title.zh = e.target.value; handleUpdate('heroSlides', n); }} className="p-3 border rounded-xl" placeholder="标题 (ZH)" />
                                      <input value={slide.title.en} onChange={e => { const n = [...data.heroSlides]; n[i].title.en = e.target.value; handleUpdate('heroSlides', n); }} className="p-3 border rounded-xl" placeholder="Title (EN)" />
                                      <SmartTextarea 
                                        value={slide.desc.zh} 
                                        onChange={e => { const n = [...data.heroSlides]; n[i].desc.zh = e.target.value; handleUpdate('heroSlides', n); }} 
                                        className="p-3 border rounded-xl" 
                                        placeholder="描述 (ZH)" 
                                        rows={2} 
                                      />
                                      <SmartTextarea 
                                        value={slide.desc.en} 
                                        onChange={e => { const n = [...data.heroSlides]; n[i].desc.en = e.target.value; handleUpdate('heroSlides', n); }} 
                                        className="p-3 border rounded-xl" 
                                        placeholder="Desc (EN)" 
                                        rows={2} 
                                      />
                                  </div>
                                </div>
                              ))}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="font-bold text-lg text-gray-800 border-b pb-2 flex items-center gap-2"><Layers size={20}/> 实验室欢迎板块</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-2xl">
                              <div className="space-y-4">
                                  <label className="block text-sm font-bold text-gray-500">主图</label>
                                  <div className="relative aspect-video rounded-2xl overflow-hidden border">
                                    <img src={data.labSection.image} className="w-full h-full object-cover" />
                                    <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity font-bold">
                                        更换图片 <input type="file" className="hidden" accept="image/*" onChange={e => simulateUpload(e, url => handleUpdate('labSection.image', url))} />
                                    </label>
                                  </div>
                              </div>
                              <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-2">
                                    <input value={data.labSection.title.zh} onChange={e => handleUpdate('labSection.title.zh', e.target.value)} className="w-full p-3 border rounded-xl font-bold" placeholder="标题 (ZH)" />
                                    <input value={data.labSection.title.en} onChange={e => handleUpdate('labSection.title.en', e.target.value)} className="w-full p-3 border rounded-xl font-bold" placeholder="Title (EN)" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <textarea value={data.labSection.desc.zh} onChange={e => handleUpdate('labSection.desc.zh', e.target.value)} className="w-full p-3 border rounded-xl" rows={4} placeholder="描述 (ZH)" />
                                    <textarea value={data.labSection.desc.en} onChange={e => handleUpdate('labSection.desc.en', e.target.value)} className="w-full p-3 border rounded-xl" rows={4} placeholder="Desc (EN)" />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    {data.labSection.stats.map((s, idx) => (
                                      <div key={idx} className="bg-white p-3 rounded-xl border space-y-2">
                                        <input value={s.value} onChange={e => { const ns = [...data.labSection.stats]; ns[idx].value = e.target.value; handleUpdate('labSection.stats', ns); }} className="w-full font-bold text-blue-600 border-b mb-1 text-center" placeholder="数字" />
                                        <input value={s.label.zh} onChange={e => { const ns = [...data.labSection.stats]; ns[idx].label.zh = e.target.value; handleUpdate('labSection.stats', ns); }} className="w-full text-xs text-center border-b bg-gray-50 mb-1" placeholder="标签 (ZH)" />
                                        <input value={s.label.en} onChange={e => { const ns = [...data.labSection.stats]; ns[idx].label.en = e.target.value; handleUpdate('labSection.stats', ns); }} className="w-full text-xs text-center bg-gray-50" placeholder="Label (EN)" />
                                      </div>
                                    ))}
                                  </div>
                              </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h3 className="font-bold text-lg text-gray-800 border-b pb-2 flex items-center gap-2"><Star size={20}/> “为什么选择我们”板块</h3>
                            <div className="bg-gray-50 p-6 rounded-2xl space-y-6">
                              <div className="flex items-center gap-6">
                                  <img src={data.whyChooseUs.centerImage} className="w-24 h-24 rounded-full border-4 border-white shadow-sm" />
                                  <label className="bg-white px-4 py-2 border rounded-xl cursor-pointer text-sm font-bold hover:bg-gray-100">
                                    更换中心图
                                    <input type="file" className="hidden" accept="image/*" onChange={e => simulateUpload(e, url => handleUpdate('whyChooseUs.centerImage', url))} />
                                  </label>
                              </div>
                              <div className="grid grid-cols-1 gap-4">
                                  {data.whyChooseUs.points.map((p, i) => (
                                    <div key={i} className="p-4 bg-white rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm">
                                        <div>
                                          <input value={p.title.zh} onChange={e => { const ns = [...data.whyChooseUs.points]; ns[i].title.zh = e.target.value; handleUpdate('whyChooseUs.points', ns); }} className="w-full p-2 border-b font-bold mb-2" placeholder="标题 (ZH)" />
                                          <textarea value={p.desc.zh} onChange={e => { const ns = [...data.whyChooseUs.points]; ns[i].desc.zh = e.target.value; handleUpdate('whyChooseUs.points', ns); }} className="w-full p-2 text-sm text-gray-500 bg-gray-50 rounded" rows={2} placeholder="描述 (ZH)" />
                                        </div>
                                        <div>
                                          <input value={p.title.en} onChange={e => { const ns = [...data.whyChooseUs.points]; ns[i].title.en = e.target.value; handleUpdate('whyChooseUs.points', ns); }} className="w-full p-2 border-b font-bold mb-2" placeholder="Title (EN)" />
                                          <textarea value={p.desc.en} onChange={e => { const ns = [...data.whyChooseUs.points]; ns[i].desc.en = e.target.value; handleUpdate('whyChooseUs.points', ns); }} className="w-full p-2 text-sm text-gray-500 bg-gray-50 rounded" rows={2} placeholder="Desc (EN)" />
                                        </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                        </section>
                      </div>
                    )}

          {/* 3. 关于与历史 */}
          {activeTab === 'about' && (
            <div className="space-y-12">
               <section className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2"><Info size={20}/> 标签内容</h3>
                    <div className="flex items-center gap-4">
                       <img src={data.aboutTabs.image} className="h-10 w-16 object-cover rounded border" />
                       <label className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">
                         更换主图 <input type="file" className="hidden" accept="image/*" onChange={e => simulateUpload(e, url => handleUpdate('aboutTabs.image', url))} />
                       </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {data.aboutTabs.tabs.map((tab, i) => (
                      <div key={i} className="p-6 bg-gray-50 rounded-2xl border grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm">
                         <div>
                            <label className="text-xs font-bold text-gray-400 block mb-1">中文内容</label>
                            <input value={tab.title.zh} onChange={e => { const ns = [...data.aboutTabs.tabs]; ns[i].title.zh = e.target.value; handleUpdate('aboutTabs.tabs', ns); }} className="w-full p-2 border-b font-bold text-blue-700 mb-2" placeholder="标题" />
                            <SmartTextarea 
                              value={tab.content.zh} 
                              onChange={e => { const ns = [...data.aboutTabs.tabs]; ns[i].content.zh = e.target.value; handleUpdate('aboutTabs.tabs', ns); }} 
                              className="w-full p-2 bg-white border rounded text-sm" 
                              rows={4} 
                              placeholder="正文" 
                            />
                         </div>
                         <div>
                            <label className="text-xs font-bold text-gray-400 block mb-1">English Content</label>
                            <input value={tab.title.en} onChange={e => { const ns = [...data.aboutTabs.tabs]; ns[i].title.en = e.target.value; handleUpdate('aboutTabs.tabs', ns); }} className="w-full p-2 border-b font-bold text-blue-700 mb-2" placeholder="Title" />
                            <SmartTextarea 
                              value={tab.content.en} 
                              onChange={e => { const ns = [...data.aboutTabs.tabs]; ns[i].content.en = e.target.value; handleUpdate('aboutTabs.tabs', ns); }} 
                              className="w-full p-2 bg-white border rounded text-sm" 
                              rows={4} 
                              placeholder="Content" 
                            />
                         </div>
                      </div>
                    ))}
                  </div>
               </section>
               {/* ▼▼▼▼▼▼▼▼▼▼ 新增：关于我们-顶部轮播图管理 ▼▼▼▼▼▼▼▼▼▼ */}
               <section className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      <ImageIcon size={20}/> 顶部环境/团队轮播图
                    </h3>
                    <button 
                      onClick={() => handleUpdate('aboutSlides', [...(data.aboutSlides || []), { id: `as${Date.now()}`, image: 'https://via.placeholder.com/800x600' }])} 
                      className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded-lg"
                    >
                      <PlusCircle size={16}/> 新增图片
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {(data.aboutSlides || []).map((slide, i) => (
                      <div key={slide.id} className="group relative aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden border shadow-sm">
                         <img src={slide.image} className="w-full h-full object-cover" />
                         
                         {/* 悬浮操作层 */}
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-all">
                            <label className="bg-white text-blue-600 px-3 py-1.5 rounded-lg cursor-pointer text-xs font-bold hover:bg-blue-50">
                               更换图片
                               <input type="file" className="hidden" accept="image/*" onChange={e => simulateUpload(e, url => { const ns = [...data.aboutSlides]; ns[i].image = url; handleUpdate('aboutSlides', ns); })} />
                            </label>
                            <button 
                              onClick={() => handleUpdate('aboutSlides', data.aboutSlides.filter(s => s.id !== slide.id))} 
                              className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600"
                            >
                              删除
                            </button>
                         </div>
                      </div>
                    ))}
                    {(data.aboutSlides || []).length === 0 && (
                      <div className="col-span-full text-center py-8 text-gray-400 bg-gray-50 border-2 border-dashed rounded-xl">
                        暂无图片，请点击右上角新增
                      </div>
                    )}
                  </div>
               </section>
               {/* ▲▲▲▲▲▲▲▲▲▲ 新增结束 ▲▲▲▲▲▲▲▲▲▲ */}

               <section className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-2">
                     <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2"><History size={20}/> 发展历程</h3>
                     <button onClick={() => handleUpdate('history.events', [...data.history.events, { id: `ev${Date.now()}`, year: '2024', content: { zh: '新里程碑', en: 'New Milestone' } }])} className="text-sm font-bold text-blue-600 flex items-center gap-1"><PlusCircle size={16}/> 新增</button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                     {data.history.events.map((ev, i) => (
                        <div key={ev.id} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-xl border items-start shadow-sm relative">
                           <input value={ev.year} onChange={e => { const ns = [...data.history.events]; ns[i].year = e.target.value; handleUpdate('history.events', ns); }} className="w-full md:w-24 font-black text-blue-600 text-lg border-b bg-transparent text-center" placeholder="年份" />
                           <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                              <input value={ev.content.zh} onChange={e => { const ns = [...data.history.events]; ns[i].content.zh = e.target.value; handleUpdate('history.events', ns); }} className="p-2 bg-white border rounded" placeholder="事件 (中文)" />
                              <input value={ev.content.en} onChange={e => { const ns = [...data.history.events]; ns[i].content.en = e.target.value; handleUpdate('history.events', ns); }} className="p-2 bg-white border rounded" placeholder="Event (EN)" />
                           </div>
                           <button onClick={() => handleUpdate('history.events', data.history.events.filter(item => item.id !== ev.id))} className="absolute top-2 right-2 text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
                        </div>
                     ))}
                  </div>
               </section>

               <section className="space-y-6">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2"><Award size={20}/> 荣誉资质</h3>
                    <button onClick={() => handleUpdate('honors', [...data.honors, { id: `h${Date.now()}`, name: { zh: '新证书', en: 'New Cert' }, image: 'https://via.placeholder.com/300x400' }])} className="text-sm font-bold text-blue-600 flex items-center gap-1"><PlusCircle size={16}/> 新增</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {data.honors.map((h, i) => (
                      <div key={h.id} className="group relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden border shadow-sm">
                         <img src={h.image} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-4 transition-all">
                            <input value={h.name.zh} onChange={e => { const ns = [...data.honors]; ns[i].name.zh = e.target.value; handleUpdate('honors', ns); }} className="w-full text-xs text-center text-white bg-transparent border-b border-white/30 mb-2 focus:border-white outline-none" placeholder="证书名(中)" />
                            <input value={h.name.en} onChange={e => { const ns = [...data.honors]; ns[i].name.en = e.target.value; handleUpdate('honors', ns); }} className="w-full text-xs text-center text-white bg-transparent border-b border-white/30 mb-4 focus:border-white outline-none" placeholder="Name(EN)" />
                            <div className="flex gap-2">
                               <label className="p-2 bg-white rounded-lg cursor-pointer"><ImageIcon size={14}/><input type="file" className="hidden" accept="image/*" onChange={e => simulateUpload(e, url => { const ns = [...data.honors]; ns[i].image = url; handleUpdate('honors', ns); })} /></label>
                               <button onClick={() => handleUpdate('honors', data.honors.filter(item => item.id !== h.id))} className="p-2 bg-white rounded-lg text-red-500"><Trash2 size={14}/></button>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
               </section>
            </div>
          )}

          {/* 4. 产品中心 */}
          {/* 4. 产品中心 (升级版：支持万能表格) */}
          {activeTab === 'products' && (
            <div className="space-y-6">
               {!editingProduct ? (
                 <>
                   <div className="flex justify-between items-center mb-8">
                      {/* ▼▼▼▼▼▼ 新增：产品系列(分类)管理区域 ▼▼▼▼▼▼ */}
                      <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 mb-8 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-blue-800 flex items-center gap-2">📂 产品系列管理 (点击修改)</h4>
                          <button onClick={() => handleUpdate('productSeries', [...(data.productSeries||[]), { id: `s${Date.now()}`, name: { zh: '新系列', en: 'New Series' } }])} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700">+ 新增系列</button>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {(data.productSeries || []).map((series, idx) => (
                            <div key={series.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border shadow-sm group">
                                <div className="flex flex-col gap-1 w-24">
                                  <input value={series.name.zh} onChange={e => { const ns = [...(data.productSeries||[])]; ns[idx].name.zh = e.target.value; handleUpdate('productSeries', ns); }} className="text-xs font-bold border-b border-transparent focus:border-blue-500 outline-none text-center" />
                                  <input value={series.name.en} onChange={e => { const ns = [...(data.productSeries||[])]; ns[idx].name.en = e.target.value; handleUpdate('productSeries', ns); }} className="text-[10px] text-gray-400 border-b border-transparent focus:border-blue-500 outline-none text-center" />
                                </div>
                                <button onClick={() => handleUpdate('productSeries', data.productSeries.filter(s => s.id !== series.id))} className="text-gray-300 hover:text-red-500"><Trash2 size={14}/></button>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* ▲▲▲▲▲▲ 新增结束 ▲▲▲▲▲▲ */}
                     <h3 className="text-xl font-bold text-gray-900 border-l-4 border-blue-500 pl-3">全量产品库</h3>
                     <button onClick={() => setEditingProduct({ 
                       id: `p${Date.now()}`, 
                       name: { zh: '新产品', en: 'New Product' }, 
                       image: 'https://via.placeholder.com/600x600', 
                       images: ['https://via.placeholder.com/600x600'], 
                       desc: { zh: '', en: '' }, 
                       features: [],
                       standardsType: 'simple', // 默认简单表格
                       standards: [],
                       detailBlocks: []
                     })} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md transition-all"><Plus size={20}/> 新增产品</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* 👇 注意这里加了 index 参数 */}
                    {(data.products || []).map((p, index) => (
                      <div key={p.id} className="p-5 border border-gray-100 rounded-[32px] bg-white group hover:border-blue-200 hover:shadow-xl transition-all flex flex-col">
                        <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-gray-50 relative">
                          <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          
                          {/* ✨✨✨ 新增：悬浮在图片右上角的排序按钮 ✨✨✨ */}
                          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm backdrop-blur-sm">
                            <button 
                              onClick={(e) => { e.stopPropagation(); moveProduct(index, 'up'); }} 
                              disabled={index === 0}
                              className={`p-1.5 rounded-md hover:bg-blue-100 text-blue-600 ${index === 0 ? 'text-gray-300 cursor-not-allowed' : ''}`}
                              title="向前移动"
                            >
                              <ArrowUp size={16} />
                            </button>
                            <div className="h-[1px] bg-gray-200 w-full"></div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); moveProduct(index, 'down'); }} 
                              disabled={index === (data.products?.length || 0) - 1}
                              className={`p-1.5 rounded-md hover:bg-blue-100 text-blue-600 ${index === (data.products?.length || 0) - 1 ? 'text-gray-300 cursor-not-allowed' : ''}`}
                              title="向后移动"
                            >
                              <ArrowDown size={16} />
                            </button>
                          </div>
                        </div>

      <h4 className="font-bold text-gray-900 mb-2 truncate">{t(p.name || { zh: '未命名', en: 'Unnamed' })}</h4>
      <div className="text-xs text-gray-400 mb-4 font-mono">排序序号: {index + 1}</div>

      <div className="mt-auto flex gap-2">
        <button onClick={() => setEditingProduct(p)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all">详细编辑</button>
        <button onClick={() => handleUpdate('products', data.products.filter(item => item.id !== p.id))} className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-red-600 rounded-xl transition-all"><Trash2 size={18}/></button>
      </div>
    </div>
  ))}
</div>
                 </>
               ) : (
                 <div className="space-y-10 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center border-b pb-6">
                      <h3 className="text-2xl font-bold text-gray-900">产品编辑：{t(editingProduct.name || { zh: '', en: '' })}</h3>
                      <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={32}/></button>
                    </div>

                    {/* 基础信息 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                       <div className="space-y-8">
                          <div className="space-y-4">
                            {/* ▼▼▼▼▼▼ 插入开始：产品系列选择器 ▼▼▼▼▼▼ */}
                            <div className="bg-blue-50 p-5 rounded-2xl mb-8 border border-blue-100">
                              <label className="block text-sm font-bold text-blue-800 uppercase mb-3">📂 所属系列 (多选)</label>
                              
                              {(!data.productSeries || data.productSeries.length === 0) ? (
                                <div className="text-gray-400 text-sm">暂无系列，请先在上方“全量产品库”顶部新增系列</div>
                              ) : (
                                <div className="flex flex-wrap gap-3">
                                  {data.productSeries.map(series => {
                                    // 检查当前产品是否已选中该系列
                                    const isSelected = (editingProduct.seriesIds || []).includes(series.id);
                                    
                                    return (
                                      <button
                                        key={series.id}
                                        onClick={() => {
                                          const currentIds = editingProduct.seriesIds || [];
                                          let newIds;
                                          if (isSelected) {
                                            // 如果已选，点击则取消
                                            newIds = currentIds.filter(id => id !== series.id);
                                          } else {
                                            // 如果未选，点击则添加
                                            newIds = [...currentIds, series.id];
                                          }
                                          setEditingProduct({ ...editingProduct, seriesIds: newIds });
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all flex items-center gap-2 ${
                                          isSelected 
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-blue-400'
                                        }`}
                                      >
                                        {isSelected ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />}
                                        {series.name.zh}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                            {/* ▲▲▲▲▲▲ 插入结束 ▲▲▲▲▲▲ */}
                             <label className="block text-sm font-bold text-gray-700 uppercase">基础信息 (双语)</label>
                             <div className="grid grid-cols-2 gap-4">
                               <input value={editingProduct.name?.zh || ''} onChange={e => setEditingProduct({...editingProduct, name: {...(editingProduct.name || {zh:'',en:''}), zh: e.target.value}})} className="w-full p-4 border rounded-2xl outline-none focus:border-blue-500 shadow-sm" placeholder="产品名 (中)" />
                               <input value={editingProduct.name?.en || ''} onChange={e => setEditingProduct({...editingProduct, name: {...(editingProduct.name || {zh:'',en:''}), en: e.target.value}})} className="w-full p-4 border rounded-2xl outline-none focus:border-blue-500 shadow-sm" placeholder="Name (EN)" />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <SmartTextarea value={editingProduct.desc?.zh || ''} onChange={e => setEditingProduct({...editingProduct, desc: {...(editingProduct.desc || {zh:'',en:''}), zh: e.target.value}})} className="w-full p-4 border rounded-2xl outline-none focus:border-blue-500 shadow-sm" placeholder="简介 (中)" rows={4} />
                               <SmartTextarea value={editingProduct.desc?.en || ''} onChange={e => setEditingProduct({...editingProduct, desc: {...(editingProduct.desc || {zh:'',en:''}), en: e.target.value}})} className="w-full p-4 border rounded-2xl outline-none focus:border-blue-500 shadow-sm" placeholder="Desc (EN)" rows={4} />
                             </div>
                          </div>
                          
                          <div className="space-y-4">
                             <label className="block text-sm font-bold text-gray-700 uppercase">特征选项 (顶部3卡片)</label>
                             <button onClick={() => setEditingProduct({...editingProduct, features: [...(editingProduct.features || []), { id: Date.now().toString(), title: { zh: '', en: '' }, content: { zh: '', en: '' } }]})} className="text-sm text-blue-600 mb-2">+ 添加特征</button>
                             {(editingProduct.features || []).map((f, idx) => (
                               <div key={f.id || idx} className="p-4 bg-gray-50 rounded-2xl border space-y-2 relative">
                                  <button onClick={() => setEditingProduct({...editingProduct, features: editingProduct.features.filter((_, i) => i !== idx)})} className="absolute top-2 right-2 text-red-400"><Trash2 size={16}/></button>
                                  <div className="flex items-center gap-2 mb-2">
                                     <List size={16} className="text-blue-600"/>
                                     <input value={f.title?.zh || ''} onChange={e => { const nfs = [...editingProduct.features]; nfs[idx].title.zh = e.target.value; setEditingProduct({...editingProduct, features: nfs}); }} className="bg-transparent border-b font-bold w-1/3" placeholder="标题(中)" />
                                     <input value={f.title?.en || ''} onChange={e => { const nfs = [...editingProduct.features]; nfs[idx].title.en = e.target.value; setEditingProduct({...editingProduct, features: nfs}); }} className="bg-transparent border-b font-bold w-1/3" placeholder="Title(EN)" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <SmartTextarea value={f.content?.zh || ''} onChange={e => { const nfs = [...editingProduct.features]; nfs[idx].content.zh = e.target.value; setEditingProduct({...editingProduct, features: nfs}); }} className="w-full p-2 bg-white rounded-lg border text-sm" rows={2} placeholder="内容(中)" />
                                    <SmartTextarea value={f.content?.en || ''} onChange={e => { const nfs = [...editingProduct.features]; nfs[idx].content.en = e.target.value; setEditingProduct({...editingProduct, features: nfs}); }} className="w-full p-2 bg-white rounded-lg border text-sm" rows={2} placeholder="Content(EN)" />
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-8">
                          <div className="space-y-4">
                             <label className="block text-sm font-bold text-gray-700 uppercase">图片管理</label>
                             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border">
                                <img src={editingProduct.image} className="w-20 h-20 object-cover rounded-xl border shadow-sm" />
                                <label className="bg-white px-4 py-2 border rounded-xl cursor-pointer text-xs font-bold hover:bg-gray-100 transition-all">
                                   更改主图
                                   <input type="file" className="hidden" accept="image/*" onChange={e => simulateUpload(e, url => setEditingProduct({...editingProduct, image: url}))} />
                                </label>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">图库 ({editingProduct.images?.length || 0})</label>
                             <div className="grid grid-cols-4 gap-4">
                                {(editingProduct.images || []).map((img, idx) => (
                                  <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border bg-gray-50">
                                     <img src={img} className="w-full h-full object-cover" />
                                     <button onClick={() => setEditingProduct({...editingProduct, images: editingProduct.images.filter((_, i) => i !== idx)})} className="absolute top-2 right-2 bg-white/90 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 shadow-sm transition-all"><Trash2 size={12}/></button>
                                  </div>
                                ))}
                                <label className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-300 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-all">
                                  <Plus size={32}/>
                                  <input type="file" className="hidden" accept="image/*" onChange={e => simulateUpload(e, url => setEditingProduct({...editingProduct, images: [...(editingProduct.images || []), url]}))} />
                                </label>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* --- 质量指标管理 (升级版：支持 简单表格/自定义多列/图片) --- */}
                    <div className="pt-10 border-t border-gray-100 space-y-6">
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-4">
                              <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2"><List size={20}/> 质量标准展示</h4>
                              <div className="flex bg-gray-100 p-1 rounded-lg">
                                 <button onClick={() => setEditingProduct({...editingProduct, standardsType: 'simple'})} className={`px-4 py-1 rounded-md text-sm font-bold transition-all ${(!editingProduct.standardsType || editingProduct.standardsType === 'simple') ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>简单两列</button>
                                 <button onClick={() => setEditingProduct({...editingProduct, standardsType: 'custom_table'})} className={`px-4 py-1 rounded-md text-sm font-bold transition-all ${editingProduct.standardsType === 'custom_table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>自定义多列</button>
                                 <button onClick={() => setEditingProduct({...editingProduct, standardsType: 'image'})} className={`px-4 py-1 rounded-md text-sm font-bold transition-all ${editingProduct.standardsType === 'image' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>图片</button>
                              </div>
                           </div>
                           {/* 只有简单模式才显示这个旧按钮 */}
                           {(!editingProduct.standardsType || editingProduct.standardsType === 'simple') && (
                              <button onClick={() => setEditingProduct({...editingProduct, standards: [...(editingProduct.standards || []), { name: { zh: '', en: '' }, value: '' }]})} className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100">+ 添加行</button>
                           )}
                        </div>
                        
                        {/* 模式 A: 简单两列 (旧) */}
                        {(!editingProduct.standardsType || editingProduct.standardsType === 'simple') && (
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-300">
                              <div className="space-y-3 bg-gray-50 p-6 rounded-2xl border">
                                 {(editingProduct.standards || []).map((std, idx) => (
                                    <div key={idx} className="flex gap-3 items-center">
                                       <input value={std.name?.zh || ''} onChange={e => { const ns = [...(editingProduct.standards || [])]; ns[idx].name.zh = e.target.value; setEditingProduct({...editingProduct, standards: ns}); }} className="flex-1 p-2 rounded-lg border text-sm" placeholder="指标名(中)" />
                                       <input value={std.name?.en || ''} onChange={e => { const ns = [...(editingProduct.standards || [])]; ns[idx].name.en = e.target.value; setEditingProduct({...editingProduct, standards: ns}); }} className="flex-1 p-2 rounded-lg border text-sm" placeholder="Name(EN)" />
                                       <input value={std.value || ''} onChange={e => { const ns = [...(editingProduct.standards || [])]; ns[idx].value = e.target.value; setEditingProduct({...editingProduct, standards: ns}); }} className="w-24 p-2 rounded-lg border text-sm font-mono text-blue-600 font-bold" placeholder="值" />
                                       <button onClick={() => setEditingProduct({...editingProduct, standards: editingProduct.standards?.filter((_, i) => i !== idx)})} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                                    </div>
                                 ))}
                                 {(!editingProduct.standards || editingProduct.standards.length === 0) && <p className="text-gray-400 text-sm text-center">暂无指标</p>}
                              </div>
                           </div>
                        )}

                        {/* 模式 B: 自定义多列 (新) */}
                        {editingProduct.standardsType === 'custom_table' && (
                           <div className="animate-in fade-in zoom-in duration-300">
                             <TableEditor 
                               data={editingProduct.standardsTable || { columns: [], rows: [] }} 
                               onChange={newData => setEditingProduct({ ...editingProduct, standardsTable: newData })} 
                             />
                           </div>
                        )}

                        {/* 模式 C: 图片 */}
                        {editingProduct.standardsType === 'image' && (
                           <div className="bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-300 text-center animate-in fade-in zoom-in duration-300">
                              <label className="block text-sm font-bold text-gray-500 uppercase mb-4">上传质量标准图片</label>
                              {editingProduct.standardsImage ? (
                                 <div className="relative inline-block group">
                                    <img src={editingProduct.standardsImage} className="max-h-64 rounded-xl shadow-md border" />
                                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold cursor-pointer transition-all rounded-xl">
                                       更换图片 <input type="file" className="hidden" accept="image/*" onChange={e => simulateUpload(e, url => setEditingProduct({...editingProduct, standardsImage: url}))} />
                                    </label>
                                 </div>
                              ) : (
                                 <label className="inline-flex flex-col items-center justify-center w-64 h-40 bg-white border-2 border-dashed border-blue-200 rounded-2xl cursor-pointer hover:bg-blue-50">
                                    <ImageIcon size={32} className="text-blue-400 mb-2"/>
                                    <span className="text-sm font-bold text-blue-600">点击上传图片</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={e => simulateUpload(e, url => setEditingProduct({...editingProduct, standardsImage: url}))} />
                                 </label>
                              )}
                           </div>
                        )}
                        
                        {/* 底部说明文案 (通用) */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                             <label className="block text-sm font-bold text-gray-500 uppercase">表格右侧说明文案</label>
                             <SmartTextarea value={editingProduct.standardsDesc?.zh || ''} onChange={e => setEditingProduct({...editingProduct, standardsDesc: {...(editingProduct.standardsDesc || { zh: '', en: '' }), zh: e.target.value}})} className="w-full p-4 border rounded-2xl" placeholder="说明 (中文)" rows={2} />
                             <SmartTextarea value={editingProduct.standardsDesc?.en || ''} onChange={e => setEditingProduct({...editingProduct, standardsDesc: {...(editingProduct.standardsDesc || { zh: '', en: '' }), en: e.target.value}})} className="w-full p-4 border rounded-2xl" placeholder="Desc (EN)" rows={2} />
                        </div>
                    </div>

                    {/* --- 深度详情板块 (升级版：支持 图文/表格) --- */}
                    <div className="pt-10 border-t border-gray-100 space-y-6">
                        <div className="flex justify-between items-center">
                           <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Layers size={20}/> 深度详情板块 (混合排版)</h4>
                           <div className="flex gap-2">
                             <button onClick={() => setEditingProduct({...editingProduct, detailBlocks: [...(editingProduct.detailBlocks || []), { id: `b${Date.now()}`, type: 'text_image', title: { zh: '', en: '' }, content: { zh: '', en: '' }, image: 'https://via.placeholder.com/800x600' }]})} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100">+ 添加 图文板块</button>
                             <button onClick={() => setEditingProduct({...editingProduct, detailBlocks: [...(editingProduct.detailBlocks || []), { id: `b${Date.now()}`, type: 'table', tableData: { columns: [], rows: [] } }]})} className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100">+ 添加 表格板块</button>
                           </div>
                        </div>

                        <div className="space-y-6">
                           {(editingProduct.detailBlocks || []).map((block, idx) => (
                              <div key={block.id} className="bg-white border p-6 rounded-2xl shadow-sm relative group">
                                 {/* 顶部工具条 */}
                                 <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                       {block.type === 'table' ? <Grid size={12}/> : <Type size={12}/>} 
                                       板块 {idx + 1}: {block.type === 'table' ? '表格模式' : '图文模式'}
                                    </span>
                                    <button onClick={() => setEditingProduct({...editingProduct, detailBlocks: editingProduct.detailBlocks?.filter(b => b.id !== block.id)})} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                                 </div>

                                 {/* 类型 A: 图文编辑 */}
                                 {(!block.type || block.type === 'text_image') && (
                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-3">
                                           <label className="text-xs font-bold text-gray-400 uppercase">配图</label>
                                           <div className="relative aspect-video bg-gray-50 rounded-xl overflow-hidden border">
                                              <img src={block.image} className="w-full h-full object-cover" />
                                              <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 cursor-pointer font-bold transition-opacity">
                                                 更换 <input type="file" className="hidden" accept="image/*" onChange={e => simulateUpload(e, url => { const nbs = [...(editingProduct.detailBlocks || [])]; nbs[idx].image = url; setEditingProduct({...editingProduct, detailBlocks: nbs}); })} />
                                              </label>
                                           </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                           <div className="grid grid-cols-2 gap-4">
                                              <input value={block.title?.zh || ''} onChange={e => { const nbs = [...(editingProduct.detailBlocks || [])]; nbs[idx].title = {...(nbs[idx].title || {zh:'',en:''}), zh: e.target.value}; setEditingProduct({...editingProduct, detailBlocks: nbs}); }} className="p-3 border rounded-xl font-bold" placeholder="标题(中)" />
                                              <input value={block.title?.en || ''} onChange={e => { const nbs = [...(editingProduct.detailBlocks || [])]; nbs[idx].title = {...(nbs[idx].title || {zh:'',en:''}), en: e.target.value}; setEditingProduct({...editingProduct, detailBlocks: nbs}); }} className="p-3 border rounded-xl font-bold" placeholder="Title(EN)" />
                                           </div>
                                           <div className="grid grid-cols-2 gap-4">
                                              <SmartTextarea value={block.content?.zh || ''} onChange={e => { const nbs = [...(editingProduct.detailBlocks || [])]; nbs[idx].content = {...(nbs[idx].content || {zh:'',en:''}), zh: e.target.value}; setEditingProduct({...editingProduct, detailBlocks: nbs}); }} className="p-3 border rounded-xl" rows={3} placeholder="内容(中)" />
                                              <SmartTextarea value={block.content?.en || ''} onChange={e => { const nbs = [...(editingProduct.detailBlocks || [])]; nbs[idx].content = {...(nbs[idx].content || {zh:'',en:''}), en: e.target.value}; setEditingProduct({...editingProduct, detailBlocks: nbs}); }} className="p-3 border rounded-xl" rows={3} placeholder="Content(EN)" />
                                           </div>
                                        </div>
                                     </div>
                                 )}

                                 {/* 类型 B: 表格编辑 (升级版：加入文字录入) */}
                                 {block.type === 'table' && (
                                     <div className="space-y-6 animate-in fade-in">
                                        {/* 1. 先录入文字信息 */}
                                        <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
                                           <label className="text-xs font-bold text-gray-400 uppercase">表格配套文案</label>
                                           <div className="grid grid-cols-2 gap-4">
                                              <input value={block.title?.zh || ''} onChange={e => { const nbs = [...(editingProduct.detailBlocks || [])]; nbs[idx].title = {...(nbs[idx].title || {zh:'',en:''}), zh: e.target.value}; setEditingProduct({...editingProduct, detailBlocks: nbs}); }} className="p-3 border rounded-xl font-bold" placeholder="表格标题 (中)" />
                                              <input value={block.title?.en || ''} onChange={e => { const nbs = [...(editingProduct.detailBlocks || [])]; nbs[idx].title = {...(nbs[idx].title || {zh:'',en:''}), en: e.target.value}; setEditingProduct({...editingProduct, detailBlocks: nbs}); }} className="p-3 border rounded-xl font-bold" placeholder="Table Title (EN)" />
                                           </div>
                                           <div className="grid grid-cols-2 gap-4">
                                              <SmartTextarea value={block.content?.zh || ''} onChange={e => { const nbs = [...(editingProduct.detailBlocks || [])]; nbs[idx].content = {...(nbs[idx].content || {zh:'',en:''}), zh: e.target.value}; setEditingProduct({...editingProduct, detailBlocks: nbs}); }} className="p-3 border rounded-xl" rows={3} placeholder="表格描述 (中)" />
                                              <SmartTextarea value={block.content?.en || ''} onChange={e => { const nbs = [...(editingProduct.detailBlocks || [])]; nbs[idx].content = {...(nbs[idx].content || {zh:'',en:''}), en: e.target.value}; setEditingProduct({...editingProduct, detailBlocks: nbs}); }} className="p-3 border rounded-xl" rows={3} placeholder="Table Desc (EN)" />
                                           </div>
                                        </div>

                                        {/* 2. 再编辑表格数据 */}
                                        <TableEditor 
                                            data={block.tableData || { columns: [], rows: [] }}
                                            onChange={newData => {
                                                const nbs = [...(editingProduct.detailBlocks || [])];
                                                nbs[idx].tableData = newData;
                                                setEditingProduct({...editingProduct, detailBlocks: nbs});
                                            }}
                                        />
                                     </div>
                                 )}
                              </div>
                           ))}
                           {(!editingProduct.detailBlocks || editingProduct.detailBlocks.length === 0) && <p className="text-center text-gray-400 py-8 border-2 border-dashed rounded-2xl">暂无详情板块</p>}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-10 border-t">
                       <button onClick={() => {
                          const ns = data.products.some(p=>p.id===editingProduct.id) 
                            ? data.products.map(p=>p.id===editingProduct.id?editingProduct:p) 
                            : [editingProduct, ...data.products];
                          handleUpdate('products', ns);
                          setEditingProduct(null);
                       }} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:bg-blue-700 transition-all"><CheckCircle size={24}/> 完成并保存</button>
                       <button onClick={() => setEditingProduct(null)} className="px-10 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all">取消编辑</button>
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* 5. 新闻动态 - 恢复修改功能 */}
          {activeTab === 'news' && (
            <div className="space-y-8">
               {!editingNews ? (
                 <>
                   <div className="flex justify-between items-center mb-8">
                     <h3 className="text-xl font-bold text-gray-900 border-l-4 border-blue-500 pl-3">新闻库管理</h3>
                     <button onClick={() => setEditingNews({ id: Date.now().toString(), title: { zh: '', en: '' }, date: new Date().toISOString().split('T')[0], image: 'https://via.placeholder.com/800x500', summary: { zh: '', en: '' }, content: { zh: '', en: '' } })} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700"><Plus size={20}/> 发布新文章</button>
                   </div>
                   <div className="space-y-4">
                      {data.news.map((n, i) => (
                        <div key={n.id} className="flex gap-6 p-4 border rounded-2xl hover:border-blue-200 transition-all bg-white items-center shadow-sm">
                           <img src={n.image} className="w-32 h-20 rounded-xl object-cover border" />
                           <div className="flex-grow">
                              <h4 className="font-bold text-gray-900 truncate max-w-md">{t(n.title)}</h4>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{n.date}</p>
                           </div>
                           <div className="flex gap-2">
                             <button onClick={() => setEditingNews(n)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Edit2 size={18}/></button>
                             <button onClick={() => handleUpdate('news', data.news.filter(item => item.id !== n.id))} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                           </div>
                        </div>
                      ))}
                   </div>
                 </>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-2xl font-bold text-gray-900">文章编辑：{editingNews.title.zh || '未命名'}</h3>
                <button onClick={() => setEditingNews(null)} className="text-gray-400 hover:text-red-500"><X size={30}/></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">文章标题 (双语)</label>
                      <input value={editingNews.title.zh} onChange={e => setEditingNews({...editingNews, title: {...editingNews.title, zh: e.target.value}})} className="w-full p-4 mb-2 border rounded-2xl outline-none focus:border-blue-500" placeholder="标题 (中)" />
                      <input value={editingNews.title.en} onChange={e => setEditingNews({...editingNews, title: {...editingNews.title, en: e.target.value}})} className="w-full p-4 border rounded-2xl outline-none focus:border-blue-500" placeholder="Title (EN)" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">发布摘要 (双语)</label>
                      <SmartTextarea 
                        value={editingNews.summary.zh} 
                        onChange={e => setEditingNews({...editingNews, summary: {...editingNews.summary, zh: e.target.value}})} 
                        className="w-full p-4 mb-2 border rounded-2xl outline-none focus:border-blue-500" 
                        rows={3} 
                        placeholder="摘要 (中)" 
                      />
                      <SmartTextarea 
                        value={editingNews.summary.en} 
                        onChange={e => setEditingNews({...editingNews, summary: {...editingNews.summary, en: e.target.value}})} 
                        className="w-full p-4 border rounded-2xl outline-none focus:border-blue-500" 
                        rows={3} 
                        placeholder="Summary (EN)" 
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="block text-sm font-bold text-gray-500">封面图片</label>
                    <div className="relative aspect-video rounded-3xl overflow-hidden border bg-gray-50 shadow-sm">
                      <img src={editingNews.image} className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer font-bold">
                        更换图片 <input type="file" className="hidden" accept="image/*" onChange={e => simulateUpload(e, url => setEditingNews({...editingNews, image: url}))} />
                      </label>
                    </div>
                    <input type="date" value={editingNews.date} onChange={e => setEditingNews({...editingNews, date: e.target.value})} className="w-full p-4 border rounded-2xl outline-none" />
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SmartTextarea 
                  value={editingNews.content.zh} 
                  onChange={e => setEditingNews({...editingNews, content: {...editingNews.content, zh: e.target.value}})} 
                  className="w-full p-6 border rounded-3xl outline-none focus:border-blue-500 min-h-[300px]" 
                  placeholder="详细新闻正文内容 (中文)..." 
                />
                <SmartTextarea 
                  value={editingNews.content.en} 
                  onChange={e => setEditingNews({...editingNews, content: {...editingNews.content, en: e.target.value}})} 
                  className="w-full p-6 border rounded-3xl outline-none focus:border-blue-500 min-h-[300px]" 
                  placeholder="Detailed News Content (EN)..." 
                />
              </div>

              <button onClick={() => {
                  const ns = data.news.some(n=>n.id===editingNews.id) ? data.news.map(n=>n.id===editingNews.id?editingNews:n) : [editingNews, ...data.news];
                  handleUpdate('news', ns);
                  setEditingNews(null);
              }} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all"><CheckCircle size={24}/> 确认并发布</button>
            </div>
          )}
            </div>
          )}

          {/* 6. 联系方式 - 双语版 */}
          {activeTab === 'contact' && (
            <div className="space-y-12 max-w-4xl">
               <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><MapPin size={16}/> 企业地址</label>
                    <div className="grid grid-cols-2 gap-4">
                        <input value={data.contact.address.zh} onChange={e => handleUpdate('contact.address.zh', e.target.value)} className="w-full p-4 border rounded-2xl bg-gray-50 focus:bg-white outline-none focus:border-blue-500 transition-all" placeholder="地址 (中)" />
                        <input value={data.contact.address.en} onChange={e => handleUpdate('contact.address.en', e.target.value)} className="w-full p-4 border rounded-2xl bg-gray-50 focus:bg-white outline-none focus:border-blue-500 transition-all" placeholder="Address (EN)" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Phone size={16}/> 服务热线</label>
                    <div className="grid grid-cols-2 gap-4">
                        <input value={data.contact.phone.zh} onChange={e => handleUpdate('contact.phone.zh', e.target.value)} className="w-full p-4 border rounded-2xl bg-gray-50 focus:bg-white outline-none focus:border-blue-500 transition-all" placeholder="电话 (中)" />
                        <input value={data.contact.phone.en} onChange={e => handleUpdate('contact.phone.en', e.target.value)} className="w-full p-4 border rounded-2xl bg-gray-50 focus:bg-white outline-none focus:border-blue-500 transition-all" placeholder="Phone (EN)" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Printer size={16}/> 商务传真</label>
                    <div className="grid grid-cols-2 gap-4">
                        <input value={data.contact.fax.zh} onChange={e => handleUpdate('contact.fax.zh', e.target.value)} className="w-full p-4 border rounded-2xl bg-gray-50 focus:bg-white outline-none focus:border-blue-500 transition-all" placeholder="传真 (中)" />
                        <input value={data.contact.fax.en} onChange={e => handleUpdate('contact.fax.en', e.target.value)} className="w-full p-4 border rounded-2xl bg-gray-50 focus:bg-white outline-none focus:border-blue-500 transition-all" placeholder="Fax (EN)" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Mail size={16}/> 官方邮箱</label>
                    <div className="grid grid-cols-2 gap-4">
                        <input value={data.contact.email.zh} onChange={e => handleUpdate('contact.email.zh', e.target.value)} className="w-full p-4 border rounded-2xl bg-gray-50 focus:bg-white outline-none focus:border-blue-500 transition-all" placeholder="邮箱 (中)" />
                        <input value={data.contact.email.en} onChange={e => handleUpdate('contact.email.en', e.target.value)} className="w-full p-4 border rounded-2xl bg-gray-50 focus:bg-white outline-none focus:border-blue-500 transition-all" placeholder="Email (EN)" />
                    </div>
                  </div>
               </div>
               <div className="space-y-3">
                 <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">地图内嵌 URL</label>
                 <input value={data.contact.mapUrl} onChange={e => handleUpdate('contact.mapUrl', e.target.value)} className="w-full p-4 border rounded-2xl bg-gray-50 outline-none focus:border-blue-500" placeholder="https://..." />
               </div>
            </div>
          )}

          {/* 7. 留言管理 */}
          {activeTab === 'messages' && (
            <div className="overflow-x-auto rounded-[40px] border border-gray-100 shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-6 border-b">日期</th>
                    <th className="p-6 border-b">访客</th>
                    <th className="p-6 border-b">联系方式</th>
                    <th className="p-6 border-b">详情需求内容</th>
                    <th className="p-6 border-b text-right">操作</th> {/* 新增操作列 */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {messages.map(msg => (
                    <tr key={msg.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="p-6 text-xs text-gray-400 group-hover:text-blue-600 font-bold">{msg.date}</td>
                      <td className="p-6 font-black text-gray-800">{msg.lastName}{msg.firstName}</td>
                      <td className="p-6 font-medium text-gray-500">
                         <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1"><Mail size={12}/> {msg.email}</span>
                            <span className="flex items-center gap-1"><Phone size={12}/> {msg.phone}</span>
                         </div>
                      </td>
                      <td className="p-6 text-gray-600 italic max-w-xs">
                         <div className="bg-white p-3 rounded-xl border-l-4 border-blue-500 shadow-sm whitespace-pre-wrap">
                            {msg.content}
                         </div>
                      </td>
                      {/* 新增删除按钮 */}
                      <td className="p-6 text-right">
                        <button 
                          onClick={() => {
                            if (window.confirm('确定要删除这条留言吗？')) {
                              deleteMessage(msg.id); // ✅ 正确：直接使用第一步解构出来的函数
                              showToast('留言已删除');
                            }
                          }}
                          className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                          title="删除留言"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-32 text-center text-gray-300 font-bold uppercase italic tracking-widest">暂无留言</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
