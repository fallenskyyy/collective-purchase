import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "../shared/hooks/useAuth";
import MainLayout from "../layouts/layout";
import HomePage from "../pages/HomePage"
import CatalogPage from "../pages/CatalogPage";
import LoginPage from "../pages/LoginPage";
import ProductPage from "../pages/ProductPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "catalog", element: <CatalogPage /> },
      { path: "login", element: <LoginPage/> },
      { path: "product/:id", element: <ProductPage/> },
      { path: "register", element: <RegisterPage/> },
      { path: "profile", element: <ProfilePage/> }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
