const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="relative p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-base text-gray-500">{description}</p>
    </div>
  );
};

export default FeatureCard;
