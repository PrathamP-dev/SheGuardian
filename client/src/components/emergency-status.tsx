import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function EmergencyStatus() {
  return (
    <Card data-testid="emergency-status">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted-foreground">Safety Status</h2>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Safe
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <MapPin className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium" data-testid="text-current-location">
              Current location detected
            </p>
            <p className="text-xs text-muted-foreground" data-testid="text-last-updated">
              Location services active
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
