import { useState, useEffect } from 'react'
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc
} from "firebase/firestore";
import { db } from "../firebase";
import { Session, TimeslotConfig, PaymentMethod, FormData } from '../types'

export const useFirebaseListeners = (setFormData: React.Dispatch<React.SetStateAction<FormData>>) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  
  const [generalTimeSlots, setGeneralTimeSlots] = useState<string[]>(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00']);
  const [specialTimeSlots, setSpecialTimeSlots] = useState<string[]>(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00']);
  const [timeslotConfig, setTimeslotConfig] = useState<TimeslotConfig>({
    generalStart: '09:00', generalEnd: '15:00', generalInterval: 30,
    specialStart: '09:00', specialEnd: '15:00', specialInterval: 30
  });
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isEntryAnimating, setIsEntryAnimating] = useState(true); 
  const [shouldRenderEntry, setShouldRenderEntry] = useState(true);

  useEffect(() => {
    const minEntryTime = 2500; 
    const startTime = Date.now();
    let isTransitionStarted = false; 

    const triggerExitAnimation = () => {
      if (isTransitionStarted) return;
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime >= minEntryTime) {
        isTransitionStarted = true;
        setIsEntryAnimating(false);
        setTimeout(() => setShouldRenderEntry(false), 800);
      } else {
        const remainingTime = minEntryTime - elapsedTime;
        setTimeout(() => {
          if (!isTransitionStarted) {
            isTransitionStarted = true;
            setIsEntryAnimating(false);
            setTimeout(() => setShouldRenderEntry(false), 800);
          }
        }, remainingTime);
      }
    };
    
    const fetchSessions = () => {
      console.log('🚀 啟動 Firebase 監聽器...');
      
      const qGeneral = query(collection(db, "sessions"), orderBy("name"));
      const qSpecial = query(collection(db, "special_sessions"), orderBy("name"));
      
      let generalSessions: Session[] = [];
      let specialSessions: Session[] = [];

      const updateAllSessions = () => {
        const merged = [...generalSessions, ...specialSessions].sort((a, b) => a.name.localeCompare(b.name));
        setSessions(merged);
        localStorage.setItem('bagua_maze_sessions', JSON.stringify(merged));
      };

      const unsubGeneral = onSnapshot(qGeneral, (snapshot) => {
        generalSessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isSpecial: false })) as Session[];
        updateAllSessions();
        setDbStatus('connected');
      }, (err) => {
        console.error('❌ 一般場次連線錯誤:', err);
        setDbStatus('error');
      });

      const unsubSpecial = onSnapshot(qSpecial, (snapshot) => {
        specialSessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), isSpecial: true })) as Session[];
        updateAllSessions();
      }, (err) => {
        console.error('❌ 特別場次連線錯誤:', err);
      });

      return () => {
        unsubGeneral();
        unsubSpecial();
      };
    };

    const fetchTimeSlots = () => {
      const unsubGeneral = onSnapshot(doc(db, "config", "general_timeslots"), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.slots) setGeneralTimeSlots(data.slots);
          if (data.config) {
            setTimeslotConfig(prev => ({
              ...prev,
              generalStart: data.config.start,
              generalEnd: data.config.end,
              generalInterval: data.config.interval
            }));
          }
        }
      });

      const unsubSpecial = onSnapshot(doc(db, "config", "special_timeslots"), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.slots) setSpecialTimeSlots(data.slots);
          if (data.config) {
            setTimeslotConfig(prev => ({
              ...prev,
              specialStart: data.config.start,
              specialEnd: data.config.end,
              specialInterval: data.config.interval
            }));
          }
        }
      });

      return () => {
        unsubGeneral();
        unsubSpecial();
      };
    };

    const fetchPaymentMethods = () => {
      const unsubscribe = onSnapshot(doc(db, "config", "payments"), (docSnap) => {
        if (docSnap.exists()) {
          const methods = docSnap.data().methods || [];
          setPaymentMethods(methods);
          
          setFormData(prev => {
            if (methods.length > 0 && !methods.find((m: any) => m.name === prev.paymentMethod)) {
              return { ...prev, paymentMethod: methods[0].name };
            }
            return prev;
          });
        }
      });
      return unsubscribe;
    };

    const unsubSessions = fetchSessions();
    const unsubSlots = fetchTimeSlots();
    const unsubPayments = fetchPaymentMethods();
    triggerExitAnimation();

    return () => {
      unsubSessions();
      unsubSlots();
      unsubPayments();
    };
  }, [setFormData]);

  return {
    sessions,
    setSessions,
    dbStatus,
    setDbStatus,
    generalTimeSlots,
    setGeneralTimeSlots,
    specialTimeSlots,
    setSpecialTimeSlots,
    timeslotConfig,
    setTimeslotConfig,
    paymentMethods,
    setPaymentMethods,
    isEntryAnimating,
    shouldRenderEntry
  };
};
