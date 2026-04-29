import React from 'react';
import { DashboardStats as IStats } from '../../types';

interface DashboardStatsProps {
  stats: IStats | null;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  // 即使資料還在載入，也顯示外框佔位，避免畫面閃爍
  const displayStats = stats || {
    pendingCount: 0,
    totalRevenue: 0,
    todayKits: 0,
    todayPlayers: 0
  };

  return (
    <div
      className="dashboard-stats-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
        width: '100%'
      }}
    >
      <div className="stats-card" style={cardStyle('#f39c12')}>
        <div className="stats-icon">⏳</div>
        <div className="stats-info">
          <span className="stats-label">待審核件數</span>
          <span className="stats-value">{displayStats.pendingCount}</span>
        </div>
      </div>

      <div className="stats-card" style={cardStyle('#27ae60')}>
        <div className="stats-icon">💰</div>
        <div className="stats-info">
          <span className="stats-label">總成交金額</span>
          <span className="stats-value">
            NT$ {displayStats.totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="stats-card" style={cardStyle('#3498db')}>
        <div className="stats-icon">📦</div>
        <div className="stats-info">
          <span className="stats-label">今日領取份數</span>
          <span className="stats-value">
            {displayStats.todayKits} <small>份</small>
          </span>
        </div>
      </div>

      <div className="stats-card" style={cardStyle('#9b59b6')}>
        <div className="stats-icon">👥</div>
        <div className="stats-info">
          <span className="stats-label">今日遊玩人數</span>
          <span className="stats-value">
            {displayStats.todayPlayers} <small>人</small>
          </span>
        </div>
      </div>
    </div>
  );
};

const cardStyle = (color: string) =>
  ({
    background: 'var(--card-bg)',
    borderLeft: `6px solid ${color}`,
    padding: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s ease'
  }) as React.CSSProperties;

export default DashboardStats;
