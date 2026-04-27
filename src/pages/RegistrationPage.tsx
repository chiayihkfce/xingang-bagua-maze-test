import React from 'react';
import CustomCursor from '../components/UI/CustomCursor';
import Header from '../components/UI/Header';
import BaguaParticles from '../components/UI/BaguaParticles';
import StorySection from '../components/Registration/StorySection';
import EventInfo from '../components/Registration/EventInfo';
import RegistrationForm from '../components/Registration/RegistrationForm';
import SocialButtons from '../components/UI/SocialButtons';
import Footer from '../components/UI/Footer';
import RegistrationOverlays from '../components/Registration/RegistrationOverlays';
import MiniGames from '../components/UI/MiniGames';

import { useAppContext } from '../context/AppContext';

const RegistrationPage: React.FC = () => {
  const [showGames, setShowGames] = React.useState(false);
  const {
    t, lang, setLang, theme, toggleTheme, formData, formErrors, sessionType, 
    setSessionType, sessions, timeslotConfig, generalTimeSlots, specialTimeSlots, 
    handleInputChange, handlePlayerInfoChange, handleCheckboxChange, handleDateChange, handleCopyAccount, 
    handleSubmit, isSubmitting, calculatedTotal, getSessionDisplayName, 
    getPickupLocationDisplay, getPaymentMethodDisplay, paymentMethods, identityPricings,
    isEntryAnimating, shouldRenderEntry, showConfirmation, setShowConfirmation, 
    handleConfirmSubmit, sysModal, showAlert
    } = useAppContext();
  return (
    <div className="container">
      <CustomCursor />
      <BaguaParticles />
      <MiniGames show={showGames} onClose={() => setShowGames(false)} />
      <RegistrationOverlays 
        {...{ 
          t, lang, isEntryAnimating, shouldRenderEntry, showConfirmation, 
          setShowConfirmation, formData, calculatedTotal, handleConfirmSubmit, 
          isSubmitting, getSessionDisplayName, getPickupLocationDisplay, 
          getPaymentMethodDisplay, sysModal 
        }} 
      />
      <Header {...{ lang, setLang, theme, toggleTheme, t }} />
      <main className="main-content">
        <div className="poster-container">
          <img src="poster.jpg" alt="Poster" className="poster-image" />
        </div>
        <StorySection t={t} />

        {/* 遊戲入口區 */}
        <section style={{ padding: '2rem 1rem', textAlign: 'center', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '15px', margin: '2rem 0', border: '1px dashed var(--primary-gold)' }}>
          <h3 style={{ color: 'var(--primary-gold)', marginBottom: '1rem' }}>☯ 陣法挑戰 ☯</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>在進入迷宮前，先試著感應八卦氣息吧！</p>
          <button 
            onClick={() => setShowGames(true)}
            className="submit-btn"
            style={{ maxWidth: '250px', margin: '0 auto', background: 'transparent', border: '1px solid var(--primary-gold)', color: 'var(--primary-gold)' }}
          >
            開啟八卦陣挑戰
          </button>
        </section>

        <EventInfo t={t} />
        <RegistrationForm 
          {...{ 
            t, lang, formData, formErrors, sessionType, setSessionType, 
            sessions, timeslotConfig, generalTimeSlots, specialTimeSlots, 
            handleInputChange, handlePlayerInfoChange, handleCheckboxChange, handleDateChange, 
            handleCopyAccount, handleSubmit, isSubmitting, calculatedTotal, 
            getSessionDisplayName, paymentMethods, identityPricings, showAlert 
          }} 
        />
      </main>
      <SocialButtons t={t} />
      <Footer t={t} />
    </div>
  );
};

export default RegistrationPage;
