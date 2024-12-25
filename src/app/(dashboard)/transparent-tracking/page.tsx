// File: /app/(dashboard)/transparent-tracking/page.tsx

import React from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { MoreVertical, Download } from 'lucide-react';

const allocationCategories = [
  {
    category: 'Healthcare',
    amount: 372023.75,
    percentage: 35,
    progress: 75,
    status: 'Active'
  },
  {
    category: 'Education',
    amount: 265731.25,
    percentage: 25,
    progress: 50,
    status: 'In Progress'
  },
  {
    category: 'Food Supply',
    amount: 159438.75,
    percentage: 15,
    progress: 30,
    status: 'Active'
  },
  {
    category: 'Emergency Relief',
    amount: 106292.50,
    percentage: 10,
    progress: 45,
    status: 'Active'
  }
];

const transactionHistory = [
  {
    donorId: '0xABC...123',
    amount: 2000,
    date: '2024-12-02',
    purpose: 'Healthcare',
    status: 'Allocated'
  },
  {
    donorId: '0xABC...123',
    amount: 500,
    date: '2024-12-03',
    purpose: 'Education',
    status: 'Allocated'
  },
  {
    donorId: '0xABC...123',
    amount: 750,
    date: '2024-12-03',
    purpose: 'Food Supply',
    status: 'Spent'
  },
  {
    donorId: '0xABC...123',
    amount: 200,
    date: '2024-12-07',
    purpose: 'Emergency',
    status: 'Allocated'
  }
];

export default function TransparentTrackingPage() {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-slate-400">Total Funds Received</h3>
              <p className="text-2xl font-bold text-white mt-2">$1,250,500</p>
              <p className="text-sm text-slate-400 mt-1">3,240 Donations</p>
            </div>
            <button className="text-slate-400 hover:text-slate-300">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-slate-400">Allocated Funds</h3>
              <p className="text-2xl font-bold text-white mt-2">$1,062,925</p>
              <p className="text-sm text-slate-400 mt-1">3,240 Donations</p>
            </div>
            <button className="text-slate-400 hover:text-slate-300">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm text-slate-400">Remaining Funds</h3>
              <p className="text-2xl font-bold text-white mt-2">$187,575</p>
              <p className="text-sm text-slate-400 mt-1">15% Unallocated</p>
            </div>
            <button className="text-slate-400 hover:text-slate-300">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </Card>
      </div>

      {/* Fund Allocation Table */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-white">Total Funds Received</h2>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="text-left text-sm font-medium text-slate-400 p-4">Allocation Category</th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">Amount Allocated</th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">Percentage</th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {allocationCategories.map((item) => (
                <tr key={item.category}>
                  <td className="p-4 text-white">{item.category}</td>
                  <td className="p-4 text-white">${item.amount.toLocaleString()}</td>
                  <td className="p-4 text-white">{item.percentage}%</td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-400 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-white min-w-[40px]">{item.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Project Progress */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Project Progress</h2>
        <div className="space-y-6">
          {allocationCategories.map((project) => (
            <div key={project.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-medium">{project.category} Project</h3>
                  <p className="text-sm text-slate-400">Total Funds: ${project.amount.toLocaleString()}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.status === 'Active' 
                    ? 'bg-green-400/10 text-green-400' 
                    : 'bg-yellow-400/10 text-yellow-400'
                }`}>
                  {project.status}
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <p className="text-sm text-slate-400">Progress: {project.progress}%</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Transaction History */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="text-left text-sm font-medium text-slate-400 p-4">Donor ID</th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">Amount</th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">Date</th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">Purpose</th>
                <th className="text-left text-sm font-medium text-slate-400 p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {transactionHistory.map((transaction, idx) => (
                <tr key={idx}>
                  <td className="p-4 text-white">{transaction.donorId}</td>
                  <td className="p-4 text-white">${transaction.amount}</td>
                  <td className="p-4 text-white">{transaction.date}</td>
                  <td className="p-4 text-white">{transaction.purpose}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'Allocated' 
                        ? 'bg-green-400/10 text-green-400' 
                        : 'bg-blue-400/10 text-blue-400'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}