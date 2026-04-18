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
  const width = 800, height = 565; 
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. 背景
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#1c1c1c'); grad.addColorStop(1, '#0f0f0f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. 完整八卦水印
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)'; ctx.lineWidth = 1.5;
  const r = 70;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -r/2, r/2, Math.PI * 1.5, Math.PI * 0.5); ctx.arc(0, r/2, r/2, Math.PI * 1.5, Math.PI * 0.5, true); ctx.stroke();
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
  ctx.textAlign = 'center';
  
  // 4. 標題與副標
  ctx.fillStyle = '#d4af37'; ctx.font = `bold 52px ${fontAntique}`;
  ctx.fillText('數位成就證書', width/2, 110);
  ctx.fillStyle = 'rgba(212, 175, 55, 0.7)'; ctx.font = `16px sans-serif`;
  ctx.fillText('Xingang Bagua Maze Achievement', width/2, 140);

  // 5. 頒發給與姓名
  ctx.fillStyle = '#ffffff'; ctx.font = `20px ${fontAntique}`;
  ctx.fillText('頒發給', width/2, 200);
  ctx.fillStyle = '#ffffff'; ctx.font = `bold 75px ${fontAntique}`;
  ctx.fillText(data.name || '參加者', width/2, 285);
  ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(width/2 - 80, 295); ctx.lineTo(width/2 + 80, 295); ctx.stroke();

  // 6. 金色分段文字
  const t1 = '恭喜完成 ', t2 = '新港八卦謎蹤', t3 = ' 挑戰！';
  ctx.font = `22px ${fontAntique}`; const w1 = ctx.measureText(t1).width, w3 = ctx.measureText(t3).width;
  ctx.font = `bold 28px ${fontAntique}`; const w2 = ctx.measureText(t2).width;
  let sx = (width - (w1 + w2 + w3 + 10)) / 2;
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; ctx.font = `22px ${fontAntique}`; ctx.fillText(t1, sx, 360);
  ctx.fillStyle = '#d4af37'; ctx.font = `bold 28px ${fontAntique}`; ctx.fillText(t2, sx + w1 + 5, 360);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; ctx.font = `22px ${fontAntique}`; ctx.fillText(t3, sx + w1 + w2 + 10, 360);

  // 7. 場次與日期
  ctx.textAlign = 'center';
  const sName = data.session ? data.session.split('(')[0].trim() : '一般場次';
  ctx.font = `16px sans-serif`; ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText(`活動場次：${sName}`, width/2, 415);
  ctx.font = `18px ${fontAntique}`; ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillText(`${data.date} | 新港文教基金會`, width/2, 465);

  // 5. 紅印章
  ctx.save(); ctx.translate(width - 120, height - 110); ctx.rotate(-0.1);
  ctx.strokeStyle = 'rgba(192, 57, 43, 0.8)'; ctx.lineWidth = 3; ctx.strokeRect(0, 0, 50, 50);
  ctx.fillStyle = 'rgba(192, 57, 43, 0.8)'; ctx.font = 'bold 12px serif';
  ctx.fillText('新港文教', 25, 20); ctx.fillText('基金會印', 25, 38); ctx.restore();

  // 定死品質 0.3。體積保證在 20-30KB。
  return canvas.toBuffer('image/jpeg', { quality: 0.3 }).toString('base64');
}

  async function run() {
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split('T')[0];

  console.log(`[自動任務] 檢查日期：${dateStr}`);

  try {
    const snapshot = await db.collection('registrations')
      .where('pickupTime', '>=', dateStr)
      .where('pickupTime', '<', `${dateStr} \uf8ff`)
      .where('status', '==', '通過')
      .get();

    console.log(`[自動任務] 資料庫搜尋結果：找到 ${snapshot.size} 筆符合條件的資料`);

    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (data.certSent === true) continue;

      console.log(`正在處理：${data.name}...`);
      const base64Image = await drawCertificateImage({ 
        name: data.name, 
        session: data.session || '一般場次', 
        date: dateStr 
      });

      // 呼叫 EmailJS (使用 GitHub Pages 網址，加入預設主題參數)
      const certUrl = `https://chiayihkfce.github.io/xingang-bagua-maze-test/?certId=${doc.id}&theme=light`; 
      
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: process.env.VITE_EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_CERT_TEMPLATE_ID,
          user_id: process.env.VITE_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY,
          accessToken: process.env.EMAILJS_PRIVATE_KEY,
          template_params: {
            to_email: data.email,
            name: data.name,
            content: base64Image,
            cert_url: certUrl
          }
        })
      });

      if (response.ok) {
        console.log(`成功發送！`);
        await doc.ref.update({ certSent: true });
      } else {
        const errText = await response.text();
        console.error(`發送失敗 (${data.name}):`, errText);
      }
    }
  } catch (err) { console.error('執行報錯:', err); }
  }


run();
