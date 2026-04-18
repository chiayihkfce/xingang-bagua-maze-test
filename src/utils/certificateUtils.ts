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

  // 2. 背景構建：暖黑底色 + 宣紙紋理 + 中心光暈
  const bgGrad = ctx.createRadialGradient(w/2, h/2, 200, w/2, h/2, w);
  bgGrad.addColorStop(0, '#1a1a1a');
  bgGrad.addColorStop(1, '#020202');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 宣紙/絲絹紋理 (適度減少循環以提升速度)
  ctx.save();
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 2000; i++) {
    ctx.strokeStyle = Math.random() > 0.5 ? '#d4af37' : '#ffffff';
    ctx.beginPath();
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.random() * 15, y + Math.random() * 15);
    ctx.lineWidth = 0.2;
    ctx.stroke();
  }
  ctx.restore();

  // 3. 完整太極八卦水印 (主體強化：提升對比度、粗細與能量感)
  ctx.save();
  ctx.translate(w / 2, h / 2);
  const ritualGrad = ctx.createRadialGradient(0, 0, 100, 0, 0, 800);
  ritualGrad.addColorStop(0, 'rgba(212, 175, 55, 0.3)'); // 增加對比
  ritualGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.15)');
  ritualGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.strokeStyle = ritualGrad;
  
  // 繪製多重同心圓 (結構核心)
  [280, 300, 320, 650, 700, 750].forEach((radius, idx) => {
    ctx.lineWidth = idx > 2 ? 3 : 7;
    ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.stroke();
  });

  // 太極圓
  const r = 320;
  ctx.lineWidth = 12;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(0, -r/2, r/2, Math.PI * 1.5, Math.PI * 0.5); ctx.arc(0, r/2, r/2, Math.PI * 1.5, Math.PI * 0.5, true); ctx.stroke();
  
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

  // 姓名 (降權：縮小尺寸與亮度，去除強烈3D)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `bold 200px ${fontAntique}`; // 從 280px 調降
  ctx.fillStyle = '#e5e1d3'; // 使用暖象牙白代替純白，降低衝擊力
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 10;
  ctx.fillText(data.name || '挑戰者', centerX, 850);
  
  // 極細淡金描邊 (取代原本厚重的質感)
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.strokeText(data.name || '挑戰者', centerX, 850);
  ctx.restore();
  
  // 名字下方的承托金線 (精簡為單線，降低視覺重量)
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(centerX - 350, 890); ctx.lineTo(centerX + 350, 890); ctx.stroke();

  // D. 恭賀說明文字 (調和色調與比例)
  const challengeTitle = '【新港八卦謎蹤】';
  ctx.font = `65px ${fontStandard}`;
  const wPrefix = ctx.measureText('恭喜完成 ').width;
  ctx.font = `bold 75px ${fontStandard}`;
  const wTitle = ctx.measureText(challengeTitle).width;
  ctx.font = `65px ${fontStandard}`;
  const wSuffix = ctx.measureText(' 挑戰！').width;
  const startT = centerX - (wPrefix + wTitle + wSuffix) / 2;

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = `65px ${fontStandard}`;
  ctx.fillText('恭喜完成 ', startT, 1050);
  
  ctx.fillStyle = '#d4af37'; // 與主標題一致的穩重金
  ctx.font = `bold 75px ${fontStandard}`;
  ctx.fillText(challengeTitle, startT + wPrefix, 1050);
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = `65px ${fontStandard}`;
  ctx.fillText(' 挑戰！', startT + wPrefix + wTitle, 1080);

  // E. 底部資訊 (大幅縮小字級展現精緻感)
  ctx.textAlign = 'center';
  const sessionLabel = `活動場次：${data.session ? data.session.split('(')[0].trim() : '一般場次'}`;
  ctx.font = `38px ${fontStandard}`;
  ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.fillText(sessionLabel, centerX, 1220, w - 500);
  
  ctx.font = `50px ${fontAntique}`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText(`${data.date} ｜ 新港文教基金會`, centerX, 1320);

  // 7. 朱紅方形印章 (終極藝術化：破碎邊緣、印泥噴點、疊印感)
  const drawSeal = (x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.05);
    
    const sealSize = 240;
    ctx.globalCompositeOperation = 'multiply';
    
    // 繪製帶有隨機破碎感的印泥背景
    ctx.fillStyle = 'rgba(192, 57, 43, 0.95)';
    ctx.beginPath();
    ctx.moveTo(Math.random()*6, Math.random()*6);
    ctx.lineTo(sealSize - Math.random()*6, Math.random()*6);
    ctx.lineTo(sealSize + Math.random()*6, sealSize - Math.random()*6);
    ctx.lineTo(Math.random()*6, sealSize + Math.random()*6);
    ctx.closePath();
    ctx.fill();
    
    // 加入印泥顆粒感 (墨色不均)
    ctx.fillStyle = 'rgba(150, 0, 0, 0.4)';
    for(let i=0; i<600; i++) {
      ctx.fillRect(Math.random()*sealSize, Math.random()*sealSize, 2, 2);
    }

    // 印章邊框 (加粗且破碎)
    ctx.strokeStyle = 'rgba(192, 57, 43, 1)';
    ctx.lineWidth = 18;
    ctx.strokeRect(15, 15, sealSize - 30, sealSize - 30);

    // D. 印章文字 (確保清晰可見，不再隱形)
    ctx.globalCompositeOperation = 'source-over'; // 恢復標準疊加模式
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 48px "Microsoft JhengHei"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('新港文教', sealSize/2, sealSize/3 + 8);
    ctx.fillText('基金會印', sealSize/2, (sealSize/3)*2 + 18);

    ctx.restore();
    };
    drawSeal(w - 500, h - 480);


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
