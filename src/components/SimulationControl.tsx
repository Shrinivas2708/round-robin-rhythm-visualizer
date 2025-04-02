
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RefreshCw, 
  Clock 
} from 'lucide-react';

interface SimulationControlProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  currentTime: number | null;
  isSimulated: boolean;
}

const SimulationControl: React.FC<SimulationControlProps> = ({
  onStart,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  currentTime,
  isSimulated
}) => {
  if (!isSimulated) {
    return null;
  }

  return (
    <Card className="p-4 bg-white shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Simulation Control</h2>
        <div className="flex items-center text-muted-foreground">
          <Clock size={18} className="mr-2" />
          <span>Current Time: {currentTime}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onStepBackward}
            disabled={currentStep <= 0 || isPlaying}
          >
            <SkipBack size={18} />
          </Button>
          
          {isPlaying ? (
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={onPause}
            >
              <Pause size={18} className="mr-2" />
              Pause
            </Button>
          ) : (
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90" 
              onClick={onStart}
              disabled={currentStep >= totalSteps - 1}
            >
              <Play size={18} className="mr-2" />
              Play
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onStepForward}
            disabled={currentStep >= totalSteps - 1 || isPlaying}
          >
            <SkipForward size={18} />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onReset}
            disabled={isPlaying}
          >
            <RefreshCw size={18} />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Slow</span>
          <Slider
            value={[speed]}
            min={1}
            max={10}
            step={1}
            onValueChange={(value) => onSpeedChange(value[0])}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground">Fast</span>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4">
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary"
            style={{ 
              width: `${(currentStep / (totalSteps - 1)) * 100}%`,
              transition: 'width 0.3s ease'
            }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Step {currentStep + 1}</span>
          <span>Total Steps: {totalSteps}</span>
        </div>
      </div>
    </Card>
  );
};

export default SimulationControl;
