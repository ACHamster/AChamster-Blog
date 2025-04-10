import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router";
import HomePage from "./pages/home-page";
import AdminPage from "./pages/admin-page";
import CreatePost from "./pages/admin-page/components/create-post";
import DashBoard from "@/pages/admin-page/components/dashboard";
import ArticleDetail from "@/pages/article-detail";
import ProtectedRoute from "@/route/ProtectedRoute.tsx";
import Login from "@/components/login";
import {Toaster} from "@/components/ui/sonner.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog/:id" element={<ArticleDetail />} />
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>}>
          <Route index element={<DashBoard />} />
          <Route path="newarticle" element={<CreatePost />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <Toaster />
  </StrictMode>,
)
