import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar' // استيراد شريط التنقل
import Catalog from './pages/Catalog'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import ProtectedRoute from './routes/ProtectedRoute'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=2070&auto=format&fit=crop',
    tagline: 'New Collection 2024',
    title: 'Nawras & Kajjoun',
    subtitle: 'اكتشف الفخامة الحقيقية في عالم الأحذية. تصاميم تجمع بين الأداء العالي والأناقة.'
  },
  {
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
    tagline: 'The New Era',
    title: 'أداء لا يعرف المستحيل',
    subtitle: 'أحدث تشكيلات الأحذية الرياضية العالمية، الآن بين يديك.'
  },
  {
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop',
    tagline: 'Premium Quality',
    title: 'الجلد الطبيعي 100%',
    subtitle: 'أجود أنواع الجلود والأقمشة، المصنعة بأيدي خبراء لتضمن لك الراحة والأناقة.'
  }
]

function Home() {
  return (
    <div className="h-screen w-full relative font-sans bg-black overflow-hidden pt-20">
      
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="h-full w-full absolute inset-0 z-0"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 z-20 flex items-center pointer-events-none pt-20">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl pointer-events-auto"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-[2px] w-12 bg-white"></span>
              <span className="text-white font-sport text-sm tracking-[0.2em] uppercase">
                The Premium Collection
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl text-white font-sport uppercase leading-[1.1] mb-6">
              Nawras <br />
              <span className="text-white/40">&</span> Kajjoun
            </h1>
            
            <p className="text-gray-300 text-lg md:text-xl font-light mb-10 max-w-xl leading-relaxed">
              اكتشف مجموعتنا الجديدة من الأحذية التي تجمع بين الأداء العالي والتصميم الأنيق.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 relative z-50">
              <Link to="/nawras" className="px-10 py-4 bg-white text-black font-heavy font-bold text-lg uppercase tracking-wider transition-all duration-300 hover:bg-gray-200 hover:scale-105 shadow-xl">
                تسوق النورس
              </Link>
              <Link to="/kajjoun" className="px-10 py-4 bg-transparent border-2 border-white text-white font-heavy font-bold text-lg uppercase tracking-wider backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:scale-105">
                تسوق كجون
              </Link>
            </div>
          </motion.div>

        </div>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-1/3 flex justify-end gap-3 opacity-10 pointer-events-none z-10 pr-12 overflow-hidden">
        <div className="w-12 h-[150%] -mt-[25%] bg-white skew-x-[-20deg]"></div>
        <div className="w-12 h-[150%] -mt-[25%] bg-white skew-x-[-20deg]"></div>
        <div className="w-12 h-[150%] -mt-[25%] bg-white skew-x-[-20deg]"></div>
      </div>

    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* الناف بار هنا عشان يظهر بكل الصفحات */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/:store" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        
        <Route path="/admin/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App