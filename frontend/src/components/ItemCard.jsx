function ItemCard({ item, addToCart }) {
  return (
    <div className="animate-card bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex gap-4 group cursor-default">
      {/* Image with subtle zoom on hover */}
      <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl">
        <img 
          src={item.image || "https://placehold.co/200"} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-800 leading-tight">{item.name}</h3>
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{item.description}</p>
        </div>
        
        <div className="flex justify-between items-end mt-2">
          <span className="font-bold text-gray-900 text-lg">₹{item.price}</span>
          
          <button 
            onClick={() => addToCart(item)}
            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            ADD +
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;