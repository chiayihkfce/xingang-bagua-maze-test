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
  activeSeal?: string;
}) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const w = 2000,
    h = 1414;
  canvas.width = w;
  canvas.height = h;

  const isDark = data.theme === 'dark';

  // 2. 背景構建
  if (isDark) {
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 200, w / 2, h / 2, w);
    bgGrad.addColorStop(0, '#1c1c1c');
    bgGrad.addColorStop(1, '#050505');
    ctx.fillStyle = bgGrad;
  } else {
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 200, w / 2, h / 2, w);
    bgGrad.addColorStop(0, '#f9f7f0');
    bgGrad.addColorStop(1, '#eeeae0');
    ctx.fillStyle = bgGrad;
  }
  ctx.fillRect(0, 0, w, h);

  // 宣紙/絲絹紋理 (質感微調版：8,000 條纖維，增加透氣感)
  ctx.save();
  const fColors = isDark
    ? ['#d4af37', '#444444', '#ffffff', '#222222']
    : ['#d4af37', '#999999', '#ffffff', '#c0c0c0', '#f1c40f'];
  const fibersPerColor = 1600; // 總計約 8000 條

  fColors.forEach((color) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.globalAlpha = isDark ? 0.06 : 0.12;
    ctx.lineWidth = 0.35;
    for (let i = 0; i < fibersPerColor; i++) {
      const x = Math.random() * w,
        y = Math.random() * h,
        len = Math.random() * 30 + 5,
        angle = Math.random() * Math.PI * 2;
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(
        x + Math.random() * 10 - 5,
        y + Math.random() * 10 - 5,
        x + Math.cos(angle) * len,
        y + Math.sin(angle) * len
      );
    }
    ctx.stroke();
  });
  ctx.restore();

  // 3. 太極八卦水印
  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.strokeStyle = isDark
    ? 'rgba(212, 175, 55, 0.15)'
    : 'rgba(184, 134, 11, 0.12)';

  [650, 700, 750].forEach((radius) => {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();
  });

  const r = 320;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // 繪製整合路徑
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.moveTo(0, -r);
  ctx.arc(0, -r / 2, r / 2, Math.PI * 1.5, Math.PI * 0.5);
  ctx.arc(0, r / 2, r / 2, Math.PI * 1.5, Math.PI * 0.5, true);

  ctx.lineWidth = 12;
  ctx.stroke();

  // 繪製魚眼
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.arc(0, -r / 2, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, r / 2, 40, 0, Math.PI * 2);
  ctx.fill();

  const trigrams = [
    [1, 1, 1],
    [0, 1, 1],
    [1, 0, 1],
    [0, 0, 1],
    [1, 1, 0],
    [0, 1, 0],
    [1, 0, 0],
    [0, 0, 0]
  ];
  trigrams.forEach((lines, i) => {
    ctx.save();
    ctx.rotate((i * Math.PI) / 4);
    lines.forEach((isSolid, j) => {
      const y = 450 + j * 50;
      ctx.lineWidth = 22;
      if (isSolid) {
        ctx.beginPath();
        ctx.moveTo(-125, y);
        ctx.lineTo(125, y);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(-125, y);
        ctx.lineTo(-20, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(125, y);
        ctx.stroke();
      }
    });
    ctx.restore();
  });
  ctx.restore();

  // 4. 邊框
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 20;
  ctx.strokeRect(60, 60, w - 120, h - 120);
  ctx.lineWidth = 4;
  ctx.strokeRect(100, 100, w - 200, h - 200);

  // 5. 文字系統
  const centerX = w / 2;
  const fontAntique =
    '"STXingkai", "華文行楷", "LiSu", "隸書", "STKaiti", serif';
  const fontStandard = '"Noto Serif CJK TC", serif';

  const drawGoldenText = (
    text: string,
    x: number,
    y: number,
    font: string,
    size: number,
    isBold: boolean = false
  ) => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `${isBold ? 'bold ' : ''}${size}px ${font}`;

    // 製作立體鎏金陰影 (多層次深度感)
    ctx.shadowColor = 'rgba(0, 0, 0, 1)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;

    // 極致複雜金屬漸層 (深古銅 -> 亮金 -> 耀眼白金 -> 暗金)
    const textGrad = ctx.createLinearGradient(x, y - size, x, y + size / 4);
    textGrad.addColorStop(0, '#4a3b12'); // 深古銅
    textGrad.addColorStop(0.2, '#856d28'); // 飽和金
    textGrad.addColorStop(0.4, '#f1c40f'); // 亮黃金
    textGrad.addColorStop(0.5, '#ffffff'); // 高光白金
    textGrad.addColorStop(0.6, '#f1c40f'); // 亮黃金
    textGrad.addColorStop(0.8, '#d4af37'); // 典雅金
    textGrad.addColorStop(1, '#5d4a1b'); // 暗金

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
  ctx.fillStyle = isDark
    ? 'rgba(212, 175, 55, 0.8)'
    : 'rgba(184, 134, 11, 0.8)';
  ctx.font = `italic 32px serif`; // 稍微調大一點
  ctx.textAlign = 'center';
  ctx.letterSpacing = '10px';
  ctx.fillText('The Bagua Mystery of xingang', centerX, 390);
  ctx.restore();

  // 頒發給 (使用標準宋體)
  ctx.fillStyle = isDark
    ? 'rgba(212, 175, 55, 0.8)'
    : 'rgba(133, 109, 40, 0.8)';
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
  ctx.strokeStyle = isDark
    ? 'rgba(212, 175, 55, 0.5)'
    : 'rgba(184, 134, 11, 0.3)';
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
  const w1 = ctx.measureText('恭喜完成 ').width,
    w3 = ctx.measureText(' 挑戰！').width;
  ctx.font = `bold 75px ${fontStandard}`;
  const w2 = ctx.measureText(challengeTitle).width;

  const gap = 25; // 設定對稱間距
  const startT = centerX - (w1 + w2 + w3 + gap * 2) / 2;

  ctx.textAlign = 'left';
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(34, 34, 34, 0.8)';
  ctx.font = `65px ${fontStandard}`;
  ctx.fillText('恭喜完成 ', startT, 980);

  ctx.fillStyle = isDark ? '#d4af37' : '#856d28';
  ctx.font = `bold 75px ${fontStandard}`;
  ctx.fillText(challengeTitle, startT + w1 + gap, 980); // 加入前半間距

  ctx.font = `65px ${fontStandard}`;
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(34, 34, 34, 0.8)';
  ctx.fillText(' 挑戰！', startT + w1 + w2 + gap * 2, 980); // 加入後半間距

  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? 'rgba(212, 175, 55, 0.4)' : 'rgba(0,0,0,0.4)';
  ctx.font = `38px ${fontStandard}`;
  ctx.fillText(
    `活動場次：${data.session ? data.session.split('(')[0].trim() : '一般場次'}`,
    centerX,
    1150
  );
  ctx.fillStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
  ctx.font = `50px ${fontAntique}`;
  ctx.fillText(`${data.date} ｜ 新港文教基金會`, centerX, 1250);

  // 7. 朱紅官印 (動態圖片貼圖版)
  const drawSeal = async (x: number, y: number) => {
    const s = 280;
    const img = new Image();

    // 定義官印代號與檔案名稱的映射
    const sealMap: Record<string, string> = {
      'full-yang': 'seal-full-yang.png',
      'full-yin': 'seal-full-yin.png',
      'zh-vert-rl-yang': 'seal-zh-vert-rl-yang.png',
      'zh-vert-rl-yin': 'seal-zh-vert-rl-yin.png',
      'zh-vert-lr-yang': 'seal-zh-vert-lr-yang.png',
      'zh-vert-lr-yin': 'seal-zh-vert-lr-yin.png',
      'zh-horiz-lr-yang': 'seal-zh-horiz-lr-yang.png',
      'zh-horiz-lr-yin': 'seal-zh-horiz-lr-yin.png'
    };

    // 根據傳入的 activeSeal 決定圖檔，預設為滿漢並行陽刻
    const fileName = sealMap[data.activeSeal || ''] || 'seal-full-yang.png';
    const sealUrl = `./${fileName}`;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = sealUrl;
    });

    const sealCanvas = document.createElement('canvas');
    sealCanvas.width = s;
    sealCanvas.height = s;
    const sCtx = sealCanvas.getContext('2d');
    if (!sCtx) return;

    // 將固定比例的圖片繪入離屏畫布
    sCtx.drawImage(img, 0, 0, s, s);

    // 實作「物理質感」：Canvas 隨機挖空 (維持手工斑駁感)
    sCtx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 550; i++) {
      const px = Math.random() * s,
        py = Math.random() * s;
      const sz = Math.random() * 2.5 + 0.5;
      sCtx.beginPath();
      sCtx.arc(px, py, sz, 0, Math.PI * 2);
      sCtx.fill();
    }

    // 將「完美的帶孔印章」貼回主證書
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.015);
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(sealCanvas, 0, 0);
    ctx.restore();
  };

  await drawSeal(w - 500, h - 500);

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
