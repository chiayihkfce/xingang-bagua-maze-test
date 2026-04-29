import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { getAnalyticsData } from '../../utils/dataUtils';

interface AnalyticsChartsProps {
  submissions: any[][];
}

const COLORS = [
  '#d4af37',
  '#27ae60',
  '#3498db',
  '#e67e22',
  '#9b59b6',
  '#e74c3c',
  '#1abc9c',
  '#34495e'
];

/**
 * 視覺化圖表組件：整合多維度活動分析
 */
const AnalyticsCharts: React.FC<AnalyticsChartsProps> = React.memo(
  ({ submissions }) => {
    const { referralData, sessionData, trendData, quantityData, paymentData } =
      useMemo(() => getAnalyticsData(submissions), [submissions]);

    return (
      <div
        className="analytics-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '25px',
          marginBottom: '30px'
        }}
      >
        {/* 1. 報名進度趨勢 (折線圖) */}
        <div
          className="form-card"
          style={{
            padding: '1.5rem',
            minHeight: '380px',
            background: 'var(--card-bg)',
            gridColumn: '1 / -1'
          }}
        >
          <h3
            className="form-section-title"
            style={{ marginTop: 0, fontSize: '1.1rem' }}
          >
            每日報名趨勢分析 (累計動能)
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#444"
                  vertical={false}
                />
                <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 11 }} />
                <YAxis stroke="#888" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#222',
                    border: '1px solid #d4af37',
                    color: '#fff',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="報名筆數"
                  stroke="#d4af37"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#d4af37' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. 場次熱度分析 (長條圖) */}
        <div
          className="form-card"
          style={{
            padding: '1.5rem',
            minHeight: '350px',
            background: 'var(--card-bg)'
          }}
        >
          <h3
            className="form-section-title"
            style={{ marginTop: 0, fontSize: '1.1rem' }}
          >
            場次熱度分佈
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer>
              <BarChart data={sessionData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#444"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#888"
                  tick={{ fontSize: 10 }}
                  angle={-15}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#888" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#222',
                    border: '1px solid #d4af37',
                    color: '#fff',
                    borderRadius: '8px'
                  }}
                />
                <Bar
                  dataKey="value"
                  name="預約筆數"
                  fill="#d4af37"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. 份數分佈分析 (長條圖) */}
        <div
          className="form-card"
          style={{
            padding: '1.5rem',
            minHeight: '350px',
            background: 'var(--card-bg)'
          }}
        >
          <h3
            className="form-section-title"
            style={{ marginTop: 0, fontSize: '1.1rem' }}
          >
            單筆訂單份數分佈
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer>
              <BarChart data={quantityData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#444"
                  vertical={false}
                />
                <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 11 }} />
                <YAxis stroke="#888" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#222',
                    border: '1px solid #27ae60',
                    color: '#fff',
                    borderRadius: '8px'
                  }}
                />
                <Bar
                  dataKey="value"
                  name="訂單筆數"
                  fill="#27ae60"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. 得知管道佔比 (圓餅圖) */}
        <div
          className="form-card"
          style={{
            padding: '1.5rem',
            minHeight: '400px',
            background: 'var(--card-bg)'
          }}
        >
          <h3
            className="form-section-title"
            style={{ marginTop: 0, fontSize: '1.1rem' }}
          >
            行銷管道成效分析
          </h3>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={referralData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(Number(percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {referralData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#222',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '8px'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. 付款方式佔比 (圓餅圖) */}
        <div
          className="form-card"
          style={{
            padding: '1.5rem',
            minHeight: '400px',
            background: 'var(--card-bg)'
          }}
        >
          <h3
            className="form-section-title"
            style={{ marginTop: 0, fontSize: '1.1rem' }}
          >
            支付方式偏好分析
          </h3>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(Number(percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {paymentData.map((_, index) => (
                    <Cell
                      key={`cell-pay-${index}`}
                      fill={COLORS[(index + 3) % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#222',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '8px'
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
);

export default AnalyticsCharts;
