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

  // 1. 設定高品質解析度 (適度調降以確保瀏覽器效能)
  const w = 2000, h = 1414;
  canvas.width = w;
  canvas.height = h;

  // 2. 背景構建：淡雅米白宣紙色 + 纖維紋理
  const bgGrad = ctx.createRadialGradient(w/2, h/2, 200, w/2, h/2, w);
  bgGrad.addColorStop(0, '#f9f7f0');
  bgGrad.addColorStop(1, '#eeeae0');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 宣紙/絲絹紋理 (極致纖維感重構)
  ctx.save();
  const colors = ['#d4af37', '#999999', '#ffffff', '#c0c0c0'];
  for (let i = 0; i < 8000; i++) {
    ctx.globalAlpha = Math.random() * 0.12; // 隨機透明度
    ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.lineWidth = Math.random() * 0.6;
    
    ctx.beginPath();
    const x = Math.random() * w;
    const y = Math.random() * h;
    const len = Math.random() * 25 + 5;
    const angle = Math.random() * Math.PI * 2;
    
    // 使用二次貝茲曲線繪製帶有弧度的細碎纖維
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(
      x + Math.random() * 10 - 5, 
      y + Math.random() * 10 - 5,
      x + Math.cos(angle) * len, 
      y + Math.sin(angle) * len
    );
    ctx.stroke();
  }
  ctx.restore();

  // 3. 完整太極八卦水印 (白底適配：降低亮度)
  ctx.save();
  ctx.translate(w / 2, h / 2);
  const ritualGrad = ctx.createRadialGradient(0, 0, 100, 0, 0, 800);
  ritualGrad.addColorStop(0, 'rgba(184, 134, 11, 0.15)'); 
  ritualGrad.addColorStop(1, 'rgba(184, 134, 11, 0)');
  ctx.strokeStyle = ritualGrad;
  
  // 繪製外環同心圓 (法陣結構)
  [650, 700, 750].forEach((radius) => {
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.stroke();
  });

  // 太極圖 (修正順序：先畫內線與魚眼，最後畫圓圈壓陣)
  const r = 320;
  
  // A. 繪製 S 曲線
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(0, -r/2, r/2, Math.PI * 1.5, Math.PI * 0.5); ctx.arc(0, r/2, r/2, Math.PI * 1.5, Math.PI * 0.5, true); ctx.stroke();
  
  // B. 繪製魚眼
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath(); ctx.arc(0, -r/2, 40, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, r/2, 40, 0, Math.PI * 2); ctx.fill();

  // C. 最後畫最外圈 (壓在所有線條上方)
  ctx.lineWidth = 12;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();

  
  // 八卦爻位 (加粗清晰化並加入能量光暈)
  const trigrams = [ [1,1,1], [0,1,1], [1,0,1], [0,0,1], [1,1,0], [0,1,0], [1,0,0], [0,0,0] ];
  ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
  ctx.shadowBlur = 15;
  trigrams.forEach((lines, i) => {
    ctx.save();
    ctx.rotate(i * Math.PI / 4);
    lines.forEach((isSolid, j) => {
      const y = 450 + (j * 50);
      ctx.lineWidth = 22; // 顯著加粗
      if (isSolid) {
        ctx.beginPath(); ctx.moveTo(-125, y); ctx.lineTo(125, y); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.moveTo(-125, y); ctx.lineTo(-20, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(125, y); ctx.stroke();
      }
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
  const fontAntique = '"STXingkai", "華文行楷", "LiSu", "隸書", "STKaiti", "Songti TC", serif';
  const fontStandard = '"Noto Serif CJK TC", "Songti TC", serif';
  const fontEng = '"Times New Roman", serif'; // 弱化英文，使用傳統字體

  const drawGoldenText = (text: string, x: number, y: number, font: string, size: number, isBold: boolean = false) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `${isBold ? 'bold ' : ''}${size}px ${font}`;
    
    // 內斂鎏金陰影 (深色基底，減少對比)
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;

    // 優化金屬漸層 (暗金 -> 暖金 -> 穩重金)
    const textGrad = ctx.createLinearGradient(x, y - size, x, y + size/5);
    textGrad.addColorStop(0, '#755e1a');   // 橄欖金
    textGrad.addColorStop(0.5, '#d4af37'); // 典雅金
    textGrad.addColorStop(1, '#5d4a1b');   // 沉穩金
    
    ctx.fillStyle = textGrad;
    ctx.fillText(text, x, y);
    
    // 加入細緻內陰影模擬 (提升立體感但不突兀)
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillText(text, x - 2, y - 2);
    
    // 極柔和外發光 (模擬暖光散射)
    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
    ctx.shadowBlur = 20;
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  // 主標題 (數位成就證書)
  drawGoldenText('數位成就證書', centerX, 320, fontAntique, 160, true);
  
  // 英文副標 (極度弱化：極淡、斜體、拉大字距)
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.font = `italic 30px ${fontEng}`;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '8px';
  ctx.fillText('XINGANG BAGUA MYSTERY ACHIEVEMENT', centerX, 385);
  ctx.restore();

  // 頒發給
  ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
  ctx.font = `48px ${fontStandard}`;
  ctx.textAlign = 'center';
  ctx.fillText('頒 發 給', centerX, 550);

  // 姓名 (白底適配：改用深墨色展現莊重感)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `bold 200px ${fontAntique}`;
  ctx.fillStyle = '#222222'; // 改為深墨色
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 8;
  ctx.fillText(data.name || '挑戰者', centerX, 750); 

  // 極細淡金描邊 (保留微弱的尊貴感)
  ctx.strokeStyle = 'rgba(184, 134, 11, 0.15)';
  ctx.lineWidth = 1.2;
  ctx.strokeText(data.name || '挑戰者', centerX, 750);
  ctx.restore();

  // 名字下方的承托金線 (改用深古銅金)
  ctx.strokeStyle = 'rgba(133, 109, 40, 0.5)';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(centerX - 350, 790); ctx.lineTo(centerX + 350, 790); ctx.stroke();

  // D. 恭賀說明文字 (同步調整色調)
  const challengeTitle = '【新港八卦謎蹤】';
  ctx.font = `65px ${fontStandard}`;
  const wPrefix = ctx.measureText('恭喜完成 ').width;
  ctx.font = `bold 75px ${fontStandard}`;
  const wTitle = ctx.measureText(challengeTitle).width;
  ctx.font = `65px ${fontStandard}`;
  const wSuffix = ctx.measureText(' 挑戰！').width;
  const startT = centerX - (wPrefix + wTitle + wSuffix) / 2;

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(34, 34, 34, 0.8)'; // 改用深色字
  ctx.font = `65px ${fontStandard}`;
  ctx.fillText('恭喜完成 ', startT, 980);

  ctx.fillStyle = '#856d28'; // 改用深金色
  ctx.font = `bold 75px ${fontStandard}`;
  ctx.fillText(challengeTitle, startT + wPrefix, 980);

  ctx.fillStyle = 'rgba(34, 34, 34, 0.8)';
  ctx.font = `65px ${fontStandard}`;
  ctx.fillText(' 挑戰！', startT + wPrefix + wTitle, 980);

  // E. 底部資訊 (配合白底調降對度)
  ctx.textAlign = 'center';
  const sessionLabel = `活動場次：${data.session ? data.session.split('(')[0].trim() : '一般場次'}`;
  ctx.font = `38px ${fontStandard}`;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillText(sessionLabel, centerX, 1150, w - 500);

  ctx.font = `50px ${fontAntique}`;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillText(`${data.date} ｜ 新港文教基金會`, centerX, 1250);

  // 7. 朱紅方形印章 (鏤空篆刻化：大尺寸、透明、紅色文字、無底色)
  const drawSeal = (x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.05); 
    
    const sealSize = 300; // 放大尺寸
    ctx.globalAlpha = 0.6; // 增加透明度讓其更自然
    ctx.globalCompositeOperation = 'multiply';
    
    // A. 繪製破碎的紅色邊框 (不填充背景，達成鏤空感)
    ctx.strokeStyle = 'rgba(160, 40, 30, 1)';
    ctx.lineWidth = 16;
    ctx.beginPath();
    ctx.moveTo(Math.random()*10, Math.random()*10);
    ctx.lineTo(sealSize-Math.random()*10, Math.random()*5);
    ctx.lineTo(sealSize+Math.random()*5, sealSize-Math.random()*10);
    ctx.lineTo(Math.random()*5, sealSize+Math.random()*8);
    ctx.closePath();
    ctx.stroke();

    // B. 加入隨機的印泥殘留噴點 (僅在邊框與文字附近)
    ctx.fillStyle = 'rgba(160, 40, 30, 0.4)';
    for(let i=0; i<400; i++) {
      if (Math.random() > 0.7) { // 模擬不均勻感
        ctx.fillRect(Math.random()*sealSize, Math.random()*sealSize, 3, 3);
      }
    }

    // C. 印章文字 (改為紅色，達成刻印質感)
    ctx.fillStyle = 'rgba(160, 40, 30, 0.9)';
    ctx.font = 'bold 65px "Microsoft JhengHei"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('新港文教', sealSize/2, sealSize/3 + 15);
    ctx.fillText('基金會印', sealSize/2, (sealSize/3)*2 + 25);

    ctx.restore();
  };
  drawSeal(w - 550, h - 550);


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
