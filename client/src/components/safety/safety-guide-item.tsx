import { type SafetyGuide } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface SafetyGuideItemProps {
  guide: SafetyGuide;
}

export default function SafetyGuideItem({ guide }: SafetyGuideItemProps) {
  const handleClick = () => {
    // In a real app, this would navigate to the full guide
    console.log("View safety guide:", guide.id);
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleClick}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          {guide.imageUrl && (
            <img 
              src={guide.imageUrl} 
              alt={guide.title}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0" 
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{guide.title}</h3>
            <p className="text-sm text-muted-foreground">{guide.description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}
