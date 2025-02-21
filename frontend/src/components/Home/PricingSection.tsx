import { Check, AlertCircle, Info } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card";

const PricingSection = () => {
  const tiers = [
    {
      name: "Standard",
      description: "Perfect for occasional transfers",
      fee: "8.5%",
      limit: "Up to XAF100,000/day",
      features: [
        "Real-time exchange rates",
        "Mobile money payment option",
        "Bank transfer option",
        "24/7 customer support",
        "Transaction tracking",
      ],
    },
    {
      name: "Premium",
      description: "Ideal for regular transfers",
      fee: "7.5%",
      limit: "Up to XAF250,000/day",
      featured: true,
      features: [
        "All Standard features",
        "Priority processing",
        "Dedicated account manager",
        "Advanced security features",
        "Detailed transaction analytics",
      ],
    },
    {
      name: "Business",
      description: "For high-volume transfers",
      fee: "5.2%",
      limit: "Custom limits",
      features: [
        "All Premium features",
        "Custom exchange rates",
        "API access",
        "Bulk transfers",
        "White-label solution",
      ],
    },
  ];

  return (
    <div
      id="pricing"
      className="bg-gradient-to-b from-gray-50 to-white py-16 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, competitive fees with no hidden charges. Choose the plan
            that best fits your needs.
          </p>
        </div>

        {/* Exchange Rate Info */}
        <div className="mb-12">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-600" />
                <p className="text-blue-800">
                  Exchange rates are updated in real-time based on market
                  conditions. View current rates in your dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div key={index} className="relative">
              {tier.featured && (
                <div className="absolute -top-4 left-0 right-0 text-center">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <Card
                className={`h-full ${
                  tier.featured
                    ? "border-blue-200 shadow-lg"
                    : "border-gray-200"
                }`}
              >
                <CardHeader className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{tier.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {tier.fee}
                    </span>
                    <span className="text-gray-600"> per transfer</span>
                  </div>
                  <p className="text-sm text-gray-600">{tier.limit}</p>
                </CardHeader>

                <CardContent className="p-6 border-t border-gray-100">
                  <ul className="space-y-4">
                    {tier.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full mt-8 px-6 py-3 rounded-lg font-medium transition-colors duration-200 
                    ${
                      tier.featured
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    Get Started
                  </button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <p className="text-gray-600">
              Additional banking fees may apply depending on your payment method
            </p>
          </div>
          <p className="text-sm text-gray-600">
            Need a custom solution?{" "}
            <button className="text-blue-600 hover:underline">
              Contact our sales team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
