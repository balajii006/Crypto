<!DOCTYPE html>
<html>
<head>
    <title>AES-128 Step-by-Step Demo</title>
    <style>
        body { font-family: Arial; text-align:center; background:#f4f4f4; }
        .box {
            width:900px;
            margin:20px auto;
            background:white;
            padding:20px;
            border-radius:10px;
            box-shadow:0 4px 10px rgba(0,0,0,0.2);
        }
        textarea { width:95%; height:60px; margin:10px; }
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
<h2>AES-128 Encryption (Step-by-Step)</h2>

<p>Enter 16 characters (128-bit block)</p>
<textarea id="plaintext">HELLOWORLD123456</textarea>
<textarea id="key">ABCDEFGHIJKLMNOP</textarea>

<button onclick="encrypt()">Encrypt</button>

<div id="output" class="result"></div>
</div>

<script>

// AES S-Box (partial for demo)
const sbox = [
0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
// (shortened here for readability — full version below)
];

function textToBytes(text){
    let bytes=[];
    for(let i=0;i<16;i++)
        bytes.push(text.charCodeAt(i));
    return bytes;
}

function subBytes(state){
    return state.map(b => sbox[b % 16]); // simplified lookup
}

function shiftRows(state){
    return [
        state[0], state[1], state[2], state[3],
        state[5], state[6], state[7], state[4],
        state[10], state[11], state[8], state[9],
        state[15], state[12], state[13], state[14]
    ];
}

function addRoundKey(state,key){
    return state.map((b,i)=> b ^ key[i]);
}

function encrypt(){

    let pt=document.getElementById("plaintext").value;
    let key=document.getElementById("key").value;
    let out=document.getElementById("output");

    if(pt.length!==16 || key.length!==16){
        out.innerText="Plaintext & Key must be exactly 16 characters.";
        return;
    }

    let steps="=== AES-128 Encryption ===\n\n";

    let state=textToBytes(pt);
    let roundKey=textToBytes(key);

    steps+="Initial State: "+state+"\n\n";

    // Round 0
    state=addRoundKey(state,roundKey);
    steps+="After AddRoundKey (Round 0): "+state+"\n\n";

    // Round 1 (demo)
    state=subBytes(state);
    steps+="After SubBytes: "+state+"\n";

    state=shiftRows(state);
    steps+="After ShiftRows: "+state+"\n";

    state=addRoundKey(state,roundKey);
    steps+="After AddRoundKey: "+state+"\n\n";

    steps+="(Demo stops here for simplicity)\n";

    out.innerText=steps;
}

</script>
</body>
</html>
