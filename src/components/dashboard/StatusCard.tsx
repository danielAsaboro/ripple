// File: /components/dashboard/StatusCard.tsx

import React from 'react';
import Card from "@/components/common/Card";
import { ArrowUpRight, MoreVertical } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    type: 'increase' | 'decrease';
    text?: string;
  };
  footer?: {
    text: string;
    link?: string;
  };
}

const StatusCard = ({ title, value, change, footer }: StatusCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-slate-400">{title}</h3>
            <button className="text-slate-400 hover:text-slate-300">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">{value}</div>
            
            {change && (
              <div className="flex items-center gap-2">
                <div className={`flex items-center text-sm ${
                  change.type === 'increase' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <ArrowUpRight className={`h-4 w-4 ${
                    change.type === 'decrease' && 'rotate-90'
                  }`} />
                  <span>{change.value}</span>
                </div>
                {change.text && (
                  <span className="text-sm text-slate-400">{change.text}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {footer && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <button 
            className="text-sm text-slate-400 hover:text-slate-300"
            onClick={() => footer.link && window.open(footer.link)}
          >
            {footer.text}
          </button>
        </div>
      )}
    </Card>
  );
};

export default StatusCard;