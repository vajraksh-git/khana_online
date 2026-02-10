import { motion } from 'framer-motion';

export default function OrderReview({ combo, onPlaceOrder, onBack }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-md mx-auto">
            <button onClick={onBack} className="mb-4 self-start text-slate-400 font-bold text-sm hover:text-emerald-600">← Edit Tray</button>
            <h2 className="text-2xl font-bold mb-6">Review Order</h2>
            
            <div className="bg-white border p-6 rounded-3xl shadow-lg mb-6">
                <h3 className="font-bold text-emerald-600 text-lg">{combo.platter.name}</h3>
                <p className="text-sm text-slate-400 mb-4">Custom Curated Meal</p>
                <div className="space-y-3 text-sm font-bold text-slate-700">
                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg"><span className="text-xl">🍗</span> {combo.tray.slot1.name}</div>
                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg"><span className="text-xl">🥣</span> {combo.tray.slot2.name}</div>
                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg"><span className="text-xl">🍚</span> {combo.tray.slot3.name}</div>
                </div>
                <div className="border-t mt-4 pt-4 flex justify-between text-xl font-bold"><span>Total</span><span>₹{combo.platter.price}</span></div>
            </div>
            
            <button onClick={onPlaceOrder} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95">Proceed to Payment</button>
        </motion.div>
    );
}