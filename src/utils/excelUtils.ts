import * as XLSX from 'xlsx';

/**
 * 將報名資料匯出為 Excel 檔案
 */
export const exportToExcel = (data: any[][], fileNamePrefix: string = '報名清單') => {
  if (data.length === 0) return;

  // 過濾掉每一列最後一個欄位 (通常是 Firebase ID)
  const exportData = data.map(row => row.slice(0, 15));

  const ws = XLSX.utils.aoa_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "報名清單");
  
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `${fileNamePrefix}_${dateStr}.xlsx`;
  
  XLSX.writeFile(wb, fileName);
};
