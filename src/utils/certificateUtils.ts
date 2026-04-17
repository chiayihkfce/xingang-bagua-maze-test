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

  // 1. 設定極致解析度 (維持 16:9 比例)
  const w = 3200, h = 1800;
  canvas.width = w;
  canvas.height = h;

  // 2. 背景構建：暖黑底色 + 宣紙紋理 + 中心光暈
  const bgGrad = ctx.createRadialGradient(w/2, h/2, 100, w/2, h/2, w/1.2);
  bgGrad.addColorStop(0, '#1c1c1c');
  bgGrad.addColorStop(1, '#050505');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 宣紙/絲絹紋理 (程式碼逐一繪製細微纖維)
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = '#d4af37';
  for (let i = 0; i < 4000; i++) {
    ctx.beginPath();
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.random() * 15, y + Math.random() * 5);
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  ctx.restore();

  // 3. 完整太極八卦水印 (亮度提升)
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)'; ctx.lineWidth = 4; // 亮度調高
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

  // 4. 高級雲紋邊框 (修正凸出問題)
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 20; ctx.strokeRect(60, 60, w-120, h-120);
  ctx.lineWidth = 4; ctx.strokeRect(100, 100, w-200, h-200);
  
  const drawCloud = (x: number, y: number, r1: number) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(r1); ctx.beginPath();
    ctx.arc(40, 40, 60, Math.PI, Math.PI * 1.5); // 調整圓弧半徑與位置，使其貼合內部
    ctx.stroke(); ctx.restore();
  };
  [[100,100,0], [w-100,100,Math.PI/2], [100,h-100,-Math.PI/2], [w-100,h-100,Math.PI]].forEach(([x,y,r]) => drawCloud(x,y,r));

  // 5. 文字樣式與配置
  const centerX = w / 2;
  const fontAntique = '"STXingkai", "華文行楷", "LiSu", "隸書", "STKaiti", serif';
  const fontStandard = '"Noto Serif CJK TC", "Songti TC", serif';
  const fontEng = '"Montserrat", "Arial", sans-serif';

  const drawGoldenText = (text: string, x: number, y: number, font: string, size: number, isBold: boolean = false) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `${isBold ? 'bold ' : ''}${size}px ${font}`;
    
    // 製作立體鎏金陰影
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;

    const textGrad = ctx.createLinearGradient(x, y - size, x, y + size/3);
    textGrad.addColorStop(0, '#856d28');
    textGrad.addColorStop(0.5, '#f1c40f');
    textGrad.addColorStop(1, '#d4af37');
    
    ctx.fillStyle = textGrad;
    ctx.fillText(text, x, y);
    
    // 加入微弱外發光
    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
    ctx.shadowBlur = 20;
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  // 主標題 (數位成就證書)
  drawGoldenText('數位成就證書', centerX, 320, fontAntique, 160, true);
  
  // 英文副標 (弱化)
  ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.font = `32px ${fontEng}`;
  ctx.textAlign = 'center';
  ctx.fillText('XINGANG BAGUA MYSTERY ACHIEVEMENT', centerX, 380);

  // 頒發給 (使用標準宋體)
  ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
  ctx.font = `50px ${fontStandard}`;
  ctx.textAlign = 'center';
  ctx.fillText('頒 發 給', centerX, 550);

  // 姓名 (核心視覺 - 氣勢大字)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `bold 260px ${fontAntique}`;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';
  ctx.shadowBlur = 40;
  ctx.fillText(data.name || '挑戰者', centerX, 850);
  ctx.restore();
  
  // 名字下方的承托金線
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(centerX - 400, 890);
  ctx.lineTo(centerX + 400, 890);
  ctx.stroke();

  // 祝賀詞 (精確對位與強調)
  const challengeTitle = '【新港八卦謎蹤】';
  ctx.font = `70px ${fontStandard}`;
  const wPrefix = ctx.measureText('恭喜完成 ').width;
  ctx.font = `bold 75px ${fontStandard}`;
  const wTitle = ctx.measureText(challengeTitle).width;
  ctx.font = `70px ${fontStandard}`;
  const wSuffix = ctx.measureText(' 挑戰！').width;
  
  const startT = centerX - (wPrefix + wTitle + wSuffix) / 2;

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = `70px ${fontStandard}`;
  ctx.fillText('恭喜完成 ', startT, 1080);
  
  ctx.fillStyle = '#f1c40f'; // 挑戰名稱加亮
  ctx.font = `bold 75px ${fontStandard}`;
  ctx.fillText(challengeTitle, startT + wPrefix, 1080);
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = `70px ${fontStandard}`;
  ctx.fillText(' 挑戰！', startT + wPrefix + wTitle, 1080);

  // E. 底部資訊
  ctx.textAlign = 'center';
  const sessionLabel = `活動場次：${data.session ? data.session.split('(')[0].trim() : '一般場次'}`;
  ctx.font = `40px ${fontStandard}`;
  ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.fillText(sessionLabel, centerX, 1280, w - 400);
  
  ctx.font = `50px ${fontAntique}`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText(`${data.date} ｜ 新港文教基金會`, centerX, 1380);

  // 7. 朱紅方形印章 (藝術化處理：墨色不均、疊印感)
  const drawSeal = (x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.04);
    
    // 印章背景 (不規則邊緣)
    const sealSize = 220;
    ctx.fillStyle = 'rgba(192, 57, 43, 0.85)';
    ctx.globalCompositeOperation = 'multiply'; 
    ctx.beginPath();
    ctx.moveTo(3, 3); ctx.lineTo(sealSize-5, 2); ctx.lineTo(sealSize+2, sealSize-4); ctx.lineTo(1, sealSize+3); ctx.closePath();
    ctx.fill();
    
    // 印章邊框
    ctx.strokeStyle = 'rgba(192, 57, 43, 0.9)';
    ctx.lineWidth = 14;
    ctx.strokeRect(12, 12, sealSize-24, sealSize-24);

    // 印章文字
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 48px "Microsoft JhengHei"';
    ctx.textAlign = 'center';
    ctx.fillText('新港文教', sealSize/2, sealSize/3 + 10);
    ctx.fillText('基金會印', sealSize/2, (sealSize/3)*2 + 15);
    ctx.restore();
  };
  drawSeal(w - 480, h - 450);

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
