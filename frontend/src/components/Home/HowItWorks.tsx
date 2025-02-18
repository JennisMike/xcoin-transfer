import {
  CircleDollarSign,
  ArrowRight,
  QrCode,
  Wallet,
  Shield,
  Bell,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <CircleDollarSign className="w-8 h-8" />,
      title: "Buy XCoin",
      description:
        "Purchase XCoin using your preferred payment method - Mobile Money or Bank Transfer.",
      highlight: "Secure payment processing with daily limits",
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Convert to RMB",
      description:
        "Convert your XCoin to RMB at competitive real-time exchange rates.",
      highlight: "Transparent fees and rates",
    },
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "Share Payment Details",
      description:
        "Upload your WeChat or Alipay QR code for receiving the RMB payment.",
      highlight: "Fast and secure transfer process",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Admin Verification",
      description:
        "Our team verifies your request and processes the transfer quickly.",
      highlight: "Enhanced security checks",
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Receive Confirmation",
      description:
        "Get notified when your RMB transfer is complete and download your receipt.",
      highlight: "Track all transactions in your dashboard",
    },
  ];

  return (
    <div
      id="how-it-works"
      className="bg-gradient-to-b from-gray-50 to-white py-16 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Convert your money to RMB in just a few simple steps with our secure
            and efficient process.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-blue-100 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 relative z-10">
                  {/* Icon */}
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    {step.description}
                  </p>
                  <p className="text-sm text-blue-600 text-center font-medium">
                    {step.highlight}
                  </p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-8 h-8 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
            Get Started Now
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Need help?{" "}
            <button className="text-blue-600 hover:underline">
              Contact our support team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
