import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Hospital, Shield } from "lucide-react";

export default function LocationMap() {
  return (
    <Card data-testid="location-map-section">
      <CardContent className="p-0">
        <div className="p-4 pb-0">
          <h3 className="font-medium mb-3">Your Location & Safe Zones</h3>
        </div>
        <div className="map-container h-48 relative">
          {/* Mock map representation */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-8 w-8 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Interactive Map Loading...</p>
              <p className="text-xs text-muted-foreground mt-1">
                Location services will show nearby safe zones
              </p>
            </div>
          </div>
          
          {/* Map overlays */}
          <div className="absolute top-4 left-4 bg-card rounded-lg p-2 shadow-lg border">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-foreground">You are here</span>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 space-y-2">
            <div className="bg-card rounded-lg p-2 shadow-lg border">
              <div className="flex items-center space-x-2">
                <Hospital className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-foreground">Hospital - 0.3km</span>
              </div>
            </div>
            <div className="bg-card rounded-lg p-2 shadow-lg border">
              <div className="flex items-center space-x-2">
                <Shield className="h-3 w-3 text-primary" />
                <span className="text-xs text-foreground">Police - 0.5km</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
