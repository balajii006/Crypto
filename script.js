/* ═══════════════════════════════════════════════════════
   CryptoLab · script.js
   13 algorithms: Caesar, Vigenère, Hill, Playfair,
   Primality, Primitive Root, Euclidean, DES, AES,
   SHA-1/SHA-256, CMAC, Diffie-Hellman, RSA
═══════════════════════════════════════════════════════ */

// ── Navigation ──────────────────────────────────────────

function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (el) el.classList.add('active');
  if (window.innerWidth <= 720) closeSidebar();
  window.scrollTo(0, 0);
}

function toggleSidebar() {
  const s = document.getElementById('sidebar');
  const o = document.getElementById('overlay');
  s.classList.toggle('open');
  o.classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// ── Toast / Copy ─────────────────────────────────────────

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function copyResult(id) {
  const t = document.getElementById(id).textContent.trim();
  if (t === '—') return toast('Nothing to copy yet');
  navigator.clipboard.writeText(t).then(() => toast('Copied to clipboard'));
}

// ── Step Builder ─────────────────────────────────────────

let _stepCount = 0;
function stepsStart(title) {
  _stepCount = 0;
  return `<div class="steps-title">${title}</div>`;
}
function step(label, contentHTML) {
  _stepCount++;
  const delay = (_stepCount - 1) * 0.07;
  return `<div class="step" style="animation-delay:${delay}s">
    <div class="step-num">${_stepCount}</div>
    <div class="step-body">
      <div class="step-label">${label}</div>
      <div class="step-content">${contentHTML}</div>
    </div>
  </div>`;
}

function tbl(headers, rows, hiCols = []) {
  let h = `<div class="tbl-wrap"><table class="step-table"><thead><tr>`;
  headers.forEach(hh => h += `<th>${hh}</th>`);
  h += `</tr></thead><tbody>`;
  rows.forEach(row => {
    h += `<tr>`;
    row.forEach((cell, ci) => {
      const cls = hiCols.includes(ci) ? ' class="hi"' : '';
      h += `<td${cls}>${cell}</td>`;
    });
    h += `</tr>`;
  });
  return h + `</tbody></table></div>`;
}

function mat(vals, cols) {
  let h = `<div class="matrix-wrap" style="grid-template-columns:repeat(${cols},auto)">`;
  vals.forEach(v => h += `<div class="matrix-cell">${v}</div>`);
  return h + `</div>`;
}

function badge(text, type = 'indigo') {
  return `<div class="badge badge-${type}">${text}</div>`;
}

function roundSep(label) {
  return `<div class="round-sep">${label}</div>`;
}

// ── Math helpers ─────────────────────────────────────────

function modPow(base, exp, mod) {
  let b = BigInt(base), e = BigInt(exp), m = BigInt(mod), r = 1n;
  b = b % m;
  while (e > 0n) { if (e & 1n) r = r * b % m; b = b * b % m; e >>= 1n; }
  return Number(r);
}

function gcd(a, b) { while (b) { [a,b] = [b, a%b]; } return a; }

function modInverse(a, m) {
  let [r, nr] = [m, a], [s, ns] = [0, 1];
  while (nr !== 0) { const q = Math.floor(r/nr); [r,nr]=[nr,r-q*nr]; [s,ns]=[ns,s-q*ns]; }
  return ((s % m) + m) % m;
}

function isPrime(n) {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i*i <= n; i += 6) if (n%i===0 || n%(i+2)===0) return false;
  return true;
}

// ════════════════════════════════════════════════════════
// 1. CAESAR CIPHER
// ════════════════════════════════════════════════════════

function caesarProcess(text, key, enc) {
  const shift = enc ? key : (26 - key) % 26;
  let result = [], rows = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i].toUpperCase();
    if (ch >= 'A' && ch <= 'Z') {
      const p = ch.charCodeAt(0) - 65;
      const c = (p + shift) % 26;
      result.push(String.fromCharCode(c + 65));
      rows.push([ch, p, shift, `(${p}+${shift}) mod 26 = ${c}`, String.fromCharCode(c+65)]);
    } else {
      result.push(text[i]);
      rows.push([text[i], '—', '—', 'non-alpha, unchanged', text[i]]);
    }
  }
  let html = stepsStart(enc ? 'Encryption — Step by Step' : 'Decryption — Step by Step');
  html += step('Formula', enc
    ? `C = (P + ${key}) mod 26 &nbsp;·&nbsp; A=0, B=1, …, Z=25`
    : `P = (C − ${key} + 26) mod 26 &nbsp;·&nbsp; effective shift = <code>${shift}</code>`);
  html += step('Character Table', tbl(['Char','P (index)','Shift','Calculation','Output'], rows, [4]));
  html += step('Result', badge(result.join(''), 'indigo'));
  return { out: result.join(''), html };
}

function caesarEncrypt() {
  const t = document.getElementById('caesar-text').value.trim();
  const k = parseInt(document.getElementById('caesar-key').value);
  if (!t) return toast('Enter some text first');
  const { out, html } = caesarProcess(t, k, true);
  document.getElementById('caesar-result').textContent = out;
  document.getElementById('caesar-steps').innerHTML = html;
}
function caesarDecrypt() {
  const t = document.getElementById('caesar-text').value.trim();
  const k = parseInt(document.getElementById('caesar-key').value);
  if (!t) return toast('Enter some text first');
  const { out, html } = caesarProcess(t, k, false);
  document.getElementById('caesar-result').textContent = out;
  document.getElementById('caesar-steps').innerHTML = html;
}
function caesarClear() {
  document.getElementById('caesar-result').textContent = '—';
  document.getElementById('caesar-steps').innerHTML = '';
}

// ════════════════════════════════════════════════════════
// 2. VIGENÈRE CIPHER
// ════════════════════════════════════════════════════════

function vigProcess(text, keyword, enc) {
  const T = text.toUpperCase().replace(/[^A-Z]/g,'');
  const K = keyword.toUpperCase().replace(/[^A-Z]/g,'');
  if (!K) return { error: 'Invalid keyword' };
  let result = [], rows = [], ki = 0;
  for (let i = 0; i < T.length; i++) {
    const p = T[i].charCodeAt(0) - 65;
    const k = K[ki % K.length].charCodeAt(0) - 65;
    const c = enc ? (p+k)%26 : (p-k+26)%26;
    result.push(String.fromCharCode(c+65));
    rows.push([i+1, T[i], p, K[ki%K.length], k,
      enc ? `(${p}+${k}) mod 26` : `(${p}−${k}+26) mod 26`, c, String.fromCharCode(c+65)]);
    ki++;
  }
  const keyRep = T.split('').map((_,i) => K[i%K.length]).join('');
  let html = stepsStart(enc ? 'Encryption — Step by Step' : 'Decryption — Step by Step');
  html += step('Key Repetition',
    `Plaintext length: <code>${T.length}</code><br>
     Keyword <code>${K}</code> repeated → <code>${keyRep}</code>`);
  html += step(enc ? 'C = (P + K) mod 26' : 'P = (C − K + 26) mod 26',
    tbl(['#','Plain','P','Key','K','Calculation','Index','Output'], rows, [7]));
  html += step('Result', badge(result.join(''), 'indigo'));
  return { out: result.join(''), html };
}

function vigEncrypt() {
  const r = vigProcess(document.getElementById('vig-text').value, document.getElementById('vig-key').value, true);
  if (r.error) return toast(r.error);
  document.getElementById('vig-result').textContent = r.out;
  document.getElementById('vig-steps').innerHTML = r.html;
}
function vigDecrypt() {
  const r = vigProcess(document.getElementById('vig-text').value, document.getElementById('vig-key').value, false);
  if (r.error) return toast(r.error);
  document.getElementById('vig-result').textContent = r.out;
  document.getElementById('vig-steps').innerHTML = r.html;
}

// ════════════════════════════════════════════════════════
// 3. HILL CIPHER
// ════════════════════════════════════════════════════════

function hillProcess(text, keyStr, enc) {
  const T = text.toUpperCase().replace(/[^A-Z]/g,'');
  const kv = keyStr.split(',').map(Number);
  if (kv.length !== 4 || kv.some(isNaN)) return { error: 'Key must be 4 comma-separated integers' };
  const K = [[kv[0],kv[1]],[kv[2],kv[3]]];
  let padded = T.length % 2 ? T + 'X' : T;
  let KM = K;

  let html = stepsStart(enc ? 'Encryption — Step by Step' : 'Decryption — Step by Step');
  html += step('Key Matrix K', mat(kv, 2));

  if (!enc) {
    const det = ((K[0][0]*K[1][1] - K[0][1]*K[1][0]) % 26 + 26) % 26;
    const di  = modInverse(det, 26);
    if (di === 0) return { error: 'Key matrix not invertible mod 26' };
    KM = [
      [((K[1][1]*di)%26+26)%26, ((-K[0][1]*di)%26+26)%26],
      [((-K[1][0]*di)%26+26)%26,((K[0][0]*di)%26+26)%26]
    ];
    html += step('Inverse Key Matrix K⁻¹ mod 26',
      `det(K) = ${K[0][0]}×${K[1][1]} − ${K[0][1]}×${K[1][0]} ≡ <span class="val">${det}</span> (mod 26)<br>
       det⁻¹ mod 26 = <span class="val">${di}</span>` + mat(KM.flat(), 2));
  }

  let result = '', brows = [];
  for (let i = 0; i < padded.length; i += 2) {
    const a = padded[i].charCodeAt(0) - 65;
    const b = padded[i+1].charCodeAt(0) - 65;
    const r0 = ((KM[0][0]*a + KM[0][1]*b) % 26 + 26) % 26;
    const r1 = ((KM[1][0]*a + KM[1][1]*b) % 26 + 26) % 26;
    result += String.fromCharCode(r0+65) + String.fromCharCode(r1+65);
    html += step(`Block "${padded[i]}${padded[i+1]}"`,
      `Vector [${a}, ${b}]<br>
       Row 0: ${KM[0][0]}×${a} + ${KM[0][1]}×${b} = ${KM[0][0]*a+KM[0][1]*b} ≡ <span class="val">${r0}</span> → <span class="key">${String.fromCharCode(r0+65)}</span><br>
       Row 1: ${KM[1][0]}×${a} + ${KM[1][1]}×${b} = ${KM[1][0]*a+KM[1][1]*b} ≡ <span class="val">${r1}</span> → <span class="key">${String.fromCharCode(r1+65)}</span>`);
    brows.push([padded[i]+padded[i+1], `[${a},${b}]`, `[${r0},${r1}]`, String.fromCharCode(r0+65)+String.fromCharCode(r1+65)]);
  }
  html += step('All Blocks', tbl(['Digraph','Input','Output Vector','Result'], brows, [3]));
  html += step('Final Result', badge(result, 'indigo'));
  return { out: result, html };
}

function hillEncrypt() {
  const r = hillProcess(document.getElementById('hill-text').value, document.getElementById('hill-key').value, true);
  if (r.error) return toast(r.error);
  document.getElementById('hill-result').textContent = r.out;
  document.getElementById('hill-steps').innerHTML = r.html;
}
function hillDecrypt() {
  const r = hillProcess(document.getElementById('hill-text').value, document.getElementById('hill-key').value, false);
  if (r.error) return toast(r.error);
  document.getElementById('hill-result').textContent = r.out;
  document.getElementById('hill-steps').innerHTML = r.html;
}

// ════════════════════════════════════════════════════════
// 4. PLAYFAIR CIPHER
// ════════════════════════════════════════════════════════

function buildPFMatrix(kw) {
  const src = (kw + 'ABCDEFGHIKLMNOPQRSTUVWXYZ').toUpperCase().replace(/J/g,'I').replace(/[^A-Z]/g,'');
  const seen = new Set(), m = [];
  for (const c of src) { if (!seen.has(c)) { seen.add(c); m.push(c); } if (m.length===25) break; }
  return m;
}
function pfPos(m, c) { if (c==='J') c='I'; const i=m.indexOf(c); return [Math.floor(i/5), i%5]; }

function playfairProcess(text, kw, enc) {
  const m = buildPFMatrix(kw);
  const T = text.toUpperCase().replace(/J/g,'I').replace(/[^A-Z]/g,'');
  const dir = enc ? 1 : -1;
  const digraphs = [];
  let i = 0;
  while (i < T.length) {
    let a = T[i], b = i+1 < T.length ? T[i+1] : 'X';
    if (a === b) { b='X'; i++; } else i+=2;
    digraphs.push([a,b]);
  }

  let result='', rows=[];
  let html = stepsStart(enc ? 'Encryption — Step by Step' : 'Decryption — Step by Step');

  // Matrix
  const kwUpper = kw.toUpperCase().replace(/J/g,'I').replace(/[^A-Z]/g,'');
  const kwSet = [...new Set(kwUpper.split(''))];
  let g5 = '<div class="grid5">';
  m.forEach(c => { g5 += `<div class="grid5-cell ${kwSet.includes(c)?'kc':''}">${c}</div>`; });
  g5 += '</div>';
  html += step('5×5 Playfair Matrix', `Keyword: <code>${kw.toUpperCase()}</code>${g5}`);

  html += step('Digraph Formation',
    `Plaintext: <code>${T}</code><br>` +
    digraphs.map(d=>`<code>${d[0]}${d[1]}</code>`).join(' · '));

  digraphs.forEach(([a,b]) => {
    const [ra,ca] = pfPos(m,a), [rb,cb] = pfPos(m,b);
    let oa, ob, rule;
    if (ra===rb) { oa=m[ra*5+((ca+dir+5)%5)]; ob=m[rb*5+((cb+dir+5)%5)]; rule='Same row → shift columns'; }
    else if (ca===cb) { oa=m[((ra+dir+5)%5)*5+ca]; ob=m[((rb+dir+5)%5)*5+cb]; rule='Same column → shift rows'; }
    else { oa=m[ra*5+cb]; ob=m[rb*5+ca]; rule='Rectangle → swap columns'; }
    result += oa+ob;
    rows.push([a+b, `(${ra},${ca}) (${rb},${cb})`, rule, oa+ob]);

    let g5h = '<div class="grid5">';
    m.forEach((c,idx)=>{
      const r=Math.floor(idx/5),cc=idx%5;
      const isH=(r===ra&&cc===ca)||(r===rb&&cc===cb);
      g5h+=`<div class="grid5-cell ${isH?'hl':''}">${c}</div>`;
    });
    g5h+='</div>';
    html += step(`"${a}${b}"`,
      `${a} at (${ra},${ca}) · ${b} at (${rb},${cb})<br>
       Rule: <span class="val">${rule}</span><br>
       Output: <span class="key">${oa}${ob}</span>${g5h}`);
  });

  html += step('All Digraphs', tbl(['Pair','Positions','Rule','Output'], rows, [3]));
  html += step('Final Result', badge(result, 'indigo'));
  return { out: result, html };
}

function playfairEncrypt() {
  const r = playfairProcess(document.getElementById('pf-text').value, document.getElementById('pf-key').value, true);
  document.getElementById('pf-result').textContent = r.out;
  document.getElementById('pf-steps').innerHTML = r.html;
}
function playfairDecrypt() {
  const r = playfairProcess(document.getElementById('pf-text').value, document.getElementById('pf-key').value, false);
  document.getElementById('pf-result').textContent = r.out;
  document.getElementById('pf-steps').innerHTML = r.html;
}

// ════════════════════════════════════════════════════════
// 5. PRIMALITY — FERMAT
// ════════════════════════════════════════════════════════

function testPrimality() {
  const p = parseInt(document.getElementById('prim-p').value);
  const k = parseInt(document.getElementById('prim-k').value);
  if (p < 2) return toast('Enter a number ≥ 2');

  let html = stepsStart("Fermat's Primality Test — Step by Step");
  html += step('Fermat\'s Little Theorem',
    `If p is prime, then for every a coprime to p: <code>a<sup>p-1</sup> ≡ 1 (mod p)</code><br>
     If this fails for any a, then p is composite.<br>
     Testing p = <span class="val">${p}</span>`);

  const ws = new Set();
  while (ws.size < k) ws.add(2 + Math.floor(Math.random() * Math.max(1, p-3)));
  const witnesses = [...ws].slice(0,k).map(w => Math.max(2, Math.min(w, p-2)));

  const rows = [], fails = [];
  witnesses.forEach(a => {
    const res = modPow(a, p-1, p);
    const ok = res === 1;
    if (!ok) fails.push(a);
    rows.push([a, p-1, p, res,
      ok ? `<span class="pass">PASS ✓</span>` : `<span class="fail">FAIL ✗</span>`]);
  });
  html += step('Witness Tests', tbl(['Witness a','Exponent p−1','mod p','a^(p-1) mod p','Result'], rows));

  const probably = fails.length === 0;
  const really = isPrime(p);
  html += step('Verdict',
    badge(probably ? `${p} is probably prime (${k} tests passed)` : `${p} is composite (failed at a=${fails[0]})`,
      probably ? 'green' : 'red') +
    badge(`Deterministic: ${p} is ${really ? 'PRIME' : 'COMPOSITE'}`, really ? 'green' : 'red'));

  document.getElementById('prim-result').textContent = probably ? `Probably Prime` : `Composite`;
  document.getElementById('prim-steps').innerHTML = html;
}

// ════════════════════════════════════════════════════════
// 6. PRIMITIVE ROOT
// ════════════════════════════════════════════════════════

function primitiveRoot() {
  const p = parseInt(document.getElementById('pr-p').value);
  const g = parseInt(document.getElementById('pr-g').value);
  if (!isPrime(p)) return toast('p must be prime');
  if (g < 2 || g >= p) return toast('g must satisfy 2 ≤ g < p');

  const vals = new Set(), rows = [];
  for (let k = 1; k <= p-1; k++) {
    const v = modPow(g,k,p);
    vals.add(v);
    rows.push([k, `${g}^${k} mod ${p}`, v]);
  }
  const isPR = vals.size === p-1;

  let html = stepsStart('Primitive Root Check — Step by Step');
  html += step('Definition',
    `g is a primitive root of p if {g¹, g², …, g^(p-1)} mod p = {1, 2, …, p-1}.<br>
     Testing g = <span class="val">${g}</span>, p = <span class="val">${p}</span>`);
  html += step(`Powers of ${g} mod ${p}`, tbl(['k','Expression','Result'], rows, [2]));
  html += step('Distinct Values',
    `Generated: {${[...vals].sort((a,b)=>a-b).join(', ')}}<br>
     Count: <span class="val">${vals.size}</span> / ${p-1} needed`);
  html += step('Verdict', badge(
    isPR ? `${g} IS a primitive root of ${p} ✓` : `${g} is NOT a primitive root of ${p} ✗`,
    isPR ? 'green' : 'red'));

  document.getElementById('pr-result').textContent = isPR ? `${g} is a primitive root` : `${g} is not a primitive root`;
  document.getElementById('pr-steps').innerHTML = html;
}

function findAllPrimitiveRoots() {
  const p = parseInt(document.getElementById('pr-p').value);
  if (!isPrime(p)) return toast('p must be prime');
  if (p > 100) return toast('Use p ≤ 100 for Find All');
  const roots = [];
  for (let g = 2; g < p; g++) {
    const v = new Set();
    for (let k = 1; k <= p-1; k++) v.add(modPow(g,k,p));
    if (v.size === p-1) roots.push(g);
  }
  let html = stepsStart('All Primitive Roots');
  html += step(`All Primitive Roots of ${p}`,
    `φ(φ(${p})) = φ(${p-1}) = ${roots.length} primitive roots exist.<br>
     Roots: <span class="key">${roots.join(', ')}</span>`);
  document.getElementById('pr-result').textContent = roots.join(', ');
  document.getElementById('pr-steps').innerHTML = html;
}

// ════════════════════════════════════════════════════════
// 7. EUCLIDEAN / GCD
// ════════════════════════════════════════════════════════

function euclideanGCD() {
  let a = parseInt(document.getElementById('euc-a').value);
  let b = parseInt(document.getElementById('euc-b').value);
  if (a<=0||b<=0) return toast('Enter positive integers');
  const oa=a, ob=b;
  const rows=[];
  while (b>0) { const q=Math.floor(a/b),r=a%b; rows.push([a,b,q,r,`${a} = ${q}×${b} + ${r}`]); [a,b]=[b,r]; }
  const g=a;

  let html = stepsStart('Euclidean Algorithm — Step by Step');
  html += step('Algorithm', `GCD(a,b) = GCD(b, a mod b) · repeat until remainder = 0<br>Finding GCD(${oa}, ${ob})`);
  html += step('Division Steps', tbl(['a','b','Quotient','Remainder','Equation'], rows, [3]));
  html += step('Result',
    `Last non-zero remainder = <span class="val">${g}</span><br>` +
    badge(`GCD(${oa}, ${ob}) = ${g}`, 'indigo'));
  document.getElementById('euc-result').textContent = `GCD = ${g}`;
  document.getElementById('euc-steps').innerHTML = html;
}

function extendedEuclidean() {
  let a=parseInt(document.getElementById('euc-a').value);
  let b=parseInt(document.getElementById('euc-b').value);
  const oa=a,ob=b;
  let [r,nr]=[a,b],[s,ns]=[1,0],[t,nt]=[0,1];
  const rows=[];
  while (nr!==0){const q=Math.floor(r/nr);rows.push([r,nr,q,s,t]);[r,nr]=[nr,r-q*nr];[s,ns]=[ns,s-q*ns];[t,nt]=[nt,t-q*nt];}
  const g=r,x=s,y=t;

  let html = stepsStart('Extended Euclidean Algorithm — Step by Step');
  html += step('Goal', `Find x, y such that: <code>${oa}·x + ${ob}·y = GCD(${oa},${ob})</code>`);
  html += step('Extended Steps', tbl(['r','r′','q','Coeff s','Coeff t'], rows));
  html += step('Result',
    `GCD = <span class="val">${g}</span><br>
     x = <span class="val">${x}</span>, y = <span class="val">${y}</span><br>
     Verify: ${oa}×${x} + ${ob}×${y} = <span class="good">${oa*x+ob*y}</span><br>
     Modular inverse: ${oa}⁻¹ mod ${ob} = <span class="key">${((x%ob)+ob)%ob}</span>`);
  document.getElementById('euc-result').textContent = `GCD=${g}, x=${x}, y=${y}`;
  document.getElementById('euc-steps').innerHTML = html;
}

// ════════════════════════════════════════════════════════
// 8. DES
// ════════════════════════════════════════════════════════

const DES = (() => {
  const IP=[58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7];
  const IP_INV=[40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25];
  const E=[32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1];
  const P=[16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];
  const PC1=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];
  const PC2=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];
  const SHIFTS=[1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];
  const SB=[[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7,0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8,4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0,15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13],[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10,3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5,0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15,13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9],[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8,13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1,13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7,1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12],[7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15,13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9,10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4,3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14],[2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9,14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6,4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14,11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3],[12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11,10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8,9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6,4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13],[4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1,13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6,1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2,6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12],[13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7,1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2,7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8,2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]];

  function h2b(hex) { return hex.split('').flatMap(c=>parseInt(c,16).toString(2).padStart(4,'0').split('').map(Number)); }
  function b2h(bits) { let h=''; for(let i=0;i<bits.length;i+=4) h+=parseInt(bits.slice(i,i+4).join(''),2).toString(16).toUpperCase(); return h; }
  function perm(bits,tbl) { return tbl.map(i=>bits[i-1]); }
  function xor(a,b) { return a.map((v,i)=>v^b[i]); }
  function lshift(bits,n) { return [...bits.slice(n),...bits.slice(0,n)]; }
  function sbox(block,box) {
    const flat=SB[box]; const row=(block[0]<<1)|block[5]; const col=(block[1]<<3)|(block[2]<<2)|(block[3]<<1)|block[4];
    return flat[row*16+col].toString(2).padStart(4,'0').split('').map(Number);
  }
  function genKeys(kh) {
    const kb=h2b(kh.padEnd(16,'0'));
    let C=perm(kb,PC1.slice(0,28)), D=perm(kb,PC1.slice(28));
    return SHIFTS.map(s=>{C=lshift(C,s);D=lshift(D,s);return perm([...C,...D],PC2);});
  }
  function feistel(R,K) {
    const exp=perm(R,E),xd=xor(exp,K);
    const so=[]; for(let i=0;i<8;i++) so.push(...sbox(xd.slice(i*6,i*6+6),i));
    return perm(so,P);
  }
  function run(ph,kh,enc) {
    const keys=genKeys(kh), rk=enc?keys:[...keys].reverse();
    let bits=perm(h2b(ph.padEnd(16,'0').slice(0,16)),IP);
    let L=bits.slice(0,32),R=bits.slice(32);
    const rounds=[];
    for(let i=0;i<16;i++){
      const f=feistel(R,rk[i]),nR=xor(L,f);
      rounds.push({n:i+1,L:b2h(L),R:b2h(R),K:b2h(rk[i]),f:b2h(f),nR:b2h(nR)});
      L=R; R=nR;
    }
    return {out:b2h(perm([...R,...L],IP_INV)),rounds};
  }
  return {run};
})();

function desEncrypt(){desRun(true);}
function desDecrypt(){desRun(false);}
function desRun(enc) {
  const ph=document.getElementById('des-plain').value.toUpperCase().replace(/[^0-9A-F]/g,'').padEnd(16,'0').slice(0,16);
  const kh=document.getElementById('des-key').value.toUpperCase().replace(/[^0-9A-F]/g,'').padEnd(16,'0').slice(0,16);
  const {out,rounds}=DES.run(ph,kh,enc);
  document.getElementById('des-result').textContent=out;

  let html=stepsStart(enc?'DES Encryption — Step by Step':'DES Decryption — Step by Step');
  html+=step('Inputs',`Plaintext: <code>${ph}</code><br>Key: <code>${kh}</code>`);
  html+=step('Initial Permutation',`Apply IP table (64-bit reordering)<br>L₀ = <code>${rounds[0].L}</code> &nbsp; R₀ = <code>${rounds[0].R}</code>`);
  html+=step('16 Feistel Rounds',
    tbl(['Round','L (in)','R (in)','Key K','f(R,K)','R (out)'],
        rounds.map(r=>[r.n,r.L,r.R,r.K,r.f,r.nR]),[5]));
  html+=step('Final (after IP⁻¹)', badge(out, 'indigo'));
  document.getElementById('des-steps').innerHTML=html;
}

// ════════════════════════════════════════════════════════
// 9. AES
// ════════════════════════════════════════════════════════

const AES_CORE = (() => {
  const SB=[0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];
  const SBI=new Uint8Array(256); SB.forEach((v,i)=>SBI[v]=i);
  const RC=[0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36];

  function gm(a,b){let p=0;for(let i=0;i<8;i++){if(b&1)p^=a;const hb=a&0x80;a=(a<<1)&0xff;if(hb)a^=0x1b;b>>=1;}return p;}
  function subB(s,inv=false){return s.map(r=>r.map(b=>inv?SBI[b]:SB[b]));}
  function shiftR(s,inv=false){return s.map((r,i)=>{const sh=inv?4-i:i;return[...r.slice(sh%4),...r.slice(0,sh%4)];});}
  function mixC(s,inv=false){
    return s[0].map((_,c)=>{
      const col=s.map(r=>r[c]);
      return inv?[gm(col[0],0x0e)^gm(col[1],0x0b)^gm(col[2],0x0d)^gm(col[3],0x09),gm(col[0],0x09)^gm(col[1],0x0e)^gm(col[2],0x0b)^gm(col[3],0x0d),gm(col[0],0x0d)^gm(col[1],0x09)^gm(col[2],0x0e)^gm(col[3],0x0b),gm(col[0],0x0b)^gm(col[1],0x0d)^gm(col[2],0x09)^gm(col[3],0x0e)]
        :[gm(col[0],2)^gm(col[1],3)^col[2]^col[3],col[0]^gm(col[1],2)^gm(col[2],3)^col[3],col[0]^col[1]^gm(col[2],2)^gm(col[3],3),gm(col[0],3)^col[1]^col[2]^gm(col[3],2)];
    }).reduce((acc,col,ci)=>{col.forEach((v,ri)=>acc[ri][ci]=v);return acc;},[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
  }
  function addRK(s,k){return s.map((r,ri)=>r.map((v,ci)=>v^k[ri][ci]));}
  function h2state(hex){const b=[]; for(let i=0;i<32;i+=2)b.push(parseInt(hex.slice(i,i+2),16)); return[[b[0],b[4],b[8],b[12]],[b[1],b[5],b[9],b[13]],[b[2],b[6],b[10],b[14]],[b[3],b[7],b[11],b[15]]];}
  function s2hex(s){let h=''; for(let c=0;c<4;c++)for(let r=0;r<4;r++)h+=s[r][c].toString(16).padStart(2,'0').toUpperCase(); return h;}
  function srows(s){return s.map(r=>r.map(v=>v.toString(16).padStart(2,'0').toUpperCase()));}

  function keyExp(kh){
    const b=[]; for(let i=0;i<32;i+=2)b.push(parseInt(kh.slice(i,i+2),16));
    const w=[]; for(let i=0;i<4;i++)w.push(b.slice(i*4,i*4+4));
    for(let i=4;i<44;i++){let t=[...w[i-1]];if(i%4===0){t=[t[1],t[2],t[3],t[0]].map(b=>SB[b]);t[0]^=RC[i/4-1];}w.push(w[i-4].map((v,j)=>v^t[j]));}
    return Array.from({length:11},(_,r)=>[[w[r*4][0],w[r*4+1][0],w[r*4+2][0],w[r*4+3][0]],[w[r*4][1],w[r*4+1][1],w[r*4+2][1],w[r*4+3][1]],[w[r*4][2],w[r*4+1][2],w[r*4+2][2],w[r*4+3][2]],[w[r*4][3],w[r*4+1][3],w[r*4+2][3],w[r*4+3][3]]]);
  }

  function stateTable(st) {
    const r=srows(st);
    return tbl(['Col 0','Col 1','Col 2','Col 3'],r);
  }

  function run(ph,kh,enc){
    const rks=keyExp(kh.padEnd(32,'0').slice(0,32));
    let s=h2state(ph.padEnd(32,'0').slice(0,32));
    const log=[];
    if(enc){
      s=addRK(s,rks[0]); log.push({r:0,label:'Initial AddRoundKey',st:srows(s)});
      for(let r=1;r<=10;r++){
        s=subB(s); const aSB=srows(s);
        s=shiftR(s); const aSR=srows(s);
        if(r<10){s=mixC(s);} const aMC=r<10?srows(s):null;
        s=addRK(s,rks[r]); const aARK=srows(s);
        log.push({r,aSB,aSR,aMC,aARK});
      }
    } else {
      s=addRK(s,rks[10]); log.push({r:0,label:'Initial AddRoundKey (K10)',st:srows(s)});
      for(let r=9;r>=0;r--){
        s=shiftR(s,true); s=subB(s,true); s=addRK(s,rks[r]);
        if(r>0)s=mixC(s,true);
        log.push({r:10-r,label:`Inv Round ${10-r}`,st:srows(s)});
      }
    }
    return {out:s2hex(s),log,stateTable};
  }
  return {run,keyExp};
})();

function aesEncrypt(){aesRun(true);}
function aesDecrypt(){aesRun(false);}
function aesRun(enc){
  const ph=document.getElementById('aes-plain').value.toUpperCase().replace(/[^0-9A-F]/g,'').padEnd(32,'0').slice(0,32);
  const kh=document.getElementById('aes-key').value.toUpperCase().replace(/[^0-9A-F]/g,'').padEnd(32,'0').slice(0,32);
  const {out,log}=AES_CORE.run(ph,kh,enc);
  document.getElementById('aes-result').textContent=out;

  let html=stepsStart(enc?'AES Encryption — 10 Rounds':'AES Decryption — 10 Rounds');
  html+=step('Inputs',`Plaintext: <code>${ph}</code><br>Key: <code>${kh}</code><br>Rounds: 10 · Block: 128-bit`);
  html+=step('Key Expansion','11 round keys derived via SubBytes + RCON XOR scheduling.');
  log.forEach(entry=>{
    if(entry.label){
      html+=`<div class="round-sep">${entry.label}</div>`;
      if(entry.st) html+=tbl(['Col 0','Col 1','Col 2','Col 3'],entry.st);
    } else {
      html+=`<div class="round-sep">Round ${entry.r}</div>`;
      if(entry.aSB){
        html+='<small>SubBytes</small>'+tbl(['Col 0','Col 1','Col 2','Col 3'],entry.aSB);
        html+='<small>ShiftRows</small>'+tbl(['Col 0','Col 1','Col 2','Col 3'],entry.aSR);
        if(entry.aMC) html+='<small>MixColumns</small>'+tbl(['Col 0','Col 1','Col 2','Col 3'],entry.aMC);
        html+='<small>AddRoundKey</small>'+tbl(['Col 0','Col 1','Col 2','Col 3'],entry.aARK);
      } else if(entry.st) html+=tbl(['Col 0','Col 1','Col 2','Col 3'],entry.st);
    }
  });
  html+=step('Ciphertext', badge(out,'indigo'));
  document.getElementById('aes-steps').innerHTML=html;
}

// ════════════════════════════════════════════════════════
// 10. SHA-1 / SHA-256
// ════════════════════════════════════════════════════════

// Full implementations using SubtleCrypto (Web Crypto API) for accuracy
// Plus manual step breakdown for educational purposes

async function computeSHA() {
  const msg = document.getElementById('sha-msg').value;
  const algo = document.getElementById('sha-algo').value;
  if (!msg) return toast('Enter a message');

  const algoName = algo === 'sha1' ? 'SHA-1' : 'SHA-256';
  const digestBits = algo === 'sha1' ? 160 : 256;
  const numWords = algo === 'sha1' ? 5 : 8;

  // Use Web Crypto for accurate hash
  const enc = new TextEncoder();
  const data = enc.encode(msg);
  const hashBuffer = await crypto.subtle.digest(algoName.replace('-','').toUpperCase() === 'SHA1' ? 'SHA-1' : 'SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2,'0')).join('').toUpperCase();

  document.getElementById('sha-result').textContent = hashHex;

  // Educational breakdown
  const msgBytes = Array.from(data).map(b => b.toString(16).padStart(2,'0')).join(' ').toUpperCase();
  const msgBin   = Array.from(data).map(b => b.toString(2).padStart(8,'0')).join('');
  const bitLen   = data.length * 8;
  const padded   = data.length * 8; // original bit length

  // SHA initial hash values (H0-H7 for SHA-256, H0-H4 for SHA-1)
  const H256 = ['6A09E667','BB67AE85','3C6EF372','A54FF53A','510E527F','9B05688C','1F83D9AB','5BE0CD19'];
  const H1   = ['67452301','EFCDAB89','98BADCFE','10325476','C3D2E1F0'];
  const initH = algo === 'sha1' ? H1 : H256;

  // Number of 512-bit blocks after padding
  const msgBitLen = data.length * 8;
  const blocks = Math.ceil((data.length + 9) / 64);

  let html = stepsStart(`${algoName} Hash — Step by Step`);

  html += step('Message Encoding',
    `Input: <code>${msg}</code><br>
     UTF-8 bytes: <code>${msgBytes}</code><br>
     Length: <span class="val">${bitLen} bits</span> (${data.length} bytes)`);

  html += step('Padding the Message',
    `Rule: Append 1-bit, then 0s, then 64-bit length, until total ≡ 0 (mod 512).<br>
     Original: <span class="val">${msgBitLen} bits</span><br>
     After padding: <span class="val">${blocks * 512} bits</span> = <span class="val">${blocks}</span> block(s) of 512 bits`);

  html += step('Message Schedule',
    `Each 512-bit block is split into 16 words (W₀–W₁₅), then expanded:<br>
     · SHA-1: expanded to 80 words using Wₜ = (W_{t-3} ⊕ W_{t-8} ⊕ W_{t-14} ⊕ W_{t-16}) <<< 1<br>
     · SHA-256: expanded to 64 words using σ₀ / σ₁ mixing functions`);

  html += step('Initial Hash Values (H)',
    `${algoName} uses these fixed ${numWords} 32-bit constants as initial state:<br>` +
    tbl(initH.map((_,i)=>`H${i}`), [initH], []));

  html += step('Compression Function',
    algo === 'sha1'
      ? `80 rounds per block using FKWT = ${['Ch(B,C,D)','Parity(B,C,D)','Maj(B,C,D)','Parity(B,C,D)'].join(' / ')} + Kₜ + Wₜ + ROTL5(A).<br>
         Five working variables: A, B, C, D, E updated each round.`
      : `64 rounds per block. Each round uses two σ functions and two Σ functions:<br>
         Σ₀(A) = ROTR²(A) ⊕ ROTR¹³(A) ⊕ ROTR²²(A)<br>
         Σ₁(E) = ROTR⁶(E) ⊕ ROTR¹¹(E) ⊕ ROTR²⁵(E)<br>
         Eight working variables: A–H updated per round.`);

  html += step(`${algoName} Digest (${digestBits} bits)`,
    `<div class="bits-row">${hashHex.match(/.{1,8}/g).map(w=>`<span>${w}</span>`).join(' ')}</div>` +
    badge(hashHex, 'indigo'));

  html += step('Properties',
    `· Deterministic: same input always → same output<br>
     · Avalanche effect: 1-bit change → ~50% of bits flip in output<br>
     · Pre-image resistant: cannot reverse hash to find input<br>
     · Collision resistant: infeasible to find two inputs with same hash`);
}

// ════════════════════════════════════════════════════════
// 11. CMAC (AES-based)
// ════════════════════════════════════════════════════════

function computeCMAC() {
  const msgHex = document.getElementById('cmac-msg').value.toUpperCase().replace(/[^0-9A-F]/g,'');
  const keyHex = document.getElementById('cmac-key').value.toUpperCase().replace(/[^0-9A-F]/g,'').padEnd(32,'0').slice(0,32);
  if (!msgHex) return toast('Enter a hex message');

  // AES block encrypt helper using AES_CORE
  function aesBlock(blockHex, keyHex) {
    const {out} = AES_CORE.run(blockHex.padEnd(32,'0').slice(0,32), keyHex, true);
    return out;
  }

  // Helper: XOR two 16-byte hex strings
  function xorHex(a, b) {
    const ah = a.padStart(32,'0'), bh = b.padStart(32,'0');
    let r='';
    for(let i=0;i<32;i+=2) r+=(parseInt(ah.slice(i,i+2),16)^parseInt(bh.slice(i,i+2),16)).toString(16).padStart(2,'0');
    return r.toUpperCase();
  }

  // Step 1: Generate subkeys K1, K2
  const L = aesBlock('00000000000000000000000000000000', keyHex);
  const Lbits = L.match(/.{2}/g).map(h=>parseInt(h,16));
  const msb = Lbits[0] & 0x80;

  // K1 = L << 1, if MSB(L)=1 then XOR with Rb (0x87)
  const K1bytes = [];
  for(let i=0;i<16;i++) K1bytes.push(((Lbits[i]<<1)|(i<15?(Lbits[i+1]>>7):0))&0xFF);
  if(msb) K1bytes[15]^=0x87;
  const K1 = K1bytes.map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();

  // K2 = K1 << 1
  const K1bits = K1bytes, msb2 = K1bits[0] & 0x80;
  const K2bytes = [];
  for(let i=0;i<16;i++) K2bytes.push(((K1bits[i]<<1)|(i<15?(K1bits[i+1]>>7):0))&0xFF);
  if(msb2) K2bytes[15]^=0x87;
  const K2 = K2bytes.map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();

  // Step 2: Split message into 128-bit blocks
  let padded = msgHex;
  const fullBlocks = Math.floor(padded.length / 32);
  const isComplete = padded.length % 32 === 0 && padded.length > 0;

  let blocks = [];
  if(isComplete) {
    for(let i=0;i<padded.length;i+=32) blocks.push(padded.slice(i,i+32));
  } else {
    let incomplete = padded.slice(fullBlocks*32);
    // Pad with 80 00 00 ...
    incomplete = incomplete + '80' + '00'.repeat((32-incomplete.length-2)/2);
    incomplete = incomplete.slice(0,32);
    for(let i=0;i<fullBlocks*32;i+=32) blocks.push(padded.slice(i,i+32));
    blocks.push(incomplete);
  }

  // XOR last block with appropriate subkey
  const lastKey = isComplete ? K1 : K2;
  blocks[blocks.length-1] = xorHex(blocks[blocks.length-1], lastKey);

  // Step 3: CBC-MAC
  let X = '00000000000000000000000000000000';
  const rounds = [];
  blocks.forEach((blk, i) => {
    const Y = xorHex(X, blk);
    const out = aesBlock(Y, keyHex);
    rounds.push({i:i+1, blk, X, Y, out});
    X = out;
  });
  const mac = X;

  document.getElementById('cmac-result').textContent = mac;

  let html = stepsStart('CMAC — Step by Step');
  html += step('Overview',
    `CMAC uses AES-CBC-MAC with two derived subkeys (K1, K2) for security.<br>
     Key: <code>${keyHex}</code><br>
     Message: <code>${msgHex}</code> (${msgHex.length/2} bytes)`);

  html += step('Generate Subkeys K1, K2',
    `Encrypt zero block: AES(K, 0¹²⁸) = <code>${L}</code><br>
     K1 = L ≪ 1 ${msb?'⊕ 0x87':''} = <code>${K1}</code><br>
     K2 = K1 ≪ 1 ${msb2?'⊕ 0x87':''} = <code>${K2}</code>`);

  html += step('Block Preparation',
    `${blocks.length} block(s) of 128 bits.<br>
     Last block is ${isComplete?'complete → XOR with K1':'incomplete → pad with 10* then XOR with K2'}<br>
     Last block (after XOR): <code>${blocks[blocks.length-1]}</code>`);

  html += step('CBC-MAC Computation',
    tbl(['Block','Input M_i','X (prev)','X ⊕ M_i','AES output'],
        rounds.map(r=>[r.i, r.blk, r.X, r.Y, r.out]), [4]));

  html += step('MAC Tag',
    badge(mac, 'indigo') +
    `<br><small>128-bit tag · authenticate by recomputing and comparing</small>`);
}

// ════════════════════════════════════════════════════════
// 12. DIFFIE-HELLMAN
// ════════════════════════════════════════════════════════

function diffieHellman() {
  const p=parseInt(document.getElementById('dh-p').value);
  const g=parseInt(document.getElementById('dh-g').value);
  const a=parseInt(document.getElementById('dh-a').value);
  const b=parseInt(document.getElementById('dh-b').value);
  if(!isPrime(p)) return toast('p must be prime');

  const A=modPow(g,a,p), B=modPow(g,b,p);
  const sA=modPow(B,a,p), sB=modPow(A,b,p);

  let html=stepsStart('Diffie-Hellman — Step by Step');
  html+=step('Public Parameters',`Prime p = <span class="val">${p}</span> · Generator g = <span class="val">${g}</span><br>Both parties agree on these publicly.`);
  html+=step('Alice',
    `Private a = <span class="val">${a}</span> (secret)<br>
     Public A = g^a mod p = ${g}^${a} mod ${p} = <span class="key">${A}</span><br>
     Sends A = <span class="key">${A}</span> over public channel`);
  html+=step('Bob',
    `Private b = <span class="val">${b}</span> (secret)<br>
     Public B = g^b mod p = ${g}^${b} mod ${p} = <span class="key">${B}</span><br>
     Sends B = <span class="key">${B}</span> over public channel`);
  html+=step('Shared Secret',
    `Alice: S = B^a mod p = ${B}^${a} mod ${p} = <span class="val">${sA}</span><br>
     Bob:   S = A^b mod p = ${A}^${b} mod ${p} = <span class="val">${sB}</span><br>` +
    badge(sA===sB?`Both compute shared secret = ${sA} ✓`:'Mismatch! Check parameters', sA===sB?'green':'red'));
  html+=step('Security',
    `Eavesdropper knows: p=${p}, g=${g}, A=${A}, B=${B}<br>
     Must solve: g^x ≡ A (mod p) — the Discrete Logarithm Problem — computationally hard for large p.`);
  html+=step('Summary',
    tbl(['','Alice','Bob','Note'],
      [['Private',a,b,'🔒 Never shared'],
       ['Public sent',A,B,'📡 Over open channel'],
       ['Shared secret',sA,sB,sA===sB?'✓ Identical':'✗']], [3]));

  document.getElementById('dh-result').textContent=`Shared Key = ${sA}`;
  document.getElementById('dh-steps').innerHTML=html;
}

// ════════════════════════════════════════════════════════
// 13. RSA
// ════════════════════════════════════════════════════════

let rsaKeys=null;

function rsaGenKeys() {
  const p=parseInt(document.getElementById('rsa-p').value);
  const q=parseInt(document.getElementById('rsa-q').value);
  const e=parseInt(document.getElementById('rsa-e').value);
  if(!isPrime(p)||!isPrime(q)) return toast('p and q must be prime');
  if(p===q) return toast('p and q must differ');

  const n=p*q, phi=(p-1)*(q-1);
  if(gcd(e,phi)!==1) return toast(`e=${e} is not coprime to φ(n)=${phi}`);
  const d=modInverse(e,phi);
  rsaKeys={p,q,n,phi,e,d};

  let html=stepsStart('RSA Key Generation — Step by Step');
  html+=step('Choose Primes',`p = <span class="val">${p}</span> (prime ✓) · q = <span class="val">${q}</span> (prime ✓)`);
  html+=step('Compute n and φ(n)',
    `n = p × q = ${p} × ${q} = <span class="val">${n}</span><br>
     φ(n) = (p−1)(q−1) = ${p-1} × ${q-1} = <span class="val">${phi}</span>`);
  html+=step('Choose e',
    `e = <span class="val">${e}</span><br>
     Condition: 1 < e < φ(n) and GCD(e,φ(n)) = 1<br>
     GCD(${e},${phi}) = <span class="good">${gcd(e,phi)}</span> ✓`);
  html+=step('Compute d = e⁻¹ mod φ(n)',
    `d = <span class="val">${d}</span><br>
     Verify: e×d mod φ(n) = ${e}×${d} mod ${phi} = <span class="good">${(e*d)%phi}</span> ✓`);
  html+=step('Key Pair',
    badge(`Public Key  (e,n) = (${e},${n})`, 'indigo') +
    badge(`Private Key (d,n) = (${d},${n})`, 'amber'));

  document.getElementById('rsa-result').textContent=`e=${e}, d=${d}, n=${n}`;
  document.getElementById('rsa-steps').innerHTML=html;
}

function rsaEncrypt() {
  if(!rsaKeys){rsaGenKeys();if(!rsaKeys)return;}
  const M=parseInt(document.getElementById('rsa-msg').value);
  const{e,n,d}=rsaKeys;
  if(M>=n) return toast(`Message must be < n (${n})`);
  const C=modPow(M,e,n);
  let html=stepsStart('RSA Encryption — Step by Step');
  html+=step('Formula',`C = M^e mod n = ${M}^${e} mod ${n}`);
  html+=step('Computation',`Using fast modular exponentiation (square-and-multiply):<br><code>${M}^${e} mod ${n} = ${C}</code>`);
  html+=step('Ciphertext', badge(`C = ${C}`, 'indigo'));
  document.getElementById('rsa-result').textContent=`Ciphertext = ${C}`;
  document.getElementById('rsa-steps').innerHTML=html;
}

function rsaDecrypt() {
  if(!rsaKeys){rsaGenKeys();if(!rsaKeys)return;}
  const C=parseInt(document.getElementById('rsa-msg').value);
  const{e,n,d}=rsaKeys;
  const M=modPow(C,d,n);
  let html=stepsStart('RSA Decryption — Step by Step');
  html+=step('Formula',`M = C^d mod n = ${C}^${d} mod ${n}`);
  html+=step('Computation',`Using fast modular exponentiation (square-and-multiply):<br><code>${C}^${d} mod ${n} = ${M}</code>`);
  html+=step('Plaintext', badge(`M = ${M}`, 'green'));
  document.getElementById('rsa-result').textContent=`Plaintext = ${M}`;
  document.getElementById('rsa-steps').innerHTML=html;
}

// ════════════════════════════════════════════════════════
// PDF EXPORT
// ════════════════════════════════════════════════════════

function downloadPDF(stepsId, title) {
  const el=document.getElementById(stepsId);
  if(!el||!el.innerHTML.trim()) return toast('Run the algorithm first');
  const{jsPDF}=window.jspdf;
  const doc=new jsPDF({unit:'mm',format:'a4'});
  doc.setFont('helvetica','bold');
  doc.setFontSize(16);
  doc.setTextColor(79,70,229);
  doc.text('CryptoLab — ' + title.replace(/_/g,' '), 20, 18);
  doc.setFont('helvetica','normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80,80,80);
  let y=30;
  el.querySelectorAll('.step').forEach((s,i)=>{
    const label=s.querySelector('.step-label')?.textContent||'';
    const content=s.querySelector('.step-content')?.innerText||'';
    doc.setFont('helvetica','bold');
    doc.setFontSize(10);
    doc.setTextColor(30,30,100);
    doc.text(`Step ${i+1}: ${label}`, 20, y); y+=5.5;
    doc.setFont('helvetica','normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60,60,60);
    const lines=doc.splitTextToSize(content,170);
    lines.slice(0,25).forEach(line=>{
      if(y>282){doc.addPage();y=20;}
      doc.text(line,22,y); y+=4.5;
    });
    y+=2;
    if(y>282){doc.addPage();y=20;}
  });
  doc.save(title+'_Steps.pdf');
  toast('PDF downloaded');
}
