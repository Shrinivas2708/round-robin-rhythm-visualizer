
/**
 * Process interface defining the structure of a process
 */
export interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  remainingTime: number;
  completionTime?: number;
  waitingTime?: number;
  turnaroundTime?: number;
  color?: string;
}

/**
 * GanttChartItem interface for displaying the scheduling sequence
 */
export interface GanttChartItem {
  processId: string;
  startTime: number;
  endTime: number;
  color?: string;
}

/**
 * SimulationStep interface for step-by-step animation
 */
export interface SimulationStep {
  time: number;
  activeProcess: string | null;
  queue: string[];
  remainingTimes: Record<string, number>;
  isCompleted: Record<string, boolean>;
}

/**
 * Results interface for simulation output
 */
export interface SimulationResults {
  ganttChart: GanttChartItem[];
  processes: Process[];
  steps: SimulationStep[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  totalExecutionTime: number;
}

/**
 * Runs the Round Robin CPU scheduling algorithm
 * @param processes Array of processes to schedule
 * @param timeQuantum Time quantum for the Round Robin algorithm
 * @returns Simulation results containing gantt chart, updated processes, and metrics
 */
export function runRoundRobinSimulation(
  processes: Process[],
  timeQuantum: number
): SimulationResults {
  // Make a deep copy of the processes to avoid modifying the originals
  const processesClone: Process[] = JSON.parse(JSON.stringify(processes));
  
  // Sort processes by arrival time
  processesClone.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const ganttChart: GanttChartItem[] = [];
  const steps: SimulationStep[] = [];
  
  let currentTime = 0;
  let completedProcesses = 0;
  const readyQueue: string[] = [];
  const remainingTimes: Record<string, number> = {};
  const completionTimes: Record<string, number> = {};
  const isCompleted: Record<string, boolean> = {};
  
  // Initialize remaining times and completion status
  processesClone.forEach(process => {
    remainingTimes[process.id] = process.burstTime;
    isCompleted[process.id] = false;
  });
  
  // Find the earliest arrival time to start the simulation
  if (processesClone.length > 0) {
    currentTime = processesClone[0].arrivalTime;
  }
  
  // Add initially arrived processes to the ready queue
  processesClone.forEach(process => {
    if (process.arrivalTime <= currentTime) {
      readyQueue.push(process.id);
    }
  });
  
  // Main simulation loop
  while (completedProcesses < processesClone.length) {
    let activeProcess: string | null = null;
    
    if (readyQueue.length === 0) {
      // No process in the ready queue, find the next arriving process
      const nextProcess = processesClone.find(p => !isCompleted[p.id] && p.arrivalTime > currentTime);
      
      if (nextProcess) {
        // Add an idle period in the Gantt chart
        ganttChart.push({
          processId: 'idle',
          startTime: currentTime,
          endTime: nextProcess.arrivalTime,
          color: '#94A3B8' // slate-400 for idle time
        });
        
        // Record the idle step
        steps.push({
          time: currentTime,
          activeProcess: null,
          queue: [...readyQueue],
          remainingTimes: { ...remainingTimes },
          isCompleted: { ...isCompleted }
        });
        
        currentTime = nextProcess.arrivalTime;
        readyQueue.push(nextProcess.id);
      } else {
        // This should not happen, but just in case
        break;
      }
    } else {
      // Get the next process from the ready queue
      activeProcess = readyQueue.shift()!;
      
      // Calculate execution time for this quantum
      const remainingTime = remainingTimes[activeProcess];
      const executionTime = Math.min(remainingTime, timeQuantum);
      
      // Record the start of execution
      const startTime = currentTime;
      currentTime += executionTime;
      
      // Update remaining time
      remainingTimes[activeProcess] -= executionTime;
      
      // Record the step at the start of this quantum
      steps.push({
        time: startTime,
        activeProcess,
        queue: [...readyQueue],
        remainingTimes: { ...remainingTimes },
        isCompleted: { ...isCompleted }
      });
      
      // Add new arrivals to the ready queue
      processesClone.forEach(process => {
        if (
          process.arrivalTime > startTime && 
          process.arrivalTime <= currentTime && 
          !isCompleted[process.id] && 
          !readyQueue.includes(process.id) && 
          process.id !== activeProcess
        ) {
          readyQueue.push(process.id);
        }
      });
      
      // Add to Gantt chart
      ganttChart.push({
        processId: activeProcess,
        startTime,
        endTime: currentTime,
        color: processesClone.find(p => p.id === activeProcess)?.color
      });
      
      // Check if process is completed
      if (remainingTimes[activeProcess] === 0) {
        isCompleted[activeProcess] = true;
        completionTimes[activeProcess] = currentTime;
        completedProcesses++;
      } else {
        // If process is not completed, add it back to the ready queue
        readyQueue.push(activeProcess);
      }
    }
  }
  
  // Calculate waiting time and turnaround time for each process
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;
  
  processesClone.forEach(process => {
    // Completion time is when the process finished executing
    process.completionTime = completionTimes[process.id];
    
    // Turnaround time = Completion time - Arrival time
    process.turnaroundTime = process.completionTime! - process.arrivalTime;
    
    // Waiting time = Turnaround time - Burst time
    process.waitingTime = process.turnaroundTime - process.burstTime;
    
    // Update remaining time
    process.remainingTime = 0;
    
    // Accumulate for averages
    totalWaitingTime += process.waitingTime;
    totalTurnaroundTime += process.turnaroundTime;
  });
  
  // Calculate averages
  const averageWaitingTime = totalWaitingTime / processesClone.length;
  const averageTurnaroundTime = totalTurnaroundTime / processesClone.length;
  
  return {
    ganttChart,
    processes: processesClone,
    steps,
    averageWaitingTime,
    averageTurnaroundTime,
    totalExecutionTime: currentTime - processesClone[0].arrivalTime
  };
}
