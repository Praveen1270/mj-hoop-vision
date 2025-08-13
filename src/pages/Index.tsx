import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoUpload } from "@/components/VideoUpload";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { 
  Brain, 
  Video, 
  Target, 
  BarChart3, 
  Zap,
  Star,
  Trophy,
  Play
} from "lucide-react";
import basketballCourt from "@/assets/basketball-court.jpg";
import mjLogo from "@/assets/mj-logo.png";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'upload' | 'dashboard'>('landing');
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);

  const handleVideoSelect = (file: File) => {
    setUploadedVideo(file);
    // Simulate processing
    setTimeout(() => {
      setCurrentView('dashboard');
    }, 2000);
  };

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={mjLogo} alt="MJ Analysis" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Basketball AI Coach</h1>
                <p className="text-sm text-muted-foreground">Powered by Michael Jordan's Mindset</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="court" size="sm" onClick={() => setCurrentView('upload')}>
                <Video className="w-4 h-4" />
                New Analysis
              </Button>
              <Button variant="mj" size="sm">
                <Trophy className="w-4 h-4" />
                Championship Mode
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">Game Analysis</h2>
            <p className="text-muted-foreground">
              {uploadedVideo?.name} • Processed with MJ's championship standards
            </p>
          </div>
          <AnalysisDashboard />
        </main>
      </div>
    );
  }

  if (currentView === 'upload') {
    return (
      <div 
        className="min-h-screen bg-background relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${basketballCourt})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-court/50" />
        
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              className="mb-4 text-muted-foreground hover:text-foreground"
              onClick={() => setCurrentView('landing')}
            >
              ← Back to Home
            </Button>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Upload Your Game Footage
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let AI analyze your basketball performance with the mindset of a champion
            </p>
          </div>

          <VideoUpload onVideoSelect={handleVideoSelect} />

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">What happens next?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card variant="court">
                <CardContent className="p-6 text-center">
                  <Brain className="w-8 h-8 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Object detection, pose estimation, and shot tracking at 1 FPS
                  </p>
                </CardContent>
              </Card>
              
              <Card variant="court">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Form Evaluation</h3>
                  <p className="text-sm text-muted-foreground">
                    Elbow angle, balance, and shooting mechanics analysis
                  </p>
                </CardContent>
              </Card>
              
              <Card variant="court">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">MJ Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    Championship-level coaching insights and motivation
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-background relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${basketballCourt})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-court/30" />
      
      {/* Hero Section */}
      <div className="relative z-10">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={mjLogo} alt="Basketball AI Coach" className="w-12 h-12" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Basketball AI Coach</h1>
                <p className="text-sm text-accent">Powered by Michael Jordan's Mindset</p>
              </div>
            </div>
            <Button variant="mj" size="lg">
              Start Analysis
            </Button>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold text-foreground mb-6 leading-tight">
              Train Like a
              <span className="text-transparent bg-gradient-mj bg-clip-text"> Champion</span>
            </h2>
            <p className="text-2xl text-muted-foreground mb-8 leading-relaxed">
              AI-powered basketball analysis that gives you feedback in the style of Michael Jordan. 
              Upload your game footage and get championship-level insights.
            </p>
            
            <div className="flex gap-4 justify-center mb-16">
              <Button 
                variant="mj" 
                size="xl"
                onClick={() => setCurrentView('upload')}
                className="group"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Start Your Analysis
              </Button>
              <Button variant="court" size="xl">
                <Video className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card variant="stats" className="group hover:scale-105 transition-transform">
                <CardHeader className="pb-3">
                  <Brain className="w-8 h-8 text-accent mx-auto mb-2" />
                  <CardTitle className="text-lg">Object Detection</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Track ball and hoop position with YOLOv8 precision
                  </CardDescription>
                </CardContent>
              </Card>

              <Card variant="stats" className="group hover:scale-105 transition-transform">
                <CardHeader className="pb-3">
                  <Target className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <CardTitle className="text-lg">Shot Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Analyze make/miss ratio and shooting patterns
                  </CardDescription>
                </CardContent>
              </Card>

              <Card variant="stats" className="group hover:scale-105 transition-transform">
                <CardHeader className="pb-3">
                  <BarChart3 className="w-8 h-8 text-accent mx-auto mb-2" />
                  <CardTitle className="text-lg">Form Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Pose estimation for perfect shooting mechanics
                  </CardDescription>
                </CardContent>
              </Card>

              <Card variant="stats" className="group hover:scale-105 transition-transform">
                <CardHeader className="pb-3">
                  <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">MJ Coaching</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get motivated with championship mindset feedback
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Quote Section */}
            <div className="mt-20 max-w-3xl mx-auto">
              <Card variant="court" className="bg-gradient-mj/10 border-primary/30">
                <CardContent className="p-8">
                  <blockquote className="text-2xl font-medium text-foreground italic leading-relaxed">
                    "I've failed over and over and over again in my life. 
                    And that is why I succeed."
                  </blockquote>
                  <cite className="block mt-4 text-accent font-semibold">
                    — Michael Jordan
                  </cite>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;