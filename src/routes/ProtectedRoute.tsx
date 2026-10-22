import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ProtectedRoute() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    // بنشيك إذا في مستخدم مسجل دخول حالياً
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // بنستنى أي تغيير بحالة الدخول (تسجيل خروج مثلاً)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div></div>
  }

  // إذا ما في مستخدم، بنرجعه لصفحة تسجيل الدخول
  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  // إذا في مستخدم، بنعرض الصفحة اللي بدها تفتح
  return <Outlet />
}