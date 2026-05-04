import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Image as ImageIcon, 
  Type, 
  Link as LinkIcon,
  Eye,
  GripVertical,
  CheckCircle2,
  AlertCircle,
  Zap,
  Loader2
} from 'lucide-react';
import Button from '../../broker/components/ui/Button';
import Card from '../../broker/components/ui/Card';
import Badge from '../../broker/components/ui/Badge';
import { getCarousels, createCarousel, updateCarousel, deleteCarousel, uploadImage } from '../services/carouselService';

const CarouselManagement = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'add'
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    category: '',
    link: ''
  });
  const [toast, setToast] = useState(null);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const result = await getCarousels();
      if (result.success) {
        setSlides(result.data);
      }
    } catch (error) {
      console.error('Fetch banners error:', error);
      showToast('Failed to fetch banners', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        const result = await uploadImage(file);
        if (result.success) {
          setFormData({ ...formData, image: result.url });
          showToast('Image uploaded successfully');
        } else {
          showToast('Upload failed', 'error');
        }
      } catch (error) {
        console.error('Upload error:', error);
        showToast('Upload failed', 'error');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (editingId) {
        result = await updateCarousel(editingId, formData);
        if (result.success) showToast('Banner updated successfully');
      } else {
        result = await createCarousel(formData);
        if (result.success) showToast('New banner deployed successfully');
      }

      if (result.success) {
        fetchBanners();
        resetForm();
        setActiveTab('list');
      }
    } catch (error) {
      console.error('Save error:', error);
      showToast('Failed to save banner', 'error');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', image: '', category: '', link: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const result = await deleteCarousel(id);
        if (result.success) {
          showToast('Banner removed', 'warning');
          fetchBanners();
        }
      } catch (error) {
        console.error('Delete error:', error);
        showToast('Delete failed', 'error');
      }
    }
  };

  const startEdit = (slide) => {
    setFormData({ 
      title: slide.title, 
      subtitle: slide.subtitle, 
      image: slide.image, 
      category: slide.category || slide.badge,
      link: slide.link || ''
    });
    setEditingId(slide._id);
    setActiveTab('add');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header & Tabs */}
      <div className="flex flex-col space-y-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">Carousel Studio</h1>
           <p className="text-slate-500 font-medium mt-1">Design and deploy high-impact visual narratives.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 w-fit rounded-2xl border border-slate-200/60 shadow-inner">
           <button 
             onClick={() => { setActiveTab('list'); resetForm(); }}
             className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'list' ? 'bg-white text-primary-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
           >
             All Carousel
           </button>
           <button 
             onClick={() => setActiveTab('add')}
             className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'add' ? 'bg-white text-primary-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
           >
             Add New
           </button>
        </div>
      </div>

      <div className="min-h-[500px]">
        {loading && activeTab === 'list' ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="text-primary-600 animate-spin" size={40} />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Fetching Studio Data...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'list' ? (
              <motion.div 
                 key="list"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="grid grid-cols-1 gap-6"
              >
                {slides.map((slide, index) => (
                  <Card key={slide._id} className="p-0 overflow-hidden border-none shadow-soft hover:shadow-xl transition-all duration-500 group">
                    <div className="flex flex-col md:flex-row">
                       <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden relative">
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                             <Eye className="text-white" size={32} />
                          </div>
                          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                       </div>
                       
                       <div className="flex-1 p-8 flex flex-col justify-between">
                          <div>
                             <div className="flex items-center justify-between mb-4">
                                <Badge className="bg-primary-50 text-primary-600 border-none font-black text-[9px] uppercase tracking-[0.2em] px-3 py-1.5">{slide.category}</Badge>
                                <div className="flex items-center gap-1">
                                   <button onClick={() => startEdit(slide)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Edit">
                                      <Edit3 size={18} />
                                   </button>
                                   <button onClick={() => handleDelete(slide._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Remove">
                                      <Trash2 size={18} />
                                   </button>
                                </div>
                             </div>
                             <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">{slide.title}</h3>
                             <p className="text-slate-500 font-medium text-sm leading-relaxed">{slide.subtitle}</p>
                          </div>
  
                          <div className="mt-8 flex items-center gap-6 pt-6 border-t border-slate-50">
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                   <GripVertical size={14} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority Index: 0{index + 1}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </Card>
                ))}
  
                {slides.length === 0 && (
                   <div className="py-20 text-center space-y-4 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-400">
                         <ImageIcon size={32} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900">Gallery Empty</h3>
                        <p className="text-slate-500 text-sm">Deploy your first banner to ignite the landing page.</p>
                      </div>
                      <Button variant="outline" onClick={() => setActiveTab('add')} className="rounded-xl font-bold">Launch Studio</Button>
                   </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                 key="add"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="max-w-4xl"
              >
                 <Card className="overflow-hidden rounded-[2.5rem] shadow-2xl border-none p-0">
                    <div className="bg-slate-950 p-10 flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-black text-white">{editingId ? 'Refine Banner' : 'Create New Banner'}</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Visual Studio Configuration</p>
                      </div>
                      {formData.image && (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl animate-in zoom-in duration-500">
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
  
                    <form onSubmit={handleSave} className="p-10 space-y-8 bg-white">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                <Type size={12} className="text-primary-500" /> Banner Headline
                             </label>
                             <input 
                                type="text" 
                                required 
                                placeholder="e.g. Luxury Sky Villas"
                                className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 focus:ring-8 focus:ring-primary-500/5 font-bold text-slate-900 transition-all font-sans" 
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                <Zap size={12} className="text-primary-500" /> Category Badge
                             </label>
                             <input 
                                type="text" 
                                required 
                                placeholder="e.g. Featured"
                                className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 focus:ring-8 focus:ring-primary-500/5 font-bold text-slate-900 transition-all font-sans" 
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                             />
                          </div>
                       </div>
  
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                <ImageIcon size={12} className="text-primary-500" /> Image Asset Source
                             </label>
                             <input 
                               type="file" 
                               ref={fileInputRef} 
                               className="hidden" 
                               accept="image/*"
                               onChange={handleFileUpload}
                             />
                             <div className="flex items-center gap-4">
                               {isUploading && <Loader2 className="animate-spin text-primary-600" size={14} />}
                               <button 
                                 type="button"
                                 onClick={() => fileInputRef.current.click()}
                                 className="text-[9px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 underline decoration-2 underline-offset-4 transition-all"
                               >
                                 {isUploading ? 'Uploading...' : 'Direct Upload From Local'}
                               </button>
                             </div>
                          </div>
                          <input 
                             type="url" 
                             required 
                             placeholder="Enter Image URL or Upload directly..."
                             className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 focus:ring-8 focus:ring-primary-500/5 font-bold text-slate-900 transition-all shadow-inner font-sans" 
                             value={formData.image}
                             onChange={e => setFormData({...formData, image: e.target.value})}
                          />
                       </div>
  
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                             <LinkIcon size={12} className="text-primary-500" /> Narrative Subtitle
                          </label>
                          <textarea 
                             rows="3" 
                             required 
                             placeholder="Describe the value proposition..."
                             className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-primary-100 focus:ring-8 focus:ring-primary-500/5 font-bold text-slate-900 resize-none transition-all font-sans" 
                             value={formData.subtitle}
                             onChange={e => setFormData({...formData, subtitle: e.target.value})}
                          />
                       </div>
  
                       <div className="pt-6 flex gap-6">
                          <Button type="button" variant="outline" onClick={() => { setActiveTab('list'); resetForm(); }} className="flex-1 rounded-[2rem] py-6 font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all">Cancel Project</Button>
                          <Button type="submit" className="flex-[2] rounded-[2rem] py-6 bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-900/20 active:scale-95 transition-all" leftIcon={<Save size={20} />}>
                             {editingId ? 'Seal Updates' : 'Deploy To Production'}
                          </Button>
                       </div>
                    </form>
                 </Card>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Professional Notification Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]"
          >
             <div className={`px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 ${toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-500 text-white'}`}>
                {toast.type === 'success' ? <CheckCircle2 className="text-emerald-400" size={24} /> : <AlertCircle size={24} />}
                <p className="text-sm font-black uppercase tracking-[0.2em]">{toast.message}</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarouselManagement;
