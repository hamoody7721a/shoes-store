import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface Product {
  id: string
  name: string
  carton_price: number
  pieces_per_carton: number
  store: string
  colors: string
  description: string
  material: string // ضفنا المادة هنا
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [pieces, setPieces] = useState('12')
  const [store, setStore] = useState('nawras')
  const [colors, setColors] = useState('')
  const [description, setDescription] = useState('')
  const [material, setMaterial] = useState('leather') // حالة المادة (افتراضي جلد)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      let imageUrl = ''

      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)
        
        imageUrl = publicUrl
      }

      const { error: insertError } = await supabase.from('products').insert({
        name,
        carton_price: Number(price),
        pieces_per_carton: Number(pieces),
        store,
        colors,
        description,
        material, // حفظ المادة المختارة
        category_id: 1,
        type_id: 1,
        image_url: imageUrl
      })

      if (insertError) throw insertError

      alert('تمت إضافة المنتج بنجاح!')
      setName('')
      setPrice('')
      setColors('')
      setDescription('')
      setImageFile(null)
      fetchProducts()

    } catch (error: any) {
      alert('حدث خطأ: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف المنتج "${name}"؟`)) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) {
        alert('حدث خطأ أثناء الحذف: ' + error.message)
      } else {
        fetchProducts()
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">إدارة المنتجات</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* نموذج إضافة منتج */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-4">إضافة منتج جديد</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">اسم المنتج</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">سعر الكرتونة (ل.س)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">عدد الأزواج بالكرتونة</label>
                <input type="number" value={pieces} onChange={e => setPieces(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              {/* قائمة اختيار المادة */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">المادة</label>
                <select value={material} onChange={e => setMaterial(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="leather">جلد (Leather)</option>
                  <option value="fabric">قماش (Fabric)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">الألوان المتوفرة</label>
                <input type="text" value={colors} onChange={e => setColors(e.target.value)} placeholder="أسود, بني, أبيض" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">وصف القطعة</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={2} placeholder="اكتب تفاصيل الحذاء هنا..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">المتجر</label>
                <select value={store} onChange={e => setStore(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="nawras">النورس (Nawras)</option>
                  <option value="kajjoun">كجون (Kajjoun)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">صورة المنتج</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>

              <button type="submit" disabled={uploading} className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors">
                {uploading ? 'جاري الحفظ...' : 'إضافة المنتج'}
              </button>
            </form>
          </div>

          {/* جدول المنتجات */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-bold text-gray-600">اسم المنتج</th>
                  <th className="p-4 font-bold text-gray-600">المادة</th>
                  <th className="p-4 font-bold text-gray-600">الوصف</th>
                  <th className="p-4 font-bold text-gray-600">الألوان</th>
                  <th className="p-4 font-bold text-gray-600">السعر</th>
                  <th className="p-4 font-bold text-gray-600">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-gray-500">جاري التحميل...</td></tr>
                ) : products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4 text-sm font-bold text-gray-700">{p.material === 'leather' ? 'جلد' : 'قماش'}</td>
                    <td className="p-4 text-sm text-gray-500 truncate max-w-[150px]">{p.description || 'لا يوجد وصف'}</td>
                    <td className="p-4 text-sm text-gray-500">{p.colors || 'غير محدد'}</td>
                    <td className="p-4 text-green-600 font-bold">{p.carton_price?.toLocaleString()} ل.س</td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(p.id, p.name)} className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded-lg transition-colors">
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}