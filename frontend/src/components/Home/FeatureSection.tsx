import FeatureCard from "./FeatureCard";
import { DollarSign, Lock, Zap } from "lucide-react";

function FeatureSection() {
  return (
    <div>
      <section className="py-16 bg-gray-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose XCoin Transfer?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Experience the fastest and most secure way to send money to China
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-indigo-600" />}
              title="Lightning Fast"
              description="Complete your transfers within minutes, not days. Instant delivery to WeChat and Alipay."
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6 text-indigo-600" />}
              title="Bank-Grade Security"
              description="Your transactions are protected with advanced encryption and security measures."
            />
            <FeatureCard
              icon={<DollarSign className="h-6 w-6 text-indigo-600" />}
              title="Best Exchange Rates"
              description="Get competitive rates with no hidden fees. Save on every transfer."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default FeatureSection;
