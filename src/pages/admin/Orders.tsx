import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer_name: string
  shop_name: string
  phone: string
  address: string
  total_price: number
  status: string
  created_at: string
  order_items: OrderItem[]
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // دالة تغيير حالة الطلب لـ "تم التسليم"
  const handleMarkAsDelivered = async (id: string) => {
    if (window.confirm('هل تم تسليم هذه الشحنة للتاجر؟')) {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', id)

      if (error) alert('حدث خطأ: ' + error.message)
      else fetchOrders()
    }
  }

  // دالة حذف الطلب
  const handleDeleteOrder = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب نهائياً؟ (لا يمكن التراجع)')) {
      const { error } = await supabase.from('orders').delete().eq('id', id)
      if (error) alert('حدث خطأ أثناء الحذف: ' + error.message)
      else fetchOrders()
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SY').format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">الطلبات الواردة</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-400 mb-2">لا توجد طلبات حالياً</h2>
            <p className="text-gray-500">عندما يقوم التجار بالطلب، ستظهر طلباتهم هنا.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-colors ${
                  order.status === 'delivered' ? 'border-green-200 bg-green-50/30' : 'border-gray-100'
                }`}
              >
                <div className={`p-4 border-b flex flex-wrap justify-between items-center gap-4 ${
                  order.status === 'delivered' ? 'bg-green-100/50 border-green-100' : 'bg-gray-50 border-gray-100'
                }`}>
                  <div>
                    <p className="text-sm text-gray-500">تاريخ الطلب: {formatDate(order.created_at)}</p>
                    <p className="font-bold text-lg text-black mt-1">طلب رقم: #{order.id.slice(0, 8)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-1 rounded-full text-sm font-bold ${
                      order.status === 'delivered' ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status === 'delivered' ? 'تم التسليم ✓' : 'قيد المراجعة'}
                    </div>
                    
                    {/* أزرار التحكم */}
                    <div className="flex gap-2">
                      {order.status !== 'delivered' && (
                        <button 
                          onClick={() => handleMarkAsDelivered(order.id)}
                          className="px-4 py-1 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition"
                        >
                          تم التسليم
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        className="px-4 py-1 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-100 transition"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">بيانات التاجر</h3>
                    <p className="mb-1"><span className="text-gray-500">المحل:</span> <span className="font-bold">{order.shop_name}</span></p>
                    <p className="mb-1"><span className="text-gray-500">المسؤول:</span> {order.customer_name}</p>
                    <p className="mb-1" dir="ltr"><span className="text-gray-500">الهاتف:</span> {order.phone}</p>
                    <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">{order.address}</p>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">القطع المطلوبة</h3>
                    <div className="space-y-3">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                          <div>
                            <p className="font-bold text-black">{item.product_name}</p>
                            <p className="text-sm text-gray-500">{item.quantity} كرتونة × {formatPrice(item.price)} ل.س</p>
                          </div>
                          <p className="font-bold text-green-600">{formatPrice(item.price * item.quantity)} ل.س</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <p className="text-lg font-bold text-gray-800">المجموع الإجمالي:</p>
                      <p className="text-2xl font-bold text-green-600">{formatPrice(order.total_price)} ل.س</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}