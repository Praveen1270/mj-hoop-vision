import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { basketballAnalyzer, ShotAnalysis, GameStats } from "@/lib/basketballAnalyzer";
import { Loader2, Brain, Zap, Target } from "lucide-react";

interface VideoProcessorProps {
  videoFile: File;
  onAnalysisComplete: (shots: ShotAnalysis[], gameStats: GameStats) => void;
}

export const VideoProcessor: React.FC<VideoProcessorProps> = ({ 
  videoFile, 
  onAnalysisComplete 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const startAnalysis = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      setCurrentStep('Initializing AI models...');
      await basketballAnalyzer.initialize();
      
      setCurrentStep('Analyzing video at 1 FPS...');
      const result = await basketballAnalyzer.analyzeVideo(videoFile, (progressPercent) => {
        setProgress(progressPercent);
        if (progressPercent < 30) {
          setCurrentStep('Detecting ball and hoop positions...');
        } else if (progressPercent < 60) {
          setCurrentStep('Tracking shot trajectories...');
        } else if (progressPercent < 85) {
          setCurrentStep('Analyzing shooting form...');
        } else {
          setCurrentStep('Generating MJ feedback...');
        }
      });
      
      setCurrentStep('Analysis complete!');
      onAnalysisComplete(result.shots, result.gameStats);
    } catch (error) {
      console.error('Analysis failed:', error);
      setCurrentStep('Analysis failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card variant="court" className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-accent flex items-center justify-center gap-2">
          <Brain className="w-6 h-6" />
          AI Basketball Analysis
        </CardTitle>
        <CardDescription>
          Ready to analyze your basketball footage with Michael Jordan's coaching style
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Video Info */}
        <div className="bg-muted/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{videoFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Processing Speed</p>
              <p className="font-medium text-accent">1 FPS</p>
            </div>
          </div>
        </div>

        {/* Analysis Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-mj/10 rounded-lg border border-primary/20">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-medium mb-1">Shot Detection</h4>
            <p className="text-sm text-muted-foreground">Track makes, misses, and shot types</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-ball/10 rounded-lg border border-secondary/20">
            <Brain className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h4 className="font-medium mb-1">Form Analysis</h4>
            <p className="text-sm text-muted-foreground">Analyze shooting mechanics</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-gold/10 rounded-lg border border-accent/20">
            <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
            <h4 className="font-medium mb-1">MJ Coaching</h4>
            <p className="text-sm text-muted-foreground">Championship mindset feedback</p>
          </div>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-accent">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-medium">{currentStep}</span>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">
              {progress.toFixed(0)}% complete
            </p>
          </div>
        )}

        {/* Start Analysis Button */}
        {!isProcessing && (
          <Button 
            variant="mj" 
            size="lg" 
            className="w-full"
            onClick={startAnalysis}
          >
            <Brain className="w-5 h-5 mr-2" />
            Start AI Analysis
          </Button>
        )}

        {/* What to Expect */}
        <div className="bg-gradient-court/30 rounded-lg p-4 border border-accent/20">
          <h4 className="font-medium text-accent mb-2">What You'll Get:</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Total shots made and missed</li>
            <li>• Breakdown by shot type (layups, jump shots, three-pointers)</li>
            <li>• Shot locations and success rates</li>
            <li>• Individual form analysis for each shot</li>
            <li>• Michael Jordan style feedback and motivation</li>
            <li>• Technical improvements for better performance</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};