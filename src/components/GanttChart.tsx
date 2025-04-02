
import React from 'react';
import { GanttChartItem } from '@/utils/roundRobinScheduler';
import { Card } from '@/components/ui/card';

interface GanttChartProps {
  ganttItems: GanttChartItem[];
  currentTime: number | null;
  processColors: Record<string, string>;
  processNames: Record<string, string>;
}

const GanttChart: React.FC<GanttChartProps> = ({ 
  ganttItems, 
  currentTime, 
  processColors,
  processNames
}) => {
  if (ganttItems.length === 0) {
    return null;
  }

  // Calculate the max time to determine the width of blocks
  const maxTime = ganttItems.reduce(
    (max, item) => Math.max(max, item.endTime), 
    0
  );
  
  return (
    <Card className="p-4 bg-white shadow-md">
      <h2 className="text-xl font-semibold mb-4">CPU Schedule Timeline</h2>
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Gantt Chart Blocks */}
          <div className="flex">
            {ganttItems.map((item, index) => {
              const width = ((item.endTime - item.startTime) / maxTime) * 100;
              const isActive = currentTime !== null && 
                               currentTime >= item.startTime && 
                               currentTime < item.endTime;
              
              // Get process color, default to gray for idle
              const backgroundColor = item.processId === 'idle' 
                ? '#94A3B8' // slate-400
                : processColors[item.processId] || '#94A3B8';
              
              return (
                <div
                  key={index}
                  className={`gantt-block ${isActive ? 'highlight' : ''}`}
                  style={{
                    width: `${width}%`,
                    minWidth: '40px',
                    backgroundColor
                  }}
                >
                  {item.processId === 'idle' ? 'Idle' : processNames[item.processId] || item.processId}
                </div>
              );
            })}
          </div>
          
          {/* Timeline ticks */}
          <div className="flex text-xs text-gray-500 mt-1">
            {ganttItems.map((item, index) => {
              const width = ((item.endTime - item.startTime) / maxTime) * 100;
              return (
                <div
                  key={index}
                  className="flex justify-between"
                  style={{
                    width: `${width}%`,
                    minWidth: '40px'
                  }}
                >
                  <span>{item.startTime}</span>
                  {index === ganttItems.length - 1 && (
                    <span className="ml-auto">{item.endTime}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4">
        {Object.entries(processNames).map(([id, name]) => (
          <div key={id} className="flex items-center">
            <div 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: processColors[id] }}
            ></div>
            <span className="text-sm">{name}</span>
          </div>
        ))}
        <div className="flex items-center">
          <div 
            className="w-4 h-4 rounded-full mr-2" 
            style={{ backgroundColor: '#94A3B8' }}
          ></div>
          <span className="text-sm">Idle</span>
        </div>
      </div>
    </Card>
  );
};

export default GanttChart;
