
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Process } from '@/utils/roundRobinScheduler';
import { toast } from 'sonner';

interface ProcessFormProps {
  onAddProcess: (process: Process) => void;
  processes: Process[];
  timeQuantum: number;
  onTimeQuantumChange: (timeQuantum: number) => void;
}

const PROCESS_COLORS = [
  '#3B82F6', // blue-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#6366F1', // indigo-500
  '#EF4444', // red-500
  '#14B8A6', // teal-500
];

const ProcessForm: React.FC<ProcessFormProps> = ({ 
  onAddProcess, 
  processes, 
  timeQuantum, 
  onTimeQuantumChange 
}) => {
  const [processName, setProcessName] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [burstTime, setBurstTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!processName.trim()) {
      toast.error('Process name is required');
      return;
    }
    
    if (isNaN(Number(arrivalTime)) || Number(arrivalTime) < 0) {
      toast.error('Arrival time must be a non-negative number');
      return;
    }
    
    if (isNaN(Number(burstTime)) || Number(burstTime) <= 0) {
      toast.error('Burst time must be a positive number');
      return;
    }
    
    // Check for duplicate process name
    if (processes.some(p => p.name === processName.trim())) {
      toast.error('A process with this name already exists');
      return;
    }
    
    // Select a color for the process
    const colorIndex = processes.length % PROCESS_COLORS.length;
    const color = PROCESS_COLORS[colorIndex];
    
    // Create new process
    const newProcess: Process = {
      id: Date.now().toString(),
      name: processName.trim(),
      arrivalTime: Number(arrivalTime),
      burstTime: Number(burstTime),
      remainingTime: Number(burstTime),
      color,
    };
    
    // Add the process
    onAddProcess(newProcess);
    
    // Reset form
    setProcessName('');
    setArrivalTime('');
    setBurstTime('');
  };

  const handleTimeQuantumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(Number(value)) && Number(value) > 0)) {
      onTimeQuantumChange(Number(value) || 0);
    }
  };

  return (
    <Card className="p-4 bg-white shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Process</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <div className="space-y-2">
            <Label htmlFor="processName">Process Name</Label>
            <Input
              id="processName"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              placeholder="P1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="arrivalTime">Arrival Time</Label>
            <Input
              id="arrivalTime"
              type="number"
              min="0"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="burstTime">Burst Time</Label>
            <Input
              id="burstTime"
              type="number"
              min="1"
              value={burstTime}
              onChange={(e) => setBurstTime(e.target.value)}
              placeholder="4"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 pt-2">
          <div className="space-y-2">
            <Label htmlFor="timeQuantum">Time Quantum</Label>
            <Input
              id="timeQuantum"
              type="number"
              min="1"
              value={timeQuantum || ''}
              onChange={handleTimeQuantumChange}
              placeholder="2"
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90"
            >
              Add Process
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default ProcessForm;
