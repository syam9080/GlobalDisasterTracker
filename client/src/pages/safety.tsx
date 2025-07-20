import { useQuery } from "@tanstack/react-query";
import { type SafetyGuide } from "@shared/schema";
import Header from "@/components/layout/header";
import SafetyGuideItem from "@/components/safety/safety-guide-item";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, CheckCircle } from "lucide-react";

export default function SafetyPage() {
  const { data: safetyGuides, isLoading } = useQuery<SafetyGuide[]>({
    queryKey: ["/api/safety-guides"],
  });

  const emergencyKitItems = [
    "Water (1 gallon per person per day for 3 days)",
    "Non-perishable food (3-day supply)",
    "Battery-powered or hand crank radio",
    "Flashlight and extra batteries",
    "First aid kit",
    "Whistle for signaling help",
    "Dust masks and plastic sheeting",
    "Moist towelettes and garbage bags",
    "Wrench or pliers to turn off utilities",
    "Manual can opener",
    "Local maps",
    "Cell phone with chargers"
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <Header />
        <div className="px-4 py-4 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <Header />
      
      <main className="px-4 py-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Safety Guide</h2>
          <button className="info-text text-sm font-medium">
            View All
          </button>
        </div>

        {/* Emergency Kit Checklist */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 safety-bg rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Emergency Kit Checklist</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Essential items for 72-hour emergency supply</p>
              </div>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {emergencyKitItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 safety-text mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Safety Guides */}
        <section>
          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Safety Guides</h3>
          <div className="space-y-3">
            {safetyGuides?.map((guide) => (
              <SafetyGuideItem key={guide.id} guide={guide} />
            ))}
          </div>
        </section>

        {/* Quick Safety Tips */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Safety Tips</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white">During an Earthquake</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Drop, Cover, and Hold On. Get under a sturdy desk or table.</p>
              </div>
              
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white">During a Fire</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Stay low, check doors for heat before opening, and have an escape plan.</p>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white">During a Flood</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Turn around, don't drown. Just 6 inches of moving water can knock you down.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
