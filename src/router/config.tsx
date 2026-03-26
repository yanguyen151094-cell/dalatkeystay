import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import SearchListings from "../pages/search/page";
import HomestayRentals from "../pages/homestay/page";
import ApartmentSales from "../pages/apartment/page";
import MapPage from "../pages/map/page";
import Contact from "../pages/contact/page";
import PropertyDetail from "../pages/property/page";
import FAQPage from "../pages/faq/page";
import BlogPage from "../pages/blog/page";
import BlogDetailPage from "../pages/blog-detail/page";
import AdminLogin from "../pages/admin/login/page";
import AdminRegister from "../pages/admin/register/page";
import AdminDashboard from "../pages/admin/dashboard/page";
import AdminProperties from "../pages/admin/properties/page";
import AdminBookings from "../pages/admin/bookings/page";
import AdminTenants from "../pages/admin/tenants/page";
import AdminAccounts from "../pages/admin/accounts/page";
import AdminContent from "../pages/admin/content/page";
import AdminMedia from "../pages/admin/media/page";
import AdminRevenue from "../pages/admin/revenue/page";
import AdminBlog from "../pages/admin/blog/page";
import AdminReview from "../pages/admin/review/page";
import ReviewPage from "../pages/review/page";
import ProtectedAdminRoute from "../pages/admin/components/ProtectedAdminRoute";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/search", element: <SearchListings /> },
  { path: "/homestay", element: <HomestayRentals /> },
  { path: "/apartment", element: <ApartmentSales /> },
  { path: "/map", element: <MapPage /> },
  { path: "/contact", element: <Contact /> },
  { path: "/property/:id", element: <PropertyDetail /> },
  { path: "/faq", element: <FAQPage /> },
  { path: "/blog", element: <BlogPage /> },
  { path: "/blog/:slug", element: <BlogDetailPage /> },
  { path: "/review-da-lat", element: <ReviewPage /> },
  // Admin routes
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/register", element: <AdminRegister /> },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedAdminRoute>
        <AdminDashboard />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/properties",
    element: (
      <ProtectedAdminRoute>
        <AdminProperties />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/bookings",
    element: (
      <ProtectedAdminRoute>
        <AdminBookings />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/tenants",
    element: (
      <ProtectedAdminRoute>
        <AdminTenants />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/blog",
    element: (
      <ProtectedAdminRoute>
        <AdminBlog />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/accounts",
    element: (
      <ProtectedAdminRoute requireSuperAdmin>
        <AdminAccounts />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/content",
    element: (
      <ProtectedAdminRoute>
        <AdminContent />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/media",
    element: (
      <ProtectedAdminRoute>
        <AdminMedia />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/revenue",
    element: (
      <ProtectedAdminRoute>
        <AdminRevenue />
      </ProtectedAdminRoute>
    ),
  },
  {
    path: "/admin/review",
    element: (
      <ProtectedAdminRoute>
        <AdminReview />
      </ProtectedAdminRoute>
    ),
  },
  { path: "*", element: <NotFound /> },
];

export default routes;
