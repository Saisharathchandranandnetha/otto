'use client';
import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function KPIChartsPanel() {
  const queryData = [
    { day: 'Mon', Admission: 40, Fees: 24, Exams: 20 },
    { day: 'Tue', Admission: 30, Fees: 13, Exams: 22 },
    { day: 'Wed', Admission: 20, Fees: 58, Exams: 29 },
    { day: 'Thu', Admission: 27, Fees: 39, Exams: 20 },
    { day: 'Fri', Admission: 18, Fees: 48, Exams: 21 },
    { day: 'Sat', Admission: 23, Fees: 38, Exams: 25 },
    { day: 'Sun', Admission: 34, Fees: 43, Exams: 21 },
  ];

  const docData = [
    { day: 'Mon', Docs: 12 },
    { day: 'Tue', Docs: 19 },
    { day: 'Wed', Docs: 15 },
    { day: 'Thu', Docs: 22 },
    { day: 'Fri', Docs: 28 },
    { day: 'Sat', Docs: 10 },
    { day: 'Sun', Docs: 14 },
  ];

  const resolutionData = [
    { name: 'Resolved', value: 71 },
    { name: 'Escalated', value: 5 },
    { name: 'Pending', value: 13 },
  ];

  const COLORS = ['#F59E0B', '#EF4444', '#3B82F6']; // Amber, Red, Blue

  return (
    <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-label-lg font-semibold text-on-surface">KPI Trends (7 Days)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {/* Line Chart */}
        <div className="h-48">
          <p className="text-[11px] font-medium text-on-surface-variant text-center mb-2">Query Volume</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={queryData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ padding: 0 }}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} iconType="circle" iconSize={6} />
              <Line type="monotone" dataKey="Admission" stroke="#F59E0B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Fees" stroke="#3B82F6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Exams" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="h-48">
          <p className="text-[11px] font-medium text-on-surface-variant text-center mb-2">Documents Generated</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={docData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#ffffff0a' }}
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="Docs" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="h-48">
          <p className="text-[11px] font-medium text-on-surface-variant text-center mb-2">Resolution Rate</p>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={resolutionData}
                innerRadius={30}
                outerRadius={50}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {resolutionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} iconType="circle" iconSize={6} layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
