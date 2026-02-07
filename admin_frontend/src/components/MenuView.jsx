import { useState, useEffect } from 'react';
import axios from 'axios';

function MenuView({ apiUrl }) {
    const [menu, setMenu] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: "", price: "", category: "", description: "" });
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = () => axios.get(`${apiUrl}/api/menu`).then(res => setMenu(res.data));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("category", formData.category);
        data.append("description", formData.description);
        if (file) data.append("image", file);

        try {
            const url = editingItem ? `${apiUrl}/api/admin/menu/${editingItem._id}` : `${apiUrl}/api/admin/menu`;
            const method = editingItem ? axios.put : axios.post;
            await method(url, data);
            
            setEditingItem(null);
            setFormData({ name: "", price: "", category: "", description: "" });
            setFile(null);
            fetchMenu();
            alert("Saved!");
        } catch (err) {
            alert("Error saving item");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Delete this?")) {
            await axios.delete(`${apiUrl}/api/admin/menu/${id}`);
            fetchMenu();
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({ name: item.name, price: item.price, category: item.category, description: item.description });
        window.scrollTo(0,0);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Editor Form */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-28">
                    <h2 className="font-bold text-xl text-slate-800 mb-1">{editingItem ? "Edit Dish ✏️" : "Add New Dish 🥗"}</h2>
                    <p className="text-slate-400 text-sm mb-6">Update your kitchen's offerings.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 focus:ring-2 focus:ring-emerald-400 font-bold text-slate-700" placeholder="Dish Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        <div className="grid grid-cols-2 gap-4">
                            <input className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 focus:ring-2 focus:ring-emerald-400 font-bold text-slate-700" type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                            <input className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 focus:ring-2 focus:ring-emerald-400 font-bold text-slate-700" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                        </div>
                        <textarea className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 focus:ring-2 focus:ring-emerald-400 text-sm text-slate-600" placeholder="Description..." rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        <div className="bg-slate-50 p-3 rounded-xl border-2 border-dashed border-slate-200 text-center relative hover:bg-emerald-50 transition-colors">
                            <input type="file" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onChange={e => setFile(e.target.files[0])} />
                            <span className="text-sm text-slate-400 font-bold">{file ? "✅ Photo Selected" : "📸 Upload Photo"}</span>
                        </div>
                        <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg transition-all">{editingItem ? "Update" : "Save Dish"}</button>
                        {editingItem && <button type="button" onClick={() => setEditingItem(null)} className="w-full mt-2 text-slate-400 text-xs font-bold">Cancel</button>}
                    </form>
                </div>
            </div>

            {/* Menu List */}
            <div className="lg:col-span-2 space-y-4">
                {menu.map(item => (
                    <div key={item._id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-5 items-center hover:shadow-md transition-shadow group">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <img src={item.image ? `${apiUrl}${item.image}` : "https://placehold.co/100"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-lg text-slate-800">{item.name}</h4>
                                <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-sm">₹{item.price}</span>
                            </div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-1">{item.category}</p>
                        </div>
                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(item)} className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100">✏️</button>
                            <button onClick={() => handleDelete(item._id)} className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100">🗑️</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MenuView;