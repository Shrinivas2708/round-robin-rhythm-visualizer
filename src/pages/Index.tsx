
import React, { useState, useEffect, useRef } from 'react';
import ProcessForm from '@/components/ProcessForm';
import ProcessTable from '@/components/ProcessTable';
import GanttChart from '@/components/GanttChart';
import ResultsTable from '@/components/ResultsTable';
import SimulationControl from '@/components/SimulationControl';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Process, 
  SimulationResults, 
  SimulationStep, 
  runRoundRobinSimulation 
} from '@/utils/roundRobinScheduler';

const Index = () => {
  // Process state
  const [processes, setProcesses] = useState<Process[]>([]);
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  
  // Simulation state
  const [simulationResults, setSimulationResults] = useState<SimulationResults | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(5);
  
  // Animation reference
  const animationRef = useRef<number | null>(null);

  // Create a map of process names and colors for the Gantt chart
  const processNames: Record<string, string> = {};
  const processColors: Record<string, string> = {};
  
  processes.forEach(process => {
    processNames[process.id] = process.name;
    processColors[process.id] = process.color || '#94A3B8';
  });

  // Handle adding a new process
  const handleAddProcess = (process: Process) => {
    setProcesses(prev => [...prev, process]);
    toast.success(`Process ${process.name} added`);
  };

  // Handle deleting a process
  const handleDeleteProcess = (id: string) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
    toast.success('Process removed');
    
    // Reset simulation if a process is deleted
    if (isSimulated) {
      setIsSimulated(false);
      setSimulationResults(null);
      setCurrentStepIndex(0);
      stopSimulation();
    }
  };

  // Handle clearing all processes
  const handleClearAll = () => {
    setProcesses([]);
    setIsSimulated(false);
    setSimulationResults(null);
    setCurrentStepIndex(0);
    stopSimulation();
    toast.success('All processes cleared');
  };

  // Handle time quantum change
  const handleTimeQuantumChange = (value: number) => {
    setTimeQuantum(value);
    
    // Reset simulation if time quantum changes
    if (isSimulated) {
      setIsSimulated(false);
      setSimulationResults(null);
      setCurrentStepIndex(0);
      stopSimulation();
    }
  };

  // Run the simulation
  const handleRunSimulation = () => {
    if (processes.length === 0) {
      toast.error('Add at least one process to simulate');
      return;
    }
    
    if (!timeQuantum || timeQuantum <= 0) {
      toast.error('Time quantum must be greater than 0');
      return;
    }
    
    try {
      // Run the Round Robin simulation
      const results = runRoundRobinSimulation(processes, timeQuantum);
      setSimulationResults(results);
      setIsSimulated(true);
      setCurrentStepIndex(0);
      stopSimulation();
      
      toast.success('Simulation completed successfully');
    } catch (error) {
      console.error('Simulation error:', error);
      toast.error('Error running simulation');
    }
  };

  // Playback controls
  const startSimulation = () => {
    if (!simulationResults || currentStepIndex >= simulationResults.steps.length - 1) {
      return;
    }
    
    setIsPlaying(true);
  };

  const stopSimulation = () => {
    setIsPlaying(false);
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const resetSimulation = () => {
    setCurrentStepIndex(0);
    stopSimulation();
  };

  const stepForward = () => {
    if (!simulationResults) return;
    
    setCurrentStepIndex(prev => 
      prev < simulationResults.steps.length - 1 ? prev + 1 : prev
    );
  };

  const stepBackward = () => {
    setCurrentStepIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  // Animation loop for playing the simulation
  useEffect(() => {
    if (!isPlaying || !simulationResults) return;
    
    let lastTime = 0;
    const interval = 1000 / playbackSpeed; // milliseconds between steps
    
    const animate = (timestamp: number) => {
      if (!lastTime || timestamp - lastTime >= interval) {
        lastTime = timestamp;
        
        if (currentStepIndex < simulationResults.steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          stopSimulation();
        }
      }
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, simulationResults, playbackSpeed]);

  // Get the current simulation step
  const currentStep: SimulationStep | null = 
    simulationResults && currentStepIndex < simulationResults.steps.length
      ? simulationResults.steps[currentStepIndex]
      : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-center">Round Robin CPU Scheduler</h1>
          <p className="text-center text-muted-foreground mt-1">
            Visual simulation of the Round Robin CPU scheduling algorithm
          </p>
        </div>
      </header>
      
      <main className="container py-6 space-y-6">
        {/* Process Input Section */}
        <section className="grid gap-6 md:grid-cols-2">
          <ProcessForm 
            onAddProcess={handleAddProcess}
            processes={processes}
            timeQuantum={timeQuantum}
            onTimeQuantumChange={handleTimeQuantumChange}
          />
          
          <div className="space-y-4">
            <ProcessTable 
              processes={processes}
              onDeleteProcess={handleDeleteProcess}
              onClearAll={handleClearAll}
            />
            
            {processes.length > 0 && !isSimulated && (
              <Button 
                className="w-full bg-accent hover:bg-accent/90"
                onClick={handleRunSimulation}
              >
                Run Simulation
              </Button>
            )}
          </div>
        </section>
        
        {simulationResults && currentStep && (
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Ready Queue</h2>
            
            <div className="flex items-center space-x-1 overflow-x-auto pb-2">
              {currentStep.queue.length > 0 ? (
                currentStep.queue.map((processId, index) => {
                  const process = processes.find(p => p.id === processId);
                  return (
                    <div
                      key={`${processId}-${index}`}
                      className="flex items-center justify-center min-w-16 h-12 text-white font-medium rounded queue-item animate-slide-in"
                      style={{
                        backgroundColor: processColors[processId] || '#94A3B8',
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      {process?.name || processId}
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500">Queue is empty</div>
              )}
            </div>
            
            {currentStep.activeProcess && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Currently Executing</h3>
                <div
                  className="flex items-center justify-center w-full max-w-36 h-12 text-white font-medium rounded animate-pulse-opacity"
                  style={{
                    backgroundColor: 
                      processColors[currentStep.activeProcess] || '#94A3B8'
                  }}
                >
                  {processNames[currentStep.activeProcess] || 
                   currentStep.activeProcess}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Simulation Control */}
        {simulationResults && (
          <SimulationControl
            onStart={startSimulation}
            onPause={stopSimulation}
            onReset={resetSimulation}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
            onSpeedChange={setPlaybackSpeed}
            isPlaying={isPlaying}
            currentStep={currentStepIndex}
            totalSteps={simulationResults.steps.length}
            speed={playbackSpeed}
            currentTime={currentStep?.time || null}
            isSimulated={isSimulated}
          />
        )}
        
        {/* Gantt Chart Visualization */}
        {simulationResults && (
          <GanttChart
            ganttItems={simulationResults.ganttChart}
            currentTime={currentStep?.time || null}
            processColors={processColors}
            processNames={processNames}
          />
        )}
        
        {/* Simulation Results */}
        {simulationResults && (
          <ResultsTable
            processes={simulationResults.processes}
            averageWaitingTime={simulationResults.averageWaitingTime}
            averageTurnaroundTime={simulationResults.averageTurnaroundTime}
          />
        )}
        
        {/* Process Queue Visualization */}
        
      </main>
      
     
    </div>
  );
};

export default Index;
