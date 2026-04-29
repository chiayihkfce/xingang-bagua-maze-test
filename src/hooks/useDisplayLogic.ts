import { Session } from '../types';
import {
  getSessionDisplayName as getSessionDisplayNameUtil,
  getPickupLocationDisplay as getPickupLocationDisplayUtil,
  getPaymentMethodDisplay as getPaymentMethodDisplayUtil
} from '../utils/displayUtils';

interface UseDisplayLogicProps {
  lang: string;
  sessions: Session[];
  t: any;
}

/**
 * 封裝常用的 UI 顯示映射邏輯，簡化組件內部的呼叫
 */
export const useDisplayLogic = ({
  lang,
  sessions,
  t
}: UseDisplayLogicProps) => {
  const getSessionDisplayName = (chineseName: string) =>
    getSessionDisplayNameUtil(chineseName, lang, sessions);

  const getPickupLocationDisplay = (location: string) =>
    getPickupLocationDisplayUtil(location, lang, t);

  const getPaymentMethodDisplay = (method: string) =>
    getPaymentMethodDisplayUtil(method, lang, t);

  return {
    getSessionDisplayName,
    getPickupLocationDisplay,
    getPaymentMethodDisplay
  };
};
