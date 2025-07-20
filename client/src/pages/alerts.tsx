import { useQuery } from "@tanstack/react-query";
import { type Alert } from "@shared/schema";
import Header from "@/components/layout/header";
import AlertBanner from "@/components/alerts/alert-banner";
import AlertCard from "@/components/alerts/alert-card";
import QuickActions from "@/components/actions/quick-actions";
import { Skeleton } from "@/components/ui/skeleton";

export default function AlertsPage() {
  const { data: activeAlerts, isLoading } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/active"],
  });

  const criticalAlert = activeAlerts?.find(alert => alert.severity === "critical");
  const otherAlerts = activeAlerts?.filter(alert => alert.severity !== "critical");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="px-4 py-4 space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <Header />
      
      {criticalAlert && <AlertBanner alert={criticalAlert} />}
      
      <main className="pb-4">
        <section className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Current Alerts</h2>
            <button className="info-text text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {otherAlerts?.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
            
            {!activeAlerts?.length && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No active alerts in your area</p>
              </div>
            )}
          </div>
        </section>

        <QuickActions />
      </main>
    </div>
  );
}
