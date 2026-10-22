import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../stores/cartStore'

interface Product {
  id: string
  name: string
  material: string
  store: string
  description: string
  category_id: number
  pieces_per_carton: number
  carton_price: number
  image_url: string
  colors: string
  types: { name_ar: string }
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop'
]

const categories = [
  { id: 0, name: 'الكل' },
  { id: 1, name: 'رجالي' },
  { id: 2, name: 'نسائي / شبابي' },
  { id: 3, name: 'ولادي' },
  { id: 4, name: 'بيبي' }
]

export default function Catalog() {
  const { store } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(0)

  const isNawras = store === 'nawras'
  const storeName = isNawras ? 'Nawras' : 'Kajjoun'

  // شلنا سطر addItem من هون عشان نصلح الخطأ
  const itemsCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0))
  
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*, types(name_ar)')
        .eq('store', store)

      if (error) console.error('Error fetching:', error)
      else setProducts(data || [])
      setLoading(false)
    }
    fetchProducts()
  }, [store])

  const filteredProducts = activeCategory === 0 
    ? products 
    : products.filter(p => p.category_id === activeCategory)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SY').format(price)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black font-sans">
      
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors flex items-center gap-2">
            <span>←</span> العودة
          </Link>
          
          <h1 className="text-3xl font-sport text-black uppercase tracking-widest italic">
            {storeName}
          </h1>
          
          <Link to="/cart" className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
            <span>السلة 🛒</span>
            <span className="bg-white text-black text-xs px-2 py-0.5 rounded-full">{itemsCount}</span>
          </Link>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-4 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap border-2 ${
                activeCategory === cat.id 
                  ? 'bg-black text-white border-black' 
                  : 'bg-transparent text-gray-500 border-gray-200 hover:border-black hover:text-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-12 px-6">
        {loading ? (
          <div className="flex justify-center py-40">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-40">
            <h2 className="text-5xl font-sport uppercase text-gray-300 mb-4">لا توجد منتجات</h2>
            <p className="text-gray-500 font-bold">لم نجد منتجات في هذا التصنيف حالياً.</p>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-12">
            <AnimatePresence>
              {filteredProducts.map((p, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={p.id} 
                  className="group cursor-pointer flex flex-col bg-white shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                  <Link to={`/product/${p.id}`} className="block">
                    <div className="h-[350px] flex items-center justify-center relative overflow-hidden bg-[#f5f5f5]">
                       <img 
                         src={p.image_url || fallbackImages[index % fallbackImages.length]} 
                         alt={p.name}
                         className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-700 ease-out"
                       />
                       
                       <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                         كرتونة {p.pieces_per_carton} زوج
                       </div>
                    </div>
                  </Link>

                  <div className="pt-5 flex flex-col flex-grow px-5 pb-6">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{p.types?.name_ar}</p>
                      {p.colors && (
                        <p className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {p.colors}
                        </p>
                      )}
                    </div>

                    <Link to={`/product/${p.id}`} className="block">
                      <h3 className="text-2xl font-heavy font-extrabold text-black leading-tight mb-2 hover:text-blue-600 transition-colors">{p.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-6">{p.description}</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-500 uppercase mb-1">
                          {p.material === 'leather' ? 'Leather' : 'Fabric'}
                        </span>
                        <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
                          سعر الكرتونة
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-sport text-2xl font-bold block">{formatPrice(p.carton_price)}</span>
                        <span className="text-xs text-gray-400 font-sans">ل.س</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  )
}