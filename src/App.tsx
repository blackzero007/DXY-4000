import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "@/components/common/Header";
import { GalleryPage } from "@/pages/GalleryPage";
import { CreatePage } from "@/pages/CreatePage";
import { ArtworkDetailPage } from "@/pages/ArtworkDetailPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<GalleryPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/artwork/:id" element={<ArtworkDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
