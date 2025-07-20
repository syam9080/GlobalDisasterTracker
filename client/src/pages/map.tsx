import { useQuery } from "@tanstack/react-query";
import { type Alert } from "@shared/schema";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MapPage() {
  const { data: activeAlerts } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/active"],
  });

  // Mock safe locations
  const safeLocations = [
    { id: 1, name: "City Hall Emergency Shelter", address: "1 Dr Carlton B Goodlett Pl", distance: "0.5 mi" },
    { id: 2, name: "Red Cross Emergency Center", address: "1663 Mission St", distance: "1.2 mi" },
    { id: 3, name: "Golden Gate Park Assembly Point", address: "Golden Gate Park", distance: "2.1 mi" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <Header />
      
      <main className="px-4 py-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Emergency Map</h2>
          <Button variant="outline" size="sm">
            <Navigation className="w-4 h-4 mr-2" />
            My Location
          </Button>
        </div>

        {/* Map Placeholder */}
        <Card>
          <CardContent className="p-4">
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Interactive Map</p>
                <p className="text-xs text-gray-400">Shows active alerts and safe locations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts on Map */}
        {activeAlerts && activeAlerts.length > 0 && (
          <section>
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Active Alerts</h3>
            <div className="space-y-2">
              {activeAlerts.map((alert) => (
                <Card key={alert.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          alert.severity === 'critical' ? 'bg-red-500' :
                          alert.severity === 'warning' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`} />
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">{alert.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{alert.location}</p>
                        </div>
                      </div>
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Safe Locations */}
        <section>
          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Safe Locations</h3>
          <div className="space-y-2">
            {safeLocations.map((location) => (
              <Card key={location.id}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 safety-bg rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{location.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{location.address}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{location.distance}</p>
                      <Button variant="outline" size="sm" className="mt-1">
                        Directions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
