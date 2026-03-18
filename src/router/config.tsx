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

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/search", element: <SearchListings /> },
  { path: "/homestay", element: <HomestayRentals /> },
  { path: "/apartment", element: <ApartmentSales /> },
  { path: "/map", element: <MapPage /> },
  { path: "/contact", element: <Contact /> },
  { path: "/property/:id", element: <PropertyDetail /> },
  { path: "/faq", element: <FAQPage /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
