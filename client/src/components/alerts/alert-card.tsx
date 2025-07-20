import { type Alert } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Flame, Wind, Droplets, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AlertCardProps {
  alert: Alert;
}

export default function AlertCard({ alert }: AlertCardProps) {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "watch":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "emergency-bg";
      case "warning":
        return "warning-bg";
      case "watch":
        return "info-bg";
      default:
        return "bg-gray-500";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "wildfire":
        return <Flame className="w-5 h-5" />;
      case "storm":
        return <Wind className="w-5 h-5" />;
      case "flood":
        return <Droplets className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getIconColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "emergency-text";
      case "warning":
        return "warning-text";
      case "watch":
        return "info-text";
      default:
        return "text-gray-500";
    }
  };

  const handleAction = () => {
    if (alert.severity === "critical") {
      // Handle evacuation routes
      console.log("View evacuation routes");
    } else if (alert.severity === "warning") {
      // Handle safety tips
      console.log("View safety tips");
    } else {
      // Handle monitoring
      console.log("Monitor conditions");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: alert.title,
        text: alert.description,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${alert.title}: ${alert.description}`);
    }
  };

  const getActionText = (severity: string) => {
    switch (severity) {
      case "critical":
        return "View Routes";
      case "warning":
        return "Safety Tips";
      case "watch":
        return "Monitor";
      default:
        return "View Details";
    }
  };

  return (
    <Card className={`${getSeverityStyles(alert.severity)} border`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className={`${getSeverityColor(alert.severity)} text-white text-xs px-2 py-1 rounded-full font-medium`}>
              {alert.severity.toUpperCase()}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
            </span>
          </div>
          <div className={getIconColor(alert.severity)}>
            {getIcon(alert.type)}
          </div>
        </div>
        
        {alert.imageUrl && (
          <img 
            src={alert.imageUrl} 
            alt={alert.title}
            className="w-full h-24 object-cover rounded-lg mb-3" 
          />
        )}
        
        <h3 className="font-semibold text-foreground mb-1">{alert.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleAction}
            className={`flex-1 ${getSeverityColor(alert.severity)} text-sm font-medium`}
          >
            {getActionText(alert.severity)}
          </Button>
          <Button 
            onClick={handleShare}
            variant="outline" 
            size="sm"
            className="px-3 py-2"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
