import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Save } from 'lucide-react';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../services/categoryService';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    vertical: 'RESIDENTIAL',
    intent: 'SALE',
    name: '',
    subCategories: []
  });

  const [newSubCategory, setNewSubCategory] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      vertical: 'RESIDENTIAL',
      intent: 'SALE',
      name: '',
      subCategories: []
    });
    setNewSubCategory('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      vertical: cat.vertical,
      intent: cat.intent,
      name: cat.name,
      subCategories: cat.subCategories || []
    });
    setNewSubCategory('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await deleteCategory(id);
      if (res.success) {
        fetchCategories();
      } else {
        alert(res.message || 'Failed to delete category');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting category');
    }
  };

  const handleAddSubCategory = (e) => {
    e.preventDefault();
    if (newSubCategory.trim() && !formData.subCategories.includes(newSubCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        subCategories: [...prev.subCategories, newSubCategory.trim()]
      }));
      setNewSubCategory('');
    }
  };

  const handleRemoveSubCategory = (idx) => {
    setFormData(prev => ({
      ...prev,
      subCategories: prev.subCategories.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Category Name is required');
    
    try {
      setModalLoading(true);
      if (editingCategory) {
        const res = await updateCategory(editingCategory._id, formData);
        if (res.success) {
          setIsModalOpen(false);
          fetchCategories();
        } else {
          alert(res.message);
        }
      } else {
        const res = await createCategory(formData);
        if (res.success) {
          setIsModalOpen(false);
          fetchCategories();
        } else {
          alert(res.message);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save category');
    } finally {
      setModalLoading(false);
    }
  };

  const groupedCategories = categories.reduce((acc, cat) => {
    if (!acc[cat.vertical]) acc[cat.vertical] = [];
    acc[cat.vertical].push(cat);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categories & Taxonomy</h1>
          <p className="text-sm text-slate-500 mt-1">Manage property verticals, intents, and their sub-categories.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-md flex items-center gap-2"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={40} className="animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {Object.keys(groupedCategories).map(vertical => (
            <div key={vertical} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                <h3 className="text-lg font-bold text-slate-800">{vertical}</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {groupedCategories[vertical].map(cat => (
                  <div key={cat._id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-md font-bold text-slate-900">{cat.name}</h4>
                        <span className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                          {cat.intent}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEditModal(cat)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(cat._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {cat.subCategories && cat.subCategories.length > 0 ? (
                        cat.subCategories.map((sub, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                            {sub}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No sub-categories defined</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full py-10 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
              No categories found. Create your first taxonomy rules.
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Vertical</label>
                  <select 
                    value={formData.vertical}
                    onChange={(e) => setFormData({...formData, vertical: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-primary-500"
                  >
                    <option value="RESIDENTIAL">RESIDENTIAL</option>
                    <option value="COMMERCIAL">COMMERCIAL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Intent</label>
                  <select 
                    value={formData.intent}
                    onChange={(e) => setFormData({...formData, intent: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-primary-500"
                  >
                    <option value="SALE">SALE</option>
                    <option value="RENT">RENT</option>
                    <option value="PURCHASE">PURCHASE</option>
                    <option value="WANTED_RENT">WANTED_RENT</option>
                    <option value="LEASE">LEASE</option>
                    <option value="WANTED_LEASE">WANTED_LEASE</option>
                    <option value="RENTALS">RENTALS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Category Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Residential Available for Sale"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Sub Categories (Types)</label>
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    placeholder="e.g. Apartments"
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-primary-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubCategory(e)}
                  />
                  <button 
                    type="button"
                    onClick={handleAddSubCategory}
                    className="px-4 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 min-h-[100px]">
                  <div className="flex flex-wrap gap-2">
                    {formData.subCategories.length > 0 ? (
                      formData.subCategories.map((sub, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                          {sub}
                          <button type="button" onClick={() => handleRemoveSubCategory(idx)} className="text-slate-400 hover:text-red-500 focus:outline-none">
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 font-medium">No sub-categories added yet.</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={modalLoading}
                  className="px-5 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-primary-700 flex items-center gap-2 disabled:opacity-70"
                >
                  {modalLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editingCategory ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
