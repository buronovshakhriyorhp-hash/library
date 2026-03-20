import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import HeroCarousel from "@/components/HeroCarousel";
import FeaturesSection from "@/components/FeaturesSection";
import BooksGrid from "@/components/BooksGrid";
import TopBooks from "@/components/TopBooks";
import AuthorSection from "@/components/AuthorSection";
import StatsSection from "@/components/StatsSection";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main content with sidebar */}
      <div className="container py-6">
        <div className="flex gap-6">
          <Sidebar />
          <main className="flex-1 min-w-0">
            <HeroCarousel />
          </main>
        </div>
      </div>

      <FeaturesSection />
      <BooksGrid />
      <TopBooks />
      <AuthorSection />
      <StatsSection />
      <NewsSection />
      <Footer />
    </div>
  );
};

export default Index;
