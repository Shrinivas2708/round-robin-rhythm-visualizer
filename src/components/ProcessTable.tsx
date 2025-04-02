
import React from 'react';
import { Process } from '@/utils/roundRobinScheduler';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';

interface ProcessTableProps {
  processes: Process[];
  onDeleteProcess: (id: string) => void;
  onClearAll: () => void;
}

const ProcessTable: React.FC<ProcessTableProps> = ({ 
  processes, 
  onDeleteProcess, 
  onClearAll 
}) => {
  if (processes.length === 0) {
    return (
      <Card className="p-6 bg-white shadow-md">
        <div className="text-center text-gray-500">
          <p className="mb-4">No processes added yet</p>
          <p className="text-sm">Add processes using the form above</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Process List</h2>
        <Button 
          variant="outline" 
          className="text-destructive hover:bg-destructive/10"
          onClick={onClearAll}
        >
          Clear All
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Process</TableHead>
              <TableHead className="text-right">Arrival Time</TableHead>
              <TableHead className="text-right">Burst Time</TableHead>
              <TableHead className="w-12"></TableHead>
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
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteProcess(process.id)}
                    className="w-8 h-8 rounded-full text-gray-500 hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ProcessTable;
