import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore()
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState('')
  const [shopName, setShopName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SY').format(price)
  }

  if (items.length === 0) {
    navigate('/')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName,
          shop_name: shopName,
          phone,
          address,
          total_price: getTotal(),
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      alert('تم استلام طلبك بنجاح! سنتواصل معك قريباً.')
      clearCart()
      navigate('/')

    } catch (error: any) {
      alert('حدث خطأ أثناء إرسال الطلب: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-sport text-black uppercase tracking-widest mb-8">إتمام الطلب</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">بيانات التوصيل</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">اسم المسؤول</label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">اسم المحل / الشركة</label>
                <input type="text" value={shopName} onChange={e => setShopName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">رقم الموبايل</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none text-left" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">العنوان بالتفصيل</label>
                <textarea value={address} onChange={e => setAddress(e.target.value)} required rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none resize-none" />
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white rounded-xl font-bold mt-4 hover:bg-gray-800 disabled:opacity-50 transition-colors">
                {loading ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب'}
              </button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-black">{item.name}</p>
                    <p className="text-gray-500">{item.quantity} كرتونة</p>
                  </div>
                  <p className="font-bold">{formatPrice(item.price * item.quantity)} ل.س</p>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <p className="font-bold text-gray-600">المجموع الإجمالي</p>
              <p className="text-2xl font-sport font-bold text-black">{formatPrice(getTotal())} ل.س</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}