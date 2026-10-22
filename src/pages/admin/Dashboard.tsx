import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-3xl font-sport text-black uppercase tracking-widest italic">
            Admin Dashboard
          </h1>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
          <h2 className="text-2xl font-bold text-black mb-2">أهلاً بك في لوحة التحكم 👋</h2>
          <p className="text-gray-500 mb-8">من هنا يمكنك إدارة المنتجات، الطلبات، والتجار.</p>
          
          <div className="flex justify-center gap-4">
            <Link to="/admin/products" className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
              إدارة المنتجات
            </Link>
            <Link to="/admin/orders" className="px-6 py-3 bg-gray-100 text-black rounded-xl font-bold hover:bg-gray-200 transition-colors">
              الطلبات
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}