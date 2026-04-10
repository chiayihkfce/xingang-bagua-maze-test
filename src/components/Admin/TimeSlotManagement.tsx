import React from 'react';
import { TimeslotConfig } from '../../types';

interface TimeSlotManagementProps {
  timeslotConfig: TimeslotConfig;
  setTimeslotConfig: (config: TimeslotConfig) => void;
  generalTimeSlots: string[];
  setGeneralTimeSlots: (slots: string[]) => void;
  specialTimeSlots: string[];
  setSpecialTimeSlots: (slots: string[]) => void;
  generateTimeSlots: (start: string, end: string, interval: number) => string[];
  newManualTime: string;
  setNewManualTime: (time: string) => void;
  handleManualTimeAdd: (type: 'general' | 'special') => void;
  removeTimeSlot: (type: 'general' | 'special', slot: string) => void;
  saveTimeSlotsConfig: () => void;
}

const TimeSlotManagement: React.FC<TimeSlotManagementProps> = ({
  timeslotConfig,
  setTimeslotConfig,
  generalTimeSlots,
  setGeneralTimeSlots,
  specialTimeSlots,
  setSpecialTimeSlots,
  generateTimeSlots,
  newManualTime,
  setNewManualTime,
  handleManualTimeAdd,
  removeTimeSlot,
  saveTimeSlotsConfig
}) => {
  return (
    <section className="admin-section form-card">
      <h3 className="form-section-title">開放時間段管理</h3>
      <div className="timeslot-admin-grid">
        <div className="timeslot-config-box">
          <h4>📅 一般預約時段</h4>
          <div className="generator-box">
            <input type="time" className="admin-time-input" value={timeslotConfig.generalStart} onChange={e => setTimeslotConfig({...timeslotConfig, generalStart: e.target.value})} />
            <span>至</span>
            <input type="time" className="admin-time-input" value={timeslotConfig.generalEnd} onChange={e => setTimeslotConfig({...timeslotConfig, generalEnd: e.target.value})} />
            <span>間隔時間 : </span>
            <input type="number" className="admin-time-input" style={{ width: '100px' }} placeholder="間隔(分)" value={timeslotConfig.generalInterval} onChange={e => setTimeslotConfig({...timeslotConfig, generalInterval: parseInt(e.target.value)})} />
            <button onClick={() => setGeneralTimeSlots(generateTimeSlots(timeslotConfig.generalStart, timeslotConfig.generalEnd, timeslotConfig.generalInterval))}>自動新增</button>
          </div>
          <div className="manual-add">
            <input type="text" placeholder="HH:mm" value={newManualTime} onChange={e => setNewManualTime(e.target.value)} />
            <button onClick={() => handleManualTimeAdd('general')}>手動新增</button>
          </div>
          <div className="slot-list">
            {generalTimeSlots.map(s => (
              <span key={s} className="slot-tag">{s} <i onClick={() => removeTimeSlot('general', s)}>×</i></span>
            ))}
          </div>
        </div>

        <div className="timeslot-config-box">
          <h4>✨ 特別預約時段</h4>
          <div className="generator-box">
            <input type="time" className="admin-time-input" value={timeslotConfig.specialStart} onChange={e => setTimeslotConfig({...timeslotConfig, specialStart: e.target.value})} />
            <span>至</span>
            <input type="time" className="admin-time-input" value={timeslotConfig.specialEnd} onChange={e => setTimeslotConfig({...timeslotConfig, specialEnd: e.target.value})} />
            <span>間隔時間 : </span>
            <input type="number" placeholder="間隔(分)" value={timeslotConfig.specialInterval} onChange={e => setTimeslotConfig({...timeslotConfig, specialInterval: parseInt(e.target.value)})} />
            <button onClick={() => setSpecialTimeSlots(generateTimeSlots(timeslotConfig.specialStart, timeslotConfig.specialEnd, timeslotConfig.specialInterval))}>自動新增</button>
          </div>
          <div className="manual-add">
            <input type="text" placeholder="HH:mm" value={newManualTime} onChange={e => setNewManualTime(e.target.value)} />
            <button onClick={() => handleManualTimeAdd('special')}>手動新增</button>
          </div>
          <div className="slot-list">
            {specialTimeSlots.map(s => (
              <span key={s} className="slot-tag">{s} <i onClick={() => removeTimeSlot('special', s)}>×</i></span>
            ))}
          </div>
        </div>
      </div>
      <button onClick={saveTimeSlotsConfig} className="submit-btn" style={{width: '100%', marginTop: '2rem'}}>儲存所有時間段設定</button>
    </section>
  );
};

export default TimeSlotManagement;
