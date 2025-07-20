import { useQuery } from "@tanstack/react-query";
import { type UserSettings } from "@shared/schema";
import { useTheme } from "@/hooks/use-theme";
import { AlertTriangle, Moon, Sun, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { data: settings } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
  });

  return (
    <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 emergency-bg rounded-lg flex items-center justify-center">
            <AlertTriangle className="text-white text-sm" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">GlobalAlert</h1>
            <p className="text-xs text-muted-foreground">
              {settings?.location || "San Francisco, CA"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {isDark ? 
              <Sun className="w-4 h-4 text-muted-foreground" /> : 
              <Moon className="w-4 h-4 text-muted-foreground" />
            }
          </Button>
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="p-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
