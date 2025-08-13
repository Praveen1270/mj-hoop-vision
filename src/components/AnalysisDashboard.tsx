import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MJFeedback } from "./MJFeedback";
import { 
  BarChart3, 
  Target, 
  Activity, 
  MapPin, 
  Clock,
  Download,
  Share
} from "lucide-react";

export const AnalysisDashboard = () => {
  // Mock data - in real app this would come from your Python backend
  const mockFeedback = {
    type: 'make' as const,
    shotType: 'Jump Shot',
    location: 'Right Wing',
    formScore: 8.5,
    feedback: "That's championship basketball right there! Your follow-through was perfect, elbow stayed in line. Champions make shots when it matters most. Keep that confidence and trust your fundamentals.",
    tips: [
      "Maintain consistent shooting arc - aim for 45-50 degrees",
      "Keep your shooting elbow aligned under the ball",
      "Follow through with snap of the wrist"
    ]
  };

  const stats = {
    totalShots: 24,
    makes: 16,
    misses: 8,
    accuracy: 66.7,
    avgFormScore: 7.8
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="stats">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" />
              Shot Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.accuracy}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.makes}/{stats.totalShots} shots
            </p>
          </CardContent>
        </Card>

        <Card variant="stats">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Form Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.avgFormScore}/10</div>
            <p className="text-xs text-muted-foreground">
              Average across all shots
            </p>
          </CardContent>
        </Card>

        <Card variant="stats">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Hot Zones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Right Wing</div>
            <p className="text-xs text-muted-foreground">
              Best shooting location
            </p>
          </CardContent>
        </Card>

        <Card variant="stats">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Analysis Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">2:45</div>
            <p className="text-xs text-muted-foreground">
              Processing completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Analysis */}
      <MJFeedback feedback={mockFeedback} />

      {/* Shot Chart */}
      <Card variant="court">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Shot Chart Analysis
            </div>
            <div className="flex gap-2">
              <Button variant="court" size="sm">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="mj" size="sm">
                <Share className="w-4 h-4" />
                Share
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Visual breakdown of shot locations and success rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-court rounded-lg border border-accent/20 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Interactive shot chart will appear here</p>
              <p className="text-sm">Showing all 24 shot attempts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Shots */}
      <Card variant="analysis">
        <CardHeader>
          <CardTitle>Recent Shot Analysis</CardTitle>
          <CardDescription>
            Last 5 shots with MJ feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { shot: 1, type: "Jump Shot", result: "Make", score: 8.5, location: "Right Wing" },
              { shot: 2, type: "Three Pointer", result: "Miss", score: 6.2, location: "Top of Key" },
              { shot: 3, type: "Layup", result: "Make", score: 9.1, location: "Paint" },
              { shot: 4, type: "Jump Shot", result: "Make", score: 7.8, location: "Left Elbow" },
              { shot: 5, type: "Free Throw", result: "Make", score: 8.9, location: "Free Throw Line" }
            ].map((shot) => (
              <div key={shot.shot} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={shot.result === 'Make' ? 'default' : 'destructive'}>
                    {shot.result}
                  </Badge>
                  <div>
                    <p className="font-medium">{shot.type}</p>
                    <p className="text-sm text-muted-foreground">{shot.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent">{shot.score}/10</p>
                  <p className="text-xs text-muted-foreground">Form Score</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};