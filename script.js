// قراءة الرابط من config.json
fetch('./config.json')
  .then(response => response.json())
  .then(config => {
    const apiBase = config.api_base;

    // جلب البيانات المباشرة من API كل 5 ثواني
    setInterval(() => {
      fetch(`${apiBase}/market-data`)
        .then(res => res.json())
        .then(data => {
          updateMarketUI(data);
        })
        .catch(err => console.error('API Error:', err));
    }, 5000);
  });

function updateMarketUI(data) {
  console.log("Market Updated:", data);
}
// Simple live-updating demo script for Smart Gold ZY (updates every 60s)
const assets = [
  {symbol:'XAU/USD', name:'Gold', indicators:['RSI','MACD','EMA']},
  {symbol:'WTI', name:'Oil', indicators:['RSI','ATR','VOLUME']},
  {symbol:'BTC/USD', name:'Bitcoin', indicators:['RSI','MACD']},
  {symbol:'EUR/USD', name:'EUR / USD', indicators:['RSI','EMA','MACD']},
];

function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

function calcSignal(success){
  // rough mapping: >80 BUY, 65-80 WAIT, <65 SELL (demo logic)
  if(success>80) return {label:'BUY', cls:'buy'};
  if(success>65) return {label:'WAIT', cls:'wait'};
  return {label:'SELL', cls:'sell'};
}

function renderGrid(){
  const grid = document.getElementById('grid');
  grid.innerHTML='';
  assets.forEach(a=>{
    const success = rand(62,92);
    const risk = Math.max(100-success, rand(5,20));
    const sig = calcSignal(success);
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML = `
      <div class="head"><div>
        <div class="symbol">${a.symbol}</div>
        <div class="name">${a.name}</div>
      </div>
      <div><div class="signal ${sig.cls}">${sig.label}</div></div></div>
      <div class="metrics"><div><span class="success">${success}</span><small>% success</small></div><div><span class="risk">${risk}</span><small>% risk</small></div></div>
      <div class="ind">Indicators: ${a.indicators.join(' · ')}</div>
    `;
    grid.appendChild(card);
  });
  document.getElementById('lastUpdate').textContent = new Date().toLocaleString();
}

function updateWhale(){
  // randomly simulate whale alert with low probability
  const p = Math.random();
  const banner = document.getElementById('whaleBanner');
  const text = document.getElementById('whaleText');
  if(p<0.18){ // 18% chance for demo
    banner.style.background = 'linear-gradient(90deg,#8B1E1E,#C43E3E)';
    text.textContent = 'Whale Detected — Market unstable. Trading paused ⚠️';
    notify('Whale detected — Market unstable (demo)');
  } else {
    banner.style.background = '#111318';
    text.textContent = 'Market Normal';
  }
}

function notify(msg){
  try{ if(navigator.vibrate) navigator.vibrate([200,150,200]); }catch(e){}
  const t = document.createElement('div');
  t.className='toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=> t.classList.add('visible'), 20);
  setTimeout(()=>{ t.classList.remove('visible'); setTimeout(()=> t.remove(),400); }, 3600);
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderGrid();
  updateWhale();
  // update every 60 seconds
  setInterval(()=>{ renderGrid(); updateWhale(); }, 60000);
});
