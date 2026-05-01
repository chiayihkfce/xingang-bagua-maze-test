import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Session,
  TimeslotConfig,
  PaymentMethod,
  FormData,
  SealConfig,
  IdentityPricing,
  ClosedDaysConfig
} from '../types';

export const useFirebaseListeners = (
  formData: FormData,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  setSubmitted?: (val: boolean) => void,
  setLastSubmissionId?: (id: string | null) => void,
  setCalculatedTotal?: (val: number) => void,
  setClosedDaysConfig?: (config: ClosedDaysConfig) => void
) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [dbStatus, setDbStatus] = useState<
    'connecting' | 'connected' | 'error'
  >('connecting');

  const [generalTimeSlots, setGeneralTimeSlots] = useState<string[]>([
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00'
  ]);
  const [specialTimeSlots, setSpecialTimeSlots] = useState<string[]>([
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00'
  ]);
  const [timeslotConfig, setTimeslotConfig] = useState<TimeslotConfig>({
    generalStart: '09:00',
    generalEnd: '15:00',
    generalInterval: 30,
    specialStart: '09:00',
    specialEnd: '15:00',
    specialInterval: 30
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [sealConfig, setSealConfig] = useState<SealConfig>({
    activeSeal: 'full-yang'
  });
  const [identityPricings, setIdentityPricings] = useState<IdentityPricing[]>(
    []
  );
  const [closedDaysConfig, setClosedDaysConfigLocal] = useState<ClosedDaysConfig>(
    {
      mode: 'custom',
      excludeWeekends: false,
      excludeHolidays: true,
      manualClosedDates: [],
      holidayDates: [
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
      ]
    }
  );
  const [isEntryAnimating, setIsEntryAnimating] = useState(true);
  const [shouldRenderEntry, setShouldRenderEntry] = useState(true);

  // 新增：偵測 certId 領取證書
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const certId = urlParams.get('certId');
    const playerIndex = urlParams.get('playerIndex');

    if (
      certId &&
      !formData.name &&
      setFormData &&
      setSubmitted &&
      setLastSubmissionId &&
      setCalculatedTotal
    ) {
      const fetchCertData = async () => {
        try {
          const docRef = doc(db, 'registrations', certId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();

            let displayName = data.name || '';
            if (
              playerIndex !== null &&
              data.playerList &&
              data.playerList[Number(playerIndex)]
            ) {
              displayName = data.playerList[Number(playerIndex)].name;
            }

            setFormData({
              email: data.email || '',
              name: displayName,
              countryCode: data.countryCode || '+886',
              phone: data.phone || '',
              contactEmail: data.email || '',
              session: data.session || '',
              quantity: String(data.quantity || '1'),
              players: String(data.players || '1'),
              playerList: data.playerList || [
                { name: data.name || '', email: data.email || '' }
              ],
              totalAmount: String(data.totalAmount || '0'),
              paymentMethod: data.paymentMethod || '',
              bankLast5: data.bankLast5 || '',
              pickupTime: data.pickupTime || '',
              pickupLocation: data.pickupLocation || '',
              referral: data.referral || [],
              notes: data.notes || '',
              hp_field: '',
              identityType: data.identityType || '一般民眾'
            });

            setCalculatedTotal(data.totalAmount || 0);
            setLastSubmissionId(certId);
            setSubmitted(true);
          }
        } catch (err) {
          console.error('Fetch Cert Error:', err);
        }
      };
      fetchCertData();
    }
  }, [
    setFormData,
    setSubmitted,
    setLastSubmissionId,
    setCalculatedTotal,
    formData.name
  ]);

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

      const qGeneral = query(collection(db, 'sessions'), orderBy('name'));
      const qSpecial = query(
        collection(db, 'special_sessions'),
        orderBy('name')
      );

      let generalSessions: Session[] = [];
      let specialSessions: Session[] = [];

      const updateAllSessions = () => {
        const merged = [...generalSessions, ...specialSessions].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setSessions(merged);
        localStorage.setItem('bagua_maze_sessions', JSON.stringify(merged));
      };

      const unsubGeneral = onSnapshot(
        qGeneral,
        (snapshot) => {
          generalSessions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isSpecial: false
          })) as Session[];
          updateAllSessions();
          setDbStatus('connected');
        },
        (err) => {
          console.error('❌ 一般場次連線錯誤:', err);
          setDbStatus('error');
        }
      );

      const unsubSpecial = onSnapshot(
        qSpecial,
        (snapshot) => {
          specialSessions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isSpecial: true
          })) as Session[];
          updateAllSessions();
        },
        (err) => {
          console.error('❌ 特別場次連線錯誤:', err);
        }
      );

      return () => {
        unsubGeneral();
        unsubSpecial();
      };
    };

    const fetchTimeSlots = () => {
      const unsubGeneral = onSnapshot(
        doc(db, 'config', 'general_timeslots'),
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            if (data.slots) setGeneralTimeSlots(data.slots);
            if (data.config) {
              setTimeslotConfig((prev) => ({
                ...prev,
                generalStart: data.config.start,
                generalEnd: data.config.end,
                generalInterval: data.config.interval
              }));
            }
          }
        }
      );

      const unsubSpecial = onSnapshot(
        doc(db, 'config', 'special_timeslots'),
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            if (data.slots) setSpecialTimeSlots(data.slots);
            if (data.config) {
              setTimeslotConfig((prev) => ({
                ...prev,
                specialStart: data.config.start,
                specialEnd: data.config.end,
                specialInterval: data.config.interval
              }));
            }
          }
        }
      );

      return () => {
        unsubGeneral();
        unsubSpecial();
      };
    };

    const fetchPaymentMethods = () => {
      const unsubscribe = onSnapshot(
        doc(db, 'config', 'payments'),
        (docSnap) => {
          if (docSnap.exists()) {
            const methods = docSnap.data().methods || [];
            setPaymentMethods(methods);

            setFormData((prev) => {
              if (
                methods.length > 0 &&
                !methods.find((m: any) => m.name === prev.paymentMethod)
              ) {
                return { ...prev, paymentMethod: methods[0].name };
              }
              return prev;
            });
          }
        }
      );
      return unsubscribe;
    };

    const fetchSealConfig = () => {
      const unsubscribe = onSnapshot(
        doc(db, 'config', 'seal_config'),
        (docSnap) => {
          if (docSnap.exists()) {
            setSealConfig(docSnap.data() as SealConfig);
          } else {
            setSealConfig({ activeSeal: 'full-yang' });
          }
        }
      );
      return unsubscribe;
    };

    const fetchIdentityPricings = () => {
      const q = query(collection(db, 'identity_pricings'), orderBy('name'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as IdentityPricing
        );
        setIdentityPricings(data);
      });
      return unsubscribe;
    };

    const fetchClosedDaysConfig = () => {
      const unsubscribe = onSnapshot(
        doc(db, 'config', 'closed_days'),
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as ClosedDaysConfig;
            setClosedDaysConfigLocal(data);
            if (setClosedDaysConfig) setClosedDaysConfig(data);
          }
        }
      );
      return unsubscribe;
    };

    const unsubSessions = fetchSessions();
    const unsubSlots = fetchTimeSlots();
    const unsubPayments = fetchPaymentMethods();
    const unsubSeal = fetchSealConfig();
    const unsubIdentity = fetchIdentityPricings();
    const unsubClosedDays = fetchClosedDaysConfig();
    triggerExitAnimation();

    return () => {
      unsubSessions();
      unsubSlots();
      unsubPayments();
      unsubSeal();
      unsubIdentity();
      unsubClosedDays();
    };
  }, [setFormData, setClosedDaysConfig]);

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
    sealConfig,
    setSealConfig,
    identityPricings,
    setIdentityPricings,
    closedDaysConfig,
    setClosedDaysConfig: setClosedDaysConfigLocal,
    isEntryAnimating,
    shouldRenderEntry
  };
};
