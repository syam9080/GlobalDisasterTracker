import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import NotFound from "@/pages/not-found";
import AlertsPage from "@/pages/alerts";
import MapPage from "@/pages/map";
import SafetyPage from "@/pages/safety";
import ContactsPage from "@/pages/contacts";
import SettingsPage from "@/pages/settings";
import BottomNavigation from "@/components/layout/bottom-navigation";

function Router() {
  return (
    <div className="max-w-md mx-auto bg-card min-h-screen shadow-xl relative">
      <Switch>
        <Route path="/" component={AlertsPage} />
        <Route path="/alerts" component={AlertsPage} />
        <Route path="/map" component={MapPage} />
        <Route path="/safety" component={SafetyPage} />
        <Route path="/contacts" component={ContactsPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
