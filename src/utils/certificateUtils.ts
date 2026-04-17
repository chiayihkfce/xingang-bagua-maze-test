/**
 * 繪製數位成就證書 (大師級 4K 藝術版)
 */
export const generateCertificate = async (data: {
  name: string;
  session: string;
  date: string;
  lang: string;
  t: any;
}) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. 解析度大幅提升 (4K 級別確保列印品質)
  const w = 2400, h = 1696;
  canvas.width = w;
  canvas.height = h;

  // 2. 背景：深邃墨色 + 微金箔紋理
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#1a1a1a');
  grad.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 模擬金箔紙質感 (隨機極細點)
  ctx.fillStyle = 'rgba(212, 175, 55, 0.03)';
  for (let i = 0; i < 3000; i++) {
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }

  // 3. 完整太極八卦水印 (比例微調)
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)'; ctx.lineWidth = 4;
  const r = 250;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -r/2, r/2, Math.PI * 1.5, Math.PI * 0.5); ctx.arc(0, r/2, r/2, Math.PI * 1.5, Math.PI * 0.5, true); ctx.stroke();
  const trigrams = [ [1,1,1], [0,1,1], [1,0,1], [0,0,1], [1,1,0], [0,1,0], [1,0,0], [0,0,0] ];
  trigrams.forEach((lines, i) => {
    ctx.save(); ctx.rotate(i * Math.PI / 4);
    lines.forEach((isSolid, j) => {
      const y = 350 + (j * 35);
      if (isSolid) ctx.strokeRect(-80, y, 160, 15);
      else { ctx.strokeRect(-80, y, 70, 15); ctx.strokeRect(10, y, 70, 15); }
    });
    ctx.restore();
  });
  ctx.restore();

  // 4. 高級雲紋邊框
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 20; ctx.strokeRect(60, 60, w-120, h-120);
  ctx.lineWidth = 4; ctx.strokeRect(100, 100, w-200, h-200);
  
  const drawCloud = (x: number, y: number, r1: number) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(r1); ctx.beginPath();
    ctx.arc(0, 0, 80, 0, Math.PI * 1.2); ctx.stroke(); ctx.restore();
  };
  [[60,60,0], [w-60,60,Math.PI/2], [60,h-60,-Math.PI/2], [w-60,h-60,Math.PI]].forEach(([x,y,r]) => drawCloud(x,y,r));

  // 5. 文字樣式與配置
  const centerX = w / 2;
  const fontAntique = '"STXingkai", "華文行楷", "LiSu", "隸書", "STKaiti", serif';
  const fontEng = '"Montserrat", "Arial", sans-serif';

  const drawMasterText = (text: string, x: number, y: number, font: string, color: string, shadow: number = 0) => {
    ctx.save(); ctx.font = font; ctx.fillStyle = color; ctx.textAlign = 'center';
    if (shadow > 0) { ctx.shadowBlur = shadow; ctx.shadowColor = color; }
    ctx.fillText(text, x, y); ctx.restore();
  };

  // 標題與英文名 (燙金感)
  drawMasterText('數位成就證書', centerX, 350, `bold 180px ${fontAntique}`, '#d4af37', 20);
  drawMasterText('XINGANG BAGUA MYSTERY ACHIEVEMENT', centerX, 440, `36px ${fontEng}`, 'rgba(212, 175, 55, 0.6)');

  // 頒發給
  drawMasterText('頒發給', centerX, 650, `60px ${fontAntique}`, '#ffffff');

  // 姓名 (核心視覺 - 氣勢磅礴)
  ctx.save();
  ctx.font = `bold 280px ${fontAntique}`;
  ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
  ctx.shadowBlur = 30; ctx.shadowColor = 'rgba(255,255,255,0.3)';
  ctx.fillText(data.name || '挑戰者', centerX, 950);
  ctx.restore();
  
  // 裝飾底線
  ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 5; ctx.beginPath();
  ctx.moveTo(centerX - 350, 1000); ctx.lineTo(centerX + 350, 1000); ctx.stroke();

  // 祝賀詞 (精確對位)
  const t1 = '恭喜完成', t2 = '【新港八卦謎蹤】', t3 = '挑戰！';
  ctx.font = `70px ${fontAntique}`;
  const w1 = ctx.measureText(t1).width, w3 = ctx.measureText(t3).width;
  ctx.font = `bold 85px ${fontAntique}`;
  const w2 = ctx.measureText(t2).width;
  const startX = centerX - (w1 + w2 + w3 + 40) / 2;

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = `70px ${fontAntique}`; ctx.fillText(t1, startX, 1200);
  ctx.fillStyle = '#d4af37'; ctx.font = `bold 85px ${fontAntique}`; ctx.fillText(t2, startX + w1 + 20, 1200);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; ctx.font = `70px ${fontAntique}`; ctx.fillText(t3, startX + w1 + w2 + 40, 1200);

  // 底部資訊
  const sName = data.session ? data.session.split('(')[0].trim() : '一般場次';
  drawMasterText(`活動場次：${sName}`, centerX, 1350, `45px ${fontEng}`, 'rgba(255, 255, 255, 0.4)');
  drawMasterText(`${data.date} | 新港文教基金會`, centerX, 1450, `55px ${fontAntique}`, 'rgba(255, 255, 255, 0.7)');

  // 6. 紅印章 (精緻化)
  ctx.save(); ctx.translate(w - 400, h - 350); ctx.rotate(-0.05);
  ctx.strokeStyle = 'rgba(192, 57, 43, 0.9)'; ctx.lineWidth = 10; ctx.strokeRect(0, 0, 180, 180);
  ctx.fillStyle = 'rgba(192, 57, 43, 0.9)'; ctx.font = `bold 42px "Microsoft JhengHei"`;
  ctx.textAlign = 'center'; ctx.fillText('新港文教', 90, 75); ctx.fillText('基金會印', 90, 135);
  ctx.restore();

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
