import React, { useState, useEffect } from 'react';
import { TimeslotConfig } from '../../types';

interface TimeSlotManagementProps {
  timeslotConfig: TimeslotConfig;
  generalTimeSlots: string[];
  specialTimeSlots: string[];
  generateTimeSlots: (start: string, end: string, interval: number) => string[];
  saveTimeSlotsConfig: (
    type: 'general' | 'special',
    config: TimeslotConfig,
    slots: string[]
  ) => void;
}

const TimeSlotManagement: React.FC<TimeSlotManagementProps> = ({
  timeslotConfig,
  generalTimeSlots,
  specialTimeSlots,
  generateTimeSlots,
  saveTimeSlotsConfig
}) => {
  // 本地暫存 State，防止未儲存就影響到場次管理
  const [localConfig, setLocalConfig] =
    useState<TimeslotConfig>(timeslotConfig);
  const [localGeneralSlots, setLocalGeneralSlots] =
    useState<string[]>(generalTimeSlots);
  const [localSpecialSlots, setLocalSpecialSlots] =
    useState<string[]>(specialTimeSlots);
  const [newManualTime, setNewManualTime] = useState('');

  // 當外部資料更新時（例如剛進入頁面或儲存成功後），同步到本地
  useEffect(() => {
    setLocalConfig(timeslotConfig);
    setLocalGeneralSlots(generalTimeSlots);
    setLocalSpecialSlots(specialTimeSlots);
  }, [timeslotConfig, generalTimeSlots, specialTimeSlots]);

  const handleManualAdd = (type: 'general' | 'special') => {
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(newManualTime)) {
      alert('請輸入正確的時間格式 (HH:mm)，例如 09:30');
      return;
    }
    if (type === 'general') {
      if (localGeneralSlots.includes(newManualTime)) return;
      setLocalGeneralSlots([...localGeneralSlots, newManualTime].sort());
    } else {
      if (localSpecialSlots.includes(newManualTime)) return;
      setLocalSpecialSlots([...localSpecialSlots, newManualTime].sort());
    }
    setNewManualTime('');
  };

  const removeSlot = (type: 'general' | 'special', slot: string) => {
    if (type === 'general') {
      setLocalGeneralSlots(localGeneralSlots.filter((s) => s !== slot));
    } else {
      setLocalSpecialSlots(localSpecialSlots.filter((s) => s !== slot));
    }
  };

  return (
    <section className="admin-section form-card">
      <h3 className="form-section-title">開放時間段管理</h3>
      <div className="timeslot-admin-grid">
        <div className="timeslot-config-box">
          <h4 style={{ marginBottom: '1rem' }}>📅 一般預約時段 (預設)</h4>
          <div className="generator-box">
            <input
              type="time"
              className="admin-time-input"
              value={localConfig.generalStart}
              onChange={(e) =>
                setLocalConfig({ ...localConfig, generalStart: e.target.value })
              }
            />
            <span>至</span>
            <input
              type="time"
              className="admin-time-input"
              value={localConfig.generalEnd}
              onChange={(e) =>
                setLocalConfig({ ...localConfig, generalEnd: e.target.value })
              }
            />
            <span>間隔 : </span>
            <input
              type="number"
              className="admin-time-input"
              style={{ width: '80px' }}
              value={localConfig.generalInterval}
              onChange={(e) =>
                setLocalConfig({
                  ...localConfig,
                  generalInterval: parseInt(e.target.value) || 30
                })
              }
            />
            <button
              onClick={() =>
                setLocalGeneralSlots(
                  generateTimeSlots(
                    localConfig.generalStart,
                    localConfig.generalEnd,
                    localConfig.generalInterval
                  )
                )
              }
            >
              自動新增
            </button>
          </div>
          <div className="manual-add">
            <input
              type="text"
              placeholder="HH:mm"
              value={newManualTime}
              onChange={(e) => setNewManualTime(e.target.value)}
            />
            <button onClick={() => handleManualAdd('general')}>手動新增</button>
          </div>
          <div className="slot-list">
            {localGeneralSlots.map((s) => (
              <span key={s} className="slot-tag">
                {s} <i onClick={() => removeSlot('general', s)}>×</i>
              </span>
            ))}
          </div>
          <button
            onClick={() =>
              saveTimeSlotsConfig('general', localConfig, localGeneralSlots)
            }
            className="submit-btn"
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.6rem' }}
          >
            儲存一般時段設定
          </button>
        </div>

        <div className="timeslot-config-box">
          <h4 style={{ marginBottom: '1rem' }}>✨ 特別預約時段 (預設)</h4>
          <div className="generator-box">
            <input
              type="time"
              className="admin-time-input"
              value={localConfig.specialStart}
              onChange={(e) =>
                setLocalConfig({ ...localConfig, specialStart: e.target.value })
              }
            />
            <span>至</span>
            <input
              type="time"
              className="admin-time-input"
              value={localConfig.specialEnd}
              onChange={(e) =>
                setLocalConfig({ ...localConfig, specialEnd: e.target.value })
              }
            />
            <span>間隔 : </span>
            <input
              type="number"
              className="admin-time-input"
              style={{ width: '80px' }}
              value={localConfig.specialInterval}
              onChange={(e) =>
                setLocalConfig({
                  ...localConfig,
                  specialInterval: parseInt(e.target.value) || 30
                })
              }
            />
            <button
              onClick={() =>
                setLocalSpecialSlots(
                  generateTimeSlots(
                    localConfig.specialStart,
                    localConfig.specialEnd,
                    localConfig.specialInterval
                  )
                )
              }
            >
              自動新增
            </button>
          </div>
          <div className="manual-add">
            <input
              type="text"
              placeholder="HH:mm"
              value={newManualTime}
              onChange={(e) => setNewManualTime(e.target.value)}
            />
            <button onClick={() => handleManualAdd('special')}>手動新增</button>
          </div>
          <div className="slot-list">
            {localSpecialSlots.map((s) => (
              <span key={s} className="slot-tag">
                {s} <i onClick={() => removeSlot('special', s)}>×</i>
              </span>
            ))}
          </div>
          <button
            onClick={() =>
              saveTimeSlotsConfig('special', localConfig, localSpecialSlots)
            }
            className="submit-btn"
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.6rem' }}
          >
            儲存特別時段設定
          </button>
        </div>
      </div>
    </section>
  );
};

export default TimeSlotManagement;
