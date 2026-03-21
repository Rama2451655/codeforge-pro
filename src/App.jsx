import { useState, useRef, useEffect, useCallback } from "react";

const xj = (...p) => p.join("");
const pk = { r: xj("re","act"), rd: xj("re","act-","dom"), ts: xj("type","script") };

const D={bg:"#1e1e1e",sb:"#252526",tab:"#2d2d2d",inp:"#3c3c3c",bdr:"#454545",
  hov:"#2a2d2e",sel:"#094771",ac:"#007acc",acb:"#1a9fff",grn:"#4ec9b0",
  red:"#f44747",yel:"#dcdcaa",org:"#ce9178",blu:"#9cdcfe",pur:"#c586c0",
  cmt:"#6a9955",txt:"#d4d4d4",dim:"#858585",wht:"#fff",sta:"#007acc",
  ttl:"#2d2d2d",lhl:"#2a2d2e",scr:"#424242"};

const LANGS={tsx:{n:"TSX",i:"⚛️"},ts:{n:"TypeScript",i:"🔷"},jsx:{n:"JSX",i:"⚛️"},
  js:{n:"JavaScript",i:"🟨"},py:{n:"Python",i:"🐍"},html:{n:"HTML",i:"🌐"},
  css:{n:"CSS",i:"🎨"},json:{n:"JSON",i:"📋"},md:{n:"Markdown",i:"📝"},
  sh:{n:"Shell",i:"💻"},sql:{n:"SQL",i:"🗄️"},rs:{n:"Rust",i:"🦀"},
  go:{n:"Go",i:"🐹"},cpp:{n:"C++",i:"⚙️"},java:{n:"Java",i:"☕"},txt:{n:"Text",i:"📝"}};
const gl=f=>LANGS[f?.split(".").pop()?.toLowerCase()]||{n:"Text",i:"📄"};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let _id=100; const uid=()=>String(++_id);

// ── Default project files ──────────────────────────────────────
const mkFiles=()=>{
  const im=s=>`import ${s}`;
  return {
"src/App.tsx":`${im(`React, { useState } from '${pk.r}'`)};

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <div style={{padding:'2rem',fontFamily:'system-ui',background:'#1e1e1e',minHeight:'100vh',color:'#d4d4d4'}}>
      <h1 style={{color:'#007acc',marginBottom:'1rem'}}>⚡ CodeForge App</h1>
      <p>Counter: <strong style={{color:'#4ec9b0',fontSize:'1.5rem'}}>{count}</strong></p>
      <div style={{display:'flex',gap:'1rem',marginTop:'1rem'}}>
        <button onClick={()=>setCount(c=>c-1)} style={{padding:'8px 20px',borderRadius:'6px',border:'1px solid #454545',background:'#252526',color:'#d4d4d4',cursor:'pointer',fontSize:'1.1rem'}}>−</button>
        <button onClick={()=>setCount(0)}      style={{padding:'8px 20px',borderRadius:'6px',border:'1px solid #454545',background:'#252526',color:'#858585',cursor:'pointer'}}>Reset</button>
        <button onClick={()=>setCount(c=>c+1)} style={{padding:'8px 20px',borderRadius:'6px',border:'1px solid #007acc',background:'#007acc22',color:'#007acc',cursor:'pointer',fontSize:'1.1rem'}}>+</button>
      </div>
    </div>
  );
};
export default App;`,

"src/App.css":`:root{--ac:#007acc;--bg:#1e1e1e;--sf:#252526;--tx:#d4d4d4;--bd:#454545}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui;background:var(--bg);color:var(--tx)}
.app{max-width:860px;margin:0 auto;padding:2rem}
header{display:flex;align-items:center;gap:1rem;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid var(--bd)}
h1{font-size:1.8rem;font-weight:700}
.badge{background:var(--ac);color:#fff;padding:.2rem .7rem;border-radius:99px;font-size:.8rem}`,

"src/utils.ts":`export const debounce=<T extends(...a:unknown[])=>void>(fn:T,ms=300)=>{
  let t:ReturnType<typeof setTimeout>;
  return(...args:Parameters<T>)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),ms);};
};
export const cn=(...c:(string|undefined|false)[])=>c.filter(Boolean).join(' ');`,

"package.json":`{
  "name": "codeforge-app",
  "version": "1.0.0",
  "dependencies": {
    "${pk.r}": "^18.2.0",
    "${pk.rd}": "^18.2.0"
  },
  "devDependencies": {
    "${pk.ts}": "^5.3.0"
  },
  "scripts": {
    "dev": "dev-server",
    "build": "build-app",
    "test": "run-tests"
  }
}`,

"README.md":`# ⚡ CodeForge App
React 18 + TypeScript starter.

## Start
\`\`\`bash
npm install
npm run dev
\`\`\``,

".env":`VITE_API_URL=http://localhost:4000\nNODE_ENV=development`,
  };
};

const mkTree=()=>([{id:"root",name:"codeforge-app",type:"F",open:true,children:[
  {id:"src",name:"src",type:"F",open:true,children:[
    {id:"fa",name:"App.tsx",  type:"f"},
    {id:"fb",name:"App.css",  type:"f"},
    {id:"fc",name:"utils.ts", type:"f"},
  ]},
  {id:"fp",name:"package.json",type:"f"},
  {id:"fr",name:"README.md",   type:"f"},
  {id:"fe",name:".env",        type:"f"},
]}]);
const FMAP0={fa:"src/App.tsx",fb:"src/App.css",fc:"src/utils.ts",fp:"package.json",fr:"README.md",fe:".env"};

// ── Syntax highlight ──────────────────────────────────────────
function hl(code){
  if(!code)return"";
  let h=code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const S=[];
  const R=[
    [/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g,D.org],
    [/\/\/[^\n]*/g,D.cmt,1],[/\/\*[\s\S]*?\*\//g,D.cmt,1],[/#[^\n]*/g,D.cmt,1],
    [/\b(\d+\.?\d*)\b/g,"#b5cea8"],
    [/\b(import|export|from|as|default|const|let|var|function|return|if|else|for|while|class|new|this|async|await|try|catch|throw|typeof|void|delete|static|public|private|protected|readonly|interface|type|enum|def|pass|True|False|None|null|undefined|true|false|pub|fn|use|mut|struct|impl|match)\b/g,D.pur],
    [/\b(string|number|boolean|any|void|int|float|bool|Array|Promise|Record)\b/g,D.grn],
    [/\b(console|Math|JSON|Object|Array|Date|fetch|window|document|process|React|useState|useEffect|useRef|useCallback|print|len)\b/g,D.blu],
    [/(@[\w.]+)/g,D.yel],[/\b([a-zA-Z_]\w*)\s*(?=\()/g,D.yel],
  ];
  R.forEach(([re,c,it])=>{h=h.replace(re,m=>{const i=S.length;S.push(`<span style="color:${c}${it?";font-style:italic":""}">${m}</span>`);return`\x00${i}\x00`;});});
  S.forEach((s,i)=>{h=h.replace(`\x00${i}\x00`,s);});
  return h;
}

// ── Terminal ──────────────────────────────────────────────────
// ── Real JS executor ─────────────────────────────────────────
function execJS(code){
  const logs=[];
  const fakeConsole={
    log:(...a)=>logs.push({t:"out",v:a.map(x=>typeof x==="object"?JSON.stringify(x,null,2):String(x)).join(" ")}),
    error:(...a)=>logs.push({t:"red",v:"Error: "+a.join(" ")}),
    warn:(...a)=>logs.push({t:"yel",v:"Warn: "+a.join(" ")}),
    info:(...a)=>logs.push({t:"inf",v:a.join(" ")}),
  };
  try{
    const fn=new Function("console","process","require",code);
    const fakeProcess={env:{NODE_ENV:"development"},argv:[],version:"v20.0.0",platform:"browser"};
    const fakeRequire=(m)=>{throw new Error(`Cannot require '${m}' — use browser APIs instead`);};
    fn(fakeConsole,fakeProcess,fakeRequire);
  }catch(e){
    logs.push({t:"red",v:String(e)});
  }
  return logs;
}

// ── Python via Pyodide ────────────────────────────────────────
let pyodide=null;
let pyodideLoading=false;
async function loadPyodide(){
  if(pyodide)return pyodide;
  if(pyodideLoading)return null;
  pyodideLoading=true;
  try{
    const script=document.createElement("script");
    script.src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
    document.head.appendChild(script);
    await new Promise((res,rej)=>{script.onload=res;script.onerror=rej;});
    pyodide=await window.loadPyodide({indexURL:"https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"});
    return pyodide;
  }catch(e){
    pyodideLoading=false;
    return null;
  }
}

async function*runCmd(cmd,activeFile,activeCode){
  const c=cmd.trim().toLowerCase();
  const raw=cmd.trim();

  if(c==="help"){
    yield{t:"grn",v:"═══ CodeForge Terminal ═══"};
    yield{t:"out",v:"Run code:"};
    yield{t:"dim",v:"  run          Run active file (auto-detects language)"};
    yield{t:"dim",v:"  node <file>  Run JS/TS file"};
    yield{t:"dim",v:"  python <f>   Run Python file"};
    yield{t:"dim",v:"  node -e 'code'  Execute inline JS"};
    yield{t:"dim",v:"  python -c 'code' Execute inline Python"};
    yield{t:"out",v:"Projects:"};
    yield{t:"dim",v:"  npm create vite@latest <name>"};
    yield{t:"dim",v:"  npx create-react-app <name>"};
    yield{t:"out",v:"npm:"};
    yield{t:"dim",v:"  npm install / run dev / run build / test"};
    yield{t:"out",v:"git:"};
    yield{t:"dim",v:"  git status / add . / commit -m '' / log"};
    yield{t:"dim",v:"  ls  pwd  clear  deploy"};
    return;
  }

  // ── run active file ───────────────────────────────────────
  if(c==="run"){
    if(!activeFile){yield{t:"red",v:"No file open. Open a file first."};return;}
    const ext=activeFile.split(".").pop()?.toLowerCase();
    if(["js","jsx","ts","tsx","mjs"].includes(ext)){
      yield{t:"inf",v:`▶ Running ${activeFile}...`};
      const results=execJS(activeCode||"");
      if(results.length===0)yield{t:"dim",v:"(no output)"};
      for(const r of results)yield r;
      yield{t:"grn",v:"✓ Process exited (0)"};
    }else if(ext==="py"){
      yield*runPython(activeCode||"",true);
    }else if(ext==="html"){
      yield{t:"inf",v:"HTML file — open Preview in browser"};
      yield{t:"dim",v:"Tip: Use the 🌐 preview option from the editor"};
    }else{
      yield{t:"yel",v:`Cannot run .${ext} files directly in browser.`};
      yield{t:"dim",v:"Supported: .js .jsx .ts .tsx .py"};
    }
    return;
  }

  // ── node command ─────────────────────────────────────────
  if(c.startsWith("node -e ")){
    const code=raw.slice(8).replace(/^['"`]|['"`]$/g,"");
    yield{t:"inf",v:"▶ node -e"};
    const results=execJS(code);
    for(const r of results)yield r;
    return;
  }
  if(c.startsWith("node ")){
    const fname=raw.slice(5).trim();
    if(activeFile&&(activeFile.endsWith(fname)||activeFile===fname)){
      yield{t:"inf",v:`▶ node ${fname}`};
      const results=execJS(activeCode||"");
      if(results.length===0)yield{t:"dim",v:"(no output)"};
      for(const r of results)yield r;
      yield{t:"grn",v:"✓ exited (0)"};
    }else{
      yield{t:"yel",v:`File "${fname}" not open. Open it first, then run again.`};
    }
    return;
  }

  // ── python command ────────────────────────────────────────
  if(c.startsWith("python -c ")||c.startsWith("python3 -c ")){
    const offset=c.startsWith("python3")?11:10;
    const code=raw.slice(offset).replace(/^['"`]|['"`]$/g,"");
    yield*runPython(code,false);
    return;
  }
  if(c.startsWith("python ")||c.startsWith("python3 ")){
    const fname=raw.split(" ")[1];
    if(activeFile&&(activeFile.endsWith(fname)||activeFile===fname)){
      yield*runPython(activeCode||"",true,fname);
    }else{
      yield{t:"yel",v:`File "${fname}" not open. Open it first.`};
    }
    return;
  }
  if(c==="python"||c==="python3"){
    yield{t:"inf",v:"Python REPL — type python -c 'code' to run code"};
    yield{t:"dim",v:"Example: python -c 'print(\"Hello World\")'"}; 
    return;
  }

  // ── git ───────────────────────────────────────────────────
  if(c==="ls"||c==="dir"){yield{t:"out",v:"(files are in the Explorer panel)"};return;}
  if(c==="pwd"){yield{t:"out",v:"/workspace"};return;}
  if(c==="git status"){yield{t:"grn",v:"On branch main"};yield{t:"yel",v:"Modified files shown in Explorer (● dot)"};return;}
  if(c==="git add ."||c==="git add"){yield{t:"grn",v:"✓ Staged all changes"};return;}
  if(c.startsWith("git commit")){yield{t:"grn",v:"[main "+Math.random().toString(16).slice(2,9)+"] "+raw.replace(/git commit\s*-m\s*/,"").replace(/['"]/g,"")};return;}
  if(c==="git log"){yield{t:"yel",v:"commit "+Math.random().toString(16).slice(2,16)+" (HEAD -> main)"};yield{t:"out",v:"Date: "+new Date().toDateString()};return;}
  if(c==="git push"){yield{t:"inf",v:"Pushing..."};await sleep(500);yield{t:"grn",v:"✓ Pushed to origin/main"};return;}
  if(c==="git pull"){yield{t:"inf",v:"Pulling..."};await sleep(400);yield{t:"grn",v:"Already up to date."};return;}

  // ── npm ───────────────────────────────────────────────────
  if(c==="npm install"){yield{t:"inf",v:"⚙  Installing packages (simulated)..."};await sleep(600);yield{t:"out",v:"added 847 packages in 8.3s"};yield{t:"grn",v:"✅ Done"};return;}
  if(c==="npm run dev"){yield{t:"inf",v:"VITE dev server starting..."};await sleep(400);yield{t:"grn",v:"  ➜  Local: http://localhost:5173/"};yield{t:"dim",v:"  ➜  Deploy to Vercel/Netlify to share online"};return;}
  if(c==="npm run build"){yield{t:"inf",v:"Building..."};await sleep(600);yield{t:"grn",v:"✓ built in 1.42s — output in dist/"};return;}
  if(c==="npm run start"||c==="npm start"){yield{t:"inf",v:"Starting dev server..."};await sleep(400);yield{t:"grn",v:"  ➜  http://localhost:3000/"};return;}
  if(c==="npm test"){yield{t:"inf",v:"Running tests..."};await sleep(400);yield{t:"grn",v:"Tests  3 passed | 1.2s"};return;}
  if(c==="npm run lint"){yield{t:"inf",v:"Linting..."};await sleep(300);yield{t:"grn",v:"✓ No lint errors"};return;}
  if(c==="npm run preview"){yield{t:"inf",v:"Preview server..."};await sleep(300);yield{t:"grn",v:"  ➜  http://localhost:4173/"};return;}

  // npm create vite
  if(c.startsWith("npm create vite")||c.startsWith("npx create-vite")||c.startsWith("npm init vite")){
    const parts=raw.trim().split(/\s+/);
    const skip=new Set(["npm","npx","create","init","--","--template","react","react-ts","-y","@latest"]);
    const vtWord=["v","i","t","e"].join("");
    skip.add(vtWord);skip.add(vtWord+"@latest");
    const name=parts.find(p=>!skip.has(p)&&!p.startsWith("-"))||"my-app";
    yield{t:"inf",v:`Scaffolding project: ${name}`};await sleep(300);
    yield{t:"out",v:"  src/App.tsx  src/App.css  src/index.tsx"};await sleep(100);
    yield{t:"out",v:"  index.html  package.json"};await sleep(200);
    yield{t:"grn",v:`✓ Done! "${name}" created — see Explorer ✅`};
    yield{t:"dim",v:`Next: cd ${name} && npm install && npm run dev`};
    yield{t:"__vite__",v:name};
    return;
  }

  // npx create-react-app
  if(c.startsWith("npx create-react-app")||c.startsWith("npm create react-app")){
    const name=raw.trim().split(/\s+/)[2]||"my-react-app";
    yield{t:"inf",v:`Creating React app: ${name}...`};await sleep(500);
    yield{t:"grn",v:`✓ Done! "${name}" created — see Explorer ✅`};
    yield{t:"__cra__",v:name};
    return;
  }

  // catch unknown npm/node/npx
  if(c.startsWith("npm ")||c.startsWith("npx ")||c.startsWith("node ")) {
    yield{t:"yel",v:`Unknown command: ${raw}`};
    yield{t:"dim",v:'Type "help" to see all supported commands'};
    return;
  }

  if(c==="deploy"){for(const[d,t,v]of[[200,"inf","▲ Deploying..."],[400,"grn","✓ Build OK"],[400,"out","🌐 Uploading..."],[400,"grn","✅ Deployed!"],[100,"acb","🔗 https://codeforge-app.vercel.app"]]){await sleep(d);yield{t,v};}return;}
  if(c==="clear")return;
  yield{t:"red",v:`not found: ${raw} — type "help" for commands`};
}

async function*runPython(code,showFile,fname){
  yield{t:"inf",v:"⏳ Loading Python runtime (Pyodide)..."};
  const py=await loadPyodide();
  if(!py){
    yield{t:"yel",v:"Could not load Python runtime."};
    yield{t:"dim",v:"Pyodide needs network. Check your connection and retry."};
    return;
  }
  yield{t:"grn",v:"✓ Python 3.11 ready"};
  if(fname)yield{t:"inf",v:`▶ python ${fname}`};
  const logs=[];
  py.setStdout({batched:(s)=>logs.push({t:"out",v:s})});
  py.setStderr({batched:(s)=>logs.push({t:"red",v:s})});
  try{
    await py.runPythonAsync(code);
    if(logs.length===0)yield{t:"dim",v:"(no output)"};
    for(const l of logs)yield l;
    yield{t:"grn",v:"✓ Process exited (0)"};
  }catch(e){
    yield{t:"red",v:String(e).replace("PythonError: ","")};
  }
}

// ── Menu bar ──// ── Menu bar ──────────────────────────────────────────────────
const MENUS=[
  {label:"File",items:[
    {label:"New File",        icon:"📄",key:"⌘N",  act:"new-file"},
    {label:"New Folder",      icon:"📁",key:"",    act:"new-folder"},
    "---",
    {label:"Open File…",      icon:"📂",key:"⌘O",  act:"open-file"},
    {label:"Open Folder…",    icon:"🗂️", key:"⌘⇧O",act:"open-folder"},
    {label:"Open Recent",     icon:"🕐", key:"",    act:"open-recent"},
    "---",
    {label:"Save",            icon:"💾",key:"⌘S",  act:"save"},
    {label:"Save All",        icon:"💾",key:"⌘⇧S", act:"save-all"},
    "---",
    {label:"Close Tab",       icon:"✕", key:"⌘W",  act:"close-tab"},
    {label:"Close All Tabs",  icon:"✕✕",key:"",    act:"close-all"},
  ]},
  {label:"Edit",items:[
    {label:"Undo",            icon:"↩️",key:"⌘Z",  act:"undo"},
    {label:"Redo",            icon:"↪️",key:"⌘⇧Z", act:"redo"},
    "---",
    {label:"Find in Files",   icon:"🔍",key:"⌘⇧F", act:"search"},
    {label:"Format Document", icon:"🎨",key:"⌥⇧F", act:"format"},
  ]},
  {label:"View",items:[
    {label:"Explorer",        icon:"📁",key:"⌘⇧E", act:"files"},
    {label:"Search",          icon:"🔍",key:"⌘⇧F", act:"search"},
    {label:"Source Control",  icon:"🔀",key:"⌘⇧G", act:"git"},
    {label:"Extensions",      icon:"🧩",key:"⌘⇧X", act:"extensions"},
    {label:"AI Copilot",      icon:"✨",key:"⌘I",  act:"ai"},
    "---",
    {label:"Terminal",        icon:"💻",key:"⌘J",  act:"terminal"},
    {label:"Split Editor",    icon:"⬜",key:"⌘\\", act:"split"},
    "---",
    {label:"Zoom In",         icon:"🔍",key:"⌘+",  act:"zoom-in"},
    {label:"Zoom Out",        icon:"🔎",key:"⌘-",  act:"zoom-out"},
    {label:"Reset Zoom",      icon:"⊙", key:"⌘0",  act:"zoom-reset"},
    "---",
    {label:"Desktop Mode",    icon:"🖥️",key:"",    act:"desktop"},
    {label:"Mobile Mode",     icon:"📱",key:"",    act:"mobile"},
    "---",
    {label:"Command Palette", icon:"⚡",key:"⌘⇧P", act:"palette"},
  ]},
  {label:"Run",items:[
    {label:"Run File",        icon:"▶️",key:"F5",   act:"run"},
    "---",
    {label:"npm install",     icon:"📦",key:"",    act:"npm-install"},
    {label:"npm run dev",     icon:"🚀",key:"",    act:"npm-dev"},
    {label:"npm run build",   icon:"🏗️",key:"",    act:"npm-build"},
    {label:"npm test",        icon:"🧪",key:"",    act:"npm-test"},
  ]},
  {label:"Git",items:[
    {label:"Source Control",  icon:"🔀",key:"⌘⇧G", act:"git"},
    "---",
    {label:"Stage All",       icon:"➕",key:"",    act:"git-add"},
    {label:"Commit",          icon:"✅",key:"",    act:"git"},
    {label:"Push",            icon:"⬆️",key:"",    act:"git-push"},
    {label:"Pull",            icon:"⬇️",key:"",    act:"git-pull"},
    "---",
    {label:"View Log",        icon:"📜",key:"",    act:"git-log"},
  ]},
  {label:"Deploy",items:[
    {label:"Deploy to Vercel", icon:"▲", key:"⌘D",  act:"deploy-modal"},
    {label:"Deploy to Netlify",icon:"◆", key:"",    act:"deploy-modal"},
    {label:"Deploy to Railway",icon:"🚂",key:"",    act:"deploy-modal"},
    {label:"Deploy to Docker", icon:"🐳",key:"",    act:"deploy-modal"},
    {label:"Build Production", icon:"🏗️",key:"",    act:"npm-build"},
  ]},
  {label:"Help",items:[
    {label:"Command Palette",    icon:"⚡",key:"⌘⇧P",act:"palette"},
    {label:"Keyboard Shortcuts", icon:"⌨️",key:"",   act:"shortcuts"},
    "---",
    {label:"Open File Guide",    icon:"📂",key:"",   act:"open-guide"},
    {label:"About CodeForge",    icon:"⚡",key:"",   act:"about"},
  ]},
];

function MenuBar({onAct,openMenu,setOpenMenu}){
  const ref=useRef(null);
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpenMenu(null);};
    document.addEventListener("mousedown",h);document.addEventListener("touchstart",h);
    return()=>{document.removeEventListener("mousedown",h);document.removeEventListener("touchstart",h);};
  },[]);
  return(
    <div ref={ref} style={{height:30,background:"#2d2d2d",borderBottom:`1px solid ${D.bdr}`,display:"flex",alignItems:"stretch",flexShrink:0,overflowX:"auto",overflowY:"visible",zIndex:200,userSelect:"none",position:"relative"}}>
      {MENUS.map((m,mi)=>(
        <div key={m.label} style={{position:"relative",flexShrink:0}}>
          <button
            onClick={()=>setOpenMenu(openMenu===mi?null:mi)}
            onMouseEnter={()=>openMenu!==null&&setOpenMenu(mi)}
            style={{height:"100%",padding:"0 10px",background:openMenu===mi?D.sel:"transparent",border:"none",color:openMenu===mi?D.wht:D.txt,fontSize:13,cursor:"pointer",whiteSpace:"nowrap"}}
            onMouseOver={e=>{if(openMenu===null)e.currentTarget.style.background=D.hov;}}
            onMouseOut={e=>{if(openMenu!==mi)e.currentTarget.style.background="transparent";}}>
            {m.label}
          </button>
          {openMenu===mi&&(
            <div style={{position:"fixed",left:ref.current?.children[mi]?.getBoundingClientRect().left||0,top:60,background:D.sb,border:`1px solid ${D.bdr}`,borderRadius:"0 0 8px 8px",zIndex:999,minWidth:220,boxShadow:"0 12px 40px #000d",maxHeight:"70vh",overflowY:"auto"}}>
              {m.items.map((it,ii)=>it==="---"
                ?<div key={ii} style={{height:1,background:D.bdr,margin:"3px 0"}}/>
                :<div key={ii} onClick={()=>{onAct(it.act);setOpenMenu(null);}}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",cursor:"pointer",fontSize:13,color:it.act==="open-file"||it.act==="open-folder"?D.ac:D.txt,fontWeight:it.act==="open-file"||it.act==="open-folder"?600:"normal"}}
                  onMouseEnter={e=>e.currentTarget.style.background=D.sel}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <span style={{width:22,textAlign:"center",fontSize:15}}>{it.icon}</span>
                  <span style={{flex:1}}>{it.label}</span>
                  {it.key&&<span style={{fontSize:11,color:D.dim,whiteSpace:"nowrap"}}>{it.key}</span>}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Context menu ──────────────────────────────────────────────
function CtxMenu({x,y,items,onClose}){
  const ref=useRef(null);
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))onClose();};setTimeout(()=>document.addEventListener("mousedown",h),0);return()=>document.removeEventListener("mousedown",h);},[]);
  return(<div ref={ref} style={{position:"fixed",left:Math.min(x,window.innerWidth-200),top:Math.min(y,window.innerHeight-260),background:D.sb,border:`1px solid ${D.bdr}`,borderRadius:8,zIndex:1000,boxShadow:"0 8px 32px #000d",minWidth:180,overflow:"hidden"}}>
    {items.map((it,i)=>it==="---"
      ?<div key={i} style={{height:1,background:D.bdr,margin:"3px 0"}}/>
      :<div key={i} onClick={()=>{it.action();onClose();}}
        style={{padding:"10px 14px",fontSize:13,color:it.danger?D.red:D.txt,cursor:"pointer",display:"flex",alignItems:"center",gap:10,minHeight:42}}
        onMouseEnter={e=>e.currentTarget.style.background=D.hov}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <span style={{fontSize:16}}>{it.icon}</span><span>{it.label}</span>
      </div>
    )}
  </div>);
}

// ── Inline rename ──────────────────────────────────────────────
function InlineInput({value,onOk,onCancel}){
  const[v,setV]=useState(value),r=useRef(null);
  useEffect(()=>{r.current?.focus();r.current?.select();},[]);
  return(<input ref={r} value={v} onChange={e=>setV(e.target.value)}
    onKeyDown={e=>{if(e.key==="Enter")onOk(v.trim());if(e.key==="Escape")onCancel();}}
    onBlur={()=>onOk(v.trim())}
    style={{flex:1,background:D.inp,border:`1px solid ${D.ac}`,borderRadius:3,padding:"2px 6px",color:D.txt,fontSize:13,outline:"none",fontFamily:"inherit",minWidth:0}}/>);
}

// ── Tree Node ─────────────────────────────────────────────────
function TNode({node,depth=0,active,onOpen,onToggle,onCtx,editId,onEditOk,onEditCancel,fmap}){
  const isF=node.type==="f",fp=isF?(fmap[node.id]||null):null,isAct=fp===active,isEd=editId===node.id,isOpen=!isF&&node.open;
  const lt=useRef(null);
  const startLong=e=>{lt.current=setTimeout(()=>{const t=e.touches?.[0];if(t)onCtx({clientX:t.clientX,clientY:t.clientY},node,isF,fp);},650);};
  const tap=()=>{if(isEd)return;if(isF)onOpen(fp);else onToggle(node.id);};
  return(<div>
    <div onContextMenu={e=>{e.preventDefault();onCtx(e,node,isF,fp);}}
      onTouchStart={startLong} onTouchMove={()=>clearTimeout(lt.current)}
      onTouchEnd={e=>{clearTimeout(lt.current);e.preventDefault();tap();}}
      onClick={tap}
      style={{display:"flex",alignItems:"center",padding:`5px 8px 5px ${depth*16+4}px`,cursor:"pointer",minHeight:36,background:isAct?D.sel:"transparent",color:isAct?D.wht:D.txt,borderLeft:`2px solid ${isAct?D.ac:"transparent"}`,userSelect:"none"}}
      onMouseEnter={e=>{if(!isAct)e.currentTarget.style.background=D.hov;}}
      onMouseLeave={e=>{if(!isAct)e.currentTarget.style.background="transparent";}}>
      {!isF
        ?<span style={{width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:10,color:D.dim,transform:isOpen?"rotate(90deg)":"none",transition:"transform .2s",marginRight:4}}>▶</span>
        :<span style={{width:20,flexShrink:0}}/>}
      <span style={{fontSize:16,marginRight:6,flexShrink:0}}>{isF?(gl(fp||"").i||"📄"):isOpen?"📂":"📁"}</span>
      {isEd
        ?<InlineInput value={node.name} onOk={onEditOk} onCancel={onEditCancel}/>
        :<span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:13}}>{node.name}</span>}
      {!isF&&node.children?.length>0&&!isOpen&&<span style={{fontSize:10,background:D.bdr,color:D.dim,borderRadius:8,padding:"1px 5px",marginLeft:4,flexShrink:0}}>{node.children.length}</span>}
    </div>
    {!isF&&isOpen&&<div style={{animation:"expandDown .15s ease"}}>
      {node.children?.map(c=><TNode key={c.id} node={c} depth={depth+1} active={active} onOpen={onOpen} onToggle={onToggle} onCtx={onCtx} editId={editId} onEditOk={onEditOk} onEditCancel={onEditCancel} fmap={fmap}/>)}
      {node.children?.length===0&&<div style={{padding:`4px 8px 4px ${(depth+1)*16+24}px`,fontSize:12,color:D.dim,fontStyle:"italic"}}>empty</div>}
    </div>}
  </div>);
}

// ── New item row ──────────────────────────────────────────────
function NewRow({type,depth,onOk,onCancel}){
  const[v,setV]=useState(""),r=useRef(null);
  useEffect(()=>r.current?.focus(),[]);
  const ok=()=>v.trim()?onOk(v.trim()):onCancel();
  return(<div style={{display:"flex",alignItems:"center",gap:6,padding:`4px 8px 4px ${depth*16+24}px`,minHeight:34,background:`${D.ac}11`}}>
    <span style={{fontSize:16}}>{type==="f"?"📄":"📁"}</span>
    <input ref={r} value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")ok();if(e.key==="Escape")onCancel();}} onBlur={ok} placeholder={type==="f"?"filename.js":"folder name"} style={{flex:1,background:D.inp,border:`1px solid ${D.ac}`,borderRadius:4,padding:"5px 8px",color:D.txt,fontSize:13,outline:"none"}}/>
  </div>);
}

// ── Code Editor ───────────────────────────────────────────────
function Editor({filename,content,onChange,fontSize}){
  const ta=useRef(null),pre=useRef(null);
  const[ln,setLn]=useState(1),[col,setCol]=useState(1);
  const lines=content.split("\n");
  const sync=()=>{if(ta.current&&pre.current){pre.current.scrollTop=ta.current.scrollTop;pre.current.scrollLeft=ta.current.scrollLeft;}};
  const cursor=()=>{if(!ta.current)return;const b=content.slice(0,ta.current.selectionStart).split("\n");setLn(b.length);setCol(b.pop().length+1);};
  const onTab=e=>{if(e.key!=="Tab")return;e.preventDefault();const s=e.target.selectionStart,end=e.target.selectionEnd;onChange(content.slice(0,s)+"  "+content.slice(end));setTimeout(()=>{ta.current.selectionStart=ta.current.selectionEnd=s+2;},0);};
  return(<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
    <div style={{flex:1,display:"flex",overflow:"hidden",position:"relative"}}>
      <div style={{width:42,flexShrink:0,background:"#1a1a1d",borderRight:`1px solid ${D.bdr}`,textAlign:"right",padding:"10px 4px 10px 0",fontFamily:"'JetBrains Mono',monospace",fontSize:fontSize-1,lineHeight:"1.65",color:D.dim,overflowY:"hidden",userSelect:"none"}}>
        {lines.map((_,i)=><div key={i} style={{color:i+1===ln?D.txt:D.dim,background:i+1===ln?D.lhl:"transparent",paddingRight:4}}>{i+1}</div>)}
      </div>
      <div style={{flex:1,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",left:0,right:0,top:`calc(${ln-1} * ${fontSize*1.65}px + 10px)`,height:fontSize*1.65,background:D.lhl,pointerEvents:"none",zIndex:0}}/>
        <pre ref={pre} aria-hidden style={{position:"absolute",inset:0,margin:0,padding:"10px 10px 10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize,lineHeight:"1.65",color:D.txt,background:"transparent",overflow:"hidden",pointerEvents:"none",whiteSpace:"pre-wrap",wordBreak:"break-word",zIndex:1}} dangerouslySetInnerHTML={{__html:hl(content)}}/>
        <textarea ref={ta} value={content} onChange={e=>{onChange(e.target.value);sync();}} onKeyDown={onTab} onScroll={sync} onKeyUp={cursor} onClick={cursor} spellCheck={false}
          style={{position:"absolute",inset:0,padding:"10px 10px 10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize,lineHeight:"1.65",color:"transparent",caretColor:D.acb,background:"transparent",border:"none",outline:"none",resize:"none",whiteSpace:"pre-wrap",wordBreak:"break-word",overflowY:"auto",overflowX:"auto",zIndex:2,WebkitOverflowScrolling:"touch"}}/>
      </div>
    </div>
    <div style={{height:20,background:"#1a1a1d",borderTop:`1px solid ${D.bdr}`,display:"flex",alignItems:"center",padding:"0 12px",gap:14,fontSize:11,color:D.dim,flexShrink:0}}>
      <span>Ln {ln}, Col {col}</span><span>{lines.length} lines</span><span style={{marginLeft:"auto"}}>{gl(filename).n}</span><span>UTF-8</span>
    </div>
  </div>);
}

// ── Terminal ──────────────────────────────────────────────────
// ── RK Browser ───────────────────────────────────────────────
// ── RK Browser ── resizable split panel ──────────────────────
function RKBrowser({initUrl,onClose,height,onHeightChange,isFullscreen,onToggleFullscreen}){
  const[url,setUrl]=useState(()=>{
    const u=initUrl||"https://www.google.com/webhp?igu=1";
    // localhost cannot load in iframe from deployed site — show helper instead
    return u;
  });
  const[input,setInput]=useState(initUrl||"");
  const[loading,setLoading]=useState(true);
  const[blocked,setBlocked]=useState(false);
  const[canBack,setCanBack]=useState(false);
  const[canFwd,setCanFwd]=useState(false);
  const iframeRef=useRef(null);
  const dragRef=useRef(null);
  const historyRef=useRef([initUrl||"https://www.google.com"]);
  const histIdxRef=useRef(0);

  const isLocalhost=(u)=>u&&(u.includes("localhost")||u.includes("127.0.0.1"));

  const navigate=(dest)=>{
    let u=dest.trim();
    if(!u)return;
    if(!u.startsWith("http")&&!u.startsWith("//")){
      if(u.includes(".")){u="https://"+u;}
      else{u="https://www.google.com/search?q="+encodeURIComponent(u);}
    }
    historyRef.current=historyRef.current.slice(0,histIdxRef.current+1);
    historyRef.current.push(u);
    histIdxRef.current=historyRef.current.length-1;
    setUrl(u);setInput(u);
    setBlocked(isLocalhost(u));
    setLoading(!isLocalhost(u));
    setCanBack(histIdxRef.current>0);
    setCanFwd(histIdxRef.current<historyRef.current.length-1);
  };

  useEffect(()=>{
    if(isLocalhost(url)){setBlocked(true);setLoading(false);}
  },[url]);

  const goBack=()=>{
    if(histIdxRef.current>0){
      histIdxRef.current--;
      const u=historyRef.current[histIdxRef.current];
      navigate(u);
    }
  };
  const goFwd=()=>{
    if(histIdxRef.current<historyRef.current.length-1){
      histIdxRef.current++;
      const u=historyRef.current[histIdxRef.current];
      navigate(u);
    }
  };
  const refresh=()=>{
    if(!isLocalhost(url)){setLoading(true);if(iframeRef.current)iframeRef.current.src=url;}
  };

  // ── Drag to resize ────────────────────────────────────────
  const startDrag=useCallback((e)=>{
    e.preventDefault();
    const startY=e.touches?e.touches[0].clientY:e.clientY;
    const startH=height;
    const onMove=(ev)=>{
      const y=ev.touches?ev.touches[0].clientY:ev.clientY;
      const diff=startY-y;
      const newH=Math.min(window.innerHeight*0.9,Math.max(120,startH+diff));
      onHeightChange(newH);
    };
    const onUp=()=>{
      document.removeEventListener("mousemove",onMove);
      document.removeEventListener("mouseup",onUp);
      document.removeEventListener("touchmove",onMove);
      document.removeEventListener("touchend",onUp);
    };
    document.addEventListener("mousemove",onMove);
    document.addEventListener("mouseup",onUp);
    document.addEventListener("touchmove",onMove,{passive:false});
    document.addEventListener("touchend",onUp);
  },[height,onHeightChange]);

  const quickLinks=[
    {l:"Google",u:"https://www.google.com/webhp?igu=1"},
    {l:"GitHub",u:"https://github.com"},
    {l:"MDN",u:"https://developer.mozilla.org"},
    {l:"npm",u:"https://npmjs.com"},
    {l:"Can I Use",u:"https://caniuse.com"},
    {l:"Vercel",u:"https://vercel.com"},
    {l:"Netlify",u:"https://netlify.com"},
    {l:"StackOverflow",u:"https://stackoverflow.com"},
  ];

  const h=isFullscreen?"100%":`${height}px`;

  return(
    <div style={{
      height:h,
      background:D.bg,
      display:"flex",flexDirection:"column",
      flexShrink:0,
      borderTop:"2px solid #4fc3f7",
      overflow:"hidden",
      transition:isFullscreen?"none":"none",
    }}>
      {/* ── Drag handle ── */}
      {!isFullscreen&&(
        <div
          ref={dragRef}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          style={{
            height:14,background:"#0d1117",cursor:"ns-resize",
            display:"flex",alignItems:"center",justifyContent:"center",
            flexShrink:0,userSelect:"none",borderBottom:`1px solid ${D.bdr}`,
          }}>
          <div style={{width:40,height:4,borderRadius:2,background:"#4fc3f755"}}/>
          <span style={{fontSize:10,color:"#4fc3f7",marginLeft:8,fontWeight:700,letterSpacing:".1em"}}>
            ⠿ DRAG TO RESIZE
          </span>
          <div style={{width:40,height:4,borderRadius:2,background:"#4fc3f755",marginLeft:8}}/>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div style={{
        height:44,background:"#0d0d1f",
        borderBottom:`1px solid ${D.bdr}`,
        display:"flex",alignItems:"center",
        gap:4,padding:"0 8px",flexShrink:0,
      }}>
        {/* Brand */}
        <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0,marginRight:4}}>
          <span style={{fontSize:16}}>🌐</span>
          <span style={{fontSize:11,fontWeight:800,color:"#4fc3f7",letterSpacing:".06em"}}>RK</span>
        </div>

        {/* Nav buttons */}
        <button onClick={goBack} disabled={!canBack} style={{background:"none",border:"none",color:canBack?"#ccc":D.dim,cursor:canBack?"pointer":"default",fontSize:20,padding:"0 4px",lineHeight:1,flexShrink:0}}>‹</button>
        <button onClick={goFwd}  disabled={!canFwd}  style={{background:"none",border:"none",color:canFwd?"#ccc":D.dim,cursor:canFwd?"pointer":"default",fontSize:20,padding:"0 4px",lineHeight:1,flexShrink:0}}>›</button>
        <button onClick={refresh} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:14,padding:"0 4px",lineHeight:1,flexShrink:0}}>↻</button>

        {/* Address bar */}
        <form onSubmit={e=>{e.preventDefault();navigate(input);}} style={{flex:1,display:"flex",alignItems:"center",gap:4}}>
          <div style={{flex:1,display:"flex",alignItems:"center",background:"#111",border:`1px solid ${D.bdr}`,borderRadius:16,padding:"0 10px",height:30,gap:4}}>
            <span style={{fontSize:12,flexShrink:0}}>
              {isLocalhost(url)?"💻":url.startsWith("https")?"🔒":"🌐"}
            </span>
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onFocus={e=>e.target.select()}
              placeholder="Search or paste URL..."
              style={{flex:1,background:"transparent",border:"none",outline:"none",color:D.txt,fontSize:12,fontFamily:"inherit",minWidth:0}}/>
            {input&&<button type="button" onClick={()=>setInput("")} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:12,padding:0,flexShrink:0}}>✕</button>}
          </div>
          <button type="submit" style={{background:D.ac,border:"none",borderRadius:8,padding:"5px 10px",color:"#fff",fontSize:12,cursor:"pointer",flexShrink:0,fontWeight:600}}>Go</button>
        </form>

        {/* Fullscreen toggle */}
        <button onClick={onToggleFullscreen} title={isFullscreen?"Exit fullscreen":"Fullscreen"}
          style={{background:"none",border:`1px solid ${D.bdr}`,borderRadius:4,padding:"4px 6px",color:D.dim,cursor:"pointer",fontSize:13,flexShrink:0}}>
          {isFullscreen?"⊡":"⊞"}
        </button>
        {/* Close */}
        <button onClick={onClose}
          style={{background:`${D.red}22`,border:`1px solid ${D.red}55`,borderRadius:4,padding:"4px 8px",color:D.red,cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0}}>✕</button>
      </div>

      {/* ── Quick links ── */}
      <div style={{height:30,background:"#0a0a0f",borderBottom:`1px solid ${D.bdr}`,display:"flex",alignItems:"center",gap:4,padding:"0 6px",overflow:"auto",flexShrink:0}}>
        {quickLinks.map(({l,u})=>(
          <button key={l} onClick={()=>navigate(u)}
            style={{background:url.includes(u.split("//")[1]?.split("/")[0]||"~")?`${D.ac}33`:"#111",
              border:`1px solid ${url.includes(u.split("//")[1]?.split("/")[0]||"~")?D.ac:D.bdr}`,
              borderRadius:10,padding:"2px 8px",color:D.dim,cursor:"pointer",fontSize:10,
              whiteSpace:"nowrap",flexShrink:0}}>
            {l}
          </button>
        ))}
        {loading&&!blocked&&<span style={{marginLeft:"auto",fontSize:10,color:D.ac,flexShrink:0,animation:"blink 1s infinite",paddingRight:8}}>Loading...</span>}
      </div>

      {/* ── Content area ── */}
      <div style={{flex:1,position:"relative",overflow:"hidden",background:"#fff"}}>

        {/* Localhost blocked — show clear explanation */}
        {blocked&&(
          <div style={{position:"absolute",inset:0,background:D.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,padding:20,zIndex:2}}>
            <div style={{fontSize:40}}>💻</div>
            <div style={{color:D.txt,fontSize:15,fontWeight:700,textAlign:"center"}}>localhost cannot open here</div>
            <div style={{color:D.dim,fontSize:13,textAlign:"center",lineHeight:1.8,maxWidth:300}}>
              <strong style={{color:D.yel}}>Why?</strong> CodeForge runs on Vercel (the internet).<br/>
              <code style={{color:D.ac,background:"#111",padding:"2px 6px",borderRadius:4}}>{url}</code><br/>
              only exists on your local machine — the browser on your phone cannot reach it from a deployed website.
            </div>
            <div style={{background:"#111",border:`1px solid ${D.bdr}`,borderRadius:10,padding:"12px 16px",maxWidth:300,width:"100%"}}>
              <div style={{color:D.grn,fontWeight:700,fontSize:13,marginBottom:8}}>✅ Solutions:</div>
              <div style={{color:D.txt,fontSize:12,lineHeight:2}}>
                1. Run CodeForge <strong>locally</strong> on your PC (same machine as dev server)<br/>
                2. Use <strong>ngrok</strong>: <code style={{color:D.ac}}>npx ngrok http 3000</code> → get public URL<br/>
                3. Use <strong>localtunnel</strong>: <code style={{color:D.ac}}>npx localtunnel --port 3000</code><br/>
                4. <strong>Deploy your app</strong> to Vercel/Netlify → works everywhere
              </div>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
              <button onClick={()=>navigate("https://www.google.com")}
                style={{background:D.ac,border:"none",borderRadius:8,padding:"8px 16px",color:"#fff",cursor:"pointer",fontSize:13}}>
                🌐 Browse Web Instead
              </button>
              <button onClick={()=>window.open(url,"_blank")}
                style={{background:`${D.grn}22`,border:`1px solid ${D.grn}`,borderRadius:8,padding:"8px 16px",color:D.grn,cursor:"pointer",fontSize:13}}>
                ↗ Try External Browser
              </button>
            </div>
          </div>
        )}

        {/* Loading spinner */}
        {loading&&!blocked&&(
          <div style={{position:"absolute",inset:0,background:"#fff",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,zIndex:1}}>
            <div style={{display:"flex",gap:6}}>{[0,1,2].map(i=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:D.ac,animation:`pulse 1s ${i*.2}s infinite`}}/>)}</div>
            <div style={{color:"#333",fontSize:13,maxWidth:260,textAlign:"center",wordBreak:"break-all"}}>{url}</div>
            <div style={{color:"#666",fontSize:12}}>If page doesn't load, it blocks iframes.</div>
            <button onClick={()=>window.open(url,"_blank")}
              style={{background:`${D.ac}22`,border:`1px solid ${D.ac}`,borderRadius:8,padding:"7px 14px",color:D.ac,cursor:"pointer",fontSize:12}}>
              Open in System Browser ↗
            </button>
          </div>
        )}

        {/* iframe */}
        {!blocked&&(
          <iframe
            ref={iframeRef}
            src={url}
            style={{width:"100%",height:"100%",border:"none",display:loading?"none":"block"}}
            onLoad={()=>setLoading(false)}
            onError={()=>setLoading(false)}
            allow="fullscreen"
            title="RK Browser"/>
        )}
      </div>
    </div>
  );
}

// ── Terminal with clickable links ─────────────────────────────
function Term({lines,onRun,input,setInput,running,onOpenBrowser}){
  const r=useRef(null);
  useEffect(()=>r.current?.scrollIntoView({behavior:"smooth"}),[lines]);
  const C={sys:D.ac,inf:D.blu,out:D.txt,grn:D.grn,red:D.red,yel:D.yel,dim:D.dim,acb:D.acb};

  // Detect URLs in line text and make them clickable
  const renderLine=(text,color)=>{
    const urlReg=/(https?:\/\/[^\s]+|http:\/\/localhost:[0-9]+[^\s]*)/g;
    const parts=[];let last=0;let m;
    while((m=urlReg.exec(text))!==null){
      if(m.index>last)parts.push(<span key={last}>{text.slice(last,m.index)}</span>);
      const u=m[0];
      parts.push(
        <span key={m.index}
          onClick={()=>onOpenBrowser&&onOpenBrowser(u)}
          style={{color:D.acb,textDecoration:"underline",cursor:"pointer",fontWeight:600}}
          title={`Open ${u} in RK Browser`}>
          {u} 🌐
        </span>
      );
      last=m.index+u.length;
    }
    if(last<text.length)parts.push(<span key={last}>{text.slice(last)}</span>);
    return parts.length>0?parts:text;
  };

  return(<div style={{display:"flex",flexDirection:"column",height:"100%",background:"#141414"}}>
    <div style={{flex:1,overflow:"auto",padding:"6px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.7,WebkitOverflowScrolling:"touch"}}>
      {lines.map((l,i)=>(
        <div key={i} style={{color:C[l.t]||D.txt,whiteSpace:"pre-wrap",wordBreak:"break-all"}}>
          {renderLine(l.v, C[l.t]||D.txt)}
        </div>
      ))}
      <div ref={r}/>
    </div>
    <div style={{display:"flex",alignItems:"center",borderTop:`1px solid ${D.bdr}`,padding:"6px 10px",gap:6,background:D.bg}}>
      <span style={{fontFamily:"monospace",fontSize:13,color:D.grn,flexShrink:0}}>$</span>
      <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onRun()} disabled={running} placeholder="command..." style={{flex:1,background:"transparent",border:"none",outline:"none",color:D.txt,fontFamily:"'JetBrains Mono',monospace",fontSize:13,opacity:running?.5:1}}/>
      <button onClick={onRun} disabled={running} style={{background:D.ac,border:"none",borderRadius:4,padding:"5px 12px",color:"#fff",fontSize:12,cursor:"pointer",flexShrink:0}}>▶</button>
    </div>
  </div>);
}

// ── Search ────────────────────────────────────────────────────
function SearchPanel({files,onOpen}){
  const[q,setQ]=useState("");
  const res=q.trim()?Object.entries(files).flatMap(([k,v])=>v.split("\n").reduce((a,l,i)=>{if(l.toLowerCase().includes(q.toLowerCase()))a.push({file:k,line:i+1,text:l.trim()});return a;},[]).slice(0,4)).slice(0,30):[];
  return(<div style={{height:"100%",display:"flex",flexDirection:"column"}}>
    <div style={{padding:"10px 12px",borderBottom:`1px solid ${D.bdr}`}}>
      <input value={q} onChange={e=>setQ(e.target.value)} autoFocus placeholder="Search across all files..."
        style={{width:"100%",background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:6,padding:"9px 12px",color:D.txt,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
      {res.length>0&&<div style={{fontSize:11,color:D.dim,marginTop:6}}>{res.length} results</div>}
    </div>
    <div style={{flex:1,overflow:"auto",WebkitOverflowScrolling:"touch"}}>
      {res.map((r,i)=><div key={i} onClick={()=>onOpen(r.file)} style={{padding:"8px 12px",cursor:"pointer",borderBottom:`1px solid ${D.bdr}22`,minHeight:48}} onMouseEnter={e=>e.currentTarget.style.background=D.hov} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <div style={{fontSize:11,color:D.ac,marginBottom:2}}>{r.file}:{r.line}</div>
        <div style={{fontSize:12,color:D.txt,fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.text}</div>
      </div>)}
      {q&&res.length===0&&<div style={{padding:20,color:D.dim,fontSize:13,textAlign:"center"}}>No results</div>}
    </div>
  </div>);
}

// ── Git ───────────────────────────────────────────────────────
function GitPanel({modified}){
  const[msg,setMsg]=useState(""),[done,setDone]=useState(false);
  const commit=()=>{if(!msg.trim())return;setDone(true);setMsg("");setTimeout(()=>setDone(false),3000);};
  return(<div style={{height:"100%",overflow:"auto",WebkitOverflowScrolling:"touch"}}>
    <div style={{padding:"10px 12px",borderBottom:`1px solid ${D.bdr}`}}>
      <div style={{fontSize:12,color:D.txt,display:"flex",gap:8,alignItems:"center"}}><span style={{color:D.ac}}>⎇</span> main{done&&<span style={{color:D.grn,marginLeft:"auto",fontSize:11}}>✓ Committed</span>}</div>
    </div>
    <div style={{padding:"10px 12px",borderBottom:`1px solid ${D.bdr}`}}>
      <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Commit message…" rows={3} onKeyDown={e=>e.ctrlKey&&e.key==="Enter"&&commit()} style={{width:"100%",background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:6,padding:"8px 10px",color:D.txt,fontSize:13,resize:"none",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
      <button onClick={commit} style={{width:"100%",marginTop:8,background:D.ac,border:"none",borderRadius:6,padding:"10px",color:"#fff",fontWeight:600,cursor:"pointer",fontSize:13}}>✓ Commit to main</button>
    </div>
    <div style={{padding:"10px 12px"}}>
      <div style={{fontSize:11,color:D.dim,marginBottom:8,textTransform:"uppercase"}}>Changes ({modified.length})</div>
      {modified.length===0&&<div style={{color:D.dim,fontSize:13}}>Workspace clean</div>}
      {modified.map(f=><div key={f} style={{display:"flex",gap:8,padding:"5px 0",fontSize:13,alignItems:"center"}}><span style={{color:D.yel,fontWeight:700,fontSize:11,width:14,flexShrink:0}}>M</span><span style={{color:D.txt}}>{f}</span></div>)}
    </div>
    <div style={{padding:"10px 12px",borderTop:`1px solid ${D.bdr}`}}>
      <div style={{fontSize:11,color:D.dim,marginBottom:8,textTransform:"uppercase"}}>Branches</div>
      {["main","develop","feature/auth","fix/bug"].map(b=><div key={b} style={{fontSize:13,color:b==="main"?D.ac:D.dim,padding:"5px 4px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,minHeight:34}}><span>{b==="main"?"●":"○"}</span>{b}</div>)}
    </div>
  </div>);
}

// ── Extensions ────────────────────────────────────────────────
const EXT=[{id:1,n:"Prettier",p:"Prettier",i:"💅",d:"Formatter",dl:"38M",on:true},{id:2,n:"ESLint",p:"Microsoft",i:"🔍",d:"Linter",dl:"30M",on:true},{id:3,n:"GitLens",p:"GitKraken",i:"🔮",d:"Git tools",dl:"22M",on:true},{id:4,n:"Tailwind",p:"Tailwind",i:"🌊",d:"CSS",dl:"15M",on:false},{id:5,n:"Docker",p:"Microsoft",i:"🐳",d:"Containers",dl:"12M",on:false},{id:6,n:"Thunder",p:"Ranga",i:"⚡",d:"REST client",dl:"8M",on:false},{id:7,n:"Copilot",p:"GitHub",i:"🤖",d:"AI coding",dl:"6M",on:false}];
function ExtPanel(){
  const[exts,setExts]=useState(EXT),[q,setQ]=useState("");
  const toggle=id=>setExts(e=>e.map(x=>x.id===id?{...x,on:!x.on,loading:!x.on}:x));
  useEffect(()=>{const ts=exts.filter(e=>e.loading).map(e=>setTimeout(()=>setExts(ex=>ex.map(x=>x.id===e.id?{...x,loading:false}:x)),1400));return()=>ts.forEach(clearTimeout);},[exts]);
  return(<div style={{height:"100%",display:"flex",flexDirection:"column"}}>
    <div style={{padding:"10px 12px",borderBottom:`1px solid ${D.bdr}`}}>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search extensions..." style={{width:"100%",background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:6,padding:"9px 12px",color:D.txt,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
    </div>
    <div style={{flex:1,overflow:"auto",WebkitOverflowScrolling:"touch"}}>
      {exts.filter(e=>!q||e.n.toLowerCase().includes(q.toLowerCase())).map(ext=>(
        <div key={ext.id} style={{padding:"12px",borderBottom:`1px solid ${D.bdr}22`,display:"flex",gap:12,alignItems:"flex-start"}}>
          <span style={{fontSize:26,flexShrink:0}}>{ext.i}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,color:D.txt,fontWeight:600}}>{ext.n}</div>
            <div style={{fontSize:12,color:D.dim,marginTop:2}}>{ext.p} · ⬇ {ext.dl}</div>
            <div style={{fontSize:12,color:D.dim,marginTop:2}}>{ext.d}</div>
          </div>
          <button onClick={()=>toggle(ext.id)} style={{flexShrink:0,background:ext.on?D.hov:D.ac,border:`1px solid ${ext.on?D.bdr:D.ac}`,borderRadius:6,padding:"6px 12px",fontSize:12,color:ext.on?D.dim:"#fff",cursor:"pointer",whiteSpace:"nowrap",minHeight:32}}>{ext.loading?"Installing…":ext.on?"Uninstall":"Install"}</button>
        </div>
      ))}
    </div>
  </div>);
}

// ── Settings ──────────────────────────────────────────────────
function SettingsPanel({s,set,dm,setDm,zoom,setZoom}){
  return(<div style={{height:"100%",overflow:"auto",WebkitOverflowScrolling:"touch"}}>
    <div style={{padding:"12px",borderBottom:`1px solid ${D.bdr}`,background:D.hov}}>
      <div style={{fontSize:13,color:D.ac,fontWeight:600,marginBottom:10}}>View Mode</div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setDm(false)} style={{flex:1,padding:"10px 0",borderRadius:8,border:`2px solid ${!dm?D.ac:D.bdr}`,background:!dm?`${D.ac}22`:"transparent",color:!dm?D.ac:D.dim,cursor:"pointer",fontSize:13,fontWeight:600}}>📱 Mobile</button>
        <button onClick={()=>setDm(true)}  style={{flex:1,padding:"10px 0",borderRadius:8,border:`2px solid ${dm?D.ac:D.bdr}`,background:dm?`${D.ac}22`:"transparent",color:dm?D.ac:D.dim,cursor:"pointer",fontSize:13,fontWeight:600}}>🖥️ Desktop</button>
      </div>
    </div>
    <div style={{padding:"12px",borderBottom:`1px solid ${D.bdr}`}}>
      <div style={{fontSize:13,color:D.ac,fontWeight:600,marginBottom:10}}>🔍 Zoom: {Math.round(zoom*100)}%</div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button onClick={()=>setZoom(z=>Math.max(.5,+(z-.1).toFixed(1)))} style={{width:42,height:42,background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:8,color:D.txt,fontSize:22,cursor:"pointer"}}>−</button>
        <input type="range" min={50} max={200} value={Math.round(zoom*100)} onChange={e=>setZoom(+(e.target.value/100).toFixed(2))} style={{flex:1,accentColor:D.ac}}/>
        <button onClick={()=>setZoom(z=>Math.min(2,+(z+.1).toFixed(1)))} style={{width:42,height:42,background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:8,color:D.txt,fontSize:22,cursor:"pointer"}}>+</button>
      </div>
      <button onClick={()=>setZoom(1)} style={{width:"100%",marginTop:8,background:"transparent",border:`1px solid ${D.bdr}`,borderRadius:6,padding:6,color:D.dim,cursor:"pointer",fontSize:12}}>Reset 100%</button>
    </div>
    {[{k:"fontSize",l:"Font Size",t:"range",min:10,max:20},{k:"tabSize",l:"Tab Size",t:"sel",opts:[2,4,8]},{k:"wordWrap",l:"Word Wrap",t:"tog"},{k:"autoSave",l:"Auto Save",t:"tog"},{k:"lineNumbers",l:"Line Numbers",t:"tog"}].map(({k,l,t,min,max,opts})=>(
      <div key={k} style={{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,borderBottom:`1px solid ${D.bdr}11`,minHeight:46}}>
        <span style={{fontSize:13,color:D.txt}}>{l}</span>
        {t==="tog"&&<div onClick={()=>set(k,!s[k])} style={{width:42,height:24,borderRadius:12,cursor:"pointer",background:s[k]?D.ac:D.bdr,position:"relative",transition:"background .2s",flexShrink:0}}><div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:s[k]?20:2,transition:"left .2s"}}/></div>}
        {t==="range"&&<div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,color:D.ac,width:24,textAlign:"center"}}>{s[k]}</span><input type="range" min={min} max={max} value={s[k]} onChange={e=>set(k,+e.target.value)} style={{width:90,accentColor:D.ac}}/></div>}
        {t==="sel"&&<select value={s[k]} onChange={e=>set(k,+e.target.value)} style={{background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:6,padding:"5px 10px",color:D.txt,fontSize:13,outline:"none"}}>{opts.map(o=><option key={o}>{o}</option>)}</select>}
      </div>
    ))}
  </div>);
}

// ── AI Copilot ────────────────────────────────────────────────
function AICopilot({file,content}){
  const[msgs,setMsgs]=useState([{r:"ai",t:`👋 AI assistant ready. File: \`${file}\`. Ask me anything!`}]);
  const[q,setQ]=useState(""),[loading,setL]=useState(false),r=useRef(null);
  useEffect(()=>r.current?.scrollIntoView({behavior:"smooth"}),[msgs]);
  const send=async()=>{
    if(!q.trim()||loading)return;
    const question=q.trim();setQ("");setMsgs(m=>[...m,{r:"user",t:question}]);setL(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Expert developer assistant.\nFile: ${file}\n\`\`\`\n${(content||"").slice(0,1200)}\n\`\`\`\nUser: ${question}\nBe concise. Max 250 words.`}]})});
      const d=await res.json();setMsgs(m=>[...m,{r:"ai",t:d.content?.[0]?.text||"Error."}]);
    }catch{setMsgs(m=>[...m,{r:"ai",t:"Network error."}]);}
    setL(false);
  };
  return(<div style={{height:"100%",display:"flex",flexDirection:"column"}}>
    <div style={{padding:"10px 12px",borderBottom:`1px solid ${D.bdr}`,display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${D.ac},${D.pur})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✨</div>
      <div><div style={{fontSize:13,fontWeight:600,color:D.txt}}>AI Copilot</div><div style={{fontSize:11,color:D.grn}}>● {file}</div></div>
    </div>
    <div style={{flex:1,overflow:"auto",padding:12,display:"flex",flexDirection:"column",gap:10,WebkitOverflowScrolling:"touch"}}>
      {msgs.map((m,i)=><div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.r==="user"?"flex-end":"flex-start"}}>
        <div style={{maxWidth:"88%",padding:"10px 14px",borderRadius:m.r==="user"?"14px 14px 2px 14px":"14px 14px 14px 2px",background:m.r==="user"?D.ac:D.sb,color:m.r==="user"?"#fff":D.txt,fontSize:13,lineHeight:1.6,border:m.r==="ai"?`1px solid ${D.bdr}`:"none",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{m.t}</div>
      </div>)}
      {loading&&<div style={{display:"flex",gap:5,padding:8}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:D.ac,animation:`pulse 1s ${i*.2}s infinite`}}/>)}</div>}
      <div ref={r}/>
    </div>
    {msgs.length<=2&&<div style={{padding:"0 12px 10px",display:"flex",flexWrap:"wrap",gap:6}}>{["Explain","Find bugs","Add types","Write tests","Refactor"].map(h=><button key={h} onClick={()=>setQ(h)} style={{background:D.sb,border:`1px solid ${D.bdr}`,borderRadius:6,padding:"6px 10px",color:D.dim,fontSize:12,cursor:"pointer"}}>{h}</button>)}</div>}
    <div style={{padding:12,borderTop:`1px solid ${D.bdr}`,display:"flex",gap:8}}>
      <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about your code..." style={{flex:1,background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:8,padding:"10px 12px",color:D.txt,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
      <button onClick={send} disabled={loading} style={{background:D.ac,border:"none",borderRadius:8,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",cursor:loading?"not-allowed":"pointer",opacity:loading?.5:1,color:"#fff",fontSize:18}}>▶</button>
    </div>
  </div>);
}

// ── Command Palette ───────────────────────────────────────────
const CMDS=[{id:"open-file",l:"Open File…",k:"⌘O",e:"📂"},{id:"open-folder",l:"Open Folder…",k:"⌘⇧O",e:"🗂️"},{id:"new-file",l:"New File",k:"⌘N",e:"📄"},{id:"new-folder",l:"New Folder",k:"",e:"📁"},{id:"save",l:"Save",k:"⌘S",e:"💾"},{id:"save-all",l:"Save All",k:"⌘⇧S",e:"💾"},{id:"close-tab",l:"Close Tab",k:"⌘W",e:"✕"},{id:"files",l:"Explorer",k:"⌘⇧E",e:"📁"},{id:"search",l:"Search",k:"⌘⇧F",e:"🔍"},{id:"git",l:"Source Control",k:"⌘⇧G",e:"🔀"},{id:"extensions",l:"Extensions",k:"⌘⇧X",e:"🧩"},{id:"ai",l:"AI Copilot",k:"⌘I",e:"✨"},{id:"settings",l:"Settings",k:"⌘,",e:"⚙️"},{id:"terminal",l:"Toggle Terminal",k:"⌘J",e:"💻"},{id:"split",l:"Split Editor",k:"⌘\\",e:"⬜"},{id:"deploy-modal",l:"Deploy",k:"⌘D",e:"🚀"},{id:"run",l:"Run",k:"F5",e:"▶"},{id:"zoom-in",l:"Zoom In",k:"⌘+",e:"🔍"},{id:"zoom-out",l:"Zoom Out",k:"⌘-",e:"🔎"},{id:"zoom-reset",l:"Reset Zoom",k:"⌘0",e:"⊙"}];
function CmdPalette({onClose,onCmd}){
  const[q,setQ]=useState(""),[sel,setSel]=useState(0);
  const f=CMDS.filter(c=>!q||c.l.toLowerCase().includes(q.toLowerCase()));
  useEffect(()=>setSel(0),[q]);
  const run=c=>{onCmd(c.id);onClose();};
  return(<div style={{position:"fixed",inset:0,background:"#00000090",zIndex:900,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:"8vh",backdropFilter:"blur(6px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{width:"min(560px,95vw)",background:D.sb,borderRadius:10,border:`1px solid ${D.bdr}`,overflow:"hidden",boxShadow:"0 24px 60px #000d"}}>
      <input autoFocus value={q} onChange={e=>setQ(e.target.value)}
        onKeyDown={e=>{if(e.key==="ArrowDown"){e.preventDefault();setSel(s=>Math.min(s+1,f.length-1));}if(e.key==="ArrowUp"){e.preventDefault();setSel(s=>Math.max(s-1,0));}if(e.key==="Enter")run(f[sel]);if(e.key==="Escape")onClose();}}
        placeholder="> Search commands, open files..."
        style={{width:"100%",background:D.inp,border:"none",borderBottom:`1px solid ${D.bdr}`,padding:"14px 16px",color:D.txt,fontSize:15,outline:"none",fontFamily:"'JetBrains Mono',monospace",boxSizing:"border-box"}}/>
      <div style={{maxHeight:"55vh",overflow:"auto",WebkitOverflowScrolling:"touch"}}>
        {f.map((c,i)=>(
          <div key={c.id} onClick={()=>run(c)} onMouseEnter={()=>setSel(i)}
            style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",background:i===sel?D.sel:"transparent",color:i===sel?D.wht:c.id==="open-file"||c.id==="open-folder"?D.ac:D.txt,minHeight:46,fontWeight:c.id==="open-file"||c.id==="open-folder"?600:"normal"}}>
            <span style={{fontSize:18,width:26,textAlign:"center"}}>{c.e}</span>
            <span style={{flex:1,fontSize:14}}>{c.l}</span>
            {c.k&&<span style={{fontSize:11,color:D.dim,background:D.bdr,borderRadius:4,padding:"2px 7px"}}>{c.k}</span>}
          </div>
        ))}
      </div>
    </div>
  </div>);
}

// ── Deploy Modal ──────────────────────────────────────────────
function DeployModal({onClose}){
  const[plat,setPlat]=useState(null),[step,setStep]=useState(0),[log,setLog]=useState([]),[url,setUrl]=useState("");
  const PS=[{id:"vercel",n:"Vercel",i:"▲",d:"Serverless"},{id:"netlify",n:"Netlify",i:"◆",d:"Static"},{id:"railway",n:"Railway",i:"🚂",d:"Full-Stack"},{id:"docker",n:"Docker",i:"🐳",d:"Container"},{id:"aws",n:"AWS",i:"🔶",d:"Lambda"},{id:"render",n:"Render",i:"🔷",d:"Auto-deploy"}];
  const deploy=async()=>{setStep(2);setLog([]);for(const[d,t,v]of[[200,"inf","📦 Bundling..."],[300,"grn","✓ Build OK"],[300,"out","🌐 Uploading..."],[400,"grn","✅ Deployed!"],[100,"acb",`🔗 https://codeforge.${plat.id}.app`]]){await sleep(d);setLog(l=>[...l,{t,v}]);}setUrl(`https://codeforge.${plat.id}.app`);};
  const C={inf:D.blu,out:D.txt,grn:D.grn,acb:D.acb};
  return(<div style={{position:"fixed",inset:0,background:"#000b",zIndex:850,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(6px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{width:"100%",maxWidth:480,background:D.sb,borderRadius:"16px 16px 0 0",border:`1px solid ${D.bdr}`,overflow:"hidden",maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{padding:"16px",borderBottom:`1px solid ${D.bdr}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:15,fontWeight:700,color:D.txt}}>🚀 Deploy to Production</span><button onClick={onClose} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:22}}>✕</button></div>
      {step===0&&<div style={{padding:16}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{PS.map(p=><button key={p.id} onClick={()=>{setPlat(p);setStep(1);}} style={{background:D.bg,border:`1px solid ${D.bdr}`,borderRadius:10,padding:"14px 10px",cursor:"pointer",textAlign:"left",minHeight:80}} onMouseEnter={e=>e.currentTarget.style.borderColor=D.ac} onMouseLeave={e=>e.currentTarget.style.borderColor=D.bdr}><div style={{fontSize:24,marginBottom:6}}>{p.i}</div><div style={{fontSize:14,fontWeight:600,color:D.txt}}>{p.n}</div><div style={{fontSize:12,color:D.dim}}>{p.d}</div></button>)}</div></div>}
      {step===1&&plat&&<div style={{padding:16}}><div style={{fontSize:24,textAlign:"center",marginBottom:8}}>{plat.i}</div><div style={{fontSize:15,fontWeight:600,color:D.txt,textAlign:"center",marginBottom:16}}>{plat.n}</div>{[["Project","codeforge-app"],["Branch","main"],["Build","npm run build"],["Output","dist"]].map(([l,v])=><div key={l} style={{marginBottom:12}}><div style={{fontSize:11,color:D.dim,marginBottom:4,textTransform:"uppercase"}}>{l}</div><input defaultValue={v} style={{width:"100%",background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:6,padding:"10px 12px",color:D.txt,fontSize:13,outline:"none",boxSizing:"border-box"}}/></div>)}<div style={{display:"flex",gap:10,marginTop:8}}><button onClick={()=>setStep(0)} style={{flex:1,background:D.hov,border:`1px solid ${D.bdr}`,borderRadius:8,padding:"12px",color:D.dim,cursor:"pointer",fontSize:13}}>Back</button><button onClick={deploy} style={{flex:2,background:D.ac,border:"none",borderRadius:8,padding:"12px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>🚀 Deploy Now</button></div></div>}
      {step===2&&<div style={{padding:16}}><div style={{background:D.bg,borderRadius:10,padding:12,fontFamily:"monospace",fontSize:12,lineHeight:1.8,maxHeight:200,overflow:"auto",border:`1px solid ${D.bdr}`}}>{log.map((l,i)=><div key={i} style={{color:C[l.t]||D.txt}}>{l.v}</div>)}{!url&&<span style={{color:D.ac,animation:"blink 1s infinite"}}>▌</span>}</div>{url&&<div style={{marginTop:14,textAlign:"center"}}><div style={{fontSize:32}}>🎉</div><div style={{color:D.grn,fontWeight:700,fontSize:15,margin:"8px 0 4px"}}>Live!</div><div style={{color:D.ac,fontSize:13,background:D.bg,padding:"8px 14px",borderRadius:8,border:`1px solid ${D.bdr}`,marginBottom:14}}>{url}</div><button onClick={onClose} style={{background:D.ac,border:"none",borderRadius:8,padding:"10px 28px",color:"#fff",cursor:"pointer",fontWeight:600,fontSize:14}}>Done ✓</button></div>}</div>}
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App(){
  const[tree,setTree]        =useState(()=>[{id:'root',name:'workspace',type:'F',open:true,children:[]}]);
  const[files,setFiles]      =useState(()=>({}));
  const[fmap,setFmap]        =useState(()=>({}));
  const[tabs,setTabs]        =useState([]);
  const[active,setActive]    =useState("");
  const[panel,setPanel]      =useState("files");
  const[sbOpen,setSbOpen]    =useState(false);
  const[termOpen,setTO]      =useState(false);
  const[termH,setTermH]      =useState(200);
  const[tLines,setTLines]    =useState([{t:"sys",v:"CodeForge Pro — ready"},{t:"dim",v:'Type "help" for commands'}]);
  const[tInput,setTInput]    =useState("");
  const[tRun,setTRun]        =useState(false);
  const[showCmd,setShowCmd]  =useState(false);
  const[showDep,setShowDep]  =useState(false);
  const[split,setSplit]      =useState(false);
  const[splitT,setSplitT]    =useState("");
  const[modified,setMod]     =useState(new Set());
  const[notifs,setNotifs]    =useState([]);
  const[editId,setEditId]    =useState(null);
  const[newItem,setNI]       =useState(null);
  const[ctx,setCtx]          =useState(null);
  const[dm,setDm]            =useState(false);
  const[zoom,setZoom]        =useState(1);
  const[openMenu,setOpenMenu]=useState(null);
  const[browser,setBrowser]  =useState(null);
  const[browserH,setBrowserH]=useState(320);
  const[browserFS,setBrowserFS]=useState(false);
  const[cfg,setCfg]          =useState({fontSize:13,tabSize:2,wordWrap:true,autoSave:true,lineNumbers:true});

  // Hidden file inputs for Open File / Open Folder
  const fileInputRef   =useRef(null);
  const folderInputRef =useRef(null);
  const[showPaste,setShowPaste]=useState(false); // paste-code modal
  const[pasteModal,setPasteModal]=useState({name:"",code:""});

  // Set webkitdirectory on DOM directly — React doesn't support it as a prop
  useEffect(()=>{
    if(folderInputRef.current){
      folderInputRef.current.setAttribute("webkitdirectory","");
      folderInputRef.current.setAttribute("directory","");
      folderInputRef.current.setAttribute("multiple","");
    }
  },[]);

  // Pinch zoom
  const pinch=useRef({dist:null,z0:null});
  const onTM=useCallback(e=>{
    if(e.touches.length!==2)return;
    const dx=e.touches[0].clientX-e.touches[1].clientX,dy=e.touches[0].clientY-e.touches[1].clientY;
    const dist=Math.hypot(dx,dy);
    if(pinch.current.dist===null){pinch.current.dist=dist;pinch.current.z0=zoom;return;}
    setZoom(+Math.min(2,Math.max(.5,pinch.current.z0*(dist/pinch.current.dist))).toFixed(2));
  },[zoom]);
  const onTE=useCallback(()=>{pinch.current.dist=null;},[]);

  useEffect(()=>{const f=()=>setDm(window.innerWidth>=900);f();window.addEventListener("resize",f);return()=>window.removeEventListener("resize",f);},[]);

  const note=(msg,type="info")=>{const id=Date.now();setNotifs(n=>[...n,{id,msg,type}]);setTimeout(()=>setNotifs(n=>n.filter(x=>x.id!==id)),3200);};

  const openFile=useCallback(key=>{
    if(!key)return;
    setActive(key);
    setTabs(t=>t.includes(key)?t:[...t,key]);
    if(!dm)setSbOpen(false);
  },[dm]);

  const closeTab=(key,e)=>{e?.stopPropagation();const idx=tabs.indexOf(key);const nt=tabs.filter(t=>t!==key);setTabs(nt);if(active===key)setActive(nt[Math.max(0,idx-1)]||nt[0]||"");};
  const edit=(key,val)=>{setFiles(f=>({...f,[key]:val}));setMod(m=>new Set([...m,key]));};
  const save=key=>{setMod(m=>{const s=new Set(m);s.delete(key);return s;});note(`Saved ${key?.split("/").pop()}`,"success");};
  const togFolder=useCallback(id=>{const tog=ns=>ns.map(n=>n.id===id?{...n,open:!n.open}:n.children?{...n,children:tog(n.children)}:n);setTree(t=>tog(t));},[]);

  const findN=(ns,id)=>{for(const n of ns){if(n.id===id)return n;if(n.children){const f=findN(n.children,id);if(f)return f;}}return null;};
  const getP=(ns,id,pre="")=>{for(const n of ns){const p=pre?`${pre}/${n.name}`:n.name;if(n.id===id)return p;if(n.children){const f=getP(n.children,id,p);if(f)return f;}}return null;};
  const ins=(ns,pid,nn)=>ns.map(n=>{if(n.id===pid)return{...n,open:true,children:[...(n.children||[]),nn]};if(n.children)return{...n,children:ins(n.children,pid,nn)};return n;});
  const rem=(ns,id)=>ns.reduce((a,n)=>{if(n.id===id)return a;a.push(n.children?{...n,children:rem(n.children,id)}:n);return a;},[]);
  const ren=(ns,id,name)=>ns.map(n=>{if(n.id===id)return{...n,name};if(n.children)return{...n,children:ren(n.children,id,name)};return n;});

  const TMPL={js:"// JavaScript\nconsole.log('Hello World');",jsx:"export default function Comp() {\n  return <div>Hello</div>;\n}",ts:"// TypeScript\nconst greet=(n:string)=>`Hello, ${n}!`;\nconsole.log(greet('World'));",tsx:"export default function Comp() {\n  return <div>Hello World</div>;\n}",py:"# Python\nprint('Hello World')",css:"/* Styles */",html:"<!DOCTYPE html>\n<html><head><meta charset='UTF-8'/></head>\n<body><h1>Hello</h1></body></html>",json:'{\n  "name": "project"\n}',md:"# Title\n",sh:"#!/bin/bash\necho 'Hello'"};

  // ── Load files from device ──────────────────────────────────
  const handleFileOpen=useCallback(e=>{
    const filesArr=Array.from(e.target.files||[]);
    if(!filesArr.length)return;
    let loaded=0;
    filesArr.forEach(file=>{
      const reader=new FileReader();
      reader.onload=ev=>{
        const content=ev.target.result;
        const id=uid();
        const name=file.name;
        const path=file.webkitRelativePath||name;
        // strip leading folder name for relative paths
        const parts=path.split("/");
        const cleanPath=parts.length>1?parts.slice(1).join("/"):parts[0];
        setFiles(f=>({...f,[cleanPath]:content}));
        setFmap(m=>({...m,[id]:cleanPath}));
        // Add to tree under root
        const nn={id,name,type:"f"};
        setTree(t=>ins(t,"root",nn));
        loaded++;
        if(loaded===filesArr.length){
          openFile(cleanPath||name);
          note(`Opened ${filesArr.length} file${filesArr.length>1?"s":""}  ✓`,"success");
        }
      };
      reader.readAsText(file);
    });
    e.target.value="";
  },[openFile]);

  const handleFolderOpen=useCallback(e=>{
    // Legacy fallback — webkitdirectory (desktop only)
    const filesArr=Array.from(e.target.files||[]);
    if(!filesArr.length)return;
    const folderName=filesArr[0]?.webkitRelativePath?.split("/")[0]||"project";
    const folderId=uid();
    const folderNode={id:folderId,name:folderName,type:"F",open:true,children:[]};
    setTree(t=>ins(t,"root",folderNode));
    let firstFile=null;
    filesArr.forEach(file=>{
      if(!file.name.match(/\.(js|jsx|ts|tsx|py|html|css|json|md|sh|txt|sql|rs|go|cpp|java|cs|yaml|yml|toml|xml|svg|gitignore|env)$/i)&&file.size>500000)return;
      const reader=new FileReader();
      reader.onload=ev=>{
        const content=typeof ev.target.result==="string"?ev.target.result:"[Binary file]";
        const id=uid();
        const relPath=file.webkitRelativePath||file.name;
        const parts=relPath.split("/");
        const displayPath=parts.slice(1).join("/")||parts[0];
        const fullKey=`${folderName}/${displayPath}`;
        setFiles(f=>({...f,[fullKey]:content}));
        setFmap(m=>({...m,[id]:fullKey}));
        const nn={id,name:file.name,type:"f"};
        setTree(t=>ins(t,folderId,nn));
        if(!firstFile){firstFile=fullKey;openFile(fullKey);}
      };
      reader.readAsText(file);
    });
    note(`Opened folder "${folderName}"  ✓`,"success");
    e.target.value="";
  },[openFile]);

  // ── Real folder picker using File System Access API ──────────
  // Works on Android Chrome 86+, Desktop Chrome/Edge
  // Falls back to help modal on iOS Safari
  const openFolderPicker=useCallback(async()=>{
    // Try modern File System Access API first (Android Chrome 86+, Desktop Chrome/Edge)
    if(window.showDirectoryPicker){
      try{
        const dirHandle=await window.showDirectoryPicker({mode:"read"});
        const folderName=dirHandle.name;
        const folderId=uid();
        setTree(t=>ins(t,"root",{id:folderId,name:folderName,type:"F",open:true,children:[]}));
        let firstFile=null,count=0;

        const addNode=(t,pid,nn)=>{
          const add=ns=>ns.map(n=>n.id===pid?{...n,children:[...(n.children||[]),nn]}:n.children?{...n,children:add(n.children)}:n);
          return add(t);
        };

        async function readDir(handle,parentId,pathPrefix){
          for await(const entry of handle.values()){
            if(entry.kind==="file"){
              const file=await entry.getFile();
              if(file.size>500000&&!file.name.match(/\.(js|jsx|ts|tsx|py|html|css|json|md|sh|txt|sql|rs|go|cpp|java|cs|yaml|yml|toml|xml|svg)$/i))continue;
              const id=uid();
              const fp=pathPrefix?`${pathPrefix}/${entry.name}`:entry.name;
              try{
                const text=await file.text();
                setFiles(f=>({...f,[fp]:text}));
                setFmap(m=>({...m,[id]:fp}));
                setTree(t=>addNode(t,parentId,{id,name:entry.name,type:"f"}));
                count++;
                if(!firstFile)firstFile=fp;
              }catch(e){}
            }else if(entry.kind==="directory"){
              const subId=uid();
              const subPath=pathPrefix?`${pathPrefix}/${entry.name}`:entry.name;
              setTree(t=>addNode(t,parentId,{id:subId,name:entry.name,type:"F",open:false,children:[]}));
              await readDir(entry,subId,subPath);
            }
          }
        }

        await readDir(dirHandle,folderId,"");
        if(firstFile)openFile(firstFile);
        note(`✓ Opened "${folderName}" — ${count} files loaded`,"success");
        return; // success — done
      }catch(err){
        // AbortError = user pressed Cancel — do nothing silently
        if(err.name==="AbortError")return;
        // Any other error (SecurityError, NotAllowedError, NotSupportedError)
        // Fall through to the help modal below — NO error message shown
      }
    }
    // showDirectoryPicker not available OR threw an error
    // → show the alternatives modal (multiple files, paste code, etc.)
    setShowPaste("folder-help");
  },[openFile]);

  const createItem=(name,type,parentId)=>{
    if(!name)return;const id=uid();
    const nn=type==="f"?{id,name,type:"f"}:{id,name,type:"F",open:true,children:[]};
    setTree(t=>ins(t,parentId,nn));
    if(type==="f"){
      const ext=name.split(".").pop()?.toLowerCase();
      const pFull=getP(tree,parentId)||"";
      const pClean=pFull.split("/").slice(1).join("/");
      const fp=pClean?`${pClean}/${name}`:name;
      setFiles(f=>({...f,[fp]:TMPL[ext]||`// ${name}\n`}));
      setFmap(m=>({...m,[id]:fp}));
      openFile(fp);note(`Created ${name}`,"success");
    }else note(`Folder "${name}" created`,"success");
    setNI(null);
  };

  const delItem=(id,fp,isF)=>{
    setTree(t=>rem(t,id));
    if(isF&&fp){setFiles(f=>{const n={...f};delete n[fp];return n;});setFmap(m=>{const n={...m};delete n[id];return n;});closeTab(fp);}
    note("Deleted","info");
  };

  const okRen=(name)=>{
    if(!name||!editId){setEditId(null);return;}
    const node=findN(tree,editId),oldFp=fmap[editId];
    setTree(t=>ren(t,editId,name));
    if(node?.type==="f"&&oldFp){
      const nFp=oldFp.replace(/[^/]+$/,name);
      setFiles(f=>{const n={...f};n[nFp]=n[oldFp];delete n[oldFp];return n;});
      setFmap(m=>({...m,[editId]:nFp}));
      setTabs(t=>t.map(x=>x===oldFp?nFp:x));
      if(active===oldFp)setActive(nFp);
    }
    setEditId(null);note(`Renamed to ${name}`,"success");
  };

  const doCtx=(e,node,isF,fp)=>{
    const items=[];
    if(!isF){items.push({icon:"📄",label:"New File",action:()=>setNI({parentId:node.id,type:"f"})});items.push({icon:"📁",label:"New Folder",action:()=>setNI({parentId:node.id,type:"F"})});items.push("---");}
    if(node.id!=="root"){items.push({icon:"✏️",label:"Rename",action:()=>setEditId(node.id)});items.push({icon:"🗑️",label:"Delete",action:()=>delItem(node.id,fp,isF),danger:true});}
    if(items.length)setCtx({x:e.clientX,y:e.clientY,items});
  };

  const runTerm=async()=>{
    const cmd=tInput.trim();if(!cmd)return;
    setTInput("");
    setTLines(l=>[...l,{t:"dim",v:`$ ${cmd}`}]);
    if(cmd.toLowerCase()==="clear"){setTLines([]);return;}
    setTRun(true);
    for await(const line of runCmd(cmd,active,files[active]||'')){
      // Handle project scaffolding events
      if(line.t===("__vi"+"te__")){
        const n=line.v;
        // Build file contents using simple string helpers
        const IM=(what)=>"imp"+"ort "+what;
        const RCT=["r","e","a","c","t"].join("");
        const files={};
        files[n+"/src/App.tsx"]=[
          IM("React, { useState } from '"+RCT+"'"),
          ";\n\nfunction App() {",
          "\n  const [count, setCount] = useState(0);",
          "\n  return (",
          "\n    <div style={{padding:'2rem',fontFamily:'system-ui',background:'#1e1e1e',minHeight:'100vh',color:'#d4d4d4',textAlign:'center'}}>",
          "\n      <h1 style={{color:'#007acc',marginBottom:'1rem'}}>⚡ "+n+"</h1>",
          "\n      <p style={{marginBottom:'1rem'}}>Count: <strong style={{fontSize:'2rem',color:'#4ec9b0'}}>{count}</strong></p>",
          "\n      <div style={{display:'flex',gap:'1rem',justifyContent:'center'}}>",
          "\n        <button onClick={()=>setCount(c=>c-1)} style={{padding:'8px 20px',borderRadius:'6px',border:'1px solid #454545',background:'#252526',color:'#d4d4d4',cursor:'pointer',fontSize:'1.1rem'}}>−</button>",
          "\n        <button onClick={()=>setCount(0)} style={{padding:'8px 20px',borderRadius:'6px',border:'1px solid #454545',background:'#252526',color:'#858585',cursor:'pointer'}}>Reset</button>",
          "\n        <button onClick={()=>setCount(c=>c+1)} style={{padding:'8px 20px',borderRadius:'6px',border:'1px solid #007acc',background:'#007acc22',color:'#007acc',cursor:'pointer',fontSize:'1.1rem'}}>+</button>",
          "\n      </div>",
          "\n    </div>",
          "\n  );",
          "\n}",
          "\nexport default App;",
        ].join("");
        files[n+"/src/index.tsx"]=[
          IM("React from '"+RCT+"'"),
          ";\n",
          IM("ReactDOM from '"+RCT+"-dom/client'"),
          ";\n",
          IM("App from './App'"),
          ";\nReactDOM.createRoot(document.getElementById('root')).render(<App/>);",
        ].join("");
        files[n+"/src/App.css"]=[
          "* { box-sizing: border-box; margin: 0; padding: 0; }",
          "\nbody { font-family: system-ui; background: #1e1e1e; color: #d4d4d4; }",
          "\n.app { max-width: 600px; margin: 0 auto; padding: 2rem; text-align: center; }",
          "\nh1 { color: #007acc; margin-bottom: 1rem; }",
          "\nbutton { padding: .5rem 1.5rem; border-radius: 6px; border: 1px solid #007acc;",
          "\n  background: #007acc22; color: #007acc; cursor: pointer; font-size: 1rem; }",
        ].join("");
        files[n+"/index.html"]=[
          "<!DOCTYPE html><html lang='en'><head>",
          "<meta charset='UTF-8'/>",
          "<meta name='viewport' content='width=device-width'/>",
          "<title>"+n+"</title></head>",
          "<body><div id='root'></div>",
          "<script type='module' src='/src/index.tsx'></"+"script>",
          "</body></html>",
        ].join("");
        files[n+"/package.json"]=[
          '{\n  "name": "'+n+'",\n  "version": "0.0.0",',
          '\n  "scripts": {',
          '\n    "dev":     "dev-server",',
          '\n    "build":   "build-app",',
          '\n    "preview": "preview-app"',
          '\n  },',
          '\n  "dependencies": {',
          '\n    "'+RCT+'": "^18.2.0",',
          '\n    "'+RCT+'-dom": "^18.2.0"',
          '\n  },',
          '\n  "devDependencies": {',
          '\n    "typescript": "^5.3.0"',
          '\n  }',
          '\n}',
        ].join("");
        files[n+"/README.md"]=[
          "# "+n,
          "\n\nReact + TypeScript starter project.",
          "\n\n## Start\n```\nnpm install\nnpm run dev\n```",
        ].join("");
        // Add folder + files to IDE tree
        const fId=uid();
        const sId=uid();
        setTree(t=>{
          const addN=(ns,pid,nn)=>ns.map(n=>n.id===pid?{...n,children:[...(n.children||[]),nn]}:n.children?{...n,children:addN(n.children,pid,nn)}:n);
          let t2=addN(t,"root",{id:fId,name:n,type:"F",open:true,children:[]});
          t2=addN(t2,fId,{id:sId,name:"src",type:"F",open:true,children:[]});
          return t2;
        });
        Object.entries(files).forEach(([fp,fc])=>{
          const fid=uid();
          const fname=fp.split("/").pop();
          const inSrc=fp.includes("/src/");
          setFiles(f=>({...f,[fp]:fc}));
          setFmap(m=>({...m,[fid]:fp}));
          setTree(t=>{
            const addN=(ns,pid,nn)=>ns.map(nd=>nd.id===pid?{...nd,children:[...(nd.children||[]),nn]}:nd.children?{...nd,children:addN(nd.children,pid,nn)}:nd);
            return addN(t,inSrc?sId:fId,{id:fid,name:fname,type:"f"});
          });
        });
        openFile(n+"/src/App.tsx");
        setPanel("files");setSbOpen(true);
        continue;
      }
      if(line.t==="__cra__"){
        const n=line.v;
        const RCT=["r","e","a","c","t"].join("");
        const IM=(what)=>"imp"+"ort "+what;
        const craF={};
        craF[n+"/src/App.js"]=[
          "function App() {",
          "\n  return (",
          "\n    <div style={{padding:'2rem',fontFamily:'system-ui',background:'#1e1e1e',color:'#d4d4d4',textAlign:'center'}}>",
          "\n      <h1 style={{color:'#007acc'}}>⚡ "+n+"</h1>",
          "\n      <p>Edit src/App.js to get started.</p>",
          "\n    </div>",
          "\n  );",
          "\n}",
          "\nexport default App;",
        ].join("");
        craF[n+"/src/index.js"]=[
          IM("React from '"+RCT+"'"),
          ";\n",
          IM("ReactDOM from '"+RCT+"-dom'"),
          ";\n",
          IM("App from './App'"),
          ";\nReactDOM.render(<App/>, document.getElementById('root'));",
        ].join("");
        craF[n+"/public/index.html"]=[
          "<!DOCTYPE html><html><head>",
          "<meta charset='UTF-8'/><title>"+n+"</title>",
          "</head><body><div id='root'></div></body></html>",
        ].join("");
        craF[n+"/package.json"]=[
          '{\n  "name": "'+n+'",\n  "version": "0.1.0",',
          '\n  "dependencies": { "'+RCT+'": "^18.2.0" }',
          '\n}',
        ].join("");
        const fId=uid();
        const sId=uid();
        const pId=uid();
        setTree(t=>{
          const addN=(ns,pid,nn)=>ns.map(n=>n.id===pid?{...n,children:[...(n.children||[]),nn]}:n.children?{...n,children:addN(n.children,pid,nn)}:n);
          let t2=addN(t,"root",{id:fId,name:n,type:"F",open:true,children:[]});
          t2=addN(t2,fId,{id:sId,name:"src",type:"F",open:true,children:[]});
          t2=addN(t2,fId,{id:pId,name:"public",type:"F",open:false,children:[]});
          return t2;
        });
        Object.entries(craF).forEach(([fp,fc])=>{
          const fid=uid();
          const fname=fp.split("/").pop();
          const pid2=fp.includes("/src/")?sId:fp.includes("/public/")?pId:fId;
          setFiles(f=>({...f,[fp]:fc}));
          setFmap(m=>({...m,[fid]:fp}));
          setTree(t=>{
            const addN=(ns,pid,nn)=>ns.map(nd=>nd.id===pid?{...nd,children:[...(nd.children||[]),nn]}:nd.children?{...nd,children:addN(nd.children,pid,nn)}:nd);
            return addN(t,pid2,{id:fid,name:fname,type:"f"});
          });
        });
        openFile(n+"/src/App.js");
        setPanel("files");setSbOpen(true);
        continue;
      }
      setTLines(l=>[...l,line]);
      await sleep(10);
    }
    setTRun(false);
  };
  const termRun=async(cmd)=>{setTO(true);setTLines(l=>[...l,{t:"dim",v:`$ ${cmd}`}]);setTRun(true);for await(const line of runCmd(cmd,active,files[active]||'')){setTLines(l=>[...l,line]);await sleep(10);}setTRun(false);};

  const doAct=useCallback((act)=>{
    if(["files","search","git","extensions","ai","settings"].includes(act)){setPanel(act);setSbOpen(true);return;}
    if(act==="browser")      {setBrowser("https://www.google.com/webhp?igu=1");return;}
    if(act==="open-file")   {fileInputRef.current?.click();return;}
    if(act==="open-folder") {openFolderPicker();return;}
    if(act==="paste-code")  {setShowPaste("paste");return;}
    if(act==="open-recent") {setPanel("files");setSbOpen(true);note("Recent: use Explorer to browse files","info");return;}
    if(act==="terminal")    {setTO(o=>!o);return;}
    if(act==="split")       {setSplit(s=>!s);return;}
    if(act==="save")        {save(active);return;}
    if(act==="save-all")    {modified.forEach(k=>save(k));return;}
    if(act==="close-tab")   {closeTab(active);return;}
    if(act==="close-all")   {setTabs([]);setActive("");return;}
    if(act==="deploy-modal"){setShowDep(true);return;}
    if(act==="palette")     {setShowCmd(true);return;}
    if(act==="new-file")    {setNI({parentId:"src",type:"f"});setPanel("files");setSbOpen(true);return;}
    if(act==="new-folder")  {setNI({parentId:"root",type:"F"});setPanel("files");setSbOpen(true);return;}
    if(act==="desktop")     {setDm(true);return;}
    if(act==="mobile")      {setDm(false);return;}
    if(act==="zoom-in")     {setZoom(z=>Math.min(2,+(z+.1).toFixed(1)));return;}
    if(act==="zoom-out")    {setZoom(z=>Math.max(.5,+(z-.1).toFixed(1)));return;}
    if(act==="zoom-reset")  {setZoom(1);return;}
    if(act==="run")         {termRun("npm run dev");return;}
    if(act==="npm-install") {termRun("npm install");return;}
    if(act==="npm-dev")     {termRun("npm run dev");return;}
    if(act==="npm-build")   {termRun("npm run build");return;}
    if(act==="npm-test")    {termRun("npm test");return;}
    if(act==="git-add")     {termRun("git add .");return;}
    if(act==="git-push")    {termRun("git push");return;}
    if(act==="git-pull")    {termRun("git pull");return;}
    if(act==="git-log")     {termRun("git log");return;}
    if(act==="format")      {note("Document formatted ✓","success");return;}
    if(act==="about")       {note("⚡ CodeForge Pro v6 — powered by Claude AI","info");return;}
    if(act==="shortcuts")   {note("⌘⇧P Palette · ⌘O Open · ⌘S Save · ⌘J Terminal","info");return;}
    if(act==="open-guide")  {note("Tip: Use File → Open File, or drag files into the editor","info");return;}
    if(act==="undo")        {document.execCommand("undo");return;}
    if(act==="redo")        {document.execCommand("redo");return;}
  },[active,modified,dm]);

  useEffect(()=>{
    const h=e=>{
      if((e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key==="p"){e.preventDefault();setShowCmd(true);}
      if((e.metaKey||e.ctrlKey)&&e.key==="s"){e.preventDefault();save(active);}
      if((e.metaKey||e.ctrlKey)&&e.key==="j"){e.preventDefault();setTO(o=>!o);}
      if((e.metaKey||e.ctrlKey)&&e.key==="n"){e.preventDefault();setNI({parentId:"src",type:"f"});}
      if((e.metaKey||e.ctrlKey)&&e.key==="o"){e.preventDefault();if(e.shiftKey)openFolderPicker();else fileInputRef.current?.click();}
      if((e.metaKey||e.ctrlKey)&&e.key==="w"){e.preventDefault();closeTab(active);}
      if((e.metaKey||e.ctrlKey)&&e.key==="="){e.preventDefault();setZoom(z=>Math.min(2,+(z+.1).toFixed(1)));}
      if((e.metaKey||e.ctrlKey)&&e.key==="-"){e.preventDefault();setZoom(z=>Math.max(.5,+(z-.1).toFixed(1)));}
      if((e.metaKey||e.ctrlKey)&&e.key==="0"){e.preventDefault();setZoom(1);}
    };
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[active]);

  const lang=active?gl(active):null;
  const sbW=dm?260:240;
  const fs=dm?cfg.fontSize+1:cfg.fontSize;

  const bottomTabs=[{id:"files",e:"📁",l:"Files"},{id:"search",e:"🔍",l:"Search"},{id:"git",e:"🔀",l:"Git"},{id:"ai",e:"✨",l:"AI"},{id:"settings",e:"⚙️",l:"Settings"}];

  return(
    <div onTouchMove={onTM} onTouchEnd={onTE}
      style={{height:"100dvh",display:"flex",flexDirection:"column",background:D.bg,color:D.txt,fontFamily:"'Outfit',system-ui,sans-serif",overflow:"hidden",fontSize:`${zoom}em`}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        html,body{overscroll-behavior:none}
        ::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${D.scr};border-radius:3px}
        textarea{-webkit-text-size-adjust:none;text-size-adjust:none;touch-action:pan-y}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
        @keyframes expandDown{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
        @keyframes slideIn{from{transform:translateX(-100%)}to{transform:none}}
        @keyframes fadeUp{from{transform:translateY(10px);opacity:0}to{transform:none;opacity:1}}
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:2px;background:${D.bdr}}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:${D.ac};cursor:pointer}
      `}</style>

      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" multiple accept="*/*" onChange={handleFileOpen} style={{display:"none"}}/>
      <input ref={folderInputRef} type="file" multiple onChange={handleFolderOpen} style={{display:"none"}}
        {...{"webkitdirectory":"","directory":""}}/>

      {/* ══ TITLE BAR ══ */}
      <div style={{height:38,background:"#2c2c2c",display:"flex",alignItems:"center",paddingLeft:12,gap:8,flexShrink:0,borderBottom:`1px solid ${D.bdr}`}}>
        <div style={{display:"flex",gap:5}}>{["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}</div>
        <span style={{fontSize:13,fontWeight:700,color:D.txt}}>⚡ CodeForge Pro</span>
        <div style={{marginLeft:"auto",display:"flex",gap:5,paddingRight:8,alignItems:"center"}}>
          <button onClick={()=>doAct("zoom-out")} style={{background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:4,padding:"3px 8px",color:D.txt,cursor:"pointer",fontSize:15}}>−</button>
          <button onClick={()=>doAct("zoom-reset")} style={{background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:4,padding:"3px 8px",color:zoom!==1?D.ac:D.dim,cursor:"pointer",fontSize:11,minWidth:38,textAlign:"center"}}>{Math.round(zoom*100)}%</button>
          <button onClick={()=>doAct("zoom-in")} style={{background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:4,padding:"3px 8px",color:D.txt,cursor:"pointer",fontSize:15}}>+</button>
          <button onClick={()=>setShowCmd(true)} style={{background:D.inp,border:`1px solid ${D.bdr}44`,borderRadius:6,padding:"4px 10px",color:D.dim,fontSize:12,cursor:"pointer"}}>⌘⇧P</button>
          <button onClick={()=>setBrowser("https://www.google.com/webhp?igu=1")} style={{background:"#4fc3f722",border:"1px solid #4fc3f755",borderRadius:4,color:"#4fc3f7",cursor:"pointer",padding:"4px 10px",fontSize:11,fontWeight:600}}>🌐 RK</button>
          <button onClick={()=>setShowDep(true)} style={{background:`${D.ac}22`,border:`1px solid ${D.ac}55`,borderRadius:4,color:D.ac,cursor:"pointer",padding:"4px 10px",fontSize:11,fontWeight:600}}>🚀</button>
        </div>
      </div>

      {/* ══ MENU BAR ══ */}
      <MenuBar onAct={doAct} openMenu={openMenu} setOpenMenu={setOpenMenu}/>

      {/* ══ BODY ══ */}
      <div style={{flex:1,display:"flex",overflow:"hidden",position:"relative"}}>

        {/* Overlay on mobile */}
        {sbOpen&&!dm&&<div style={{position:"absolute",inset:0,background:"#0007",zIndex:50}} onClick={()=>setSbOpen(false)}/>}

        {/* Sidebar */}
        {(sbOpen||dm)&&(
          <div style={{width:sbW,background:D.sb,borderRight:`1px solid ${D.bdr}`,display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0,zIndex:dm?1:60,position:dm?"relative":"absolute",top:0,left:0,bottom:0,animation:dm?"none":"slideIn .2s ease",boxShadow:dm?"none":"4px 0 24px #0009"}}>

            {/* Sidebar header */}
            <div style={{padding:"8px 10px 6px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${D.bdr}`,background:"#1e1e24",flexShrink:0}}>
              <span style={{fontSize:11,color:D.dim,textTransform:"uppercase",letterSpacing:".08em",fontWeight:600}}>
                {panel==="files"?"Explorer":panel==="search"?"Search":panel==="git"?"Source Control":panel==="extensions"?"Extensions":panel==="ai"?"AI Copilot":"Settings"}
              </span>
              <div style={{display:"flex",gap:3,alignItems:"center"}}>
                {panel==="files"&&<>
                  <button title="New File"    onClick={()=>setNI({parentId:"src",type:"f"})}  style={{background:"none",border:"none",cursor:"pointer",fontSize:17,padding:"3px 4px",color:D.dim,borderRadius:4}} onMouseEnter={e=>e.currentTarget.style.color=D.txt} onMouseLeave={e=>e.currentTarget.style.color=D.dim} title="New File">📄</button>
                  <button title="New Folder"  onClick={()=>setNI({parentId:"src",type:"F"})} style={{background:"none",border:"none",cursor:"pointer",fontSize:17,padding:"3px 4px",color:D.dim,borderRadius:4}} onMouseEnter={e=>e.currentTarget.style.color=D.txt} onMouseLeave={e=>e.currentTarget.style.color=D.dim} title="New Folder">📁</button>
                  <button title="Open File"   onClick={()=>doAct("open-file")}   style={{background:"none",border:"none",cursor:"pointer",fontSize:17,padding:"3px 4px",color:D.ac,borderRadius:4}} title="Open File from device">📂</button>
                </>}
                {!dm&&<button onClick={()=>setSbOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:D.dim,fontSize:20,padding:"2px 4px",lineHeight:1}}>✕</button>}
              </div>
            </div>

            {/* Open File / Open Folder quick buttons inside Explorer */}
            {panel==="files"&&(
              <div style={{padding:"8px 10px",borderBottom:`1px solid ${D.bdr}`,display:"flex",flexDirection:"column",gap:6}}>
                {/* Row 1 */}
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>doAct("open-file")} style={{flex:1,background:D.ac,border:"none",borderRadius:7,padding:"10px 6px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    📂 Open File
                  </button>
                  <button onClick={()=>openFolderPicker()} style={{flex:1,background:`${D.ac}22`,border:`2px solid ${D.ac}`,borderRadius:7,padding:"10px 6px",color:D.ac,fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                    🗂️ Open Folder
                  </button>
                </div>
                {/* Row 2 — mobile-friendly extras */}
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>fileInputRef.current&&(fileInputRef.current.multiple=true,fileInputRef.current.click())} style={{flex:1,background:`${D.grn}22`,border:`1px solid ${D.grn}55`,borderRadius:7,padding:"8px 6px",color:D.grn,fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                    📄+ Multi Files
                  </button>
                  <button onClick={()=>setShowPaste("paste")} style={{flex:1,background:`${D.pur}22`,border:`1px solid ${D.pur}55`,borderRadius:7,padding:"8px 6px",color:D.pur,fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                    📋 Paste Code
                  </button>
                </div>
              </div>
            )}

            {/* Sidebar content */}
            <div style={{flex:1,overflow:"auto",WebkitOverflowScrolling:"touch"}}>
              {panel==="files"&&(
                <div>
                  {tree.map(n=><TNode key={n.id} node={n} active={active} onOpen={openFile} onToggle={togFolder} onCtx={doCtx} editId={editId} onEditOk={okRen} onEditCancel={()=>setEditId(null)} fmap={fmap}/>)}
                  {newItem&&<NewRow type={newItem.type} depth={1} onOk={name=>createItem(name,newItem.type,newItem.parentId)} onCancel={()=>setNI(null)}/>}
                </div>
              )}
              {panel==="search"    &&<SearchPanel files={files} onOpen={openFile}/>}
              {panel==="git"       &&<GitPanel modified={[...modified]}/>}
              {panel==="extensions"&&<ExtPanel/>}
              {panel==="settings"  &&<SettingsPanel s={cfg} set={(k,v)=>setCfg(s=>({...s,[k]:v}))} dm={dm} setDm={setDm} zoom={zoom} setZoom={setZoom}/>}
              {panel==="ai"        &&<AICopilot file={active} content={files[active]}/>}
            </div>

            {/* Sidebar bottom nav for desktop */}
            {dm&&(
              <div style={{height:44,borderTop:`1px solid ${D.bdr}`,display:"flex",background:"#1a1a1e"}}>
                {bottomTabs.map(({id,e})=><button key={id} onClick={()=>setPanel(id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",fontSize:17,color:panel===id?D.ac:D.dim,display:"flex",alignItems:"center",justifyContent:"center",borderTop:`2px solid ${panel===id?D.ac:"transparent"}`}}>{e}</button>)}
                <button onClick={()=>setSbOpen(o=>!o)} style={{flex:1,background:"none",border:"none",cursor:"pointer",fontSize:14,color:D.dim}}>◀</button>
              </div>
            )}
          </div>
        )}

        {/* Editor area */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>

          {/* Tabs */}
          <div style={{height:36,background:D.tab,display:"flex",alignItems:"flex-end",overflow:"auto",flexShrink:0,borderBottom:`1px solid ${D.bdr}`}}>
            {!dm&&<button onClick={()=>{setPanel("files");setSbOpen(o=>!o);}} style={{height:"100%",padding:"0 12px",background:"none",border:"none",borderRight:`1px solid ${D.bdr}`,color:sbOpen?D.ac:D.dim,cursor:"pointer",fontSize:17,flexShrink:0}}>☰</button>}
            {active&&<button onClick={()=>{setTO(true);setTLines(l=>[...l,{t:"dim",v:`$ run`}]);setTRun(true);(async()=>{for await(const line of runCmd("run",active,files[active]||'')){if(line.t===("__vi"+"te__")||line.t==="__cra__"){setTLines(l=>[...l,{t:"grn",v:"Done!"}]);}else{setTLines(l=>[...l,line]);}await sleep(10);}setTRun(false);})();}} style={{height:"100%",padding:"0 10px",background:`${D.grn}22`,border:"none",borderRight:`1px solid ${D.bdr}`,color:D.grn,cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0,display:"flex",alignItems:"center",gap:4}}>▶ Run</button>}
            {tabs.map(key=>{const lg=gl(key),isA=key===active,isMod=modified.has(key);return(
              <div key={key} onClick={()=>setActive(key)} style={{height:34,display:"flex",alignItems:"center",gap:5,padding:"0 10px",cursor:"pointer",flexShrink:0,background:isA?D.bg:"transparent",borderTop:`2px solid ${isA?D.ac:"transparent"}`,borderRight:`1px solid ${D.bdr}`,color:isA?D.wht:D.dim,fontSize:12,maxWidth:160,minWidth:60}}>
                <span style={{fontSize:14}}>{lg.i}</span>
                <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{key.split("/").pop()}</span>
                {isMod&&<span style={{width:6,height:6,borderRadius:"50%",background:D.yel,flexShrink:0}}/>}
                <span onClick={e=>closeTab(key,e)} style={{flexShrink:0,fontSize:14,opacity:.4,padding:2,borderRadius:3,lineHeight:1}} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity=".4"}>✕</span>
              </div>
            );})}
          </div>

          {/* Breadcrumb */}
          {active&&<div style={{height:22,background:"#181818",borderBottom:`1px solid ${D.bdr}`,padding:"0 12px",display:"flex",alignItems:"center",gap:4,fontSize:11,color:D.dim,flexShrink:0,overflow:"hidden"}}>
            {active.split("/").map((s,i,a)=><span key={i} style={{display:"flex",alignItems:"center",gap:4,flexShrink:i===a.length-1?0:1,overflow:"hidden"}}>
              {i>0&&<span style={{opacity:.4,flexShrink:0}}>›</span>}
              <span style={{color:i===a.length-1?D.txt:D.dim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s}</span>
            </span>)}
          </div>}

          {/* Editors / Welcome screen */}
          <div style={{flex:1,display:"flex",overflow:"hidden"}}>
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              {active
                ?<Editor filename={active} content={files[active]||""} onChange={v=>edit(active,v)} fontSize={fs}/>
                :(
                  /* ══ WELCOME SCREEN with big Open buttons ══ */
                  <div style={{flex:1,overflow:"auto",WebkitOverflowScrolling:"touch",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,gap:0}}>
                    <div style={{fontSize:64,marginBottom:8,opacity:.15}}>⚡</div>
                    <div style={{fontSize:20,fontWeight:700,color:D.txt,marginBottom:4,textAlign:"center"}}>CodeForge Pro</div>
                    <div style={{fontSize:13,color:D.dim,marginBottom:28,textAlign:"center"}}>Mobile IDE — Write, Run & Deploy Code</div>

                    {/* Big action buttons */}
                    <div style={{width:"100%",maxWidth:320,display:"flex",flexDirection:"column",gap:12,marginBottom:28}}>
                      <button onClick={()=>doAct("open-file")} style={{width:"100%",background:D.ac,border:"none",borderRadius:12,padding:"16px 20px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:12,textAlign:"left"}}>
                        <span style={{fontSize:24}}>📂</span>
                        <div>
                          <div>Open File</div>
                          <div style={{fontSize:11,opacity:.7,fontWeight:400}}>Open any file from your device</div>
                        </div>
                        <span style={{marginLeft:"auto",opacity:.6,fontSize:12}}>⌘O</span>
                      </button>

                      <button onClick={()=>openFolderPicker()} style={{width:"100%",background:D.sb,border:`2px solid ${D.ac}`,borderRadius:12,padding:"16px 20px",color:D.ac,fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:12,textAlign:"left"}}>
                        <span style={{fontSize:24}}>🗂️</span>
                        <div>
                          <div>Open Folder</div>
                          <div style={{fontSize:11,opacity:.7,fontWeight:400}}>Open entire project folder from device</div>
                        </div>
                        <span style={{marginLeft:"auto",opacity:.6,fontSize:12}}>⌘⇧O</span>
                      </button>

                      <button onClick={()=>setShowPaste("paste")} style={{width:"100%",background:`${D.pur}22`,border:`2px solid ${D.pur}55`,borderRadius:12,padding:"16px 20px",color:D.pur,fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:12,textAlign:"left"}}>
                        <span style={{fontSize:24}}>📋</span>
                        <div>
                          <div>Paste Code</div>
                          <div style={{fontSize:11,opacity:.7,fontWeight:400}}>Paste code directly into editor</div>
                        </div>
                      </button>

                      <button onClick={()=>doAct("new-file")} style={{width:"100%",background:`${D.grn}22`,border:`2px solid ${D.grn}55`,borderRadius:12,padding:"16px 20px",color:D.grn,fontSize:15,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:12,textAlign:"left"}}>
                        <span style={{fontSize:24}}>📄</span>
                        <div>
                          <div>New File</div>
                          <div style={{fontSize:11,opacity:.7,fontWeight:400}}>Create a blank new file</div>
                        </div>
                        <span style={{marginLeft:"auto",opacity:.6,fontSize:12}}>⌘N</span>
                      </button>
                    </div>

                    {/* Recent / sample files */}
                    <div style={{width:"100%",maxWidth:320}}>
                      <div style={{fontSize:11,color:D.dim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10,textAlign:"center"}}>— Or open a sample file —</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        {["src/App.tsx","src/App.css","src/utils.ts","package.json","README.md",".env"].map(fp=>(
                          <button key={fp} onClick={()=>openFile(fp)} style={{background:D.sb,border:`1px solid ${D.bdr}`,borderRadius:8,padding:"10px 10px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:8}} onMouseEnter={e=>e.currentTarget.style.borderColor=D.ac} onMouseLeave={e=>e.currentTarget.style.borderColor=D.bdr}>
                            <span style={{fontSize:16,flexShrink:0}}>{gl(fp).i}</span>
                            <span style={{fontSize:12,color:D.txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fp.split("/").pop()}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{marginTop:20,fontSize:12,color:D.dim,textAlign:"center",lineHeight:1.8}}>
                      Or use <span style={{color:D.ac,cursor:"pointer"}} onClick={()=>setShowCmd(true)}>⌘⇧P Command Palette</span><br/>
                      Pinch to zoom · Long-press for context menu
                    </div>
                  </div>
                )
              }
            </div>

            {/* Split view */}
            {split&&tabs.length>1&&<>
              <div style={{width:1,background:D.bdr}}/>
              <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
                <div style={{height:36,background:D.tab,display:"flex",alignItems:"flex-end",overflow:"auto",borderBottom:`1px solid ${D.bdr}`}}>
                  {tabs.map(key=>{const lg=gl(key),isA=key===(splitT||tabs[1]||tabs[0]);return(<div key={key} onClick={()=>setSplitT(key)} style={{height:34,display:"flex",alignItems:"center",gap:5,padding:"0 10px",cursor:"pointer",flexShrink:0,background:isA?D.bg:"transparent",borderTop:`2px solid ${isA?D.pur:"transparent"}`,borderRight:`1px solid ${D.bdr}`,color:isA?D.wht:D.dim,fontSize:12}}><span>{lg.i}</span><span style={{fontSize:12}}>{key.split("/").pop()}</span></div>);})}
                </div>
                <Editor filename={splitT||tabs[1]||tabs[0]} content={files[splitT||tabs[1]||tabs[0]]||""} onChange={v=>edit(splitT||tabs[1]||tabs[0],v)} fontSize={fs}/>
              </div>
            </>}
          </div>

          {/* RK Browser split panel */}
          {browser&&!browserFS&&<RKBrowser
            initUrl={browser}
            onClose={()=>{setBrowser(null);setBrowserFS(false);}}
            height={browserH}
            onHeightChange={setBrowserH}
            isFullscreen={false}
            onToggleFullscreen={()=>setBrowserFS(true)}
          />}
          {/* Terminal */}
          {termOpen&&<div style={{height:termH,borderTop:`1px solid ${D.bdr}`,display:"flex",flexDirection:"column",flexShrink:0}}>
            <div style={{height:32,background:"#1a1a1e",display:"flex",alignItems:"center",gap:8,padding:"0 12px",borderBottom:`1px solid ${D.bdr}`,flexShrink:0}}>
              <span style={{fontSize:12,color:D.dim,fontWeight:600}}>💻 TERMINAL</span>
              <div style={{flex:1}}/>
              <button onClick={()=>setTLines([])} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:12,padding:"2px 8px"}}>Clear</button>
              <button onClick={()=>setTermH(h=>h===200?360:200)} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:14}}>⬜</button>
              <button onClick={()=>setTO(false)} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            <Term lines={tLines} onRun={runTerm} input={tInput} setInput={setTInput} running={tRun} onOpenBrowser={(u)=>setBrowser(u)}/>
          </div>}
        </div>
      </div>

      {/* ══ BOTTOM NAV — mobile ══ */}
      {!dm&&(
        <div style={{height:54,background:"#1a1a1e",borderTop:`1px solid ${D.bdr}`,display:"flex",flexShrink:0}}>
          {bottomTabs.map(({id,e,l})=>(
            <button key={id} onClick={()=>{setPanel(id);setSbOpen(true);}} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,borderTop:`2px solid ${panel===id&&sbOpen?D.ac:"transparent"}`,color:panel===id&&sbOpen?D.ac:D.dim,transition:"color .15s",position:"relative"}}>
              <span style={{fontSize:20}}>{e}</span>
              <span style={{fontSize:9,textTransform:"uppercase",letterSpacing:".04em"}}>{l}</span>
              {id==="git"&&modified.size>0&&<span style={{position:"absolute",top:4,right:"50%",marginRight:-16,background:D.red,color:"#fff",borderRadius:"50%",width:14,height:14,fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{modified.size}</span>}
            </button>
          ))}
          <button onClick={()=>setTO(o=>!o)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,borderTop:`2px solid ${termOpen?D.grn:"transparent"}`,color:termOpen?D.grn:D.dim}}>
            <span style={{fontSize:20}}>💻</span>
            <span style={{fontSize:9,textTransform:"uppercase",letterSpacing:".04em"}}>Term</span>
          </button>
          <button onClick={()=>setShowDep(true)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,color:D.ac}}>
            <span style={{fontSize:20}}>🚀</span>
            <span style={{fontSize:9,textTransform:"uppercase",letterSpacing:".04em"}}>Deploy</span>
          </button>
          <button onClick={()=>setBrowser("https://www.google.com/webhp?igu=1")} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,color:"#4fc3f7"}}>
            <span style={{fontSize:20}}>🌐</span>
            <span style={{fontSize:9,textTransform:"uppercase",letterSpacing:".04em"}}>Browser</span>
          </button>
        </div>
      )}

      {/* ══ STATUS BAR ══ */}
      <div style={{height:20,background:D.sta,display:"flex",alignItems:"center",padding:"0 10px",gap:10,fontSize:11,color:"#fff",flexShrink:0}}>
        <span style={{cursor:"pointer"}} onClick={()=>{setPanel("git");setSbOpen(true);}}>⎇ main</span>
        <span>{modified.size>0?<span style={{color:"#ffdd57"}}>⚠ {modified.size} unsaved</span>:<span style={{color:"#4ec9b0"}}>✓ Saved</span>}</span>
        <div style={{flex:1}}/>
        {zoom!==1&&<span style={{color:"#ffdd57",cursor:"pointer"}} onClick={()=>setZoom(1)}>{Math.round(zoom*100)}%</span>}
        {lang&&<span>{lang.i} {lang.n}</span>}
        <button onClick={()=>setDm(m=>!m)} style={{background:"none",border:"none",color:"#ffffffaa",cursor:"pointer",fontSize:11}}>{dm?"📱":"🖥️"}</button>
        <button onClick={()=>setShowCmd(true)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:11}}>⌘⇧P</button>
      </div>

      {/* Notifications */}
      <div style={{position:"fixed",bottom:dm?24:78,right:12,zIndex:800,display:"flex",flexDirection:"column",gap:6,pointerEvents:"none"}}>
        {notifs.map(n=><div key={n.id} style={{background:D.sb,border:`1px solid ${n.type==="success"?D.grn:n.type==="error"?D.red:D.bdr}`,borderRadius:8,padding:"10px 14px",fontSize:13,color:D.txt,maxWidth:270,animation:"fadeUp .3s ease",boxShadow:"0 4px 20px #0008"}}>{n.type==="success"?"✅ ":n.type==="error"?"❌ ":"ℹ️ "}{n.msg}</div>)}
      </div>


      {ctx&&<CtxMenu x={ctx.x} y={ctx.y} items={ctx.items} onClose={()=>setCtx(null)}/>}
      {showCmd&&<CmdPalette onClose={()=>setShowCmd(false)} onCmd={id=>{doAct(id);}}/>}
      {showDep&&<DeployModal onClose={()=>setShowDep(false)}/>}

      {/* ══ PASTE CODE MODAL ══ */}
      {showPaste==="paste"&&(
        <div style={{position:"fixed",inset:0,background:"#000a",zIndex:950,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(6px)"}} onClick={e=>e.target===e.currentTarget&&setShowPaste(false)}>
          <div style={{width:"100%",maxWidth:520,background:D.sb,borderRadius:"16px 16px 0 0",border:`1px solid ${D.bdr}`,padding:0,maxHeight:"85vh",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"16px",borderBottom:`1px solid ${D.bdr}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
              <span style={{fontSize:15,fontWeight:700,color:D.txt}}>📋 Paste Code</span>
              <button onClick={()=>setShowPaste(false)} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:22}}>✕</button>
            </div>
            <div style={{padding:"14px 16px",borderBottom:`1px solid ${D.bdr}`,flexShrink:0}}>
              <div style={{fontSize:12,color:D.dim,marginBottom:8}}>File name (e.g. App.tsx, index.js)</div>
              <input
                value={pasteModal.name}
                onChange={e=>setPasteModal(p=>({...p,name:e.target.value}))}
                placeholder="filename.js"
                style={{width:"100%",background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:8,padding:"10px 12px",color:D.txt,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
            </div>
            <div style={{padding:"14px 16px",flex:1,display:"flex",flexDirection:"column",gap:8,overflow:"hidden"}}>
              <div style={{fontSize:12,color:D.dim}}>Paste your code below:</div>
              <textarea
                value={pasteModal.code}
                onChange={e=>setPasteModal(p=>({...p,code:e.target.value}))}
                placeholder="Paste your code here..."
                style={{flex:1,background:D.bg,border:`1px solid ${D.bdr}`,borderRadius:8,padding:"10px 12px",color:D.txt,fontSize:13,outline:"none",resize:"none",fontFamily:"'JetBrains Mono',monospace",lineHeight:1.6,minHeight:180,WebkitOverflowScrolling:"touch"}}/>
            </div>
            <div style={{padding:"14px 16px",borderTop:`1px solid ${D.bdr}`,display:"flex",gap:10,flexShrink:0}}>
              <button onClick={()=>setShowPaste(false)} style={{flex:1,background:D.hov,border:`1px solid ${D.bdr}`,borderRadius:8,padding:"12px",color:D.dim,cursor:"pointer",fontSize:13}}>Cancel</button>
              <button onClick={()=>{
                const name=pasteModal.name.trim()||"untitled.txt";
                const code=pasteModal.code;
                if(!code.trim()){note("Please paste some code first","error");return;}
                const id=uid();
                const fp=name;
                setFiles(f=>({...f,[fp]:code}));
                setFmap(m=>({...m,[id]:fp}));
                setTree(t=>{const tog=ns=>ns.map(n=>n.id==="root"?{...n,children:[...(n.children||[]),{id,name,type:"f"}]}:n.children?{...n,children:tog(n.children)}:n);return tog(t);});
                openFile(fp);
                setPasteModal({name:"",code:""});
                setShowPaste(false);
                note(`Created ${name} ✓`,"success");
              }} style={{flex:2,background:D.ac,border:"none",borderRadius:8,padding:"12px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>
                ✅ Open in Editor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ FOLDER HELP MODAL ══ */}
      {showPaste==="folder-help"&&(
        <div style={{position:"fixed",inset:0,background:"#000a",zIndex:950,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(6px)"}} onClick={e=>e.target===e.currentTarget&&setShowPaste(false)}>
          <div style={{width:"100%",maxWidth:520,background:D.sb,borderRadius:"16px 16px 0 0",border:`1px solid ${D.bdr}`,maxHeight:"88vh",overflow:"auto"}}>

            <div style={{padding:"16px",borderBottom:`1px solid ${D.bdr}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:15,fontWeight:700,color:D.txt}}>🗂️ Open Folder</span>
              <button onClick={()=>setShowPaste(false)} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:22}}>✕</button>
            </div>

            {/* Info */}
            <div style={{padding:"12px 16px",background:`${D.ac}11`,borderBottom:`1px solid ${D.bdr}`}}>
              <div style={{fontSize:13,color:D.ac,fontWeight:600,marginBottom:4}}>ℹ️ Your browser needs permission</div>
              <div style={{fontSize:13,color:D.txt,lineHeight:1.7}}>
                Folder access requires Chrome on Android. Use one of these options:
              </div>
            </div>

            <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>

              {/* Try again with Chrome hint */}
              <div style={{background:`${D.ac}18`,border:`2px solid ${D.ac}`,borderRadius:12,padding:"14px 16px"}}>
                <div style={{fontSize:13,color:D.ac,fontWeight:700,marginBottom:6}}>📱 Try in Chrome (Android)</div>
                <div style={{fontSize:12,color:D.txt,lineHeight:1.8,marginBottom:10}}>
                  1. Open this site in <strong>Chrome</strong> browser<br/>
                  2. Tap <strong>Open Folder</strong> again<br/>
                  3. Chrome will ask permission → tap <strong>Allow</strong><br/>
                  4. Browse and select your project folder ✅
                </div>
                <button onClick={()=>{setShowPaste(false);openFolderPicker();}} style={{width:"100%",background:D.ac,border:"none",borderRadius:8,padding:"10px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>
                  🔄 Try Open Folder Again
                </button>
              </div>

              {/* Multiple files */}
              <button onClick={()=>{
                setShowPaste(false);
                if(fileInputRef.current){fileInputRef.current.setAttribute("multiple","");fileInputRef.current.click();}
              }} style={{background:`${D.grn}22`,border:`2px solid ${D.grn}55`,borderRadius:12,padding:"14px 16px",color:D.grn,cursor:"pointer",textAlign:"left",display:"flex",gap:12,alignItems:"center"}}>
                <span style={{fontSize:28,flexShrink:0}}>📄</span>
                <div>
                  <div style={{fontSize:14,fontWeight:700}}>Select Multiple Files</div>
                  <div style={{fontSize:12,opacity:.8,marginTop:2}}>Pick all project files at once — works on all phones</div>
                </div>
              </button>

              {/* Single file */}
              <button onClick={()=>{setShowPaste(false);fileInputRef.current?.click();}} style={{background:D.hov,border:`1px solid ${D.bdr}`,borderRadius:12,padding:"14px 16px",color:D.txt,cursor:"pointer",textAlign:"left",display:"flex",gap:12,alignItems:"center"}}>
                <span style={{fontSize:28,flexShrink:0}}>📂</span>
                <div>
                  <div style={{fontSize:14,fontWeight:700}}>Open Single File</div>
                  <div style={{fontSize:12,color:D.dim,marginTop:2}}>Open one file at a time</div>
                </div>
              </button>

              {/* Paste code */}
              <button onClick={()=>setShowPaste("paste")} style={{background:`${D.pur}22`,border:`2px solid ${D.pur}55`,borderRadius:12,padding:"14px 16px",color:D.pur,cursor:"pointer",textAlign:"left",display:"flex",gap:12,alignItems:"center"}}>
                <span style={{fontSize:28,flexShrink:0}}>📋</span>
                <div>
                  <div style={{fontSize:14,fontWeight:700}}>Paste Code</div>
                  <div style={{fontSize:12,opacity:.8,marginTop:2}}>Copy from WhatsApp / Notes / any app and paste here</div>
                </div>
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
