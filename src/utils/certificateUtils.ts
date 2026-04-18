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

  // 宣紙/絲絹紋理 (極致纖維感：支援雙色適配)
  ctx.save();
  const fiberColors = isDark ? ['#d4af37', '#444444', '#ffffff', '#222222'] : ['#d4af37', '#999999', '#ffffff', '#c0c0c0', '#f1c40f'];
  for (let i = 0; i < 25000; i++) {
    ctx.globalAlpha = isDark ? Math.random() * 0.08 : Math.random() * 0.15;
    ctx.strokeStyle = fiberColors[Math.floor(Math.random() * fiberColors.length)];
    ctx.lineWidth = Math.random() * 0.5;
    
    ctx.beginPath();
    const x = Math.random() * w, y = Math.random() * h, len = Math.random() * 30 + 5, angle = Math.random() * Math.PI * 2;
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.random() * 10 - 5, y + Math.random() * 10 - 5, x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }
  ctx.restore();

  // 3. 太極八卦水印
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.strokeStyle = isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(184, 134, 11, 0.12)';
  
  [650, 700, 750].forEach(radius => {
    ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.stroke();
  });

  const r = 320;
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(0, -r/2, r/2, Math.PI * 1.5, Math.PI * 0.5); ctx.arc(0, r/2, r/2, Math.PI * 1.5, Math.PI * 0.5, true); ctx.stroke();
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath(); ctx.arc(0, -r/2, 40, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, r/2, 40, 0, Math.PI * 2); ctx.fill();
  ctx.lineWidth = 12;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();

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
  
  // 英文副標 (極致弱化：極淡、斜體、拉大字距)
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = isDark ? 'rgba(212, 175, 55, 0.4)' : 'rgba(184, 134, 11, 0.4)';
  ctx.font = `italic 28px serif`;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '12px';
  ctx.fillText('XINGANG BAGUA MYSTERY ACHIEVEMENT', centerX, 390);
  ctx.restore();

  // 頒發給 (使用標準宋體)
  ctx.fillStyle = isDark ? 'rgba(212, 175, 55, 0.8)' : 'rgba(133, 109, 40, 0.8)';
  ctx.font = `50px ${fontStandard}`;
  ctx.textAlign = 'center';
  ctx.fillText('頒 發 給', centerX, 550);

  // C. 受獎人姓名 (核心視覺 - 氣勢匾額大字)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `bold 200px ${fontAntique}`;
  
  // 製作多層次匾額雕刻感 (深色投影 -> 實體文字 -> 淡金描邊)
  ctx.shadowColor = 'rgba(0, 0, 0, 1)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 10;
  ctx.shadowOffsetY = 10;
  
  ctx.fillStyle = isDark ? '#ffffff' : '#222222';
  ctx.fillText(data.name || '挑戰者', centerX, 750);
  
  // 加上一層超薄的淡金描邊提升質感
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = isDark ? 'rgba(212, 175, 55, 0.4)' : 'rgba(184, 134, 11, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeText(data.name || '挑戰者', centerX, 750);
  ctx.restore();

  // D. 恭賀說明文字 (修正重疊，增加 20px 間距)
  const challengeTitle = '【新港八卦謎蹤】';
  ctx.font = `65px ${fontStandard}`;
  const w1 = ctx.measureText('恭喜完成 ').width, w2 = ctx.measureText(challengeTitle).width, w3 = ctx.measureText(' 挑戰！').width;
  
  // 增加 20px 的額外緩衝間距避免重疊
  const startT = centerX - (w1 + w2 + w3 + 60) / 2;

  ctx.textAlign = 'left';
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(34, 34, 34, 0.8)';
  ctx.font = `65px ${fontStandard}`;
  ctx.fillText('恭喜完成 ', startT, 980);
  
  ctx.fillStyle = isDark ? '#d4af37' : '#856d28';
  ctx.font = `bold 75px ${fontStandard}`;
  ctx.fillText(challengeTitle, startT + w1 + 20, 980); // 加入 20px 間距
  
  ctx.font = `65px ${fontStandard}`;
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(34, 34, 34, 0.8)';
  ctx.fillText(' 挑戰！', startT + w1 + w2 + 40, 980); // 再加入 20px 間距

  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? 'rgba(212, 175, 55, 0.4)' : 'rgba(0,0,0,0.4)';
  ctx.font = `38px ${fontStandard}`; ctx.fillText(`活動場次：${data.session ? data.session.split('(')[0].trim() : '一般場次'}`, centerX, 1150);
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  ctx.font = `50px ${fontAntique}`; ctx.fillText(`${data.date} ｜ 新港文教基金會`, centerX, 1250);

  // 7. 朱紅官印
  const drawSeal = (x: number, y: number) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.01);
    const s = 280, r = 40; ctx.globalAlpha = 0.7; ctx.globalCompositeOperation = 'multiply';
    ctx.strokeStyle = 'rgba(160, 40, 30, 1)'; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(r, 0); ctx.lineTo(s-r, 0); ctx.quadraticCurveTo(s,0,s,r); ctx.lineTo(s,s-r); ctx.quadraticCurveTo(s,s,s-r,s); ctx.lineTo(r,s); ctx.quadraticCurveTo(0,s,0,s-r); ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0); ctx.stroke();
    ctx.fillStyle = 'rgba(160, 40, 30, 1)'; ctx.font = 'bold 60px "Microsoft JhengHei"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('新港文教', s/2, s/2 - 45); ctx.fillText('基金會印', s/2, s/2 + 45);
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
