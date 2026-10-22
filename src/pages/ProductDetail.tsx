import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { useCartStore } from '../stores/cartStore'

interface Product {
  id: string
  name: string
  material: string
  store: string
  description: string
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

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return
      const { data, error } = await supabase
        .from('products')
        .select('*, types(name_ar)')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
      } else {
        setProduct(data)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SY').format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f5f5f5]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5]">
        <h1 className="text-3xl font-bold text-gray-400 mb-6">المنتج غير موجود</h1>
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-black text-white rounded-full font-bold">
          العودة
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="text-sm font-bold text-gray-500 hover:text-black transition flex items-center gap-2">
            <span>←</span> رجوع
          </button>
          <Link to="/" className="text-2xl font-sport italic uppercase tracking-widest">
            {product.store === 'nawras' ? 'Nawras' : 'Kajjoun'}
          </Link>
          <div className="w-20"></div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#f5f5f5] rounded-[2rem] h-[500px] flex items-center justify-center relative overflow-hidden">
             <img src={product.image_url || fallbackImages[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
             <div className="absolute top-6 left-6 bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full">
               كرتونة {product.pieces_per_carton} زوج
             </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <p className="text-sm font-bold text-blue-600 tracking-widest uppercase mb-2">{product.types?.name_ar}</p>
            <h1 className="text-5xl font-heavy font-extrabold text-black leading-tight mb-4">{product.name}</h1>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8">{product.description}</p>

            <div className="space-y-4 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">المادة:</span>
                {/* هنا التعديل: عرض المادة حسب اختيار الأدمن */}
                <span className="font-bold">{product.material === 'leather' ? 'جلد' : 'قماش'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">الألوان المتوفرة:</span>
                <span className="font-bold">{product.colors || 'أسود'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">الكمية بالكرتونة:</span>
                <span className="font-bold">{product.pieces_per_carton} زوج</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-xl font-bold text-gray-800">سعر الكرتونة:</span>
                <span className="text-3xl font-sport font-bold text-green-600">{formatPrice(product.carton_price)} ل.س</span>
              </div>
            </div>

            <button 
              onClick={() => {
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.carton_price,
                  image: product.image_url || fallbackImages[0],
                  store: product.store
                })
                alert('تمت إضافة الكرتونة للسلة!')
              }}
              className="w-full py-5 bg-black text-white font-bold text-lg uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors shadow-xl"
            >
              إضافة كرتونة للسلة
            </button>
          </motion.div>

        </div>
      </main>
    </div>
  )
}