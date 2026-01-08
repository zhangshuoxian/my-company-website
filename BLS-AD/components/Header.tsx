
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Globe, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { NavItem } from '../types';

const Header = () => {
  const { language, setLanguage, content, resolveAsset } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (content?.logo) {
      resolveAsset(content.logo).then(setLogoUrl);
    }
  }, [content?.logo, resolveAsset]);

  if (!content) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const toggleLang = () => setLanguage(language === 'CN' ? 'EN' : 'CN');

  const NestedDropdown = ({ items }: { items: NavItem[] }) => (
    <div className="absolute top-0 left-full bg-white shadow-lg rounded-r-md border-y border-r border-gray-100 w-48 py-2 invisible opacity-0 group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 z-50 flex flex-col">
      {items.map(child => (
        <div key={child.path} className="relative group/nested">
          <NavLink to={child.path} className="relative block px-6 py-3 text-sm text-gray-700 hover:text-brand-blue flex justify-between items-center z-10 transition-colors">
            <span>{child.label}</span>
            {child.children && <ChevronRight size={14} className="text-gray-400" />}
          </NavLink>
          {child.children && <NestedDropdown items={child.children} />}
        </div>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md border-t-4 border-brand-blue">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          <NavLink to="/" className="flex items-center shrink-0 h-full py-2 mr-4">
            {logoUrl && <img src={logoUrl} alt="Logo" className="h-full max-h-14 w-auto object-contain" />}
          </NavLink>

          <nav className="hidden lg:flex items-center justify-center flex-1 h-full">
            <div className="flex items-center justify-center h-full gap-1">
              {content.navItems.map((item) => (
                <div key={item.path} className="relative group h-full flex items-center justify-center">
                  <NavLink to={item.path} className={({ isActive }) => `px-4 text-lg font-bold uppercase hover:text-brand-blue transition-colors ${isActive ? 'text-brand-blue' : 'text-gray-700'}`}>
                    <span>{item.label}</span>
                    {item.children && <ChevronDown size={16} className="ml-1 inline" />}
                  </NavLink>
                  {item.children && (
                    <div className="absolute top-full left-0 bg-white shadow-lg border-t-2 border-brand-green w-56 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 flex flex-col">
                      {item.children.map(child => (
                        <div key={child.path} className="group/sub">
                          <NavLink to={child.path} className="block px-6 py-3 text-gray-700 hover:bg-brand-lightBlue hover:text-brand-blue flex justify-between items-center transition-colors">
                            <span>{child.label}</span>
                            {child.children && <ChevronRight size={16} className="text-gray-400" />}
                          </NavLink>
                          {child.children && <NestedDropdown items={child.children} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          <div className="hidden lg:flex items-center space-x-3">
            <form onSubmit={handleSearch} className="relative">
              <input type="text" placeholder={content.labels.searchPlaceholder} className="w-32 focus:w-48 transition-all pl-8 pr-3 py-1.5 text-sm border rounded-full bg-gray-50" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <Search size={15} className="absolute left-2.5 top-2.5 text-gray-500" />
            </form>
            <button onClick={toggleLang} className="flex items-center space-x-1 text-sm font-bold text-gray-600 border px-3 py-1.5 rounded-full hover:bg-gray-50">
              <Globe size={16} /><span>{language}</span>
            </button>
          </div>

          <button className="lg:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
