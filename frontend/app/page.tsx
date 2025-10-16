import Header from '@/components/header';
import HeroSection from '@/components/hero';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <div className="lg:my-20 my-16">
        <HeroSection />
      </div>
      <Footer />
    </main>
  );
}