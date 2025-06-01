import { auth } from "@clerk/nextjs/server";
import HeroSection from "@/components/HeroSection";
import PricingPage from "@/components/PricingPage";
import Footer from "@/components/Footer";

const HomePage = async () => {
  const { userId } = await auth(); // ✅ Correct: Await the Promise

  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 gap-16 sm:p-20">
      <HeroSection />
      <PricingPage userId={userId} />
      <Footer />
    </div>
  );
};

export default HomePage;
