import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { ToastProvider } from "@/components/common/Toast";
import { GalleryPage } from "@/pages/GalleryPage";
import { CreatePage } from "@/pages/CreatePage";
import { ArtworkDetailPage } from "@/pages/ArtworkDetailPage";
import { FavoritesPage } from "@/pages/FavoritesPage";
import { UserProfilePage } from "@/pages/UserProfilePage";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function App() {
  return (
    <FavoritesProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<GalleryPage />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/artwork/:id" element={<ArtworkDetailPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/user/:author" element={<UserProfilePage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </FavoritesProvider>
  );
}
