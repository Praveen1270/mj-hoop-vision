import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

interface FeedbackData {
  type: 'make' | 'miss';
  shotType: string;
  location: string;
  formScore: number;
  feedback: string;
  tips?: string[];
}

export const MJFeedback = ({ feedback }: { feedback: FeedbackData }) => {
  const getIcon = () => {
    switch (feedback.type) {
      case 'make':
        return <TrendingUp className="w-5 h-5 text-accent" />;
      case 'miss':
        return <TrendingDown className="w-5 h-5 text-primary" />;
      default:
        return <Target className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-accent";
    if (score >= 6) return "text-secondary";
    return "text-primary";
  };

  return (
    <Card variant="stats" className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getIcon()}
            <span>MJ Analysis</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-accent text-accent">
              {feedback.shotType}
            </Badge>
            <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
              {feedback.location}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form Score */}
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
          <span className="font-medium">Form Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(feedback.formScore)}`}>
            {feedback.formScore}/10
          </span>
        </div>

        {/* MJ Feedback */}
        <div className="bg-gradient-mj/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium text-primary mb-1">Michael Jordan says:</p>
              <p className="text-foreground italic leading-relaxed">
                "{feedback.feedback}"
              </p>
            </div>
          </div>
        </div>

        {/* Technical Tips */}
        {feedback.tips && feedback.tips.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-accent">Technical Improvements:</h4>
            <ul className="space-y-1">
              {feedback.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};