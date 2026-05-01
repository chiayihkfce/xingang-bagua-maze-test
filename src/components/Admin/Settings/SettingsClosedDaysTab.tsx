import React, { useState, useEffect } from 'react';
import { ClosedDaysConfig, ClosedDaysMode } from '../../../types';

interface SettingsClosedDaysTabProps {
  closedDaysConfig: ClosedDaysConfig;
  saveClosedDaysConfig: (config: ClosedDaysConfig) => Promise<void>;
}

const TAIWAN_HOLIDAYS_2026 = [
  '2026-01-01',
  '2026-02-16',
  '2026-02-17',
  '2026-02-18',
  '2026-02-19',
  '2026-02-20',
  '2026-02-21',
  '2026-02-28',
  '2026-04-03',
  '2026-04-04',
  '2026-05-01',
  '2026-06-19',
  '2026-09-25',
  '2026-10-09',
  '2026-10-10'
];

const SettingsClosedDaysTab: React.FC<SettingsClosedDaysTabProps> = ({
  closedDaysConfig,
  saveClosedDaysConfig
}) => {
  const [localConfig, setLocalConfig] = useState<ClosedDaysConfig>(closedDaysConfig);
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    setLocalConfig(closedDaysConfig);
  }, [closedDaysConfig]);

  const handleModeChange = (mode: ClosedDaysMode) => {
    const updated = { ...localConfig, mode };
    if (mode === 'preset-all') {
      updated.excludeWeekends = true;
      updated.excludeHolidays = true;
    } else if (mode === 'preset-holidays') {
      updated.excludeWeekends = false;
      updated.excludeHolidays = true;
    }
    setLocalConfig(updated);
  };

  const handleSave = async () => {
    await saveClosedDaysConfig(localConfig);
  };

  const addManualDate = () => {
    if (!newDate || localConfig.manualClosedDates.includes(newDate)) return;
    setLocalConfig({
      ...localConfig,
      manualClosedDates: [...localConfig.manualClosedDates, newDate].sort()
    });
    setNewDate('');
  };

  const removeManualDate = (date: string) => {
    setLocalConfig({
      ...localConfig,
      manualClosedDates: localConfig.manualClosedDates.filter((d) => d !== date)
    });
  };

  return (
    <div className="closed-days-settings" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ background: 'rgba(241, 196, 15, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(241, 196, 15, 0.2)' }}>
        <h4 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>📅 預約日期開放設定</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          設定系統不開放預約的日期。注意：<strong>每週一、週二固定不開放</strong>，無需在此設定。
        </p>

        {/* 模式選擇 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: localConfig.mode === 'preset-all' ? 'rgba(241, 196, 15, 0.1)' : 'rgba(255,255,255,0.03)', borderRadius: '8px', border: `1px solid ${localConfig.mode === 'preset-all' ? 'var(--primary-gold)' : 'transparent'}` }}>
            <input type="radio" name="close-mode" checked={localConfig.mode === 'preset-all'} onChange={() => handleModeChange('preset-all')} />
            <div>
              <div style={{ fontWeight: 'bold', color: localConfig.mode === 'preset-all' ? 'var(--primary-gold)' : 'var(--text-light)' }}>國定假日含六日</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>排除所有週六日與政府公告之國定假日</div>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: localConfig.mode === 'preset-holidays' ? 'rgba(241, 196, 15, 0.1)' : 'rgba(255,255,255,0.03)', borderRadius: '8px', border: `1px solid ${localConfig.mode === 'preset-holidays' ? 'var(--primary-gold)' : 'transparent'}` }}>
            <input type="radio" name="close-mode" checked={localConfig.mode === 'preset-holidays'} onChange={() => handleModeChange('preset-holidays')} />
            <div>
              <div style={{ fontWeight: 'bold', color: localConfig.mode === 'preset-holidays' ? 'var(--primary-gold)' : 'var(--text-light)' }}>國定假日不含六日</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>僅排除國定假日，週六日照常開放預約</div>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: localConfig.mode === 'custom' ? 'rgba(241, 196, 15, 0.1)' : 'rgba(255,255,255,0.03)', borderRadius: '8px', border: `1px solid ${localConfig.mode === 'custom' ? 'var(--primary-gold)' : 'transparent'}` }}>
            <input type="radio" name="close-mode" checked={localConfig.mode === 'custom'} onChange={() => handleModeChange('custom')} />
            <div>
              <div style={{ fontWeight: 'bold', color: localConfig.mode === 'custom' ? 'var(--primary-gold)' : 'var(--text-light)' }}>自訂排除規則</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>自由勾選與手動輸入特定的排除日期</div>
            </div>
          </label>
        </div>

        {/* 自訂選項區 */}
        {localConfig.mode === 'custom' && (
          <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', marginBottom: '1.5rem', border: '1px dashed rgba(241, 196, 15, 0.3)' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={localConfig.excludeWeekends} onChange={(e) => setLocalConfig({ ...localConfig, excludeWeekends: e.target.checked })} />
                包含所有六日
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={localConfig.excludeHolidays} onChange={(e) => setLocalConfig({ ...localConfig, excludeHolidays: e.target.checked })} />
                包含國定假日
              </label>
            </div>

            <div className="manual-dates-section">
              <h5 style={{ color: 'var(--text-muted)', marginBottom: '0.8rem', fontSize: '0.85rem' }}>➕ 手動排除特定日期 (例如活動衝突)</h5>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{ flex: 1, padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--input-bg)', color: '#fff' }} />
                <button onClick={addManualDate} style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', background: 'var(--primary-gold)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>加入</button>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {localConfig.manualClosedDates.length === 0 ? (
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>尚未加入任何特定日期</span>
                ) : (
                  localConfig.manualClosedDates.map(date => (
                    <div key={date} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.3)', borderRadius: '15px', fontSize: '0.8rem', color: '#ff4d4d' }}>
                      {date}
                      <span onClick={() => removeManualDate(date)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>×</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <button onClick={handleSave} style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--primary-gold)', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(241, 196, 15, 0.3)' }}>儲存日期開放設定</button>
      </div>

      {/* 國定假日參考 (不可編輯，由系統維護) */}
      <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
        <h5 style={{ color: 'var(--text-muted)', marginBottom: '0.8rem' }}>ℹ️ 2026 國定假日參考表</h5>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {TAIWAN_HOLIDAYS_2026.map(d => <div key={d} style={{ padding: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', textAlign: 'center' }}>{d}</div>)}
        </div>
      </div>
    </div>
  );
};

export default SettingsClosedDaysTab;
