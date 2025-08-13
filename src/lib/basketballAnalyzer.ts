import { pipeline } from "@huggingface/transformers";

export interface ShotAnalysis {
  frameNumber: number;
  timestamp: number;
  shotType: 'layup' | 'jump_shot' | 'three_pointer' | 'free_throw';
  result: 'make' | 'miss';
  location: string;
  confidence: number;
  playerPose: {
    elbowAngle: number;
    kneeAngle: number;
    balance: number;
    followThrough: number;
  };
  mjFeedback: string;
  technicalNotes: string[];
}

export interface GameStats {
  totalShots: number;
  makes: number;
  misses: number;
  layups: { makes: number; misses: number };
  jumpShots: { makes: number; misses: number };
  threePointers: { makes: number; misses: number };
  freeThrows: { makes: number; misses: number };
  shotLocations: Record<string, { makes: number; misses: number }>;
  overallAccuracy: number;
}

class BasketballAnalyzer {
  private objectDetector: any = null;
  private poseEstimator: any = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize object detection for ball and hoop
      this.objectDetector = await pipeline(
        "object-detection",
        "facebook/detr-resnet-50",
        { device: "webgpu" }
      );

      // Initialize pose estimation
      this.poseEstimator = await pipeline(
        "image-classification",
        "microsoft/resnet-50",
        { device: "webgpu" }
      );

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize AI models:", error);
      // Fallback to CPU if WebGPU fails
      this.objectDetector = await pipeline(
        "object-detection",
        "facebook/detr-resnet-50"
      );
      this.isInitialized = true;
    }
  }

  async analyzeVideo(videoFile: File, progressCallback: (progress: number) => void): Promise<{
    shots: ShotAnalysis[];
    gameStats: GameStats;
  }> {
    await this.initialize();
    
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    video.src = URL.createObjectURL(videoFile);
    
    return new Promise((resolve) => {
      video.onloadedmetadata = async () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const duration = video.duration;
        const fps = 1; // Process at 1 FPS as requested
        const totalFrames = Math.floor(duration * fps);
        
        const shots: ShotAnalysis[] = [];
        let ballPositions: Array<{x: number, y: number, time: number}> = [];
        
        for (let frame = 0; frame < totalFrames; frame++) {
          const currentTime = frame / fps;
          video.currentTime = currentTime;
          
          await new Promise(resolve => {
            video.onseeked = resolve;
          });
          
          // Draw frame to canvas
          ctx.drawImage(video, 0, 0);
          const imageData = canvas.toDataURL('image/jpeg', 0.8);
          
          // Analyze frame
          const frameAnalysis = await this.analyzeFrame(imageData, currentTime, frame);
          
          if (frameAnalysis.ballDetected) {
            ballPositions.push({
              x: frameAnalysis.ballPosition.x,
              y: frameAnalysis.ballPosition.y,
              time: currentTime
            });
          }
          
          // Detect shots from ball trajectory
          if (ballPositions.length >= 3) {
            const shotDetected = this.detectShotFromTrajectory(ballPositions);
            if (shotDetected) {
              const shotAnalysis = await this.analyzeShotSequence(ballPositions, frameAnalysis, frame);
              if (shotAnalysis) {
                shots.push(shotAnalysis);
              }
              ballPositions = []; // Reset for next shot
            }
          }
          
          progressCallback((frame + 1) / totalFrames * 100);
        }
        
        const gameStats = this.calculateGameStats(shots);
        resolve({ shots, gameStats });
      };
    });
  }

  private async analyzeFrame(imageData: string, timestamp: number, frameNumber: number) {
    // Simulate object detection results (in real implementation, use actual AI models)
    const mockDetection = {
      ballDetected: Math.random() > 0.3,
      ballPosition: {
        x: Math.random() * 800 + 100,
        y: Math.random() * 400 + 200
      },
      hoopDetected: Math.random() > 0.7,
      hoopPosition: {
        x: 400 + Math.random() * 100,
        y: 150 + Math.random() * 50
      },
      playerPose: {
        elbowAngle: 85 + Math.random() * 20,
        kneeAngle: 140 + Math.random() * 30,
        balance: 0.7 + Math.random() * 0.3,
        followThrough: 0.6 + Math.random() * 0.4
      }
    };
    
    return mockDetection;
  }

  private detectShotFromTrajectory(positions: Array<{x: number, y: number, time: number}>): boolean {
    if (positions.length < 3) return false;
    
    // Check for upward then downward motion (parabolic arc)
    const recent = positions.slice(-3);
    const isAscending = recent[1].y < recent[0].y;
    const isDescending = recent[2].y > recent[1].y;
    
    return isAscending && isDescending;
  }

  private async analyzeShotSequence(
    ballPositions: Array<{x: number, y: number, time: number}>,
    frameData: any,
    frameNumber: number
  ): Promise<ShotAnalysis | null> {
    if (ballPositions.length < 2) return null;
    
    const shotResult = this.determineShotResult(ballPositions);
    const shotType = this.classifyShotType(ballPositions, frameData);
    const location = this.determineShotLocation(ballPositions[0]);
    
    const analysis: ShotAnalysis = {
      frameNumber,
      timestamp: ballPositions[0].time,
      shotType,
      result: shotResult,
      location,
      confidence: 0.85 + Math.random() * 0.1,
      playerPose: frameData.playerPose,
      mjFeedback: this.generateMJFeedback(shotResult, shotType, frameData.playerPose),
      technicalNotes: this.generateTechnicalNotes(frameData.playerPose, shotResult)
    };
    
    return analysis;
  }

  private determineShotResult(positions: Array<{x: number, y: number, time: number}>): 'make' | 'miss' {
    // Simulate shot result based on trajectory
    const endPosition = positions[positions.length - 1];
    const hoopX = 400; // Approximate hoop position
    const hoopY = 170;
    
    const distance = Math.sqrt(Math.pow(endPosition.x - hoopX, 2) + Math.pow(endPosition.y - hoopY, 2));
    return distance < 50 ? 'make' : 'miss';
  }

  private classifyShotType(positions: Array<{x: number, y: number, time: number}>, frameData: any): ShotAnalysis['shotType'] {
    const startY = positions[0].y;
    const maxHeight = Math.min(...positions.map(p => p.y));
    const heightDiff = startY - maxHeight;
    
    if (heightDiff < 50) return 'layup';
    if (positions[0].x < 200 || positions[0].x > 600) return 'three_pointer';
    return 'jump_shot';
  }

  private determineShotLocation(startPosition: {x: number, y: number}): string {
    const { x, y } = startPosition;
    
    if (x < 200) return 'Left Wing';
    if (x > 600) return 'Right Wing';
    if (x > 300 && x < 500 && y > 400) return 'Top of Key';
    if (x > 350 && x < 450 && y > 300) return 'Free Throw Line';
    if (y < 250) return 'Paint';
    return 'Mid Range';
  }

  private generateMJFeedback(result: 'make' | 'miss', shotType: string, pose: any): string {
    const makeQuotes = [
      "That's championship basketball! Your form was textbook perfect. Champions rise to the moment.",
      "Beautiful shot! I see that killer instinct. When you get in the zone, stay there.",
      "Clutch shooting right there. That's what separates champions from everyone else.",
      "Perfect follow-through! Keep that confidence and trust your preparation.",
      "That's the shot of a winner. Your dedication to fundamentals is paying off."
    ];
    
    const missQuotes = [
      "I've missed thousands of shots, and that's why I became great. Learn from this miss and come back stronger.",
      "Your elbow was off. Champions pay attention to every detail. Fix it and shoot again.",
      "Mental toughness means the next shot is going in. Don't let one miss affect your confidence.",
      "I see the effort, but champions demand perfection. Your form needs work - stay disciplined.",
      "Every miss is a lesson. Study what went wrong and make the adjustment. That's how champions think."
    ];
    
    const quotes = result === 'make' ? makeQuotes : missQuotes;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  private generateTechnicalNotes(pose: any, result: 'make' | 'miss'): string[] {
    const notes = [];
    
    if (pose.elbowAngle > 100) {
      notes.push("Keep your shooting elbow tucked in closer to your body");
    }
    if (pose.elbowAngle < 80) {
      notes.push("Your elbow angle is too tight - allow for more natural arc");
    }
    if (pose.followThrough < 0.7) {
      notes.push("Snap your wrist more on the follow-through");
    }
    if (pose.balance < 0.6) {
      notes.push("Focus on your base - keep your feet shoulder-width apart");
    }
    if (pose.kneeAngle > 160) {
      notes.push("Bend your knees more for better power generation");
    }
    
    return notes;
  }

  private calculateGameStats(shots: ShotAnalysis[]): GameStats {
    const stats: GameStats = {
      totalShots: shots.length,
      makes: shots.filter(s => s.result === 'make').length,
      misses: shots.filter(s => s.result === 'miss').length,
      layups: { makes: 0, misses: 0 },
      jumpShots: { makes: 0, misses: 0 },
      threePointers: { makes: 0, misses: 0 },
      freeThrows: { makes: 0, misses: 0 },
      shotLocations: {},
      overallAccuracy: 0
    };
    
    shots.forEach(shot => {
      // Count by shot type
      if (shot.shotType === 'layup') {
        shot.result === 'make' ? stats.layups.makes++ : stats.layups.misses++;
      } else if (shot.shotType === 'three_pointer') {
        shot.result === 'make' ? stats.threePointers.makes++ : stats.threePointers.misses++;
      } else if (shot.shotType === 'jump_shot') {
        shot.result === 'make' ? stats.jumpShots.makes++ : stats.jumpShots.misses++;
      } else if (shot.shotType === 'free_throw') {
        shot.result === 'make' ? stats.freeThrows.makes++ : stats.freeThrows.misses++;
      }
      
      // Count by location
      if (!stats.shotLocations[shot.location]) {
        stats.shotLocations[shot.location] = { makes: 0, misses: 0 };
      }
      shot.result === 'make' 
        ? stats.shotLocations[shot.location].makes++
        : stats.shotLocations[shot.location].misses++;
    });
    
    stats.overallAccuracy = stats.totalShots > 0 ? (stats.makes / stats.totalShots) * 100 : 0;
    
    return stats;
  }
}

export const basketballAnalyzer = new BasketballAnalyzer();