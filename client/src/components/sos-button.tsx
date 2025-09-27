import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AlertTriangle } from "lucide-react";

export default function SOSButton() {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const triggerSOSMutation = useMutation({
    mutationFn: async () => {
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const alertData = {
        latitude: position.coords.latitude.toString(),
        longitude: position.coords.longitude.toString(),
        alertType: 'general',
        description: 'Emergency SOS triggered from mobile app'
      };

      await apiRequest("POST", "/api/emergency-alert", alertData);
    },
    onSuccess: () => {
      toast({
        title: "Emergency Alert Sent!",
        description: "Your trusted contacts and nearby volunteers have been notified.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/activity-logs"] });
    },
    onError: (error) => {
      console.error("SOS error:", error);
      toast({
        title: "Emergency Alert Failed",
        description: "Please try again or call emergency services directly.",
        variant: "destructive",
      });
    },
  });

  const handleSOSPress = () => {
    if (triggerSOSMutation.isPending) return;

    setIsPressed(true);
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPressed(false);
          triggerSOSMutation.mutate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Store timer reference for cleanup
    (window as any).sosTimer = timer;
  };

  const handleSOSRelease = () => {
    if ((window as any).sosTimer) {
      clearInterval((window as any).sosTimer);
    }
    setIsPressed(false);
    setCountdown(0);
  };

  return (
    <div className="text-center py-8" data-testid="sos-section">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
        <p className="text-muted-foreground text-sm">
          Press and hold for 3 seconds to send emergency alert
        </p>
      </div>
      
      <button
        className={`sos-button w-40 h-40 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl relative overflow-hidden transition-all duration-200 ${
          isPressed ? 'scale-95' : 'hover:scale-105'
        } ${triggerSOSMutation.isPending ? 'opacity-75 cursor-not-allowed' : ''}`}
        onMouseDown={handleSOSPress}
        onMouseUp={handleSOSRelease}
        onMouseLeave={handleSOSRelease}
        onTouchStart={handleSOSPress}
        onTouchEnd={handleSOSRelease}
        disabled={triggerSOSMutation.isPending}
        data-testid="button-sos"
      >
        {isPressed && countdown > 0 ? (
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{countdown}</div>
            <div className="text-sm">Activating...</div>
          </div>
        ) : triggerSOSMutation.isPending ? (
          <div className="text-center">
            <div className="animate-spin mb-2 flex justify-center">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="text-sm">Sending Alert...</div>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="text-lg font-bold">SOS</div>
            <div className="text-sm opacity-90">EMERGENCY</div>
          </div>
        )}
      </button>
      
      <p className="text-xs text-muted-foreground mt-4 max-w-xs mx-auto">
        This will notify your trusted contacts, nearby volunteers, and authorities with your location
      </p>
    </div>
  );
}
