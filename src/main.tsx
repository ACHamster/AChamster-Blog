import { StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router";
import axios  from "axios";
import CreatePost from "./pages/admin-page/components/create-post";
import DashBoard from "@/pages/admin-page/components/dashboard";
import ArticleDetail from "@/pages/article-detail";
import ProtectedRoute from "@/route/ProtectedRoute.tsx";
import Login from "@/components/login";
import {Toaster} from "@/components/ui/sonner.tsx";
import PostsList from "@/pages/admin-page/components/posts-list";
import UsersList from "@/pages/admin-page/components/users-list";
import FileList from "@/pages/admin-page/components/file-list";
import PasskeyRegisterPage from "@/pages/passkey-register-page";
import AnimeList from "@/pages/anime-list";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
const HomePage = lazy(() => import('./pages/home-page'));
const AdminPage = lazy(() => import('./pages/admin-page'));

axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/passkey-register" element={<PasskeyRegisterPage />} />
          <Route path="/anime-list" element={<AnimeList />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>}>
            <Route index element={<DashBoard />} />
            <Route path="newarticle" element={<CreatePost />} />
            <Route path="edit/:id" element={<CreatePost />} />
            <Route path="posts-list" element={<PostsList />} />
            <Route path="users-list" element={<UsersList />} />
            <Route path="file-list" element={<FileList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
    <Toaster />
  </StrictMode>,
)
