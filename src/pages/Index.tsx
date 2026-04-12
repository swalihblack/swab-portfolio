import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ToolsSection from '@/components/ToolsSection';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import BlogPreview from '@/components/BlogPreview';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ToolsSection />
      <About />
      <Portfolio maxProjects={6} showViewAll />
      <BlogPreview />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
