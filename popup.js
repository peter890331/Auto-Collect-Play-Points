const isChinese = navigator.language.startsWith('zh');
const i18n = {
  title: isChinese ? '自動領取 Play Points' : 'Auto Collect Play Points',
  countLabel: isChinese ? '累積自動領取次數：' : 'Total Auto Collect Count:',
  countUnit: isChinese ? '次' : 'times',
  dateLabel: isChinese ? '下次自動領取日期：' : 'Next Auto Collect Date:',
  loading: isChinese ? '檢查中...' : 'Checking...',
  btnText: isChinese ? '立即檢查與領取' : 'Check & Collect Now',
  noData: isChinese ? '尚未取得資料' : 'No data available',
  tutorialBtn: isChinese ? '📖 使用教學' : '📖 Tutorial',
  githubBtn: isChinese ? '⭐ 專案星星' : '⭐ Star Project',
  backBtn: isChinese ? '返回' : 'Back',
tutorialContent: isChinese ? 
    '運作方式非常簡單！\n\n' +
    '1. 請先在瀏覽器的 Play 商店登入您的帳號。\n\n' +
    '2. 電腦閒置滿 10 分鐘後，程式會自動執行。\n\n' +
    '3. 只有在首次安裝或有新獎勵時，才會開啟分頁領取點數。\n\n' +
    '4. 領取完畢後會自動關閉分頁，完全不干擾您的日常使用。' : 
    
    'The process is very simple!\n\n' +
    '1. First, log in to your account on the Google Play in your browser.\n\n' +
    '2. The extension runs automatically after 10 minutes of idle time.\n\n' +
    '3. It only opens a tab to collect points on first install or when new rewards are ready.\n\n' +
    '4. The tab closes automatically when finished, so it will not interrupt your work.'
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('titleText').innerText = i18n.title;
  document.getElementById('countLabel').innerText = i18n.countLabel;
  document.getElementById('countUnit').innerText = i18n.countUnit;
  document.getElementById('dateLabel').innerText = i18n.dateLabel;
  document.getElementById('checkBtn').innerText = i18n.btnText;
  document.getElementById('date').innerText = i18n.loading;
  document.getElementById('tutorialToggle').innerText = i18n.tutorialBtn;
  document.getElementById('githubLink').innerText = i18n.githubBtn;
  document.getElementById('backBtn').innerText = i18n.backBtn;
  document.getElementById('tutorialContent').innerText = i18n.tutorialContent;

  chrome.storage.local.get(['claimCount', 'nextClaimDate', 'dateString'], (result) => {
    const countEl = document.getElementById('count');
    const dateEl = document.getElementById('date');

    if (result.claimCount !== undefined) {
      countEl.innerText = result.claimCount;
    }

    if (result.dateString && result.dateString !== '尚未取得資料' && result.dateString !== 'No data available') {
      dateEl.innerText = result.dateString;
    } else if (result.nextClaimDate) {
      const d = new Date(result.nextClaimDate);
      dateEl.innerText = d.toLocaleDateString();
    } else {
      dateEl.innerText = i18n.noData;
    }
  });

  document.getElementById('checkBtn').addEventListener('click', () => {
    chrome.storage.local.set({ autoRunFlag: Date.now() }, () => {
      chrome.tabs.create({ url: "https://play.google.com/store/points/perks", active: true });
    });
  });

  const mainView = document.getElementById('mainView');
  const tutorialView = document.getElementById('tutorialView');

  document.getElementById('tutorialToggle').addEventListener('click', () => {
    mainView.style.display = 'none';
    tutorialView.style.display = 'block';
  });

  document.getElementById('backBtn').addEventListener('click', () => {
    tutorialView.style.display = 'none';
    mainView.style.display = 'block';
  });

  document.getElementById('githubLink').addEventListener('click', () => {
    chrome.tabs.create({ url: "https://github.com/peter890331/Auto-Collect-Play-Points" });
  });
});