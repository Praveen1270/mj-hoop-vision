import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Upload, Play, FileVideo } from "lucide-react";

export const VideoUpload = ({ onVideoSelect }: { onVideoSelect: (file: File) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('video/')) {
      setSelectedFile(files[0]);
      onVideoSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      onVideoSelect(file);
    }
  };

  return (
    <Card variant="court" className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-accent flex items-center justify-center gap-2">
          <FileVideo className="w-6 h-6" />
          Upload Basketball Footage
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Upload your basketball game footage for AI-powered analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
            ${isDragging 
              ? 'border-accent bg-accent/10 scale-105' 
              : 'border-muted-foreground/30 hover:border-accent/50'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-accent" />
          <p className="text-lg font-medium mb-2">
            Drop your basketball video here
          </p>
          <p className="text-muted-foreground mb-4">
            Supports MP4, AVI, MOV formats
          </p>
          
          <input
            type="file"
            accept="video/*"
            onChange={handleFileInput}
            className="hidden"
            id="video-upload"
          />
          <label htmlFor="video-upload">
            <Button variant="mj" size="lg" className="cursor-pointer">
              Choose Video File
            </Button>
          </label>
          
          {selectedFile && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-accent">
                <Play className="w-4 h-4" />
                <span className="font-medium">{selectedFile.name}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};