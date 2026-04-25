import React, { useState, useEffect } from 'react';
import { AdminAccount, SealConfig, SealType } from '../../types';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

interface AdminSettingsModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  currentAdmin: AdminAccount | null;
  setCurrentAdmin: (admin: AdminAccount | null) => void;
  sealConfig: SealConfig;
  updateSealConfig: (type: SealType) => Promise<void>;
  identityPricings: IdentityPricing[];
  saveIdentityPricing: (config: Partial<IdentityPricing>) => Promise<void>;
  deleteIdentityPricing: (id: string, name: string) => Promise<void>;
  showAlert: (message: string, title?: string) => void;
  showConfirm: (message: string, onConfirm: () => void, onCancel?: () => void, title?: string) => void;
}

const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ 
  show, 
  setShow, 
  currentAdmin, 
  setCurrentAdmin,
  sealConfig,
  updateSealConfig,
  identityPricings,
  saveIdentityPricing,
  deleteIdentityPricing,
  showAlert,
  showConfirm
}) => {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'list' | 'seal' | 'pricing'>('profile');
  
  // 表單狀態
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // 身分金額狀態 (用於新增/編輯)
  const [editingIp, setEditingIp] = useState<Partial<IdentityPricing> | null>(null);
  const [ipName, setIpName] = useState('');
  const [ipPrice, setIpPrice] = useState<number | string>('');

  // 新增管理者狀態
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newNickname, setNewNickname] = useState('');

  useEffect(() => {
    if (show && currentAdmin) {
      setNickname(currentAdmin.nickname || currentAdmin.username);
      setUsername(currentAdmin.username);
      setPassword(currentAdmin.password || '');
      fetchAdmins();
    }
  }, [show, currentAdmin]);

  const handleStartEditIp = (ip: IdentityPricing) => {
    setEditingIp(ip);
    setIpName(ip.name);
    setIpPrice(ip.price);
  };

  const handleCancelEditIp = () => {
    setEditingIp(null);
    setIpName('');
    setIpPrice(0);
  };

  const handleSaveIp = async () => {
    if (!ipName) {
      showAlert('請輸入身分名稱');
      return;
    }
    await saveIdentityPricing({
      id: editingIp?.id,
      name: ipName,
      price: ipPrice,
      enabled: editingIp ? editingIp.enabled : true
    });
    handleCancelEditIp();
  };

  const fetchAdmins = async () => {
    try {
      const q = query(collection(db, "admins"), orderBy("username"));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminAccount));
      setAdmins(data);
    } catch (e) {
      console.error("Error fetching admins:", e);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin || !username || !password) return;
    
    setIsSubmitting(true);
    try {
      const adminRef = doc(db, "admins", currentAdmin.id);
      const updateData = {
        username,
        password,
        nickname: nickname || username,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(adminRef, updateData);
      setCurrentAdmin({ ...currentAdmin, ...updateData });
      showAlert('個人設定已更新');
      fetchAdmins();
    } catch (e) {
      showAlert('更新失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "admins"), {
        username: newUsername,
        password: newPassword,
        nickname: newNickname || newUsername,
        role: 'admin',
        createdAt: serverTimestamp()
      });
      showAlert('新增管理者成功');
      setNewUsername('');
      setNewPassword('');
      setNewNickname('');
      fetchAdmins();
    } catch (e) {
      showAlert('新增失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (id: string, name: string) => {
    if (id === currentAdmin?.id) {
      showAlert('無法刪除目前登入的帳號');
      return;
    }
    
    showConfirm(`確定要刪除管理者「${name}」嗎？`, async () => {
      try {
        await deleteDoc(doc(db, "admins", id));
        showAlert('刪除成功');
        fetchAdmins();
      } catch (e) {
        showAlert('刪除失敗');
      }
    });
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1100, backdropFilter: 'blur(8px)' }}>
      <div className="modal-content admin-settings-modal" style={{ 
        maxWidth: '650px', 
        width: '95%', 
        position: 'relative', 
        background: 'var(--container-bg, #121212)', 
        border: '2px solid var(--primary-gold)', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 20px rgba(241, 196, 15, 0.1)',
        borderRadius: '16px',
        padding: '0',
        overflow: 'hidden'
      }}>
        {/* Header 區域 */}
        <div className="modal-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1.5rem 2rem',
          background: 'rgba(241, 196, 15, 0.05)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontFamily: "'Noto Serif TC', serif", 
            color: 'var(--primary-gold)',
            fontSize: '1.5rem',
            letterSpacing: '1px'
          }}>系統設定 & 帳號管理</h2>
          <button 
            className="close-btn" 
            onClick={() => setShow(false)}
            style={{ 
              fontSize: '2.5rem', 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer', 
              lineHeight: 0.5,
              padding: '10px',
              transition: 'color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary-gold)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            &times;
          </button>
        </div>

        {/* Tab 切換區 */}
        <div className="admin-tabs" style={{ 
          display: 'flex', 
          gap: '0', 
          background: 'rgba(255,255,255,0.02)'
        }}>
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            style={{ 
              flex: 1,
              padding: '1rem', 
              background: activeTab === 'profile' ? 'rgba(241, 196, 15, 0.1)' : 'none', 
              border: 'none', 
              borderBottom: activeTab === 'profile' ? '3px solid var(--primary-gold)' : '3px solid transparent', 
              color: activeTab === 'profile' ? 'var(--primary-gold)' : 'var(--text-muted)', 
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            👤 個人設定
          </button>
          <button 
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
            style={{ 
              flex: 1,
              padding: '1rem', 
              background: activeTab === 'list' ? 'rgba(241, 196, 15, 0.1)' : 'none', 
              border: 'none', 
              borderBottom: activeTab === 'list' ? '3px solid var(--primary-gold)' : '3px solid transparent', 
              color: activeTab === 'list' ? 'var(--primary-gold)' : 'var(--text-muted)', 
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            🔑 管理者名單
          </button>
          <button 
            className={`tab-btn ${activeTab === 'seal' ? 'active' : ''}`}
            onClick={() => setActiveTab('seal')}
            style={{ 
              flex: 1,
              padding: '1rem', 
              background: activeTab === 'seal' ? 'rgba(241, 196, 15, 0.1)' : 'none', 
              border: 'none', 
              borderBottom: activeTab === 'seal' ? '3px solid var(--primary-gold)' : '3px solid transparent', 
              color: activeTab === 'seal' ? 'var(--primary-gold)' : 'var(--text-muted)', 
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            📜 系統官印
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
            style={{ 
              flex: 1,
              padding: '1rem', 
              background: activeTab === 'pricing' ? 'rgba(241, 196, 15, 0.1)' : 'none', 
              border: 'none', 
              borderBottom: activeTab === 'pricing' ? '3px solid var(--primary-gold)' : '3px solid transparent', 
              color: activeTab === 'pricing' ? 'var(--primary-gold)' : 'var(--text-muted)', 
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            💰 活動費率
          </button>
        </div>

        <div className="modal-body" style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'profile' ? (
            // ... (keep profile tab)
            <form onSubmit={handleUpdateProfile} className="settings-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>顯示暱稱</label>
                <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="輸入暱稱" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--input-bg, rgba(255,255,255,0.05))', color: 'var(--text-light)' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>管理員帳號</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--input-bg, rgba(255,255,255,0.05))', color: 'var(--text-light)' }} />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>修改密碼</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--input-bg, rgba(255,255,255,0.05))', color: 'var(--text-light)' }} />
              </div>
              <button type="submit" className="submit-btn" disabled={isSubmitting} style={{
                marginTop: '1rem',
                padding: '1rem',
                borderRadius: '12px',
                background: 'var(--primary-gold)',
                color: '#000000',
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(241, 196, 15, 0.3)',
                border: 'none',
                cursor: 'pointer'
              }}>
                {isSubmitting ? '儲存中...' : '確認修改內容'}
              </button>
            </form>
            ) : activeTab === 'pricing' ? (
              <div className="pricing-settings-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(241, 196, 15, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(241, 196, 15, 0.2)' }}>
                  <h4 style={{ color: 'var(--primary-gold)', marginBottom: '0.5rem' }}>💰 特定身分優待費率管理</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>您可以新增多種身分（如：志工、教職員、在地居民），並為其設定獨立的固定單價。</p>
                  
                  {/* 新增/編輯表單 */}
                  <div style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    padding: '1.2rem', 
                    borderRadius: '10px', 
                    border: '1px dashed rgba(241, 196, 15, 0.3)',
                    marginBottom: '1.5rem'
                  }}>
                    <h5 style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>{editingIp ? '✨ 編輯身分費率' : '➕ 新增身分費率'}</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'flex-end' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>身分名稱</label>
                        <input 
                          type="text" 
                          value={ipName} 
                          onChange={e => setIpName(e.target.value)} 
                          placeholder="例如：志工" 
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--input-bg)', color: 'var(--text-light)' }} 
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>固定單價 (NT$)</label>
                        <input 
                          type="number" 
                          value={ipPrice} 
                          onChange={e => setIpPrice(Number(e.target.value))} 
                          placeholder="650" 
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--input-bg)', color: 'var(--text-light)' }} 
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button 
                          onClick={handleSaveIp}
                          disabled={isSubmitting || !ipName}
                          style={{ padding: '0.6rem 1.2rem', borderRadius: '6px', background: 'var(--primary-gold)', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                        >
                          {editingIp ? '更新' : '新增'}
                        </button>
                        {editingIp && (
                          <button 
                            onClick={handleCancelEditIp}
                            style={{ padding: '0.6rem 1rem', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer' }}
                          >
                            取消
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 費率列表 */}
                  <div className="pricing-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {identityPricings.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>尚未設定任何特殊身分費率</div>
                    ) : (
                      identityPricings.map(ip => (
                        <div key={ip.id} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          padding: '1rem', 
                          background: 'rgba(255,255,255,0.02)', 
                          borderRadius: '8px', 
                          border: '1px solid var(--border-subtle)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div 
                              onClick={() => saveIdentityPricing({ ...ip, enabled: !ip.enabled })}
                              style={{ 
                                width: '40px', 
                                height: '20px', 
                                borderRadius: '10px', 
                                background: ip.enabled ? 'var(--primary-gold)' : '#333', 
                                position: 'relative', 
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                              }}
                            >
                              <div style={{ 
                                width: '16px', 
                                height: '16px', 
                                borderRadius: '50%', 
                                background: 'white', 
                                position: 'absolute', 
                                top: '2px', 
                                left: ip.enabled ? '22px' : '2px',
                                transition: 'all 0.3s'
                              }} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 'bold', color: ip.enabled ? 'var(--text-light)' : 'var(--text-muted)' }}>
                                {ip.name}
                                {!ip.enabled && <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: '#ff4d4d' }}>(已停用)</span>}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--primary-gold)' }}>NT$ {ip.price} / 每份</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              onClick={() => handleStartEditIp(ip)}
                              style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                              編輯
                            </button>
                            <button 
                              onClick={() => deleteIdentityPricing(ip.id, ip.name)}
                              style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                              刪除
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : activeTab === 'seal' ? (
            <div className="seal-settings-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(241, 196, 15, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(241, 196, 15, 0.2)' }}>
                <h4 style={{ color: 'var(--primary-gold)', marginBottom: '0.5rem' }}>📜 數位證書官印設定</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>選擇下載證書時所使用的印章樣式（全系統同步生效）</p>

                <div className="seal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                  {sealConfig?.activeSeal && [
                    { id: 'full-yang', name: '滿漢合璧・陽刻 (RL)', desc: '傳統清代官印格式' },
                    { id: 'full-yin', name: '滿漢合璧・陰刻 (RL)', desc: '厚重古樸蓋印感' },
                    { id: 'zh-vert-rl-yang', name: '純漢文・直排右起・陽刻', desc: '九疊篆傳統佈局' },
                    { id: 'zh-vert-rl-yin', name: '純漢文・直排右起・陰刻', desc: '九疊篆白文風格' },
                    { id: 'zh-vert-lr-yang', name: '純漢文・直排左起・陽刻', desc: '現代直排閱讀順序' },
                    { id: 'zh-vert-lr-yin', name: '純漢文・直排左起・陰刻', desc: '現代直排白文風格' },
                    { id: 'zh-horiz-lr-yang', name: '純漢文・橫排左起・陽刻', desc: '現代匾額橫式排版' },
                    { id: 'zh-horiz-lr-yin', name: '純漢文・橫排左起・陰刻', desc: '現代橫式白文風格' }
                  ].map((seal) => (

                    <div 
                      key={seal.id}
                      onClick={() => updateSealConfig(seal.id as SealType)}
                      style={{ 
                        padding: '1rem',
                        borderRadius: '10px',
                        border: `2px solid ${sealConfig?.activeSeal === seal.id ? 'var(--primary-gold)' : 'var(--border-subtle)'}`,
                        background: sealConfig?.activeSeal === seal.id ? 'rgba(241, 196, 15, 0.1)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: 'bold', color: sealConfig?.activeSeal === seal.id ? 'var(--primary-gold)' : 'var(--text-light)' }}>{seal.name}</span>
                        {sealConfig?.activeSeal === seal.id && <span style={{ fontSize: '0.8rem' }}>✅ 已選用</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{seal.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            ) : (
            <div className="admin-list-section">

              {/* 只有超級管理員可以看到新增表單 */}
              {currentAdmin?.role === 'super' && (
                <form onSubmit={handleAddAdmin} className="add-admin-form" style={{
                  background: 'rgba(241, 196, 15, 0.05)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  marginBottom: '2rem',
                  border: '1px dashed var(--primary-gold)'
                }}>
                  <h4 style={{ marginBottom: '1rem', color: 'var(--primary-gold)' }}>✨ 新增管理員帳號</h4>
                  <div className="add-admin-grid">
                    <input type="text" placeholder="帳號" value={newUsername} onChange={e => setNewUsername(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--container-bg)', color: 'var(--text-light)' }} />
                    <input type="password" placeholder="密碼" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--container-bg)', color: 'var(--text-light)' }} />
                  </div>                  <input type="text" placeholder="暱稱 (選填)" value={newNickname} onChange={e => setNewNickname(e.target.value)} style={{ marginTop: '1rem', width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--container-bg)', color: 'var(--text-light)' }} />
                  <button type="submit" className="submit-btn" style={{ marginTop: '1.5rem', width: '100%', borderRadius: '10px' }} disabled={isSubmitting}>
                    ＋ 建立新帳號
                  </button>
                </form>
              )}

              <div className="admin-table-wrapper" style={{ maxHeight: '300px', overflowY: 'auto', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)' }}>
                      <th style={{ padding: '1rem', color: 'var(--text-light)' }}>暱稱 / 帳號</th>
                      <th style={{ padding: '1rem', color: 'var(--text-light)' }}>權限</th>
                      <th style={{ padding: '1rem', color: 'var(--text-light)' }}>最後登入</th>
                      <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-light)' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map(admin => (
                      <tr key={admin.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 'bold', color: 'var(--text-light)' }}>{admin.nickname || admin.username}</div>
                          <small style={{ color: 'var(--text-muted)' }}>@{admin.username}</small>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            padding: '2px 8px', 
                            borderRadius: '4px', 
                            background: admin.role === 'super' ? 'var(--primary-gold)' : 'rgba(255,255,255,0.1)',
                            color: admin.role === 'super' ? '#000000' : 'var(--text-light)',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}>
                            {admin.role === 'super' ? '超級' : '一般'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <small style={{ color: 'var(--text-muted)' }}>{admin.lastLogin ? admin.lastLogin : '尚未登入'}</small>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          {/* 只有超級管理員可以刪除他人，且不能刪除超級管理員與自己 */}
                          {currentAdmin?.role === 'super' && admin.role !== 'super' && admin.id !== currentAdmin?.id ? (
                            <button 
                              onClick={() => handleDeleteAdmin(admin.id, admin.username)}
                              style={{ background: 'rgba(231, 76, 60, 0.1)', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '5px 10px', borderRadius: '6px' }}
                            >
                              刪除
                            </button>
                          ) : (
                            <small style={{ color: 'var(--text-muted)' }}>-</small>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsModal;
