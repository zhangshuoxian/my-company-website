import React, { useState, useEffect } from 'react';
import { Section } from '../components/Section';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, MapPin, Printer, RefreshCw } from 'lucide-react';
import { Reveal } from '../components/Reveal'; // 引入动画

const Contact = () => {
  const { content, submitFeedback } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', country: '', company: '', message: '', captcha: ''
  });
  const [captchaCode, setCaptchaCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const generateCaptcha = () => {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.captcha.toUpperCase() !== captchaCode) {
        setStatus('error');
        setStatusMsg('Invalid Captcha');
        return;
    }

    const result = submitFeedback({
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        company: formData.company,
        message: formData.message,
        date: new Date().toLocaleString()
    });

    if (result.success) {
        setStatus('success');
        setStatusMsg(content.labels.formSuccess);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', country: '', company: '', message: '', captcha: '' });
        generateCaptcha();
    } else {
        setStatus('error');
        setStatusMsg(result.message); 
    }
  };

  const scrollToForm = () => {
      const form = document.getElementById('contact-form');
      if (form) {
          form.scrollIntoView({ behavior: 'smooth' });
      }
  };

  // 动画方向计算
  const getAnimDir = (idx: number, cols: number) => {
    const pos = idx % cols;
    if (pos === 0) return 'left';
    if (pos === cols - 1) return 'right';
    return 'bottom';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. Main Company Info */}
      <Section className="bg-white">
         <Reveal direction="top"><h1 className="text-4xl font-bold text-center text-brand-blue mb-12">{content.contact.companyName}</h1></Reveal>
         <div className="flex flex-col lg:flex-row gap-12 items-start max-w-6xl mx-auto">
             <Reveal direction="left" className="w-full lg:w-1/2 h-80 rounded-xl overflow-hidden shadow-lg">
                 <img src={content.contact.image} alt="Company" className="w-full h-full object-cover" />
             </Reveal>
             
             <Reveal direction="right" className="w-full lg:w-1/2 space-y-6 text-gray-700">
                 <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                     <h3 className="font-bold text-xl mb-4 border-b pb-2">Headquarters</h3>
                     <p className="flex items-start mb-2"><MapPin className="mr-2 text-brand-green shrink-0" size={20}/> <span>{content.labels.contactAddress}: {content.contact.address}</span></p>
                     <p className="flex items-center ml-7 mb-4 text-sm text-gray-500"><span className="font-bold mr-1">{content.labels.contactZip}:</span> {content.contact.zip}</p>
                     
                     <p className="flex items-start mb-2"><MapPin className="mr-2 text-brand-blue shrink-0" size={20}/> <span>{content.labels.contactFactory}: {content.contact.factoryAddress}</span></p>
                     <p className="flex items-center ml-7 text-sm text-gray-500"><span className="font-bold mr-1">{content.labels.contactFactoryZip}:</span> {content.contact.factoryZip}</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="flex items-center p-4 bg-brand-lightBlue/30 rounded-lg">
                         <Phone className="mr-3 text-brand-blue" size={24}/>
                         <div>
                             <div className="text-xs text-gray-500 font-bold uppercase">{content.labels.contactPhone}</div>
                             <div className="font-bold">{content.contact.phone}</div>
                         </div>
                     </div>
                     <div className="flex items-center p-4 bg-brand-lightBlue/30 rounded-lg">
                         <Printer className="mr-3 text-brand-blue" size={24}/>
                         <div>
                             <div className="text-xs text-gray-500 font-bold uppercase">{content.labels.contactFax}</div>
                             <div className="font-bold">{content.contact.fax}</div>
                         </div>
                     </div>
                     <div className="flex items-center p-4 bg-brand-lightBlue/30 rounded-lg md:col-span-2">
                         <Mail className="mr-3 text-brand-blue" size={24}/>
                         <div>
                             <div className="text-xs text-gray-500 font-bold uppercase">{content.labels.contactEmail}</div>
                             <div className="font-bold text-brand-blue">{content.contact.email}</div>
                         </div>
                     </div>
                 </div>
             </Reveal>
         </div>
      </Section>

      {/* 2. Branches (3列布局动画) */}
      <Section className="bg-gray-100">
          <Reveal direction="top"><h2 className="text-3xl font-bold text-center mb-12">Subsidiaries & Branches</h2></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {content.branches.map((branch, idx) => (
                  <Reveal key={branch.id} direction={getAnimDir(idx, 3)} delay={idx * 100}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                        <div className="h-48 overflow-hidden">
                            <img src={branch.image} alt={branch.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"/>
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold text-brand-blue mb-3">{branch.name}</h3>
                            <div className="space-y-2 text-sm text-gray-600 flex-grow">
                                <p className="flex items-start"><MapPin size={16} className="mr-2 mt-0.5 shrink-0"/> {branch.address}</p>
                                <p className="flex items-center"><Phone size={16} className="mr-2 shrink-0"/> {branch.phone}</p>
                                <p className="flex items-center"><Printer size={16} className="mr-2 shrink-0"/> {branch.fax}</p>
                            </div>
                            <button onClick={scrollToForm} className="mt-4 block w-full text-center bg-brand-green text-white py-2 rounded-lg font-bold hover:bg-brand-darkGreen transition-colors">
                                {content.labels.contactBranchBtn}
                            </button>
                        </div>
                    </div>
                  </Reveal>
              ))}
          </div>
      </Section>

      {/* 3. Contact Form */}
      <Section className="bg-white" id="contact-form">
          <Reveal direction="bottom">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Get In Touch</h2>
                
                {status === 'success' ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded text-center">
                        <p className="font-bold text-lg">{statusMsg}</p>
                        <button onClick={() => setStatus('idle')} className="mt-4 text-sm underline">Send another message</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{content.labels.formFirstName} <span className="text-red-500">*</span></label>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{content.labels.formLastName} <span className="text-red-500">*</span></label>
                                <input name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{content.labels.formEmail} <span className="text-red-500">*</span></label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{content.labels.formPhone} <span className="text-red-500">*</span></label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{content.labels.formCountry} <span className="text-red-500">*</span></label>
                                <input name="country" value={formData.country} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">{content.labels.formCompany} <span className="text-red-500">*</span></label>
                                <input name="company" value={formData.company} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{content.labels.formMessage}</label>
                            <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"></textarea>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex-grow w-full">
                                <label className="block text-sm font-bold text-gray-700 mb-1">{content.labels.formCaptcha} <span className="text-red-500">*</span></label>
                                <input name="captcha" value={formData.captcha} onChange={handleChange} required className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" />
                            </div>
                            <div className="flex items-center space-x-2 mt-6 md:mt-0">
                                <div className="bg-gray-200 px-4 py-3 rounded font-mono font-bold text-xl tracking-widest select-none bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-400">
                                    {captchaCode}
                                </div>
                                <button type="button" onClick={generateCaptcha} className="text-gray-600 hover:text-brand-blue p-2 rounded-full hover:bg-gray-200 transition-colors">
                                    <RefreshCw size={20} />
                                </button>
                            </div>
                        </div>

                        {status === 'error' && <div className="text-red-600 font-bold text-center bg-red-50 p-2 rounded">{statusMsg}</div>}

                        <button type="submit" className="w-full bg-brand-blue text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg">
                            {content.labels.formSubmit}
                        </button>
                    </form>
                )}
            </div>
          </Reveal>
      </Section>
    </div>
  );
};

export default Contact;