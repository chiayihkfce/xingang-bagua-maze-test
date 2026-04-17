import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { getAnalyticsData } from '../../utils/dataUtils';

interface AnalyticsChartsProps {
  submissions: any[][];
}

const COLORS = ['#d4af37', '#27ae60', '#3498db', '#e67e22', '#9b59b6', '#e74c3c', '#1abc9c', '#34495e'];

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ submissions }) => {
  const { referralData, sessionData } = getAnalyticsData(submissions);

  return (
    <div className="analytics-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      
      {/* 1. 場次熱度分析 (長條圖) */}
      <div className="form-card" style={{ padding: '1.5rem', minHeight: '350px', background: 'var(--card-bg)' }}>
        <h3 className="form-section-title" style={{ marginTop: 0, fontSize: '1.1rem' }}>場次熱度分析 (報名筆數)</h3>
        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer>
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 12 }} />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ background: '#222', border: '1px solid #d4af37', color: '#fff' }}
                itemStyle={{ color: '#d4af37' }}
              />
              <Bar dataKey="value" name="預約筆數" fill="#d4af37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. 得知管道比例 (圓餅圖) */}
      <div className="form-card" style={{ padding: '1.5rem', minHeight: '350px', background: 'var(--card-bg)' }}>
        <h3 className="form-section-title" style={{ marginTop: 0, fontSize: '1.1rem' }}>得知管道佔比</h3>
        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={referralData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(Number(percent || 0) * 100).toFixed(0)}%`}
              >
                {referralData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#222', border: '1px solid #d4af37', color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsCharts;
