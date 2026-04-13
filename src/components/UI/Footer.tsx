import React from 'react';

interface FooterProps {
  t: any;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>{t.contactInfo}</h3>
        <p>{t.foundationName}</p>
        <p>
          <a 
            href="https://www.google.com.tw/maps/place/%E8%B2%A1%E5%9C%98%E6%B3%95%E4%BA%BA%E6%96%B0%E6%B8%AF%E6%96%87%E6%95%99%E5%9F%BA%E9%87%91%E6%9C%83/@23.5600241,120.3436242,17z/data=!4m5!3m4!1s0x346ebd52d25d3f79:0xee3b4c7708b19c2e!8m2!3d23.5598989!4d120.3437709?hl=zh-TW&shorturl=1" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="address-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', verticalAlign: 'middle'}}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {t.address}
          </a>
        </p>
        <p>{t.phoneFull}</p>
        <div className="refund-policy">
          <h4>{t.refundTitle}</h4>
          <ul>
            <li>{t.refund1}</li>
            <li>{t.refund2}</li>
            <li>{t.refund3}</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="admin-logo-wrapper">
          <img src="footer-logo.svg" alt="Hsinkang Foundation Logo" className="footer-admin-logo" />
        </div>
        <p className="copy">{t.footerCopy}</p>
      </div>
    </footer>
  );
};

export default Footer;
