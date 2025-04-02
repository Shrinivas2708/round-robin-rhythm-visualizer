
import React from 'react';
import { Process } from '@/utils/roundRobinScheduler';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface ResultsTableProps {
  processes: Process[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ 
  processes, 
  averageWaitingTime, 
  averageTurnaroundTime 
}) => {
  if (processes.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 bg-white shadow-md">
      <h2 className="text-xl font-semibold mb-4">Simulation Results</h2>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Process</TableHead>
              <TableHead className="text-right">Arrival Time</TableHead>
              <TableHead className="text-right">Burst Time</TableHead>
              <TableHead className="text-right">Completion Time</TableHead>
              <TableHead className="text-right">Waiting Time</TableHead>
              <TableHead className="text-right">Turnaround Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((process) => (
              <TableRow key={process.id}>
                <TableCell>
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: process.color }}
                  ></div>
                </TableCell>
                <TableCell className="font-medium">{process.name}</TableCell>
                <TableCell className="text-right">{process.arrivalTime}</TableCell>
                <TableCell className="text-right">{process.burstTime}</TableCell>
                <TableCell className="text-right">{process.completionTime}</TableCell>
                <TableCell className="text-right">{process.waitingTime}</TableCell>
                <TableCell className="text-right">{process.turnaroundTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Summary statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-secondary p-4 rounded-md">
          <p className="text-sm text-muted-foreground mb-1">Average Waiting Time</p>
          <p className="text-2xl font-semibold">{averageWaitingTime.toFixed(2)}</p>
        </div>
        <div className="bg-secondary p-4 rounded-md">
          <p className="text-sm text-muted-foreground mb-1">Average Turnaround Time</p>
          <p className="text-2xl font-semibold">{averageTurnaroundTime.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  );
};

export default ResultsTable;
