import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const navigate = useNavigate()

  useEffect(() => {
    // عشان نتجنب مشكلة الشاشة البيضا لو ضغط "إتمام الطلب" والسلة فاضية
    if (items.length === 0) {
      // ممكن نخليه يظل بالسلة ويشوف رسالة، بس عشان الكود ما يعلق
    }
  }, [items, navigate])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SY').format(price)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-sport text-black uppercase tracking-widest">سلة التسوق</h1>
          <Link to="/" className="text-sm font-bold text-gray-500 hover:text-black">
            ← العودة للتسوق
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">سلة التسوق فارغة</h2>
            <Link to="/" className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors inline-block">
              تسوق الآن
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col sm:flex-row items-center gap-6 p-6 border-b border-gray-100 last:border-0"
                  >
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl bg-gray-100" />
                    
                    <div className="flex-grow text-center sm:text-right">
                      <h3 className="text-xl font-bold text-black mb-1">{item.name}</h3>
                      <p className="text-gray-500 text-sm">{item.store === 'nawras' ? 'النورس' : 'كجون'}</p>
                      <p className="text-green-600 font-bold mt-2">{formatPrice(item.price)} ل.س / كرتونة</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-3 py-1 text-gray-500 hover:text-black font-bold">-</button>
                        <span className="px-3 py-1 font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-500 hover:text-black font-bold">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-sm font-bold p-2">
                        حذف
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center">
              <div>
                <p className="text-gray-500 mb-1">المجموع الإجمالي:</p>
                <p className="text-3xl font-sport font-bold text-black">{formatPrice(getTotal())} ل.س</p>
              </div>
              <div className="flex gap-4 mt-4 sm:mt-0">
                <button onClick={clearCart} className="px-6 py-3 text-gray-500 font-bold hover:text-red-500 transition-colors">
                  تفريغ السلة
                </button>
                <Link to="/checkout" className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
                  إتمام الطلب
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}