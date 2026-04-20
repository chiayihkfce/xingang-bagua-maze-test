import admin from 'firebase-admin';
import canvasModule from 'canvas';
const { createCanvas } = canvasModule;
import fetch from 'node-fetch';

// 1. 初始化 Firebase Admin
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('缺少 FIREBASE_SERVICE_ACCOUNT 環境變數');
  process.exit(1);
}
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

/**
 * 繪製預覽縮圖 (定死低體積規格，視覺對齊原圖)
 */
async function drawCertificateImage(data) {
  const width = 600, height = 424; 
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. 背景 (放射狀米白)
  const bgGrad = ctx.createRadialGradient(width/2, height/2, 80, width/2, height/2, width);
  bgGrad.addColorStop(0, '#f9f7f0'); bgGrad.addColorStop(1, '#eeeae0');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. 纖維 (1500條，確保壓縮效率)
  ctx.save();
  const fColors = ['#d4af37', '#999999', '#ffffff', '#c0c0c0'];
  for (let i = 0; i < 1500; i++) {
    ctx.globalAlpha = Math.random() * 0.1;
    ctx.strokeStyle = fColors[Math.floor(Math.random() * fColors.length)];
    ctx.lineWidth = 0.25; ctx.beginPath();
    const x = Math.random() * width, y = Math.random() * height, len = Math.random() * 15 + 5;
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.random() * 6 - 3, y + Math.random() * 6 - 3, x + Math.random() * len, y + Math.random() * len);
    ctx.stroke();
  }
  ctx.restore();

  // 3. 太極八卦 (合併路徑)
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.strokeStyle = 'rgba(184, 134, 11, 0.12)';
  const r = 95; 
  ctx.lineCap = 'round'; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2); 
  ctx.moveTo(0, -r);
  ctx.arc(0, -r/2, r/2, Math.PI * 1.5, Math.PI * 0.5); 
  ctx.arc(0, r/2, r/2, Math.PI * 1.5, Math.PI * 0.5, true); 
  ctx.stroke();
  // 魚眼
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath(); ctx.arc(0, -r/2, 12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, r/2, 12, 0, Math.PI * 2); ctx.fill();
  const trigrams = [ [1,1,1], [0,1,1], [1,0,1], [0,0,1], [1,1,0], [0,1,0], [1,0,0], [0,0,0] ];
  trigrams.forEach((lines, i) => {
    ctx.save(); ctx.rotate(i * Math.PI / 4);
    lines.forEach((isSolid, j) => {
      const y = 110 + (j * 8);
      if (isSolid) ctx.strokeRect(-22, y, 44, 5);
      else { ctx.strokeRect(-22, y, 20, 5); ctx.strokeRect(2, y, 20, 5); }
    });
    ctx.restore();
  });
  ctx.restore();

  // 3. 邊框與四角裝飾
  ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 8; ctx.strokeRect(20, 20, width-40, height-40);
  const cs = 50; ctx.lineWidth = 3;
  [ [20, 20, 1, 1], [width-20, 20, -1, 1], [20, height-20, 1, -1], [width-20, height-20, -1, -1] ].forEach(([x, y, dx, dy]) => {
    ctx.beginPath(); ctx.moveTo(x, y + (dy*cs)); ctx.lineTo(x, y); ctx.lineTo(x + (dx*cs), y); ctx.stroke();
  });

  const fontAntique = 'serif';
  const centerX = width / 2;
  
  // 4. 文字排版 (適配 600x424)
  ctx.fillStyle = '#856d28'; ctx.font = `bold 45px ${fontAntique}`; ctx.textAlign = 'center';
  ctx.fillText('數位成就證書', centerX, 95);
  
  ctx.fillStyle = 'rgba(184, 134, 11, 0.7)'; ctx.font = `italic 11px serif`;
  ctx.fillText('The Bagua Mystery of xingang', centerX, 115);

  ctx.fillStyle = '#666666'; ctx.font = `15px serif`; ctx.fillText('頒 發 給', centerX, 165);
  
  ctx.fillStyle = '#222222'; ctx.font = `bold 62px ${fontAntique}`;
  ctx.fillText(data.name || '參加者', centerX, 230);
  
  ctx.strokeStyle = 'rgba(133, 109, 40, 0.4)'; ctx.lineWidth = 1.2; 
  ctx.beginPath(); ctx.moveTo(centerX-110, 242); ctx.lineTo(centerX+110, 242); ctx.stroke();

  // 祝賀詞
  const t1 = '恭喜完成 ', t2 = '【新港八卦謎蹤】', t3 = ' 挑戰！';
  const gap = 10; ctx.font = `20px serif`;
  const w1 = ctx.measureText(t1).width, w2 = ctx.measureText(t2).width, w3 = ctx.measureText(t3).width;
  const sx = centerX - (w1 + w2 + w3 + (gap*2)) / 2;
  ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(34,34,34,0.8)';
  ctx.fillText(t1, sx, 300);
  ctx.fillStyle = '#856d28'; ctx.font = `bold 23px serif`; ctx.fillText(t2, sx+w1+gap, 300);
  ctx.fillStyle = 'rgba(34,34,34,0.8)'; ctx.font = `20px serif`; ctx.fillText(t3, sx+w1+w2+(gap*2), 300);

  // 底部資訊
  ctx.textAlign = 'center'; ctx.font = `11px serif`; ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillText(`活動場次：${data.session ? data.session.split('(')[0].trim() : '一般場次'}`, centerX, 345);
  ctx.font = `14px ${fontAntique}`; ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillText(`${data.date} | 新港文教基金會`, centerX, 380);

  // 6. 朱紅官印 (適配版)
  ctx.save(); ctx.translate(width - 120, height - 120); ctx.rotate(-0.01);
  const s = 80, rad = 12; ctx.globalAlpha = 0.7; ctx.globalCompositeOperation = 'multiply';
  ctx.strokeStyle = 'rgba(160, 40, 30, 1)'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(rad, 0); ctx.lineTo(s-rad, 0); ctx.quadraticCurveTo(s,0,s,rad); ctx.lineTo(s,s-rad); ctx.quadraticCurveTo(s,s,s-rad,s); ctx.lineTo(rad,s); ctx.quadraticCurveTo(0,s,0,s-rad); ctx.lineTo(0,rad); ctx.quadraticCurveTo(0,0,rad,0); ctx.stroke();
  ctx.fillStyle = 'rgba(160, 40, 30, 1)'; ctx.font = 'bold 16px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('新港文教', s/2, s/2 - 13); ctx.fillText('基金會印', s/2, s/2 + 13); ctx.restore();

  // 定死品質 0.3。體積保證在 20-30KB。
  return canvas.toBuffer('image/jpeg', { quality: 0.3 }).toString('base64');
}

async function run() {
  const now = new Date();
  const todayStart = now.toISOString().split('T')[0];

  console.log(`[自動任務] 正在掃描歷史紀錄，補發 ${todayStart} 以前尚未發送的證書...`);

  try {
    const snapshot = await db.collection('registrations')
      .where('status', '==', '通過')
      .where('pickupTime', '<', todayStart)
      .get();

    console.log(`[自動任務] 資料庫搜尋結果：找到 ${snapshot.size} 筆潛在合格資料`);

    let successCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (data.certSent === true) continue;

      const playDate = data.pickupTime ? data.pickupTime.split(' ')[0] : '未知日期';
      
      // 1. 取得隊員名單 (如果沒有多人名單，則只寄給報名人)
      const players = data.playerList && data.playerList.length > 0 
        ? data.playerList 
        : [{ name: data.name, email: data.email }];

      console.log(`[處理訂單] ${data.name} (${playDate}) - 共有 ${players.length} 位隊員`);

      let orderSuccess = true;

      // 2. 遍歷名單分別寄送
      for (const player of players) {
        if (!player.email || !player.name) continue;

        console.log(`  > 正在發送給：${player.name} (${player.email})...`);
        
        try {
          const base64Image = await drawCertificateImage({ 
            name: player.name, 
            session: data.session || '一般場次', 
            date: playDate 
          });

          // 正式版網址
          const certUrl = `https://chiayihkfce.github.io/xingang-bagua-maze/?certId=${doc.id}&theme=light`; 
          
          const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: process.env.VITE_EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID,
              template_id: process.env.EMAILJS_CERT_TEMPLATE_ID,
              user_id: process.env.VITE_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY,
              accessToken: process.env.EMAILJS_PRIVATE_KEY,
              template_params: {
                to_email: player.email,
                name: player.name,
                content: base64Image,
                cert_url: certUrl
              }
            })
          });

          if (!response.ok) {
            const errText = await response.text();
            console.error(`    ❌ 發送失敗 (${player.name}):`, errText);
            orderSuccess = false;
          } else {
            console.log(`    ✅ 成功發送給 ${player.name}`);
          }
        } catch (err) {
          console.error(`    ❌ 處理過程報錯 (${player.name}):`, err);
          orderSuccess = false;
        }
      }

      // 3. 只有當所有人都發送嘗試完成後，才標記該訂單為已發送 (或依需求調整)
      if (orderSuccess) {
        await doc.ref.update({ certSent: true });
        successCount++;
      }
    }
    console.log(`[任務完成] 本次共成功處理 ${successCount} 筆訂單的證書發送。`);


run();
