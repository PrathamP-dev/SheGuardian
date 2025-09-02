import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MapPin, X } from "lucide-react";

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function IncidentReportModal({ isOpen, onClose }: IncidentReportModalProps) {
  const [formData, setFormData] = useState({
    incidentType: "",
    title: "",
    description: "",
    severity: "medium",
    isPublic: false,
    tags: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createReportMutation = useMutation({
    mutationFn: async (reportData: any) => {
      await apiRequest("POST", "/api/incident-reports", reportData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/incident-reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activity-logs"] });
      onClose();
      resetForm();
      toast({
        title: "Report Submitted",
        description: "Your incident report has been submitted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      incidentType: "",
      title: "",
      description: "",
      severity: "medium",
      isPublic: false,
      tags: "",
      address: "",
      latitude: "",
      longitude: "",
    });
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
          address: "Current location detected"
        }));
        toast({
          title: "Location Detected",
          description: "Current location has been added to your report.",
        });
      },
      (error) => {
        toast({
          title: "Location Error",
          description: "Unable to detect your location. Please enter manually.",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.incidentType || !formData.title || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const reportData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
    };

    createReportMutation.mutate(reportData);
  };

  const handleClose = () => {
    if (!createReportMutation.isPending) {
      onClose();
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="incident-report-modal">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Report Incident</DialogTitle>
            <button
              onClick={handleClose}
              className="w-6 h-6 bg-muted rounded flex items-center justify-center"
              disabled={createReportMutation.isPending}
              data-testid="button-close-modal"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="incidentType">Incident Type *</Label>
            <Select 
              value={formData.incidentType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, incidentType: value }))}
            >
              <SelectTrigger data-testid="select-incident-type">
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="stalking">Stalking</SelectItem>
                <SelectItem value="theft">Theft</SelectItem>
                <SelectItem value="unsafe_area">Unsafe Area</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief summary of the incident"
              data-testid="input-incident-title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what happened..."
              className="h-24 resize-none"
              data-testid="textarea-incident-description"
            />
          </div>
          
          <div>
            <Label htmlFor="severity">Severity</Label>
            <Select 
              value={formData.severity} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}
            >
              <SelectTrigger data-testid="select-incident-severity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g., night, parking lot, downtown (comma separated)"
              data-testid="input-incident-tags"
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="flex space-x-2">
              <Input
                id="location"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter location or use current"
                className="flex-1"
                data-testid="input-incident-location"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGetCurrentLocation}
                className="px-3"
                data-testid="button-current-location"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
              data-testid="switch-public-report"
            />
            <Label htmlFor="isPublic" className="text-sm">
              Make this report public to help warn others
            </Label>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="flex-1"
              disabled={createReportMutation.isPending}
              data-testid="button-cancel-report"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createReportMutation.isPending}
              data-testid="button-submit-report"
            >
              {createReportMutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
