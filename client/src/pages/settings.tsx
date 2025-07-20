import { useQuery, useMutation } from "@tanstack/react-query";
import { type UserSettings } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useTheme } from "@/hooks/use-theme";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Bell, Moon, Shield, Info } from "lucide-react";

export default function SettingsPage() {
  const { toast } = useToast();
  const { isDark, toggleTheme } = useTheme();
  
  const { data: settings, isLoading } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<UserSettings>) => {
      return apiRequest("PATCH", "/api/settings", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings updated",
        description: "Your preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleNotificationToggle = (enabled: boolean) => {
    updateSettingsMutation.mutate({ notificationsEnabled: enabled });
  };

  const requestLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateSettingsMutation.mutate({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            location: "Current Location"
          });
        },
        (error) => {
          toast({
            title: "Location access denied",
            description: "Please enable location access in your browser settings.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <Header />
        <div className="px-4 py-4 space-y-4">
          <Skeleton className="h-8 w-32" />
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>

        {/* Location Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Current Location</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {settings?.location || "Location not set"}
                </p>
              </div>
              <Button onClick={requestLocationPermission} variant="outline" size="sm">
                Update
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Location is used to provide relevant disaster alerts for your area.
            </p>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Emergency Alerts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive push notifications for emergency alerts
                </p>
              </div>
              <Switch
                checked={settings?.notificationsEnabled ?? true}
                onCheckedChange={handleNotificationToggle}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Moon className="w-5 h-5" />
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use dark theme for better visibility
                </p>
              </div>
              <Switch
                checked={isDark}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Safety */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Privacy & Safety</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Manage Emergency Contacts
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Data & Privacy
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Safety Check-in Settings
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="w-5 h-5" />
              <span>About</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-white">GlobalAlert</span> provides real-time disaster information and emergency preparedness tools to keep you and your loved ones safe.
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Version 1.0.0</span>
                <Button variant="ghost" size="sm">
                  Terms & Privacy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
