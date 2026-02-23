import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import GeneratorPanel from "@/components/GeneratorPanel";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-ct-black text-ct-light">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Hero space */}
          <div className="mb-8" id="hero">
            <Hero />
          </div>

          {/* Generator Interface */}
          <div id="generator" className="mb-8">
            <GeneratorPanel />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
