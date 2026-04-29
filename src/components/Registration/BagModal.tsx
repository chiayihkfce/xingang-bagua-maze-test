import React from 'react';

/**
 * 寶箱 SVG 圖示組件
 */
export const ChestIcon: React.FC<{ size?: number }> = ({ size = 50 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 9V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V9H20Z"
      stroke="var(--primary-gold)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M20 9V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V9H20Z"
      stroke="var(--primary-gold)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <rect
      x="10"
      y="8"
      width="4"
      height="4"
      rx="1"
      fill="#000"
      stroke="var(--primary-gold)"
      strokeWidth="1"
    />
    <circle cx="12" cy="10" r="0.5" fill="var(--primary-gold)" />
    <path
      d="M8 5V19"
      stroke="var(--primary-gold)"
      strokeWidth="1"
      strokeDasharray="2 2"
      opacity="0.5"
    />
    <path
      d="M16 5V19"
      stroke="var(--primary-gold)"
      strokeWidth="1"
      strokeDasharray="2 2"
      opacity="0.5"
    />
  </svg>
);

interface BagModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasFlashlight: boolean;
  hasPoetrySlip: boolean;
  hasTigerSeal: boolean;
  hasDuckSoup: boolean;
  hasCandy: boolean;
  isFlashlightOn: boolean;
  onToggleFlashlight: () => void;
  showMysticScroll: () => void;
  triggerBaguaBox: () => void;
}

/**
 * 🎒 我的道具箱彈窗
 */
const BagModal: React.FC<BagModalProps> = ({
  isOpen,
  onClose,
  hasFlashlight,
  hasPoetrySlip,
  hasTigerSeal,
  hasDuckSoup,
  hasCandy,
  isFlashlightOn,
  onToggleFlashlight,
  showMysticScroll,
  triggerBaguaBox
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '450px', width: '90%' }}
      >
        <div
          className="modal-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
            paddingBottom: '15px'
          }}
        >
          <ChestIcon size={30} />
          <h2 style={{ color: 'var(--primary-gold)', margin: 0 }}>
            我的最終神祕道具箱
          </h2>
        </div>

        <div
          className="modal-body"
          style={{
            padding: '20px 10px',
            textAlign: 'center',
            maxHeight: '70vh',
            overflowY: 'auto'
          }}
        >
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              marginBottom: '25px'
            }}
          >
            點擊道具以使用或查看
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '30px 10px',
              justifyItems: 'center',
              paddingBottom: '20px'
            }}
          >
            {/* 1. 手電筒 */}
            <div
              onClick={hasFlashlight ? onToggleFlashlight : undefined}
              style={{
                width: '80px',
                height: '80px',
                background: hasFlashlight
                  ? isFlashlightOn
                    ? 'var(--primary-gold)'
                    : 'rgba(212, 175, 55, 0.1)'
                  : 'rgba(255,255,255,0.05)',
                border: `2px solid ${hasFlashlight ? (isFlashlightOn ? '#fff' : 'var(--primary-gold)') : '#444'}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                opacity: hasFlashlight ? 1 : 0.5,
                boxShadow:
                  hasFlashlight && isFlashlightOn
                    ? '0 0 20px var(--primary-gold)'
                    : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '2.2rem' }}>
                {hasFlashlight ? '🔦' : '🔒'}
              </span>
              <span
                style={{
                  position: 'absolute',
                  bottom: '-22px',
                  fontSize: '0.7rem',
                  color: hasFlashlight ? 'var(--primary-gold)' : '#888',
                  whiteSpace: 'nowrap',
                  fontWeight: 'bold'
                }}
              >
                {hasFlashlight ? '手電筒' : '未獲得'}
              </span>
            </div>
            {/* 2. 詩籤 */}
            <div
              onClick={hasPoetrySlip ? showMysticScroll : undefined}
              style={{
                width: '80px',
                height: '80px',
                background: hasPoetrySlip
                  ? 'rgba(212, 175, 55, 0.1)'
                  : 'rgba(255,255,255,0.05)',
                border: `2px solid ${hasPoetrySlip ? 'var(--primary-gold)' : '#444'}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                opacity: hasPoetrySlip ? 1 : 0.5
              }}
            >
              <span style={{ fontSize: '2.2rem' }}>
                {hasPoetrySlip ? '📜' : '🔒'}
              </span>
              <span
                style={{
                  position: 'absolute',
                  bottom: '-22px',
                  fontSize: '0.7rem',
                  color: hasPoetrySlip ? 'var(--primary-gold)' : '#888',
                  whiteSpace: 'nowrap',
                  fontWeight: 'bold'
                }}
              >
                {hasPoetrySlip ? '神祕詩籤' : '未獲得'}
              </span>
            </div>
            {/* 3. 虎爺 */}
            <div
              onClick={
                hasTigerSeal
                  ? () => {
                      onClose();
                      triggerBaguaBox();
                    }
                  : undefined
              }
              style={{
                width: '80px',
                height: '80px',
                background: hasTigerSeal
                  ? 'rgba(212, 175, 55, 0.1)'
                  : 'rgba(255,255,255,0.05)',
                border: `2px solid ${hasTigerSeal ? 'var(--primary-gold)' : '#444'}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                opacity: hasTigerSeal ? 1 : 0.5
              }}
            >
              <span style={{ fontSize: '2.2rem' }}>
                {hasTigerSeal ? '🐯' : '🔒'}
              </span>
              <span
                style={{
                  position: 'absolute',
                  bottom: '-22px',
                  fontSize: '0.7rem',
                  color: hasTigerSeal ? 'var(--primary-gold)' : '#888',
                  whiteSpace: 'nowrap',
                  fontWeight: 'bold'
                }}
              >
                {hasTigerSeal ? '虎爺符令' : '未獲得'}
              </span>
            </div>
            {/* 4. 鴨肉羹 */}
            <div
              style={{
                width: '80px',
                height: '80px',
                background: hasDuckSoup
                  ? 'rgba(212, 175, 55, 0.1)'
                  : 'rgba(255,255,255,0.05)',
                border: `2px solid ${hasDuckSoup ? 'var(--primary-gold)' : '#444'}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                opacity: hasDuckSoup ? 1 : 0.5
              }}
            >
              <span style={{ fontSize: '2.2rem' }}>
                {hasDuckSoup ? '🍜' : '🔒'}
              </span>
              <span
                style={{
                  position: 'absolute',
                  bottom: '-22px',
                  fontSize: '0.7rem',
                  color: hasDuckSoup ? 'var(--primary-gold)' : '#888',
                  whiteSpace: 'nowrap',
                  fontWeight: 'bold'
                }}
              >
                {hasDuckSoup ? '鴨肉羹' : '未獲得'}
              </span>
            </div>
            {/* 5. 新港飴 */}
            <div
              style={{
                width: '80px',
                height: '80px',
                background: hasCandy
                  ? 'rgba(212, 175, 55, 0.1)'
                  : 'rgba(255,255,255,0.05)',
                border: `2px solid ${hasCandy ? 'var(--primary-gold)' : '#444'}`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                opacity: hasCandy ? 1 : 0.5
              }}
            >
              <span style={{ fontSize: '2.2rem' }}>
                {hasCandy ? '🍬' : '🔒'}
              </span>
              <span
                style={{
                  position: 'absolute',
                  bottom: '-22px',
                  fontSize: '0.7rem',
                  color: hasCandy ? 'var(--primary-gold)' : '#888',
                  whiteSpace: 'nowrap',
                  fontWeight: 'bold'
                }}
              >
                {hasCandy ? '新港飴' : '未獲得'}
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: '50px',
              borderTop: '1px dashed rgba(212, 175, 55, 0.3)',
              paddingTop: '20px'
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginBottom: '10px'
              }}
            >
              —— 輸入感應到的密令 ——
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                id="secret-input"
                type="text"
                placeholder="在此輸入密令..."
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid #444',
                  borderRadius: '20px',
                  padding: '8px 15px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.currentTarget.value || '')
                      .toLowerCase()
                      .trim();
                    window.dispatchEvent(
                      new KeyboardEvent('keydown', { key: val[0] })
                    );
                    const event = new CustomEvent('secret-command', {
                      detail: val
                    });
                    window.dispatchEvent(event);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <button
            className="submit-btn"
            onClick={onClose}
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px solid var(--primary-gold)',
              color: 'var(--primary-gold)'
            }}
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

export default BagModal;
