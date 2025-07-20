import { useQuery, useMutation } from "@tanstack/react-query";
import { type EmergencyContact } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/header";
import EmergencyContactCard from "@/components/contacts/emergency-contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Heart } from "lucide-react";

export default function ContactsPage() {
  const { toast } = useToast();
  
  const { data: contacts, isLoading } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/emergency-contacts"],
  });

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

  const handleCheckIn = () => {
    checkInMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <Header />
        <div className="px-4 py-4 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  const defaultContacts = contacts?.filter(contact => contact.isDefault);
  const personalContacts = contacts?.filter(contact => !contact.isDefault);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <Header />
      
      <main className="px-4 py-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Emergency Contacts</h2>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>

        {/* Safety Check-in */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 safety-bg rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Safety Check-in</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Let your contacts know you're safe</p>
                </div>
              </div>
              <Button 
                onClick={handleCheckIn}
                disabled={checkInMutation.isPending}
                className="safety-bg"
              >
                {checkInMutation.isPending ? "Sending..." : "I'm Safe"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Default Emergency Services */}
        <section>
          <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Emergency Services</h3>
          <div className="space-y-2">
            {defaultContacts?.map((contact) => (
              <EmergencyContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        </section>

        {/* Personal Emergency Contacts */}
        {personalContacts && personalContacts.length > 0 && (
          <section>
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Personal Contacts</h3>
            <div className="space-y-2">
              {personalContacts.map((contact) => (
                <EmergencyContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </section>
        )}

        {/* Emergency Contact Tips */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Emergency Contact Tips</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• Choose contacts in different locations</p>
              <p>• Include both local and out-of-state contacts</p>
              <p>• Make sure contacts know they're your emergency contact</p>
              <p>• Keep contact information updated</p>
              <p>• Program contacts into all family members' phones</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
