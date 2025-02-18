import HeroSection from "../components/Home//HeroSection";
import FeatureSection from "../components/Home/FeatureSection";
import CalculatorSection from "../components/Home/CalculatorSection";
import Header from "../components/Home/Header";
import Footer from "../components/Footer";
import HowItWorks from "../components/Home/HowItWorks";
import PricingSection from "../components/Home/PricingSection";
import ContactSection from "../components/Home/ContactSection";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureSection />

      {/* Calculator Section */}
      
      <CalculatorSection />

      {/* How it works */}
      <HowItWorks />

      {/* Pricing */}
      <PricingSection />

      {/* Contact Section */}

      <ContactSection />

      {/* Trust Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Trusted by Thousands
            </h2>
            <div className="mt-8 flex justify-center space-x-8">
              <img
                src="/api/placeholder/120/40"
                alt="Trust Badge 1"
                className="h-12"
              />
              <img
                src="/api/placeholder/120/40"
                alt="Trust Badge 2"
                className="h-12"
              />
              <img
                src="/api/placeholder/120/40"
                alt="Trust Badge 3"
                className="h-12"
              />
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
