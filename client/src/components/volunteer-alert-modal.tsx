import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Clock, X, Check } from "lucide-react";

interface VolunteerAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert?: {
    id: string;
    distance: string;
    estimatedTime: string;
    alertType: string;
    address?: string;
  };
}

export default function VolunteerAlertModal({ isOpen, onClose, alert }: VolunteerAlertModalProps) {
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds to respond
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Countdown timer for response window
  useEffect(() => {
    if (!isOpen) {
      setTimeRemaining(30);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose(); // Auto-close if no response
          toast({
            title: "Alert Expired",
            description: "The emergency alert response window has expired.",
            variant: "destructive",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose, toast]);

  const respondToAlertMutation = useMutation({
    mutationFn: async (response: { alertId: string; status: 'accepted' | 'declined'; estimatedArrival?: number }) => {
      await apiRequest("POST", "/api/volunteer-response", response);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/activity-logs"] });
      onClose();
      
      if (variables.status === 'accepted') {
        toast({
          title: "Response Accepted",
          description: "Thank you for responding! Navigation guidance will be provided.",
        });
      } else {
        toast({
          title: "Response Declined",
          description: "Thank you for letting us know. Other volunteers will be notified.",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to respond to alert. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAcceptAlert = () => {
    if (!alert) return;
    
    respondToAlertMutation.mutate({
      alertId: alert.id,
      status: 'accepted',
      estimatedArrival: parseInt(alert.estimatedTime) || 5,
    });
  };

  const handleDeclineAlert = () => {
    if (!alert) return;
    
    respondToAlertMutation.mutate({
      alertId: alert.id,
      status: 'declined',
    });
  };

  if (!alert) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md bg-card border-0 shadow-2xl"
        data-testid="volunteer-alert-modal"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Emergency Alert</h2>
          <p className="text-sm text-muted-foreground">Someone nearby needs help</p>
          
          {/* Response Timer */}
          <div className="mt-4 p-2 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm font-medium text-red-800">
              Respond within: <span className="font-bold">{timeRemaining}s</span>
            </p>
          </div>
        </div>
        
        <div className="bg-muted rounded-lg p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Distance</span>
            <span className="text-sm text-red-600 font-bold" data-testid="text-alert-distance">
              {alert.distance}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estimated Time</span>
            <span className="text-sm font-bold" data-testid="text-alert-eta">
              {alert.estimatedTime}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Alert Type</span>
            <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded-full" data-testid="text-alert-type">
              {alert.alertType === 'general' ? 'General Emergency' : alert.alertType}
            </span>
          </div>
          {alert.address && (
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground" data-testid="text-alert-address">
                {alert.address}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            className="flex-1 py-4"
            onClick={handleDeclineAlert}
            disabled={respondToAlertMutation.isPending}
            data-testid="button-decline-alert"
          >
            <X className="h-4 w-4 mr-2" />
            Decline
          </Button>
          <Button 
            className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white"
            onClick={handleAcceptAlert}
            disabled={respondToAlertMutation.isPending}
            data-testid="button-accept-alert"
          >
            <Check className="h-4 w-4 mr-2" />
            {respondToAlertMutation.isPending ? "Responding..." : "Respond"}
          </Button>
        </div>
        
        <p className="text-xs text-center text-muted-foreground mt-4">
          By responding, you agree to help safely and follow volunteer guidelines
        </p>
      </DialogContent>
    </Dialog>
  );
}
