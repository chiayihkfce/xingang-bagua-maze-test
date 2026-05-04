var CHANNEL_ACCESS_TOKEN =
  'KLqgLp2HZEB3NbOB4IF5ZRqKkDxFRGhYaEqiNyMy21+ctAmhO3gY1NNZ6iUuUq36nMYM7VOPIoxCQiiCr1vQ1YL2TTSxCRoxNMT0IlJp9V2TMFLZLqVw8Rcdhu1Ds/vVcTcPQ2oayHnkXJgBhT6dLgdB04t89/1O/w1cDnyilFU=';
var GROUP_ID = 'C4b7cc8c8ed5c3c62c384736e60c10e4c';
var MY_GAS_URL =
  'https://script.google.com/macros/s/AKfycbxakCReNaHCX3BK7XpJZLZ8Gdp_d6quOXfReq6Ev5S-emwdQSxuzM2OILkXjEp9WVM9ug/exec';
var ADMIN_WEBSITE_URL =
  'https://chiayihkfce.github.io/xingang-bagua-maze/#/xk_admin_panel_6688';

// --- Firebase 配置 ---
var FIREBASE_PROJECT_ID = 'xingang-maze'.trim();
var FIREBASE_CLIENT_EMAIL =
  'firebase-adminsdk-fbsvc@xingang-maze.iam.gserviceaccount.com'.trim();
var FIREBASE_PRIVATE_KEY =
  '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDbc7f5uRdMfdxa\nvTYOqQ1lIq6rsHGB7iJZFUjFAw2A5SbmRjt5c3S29Nxujwtsn/Ln0GScbIb4iiRR\naZbMYLbmviOAnWA40L6m6ySSB6N3FHnySzpfk6g6rRu2brvMIvIeYaDicUSQ1r7N\nM+0FAkBB7tz0cxjg8jMBMlFU31qExOJL1VE46lBsvO2D+NgG66QxtHZtFygp639l\nsKSBapbdG8B05orG01WuJQ9FUwHI6TvCE/4I4pIkmfccqK1eGEAWprXuYSOz7GE3\nRMRsuCC8aMsu28hP5rYE/pi8G4Alab0rvP5KbFq2iXZZEiIj5f7+FiVuJ8cNSXHI\nC4wU4WmlAgMBAAECggEAA16mhON5CR1RpI8NOnJmw0EiFNQpGglRu7PI90V8ZUNK\nMp+sysj2vNchCg2Q660VFMbYFKgnS7+187i/A7UPJJc816e9p4Gvu8PBPwDLsMi+\ntUq/GGKduFuaIQCtn40rJ0Ob2H5MGDvumBtjrf+tLutVDJKL35W4f3HfWoHyKOG5\nxsT5xXAlGv/2cr9jy0VVVw6PwDz8B4Ct+8MCXG84AR45uhdV7O3iOlXSmAaa79sQ\nABbd9tD0aBv+uWrbvpgqopuzvo9QSbCmmE0N3X/IFatcKFpRJdD34CfV3ZVKWZwb\nm63NSWS3F08b8BxsC5n7m0SJJXNwpJLvXpV0bFgVDQKBgQD6tv5ATZZTz/fp8lsl\nA53JUByUkituk0pW7a1Qk5p9AO16mpGlKNS2h/0nDLUG+OSfABuE8e/ZH/DRuZhE\nYfIXNbimkFV2rbols23ibS4k6KSqDqeuF7v9YeWpWlJwwX14kWN7N1O4mhOu9Iox\ne6ifX+esM4mXEixjgXJAEAS8VwKBgQDgFANG6f4elDAVHEyUvf4+13FZTJ15hy+T\ntWhJ+s8OfxnKpele+mLlTf9Ox0dT0PNvcBdTRCpK2f2lPVnjJWH3q1Zwei7ns8oz\nIed16WmHHhqqZjWWEqhMUhsMsyZwFV6wAmAM0aIMsaaPCC5a/Fm6M45xQvLKTn2n\nM3rEvDuMYwKBgQDSGFzxd9Mcgu9mXZChcOldlMOOgPriW411URDmr/pK/GcFUdfx\nBklSeJzch1p/8DxtPYLSIofydECzDwsZatabOop1Egh8PlL6WuUfVIzRox6x3zwG\nuJ7xU4NIKodhM9O4IGW0EIYY8QzDlOrlUpHYlF6owDtxnGoULJqYMpQ1WwKBgQCv\nrID1M7Xa22rm4gzYACw3sEhZLku3X1jZgLuGZG+4ecUKrxBLOhoWlBO4+1rcR1DS\n6RogWayeilDlHzg9cK1hsp5OCDyFwtqfQ9FnC9uD5wIY3ZDdWzs+upAiYMGd1eMq\nMnKDGkbllNF0CYHuKzFdXdYqzcXy/Z5dW2rAmqJE6QKBgQCq1PSwlkI22vWy9oLW\nlf65HbxDaMq5dgZmTNnhPHBTTS0tZNHUQ27NS/ZTuxlkmhA35R0IWTyFGF4zcUVJ\n0Yz1t60BQcFGYqX3+YOVyxsM/he94YVjVh7py0TYHNWpMoJY7ewvepzK8HrumytA\nFt9kri1cw0eJTNvwEsglu9f06w==\n-----END PRIVATE KEY-----\n';

// --- EmailJS 配置 ---
var EMAILJS_SERVICE_ID = 'service_y1s70hh';
var EMAILJS_TEMPLATE_ID = 'template_dnuq8qt';
var EMAILJS_PUBLIC_KEY = '2QagEqyWPgNuwfbg2';
var EMAILJS_PRIVATE_KEY = 'DIc_iEggUECBpbqG2UrZf';

// 處理 LINE 回傳
function doPost(e) {
  var contents = JSON.parse(e.postData.contents);

  // 1. 處理網頁報名 (優先判斷)
  if (contents && contents.type === 'new_registration') {
    sendPush(contents);
    return ContentService.createTextOutput('ok');
  }

  // 2. 處理 LINE 事件 (維持原狀)
  var event = contents.events[0];
  var props = PropertiesService.getScriptProperties();

  if (event.type === 'postback') {
    handlePostback(event);
  } else if (event.type === 'message' && event.message.type === 'text') {
    var userMsg = event.message.text.trim();

    // --- 核心：檢查是否處於修改模式 ---
    if (props.getProperty('EDIT_MODE_' + event.source.userId) === 'true') {
      try {
        var targetId = props.getProperty('TARGET_ID_' + event.source.userId);
        var targetField = props.getProperty(
          'TARGET_FIELD_' + event.source.userId
        );

        // 存在性檢查：防止修改已刪除資料
        if (!getFirebaseDoc('registrations', targetId)) {
          props.deleteProperty('EDIT_MODE_' + event.source.userId);
          sendReply(
            event.replyToken,
            '⚠️ 修改失敗：此報名已遭刪除或移至回收桶。'
          );
          return ContentService.createTextOutput('ok');
        }

        if (!targetId || !targetField) {
          props.deleteProperty('EDIT_MODE_' + event.source.userId);
          sendReply(event.replyToken, '⚠️ 錯誤：找不到修改目標。已自動重置。');
          return ContentService.createTextOutput('ok');
        }

        var updateObj = {};
        updateObj[targetField] = userMsg;

        var success = patchFirebaseDoc('registrations', targetId, updateObj);
        if (success) {
          props.deleteProperty('EDIT_MODE_' + event.source.userId);
          addLogToFirebase(
            '修改報名',
            '透過 LINE 將 ID:[' +
              targetId +
              '] 的 ' +
              targetField +
              ' 修改為：' +
              userMsg
          );
          sendReply(event.replyToken, '✅ 修改成功！\n新的內容為：' + userMsg);
        } else {
          sendReply(event.replyToken, '⚠️ Firebase 修改失敗。');
        }
      } catch (err) {
        sendReply(event.replyToken, '⚠️ 修改過程發生錯誤：' + err.toString());
      }
      return ContentService.createTextOutput('ok');
    }

    // --- 核心：檢查是否處於查詢模式 ---
    if (props.getProperty('SEARCH_MODE_' + event.source.userId) === 'true') {
      props.deleteProperty('SEARCH_MODE_' + event.source.userId); // 執行前先重置
      handleSearchRegistrations(event.replyToken, userMsg);
      return ContentService.createTextOutput('ok');
    }
    // --- 結束修改模式判斷 ---

    if (userMsg === '取得ID' || userMsg === '測試') {
      var sourceId = event.source.groupId || event.source.userId;
      sendReply(event.replyToken, '連線成功！\nID：' + sourceId);
    } else if (
      userMsg.indexOf('名單') !== -1 ||
      userMsg.indexOf('清單') !== -1
    ) {
      handleListRegistrations(event.replyToken, null);
    } else if (userMsg === '查詢') {
      props.setProperty('SEARCH_MODE_' + event.source.userId, 'true');
      sendReplyWithCancel(
        event.replyToken,
        '🔍 進入查詢模式\n請輸入您要搜尋的「姓名」或「電話」：'
      );
    } else if (userMsg.indexOf('查詢 ') === 0) {
      var keyword = userMsg.replace('查詢 ', '').trim();
      handleSearchRegistrations(event.replyToken, keyword);
    } else if (userMsg.indexOf('回收桶') !== -1) {
      handleViewRecycleBin(event.replyToken, null);
    } else if (userMsg === '管理網站') {
      // 直接模擬點擊 admin_login 的 postback 動作
      handlePostback({
        replyToken: event.replyToken,
        source: event.source,
        postback: { data: 'action=admin_login' }
      });
    } else {
      sendManagementMenu(
        event.replyToken,
        '【 管理主選單 】\n請選擇下方快捷按鈕：'
      );
    }
  }
  return ContentService.createTextOutput('ok');
}

/**
 * 處理關鍵字查詢
 */
function handleSearchRegistrations(replyToken, keyword) {
  try {
    var results = runFirebaseQuery('registrations', keyword);
    if (results.length === 0) {
      sendReply(replyToken, '🔍 找不到包含「' + keyword + '」的報名資料。');
      return;
    }

    // 限制顯示前 5 筆最相關資料，確保不超過 LINE 訊息限制
    var bubbleList = results.slice(0, 5).map(function (doc) {
      var id = doc.name.split('/').pop();
      var reg = firestoreToObj(doc);
      var name = String(reg.name || '未知');
      var phone = String(reg.phone || '無').replace('+886', '0');

      var rows = [
        { type: 'text', text: '📞 電話: ' + phone, size: 'xs' },
        {
          type: 'text',
          text: '📧 Email: ' + String(reg.email || '無'),
          size: 'xs'
        },
        {
          type: 'text',
          text:
            '📦 份數: ' +
            String(reg.quantity || '1') +
            ' | 👥 人數: ' +
            String(reg.players || '1'),
          size: 'xs'
        },
        {
          type: 'text',
          text: '📅 場次: ' + String(reg.session || '無'),
          size: 'xs'
        },
        {
          type: 'text',
          text: '🕒 時間: ' + String(reg.pickupTime || '無'),
          size: 'xs'
        },
        {
          type: 'text',
          text: '📍 地點: ' + String(reg.pickupLocation || '未指定'),
          size: 'xs',
          color: '#2980b9'
        }
      ];

      if (reg.bankLast5 && reg.bankLast5 !== '無') {
        rows.push({
          type: 'text',
          text: '🏦 銀行末5碼: ' + String(reg.bankLast5),
          size: 'xs',
          color: '#8e44ad',
          weight: 'bold'
        });
      }
      if (reg.notes && reg.notes !== '無') {
        rows.push({
          type: 'text',
          text: '📝 備註: ' + String(reg.notes),
          size: 'xs',
          wrap: true,
          color: '#7f8c8d'
        });
      }
      rows.push({
        type: 'text',
        text: '💰 金額: NT$ ' + String(reg.totalAmount || reg.amount || '0'),
        weight: 'bold',
        size: 'sm',
        color: '#c0392b',
        margin: 'sm'
      });

      return {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#2ecc71',
          contents: [
            {
              type: 'text',
              text: '🔍 搜尋結果',
              color: '#ffffff',
              weight: 'bold',
              size: 'sm'
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'xs',
          contents: [
            { type: 'text', text: name, size: 'lg', weight: 'bold' },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'md',
              spacing: 'xs',
              contents: rows
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#f1c40f',
              height: 'sm',
              action: {
                type: 'postback',
                label: '管理此筆 🔍',
                data:
                  'action=manage_record&id=' +
                  id +
                  '&name=' +
                  encodeURIComponent(name)
              }
            }
          ]
        }
      };
    });

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
      },
      payload: JSON.stringify({
        replyToken: replyToken,
        messages: [
          {
            type: 'flex',
            altText: '🔍 搜尋結果',
            contents: { type: 'carousel', contents: bubbleList }
          }
        ]
      })
    });
  } catch (e) {
    sendReply(replyToken, '❌ 查詢發生錯誤：' + e.toString());
  }
}

/**
 * 顯示報名詳細卡片
 */
function handleShowDetails(replyToken, id) {
  try {
    var doc = getFirebaseDoc('registrations', id);
    if (!doc) {
      sendReply(replyToken, '⚠️ 找不到報名詳情，可能已被刪除。');
      return;
    }

    var reg = firestoreToObj(doc);
    var displayPhone = (reg.phone || '無').replace('+886', '0');
    var contentsList = [
      { type: 'text', text: '📞 電話: ' + displayPhone, size: 'sm' },
      { type: 'text', text: '📧 Email: ' + (reg.email || '無'), size: 'sm' },
      {
        type: 'text',
        text: '📦 購買份數: ' + (reg.quantity || '1') + ' 份',
        size: 'sm',
        weight: 'bold'
      },
      {
        type: 'text',
        text: '👥 遊玩人數: ' + (reg.players || '1') + ' 人',
        size: 'sm'
      },
      {
        type: 'text',
        text: '📅 預約場次: ' + (reg.session || '無'),
        size: 'sm'
      },
      {
        type: 'text',
        text: '🕒 報到時間: ' + (reg.pickupTime || '無'),
        size: 'sm'
      },
      {
        type: 'text',
        text: '📍 報到地點: ' + (reg.pickupLocation || '新港文教基金會'),
        size: 'sm',
        color: '#2980b9'
      },
      {
        type: 'text',
        text: '💳 支付方式: ' + (reg.paymentMethod || '未指定'),
        size: 'sm'
      }
    ];

    if (reg.bankLast5 && reg.bankLast5 !== '無') {
      contentsList.push({
        type: 'text',
        text: '🏦 銀行末5碼: ' + reg.bankLast5,
        size: 'sm',
        color: '#8e44ad',
        weight: 'bold'
      });
    }
    contentsList.push({
      type: 'text',
      text: '📝 備註: ' + (reg.notes || '無'),
      size: 'sm',
      wrap: true
    });
    contentsList.push({
      type: 'text',
      text: '💰 總計金額: NT$ ' + (reg.totalAmount || reg.amount || 0),
      weight: 'bold',
      size: 'md',
      color: '#c0392b',
      margin: 'md'
    });

    var payload = {
      replyToken: replyToken,
      messages: [
        {
          type: 'flex',
          altText: '📜 報名詳情: ' + (reg.name || '未知'),
          contents: {
            type: 'bubble',
            header: {
              type: 'box',
              layout: 'vertical',
              backgroundColor: '#3498db',
              contents: [
                {
                  type: 'text',
                  text: '📜 報名詳細資料',
                  weight: 'bold',
                  color: '#ffffff'
                }
              ]
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: reg.name || '未知',
                  size: 'xl',
                  weight: 'bold'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'md',
                  spacing: 'sm',
                  contents: contentsList
                }
              ]
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                {
                  type: 'button',
                  style: 'primary',
                  color: '#f1c40f',
                  height: 'sm',
                  action: {
                    type: 'postback',
                    label: '審核 🔍',
                    data:
                      'action=show_audit&id=' +
                      id +
                      '&name=' +
                      encodeURIComponent(reg.name || '未知')
                  }
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'button',
                      style: 'secondary',
                      height: 'sm',
                      action: {
                        type: 'postback',
                        label: '修改 ✏️',
                        data:
                          'action=edit&id=' +
                          id +
                          '&name=' +
                          encodeURIComponent(reg.name || '未知')
                      }
                    },
                    {
                      type: 'button',
                      style: 'secondary',
                      color: '#c0392b',
                      height: 'sm',
                      action: {
                        type: 'postback',
                        label: '刪除 🗑️',
                        data:
                          'action=delete&id=' +
                          id +
                          '&name=' +
                          encodeURIComponent(reg.name || '未知')
                      }
                    }
                  ]
                }
              ]
            }
          }
        }
      ]
    };
    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
      },
      payload: JSON.stringify(payload)
    });
  } catch (e) {
    sendReply(replyToken, '❌ 顯示詳情失敗：' + e.toString());
  }
}

/**
 * 發送修改項目選單
 */
function sendEditMenu(replyToken, id, name) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var payload = {
    replyToken: replyToken,
    messages: [
      {
        type: 'flex',
        altText: '請選擇修改項目',
        contents: {
          type: 'bubble',
          size: 'micro',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#8e44ad',
            contents: [
              {
                type: 'text',
                text: '資料修改',
                color: '#ffffff',
                weight: 'bold',
                size: 'sm'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '請選擇要修改的欄位：',
                size: 'xs',
                weight: 'bold'
              }
            ]
          }
        },
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '👤 姓名',
                data:
                  'action=ask_edit_field&field=name&id=' + id + '&name=' + name,
                displayText: '修改姓名'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '📞 電話',
                data:
                  'action=ask_edit_field&field=phone&id=' +
                  id +
                  '&name=' +
                  name,
                displayText: '修改電話'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '📅 修改場次',
                data:
                  'action=ask_edit_field&field=session&id=' +
                  id +
                  '&name=' +
                  name,
                displayText: '我要修改預約場次'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '🕒 修改時間',
                data: 'action=ask_edit_time&id=' + id + '&name=' + name,
                displayText: '準備修改時間'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '📍 地點',
                data:
                  'action=ask_edit_field&field=pickupLocation&id=' +
                  id +
                  '&name=' +
                  name,
                displayText: '修改地點'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '💳 支付',
                data:
                  'action=ask_edit_field&field=paymentMethod&id=' +
                  id +
                  '&name=' +
                  name,
                displayText: '修改支付方式'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '📝 備註',
                data:
                  'action=ask_edit_field&field=notes&id=' +
                  id +
                  '&name=' +
                  name,
                displayText: '修改備註'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '❌ 取消',
                data: 'action=cancel_audit',
                displayText: '取消修改'
              }
            }
          ]
        }
      }
    ]
  };
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  });
}
function sendPush(reg) {
  var url = 'https://api.line.me/v2/bot/message/push';

  // 強化 ID 抓取
  var targetId = reg.id || reg.lastSubmissionId || reg.submissionId || '';

  // 格式化電話：將 +886 換成 0
  var displayPhone = (reg.phone || '無').replace('+886', '0');
  // 建立明細欄位
  var contentsList = [
    { type: 'text', text: '📞 電話: ' + displayPhone, size: 'sm' },
    { type: 'text', text: '📧 Email: ' + (reg.email || '無'), size: 'sm' },
    {
      type: 'text',
      text: '📦 購買份數: ' + (reg.quantity || '1') + ' 份',
      size: 'sm',
      weight: 'bold'
    },
    {
      type: 'text',
      text: '👥 遊玩人數: ' + (reg.players || '1') + ' 人',
      size: 'sm'
    },
    { type: 'text', text: '📅 預約場次: ' + (reg.session || '無'), size: 'sm' },
    {
      type: 'text',
      text: '🕒 報到時間: ' + (reg.pickupTime || '無'),
      size: 'sm'
    },
    {
      type: 'text',
      text: '📍 報到地點: ' + (reg.pickupLocation || '新港文教基金會'),
      size: 'sm',
      color: '#2980b9'
    },

    {
      type: 'text',
      text: '💳 支付方式: ' + (reg.paymentMethod || '未指定'),
      size: 'sm'
    }
  ];

  // 如果是銀行轉帳，加入末五碼顯示
  if (reg.bankLast5 && reg.bankLast5 !== '無') {
    contentsList.push({
      type: 'text',
      text: '🏦 銀行末5碼: ' + reg.bankLast5,
      size: 'sm',
      color: '#8e44ad',
      weight: 'bold'
    });
  }

  // 加入備註
  contentsList.push({
    type: 'text',
    text: '📝 備註: ' + (reg.notes || '無'),
    size: 'sm',
    wrap: true
  });
  var displayAmount = reg.totalAmount || reg.amount || 0;
  contentsList.push({
    type: 'text',
    text: '💰 總計金額: NT$ ' + displayAmount,
    weight: 'bold',
    size: 'md',
    color: '#c0392b',
    margin: 'md'
  });

  var payload = {
    to: GROUP_ID,
    messages: [
      {
        type: 'flex',
        altText: '🆕 報名通知: ' + (reg.name || '新玩家'),
        contents: {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#f1c40f',
            contents: [
              {
                type: 'text',
                text: '🆕 新報名通知',
                weight: 'bold',
                color: '#000000'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: reg.name || '未知',
                size: 'xl',
                weight: 'bold'
              },
              {
                type: 'box',
                layout: 'vertical',
                margin: 'md',
                spacing: 'sm',
                contents: contentsList
              }
            ]
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
              {
                type: 'button',
                style: 'primary',
                color: '#f1c40f',
                height: 'sm',
                action: {
                  type: 'postback',
                  label: '審核 🔍',
                  data:
                    'action=show_audit&id=' +
                    targetId +
                    '&name=' +
                    encodeURIComponent(reg.name || '未知')
                }
              },
              {
                type: 'box',
                layout: 'horizontal',
                spacing: 'sm',
                contents: [
                  {
                    type: 'button',
                    style: 'secondary',
                    height: 'sm',
                    action: {
                      type: 'postback',
                      label: '修改 ✏️',
                      data:
                        'action=edit&id=' +
                        targetId +
                        '&name=' +
                        encodeURIComponent(reg.name || '未知')
                    }
                  },
                  {
                    type: 'button',
                    style: 'secondary',
                    color: '#c0392b',
                    height: 'sm',
                    action: {
                      type: 'postback',
                      label: '刪除 🗑️',
                      data:
                        'action=delete&id=' +
                        targetId +
                        '&name=' +
                        encodeURIComponent(reg.name || '未知')
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    ]
  };
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  });
}

function sendReply(token, text) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var payload = {
    replyToken: token,
    messages: [
      {
        type: 'flex',
        altText: '系統訊息',
        contents: {
          type: 'bubble',
          size: 'micro',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#34495e',
            contents: [
              {
                type: 'text',
                text: '系統通知',
                color: '#ffffff',
                weight: 'bold',
                size: 'sm'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: text,
                size: 'sm',
                wrap: true,
                color: '#2c3e50'
              }
            ]
          }
        }
      }
    ]
  };
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  });
}

/**
 * 帶有取消按鈕的回覆
 */
function sendReplyWithCancel(token, text) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var payload = {
    replyToken: token,
    messages: [
      {
        type: 'flex',
        altText: '修改模式',
        contents: {
          type: 'bubble',
          size: 'micro',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#8e44ad',
            contents: [
              {
                type: 'text',
                text: '修改模式',
                color: '#ffffff',
                weight: 'bold',
                size: 'sm'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [{ type: 'text', text: text, size: 'sm', wrap: true }]
          }
        },
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '❌ 取消修改',
                data: 'action=cancel_edit',
                displayText: '放棄修改'
              }
            }
          ]
        }
      }
    ]
  };
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  });
}

/**
 * 發送刪除確認訊息
 */
function sendDeleteConfirmation(token, id, name) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var payload = {
    replyToken: token,
    messages: [
      {
        type: 'flex',
        altText: '⚠️ 刪除確認',
        contents: {
          type: 'bubble',
          size: 'micro',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#c0392b',
            contents: [
              {
                type: 'text',
                text: '⚠️ 刪除確認',
                color: '#ffffff',
                weight: 'bold',
                size: 'sm'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text:
                  '確定要將「' +
                  decodeURIComponent(name) +
                  '」的報名移至回收桶嗎？',
                size: 'sm',
                wrap: true
              }
            ]
          }
        },
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '🔥 確定刪除',
                data: 'action=confirm_delete&id=' + id + '&name=' + name,
                displayText: '確定刪除'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '🔙 取消',
                data: 'action=cancel_delete',
                displayText: '不刪了'
              }
            }
          ]
        }
      }
    ]
  };
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  });
}
function handlePostback(event) {
  try {
    var data = event.postback.data;
    var params = parseQueryString(data);
    var name = params.name ? decodeURIComponent(params.name) : '此玩家';
    var updateData = {};
    var msg = '';
    var props = PropertiesService.getScriptProperties();

    if (params.action === 'show_details') {
      handleShowDetails(event.replyToken, params.id);
      return;
    }
    if (params.action === 'admin_login') {
      var userId = event.source.userId; // 取得點擊者的唯一 ID
      var separator = ADMIN_WEBSITE_URL.indexOf('?') !== -1 ? '&' : '?';
      var adminUrl = ADMIN_WEBSITE_URL + separator + 'uid=' + userId;

      var loginPayload = {
        to: userId, // <--- 關鍵：改用 Push Message 發送給個人私訊
        messages: [
          {
            type: 'flex',
            altText: '管理者專屬登入連結',
            contents: {
              type: 'bubble',
              size: 'micro',
              header: {
                type: 'box',
                layout: 'vertical',
                backgroundColor: '#2c3e50',
                contents: [
                  {
                    type: 'text',
                    text: '管理者私密登入',
                    color: '#ffffff',
                    weight: 'bold',
                    size: 'sm'
                  }
                ]
              },
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: '此為您的專屬管理連結：',
                    size: 'xs',
                    wrap: true
                  }
                ]
              },
              footer: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'button',
                    style: 'primary',
                    color: '#3498db',
                    height: 'sm',
                    action: { type: 'uri', label: '🚀 一鍵登入', uri: adminUrl }
                  }
                ]
              }
            }
          }
        ]
      };

      // 執行私訊發送 (Push API)
      var pushUrl = 'https://api.line.me/v2/bot/message/push';
      UrlFetchApp.fetch(pushUrl, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
        },
        payload: JSON.stringify(loginPayload)
      });

      // 在原群組/對話框回覆一個微型提示
      var replyPayload = {
        replyToken: event.replyToken,
        messages: [
          {
            type: 'flex',
            altText: '系統通知',
            contents: {
              type: 'bubble',
              size: 'micro',
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: '🔐 登入連結已私訊給您',
                    size: 'xs',
                    color: '#2c3e50',
                    weight: 'bold',
                    align: 'center'
                  }
                ]
              }
            }
          }
        ]
      };
      UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
        },
        payload: JSON.stringify(replyPayload)
      });
      return;
    }
    if (params.action === 'manage_record') {
      sendRecordActionMenu(event.replyToken, params.id, params.name);
      return;
    }
    if (params.action === 'list_page') {
      handleListRegistrations(event.replyToken, params.token);
      return;
    }
    if (params.action === 'recycle_page') {
      handleViewRecycleBin(event.replyToken, params.token);
      return;
    }
    if (params.action === 'show_audit') {
      sendQuickReply(event.replyToken, params.id, name);
      return;
    } else if (params.action === 'show_specific_sessions') {
      sendSpecificSessions(event.replyToken, params.id, params.type, name);
      return;
    } else if (
      params.action === 'update_session' ||
      params.action === 'update_location' ||
      params.action === 'update_payment'
    ) {
      var fieldMap = {
        update_session: 'session',
        update_location: 'pickupLocation',
        update_payment: 'paymentMethod'
      };
      var labelMap = {
        update_session: '場次',
        update_location: '地點',
        update_payment: '支付方式'
      };
      var fName = fieldMap[params.action];
      var fVal = decodeURIComponent(params.val);

      // 獲取舊資料以進行對比
      var oldDoc = getFirebaseDoc('registrations', params.id);
      var oldVal =
        oldDoc && oldDoc.fields[fName]
          ? oldDoc.fields[fName].stringValue
          : '無';

      var upd = {};
      upd[fName] = fVal;
      var success = patchFirebaseDoc('registrations', params.id, upd);
      if (success) {
        addLogToFirebase(
          '修改報名',
          '透過 LINE 修改' +
            labelMap[params.action] +
            '：[' +
            oldVal +
            '] -> [' +
            fVal +
            ']',
          event.source.userId
        );

        // 特殊處理：如果是改為銀行轉帳，接著引導輸入末五碼
        if (fVal.indexOf('銀行') !== -1 || fVal.indexOf('轉帳') !== -1) {
          props.setProperty('EDIT_MODE_' + event.source.userId, 'true');
          props.setProperty('TARGET_ID_' + event.source.userId, params.id);
          props.setProperty('TARGET_FIELD_' + event.source.userId, 'bankLast5');
          sendReplyWithCancel(
            event.replyToken,
            '✅ 支付方式已更新。\n請輸入該筆報名的「銀行末五碼」：'
          );
        } else {
          sendReply(
            event.replyToken,
            '✅ ' + labelMap[params.action] + '修改成功！\n新的內容：' + fVal
          );
        }
      } else {
        sendReply(
          event.replyToken,
          '⚠️ ' + labelMap[params.action] + '修改失敗。'
        );
      }
      return;
    } else if (params.action === 'ask_edit_time') {
      sendTimePickerHint(event.replyToken, params.id, name);
      return;
    } else if (params.action === 'update_time') {
      var selectedTime = event.postback.params.datetime.replace('T', ' ');
      var success = patchFirebaseDoc('registrations', params.id, {
        pickupTime: selectedTime
      });
      if (success) {
        addLogToFirebase(
          '修改報名',
          '透過 LINE 日曆修改時間為：' + selectedTime
        );
        sendReply(
          event.replyToken,
          '✅ 時間修改成功！\n新的預約時間：' + selectedTime
        );
      } else {
        sendReply(event.replyToken, '⚠️ 時間修改失敗。');
      }
      return;
    } else if (params.action === 'cancel_audit') {
      sendReply(event.replyToken, '👌 已取消操作。');
      return;
    } else if (params.action === 'edit') {
      sendEditMenu(event.replyToken, params.id, name);
      return;
    } else if (params.action === 'ask_edit_field') {
      if (params.field === 'session') {
        sendSessionSelection(event.replyToken, params.id, name);
        return;
      }
      if (params.field === 'pickupLocation') {
        sendLocationSelection(event.replyToken, params.id, name);
        return;
      }
      if (params.field === 'paymentMethod') {
        sendPaymentSelection(event.replyToken, params.id, name);
        return;
      }
      var fieldMapNames = {
        name: '姓名',
        phone: '電話',
        email: 'Email',
        quantity: '購買份數',
        players: '遊玩人數',
        notes: '備註'
      };
      var fLabel = fieldMapNames[params.field] || params.field;

      // 進入等待輸入狀態
      props.setProperty('EDIT_MODE_' + event.source.userId, 'true');
      props.setProperty('TARGET_ID_' + event.source.userId, params.id);
      props.setProperty('TARGET_FIELD_' + event.source.userId, params.field);

      // 改用帶有取消按鈕的訊息
      sendReplyWithCancel(
        event.replyToken,
        '【修改模式】\n請輸入新的「' + fLabel + '」內容：'
      );
      return;
    } else if (params.action === 'cancel_edit') {
      props.deleteProperty('EDIT_MODE_' + event.source.userId);
      sendReply(event.replyToken, '👌 已取消修改模式。');
      return;
    } else if (params.action === 'delete') {
      sendDeleteConfirmation(event.replyToken, params.id, name);
      return;
    } else if (params.action === 'confirm_delete') {
      var docData = getFirebaseDoc('registrations', params.id);
      if (!docData) {
        sendReply(event.replyToken, '⚠️ 刪除失敗：找不到該筆資料。');
        return;
      }

      // 1. 寫入回收桶
      var recycleUrl =
        'https://firestore.googleapis.com/v1/projects/' +
        FIREBASE_PROJECT_ID +
        '/databases/(default)/documents/registrations_deleted?documentId=' +
        params.id;
      var token = getAccessToken_();
      UrlFetchApp.fetch(recycleUrl, {
        method: 'post',
        contentType: 'application/json',
        headers: { Authorization: 'Bearer ' + token },
        payload: JSON.stringify({ fields: docData.fields }),
        muteHttpExceptions: true
      });

      // 2. 從原集合刪除
      var deleteUrl =
        'https://firestore.googleapis.com/v1/projects/' +
        FIREBASE_PROJECT_ID +
        '/databases/(default)/documents/registrations/' +
        params.id;
      var res = UrlFetchApp.fetch(deleteUrl, {
        method: 'delete',
        headers: { Authorization: 'Bearer ' + token },
        muteHttpExceptions: true
      });

      if (res.getResponseCode() === 200) {
        addLogToFirebase(
          '刪除報名',
          '透過 LINE 將「' + name + '」的報名移至回收桶'
        );
        sendReply(
          event.replyToken,
          '🗑️ 已將「' + name + '」的報名移至回收桶。'
        );
      } else {
        sendReply(event.replyToken, '⚠️ 刪除失敗：無法移除原始文件。');
      }
      return;
    } else if (params.action === 'cancel_delete') {
      sendReply(event.replyToken, '👌 已取消刪除操作。');
      return;
    } else if (params.action === 'restore') {
      var success = handleRestoreRegistration(params.id, name);
      if (success) {
        sendReply(event.replyToken, '✅ 已將「' + name + '」的報名成功還原。');
      } else {
        sendReply(event.replyToken, '⚠️ 還原失敗。');
      }
      return;
    } else if (params.action === 'show_deleted_details') {
      handleShowDeletedDetails(event.replyToken, params.id);
      return;
    } else if (params.action === 'approve' || params.action === 'paid') {
      updateData = { status: '通過' };
      msg = '✅ 已核准 ' + name + ' 的報名';
    } else if (params.action === 'reject') {
      updateData = { status: '未通過' };
      msg = '❌ 已拒絕 ' + name + ' 的報名';
    }

    if (!params.id) {
      sendReply(event.replyToken, '⚠️ 錯誤：找不到 ID');
      return;
    }

    var doc = getFirebaseDoc('registrations', params.id);
    var oldStatus =
      doc && doc.fields && doc.fields.status
        ? doc.fields.status.stringValue
        : '未知';
    var wasApproved = oldStatus === '通過';

    var success = patchFirebaseDoc('registrations', params.id, updateData);
    if (success) {
      // 詳細日誌紀錄：狀態變更對比
      addLogToFirebase(
        '審核付款',
        '透過 LINE 審核「' +
          name +
          '」：[' +
          oldStatus +
          '] -> [' +
          updateData.status +
          ']',
        event.source.userId
      );

      var emailStatus = '';
      if (updateData.status === '通過') {
        if (wasApproved) {
          emailStatus = '\n📧 (先前已寄過，略過重複發信)';
        } else {
          emailStatus = '\n📧 ' + sendEmailViaJS(params.id, name);
        }
      }
      sendReply(event.replyToken, msg + emailStatus);
    } else {
      sendReply(event.replyToken, '⚠️ Firebase 更新失敗。');
    }
  } catch (err) {
    sendReply(event.replyToken, '⚠️ 系統執行報錯：' + err.toString());
  }
}

/**
 * 發送資料管理中繼選單 (卡片化)
 */
function sendRecordActionMenu(replyToken, id, name) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var payload = {
    replyToken: replyToken,
    messages: [
      {
        type: 'flex',
        altText: '資料管理選項',
        contents: {
          type: 'bubble',
          size: 'micro',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#8e44ad',
            contents: [
              {
                type: 'text',
                text: '管理動作',
                color: '#ffffff',
                weight: 'bold',
                size: 'sm'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '對象：' + decodeURIComponent(name),
                size: 'xs',
                wrap: true
              }
            ]
          }
        },
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '🔍 審核資料',
                data: 'action=show_audit&id=' + id + '&name=' + name,
                displayText: '執行：審核資料'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '✏️ 修改內容',
                data: 'action=edit&id=' + id + '&name=' + name,
                displayText: '執行：修改內容'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '🗑️ 刪除報名',
                data: 'action=delete&id=' + id + '&name=' + name,
                displayText: '執行：刪除報名'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '👋 取消',
                data: 'action=cancel_audit',
                displayText: '已取消操作'
              }
            }
          ]
        }
      }
    ]
  };
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  });
}

/**
 * 發送快速回覆 (彈窗感按鈕)
 */
function sendQuickReply(replyToken, id, name) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var payload = {
    replyToken: replyToken,
    messages: [
      {
        type: 'flex',
        altText: '請選擇審核動作',
        contents: {
          type: 'bubble',
          size: 'micro',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#2c3e50',
            contents: [
              {
                type: 'text',
                text: '審核操作',
                color: '#ffffff',
                weight: 'bold',
                size: 'sm'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '對象：' + decodeURIComponent(name),
                size: 'xs',
                color: '#7f8c8d',
                wrap: true
              },
              {
                type: 'text',
                text: '請選擇下方動作：',
                size: 'xs',
                margin: 'sm',
                weight: 'bold'
              }
            ]
          }
        },
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '✅ 核准通過',
                data:
                  'action=paid&id=' + id + '&name=' + encodeURIComponent(name),
                displayText: '正在執行：核准通過'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '❌ 拒絕申請',
                data:
                  'action=reject&id=' +
                  id +
                  '&name=' +
                  encodeURIComponent(name),
                displayText: '正在執行：拒絕申請'
              }
            },

            {
              type: 'action',
              action: {
                type: 'postback',
                label: '👋 暫時取消',
                data: 'action=cancel_audit',
                displayText: '已取消操作'
              }
            }
          ]
        }
      }
    ]
  };
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  });
} /**
 * 透過 EmailJS REST API 寄信 (帶有狀態回傳)
 */
function sendEmailViaJS(id, name) {
  try {
    var doc = getFirebaseDoc('registrations', id);
    if (!doc) return '抓不到資料庫紀錄';
    if (!doc.fields.email) return '資料中缺少 Email 欄位';

    var f = doc.fields;
    var toEmail = f.email.stringValue;

    // 格式化電話：將 +886 換成 0
    var rawPhone = f.phone ? f.phone.stringValue : '';
    var displayPhone = rawPhone.replace('+886', '0');

    var payload = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY,
      template_params: {
        to_email: toEmail,
        name: name,
        phone: displayPhone,
        session: f.session ? f.session.stringValue : '',
        pickupTime: f.pickupTime ? f.pickupTime.stringValue : '',
        players: f.players ? f.players.stringValue : '1',
        quantity: f.quantity ? f.quantity.stringValue : '1',
        amount: f.totalAmount
          ? f.totalAmount.doubleValue || f.totalAmount.integerValue || 0
          : 0,
        pickupLocation: f.pickupLocation
          ? f.pickupLocation.stringValue
          : '新港文教基金會'
      }
    };

    var res = UrlFetchApp.fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    return res.getResponseCode() === 200
      ? '郵件已寄出'
      : 'EmailJS 報錯: ' + res.getContentText();
  } catch (e) {
    return '發信過程崩潰: ' + e.toString();
  }
}
/**
 * 根據 LINE ID 抓取管理員暱稱
 */
function getAdminNameByLineId(userId) {
  try {
    var url = (
      'https://firestore.googleapis.com/v1/projects/' +
      FIREBASE_PROJECT_ID +
      '/databases/(default)/documents/admins'
    ).replace(/\s/g, '');
    var token = getAccessToken_();
    var res = UrlFetchApp.fetch(url, {
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true
    });

    if (res.getResponseCode() === 200) {
      var data = JSON.parse(res.getContentText());
      if (data.documents) {
        for (var i = 0; i < data.documents.length; i++) {
          var f = data.documents[i].fields;
          if (f.lineUid && f.lineUid.stringValue === userId) {
            return f.nickname
              ? f.nickname.stringValue
              : f.username
                ? f.username.stringValue
                : '未知管理者';
          }
        }
      }
    }
    return 'LINE管理員';
  } catch (e) {
    return 'LINE管理員';
  }
}

/**
 * 模擬後台 addLog 功能 (增加管理員識別)
 */
function addLogToFirebase(type, details, userId) {
  try {
    var adminName = userId ? getAdminNameByLineId(userId) : '系統';
    var now = new Date();

    // 強制格式化為 YYYY-MM-DD HH:mm:ss 確保與網頁版一致
    var timestampStr = Utilities.formatDate(
      now,
      'Asia/Taipei',
      'yyyy-MM-dd HH:mm:ss'
    );

    var baseUrl =
      'https://firestore.googleapis.com/v1/projects/' +
      FIREBASE_PROJECT_ID +
      '/databases/(default)/documents/logs';
    var url = baseUrl.replace(/\s/g, '');

    var fields = {
      type: { stringValue: type },
      details: { stringValue: '[' + adminName + '] ' + details },
      timestamp: { stringValue: timestampStr },
      operator: { stringValue: adminName } // 新增操作者欄位
    };

    var token = getAccessToken_();
    UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + token },
      payload: JSON.stringify({ fields: fields }),
      muteHttpExceptions: true
    });
  } catch (e) {
    console.error('日誌寫入失敗: ' + e.toString());
  }
}

function patchFirebaseDoc(collection, id, data) {
  var cleanId = (id || '').toString().trim();
  var cleanCol = (collection || '').toString().trim();

  if (!cleanId || cleanId === 'null' || cleanId === 'undefined') {
    console.error('錯誤：嘗試 Patch 但缺少或無效的文件 ID (id=' + id + ')');
    return false;
  }

  var validKeys = Object.keys(data).filter(function (k) {
    return k && k.length > 0;
  });
  if (validKeys.length === 0) return false;

  // 建立基礎 URL 並強制移除所有空格
  var baseUrl =
    'https://firestore.googleapis.com/v1/projects/' +
    FIREBASE_PROJECT_ID +
    '/databases/(default)/documents';
  var url = (
    baseUrl +
    '/' +
    cleanCol +
    '/' +
    cleanId +
    '?updateMask.fieldPaths=' +
    validKeys.join('&updateMask.fieldPaths=')
  ).replace(/\s/g, '');

  var fields = {};
  for (var i = 0; i < validKeys.length; i++) {
    var key = validKeys[i];
    if (typeof data[key] === 'boolean') {
      fields[key] = { booleanValue: data[key] };
    } else {
      fields[key] = { stringValue: String(data[key]) };
    }
  }

  var token = getAccessToken_();
  var res = UrlFetchApp.fetch(url, {
    method: 'patch',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify({ fields: fields }),
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  if (code !== 200) {
    console.error('Firestore Patch 失敗: ' + res.getContentText());
    throw new Error(
      'Firestore Patch 失敗 (' + code + ')：' + res.getContentText()
    );
  }
  return true;
}

function getFirebaseDoc(collection, id) {
  var cleanId = (id || '').toString().trim();
  var cleanCol = (collection || '').toString().trim();

  if (!cleanId || cleanId === 'null' || cleanId === 'undefined') return null;

  var baseUrl =
    'https://firestore.googleapis.com/v1/projects/' +
    FIREBASE_PROJECT_ID +
    '/databases/(default)/documents';
  var url = (baseUrl + '/' + cleanCol + '/' + cleanId).replace(/\s/g, '');

  var token = getAccessToken_();
  var res = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true
  });
  if (res.getResponseCode() === 200) return JSON.parse(res.getContentText());
  return null;
}

function getAccessToken_() {
  try {
    var header = JSON.stringify({ alg: 'RS256', typ: 'JWT' });
    var now = Math.floor(Date.now() / 1000);
    var claim = JSON.stringify({
      iss: FIREBASE_CLIENT_EMAIL,
      scope: 'https://www.googleapis.com/auth/datastore',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    });
    var signatureInput =
      Utilities.base64EncodeWebSafe(header) +
      '.' +
      Utilities.base64EncodeWebSafe(claim);
    var signature = Utilities.computeRsaSha256Signature(
      signatureInput,
      FIREBASE_PRIVATE_KEY
    );
    var jwt = signatureInput + '.' + Utilities.base64EncodeWebSafe(signature);
    var res = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', {
      method: 'post',
      payload: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      },
      muteHttpExceptions: true
    });
    var resJson = JSON.parse(res.getContentText());
    if (!resJson.access_token) {
      throw new Error('取得 Token 失敗: ' + res.getContentText());
    }
    return resJson.access_token;
  } catch (e) {
    throw new Error('OAuth 流程異常: ' + e.toString());
  }
}

/**
 * 簡易的 Firestore 搜尋 (掃描法)
 */
function runFirebaseQuery(collection, keyword) {
  var url =
    'https://firestore.googleapis.com/v1/projects/' +
    FIREBASE_PROJECT_ID +
    '/databases/(default)/documents/' +
    collection +
    '?pageSize=100';
  var token = getAccessToken_();
  var res = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true
  });
  var found = [];

  if (res.getResponseCode() === 200) {
    var data = JSON.parse(res.getContentText());
    if (data.documents) {
      data.documents.forEach(function (doc) {
        var f = doc.fields;
        var name = f.name ? f.name.stringValue : '';
        var phone = f.phone ? f.phone.stringValue : '';
        if (name.indexOf(keyword) !== -1 || phone.indexOf(keyword) !== -1) {
          found.push(doc);
        }
      });
    }
  }
  return found;
}

function firestoreToObj(doc) {
  var obj = {};
  if (!doc || !doc.fields) return obj;
  var fields = doc.fields;
  for (var key in fields) {
    var val = fields[key];
    if (val.stringValue !== undefined) obj[key] = val.stringValue;
    else if (val.integerValue !== undefined)
      obj[key] = String(val.integerValue);
    else if (val.doubleValue !== undefined) obj[key] = String(val.doubleValue);
    else if (val.booleanValue !== undefined) obj[key] = val.booleanValue;
  }
  return obj;
}

function handleViewRecycleBin(replyToken, pageToken) {
  try {
    var baseUrl =
      'https://firestore.googleapis.com/v1/projects/' +
      FIREBASE_PROJECT_ID +
      '/databases/(default)/documents/registrations_deleted';
    // 每次抓 9 筆，保留一個位置給「下一頁」按鈕
    var url =
      baseUrl + '?pageSize=9' + (pageToken ? '&pageToken=' + pageToken : '');
    var token = getAccessToken_();
    var res = UrlFetchApp.fetch(url, {
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true
    });

    if (res.getResponseCode() !== 200) {
      sendReply(replyToken, '♻️ 目前無法讀取回收桶。');
      return;
    }

    var data = JSON.parse(res.getContentText());
    if (!data.documents || data.documents.length === 0) {
      sendReply(replyToken, '♻️ 回收桶目前是空的。');
      return;
    }

    var bubbleList = data.documents.map(function (doc) {
      var id = doc.name.split('/').pop();
      var reg = firestoreToObj(doc);
      var name = String(reg.name || '未知');
      var phone = String(reg.phone || '無').replace('+886', '0');

      var rows = [
        { type: 'text', text: '📞 電話: ' + phone, size: 'xs' },
        {
          type: 'text',
          text: '📧 Email: ' + String(reg.email || '無'),
          size: 'xs'
        },
        {
          type: 'text',
          text:
            '📦 份數: ' +
            String(reg.quantity || '1') +
            ' | 👥 人數: ' +
            String(reg.players || '1'),
          size: 'xs'
        },
        {
          type: 'text',
          text: '📅 場次: ' + String(reg.session || '無'),
          size: 'xs'
        },
        {
          type: 'text',
          text: '🕒 時間: ' + String(reg.pickupTime || '無'),
          size: 'xs'
        },
        {
          type: 'text',
          text: '📍 地點: ' + String(reg.pickupLocation || '未指定'),
          size: 'xs',
          color: '#2980b9'
        },
        {
          type: 'text',
          text: '💳 支付: ' + String(reg.paymentMethod || '未指定'),
          size: 'xs'
        }
      ];

      if (reg.bankLast5 && reg.bankLast5 !== '無') {
        rows.push({
          type: 'text',
          text: '🏦 銀行末5碼: ' + String(reg.bankLast5),
          size: 'xs',
          color: '#8e44ad',
          weight: 'bold'
        });
      }
      if (reg.notes && reg.notes !== '無') {
        rows.push({
          type: 'text',
          text: '📝 備註: ' + String(reg.notes),
          size: 'xs',
          wrap: true,
          color: '#7f8c8d'
        });
      }
      rows.push({
        type: 'text',
        text: '💰 總計: NT$ ' + String(reg.totalAmount || reg.amount || '0'),
        weight: 'bold',
        size: 'sm',
        color: '#c0392b',
        margin: 'sm'
      });

      return {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#95a5a6',
          contents: [
            {
              type: 'text',
              text: '♻️ 已刪除報名資料',
              color: '#ffffff',
              weight: 'bold',
              size: 'sm'
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'xs',
          contents: [
            { type: 'text', text: name, size: 'lg', weight: 'bold' },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'md',
              spacing: 'xs',
              contents: rows
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#3498db',
              height: 'sm',
              action: {
                type: 'postback',
                label: '還原 ↩️',
                data:
                  'action=restore&id=' +
                  id +
                  '&name=' +
                  encodeURIComponent(name)
              }
            }
          ]
        }
      };
    });

    // 如果還有下一頁或目前不是第一頁，加入導覽按鈕卡片
    if (data.nextPageToken || pageToken) {
      var footerContents = [];
      if (data.nextPageToken) {
        footerContents.push({
          type: 'button',
          style: 'primary',
          color: '#8e44ad',
          action: {
            type: 'postback',
            label: '下一頁 ➡️',
            data: 'action=recycle_page&token=' + data.nextPageToken,
            displayText: '載入中...'
          }
        });
      }
      if (pageToken) {
        footerContents.push({
          type: 'button',
          style: 'secondary',
          margin: 'sm',
          action: {
            type: 'postback',
            label: '⬅️ 回到第一頁',
            data: 'action=recycle_page&token=',
            displayText: '正在回到第一頁...'
          }
        });
      }

      bubbleList.push({
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#8e44ad',
          contents: [
            {
              type: 'text',
              text: '回收桶更多資料',
              color: '#ffffff',
              weight: 'bold',
              size: 'sm'
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '點擊下方按鈕進行導覽',
              size: 'sm',
              wrap: true
            }
          ]
        },
        footer: { type: 'box', layout: 'vertical', contents: footerContents }
      });
    }

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
      },
      payload: JSON.stringify({
        replyToken: replyToken,
        messages: [
          {
            type: 'flex',
            altText: '♻️ 回收桶清單',
            contents: { type: 'carousel', contents: bubbleList }
          }
        ]
      })
    });
  } catch (e) {
    sendReply(replyToken, '❌ 報錯：' + e.toString());
  }
}

function parseQueryString(str) {
  var acc = {};
  str.split('&').forEach(function (part) {
    var item = part.split('=');
    if (item.length === 2) acc[item[0]] = item[1];
  });
  return acc;
}

function resetTodayStatus() {
  PropertiesService.getScriptProperties().deleteProperty('LAST_EATEN_DATE');
}

/**
 * 發送儀表板主選單 (卡片化)
 */
function sendManagementMenu(replyToken, text) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var payload = {
    replyToken: replyToken,
    messages: [
      {
        type: 'flex',
        altText: '管理主選單',
        contents: {
          type: 'bubble',
          size: 'micro',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#2c3e50',
            contents: [
              {
                type: 'text',
                text: '控制台',
                color: '#ffffff',
                weight: 'bold',
                size: 'sm'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '請選擇操作項目：',
                size: 'xs',
                weight: 'bold'
              }
            ]
          }
        },
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'message',
                label: '📋 報名名單',
                text: '報名名單'
              }
            },
            {
              type: 'action',
              action: { type: 'message', label: '🔍 查詢報名', text: '查詢 ' }
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: '♻️ 查看回收桶',
                text: '查看回收桶'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '🌐 進入管理網站',
                data: 'action=admin_login',
                displayText: '正在產生管理連結...'
              }
            }
          ]
        }
      }
    ]
  };
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  });
}

/**
 * 列出報名名單 (支援分頁模式以實現全部顯示)
 */
function handleListRegistrations(replyToken, pageToken) {
  try {
    var baseUrl =
      'https://firestore.googleapis.com/v1/projects/' +
      FIREBASE_PROJECT_ID +
      '/databases/(default)/documents/registrations';
    // 每次抓 9 筆，保留一個位置給「下一頁」按鈕
    var url =
      baseUrl + '?pageSize=9' + (pageToken ? '&pageToken=' + pageToken : '');
    var token = getAccessToken_();
    var res = UrlFetchApp.fetch(url, {
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true
    });

    if (res.getResponseCode() !== 200) {
      sendReply(
        replyToken,
        '⚠️ 資料庫讀取失敗 (' + res.getResponseCode() + ')'
      );
      return;
    }

    var data = JSON.parse(res.getContentText());
    if (!data.documents || data.documents.length === 0) {
      sendReply(replyToken, '📭 目前已無更多報名資料。');
      return;
    }

    var bubbleList = data.documents.map(function (doc) {
      var id = doc.name.split('/').pop();
      var reg = firestoreToObj(doc);
      var name = String(reg.name || '未知');
      var phone = String(reg.phone || '無').replace('+886', '0');

      var rows = [
        { type: 'text', text: '📞 電話: ' + phone, size: 'xs' },
        {
          type: 'text',
          text: '📧 Email: ' + String(reg.email || '無'),
          size: 'xs'
        },
        {
          type: 'text',
          text:
            '📦 份數: ' +
            String(reg.quantity || '1') +
            ' | 👥 人數: ' +
            String(reg.players || '1'),
          size: 'xs'
        },
        {
          type: 'text',
          text: '📅 場次: ' + String(reg.session || '無'),
          size: 'xs'
        },
        {
          type: 'text',
          text: '🕒 時間: ' + String(reg.pickupTime || '無'),
          size: 'xs'
        },
        {
          type: 'text',
          text: '📍 地點: ' + String(reg.pickupLocation || '未指定'),
          size: 'xs',
          color: '#2980b9'
        }
      ];

      if (reg.bankLast5 && reg.bankLast5 !== '無') {
        rows.push({
          type: 'text',
          text: '🏦 銀行末5碼: ' + String(reg.bankLast5),
          size: 'xs',
          color: '#8e44ad',
          weight: 'bold'
        });
      }
      if (reg.notes && reg.notes !== '無') {
        rows.push({
          type: 'text',
          text: '📝 備註: ' + String(reg.notes),
          size: 'xs',
          wrap: true,
          color: '#7f8c8d'
        });
      }
      rows.push({
        type: 'text',
        text: '💰 金額: NT$ ' + String(reg.totalAmount || reg.amount || '0'),
        weight: 'bold',
        size: 'sm',
        color: '#c0392b',
        margin: 'sm'
      });

      return {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#2c3e50',
          contents: [
            {
              type: 'text',
              text: '📋 報名詳情',
              color: '#ffffff',
              weight: 'bold',
              size: 'sm'
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'xs',
          contents: [
            { type: 'text', text: name, size: 'lg', weight: 'bold' },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'md',
              spacing: 'xs',
              contents: rows
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#f1c40f',
              height: 'sm',
              action: {
                type: 'postback',
                label: '管理此筆 🔍',
                data:
                  'action=manage_record&id=' +
                  id +
                  '&name=' +
                  encodeURIComponent(name)
              }
            }
          ]
        }
      };
    });

    // 如果還有下一頁或目前不是第一頁，加入導覽按鈕卡片
    if (data.nextPageToken || pageToken) {
      var footerContents = [];
      if (data.nextPageToken) {
        footerContents.push({
          type: 'button',
          style: 'primary',
          color: '#8e44ad',
          action: {
            type: 'postback',
            label: '下一頁 ➡️',
            data: 'action=list_page&token=' + data.nextPageToken,
            displayText: '正在載入下一頁...'
          }
        });
      }
      if (pageToken) {
        footerContents.push({
          type: 'button',
          style: 'secondary',
          margin: 'sm',
          action: {
            type: 'postback',
            label: '⬅️ 回到第一頁',
            data: 'action=list_page&token=',
            displayText: '正在回到第一頁...'
          }
        });
      }

      bubbleList.push({
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#8e44ad',
          contents: [
            {
              type: 'text',
              text: '更多資料',
              color: '#ffffff',
              weight: 'bold',
              size: 'sm'
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '點擊下方按鈕進行導覽',
              size: 'sm',
              wrap: true
            }
          ]
        },
        footer: { type: 'box', layout: 'vertical', contents: footerContents }
      });
    }

    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
      },
      payload: JSON.stringify({
        replyToken: replyToken,
        messages: [
          {
            type: 'flex',
            altText: '📋 報名清單',
            contents: { type: 'carousel', contents: bubbleList }
          }
        ]
      })
    });
  } catch (e) {
    sendReply(replyToken, '❌ 名單功能崩潰：' + e.toString());
  }
}

/**
 * 發送場次類別選擇選單 (一級分類)
 */
function sendSessionSelection(replyToken, id, name) {
  var payload = {
    replyToken: replyToken,
    messages: [
      {
        type: 'flex',
        altText: '請選擇預約類別',
        contents: {
          type: 'bubble',
          size: 'micro',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#8e44ad',
            contents: [
              {
                type: 'text',
                text: '預約類別',
                color: '#ffffff',
                weight: 'bold',
                size: 'sm'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '請選擇場次類型：',
                size: 'xs',
                weight: 'bold'
              }
            ]
          }
        },
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '📅 一般預約',
                data:
                  'action=show_specific_sessions&type=general&id=' +
                  id +
                  '&name=' +
                  name,
                displayText: '我要修改為一般預約場次'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '✨ 特別預約',
                data:
                  'action=show_specific_sessions&type=special&id=' +
                  id +
                  '&name=' +
                  name,
                displayText: '我要修改為特別預約場次'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '❌ 取消',
                data: 'action=cancel_audit',
                displayText: '不改了'
              }
            }
          ]
        }
      }
    ]
  };
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  });
}

/**
 * 根據分類抓取並發送具體場次選單 (二級名單)
 */
function sendSpecificSessions(replyToken, id, category, name) {
  var collectionName = category === 'special' ? 'special_sessions' : 'sessions';
  var sessions = fetchSessionsFromDB(collectionName);

  if (sessions.length === 0) {
    sendReply(replyToken, '⚠️ 錯誤：找不到該類別的場次設定。');
    return;
  }

  var items = sessions.map(function (sName) {
    return {
      type: 'action',
      action: {
        type: 'postback',
        label: sName.substring(0, 20),
        data:
          'action=update_session&id=' +
          id +
          '&val=' +
          encodeURIComponent(sName),
        displayText: '選擇場次：' + sName
      }
    };
  });
  items.push({
    type: 'action',
    action: {
      type: 'postback',
      label: '❌ 取消',
      data: 'action=cancel_audit',
      displayText: '不改了'
    }
  });

  var payload = {
    replyToken: replyToken,
    messages: [
      {
        type: 'flex',
        altText: '請選擇具體場次',
        contents: {
          type: 'bubble',
          size: 'micro',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#8e44ad',
            contents: [
              {
                type: 'text',
                text: category === 'special' ? '特別預約' : '一般預約',
                color: '#ffffff',
                weight: 'bold',
                size: 'sm'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '請由下方按鈕選取：',
                size: 'xs',
                weight: 'bold'
              }
            ]
          }
        },
        quickReply: { items: items.slice(0, 13) }
      }
    ]
  };
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  });
}

function fetchSessionsFromDB(collectionName) {
  var url =
    'https://firestore.googleapis.com/v1/projects/' +
    FIREBASE_PROJECT_ID +
    '/databases/(default)/documents/' +
    collectionName;
  var token = getAccessToken_();
  var res = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true
  });
  var names = [];
  if (res.getResponseCode() === 200) {
    var data = JSON.parse(res.getContentText());
    if (data.documents) {
      data.documents.forEach(function (doc) {
        if (doc.fields && doc.fields.name)
          names.push(doc.fields.name.stringValue);
      });
    }
  }
  return names;
}
/**
 * 從資料庫抓取所有「支付方式」設定 (修正路徑版)
 */
function getAllPaymentMethods() {
  var url =
    'https://firestore.googleapis.com/v1/projects/' +
    FIREBASE_PROJECT_ID +
    '/databases/(default)/documents/config/payments';
  var token = getAccessToken_();
  var res = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + token },
    muteHttpExceptions: true
  });
  var names = [];
  if (res.getResponseCode() === 200) {
    var data = JSON.parse(res.getContentText());
    if (data.fields && data.fields.methods && data.fields.methods.arrayValue) {
      var values = data.fields.methods.arrayValue.values;
      values.forEach(function (v) {
        if (v.mapValue && v.mapValue.fields && v.mapValue.fields.name) {
          names.push(v.mapValue.fields.name.stringValue);
        }
      });
    }
  }
  return names;
}

/**
 * 從資料庫抓取所有「報到地點」設定
 */
function getAllLocations() {
  // 目前固定使用的兩處地點
  var names = ['新港文教基金會(閱讀館)', '培桂堂(建議選此處，此處為解謎起點)'];
  return names;
}

/**
 * 發送地點選擇選單 (卡片化)
 */
function sendLocationSelection(replyToken, id) {
  var locations = getAllLocations();
  if (locations.length === 0) {
    sendReply(replyToken, '⚠️ 錯誤：找不到報到地點設定。');
    return;
  }
  var items = locations.map(function (name) {
    return {
      type: 'action',
      action: {
        type: 'postback',
        label: name.substring(0, 20),
        data:
          'action=update_location&id=' +
          id +
          '&val=' +
          encodeURIComponent(name),
        displayText: '選擇地點：' + name
      }
    };
  });
  items.push({
    type: 'action',
    action: {
      type: 'postback',
      label: '❌ 取消',
      data: 'action=cancel_audit',
      displayText: '不改了'
    }
  });

  var payload = {
    replyToken: replyToken,
    messages: [
      {
        type: 'flex',
        altText: '請選擇報到地點',
        contents: {
          type: 'bubble',
          size: 'micro',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#8e44ad',
            contents: [
              {
                type: 'text',
                text: '修改地點',
                color: '#ffffff',
                weight: 'bold',
                size: 'sm'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '請選擇新的報到地點：',
                size: 'xs',
                weight: 'bold'
              }
            ]
          }
        },
        quickReply: { items: items.slice(0, 13) }
      }
    ]
  };
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  });
}

/**
 * 發送支付方式選單 (卡片化)
 */
function sendPaymentSelection(replyToken, id) {
  var methods = getAllPaymentMethods();
  if (methods.length === 0) {
    sendReply(replyToken, '⚠️ 錯誤：找不到支付方式設定。');
    return;
  }
  var items = methods.map(function (name) {
    return {
      type: 'action',
      action: {
        type: 'postback',
        label: name.substring(0, 20),
        data:
          'action=update_payment&id=' + id + '&val=' + encodeURIComponent(name),
        displayText: '選擇支付：' + name
      }
    };
  });
  items.push({
    type: 'action',
    action: {
      type: 'postback',
      label: '❌ 取消',
      data: 'action=cancel_audit',
      displayText: '不改了'
    }
  });

  var payload = {
    replyToken: replyToken,
    messages: [
      {
        type: 'flex',
        altText: '請選擇支付方式',
        contents: {
          type: 'bubble',
          size: 'micro',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#8e44ad',
            contents: [
              {
                type: 'text',
                text: '支付方式',
                color: '#ffffff',
                weight: 'bold',
                size: 'sm'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '請選擇新的支付方式：',
                size: 'xs',
                weight: 'bold'
              }
            ]
          }
        },
        quickReply: { items: items.slice(0, 13) }
      }
    ]
  };
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  });
}

/**
 * 發送開啟日曆的提示與按鈕
 */
function sendTimePickerHint(replyToken, id, name) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var payload = {
    replyToken: replyToken,
    messages: [
      {
        type: 'flex',
        altText: '請選擇預約時間',
        contents: {
          type: 'bubble',
          size: 'micro',
          header: {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#8e44ad',
            contents: [
              {
                type: 'text',
                text: '時間修改',
                color: '#ffffff',
                weight: 'bold',
                size: 'sm'
              }
            ]
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: '對象：' + decodeURIComponent(name),
                size: 'xs',
                color: '#7f8c8d',
                wrap: true
              },
              {
                type: 'text',
                text: '請點擊下方按鈕開啟日曆：',
                size: 'xs',
                margin: 'sm',
                weight: 'bold'
              }
            ]
          }
        },
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'datetimepicker',
                label: '📅 開啟日曆選取',
                data: 'action=update_time&id=' + id,
                mode: 'datetime',
                initial: '2026-04-23T11:00'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '❌ 取消',
                data: 'action=cancel_audit',
                displayText: '不改了'
              }
            }
          ]
        }
      }
    ]
  };
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  });
}

/**
 * 還原已刪除的報名資料 (從 registrations_deleted 搬回 registrations)
 */
function handleRestoreRegistration(id, name) {
  try {
    var token = getAccessToken_();
    var doc = getFirebaseDoc('registrations_deleted', id);
    if (!doc) return false;

    var restoreUrl =
      'https://firestore.googleapis.com/v1/projects/' +
      FIREBASE_PROJECT_ID +
      '/databases/(default)/documents/registrations?documentId=' +
      id;
    var resAdd = UrlFetchApp.fetch(restoreUrl, {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + token },
      payload: JSON.stringify({ fields: doc.fields }),
      muteHttpExceptions: true
    });

    if (resAdd.getResponseCode() !== 200) return false;

    var deleteUrl =
      'https://firestore.googleapis.com/v1/projects/' +
      FIREBASE_PROJECT_ID +
      '/databases/(default)/documents/registrations_deleted/' +
      id;
    UrlFetchApp.fetch(deleteUrl, {
      method: 'delete',
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true
    });

    addLogToFirebase('還原報名', '將「' + name + '」從回收桶還原');
    return true;
  } catch (e) {
    console.error('還原失敗: ' + e.toString());
    return false;
  }
}

/**
 * 顯示已刪除資料的詳細卡片 (從回收桶查看)
 */
function handleShowDeletedDetails(replyToken, id) {
  try {
    var doc = getFirebaseDoc('registrations_deleted', id);
    if (!doc) {
      sendReply(replyToken, '⚠️ 找不到該筆資料。');
      return;
    }
    var reg = firestoreToObj(doc);
    var displayPhone = (reg.phone || '無').replace('+886', '0');

    var contentsList = [
      { type: 'text', text: '📞 電話: ' + displayPhone, size: 'sm' },
      { type: 'text', text: '📧 Email: ' + (reg.email || '無'), size: 'sm' },
      {
        type: 'text',
        text: '📦 份數: ' + (reg.quantity || '1') + ' 份',
        size: 'sm'
      },
      { type: 'text', text: '📅 場次: ' + (reg.session || '無'), size: 'sm' },
      {
        type: 'text',
        text: '🕒 時間: ' + (reg.pickupTime || '無'),
        size: 'sm'
      },
      {
        type: 'text',
        text: '📍 地點: ' + (reg.pickupLocation || '未指定'),
        size: 'sm',
        color: '#2980b9'
      }
    ];

    if (reg.bankLast5 && reg.bankLast5 !== '無') {
      contentsList.push({
        type: 'text',
        text: '🏦 銀行末5碼: ' + reg.bankLast5,
        size: 'sm',
        color: '#8e44ad',
        weight: 'bold'
      });
    }

    var payload = {
      replyToken: replyToken,
      messages: [
        {
          type: 'flex',
          altText: '♻️ 已刪除資料詳情',
          contents: {
            type: 'bubble',
            header: {
              type: 'box',
              layout: 'vertical',
              backgroundColor: '#95a5a6',
              contents: [
                {
                  type: 'text',
                  text: '♻️ 已刪除資料詳情',
                  weight: 'bold',
                  color: '#ffffff'
                }
              ]
            },
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: reg.name || '未知',
                  size: 'xl',
                  weight: 'bold'
                },
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'md',
                  spacing: 'sm',
                  contents: contentsList
                }
              ]
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'button',
                  style: 'primary',
                  color: '#3498db',
                  height: 'sm',
                  action: {
                    type: 'postback',
                    label: '還原此筆 ↩️',
                    data:
                      'action=restore&id=' +
                      id +
                      '&name=' +
                      encodeURIComponent(reg.name || '未知')
                  }
                }
              ]
            }
          }
        }
      ]
    };
    UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
      },
      payload: JSON.stringify(payload)
    });
  } catch (e) {
    sendReply(replyToken, '❌ 讀取失敗：' + e.toString());
  }
}
/**
 * ==========================================
 *           圖文選單 (Rich Menu) 管理工具
 * ==========================================
 *
 * 使用說明：
 * 1. 在下方 RICH_MENU_IMAGE_URL 填入您的圖片網址 (2500x1686px)
 * 2. 在 GAS 編輯器上方選擇「setupRichMenu」並點擊「執行」
 * 3. 重新開啟 LINE 即可看到選單
 */

// 正式版圖文選單底圖 (託管於 GitHub Pages)
var RICH_MENU_IMAGE_URL =
  'https://chiayihkfce.github.io/xingang-bagua-maze/admin-rich-menu.png';

function setupRichMenu() {
  try {
    // 1. 先刪除所有舊選單 (避免重複)
    deleteAllRichMenus();

    // 2. 建立選單結構
    var richMenuId = createRichMenu();
    console.log('選單建立成功，ID: ' + richMenuId);

    // 3. 上傳圖片
    uploadRichMenuImage(richMenuId, RICH_MENU_IMAGE_URL);
    console.log('圖片上傳成功！');

    // 4. 設為全體預設
    setAsDefaultRichMenu(richMenuId);
    console.log('已設為預設選單，請重新開啟 LINE 測試。');
  } catch (e) {
    console.error('設定圖文選單失敗：' + e.toString());
  }
}

function createRichMenu() {
  var url = 'https://api.line.me/v2/bot/richmenu';
  var payload = {
    size: { width: 2500, height: 1686 },
    selected: true,
    name: '管理後台選單',
    chatBarText: '管理功能',
    areas: [
      // 左上角: 報名名單 (2x2 網格佈局 A)
      {
        bounds: { x: 0, y: 0, width: 1250, height: 843 },
        action: { type: 'message', text: '報名名單' }
      },
      // 右上角: 查詢功能 (2x2 網格佈局 B)
      {
        bounds: { x: 1250, y: 0, width: 1250, height: 843 },
        action: { type: 'message', text: '查詢 ' }
      },
      // 左下角: 回收桶 (2x2 網格佈局 C)
      {
        bounds: { x: 0, y: 843, width: 1250, height: 843 },
        action: { type: 'message', text: '查看回收桶' }
      },
      // 右下角: 管理網站 (直接觸發登入卡片)
      {
        bounds: { x: 1250, y: 843, width: 1250, height: 843 },
        action: { type: 'message', text: '管理網站' }
      }
    ]
  };

  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN
    },
    payload: JSON.stringify(payload)
  });
  return JSON.parse(res.getContentText()).richMenuId;
}

function uploadRichMenuImage(richMenuId, imageUrl) {
  var url =
    'https://api-data.line.me/v2/bot/richmenu/' + richMenuId + '/content';
  var imageBlob = UrlFetchApp.fetch(imageUrl).getBlob();
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers: { Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN },
    contentType: 'image/png',
    payload: imageBlob.getBytes()
  });
}

function setAsDefaultRichMenu(richMenuId) {
  var url = 'https://api.line.me/v2/bot/user/all/richmenu/' + richMenuId;
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers: { Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN }
  });
}

function deleteAllRichMenus() {
  var listUrl = 'https://api.line.me/v2/bot/richmenu/list';
  var res = UrlFetchApp.fetch(listUrl, {
    headers: { Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN }
  });
  var data = JSON.parse(res.getContentText());
  data.richmenus.forEach(function (menu) {
    UrlFetchApp.fetch(
      'https://api.line.me/v2/bot/richmenu/' + menu.richMenuId,
      {
        method: 'delete',
        headers: { Authorization: 'Bearer ' + CHANNEL_ACCESS_TOKEN }
      }
    );
  });
}
