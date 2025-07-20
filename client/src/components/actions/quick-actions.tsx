import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Phone, MapPin, Heart, AlertTriangle } from "lucide-react";

export default function QuickActions() {
  const { toast } = useToast();

  const checkInMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/emergency/check-in", {});
    },
    onSuccess: () => {
      toast({
        title: "Check-in sent",
        description: "Your safety status has been sent to emergency contacts.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to send check-in",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const reportMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/emergency/report", data);
    },
    onSuccess: () => {
      toast({
        title: "Incident reported",
        description: "Your report has been submitted to emergency services.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to report incident",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleEmergencyCall = () => {
    if (confirm("Call 911 for emergency assistance?")) {
      window.location.href = "tel:911";
    }
  };

  const handleFindSafety = () => {
    // In a real app, this would navigate to the map with safe locations
    toast({
      title: "Finding safe locations",
      description: "Opening map with nearby shelters and safe zones.",
    });
  };

  const handleCheckIn = () => {
    checkInMutation.mutate();
  };

  const handleReport = () => {
    // In a real app, this would open a form to collect incident details
    reportMutation.mutate({
      type: "user_report",
      description: "User reported incident",
      location: "Current location",
      latitude: null,
      longitude: null
    });
  };

  return (
    <section className="px-4 py-4 border-t border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={handleEmergencyCall}
          className="emergency-bg h-auto p-4 flex flex-col items-center space-y-2"
        >
          <Phone className="w-6 h-6" />
          <div className="text-center">
            <p className="text-sm font-medium">Emergency Call</p>
            <p className="text-xs opacity-80">911</p>
          </div>
        </Button>
        
        <Button 
          onClick={handleFindSafety}
          className="safety-bg h-auto p-4 flex flex-col items-center space-y-2"
        >
          <MapPin className="w-6 h-6" />
          <div className="text-center">
            <p className="text-sm font-medium">Find Safety</p>
            <p className="text-xs opacity-80">Nearby shelters</p>
          </div>
        </Button>
        
        <Button 
          onClick={handleCheckIn}
          disabled={checkInMutation.isPending}
          className="info-bg h-auto p-4 flex flex-col items-center space-y-2"
        >
          <Heart className="w-6 h-6" />
          <div className="text-center">
            <p className="text-sm font-medium">
              {checkInMutation.isPending ? "Sending..." : "Check In"}
            </p>
            <p className="text-xs opacity-80">I'm safe</p>
          </div>
        </Button>
        
        <Button 
          onClick={handleReport}
          disabled={reportMutation.isPending}
          className="warning-bg h-auto p-4 flex flex-col items-center space-y-2"
        >
          <AlertTriangle className="w-6 h-6" />
          <div className="text-center">
            <p className="text-sm font-medium">
              {reportMutation.isPending ? "Reporting..." : "Report"}
            </p>
            <p className="text-xs opacity-80">Send alert</p>
          </div>
        </Button>
      </div>
    </section>
  );
}
