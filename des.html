<!DOCTYPE html>
<html>
<head>
    <title>S-DES Full Step Encryption</title>
    <style>
        body { font-family: Arial; text-align:center; background:#f2f2f2; }
        .box {
            background:white;
            width:700px;
            margin:30px auto;
            padding:20px;
            border-radius:10px;
            box-shadow:0 4px 12px rgba(0,0,0,0.2);
        }
        input { width:90%; padding:8px; margin:10px; }
        button { padding:10px 20px; cursor:pointer; }
        .result {
            margin-top:20px;
            background:#111;
            color:#00ff88;
            padding:15px;
            border-radius:8px;
            text-align:left;
            font-family:monospace;
            white-space:pre-wrap;
        }
    </style>
</head>
<body>

<div class="box">
<h2>S-DES Encryption (All Steps)</h2>

<input type="text" id="plaintext" placeholder="8-bit plaintext (e.g. 10111101)">
<input type="text" id="key" placeholder="10-bit key (e.g. 1010000010)">
<button onclick="encrypt()">Encrypt</button>

<div id="output" class="result"></div>
</div>

<script>

function permute(bits, order){
    return order.map(i => bits[i-1]).join('');
}

function leftShift(bits, n){
    return bits.slice(n) + bits.slice(0,n);
}

function xor(a,b){
    let res="";
    for(let i=0;i<a.length;i++)
        res += a[i]^b[i];
    return res;
}

const P10 = [3,5,2,7,4,10,1,9,8,6];
const P8  = [6,3,7,4,8,5,10,9];
const IP  = [2,6,3,1,4,8,5,7];
const IP_INV = [4,1,3,5,7,2,8,6];
const EP  = [4,1,2,3,2,3,4,1];
const P4  = [2,4,3,1];

const S0 = [
["01","00","11","10"],
["11","10","01","00"],
["00","10","01","11"],
["11","01","11","10"]
];

const S1 = [
["00","01","10","11"],
["10","00","01","11"],
["11","00","01","00"],
["10","01","00","11"]
];

function sboxLookup(bits, box){
    let row = parseInt(bits[0]+bits[3],2);
    let col = parseInt(bits[1]+bits[2],2);
    return box[row][col];
}

function generateKeys(key, steps){
    steps += "=== KEY GENERATION ===\n";
    let p10 = permute(key,P10);
    steps += "P10: "+p10+"\n";

    let left = p10.slice(0,5);
    let right = p10.slice(5);

    left = leftShift(left,1);
    right = leftShift(right,1);

    let k1 = permute(left+right,P8);
    steps += "K1: "+k1+"\n";

    left = leftShift(left,2);
    right = leftShift(right,2);

    let k2 = permute(left+right,P8);
    steps += "K2: "+k2+"\n\n";

    return {k1,k2,steps};
}

function fk(bits,key,steps,round){
    steps += "=== ROUND "+round+" ===\n";
    let left = bits.slice(0,4);
    let right = bits.slice(4);

    steps += "Left: "+left+" Right: "+right+"\n";

    let ep = permute(right,EP);
    steps += "EP: "+ep+"\n";

    let xored = xor(ep,key);
    steps += "XOR with K"+round+": "+xored+"\n";

    let s0 = sboxLookup(xored.slice(0,4),S0);
    let s1 = sboxLookup(xored.slice(4),S1);
    steps += "S0: "+s0+" S1: "+s1+"\n";

    let p4 = permute(s0+s1,P4);
    steps += "P4: "+p4+"\n";

    let leftXor = xor(left,p4);
    steps += "Left XOR P4: "+leftXor+"\n\n";

    return {result:leftXor+right,steps};
}

function encrypt(){
    let pt = document.getElementById("plaintext").value;
    let key = document.getElementById("key").value;
    let out = document.getElementById("output");

    if(!/^[01]{8}$/.test(pt) || !/^[01]{10}$/.test(key)){
        out.innerText="Invalid input!";
        return;
    }

    let steps="";

    let keys = generateKeys(key,steps);
    steps = keys.steps;

    steps += "=== INITIAL PERMUTATION ===\n";
    let ip = permute(pt,IP);
    steps += "IP: "+ip+"\n\n";

    let round1 = fk(ip,keys.k1,steps,1);
    steps = round1.steps;

    let swapped = round1.result.slice(4)+round1.result.slice(0,4);
    steps += "SWAP: "+swapped+"\n\n";

    let round2 = fk(swapped,keys.k2,steps,2);
    steps = round2.steps;

    steps += "=== FINAL PERMUTATION ===\n";
    let cipher = permute(round2.result,IP_INV);
    steps += "Ciphertext: "+cipher;

    out.innerText=steps;
}

</script>
</body>
</html>
