import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users } from "lucide-react";

interface Volunteer {
  id: string;
  name: string;
  rating: number;
  distance: string;
  eta: string;
  status: "available" | "busy";
}

// Mock volunteer data - in real implementation, this would come from the API
const mockVolunteers: Volunteer[] = [
  {
    id: "1",
    name: "Sarah Chen",
    rating: 4.9,
    distance: "120m",
    eta: "2 min",
    status: "available"
  },
  {
    id: "2",
    name: "Maya Patel",
    rating: 4.8,
    distance: "250m",
    eta: "4 min",
    status: "available"
  },
  {
    id: "3",
    name: "Lisa Johnson",
    rating: 4.7,
    distance: "380m",
    eta: "5 min",
    status: "busy"
  }
];

export default function VolunteerCard() {
  const availableVolunteers = mockVolunteers.filter(v => v.status === "available");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    return status === "available" ? "bg-green-500" : "bg-yellow-500";
  };

  const handleBecomeVolunteer = () => {
    // Navigate to volunteer registration/profile page
    window.location.href = "/profile";
  };

  return (
    <Card data-testid="volunteer-section">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Nearby Volunteers</h3>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            {availableVolunteers.length} available
          </span>
        </div>
        
        <div className="space-y-3">
          {mockVolunteers.map((volunteer) => (
            <div 
              key={volunteer.id} 
              className="flex items-center justify-between"
              data-testid={`volunteer-item-${volunteer.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium text-sm">
                    {getInitials(volunteer.name)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{volunteer.name}</p>
                  <p className="text-xs text-muted-foreground">
                    <Star className="inline h-3 w-3 text-yellow-500 mr-1" />
                    <span>{volunteer.rating}</span> • <span>{volunteer.distance} away</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`w-2 h-2 rounded-full mb-1 ${getStatusColor(volunteer.status)}`}></div>
                <p className="text-xs text-muted-foreground">{volunteer.eta}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full text-center text-primary"
            onClick={handleBecomeVolunteer}
            data-testid="button-become-volunteer"
          >
            <Users className="h-4 w-4 mr-2" />
            Become a Volunteer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
