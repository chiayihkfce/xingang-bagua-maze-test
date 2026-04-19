/**
 * 繪製數位成就證書 (大師級 4K 藝術版)
 */
export const generateCertificate = async (data: {
  name: string;
  session: string;
  date: string;
  lang: string;
  t: any;
  theme?: 'dark' | 'light';
}) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const w = 2000, h = 1414;
  canvas.width = w;
  canvas.height = h;

  const isDark = data.theme === 'dark';

  // 2. 背景構建
  if (isDark) {
    const bgGrad = ctx.createRadialGradient(w/2, h/2, 200, w/2, h/2, w);
    bgGrad.addColorStop(0, '#1c1c1c');
    bgGrad.addColorStop(1, '#050505');
    ctx.fillStyle = bgGrad;
  } else {
    const bgGrad = ctx.createRadialGradient(w/2, h/2, 200, w/2, h/2, w);
    bgGrad.addColorStop(0, '#f9f7f0');
    bgGrad.addColorStop(1, '#eeeae0');
    ctx.fillStyle = bgGrad;
  }
  ctx.fillRect(0, 0, w, h);

  // 宣紙/絲絹紋理 (質感微調版：8,000 條纖維，增加透氣感)
  ctx.save();
  const fColors = isDark ? ['#d4af37', '#444444', '#ffffff', '#222222'] : ['#d4af37', '#999999', '#ffffff', '#c0c0c0', '#f1c40f'];
  const fibersPerColor = 1600; // 總計約 8000 條
  
  fColors.forEach(color => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.globalAlpha = isDark ? 0.06 : 0.12;
    ctx.lineWidth = 0.35;
    for (let i = 0; i < fibersPerColor; i++) {
      const x = Math.random() * w, y = Math.random() * h, len = Math.random() * 30 + 5, angle = Math.random() * Math.PI * 2;
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + Math.random() * 10 - 5, y + Math.random() * 10 - 5, x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    }
    ctx.stroke();
  });
  ctx.restore();


  // 3. 太極八卦水印
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.strokeStyle = isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(184, 134, 11, 0.12)';
  
  [650, 700, 750].forEach(radius => {
    ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.stroke();
  });

  const r = 320;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // 繪製整合路徑
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.moveTo(0, -r);
  ctx.arc(0, -r/2, r/2, Math.PI * 1.5, Math.PI * 0.5);
  ctx.arc(0, r/2, r/2, Math.PI * 1.5, Math.PI * 0.5, true);
  
  ctx.lineWidth = 12;
  ctx.stroke();

  // 繪製魚眼
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath(); ctx.arc(0, -r/2, 40, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, r/2, 40, 0, Math.PI * 2); ctx.fill();

  const trigrams = [ [1,1,1], [0,1,1], [1,0,1], [0,0,1], [1,1,0], [0,1,0], [1,0,0], [0,0,0] ];
  trigrams.forEach((lines, i) => {
    ctx.save(); ctx.rotate(i * Math.PI / 4);
    lines.forEach((isSolid, j) => {
      const y = 450 + (j * 50); ctx.lineWidth = 22;
      if (isSolid) { ctx.beginPath(); ctx.moveTo(-125, y); ctx.lineTo(125, y); ctx.stroke(); } 
      else { ctx.beginPath(); ctx.moveTo(-125, y); ctx.lineTo(-20, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(125, y); ctx.stroke(); }
    });
    ctx.restore();
  });
  ctx.restore();

  // 4. 邊框
  ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 20; ctx.strokeRect(60, 60, w-120, h-120);
  ctx.lineWidth = 4; ctx.strokeRect(100, 100, w-200, h-200);

  // 5. 文字系統
  const centerX = w / 2;
  const fontAntique = '"STXingkai", "華文行楷", "LiSu", "隸書", "STKaiti", serif';
  const fontStandard = '"Noto Serif CJK TC", serif';

  const drawGoldenText = (text: string, x: number, y: number, font: string, size: number, isBold: boolean = false) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `${isBold ? 'bold ' : ''}${size}px ${font}`;
    
    // 製作立體鎏金陰影 (多層次深度感)
    ctx.shadowColor = 'rgba(0, 0, 0, 1)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;

    // 極致複雜金屬漸層 (深古銅 -> 亮金 -> 耀眼白金 -> 暗金)
    const textGrad = ctx.createLinearGradient(x, y - size, x, y + size/4);
    textGrad.addColorStop(0, '#4a3b12');   // 深古銅
    textGrad.addColorStop(0.2, '#856d28'); // 飽和金
    textGrad.addColorStop(0.4, '#f1c40f'); // 亮黃金
    textGrad.addColorStop(0.5, '#ffffff'); // 高光白金
    textGrad.addColorStop(0.6, '#f1c40f'); // 亮黃金
    textGrad.addColorStop(0.8, '#d4af37'); // 典雅金
    textGrad.addColorStop(1, '#5d4a1b');   // 暗金
    
    ctx.fillStyle = textGrad;
    ctx.fillText(text, x, y);
    
    // 加入物理雕刻感的內陰影模擬
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillText(text, x - 3, y - 3);
    
    // 加入高品質外發光 (模擬金屬光澤散射)
    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
    ctx.shadowBlur = 35;
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  // 主標題 (數位成就證書)
  drawGoldenText('數位成就證書', centerX, 320, fontAntique, 160, true);
  
  // 英文副標 (更新名稱：The Bagua Mystery of xingang)
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = isDark ? 'rgba(212, 175, 55, 0.8)' : 'rgba(184, 134, 11, 0.8)';
  ctx.font = `italic 32px serif`; // 稍微調大一點
  ctx.textAlign = 'center';
  ctx.letterSpacing = '10px';
  ctx.fillText('The Bagua Mystery of xingang', centerX, 390);
  ctx.restore();

  // 頒發給 (使用標準宋體)
  ctx.fillStyle = isDark ? 'rgba(212, 175, 55, 0.8)' : 'rgba(133, 109, 40, 0.8)';
  ctx.font = `50px ${fontStandard}`;
  ctx.textAlign = 'center';
  ctx.fillText('頒 發 給', centerX, 550);

  // C. 受獎人姓名 (修復重疊黃線：先描邊後填色)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `bold 200px ${fontAntique}`;
  
  // 1. 製作多層次匾額陰影
  ctx.shadowColor = 'rgba(0, 0, 0, 1)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 10;
  ctx.shadowOffsetY = 10;
  
  // 2. 先進行金屬描邊 (此時重疊處會有深色，但會被下一步蓋住)
  ctx.strokeStyle = isDark ? 'rgba(212, 175, 55, 0.5)' : 'rgba(184, 134, 11, 0.3)';
  ctx.lineWidth = 3;
  ctx.strokeText(data.name || '挑戰者', centerX, 750);

  // 3. 最後填入實心文字 (壓在描邊上方，完美覆蓋重疊處)
  ctx.shadowColor = 'transparent'; // 填色時不再重複陰影
  ctx.fillStyle = isDark ? '#ffffff' : '#222222';
  ctx.fillText(data.name || '挑戰者', centerX, 750);
  ctx.restore();

  // D. 恭賀說明文字 (對稱排版優化)
  const challengeTitle = '【新港八卦謎蹤】';
  ctx.font = `65px ${fontStandard}`;
  const w1 = ctx.measureText('恭喜完成 ').width, w3 = ctx.measureText(' 挑戰！').width;
  ctx.font = `bold 75px ${fontStandard}`;
  const w2 = ctx.measureText(challengeTitle).width;
  
  const gap = 25; // 設定對稱間距
  const startT = centerX - (w1 + w2 + w3 + (gap * 2)) / 2;

  ctx.textAlign = 'left';
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(34, 34, 34, 0.8)';
  ctx.font = `65px ${fontStandard}`;
  ctx.fillText('恭喜完成 ', startT, 980);
  
  ctx.fillStyle = isDark ? '#d4af37' : '#856d28';
  ctx.font = `bold 75px ${fontStandard}`;
  ctx.fillText(challengeTitle, startT + w1 + gap, 980); // 加入前半間距
  
  ctx.font = `65px ${fontStandard}`;
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(34, 34, 34, 0.8)';
  ctx.fillText(' 挑戰！', startT + w1 + w2 + (gap * 2), 980); // 加入後半間距

  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? 'rgba(212, 175, 55, 0.4)' : 'rgba(0,0,0,0.4)';
  ctx.font = `38px ${fontStandard}`; ctx.fillText(`活動場次：${data.session ? data.session.split('(')[0].trim() : '一般場次'}`, centerX, 1150);
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  ctx.font = `50px ${fontAntique}`; ctx.fillText(`${data.date} ｜ 新港文教基金會`, centerX, 1250);

  // 7. 朱紅官印 (群組邊界 & 跨裝置自適應版)
  const drawSeal = (x: number, y: number) => {
    const s = 280, r = 40;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    const sealCanvas = document.createElement('canvas');
    sealCanvas.width = s + 40; sealCanvas.height = s + 40;
    const sCtx = sealCanvas.getContext('2d');
    if (!sCtx) return;

    const jitter = (range = 2.5) => (Math.random() - 0.5) * range;
    const sealColor = 'rgba(160, 40, 30, 0.95)';

    // A. 繪製邊框
    sCtx.translate(20, 20);
    sCtx.strokeStyle = sealColor;
    sCtx.lineWidth = 14; sCtx.lineJoin = 'round';
    sCtx.beginPath();
    sCtx.moveTo(r + jitter(), jitter());
    sCtx.lineTo(s - r + jitter(), jitter());
    sCtx.quadraticCurveTo(s + jitter(), jitter(), s + jitter(), r + jitter());
    sCtx.lineTo(s + jitter(), s - r + jitter());
    sCtx.quadraticCurveTo(s + jitter(), s + jitter(), s - r + jitter(), s + jitter());
    sCtx.lineTo(r + jitter(), s + jitter());
    sCtx.quadraticCurveTo(jitter(), s + jitter(), jitter(), s - r + jitter());
    sCtx.lineTo(jitter(), r + jitter());
    sCtx.quadraticCurveTo(jitter(), jitter(), r + jitter(), jitter());
    sCtx.stroke();
// B. 繪製印文 (群組邊界控制 & 自適應比例)
sCtx.save();
// --- 實作「物理裁切」：放寬邊界解決截斷 ---
sCtx.beginPath();
sCtx.rect(5, 5, s - 10, s - 10); 
sCtx.clip();

sCtx.translate(s/2, s/2);

// 1. 漢文區 (固定黃金比例)
sCtx.save();
sCtx.fillStyle = sealColor;
sCtx.textAlign = 'center'; sCtx.textBaseline = 'middle';
// 比例回歸：寬度 1.35，高度 1.65
sCtx.scale(1.35, 1.65); 
sCtx.font = 'bold 44px "LiSu", "STKaiti", "Microsoft JhengHei"';
const yO = 38; const rx1 = 68, rx2 = 22; 

    sCtx.fillText('新', rx1, -yO * 1.5); sCtx.fillText('港', rx1, -yO * 0.5);
    sCtx.fillText('文', rx1,  yO * 0.5); sCtx.fillText('教', rx1,  yO * 1.5);
    sCtx.fillText('基', rx2, -yO * 1.5); sCtx.fillText('金', rx2, -yO * 0.5);
    sCtx.fillText('會', rx2,  yO * 0.5); sCtx.fillText('印', rx2,  yO * 1.5);
    sCtx.restore();

    // 2. 滿文區 (僅對滿文實作手機端高度縮減)
    sCtx.save();
    sCtx.fillStyle = sealColor;
    sCtx.textAlign = 'center'; sCtx.textBaseline = 'middle';
    const mL1 = "ᠰᡳᠨ ᡤᠠᠩ ᠸᡝᠨ ᠵᡳᠶᠣᠣ"; const mL2 = "ᠵᡳ ᠵᡳᠨ ᡥᡡᡳ ᡩᠣᡵᠣᠨ"; 
    const drawSManchu = (txt: string, ox: number) => {
      sCtx.save();
      sCtx.translate(ox, 0); sCtx.rotate(Math.PI / 2);
      // 滿文專屬：手機端高度降至 1.1x 確保不截斷，寬度維持 2.15x
      const mH = isMobile ? 1.1 : 1.65;
      sCtx.scale(mH, 2.15); 
      sCtx.font = 'bold 34px "Mongolian Baiti", "Noto Sans Mongolian", serif';
      sCtx.fillText(txt, 0, 0);
      sCtx.restore();
    };
    // 修正讀序與座標：左側邊界縮至 -98 防止壓到左邊圓角
    drawSManchu(mL1, -98); drawSManchu(mL2, -42); 
    sCtx.restore();

    sCtx.restore(); // 結束裁切區域

    // C. 關鍵「物理挖空」：在離屏畫布上製造透明孔洞
    sCtx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 550; i++) {
      const px = Math.random() * (s + 20) - 10;
      const py = Math.random() * (s + 20) - 10;
      const size = Math.random() * 2.8 + 0.6;
      sCtx.beginPath();
      sCtx.arc(px, py, size, 0, Math.PI * 2);
      sCtx.fill();
    }

    // D. 將「帶孔印章」合成回主畫布
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.015);
    ctx.globalCompositeOperation = 'multiply'; // 與底色纖維完美融合
    ctx.drawImage(sealCanvas, -20, -20);
    ctx.restore();
  };
  drawSeal(w - 500, h - 500);

  return canvas.toDataURL('image/png');
};

/**
 * 下載證書
 */
export const downloadCertificate = (dataUrl: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
