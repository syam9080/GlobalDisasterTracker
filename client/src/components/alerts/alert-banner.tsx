import { type Alert } from "@shared/schema";
import { AlertCircle } from "lucide-react";

interface AlertBannerProps {
  alert: Alert;
}

export default function AlertBanner({ alert }: AlertBannerProps) {
  const handleViewDetails = () => {
    // In a real app, this would navigate to alert details
    console.log("View alert details:", alert.id);
  };

  return (
    <div className="emergency-bg px-4 py-3 border-b border-red-700">
      <div className="flex items-center space-x-3">
        <AlertCircle className="text-xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">
            {alert.severity.toUpperCase()} ALERT
          </p>
          <p className="text-xs opacity-90 truncate">
            {alert.title} - {alert.description}
          </p>
        </div>
        <button 
          onClick={handleViewDetails}
          className="text-xs underline flex-shrink-0"
        >
          Details
        </button>
      </div>
    </div>
  );
}
