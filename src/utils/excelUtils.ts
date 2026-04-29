import * as XLSX from 'xlsx';

/**
 * 將報名資料匯出為 Excel 檔案
 */
export const exportToExcel = (
  data: any[][],
  fileNamePrefix: string = '報名清單'
) => {
  if (data.length <= 1) return;

  // 1. 分離標題列與資料列
  const header = data[0];
  const rows = data.slice(1);

  // 2. 反轉資料列順序 (讓原本最上面/最新的資料移到最下面)
  const reversedRows = [...rows].reverse();

  // 3. 重新組合並過濾掉隱藏欄位 (Firebase ID 等)
  const exportData = [header, ...reversedRows].map((row) => row.slice(0, 16));

  const ws = XLSX.utils.aoa_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '報名清單');

  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `${fileNamePrefix}_${dateStr}.xlsx`;

  XLSX.writeFile(wb, fileName);
};

/**
 * 讀取並解析 Excel 檔案為 JSON 陣列
 */
export const readExcelFile = (file: File): Promise<any[][]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
};
