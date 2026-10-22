import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="min-h-screen bg-white font-sans pt-20">
      
      {/* قسم الهيرو (Hero Section) */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className="relative z-10 text-center px-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-heavy font-extrabold text-white mb-6"
          >
            من نحن
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            نحن أكثر من مجرد شركة أحذية. نحن قصة شغف، حرفة، وجودة.
          </motion.p>
        </div>
      </section>

      {/* قسم القصة */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-black mb-6">قصة كجون والنورس</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              بدأت رحلتنا بفكرة بسيطة: أن نصنع أحذية تجمع بين الأصالة والحداثة. من خلال شركة **النورس** للاستيراد، جلبنا أفضل الخامات من الأسواق العالمية، ومن خلال معمل **كجون**، بدأنا نصنع أحذية محلية بمعايير عالمية.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              اليوم، نحن فخورون بخدمة تجار الجملة في جميع أنحاء المنطقة، ونوفر لهم أحذية بجودة عالية وأسعار تنافسية، مع التركيز على راحة العميل وتجربة تسوق سلسة.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-100">
              <p className="text-5xl font-sport font-bold text-blue-600 mb-2">+10</p>
              <p className="text-gray-600 font-bold">سنوات خبرة</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-100">
              <p className="text-5xl font-sport font-bold text-green-600 mb-2">+500</p>
              <p className="text-gray-600 font-bold">تاجر يثق بنا</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-100 col-span-2">
              <p className="text-5xl font-sport font-bold text-black mb-2">100%</p>
              <p className="text-gray-600 font-bold">جودة مضمونة</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* قسم الشركتين */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">شركتان تحت سقف واحد</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">نحن نجمع بين الاستيراد والتصنيع لنقدم لك أفضل تجربة.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* النورس */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
                🚢
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">النورس (Nawras)</h3>
              <p className="text-gray-600 mb-6">
                شركة الاستيراد الأولى التي تجلب لك أجود الماركات العالمية من الخارج، مع ضمان الجودة والأسعار المنافسة.
              </p>
              <Link to="/nawras" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition">
                تصفح منتجات النورس
              </Link>
            </div>

            {/* كجون */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">
                🏭
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">كجون (Kajjoun)</h3>
              <p className="text-gray-600 mb-6">
                معمل التصنيع المحلي الذي يجمع بين الحرفية اليدوية وأحدث الآلات، لنقدم لك أحذية متينة وعصرية.
              </p>
              <Link to="/kajjoun" className="inline-block px-8 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition">
                تصفح منتجات كجون
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* الفوتر */}
      <footer className="bg-black text-white py-12 text-center">
        <p className="text-gray-400">جميع الحقوق محفوظة © {new Date().getFullYear()} كجون والنورس</p>
      </footer>
    </div>
  )
}