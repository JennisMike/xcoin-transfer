import { ArrowRight } from "lucide-react";
import MonneyTransferImage from "../../assets/money-transfer.svg";

function HeroSection() {
  return (
    <div>
      <section className="pt-24 sm:pt-32 pb-16 bg-gradient-to-br from-indigo-500 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                Fast & Secure Money Transfers to China
              </h1>
              <p className="mt-6 text-xl text-indigo-100">
                Send money to China with the best exchange rates. Instant
                transfers through WeChat and Alipay.
              </p>
              <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                >
                  Start Transferring Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <img
                src={MonneyTransferImage}
                alt="Money Transfer Illustration"
                className="w-full rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroSection;
