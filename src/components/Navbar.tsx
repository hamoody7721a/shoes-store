import { Link, useLocation } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { motion } from 'framer-motion'

export default function Navbar() {
  const location = useLocation()
  const itemsCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0))

  // الصفحات اللي ما بيظهر فيها الناف بار (زي لوحة التحكم)
  if (location.pathname.startsWith('/admin')) {
    return null
  }

  // نخفي الناف بار بالصفحة الرئيسية عشان ما يغطي على السلايدر (اختياري)
  // بس أنت طلبت يكون بقلب الشاشة، فخلينا نخليه يظهر بكل مكان ما عدا الأدمن
  // إذا حبيت تخفيه بالرئيسية، شيل التعليق عن السطرين الجايين
  // if (location.pathname === '/') {
  //   return null
  // }

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'النورس', path: '/nawras' },
    { name: 'كجون', path: '/kajjoun' },
    { name: 'من نحن', path: '/about' },
  ]

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* اللوجو */}
        <Link to="/" className="text-2xl font-sport italic uppercase tracking-widest text-black">
          Kajjoun & Nawras
        </Link>

        {/* روابط التنقل */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                location.pathname === link.path ? 'text-black border-b-2 border-black pb-1' : 'text-gray-500 hover:text-black'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* زر السلة */}
        <Link to="/cart" className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
          <span>السلة 🛒</span>
          <span className="bg-white text-black text-xs px-2 py-0.5 rounded-full">{itemsCount}</span>
        </Link>

      </div>
    </motion.nav>
  )
}