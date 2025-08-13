import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ShotAnalysis, GameStats } from "@/lib/basketballAnalyzer";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Target, 
  TrendingUp, 
  TrendingDown,
  MapPin,
  Clock,
  Award,
  Activity
} from "lucide-react";

interface VideoPlayerProps {
  videoFile: File;
  shots: ShotAnalysis[];
  gameStats: GameStats;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoFile, shots, gameStats }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedShot, setSelectedShot] = useState<ShotAnalysis | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const jumpToShot = (shot: ShotAnalysis) => {
    if (videoRef.current) {
      videoRef.current.currentTime = shot.timestamp;
      setSelectedShot(shot);
    }
  };

  const getShotIcon = (result: 'make' | 'miss') => {
    return result === 'make' 
      ? <TrendingUp className="w-4 h-4 text-accent" />
      : <TrendingDown className="w-4 h-4 text-primary" />;
  };

  const getShotTypeColor = (shotType: string) => {
    switch (shotType) {
      case 'three_pointer': return 'text-accent';
      case 'layup': return 'text-secondary';
      case 'jump_shot': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Game Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="stats">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Total Shots</span>
            </div>
            <div className="text-2xl font-bold">{gameStats.totalShots}</div>
          </CardContent>
        </Card>

        <Card variant="stats">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Makes</span>
            </div>
            <div className="text-2xl font-bold text-accent">{gameStats.makes}</div>
          </CardContent>
        </Card>

        <Card variant="stats">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Misses</span>
            </div>
            <div className="text-2xl font-bold text-primary">{gameStats.misses}</div>
          </CardContent>
        </Card>

        <Card variant="stats">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-accent">{gameStats.overallAccuracy.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Shot Type Breakdown */}
      <Card variant="court">
        <CardHeader>
          <CardTitle>Shot Breakdown</CardTitle>
          <CardDescription>Detailed breakdown by shot type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-secondary">
                {gameStats.layups.makes}/{gameStats.layups.makes + gameStats.layups.misses}
              </div>
              <div className="text-sm text-muted-foreground">Layups</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-primary">
                {gameStats.jumpShots.makes}/{gameStats.jumpShots.makes + gameStats.jumpShots.misses}
              </div>
              <div className="text-sm text-muted-foreground">Jump Shots</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-accent">
                {gameStats.threePointers.makes}/{gameStats.threePointers.makes + gameStats.threePointers.misses}
              </div>
              <div className="text-sm text-muted-foreground">Three Pointers</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-muted-foreground">
                {gameStats.freeThrows.makes}/{gameStats.freeThrows.makes + gameStats.freeThrows.misses}
              </div>
              <div className="text-sm text-muted-foreground">Free Throws</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Player */}
      <Card variant="court">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Game Footage Analysis</span>
            <div className="flex gap-2">
              <Button variant="mj" size="sm" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button variant="court" size="sm" onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  setCurrentTime(0);
                }
              }}>
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-court rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={URL.createObjectURL(videoFile)}
              className="w-full h-auto max-h-96"
              controls
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Shot Timeline */}
      <Card variant="analysis">
        <CardHeader>
          <CardTitle>Shot Timeline</CardTitle>
          <CardDescription>
            Click on any shot to jump to that moment in the video
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {shots.map((shot, index) => (
              <div 
                key={index}
                className={`p-3 bg-muted/10 rounded-lg cursor-pointer hover:bg-muted/20 transition-colors ${
                  selectedShot?.frameNumber === shot.frameNumber ? 'ring-2 ring-accent' : ''
                }`}
                onClick={() => jumpToShot(shot)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getShotIcon(shot.result)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{shot.shotType.replace('_', ' ').toUpperCase()}</span>
                        <span className={`text-sm ${getShotTypeColor(shot.shotType)}`}>
                          {shot.result.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.floor(shot.timestamp / 60)}:{String(Math.floor(shot.timestamp % 60)).padStart(2, '0')}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {shot.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          Form: {shot.playerPose.elbowAngle.toFixed(0)}°
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Confidence</div>
                    <div className="font-medium">{(shot.confidence * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Shot Analysis */}
      {selectedShot && (
        <Card variant="stats">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Shot Analysis - {selectedShot.shotType.replace('_', ' ').toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* MJ Feedback */}
            <div className="bg-gradient-mj/10 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-primary mb-1">Michael Jordan says:</p>
                  <p className="text-foreground italic leading-relaxed">
                    "{selectedShot.mjFeedback}"
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <div className="text-lg font-bold text-accent">{selectedShot.playerPose.elbowAngle.toFixed(0)}°</div>
                <div className="text-sm text-muted-foreground">Elbow Angle</div>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <div className="text-lg font-bold text-secondary">{selectedShot.playerPose.kneeAngle.toFixed(0)}°</div>
                <div className="text-sm text-muted-foreground">Knee Angle</div>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <div className="text-lg font-bold text-accent">{(selectedShot.playerPose.balance * 10).toFixed(1)}/10</div>
                <div className="text-sm text-muted-foreground">Balance</div>
              </div>
              <div className="text-center p-3 bg-muted/20 rounded-lg">
                <div className="text-lg font-bold text-primary">{(selectedShot.playerPose.followThrough * 10).toFixed(1)}/10</div>
                <div className="text-sm text-muted-foreground">Follow Through</div>
              </div>
            </div>

            {/* Technical Notes */}
            {selectedShot.technicalNotes.length > 0 && (
              <div>
                <h4 className="font-medium text-accent mb-2">Technical Improvements:</h4>
                <ul className="space-y-1">
                  {selectedShot.technicalNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};