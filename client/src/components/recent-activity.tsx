import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, MapPin, Users, Clock } from "lucide-react";
import type { ActivityLog } from "@shared/schema";

export default function RecentActivity() {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["/api/activity-logs"],
  });

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case "safety_check":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "location_shared":
        return <MapPin className="h-4 w-4 text-blue-600" />;
      case "volunteer_response":
        return <Users className="h-4 w-4 text-purple-600" />;
      case "sos_triggered":
        return <Clock className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (actionType: string) => {
    switch (actionType) {
      case "safety_check":
        return "bg-green-100";
      case "location_shared":
        return "bg-blue-100";
      case "volunteer_response":
        return "bg-purple-100";
      case "sos_triggered":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Less than 1 hour ago";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const handleViewAll = () => {
    window.location.href = "/reports";
  };

  return (
    <Card data-testid="recent-activity-section">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Recent Activity</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-primary"
            onClick={handleViewAll}
            data-testid="button-view-all-activity"
          >
            View All
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 mt-0.5"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-48 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-6">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No recent activity</p>
            <p className="text-muted-foreground text-xs">
              Your safety actions will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 3).map((activity: ActivityLog) => (
              <div 
                key={activity.id} 
                className="flex items-start space-x-3"
                data-testid={`activity-item-${activity.id}`}
              >
                <div className={`w-8 h-8 ${getActivityColor(activity.actionType)} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {getActivityIcon(activity.actionType)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(activity.createdAt!)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
