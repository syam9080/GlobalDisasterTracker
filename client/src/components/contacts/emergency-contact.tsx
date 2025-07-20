import { type EmergencyContact } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Hospital, Shield, User } from "lucide-react";

interface EmergencyContactCardProps {
  contact: EmergencyContact;
}

export default function EmergencyContactCard({ contact }: EmergencyContactCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <Phone className="w-4 h-4" />;
      case "medical":
        return <Hospital className="w-4 h-4" />;
      case "personal":
        return <User className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "emergency-bg";
      case "medical":
        return "info-bg";
      case "personal":
        return "safety-bg";
      default:
        return "bg-gray-500";
    }
  };

  const getButtonColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "emergency-text";
      case "medical":
        return "info-text";
      case "personal":
        return "safety-text";
      default:
        return "text-gray-500";
    }
  };

  const handleCall = () => {
    if (confirm(`Call ${contact.name} at ${contact.phone}?`)) {
      window.location.href = `tel:${contact.phone}`;
    }
  };

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${getIconColor(contact.type)} rounded-full flex items-center justify-center`}>
              {getIcon(contact.type)}
            </div>
            <div>
              <p className="font-medium text-foreground">{contact.name}</p>
              <p className="text-sm text-muted-foreground">
                {contact.description ? `${contact.description} - ` : ""}{contact.phone}
              </p>
            </div>
          </div>
          <Button 
            onClick={handleCall}
            variant="ghost"
            size="sm"
            className={`p-2 ${getButtonColor(contact.type)}`}
          >
            <Phone className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
