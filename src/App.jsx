import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CompanySettingsProvider } from './hooks/useCompanySettings'
import ScrollToTop from './components/ScrollToTop'

// Public Pages
import HomePage from './pages/public/HomePage'
import CategoriesPage from './pages/public/CategoriesPage'
import ProductGalleryPage from './pages/public/ProductGalleryPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import BlogPage from './pages/public/BlogPage'
import BlogPostPage from './pages/public/BlogPostPage'
import ContactPage from './pages/public/ContactPage'
import AboutPage from './pages/public/AboutPage'

// Admin Pages
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import CategoriesManagePage from './pages/admin/CategoriesManagePage'
import ProductsManagePage from './pages/admin/ProductsManagePage'
import TrendingProductsPage from './pages/admin/TrendingProductsPage'
import BlogManagePage from './pages/admin/BlogManagePage'
import InquiriesPage from './pages/admin/InquiriesPage'
import SettingsPage from './pages/admin/SettingsPage'

export default function App() {
  return (
    <AuthProvider>
      <CompanySettingsProvider>
        <Router>
          <ScrollToTop />
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:slug" element={<ProductGalleryPage />} />
          <Route path="/products" element={<ProductGalleryPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/categories" element={<CategoriesManagePage />} />
          <Route path="/admin/products" element={<ProductsManagePage />} />
          <Route path="/admin/trending" element={<TrendingProductsPage />} />
          <Route path="/admin/blog" element={<BlogManagePage />} />
          <Route path="/admin/inquiries" element={<InquiriesPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          </Routes>
        </Router>
      </CompanySettingsProvider>
    </AuthProvider>
  )
}
