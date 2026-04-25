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

import { useAppContext } from '../context/AppContext';

const RegistrationPage: React.FC = () => {
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
