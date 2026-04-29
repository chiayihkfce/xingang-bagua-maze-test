import React, { useState } from 'react';
import { useRegistrationLookup } from '../../hooks/useRegistrationLookup';
interface StatusLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

const StatusLookupModal: React.FC<StatusLookupModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [keyword, setKeyword] = useState('');
  const { lookupRegistration, loading, results, error, setResults } =
    useRegistrationLookup();

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    lookupRegistration(keyword);
  };

  const maskName = (name: string) => {
    if (!name) return '***';
    if (name.length <= 2) return name[0] + '*';
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '通過':
        return '#27ae60';
      case '待審核':
        return '#f39c12';
      default:
        return '#7f8c8d';
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <div
        className="modal-content"
        style={{
          maxWidth: '500px',
          width: '90%',
          border: '2px solid #d4af37',
          background: '#1a1a1a',
          borderRadius: '15px',
          padding: '30px',
          position: 'relative'
        }}
      >
        <button
          onClick={() => {
            onClose();
            setResults([]);
            setKeyword('');
          }}
          style={{
            position: 'absolute',
            right: '15px',
            top: '15px',
            background: 'none',
            border: 'none',
            color: '#d4af37',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        <h2
          style={{
            color: '#d4af37',
            textAlign: 'center',
            marginBottom: '20px',
            letterSpacing: '2px'
          }}
        >
          {lang === 'en' ? 'Registration Inquiry' : '報名進度查詢'}
        </h2>

        <form
          onSubmit={handleSearch}
          style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}
        >
          <input
            type="text"
            placeholder={
              lang === 'en' ? 'Email or Phone' : '請輸入 Email 或電話'
            }
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #333',
              background: '#0a0a0a',
              color: '#fff'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0 20px',
              background: '#d4af37',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'opacity 0.3s'
            }}
          >
            {loading ? '...' : lang === 'en' ? 'Search' : '查詢'}
          </button>
        </form>

        {error && (
          <p
            style={{
              color: '#e74c3c',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}
          >
            {error}
          </p>
        )}

        <div
          style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '10px' }}
        >
          {results.map((reg, idx) => (
            <div
              key={reg.id || idx}
              style={{
                padding: '15px',
                borderBottom: '1px solid #333',
                marginBottom: '10px',
                background: 'rgba(212, 175, 55, 0.05)',
                borderRadius: '8px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}
              >
                <span style={{ fontWeight: 'bold', color: '#fff' }}>
                  {maskName(reg.name)}
                </span>
                <span
                  style={{
                    color: getStatusColor(reg.status),
                    fontWeight: 'bold'
                  }}
                >
                  {reg.status}
                </span>
              </div>
              <div
                style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}
              >
                <p>場次：{reg.session}</p>
                <p>時間：{reg.pickupTime}</p>

                {reg.status === '通過' &&
                  (() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const playDate = new Date(
                      reg.pickupTime.split(' ')[0].replace(/-/g, '/')
                    );
                    playDate.setHours(0, 0, 0, 0);

                    // 只有今天 > 遊玩日期 (即隔天開始) 才能領取
                    const canClaim = today > playDate;

                    if (canClaim) {
                      return (
                        <button
                          onClick={() =>
                            (window.location.href = `?certId=${reg.id}`)
                          }
                          style={{
                            marginTop: '12px',
                            width: '100%',
                            padding: '10px',
                            background: '#d4af37',
                            color: '#000',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          🏆{' '}
                          {lang === 'en'
                            ? 'Claim Certificate'
                            : '領取數位成就證書'}
                        </button>
                      );
                    } else {
                      return (
                        <p
                          style={{
                            marginTop: '12px',
                            padding: '8px',
                            border: '1px dashed rgba(212, 175, 55, 0.4)',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            color: '#d4af37',
                            textAlign: 'center'
                          }}
                        >
                          ⏳{' '}
                          {lang === 'en'
                            ? 'Available after event'
                            : '成就證書將於活動隔日開放領取'}
                        </p>
                      );
                    }
                  })()}

                {reg.status === '通過' && reg.certSent && !loading && (
                  <p
                    style={{
                      color: '#27ae60',
                      marginTop: '8px',
                      fontSize: '0.8rem'
                    }}
                  >
                    ✓ 證書已同步寄發至您的 Email
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: '20px',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.4)',
            textAlign: 'center'
          }}
        >
          {lang === 'en'
            ? '*Only shows recent 5 entries.'
            : '*僅顯示最近 5 筆報名資料'}
        </p>
      </div>
    </div>
  );
};

export default StatusLookupModal;
