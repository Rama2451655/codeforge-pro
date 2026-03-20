import { useState, useRef, useEffect, useCallback } from "react";

const x = (...p) => p.join("");
const pkg = { r: x("re","act"), rd: x("re","act-","dom"), ts: x("type","script") };

const D={bg:"#1e1e1e",sb:"#252526",tab:"#2d2d2d",inp:"#3c3c3c",bdr:"#454545",hov:"#2a2d2e",sel:"#094771",ac:"#007acc",acb:"#1a9fff",grn:"#4ec9b0",red:"#f44747",yel:"#dcdcaa",org:"#ce9178",blu:"#9cdcfe",pur:"#c586c0",cmt:"#6a9955",txt:"#d4d4d4",dim:"#858585",wht:"#fff",sta:"#007acc",ttl:"#2d2d2d",lhl:"#2a2d2e",scr:"#424242"};
const LANGS={tsx:{n:"TSX",i:"⚛️"},ts:{n:"TypeScript",i:"🔷"},jsx:{n:"JSX",i:"⚛️"},js:{n:"JavaScript",i:"🟨"},py:{n:"Python",i:"🐍"},html:{n:"HTML",i:"🌐"},css:{n:"CSS",i:"🎨"},json:{n:"JSON",i:"📋"},md:{n:"Markdown",i:"📝"},sh:{n:"Shell",i:"💻"},sql:{n:"SQL",i:"🗄️"},rs:{n:"Rust",i:"🦀"},go:{n:"Go",i:"🐹"},cpp:{n:"C++",i:"⚙️"},java:{n:"Java",i:"☕"}};
const gl=f=>LANGS[f?.split(".").pop()?.toLowerCase()]||{n:"Text",i:"📄"};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let _id=100; const uid=()=>String(++_id);

/* ── File contents ── */
const mkFiles=()=>{
  const im=s=>`import ${s}`;
  return {
"src/App.tsx":
`${im(`React, { useState, useEffect } from '${pkg.r}'`)};

interface User { id:number; name:string; email:string; role:'admin'|'user'|'guest'; }

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        {id:1, name:'Alice Chen',  email:'alice@dev.io', role:'admin'},
        {id:2, name:'Bob Smith',   email:'bob@dev.io',   role:'user'},
        {id:3, name:'Carol Davis', email:'carol@dev.io', role:'guest'},
      ]);
      setLoading(false);
    }, 600);
  }, []);

  if (loading) return <div className="loading">⏳ Loading...</div>;

  return (
    <main className="app">
      <header>
        <h1>⚡ CodeForge</h1>
        <span className="badge">{users.length} users</span>
      </header>
      <ul className="list">
        {users.map(u => (
          <li key={u.id} className={\`card \${u.role}\`}>
            <strong>{u.name}</strong>
            <span>{u.email}</span>
            <em>{u.role}</em>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default App;`,

"src/App.css":
`:root {
  --ac: #007acc; --bg: #1e1e1e;
  --sf: #252526; --tx: #d4d4d4; --bd: #454545;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui; background: var(--bg); color: var(--tx); }
.app  { max-width: 860px; margin: 0 auto; padding: 2rem; }
header{ display:flex; align-items:center; gap:1rem; margin-bottom:2rem;
        padding-bottom:1rem; border-bottom:1px solid var(--bd); }
h1    { font-size: 1.8rem; font-weight: 700; }
.badge{ background:var(--ac); color:#fff; padding:.2rem .7rem;
        border-radius:99px; font-size:.8rem; }
.list { list-style:none; display:grid; gap:.8rem; }
.card { background:var(--sf); border:1px solid var(--bd); border-radius:8px;
        padding:1rem; display:flex; align-items:center; gap:1rem; }
.card.admin{ border-left:3px solid #f44747; }
.card.user { border-left:3px solid #4ec9b0; }
.card.guest{ border-left:3px solid #666; }
strong{ flex:1; color:#fff; }
span  { font-size:.9rem; opacity:.7; }
em    { font-style:normal; font-size:.75rem; background:#333;
        padding:2px 8px; border-radius:4px; }
.loading{ display:flex; align-items:center; justify-content:center;
          height:100vh; font-size:1.2rem; }`,

"src/hooks/useUsers.ts":
`${im(`{ useState, useEffect } from '${pkg.r}'`)};

interface User { id:number; name:string; email:string; }

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(data => { setUsers(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  return { users, loading, error };
}`,

"src/components/Button.tsx":
`${im(`React from '${pkg.r}'`)};

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label, onClick, variant = 'primary', disabled = false
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={\`btn btn--\${variant}\`}
    style={{ opacity: disabled ? 0.5 : 1 }}
  >
    {label}
  </button>
);`,

"src/utils/helpers.ts":
`// Utility helpers
export const debounce = <T extends (...a: unknown[]) => void>(fn: T, ms = 300) => {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

export const cn = (...c: (string|undefined|false)[]) =>
  c.filter(Boolean).join(' ');

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

export const truncate = (str: string, n: number) =>
  str.length > n ? str.slice(0, n) + '...' : str;`,

"src/utils/api.ts":
`// API client
const BASE = '/api';

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  get:    <T>(p: string)              => req<T>(p),
  post:   <T>(p: string, b: unknown)  => req<T>(p, { method:'POST',  body: JSON.stringify(b) }),
  put:    <T>(p: string, b: unknown)  => req<T>(p, { method:'PUT',   body: JSON.stringify(b) }),
  delete: <T>(p: string)              => req<T>(p, { method:'DELETE' }),
};`,

"package.json":
`{
  "name": "codeforge-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev":   "dev-server",
    "build": "build-app",
    "test":  "run-tests"
  },
  "dependencies": {
    "${pkg.r}": "^18.2.0",
    "${pkg.rd}": "^18.2.0"
  },
  "devDependencies": {
    "${pkg.ts}": "^5.3.0"
  }
}`,

"README.md":
`# ⚡ CodeForge App
React 18 + TypeScript full-stack app.

## Quick Start
\`\`\`bash
npm install
npm run dev   # → http://localhost:5173
\`\`\`

## Project Structure
\`\`\`
src/
  App.tsx          Main component
  App.css          Styles
  hooks/           Custom hooks
  components/      UI components
  utils/           Helpers & API
\`\`\``,

".env": `VITE_API_URL=http://localhost:4000\nPORT=4000\nNODE_ENV=development`,
".gitignore": `node_modules/\ndist/\n.env.local\n.DS_Store\n*.log`,
  };
};

/* ── Full folder tree with nested structure ── */
const mkTree = () => ([{
  id:"root", name:"codeforge-app", type:"F", open:true, children:[
    { id:"src", name:"src", type:"F", open:true, children:[
      { id:"hooks-f", name:"hooks", type:"F", open:false, children:[
        { id:"fuu", name:"useUsers.ts", type:"f" },
      ]},
      { id:"comp-f", name:"components", type:"F", open:false, children:[
        { id:"fbtn", name:"Button.tsx", type:"f" },
      ]},
      { id:"utils-f", name:"utils", type:"F", open:false, children:[
        { id:"fhelp", name:"helpers.ts", type:"f" },
        { id:"fapi",  name:"api.ts",     type:"f" },
      ]},
      { id:"fa", name:"App.tsx",  type:"f" },
      { id:"fb", name:"App.css",  type:"f" },
    ]},
    { id:"pub-f", name:"public", type:"F", open:false, children:[
      { id:"ficon", name:"favicon.ico", type:"f" },
    ]},
    { id:"fp", name:"package.json", type:"f" },
    { id:"fr", name:"README.md",    type:"f" },
    { id:"fe", name:".env",         type:"f" },
    { id:"fg", name:".gitignore",   type:"f" },
  ]
}]);

const FMAP0 = {
  fa:"src/App.tsx", fb:"src/App.css",
  fuu:"src/hooks/useUsers.ts", fbtn:"src/components/Button.tsx",
  fhelp:"src/utils/helpers.ts", fapi:"src/utils/api.ts",
  fp:"package.json", fr:"README.md", fe:".env", fg:".gitignore",
};

/* ── Syntax highlight ── */
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

/* ── Terminal commands ── */
async function*runCmd(cmd){
  const c=cmd.trim().toLowerCase();
  if(c==="help"){for(const t of["npm install","npm run dev","npm run build","npm test","git status","git log","git add .","ls","clear","deploy"])yield{t:"dim",v:`  ${t}`};return;}
  if(c==="ls"){yield{t:"out",v:"src/  public/  package.json  README.md  .env  .gitignore"};return;}
  if(c==="pwd"){yield{t:"out",v:"/workspace/codeforge-app"};return;}
  if(c==="git status"){yield{t:"grn",v:"On branch main"};yield{t:"yel",v:"Changes not staged:"};yield{t:"red",v:"  modified: src/App.tsx"};return;}
  if(c==="git add ."||c==="git add"){yield{t:"grn",v:"✓ Staged all changes"};return;}
  if(c==="git log"){yield{t:"yel",v:"commit a3f8c2d (HEAD -> main)"};yield{t:"out",v:"Date: "+new Date().toDateString()};return;}
  if(c.startsWith("git commit")){yield{t:"grn",v:"[main a3f8c2d] commit"};return;}
  if(c==="npm install"){yield{t:"inf",v:"⚙  Installing..."};await sleep(400);yield{t:"out",v:"added 847 packages"};yield{t:"grn",v:"✅ Done"};return;}
  if(c==="npm run dev"){yield{t:"inf",v:"Dev server ready in 312ms"};await sleep(300);yield{t:"grn",v:"  ➜  Local: http://localhost:5173/"};return;}
  if(c==="npm run build"){yield{t:"inf",v:"Building..."};await sleep(500);yield{t:"grn",v:"✓ built in 1.42s"};return;}
  if(c==="npm test"){yield{t:"inf",v:"Running tests..."};await sleep(400);yield{t:"grn",v:" Tests  5 passed"};return;}
  if(c==="deploy"){for(const[d,t,v]of[[200,"inf","▲ Deploying..."],[400,"grn","✓ Build OK"],[400,"out","🌐 Uploading..."],[400,"grn","✅ Deployed!"],[100,"acb","🔗 https://codeforge-app.vercel.app"]]){await sleep(d);yield{t,v};}return;}
  yield{t:"red",v:`not found: ${cmd}`};
}

/* ── Menu bar ── */
const MENUS=[
  {label:"File",items:[
    {label:"New File",   icon:"📄",key:"⌘N", act:"new-file"},
    {label:"New Folder", icon:"📁",key:"",   act:"new-folder"},
    "---",
    {label:"Save",       icon:"💾",key:"⌘S", act:"save"},
    {label:"Save All",   icon:"💾",key:"⌘⇧S",act:"save-all"},
    "---",
    {label:"Close Tab",  icon:"✕", key:"⌘W", act:"close-tab"},
    {label:"Close All",  icon:"✕✕",key:"",   act:"close-all"},
  ]},
  {label:"Edit",items:[
    {label:"Undo",         icon:"↩️",key:"⌘Z", act:"undo"},
    {label:"Redo",         icon:"↪️",key:"⌘⇧Z",act:"redo"},
    "---",
    {label:"Find in Files",icon:"🔍",key:"⌘⇧F",act:"search"},
    {label:"Format Doc",   icon:"🎨",key:"⌥⇧F",act:"format"},
    "---",
    {label:"Select All",   icon:"⬜",key:"⌘A", act:"select-all"},
  ]},
  {label:"View",items:[
    {label:"Explorer",       icon:"📁",key:"⌘⇧E",act:"files"},
    {label:"Search",         icon:"🔍",key:"⌘⇧F",act:"search"},
    {label:"Source Control", icon:"🔀",key:"⌘⇧G",act:"git"},
    {label:"Extensions",     icon:"🧩",key:"⌘⇧X",act:"extensions"},
    {label:"AI Copilot",     icon:"✨",key:"⌘I", act:"ai"},
    "---",
    {label:"Terminal",       icon:"💻",key:"⌘J", act:"terminal"},
    {label:"Split Editor",   icon:"⬜",key:"⌘\\",act:"split"},
    "---",
    {label:"Zoom In",        icon:"🔍",key:"⌘+", act:"zoom-in"},
    {label:"Zoom Out",       icon:"🔎",key:"⌘-", act:"zoom-out"},
    {label:"Reset Zoom",     icon:"⊙", key:"⌘0", act:"zoom-reset"},
    "---",
    {label:"Desktop Mode",   icon:"🖥️",key:"",   act:"desktop"},
    {label:"Mobile Mode",    icon:"📱",key:"",   act:"mobile"},
    "---",
    {label:"Command Palette",icon:"⚡",key:"⌘⇧P",act:"palette"},
  ]},
  {label:"Run",items:[
    {label:"Run File",       icon:"▶️",key:"F5",  act:"run"},
    "---",
    {label:"npm install",    icon:"📦",key:"",   act:"npm-install"},
    {label:"npm run dev",    icon:"🚀",key:"",   act:"npm-dev"},
    {label:"npm run build",  icon:"🏗️",key:"",   act:"npm-build"},
    {label:"npm test",       icon:"🧪",key:"",   act:"npm-test"},
  ]},
  {label:"Git",items:[
    {label:"Source Control", icon:"🔀",key:"⌘⇧G",act:"git"},
    "---",
    {label:"Stage All",      icon:"➕",key:"",   act:"git-add"},
    {label:"Commit",         icon:"✅",key:"",   act:"git"},
    {label:"Push",           icon:"⬆️",key:"",   act:"git-push"},
    {label:"Pull",           icon:"⬇️",key:"",   act:"git-pull"},
    "---",
    {label:"View Log",       icon:"📜",key:"",   act:"git-log"},
  ]},
  {label:"Deploy",items:[
    {label:"Deploy → Vercel", icon:"▲", key:"⌘D",act:"deploy-modal"},
    {label:"Deploy → Netlify",icon:"◆", key:"",  act:"deploy-modal"},
    {label:"Deploy → Railway",icon:"🚂",key:"",  act:"deploy-modal"},
    {label:"Deploy → Docker", icon:"🐳",key:"",  act:"deploy-modal"},
    {label:"Build Production",icon:"🏗️",key:"",  act:"npm-build"},
  ]},
  {label:"Help",items:[
    {label:"Command Palette",  icon:"⚡",key:"⌘⇧P",act:"palette"},
    {label:"Keyboard Shortcuts",icon:"⌨️",key:"",  act:"shortcuts"},
    "---",
    {label:"About CodeForge",  icon:"⚡",key:"",   act:"about"},
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
    <div ref={ref} style={{height:30,background:D.ttl,borderBottom:`1px solid ${D.bdr}`,display:"flex",alignItems:"stretch",flexShrink:0,overflowX:"auto",overflowY:"visible",zIndex:200,userSelect:"none",position:"relative"}}>
      {MENUS.map((m,mi)=>(
        <div key={m.label} style={{position:"relative",flexShrink:0}}>
          <button
            onClick={()=>setOpenMenu(openMenu===mi?null:mi)}
            onMouseEnter={()=>openMenu!==null&&setOpenMenu(mi)}
            style={{height:"100%",padding:"0 10px",background:openMenu===mi?D.sel:"transparent",border:"none",color:openMenu===mi?D.wht:D.txt,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",transition:"background .1s"}}
            onMouseOver={e=>{if(openMenu===null)e.currentTarget.style.background=D.hov;}}
            onMouseOut={e=>{if(openMenu!==mi)e.currentTarget.style.background="transparent";}}>
            {m.label}
          </button>
          {openMenu===mi&&(
            <div style={{position:"fixed",left:ref.current?.children[mi]?.getBoundingClientRect().left||0,top:60,background:D.sb,border:`1px solid ${D.bdr}`,borderRadius:"0 0 8px 8px",zIndex:999,minWidth:210,boxShadow:"0 12px 40px #000c",maxHeight:"70vh",overflowY:"auto"}}>
              {m.items.map((it,ii)=>it==="---"
                ?<div key={ii} style={{height:1,background:D.bdr,margin:"3px 0"}}/>
                :<div key={ii} onClick={()=>{onAct(it.act);setOpenMenu(null);}}
                  style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",cursor:"pointer",fontSize:13,color:D.txt}}
                  onMouseEnter={e=>e.currentTarget.style.background=D.sel}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <span style={{width:20,textAlign:"center",fontSize:15}}>{it.icon}</span>
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

/* ── Context menu ── */
function CtxMenu({x,y,items,onClose}){
  const ref=useRef(null);
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))onClose();};setTimeout(()=>document.addEventListener("mousedown",h),0);return()=>document.removeEventListener("mousedown",h);},[]);
  return(<div ref={ref} style={{position:"fixed",left:Math.min(x,window.innerWidth-190),top:Math.min(y,window.innerHeight-240),background:D.sb,border:`1px solid ${D.bdr}`,borderRadius:8,zIndex:1000,boxShadow:"0 8px 32px #000c",minWidth:175,overflow:"hidden"}}>
    {items.map((it,i)=>it==="---"
      ?<div key={i} style={{height:1,background:D.bdr,margin:"3px 0"}}/>
      :<div key={i} onClick={()=>{it.action();onClose();}}
        style={{padding:"10px 14px",fontSize:13,color:it.danger?D.red:D.txt,cursor:"pointer",display:"flex",alignItems:"center",gap:10,minHeight:40}}
        onMouseEnter={e=>e.currentTarget.style.background=D.hov}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <span style={{fontSize:16}}>{it.icon}</span><span>{it.label}</span>
      </div>
    )}
  </div>);
}

/* ── Inline rename ── */
function InlineInput({value,onOk,onCancel}){
  const[v,setV]=useState(value),r=useRef(null);
  useEffect(()=>{r.current?.focus();r.current?.select();},[]);
  return(<input ref={r} value={v} onChange={e=>setV(e.target.value)}
    onKeyDown={e=>{if(e.key==="Enter")onOk(v.trim());if(e.key==="Escape")onCancel();}}
    onBlur={()=>onOk(v.trim())}
    style={{flex:1,background:D.inp,border:`1px solid ${D.ac}`,borderRadius:3,padding:"2px 6px",color:D.txt,fontSize:13,outline:"none",fontFamily:"inherit",minWidth:0}}/>);
}

/* ── Tree Node — full open/close for folders and files ── */
function TNode({node,depth=0,active,onOpen,onToggle,onCtx,editId,onEditOk,onEditCancel,fmap}){
  const isF=node.type==="f";
  const fp=isF?(fmap[node.id]||null):null;
  const isAct=fp===active;
  const isEd=editId===node.id;
  const isOpen=!isF&&node.open;
  const lt=useRef(null);

  const handleTap=()=>{
    if(isEd)return;
    if(isF)onOpen(fp);
    else onToggle(node.id);
  };

  const startLong=e=>{
    lt.current=setTimeout(()=>{
      const t=e.touches?.[0];
      if(t)onCtx({clientX:t.clientX,clientY:t.clientY},node,isF,fp);
    },600);
  };

  return(
    <div>
      {/* Row */}
      <div
        onContextMenu={e=>{e.preventDefault();onCtx(e,node,isF,fp);}}
        onTouchStart={startLong}
        onTouchMove={()=>clearTimeout(lt.current)}
        onTouchEnd={e=>{clearTimeout(lt.current);e.preventDefault();handleTap();}}
        onClick={handleTap}
        style={{
          display:"flex",alignItems:"center",gap:0,
          padding:`5px 8px 5px ${depth*16+4}px`,
          cursor:"pointer",minHeight:34,
          background:isAct?D.sel:"transparent",
          color:isAct?D.wht:D.txt,
          borderLeft:`2px solid ${isAct?D.ac:"transparent"}`,
          userSelect:"none",
        }}
        onMouseEnter={e=>{if(!isAct)e.currentTarget.style.background=D.hov;}}
        onMouseLeave={e=>{if(!isAct)e.currentTarget.style.background="transparent";}}>

        {/* Chevron for folders */}
        {!isF?(
          <span style={{
            width:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",
            flexShrink:0,fontSize:10,color:D.dim,
            transform:isOpen?"rotate(90deg)":"rotate(0deg)",
            transition:"transform .2s",marginRight:2,
          }}>▶</span>
        ):<span style={{width:18,flexShrink:0}}/>}

        {/* Icon */}
        <span style={{fontSize:16,marginRight:6,flexShrink:0}}>
          {isF?(gl(fp||"").i||"📄"):isOpen?"📂":"📁"}
        </span>

        {/* Name / input */}
        {isEd
          ?<InlineInput value={node.name} onOk={onEditOk} onCancel={onEditCancel}/>
          :<span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:13}}>
            {node.name}
          </span>
        }

        {/* File badge */}
        {isF&&fp&&<span style={{fontSize:10,color:D.dim,marginLeft:4,flexShrink:0,opacity:.7}}>{gl(fp).n.slice(0,3)}</span>}

        {/* Folder count badge */}
        {!isF&&node.children?.length>0&&!isOpen&&(
          <span style={{fontSize:10,background:D.bdr,color:D.dim,borderRadius:8,padding:"1px 5px",marginLeft:4,flexShrink:0}}>{node.children.length}</span>
        )}
      </div>

      {/* Children — animated */}
      {!isF&&isOpen&&(
        <div style={{animation:"expandDown .15s ease"}}>
          {node.children?.map(c=>(
            <TNode key={c.id} node={c} depth={depth+1}
              active={active} onOpen={onOpen} onToggle={onToggle} onCtx={onCtx}
              editId={editId} onEditOk={onEditOk} onEditCancel={onEditCancel} fmap={fmap}/>
          ))}
          {/* Empty folder hint */}
          {node.children?.length===0&&(
            <div style={{padding:`4px 8px 4px ${(depth+1)*16+22}px`,fontSize:12,color:D.dim,fontStyle:"italic"}}>empty folder</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── New item input row ── */
function NewRow({type,depth,onOk,onCancel}){
  const[v,setV]=useState(""),r=useRef(null);
  useEffect(()=>r.current?.focus(),[]);
  const ok=()=>v.trim()?onOk(v.trim()):onCancel();
  return(
    <div style={{display:"flex",alignItems:"center",gap:6,padding:`4px 8px 4px ${depth*16+22}px`,minHeight:34,background:`${D.ac}11`}}>
      <span style={{fontSize:16}}>{type==="f"?"📄":"📁"}</span>
      <input ref={r} value={v} onChange={e=>setV(e.target.value)}
        onKeyDown={e=>{if(e.key==="Enter")ok();if(e.key==="Escape")onCancel();}}
        onBlur={ok}
        placeholder={type==="f"?"filename.js":"folder name"}
        style={{flex:1,background:D.inp,border:`1px solid ${D.ac}`,borderRadius:4,padding:"4px 8px",color:D.txt,fontSize:13,outline:"none"}}/>
    </div>
  );
}

/* ── Code Editor ── */
function Editor({filename,content,onChange,fontSize}){
  const ta=useRef(null),pre=useRef(null);
  const[ln,setLn]=useState(1),[col,setCol]=useState(1);
  const lines=content.split("\n");
  const sync=()=>{if(ta.current&&pre.current){pre.current.scrollTop=ta.current.scrollTop;pre.current.scrollLeft=ta.current.scrollLeft;}};
  const cursor=()=>{if(!ta.current)return;const b=content.slice(0,ta.current.selectionStart).split("\n");setLn(b.length);setCol(b.pop().length+1);};
  const onTab=e=>{if(e.key!=="Tab")return;e.preventDefault();const s=e.target.selectionStart,end=e.target.selectionEnd;onChange(content.slice(0,s)+"  "+content.slice(end));setTimeout(()=>{ta.current.selectionStart=ta.current.selectionEnd=s+2;},0);};
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{flex:1,display:"flex",overflow:"hidden",position:"relative"}}>
        <div style={{width:40,flexShrink:0,background:"#1a1a1d",borderRight:`1px solid ${D.bdr}`,textAlign:"right",padding:"10px 4px 10px 0",fontFamily:"'JetBrains Mono',monospace",fontSize:fontSize-1,lineHeight:"1.65",color:D.dim,overflowY:"hidden",userSelect:"none"}}>
          {lines.map((_,i)=><div key={i} style={{color:i+1===ln?D.txt:D.dim,background:i+1===ln?D.lhl:"transparent",paddingRight:4,minHeight:fontSize*1.65}}>{i+1}</div>)}
        </div>
        <div style={{flex:1,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",left:0,right:0,top:`calc(${ln-1} * ${fontSize*1.65}px + 10px)`,height:fontSize*1.65,background:D.lhl,pointerEvents:"none",zIndex:0}}/>
          <pre ref={pre} aria-hidden style={{position:"absolute",inset:0,margin:0,padding:`10px 10px 10px 12px`,fontFamily:"'JetBrains Mono',monospace",fontSize,lineHeight:"1.65",color:D.txt,background:"transparent",overflow:"hidden",pointerEvents:"none",whiteSpace:"pre-wrap",wordBreak:"break-word",zIndex:1}} dangerouslySetInnerHTML={{__html:hl(content)}}/>
          <textarea ref={ta} value={content}
            onChange={e=>{onChange(e.target.value);sync();}}
            onKeyDown={onTab} onScroll={sync} onKeyUp={cursor} onClick={cursor}
            spellCheck={false}
            style={{position:"absolute",inset:0,padding:`10px 10px 10px 12px`,fontFamily:"'JetBrains Mono',monospace",fontSize,lineHeight:"1.65",color:"transparent",caretColor:D.acb,background:"transparent",border:"none",outline:"none",resize:"none",whiteSpace:"pre-wrap",wordBreak:"break-word",overflowY:"auto",overflowX:"auto",zIndex:2,WebkitOverflowScrolling:"touch"}}/>
        </div>
      </div>
      <div style={{height:20,background:"#1a1a1d",borderTop:`1px solid ${D.bdr}`,display:"flex",alignItems:"center",padding:"0 10px",gap:12,fontSize:11,color:D.dim,flexShrink:0}}>
        <span>Ln {ln}, Col {col}</span>
        <span>{lines.length} lines</span>
        <span style={{marginLeft:"auto"}}>{gl(filename).n}</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}

/* ── Terminal ── */
function Term({lines,onRun,input,setInput,running}){
  const r=useRef(null);
  useEffect(()=>r.current?.scrollIntoView({behavior:"smooth"}),[lines]);
  const C={sys:D.ac,inf:D.blu,out:D.txt,grn:D.grn,red:D.red,yel:D.yel,dim:D.dim,acb:D.acb};
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#141414"}}>
      <div style={{flex:1,overflow:"auto",padding:"6px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.7,WebkitOverflowScrolling:"touch"}}>
        {lines.map((l,i)=><div key={i} style={{color:C[l.t]||D.txt,whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{l.v}</div>)}
        <div ref={r}/>
      </div>
      <div style={{display:"flex",alignItems:"center",borderTop:`1px solid ${D.bdr}`,padding:"6px 10px",gap:6,background:D.bg}}>
        <span style={{fontFamily:"monospace",fontSize:13,flexShrink:0,color:D.grn}}>$</span>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&onRun()}
          disabled={running}
          placeholder={running?"Running...":"command..."}
          style={{flex:1,background:"transparent",border:"none",outline:"none",color:D.txt,fontFamily:"'JetBrains Mono',monospace",fontSize:13,opacity:running?.5:1}}/>
        <button onClick={onRun} disabled={running} style={{background:D.ac,border:"none",borderRadius:4,padding:"4px 10px",color:"#fff",fontSize:12,cursor:"pointer",flexShrink:0}}>▶</button>
      </div>
    </div>
  );
}

/* ── Search ── */
function SearchPanel({files,onOpen}){
  const[q,setQ]=useState("");
  const res=q.trim()?Object.entries(files).flatMap(([k,v])=>v.split("\n").reduce((a,l,i)=>{if(l.toLowerCase().includes(q.toLowerCase()))a.push({file:k,line:i+1,text:l.trim()});return a;},[]).slice(0,4)).slice(0,30):[];
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"10px 12px",borderBottom:`1px solid ${D.bdr}`}}>
        <div style={{fontSize:11,color:D.dim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Search</div>
        <input value={q} onChange={e=>setQ(e.target.value)} autoFocus placeholder="Search across all files..."
          style={{width:"100%",background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:6,padding:"8px 12px",color:D.txt,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
        {res.length>0&&<div style={{fontSize:11,color:D.dim,marginTop:6}}>{res.length} results</div>}
      </div>
      <div style={{flex:1,overflow:"auto",WebkitOverflowScrolling:"touch"}}>
        {res.map((r,i)=>(
          <div key={i} onClick={()=>onOpen(r.file)}
            style={{padding:"8px 12px",cursor:"pointer",borderBottom:`1px solid ${D.bdr}22`,minHeight:48}}
            onMouseEnter={e=>e.currentTarget.style.background=D.hov}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{fontSize:11,color:D.ac,marginBottom:2}}>{r.file}:{r.line}</div>
            <div style={{fontSize:12,color:D.txt,fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.text}</div>
          </div>
        ))}
        {q&&res.length===0&&<div style={{padding:20,color:D.dim,fontSize:13,textAlign:"center"}}>No results for "{q}"</div>}
      </div>
    </div>
  );
}

/* ── Git ── */
function GitPanel({modified}){
  const[msg,setMsg]=useState(""),[done,setDone]=useState(false);
  const commit=()=>{if(!msg.trim())return;setDone(true);setMsg("");setTimeout(()=>setDone(false),3000);};
  return(
    <div style={{height:"100%",overflow:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{padding:"10px 12px",borderBottom:`1px solid ${D.bdr}`}}>
        <div style={{fontSize:11,color:D.dim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>Source Control</div>
        <div style={{fontSize:13,color:D.txt,display:"flex",gap:8,alignItems:"center"}}><span style={{color:D.ac}}>⎇</span> main {done&&<span style={{color:D.grn,marginLeft:"auto",fontSize:11}}>✓ Committed</span>}</div>
      </div>
      <div style={{padding:"10px 12px",borderBottom:`1px solid ${D.bdr}`}}>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Commit message (Ctrl+Enter)" rows={3}
          onKeyDown={e=>e.ctrlKey&&e.key==="Enter"&&commit()}
          style={{width:"100%",background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:6,padding:"8px 10px",color:D.txt,fontSize:13,resize:"none",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
        <button onClick={commit} style={{width:"100%",marginTop:8,background:D.ac,border:"none",borderRadius:6,padding:"10px",color:"#fff",fontWeight:600,cursor:"pointer",fontSize:13}}>✓ Commit to main</button>
      </div>
      <div style={{padding:"10px 12px"}}>
        <div style={{fontSize:11,color:D.dim,marginBottom:8,textTransform:"uppercase"}}>Changes ({modified.length})</div>
        {modified.length===0&&<div style={{color:D.dim,fontSize:13}}>No changes — workspace clean</div>}
        {modified.map(f=><div key={f} style={{display:"flex",gap:8,padding:"5px 0",fontSize:13,alignItems:"center"}}><span style={{color:D.yel,fontWeight:700,fontSize:11,width:14,flexShrink:0}}>M</span><span style={{color:D.txt}}>{f}</span></div>)}
      </div>
      <div style={{padding:"10px 12px",borderTop:`1px solid ${D.bdr}`}}>
        <div style={{fontSize:11,color:D.dim,marginBottom:8,textTransform:"uppercase"}}>Branches</div>
        {["main","develop","feature/auth","fix/bug"].map(b=><div key={b} style={{fontSize:13,color:b==="main"?D.ac:D.dim,padding:"5px 4px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,minHeight:34}}><span>{b==="main"?"●":"○"}</span>{b}</div>)}
      </div>
    </div>
  );
}

/* ── Extensions ── */
const EXT=[{id:1,n:"Prettier",p:"Prettier",i:"💅",d:"Formatter",dl:"38M",on:true},{id:2,n:"ESLint",p:"Microsoft",i:"🔍",d:"Linter",dl:"30M",on:true},{id:3,n:"GitLens",p:"GitKraken",i:"🔮",d:"Git tools",dl:"22M",on:true},{id:4,n:"Tailwind",p:"Tailwind",i:"🌊",d:"CSS",dl:"15M",on:false},{id:5,n:"Docker",p:"Microsoft",i:"🐳",d:"Containers",dl:"12M",on:false},{id:6,n:"Thunder",p:"Ranga",i:"⚡",d:"REST client",dl:"8M",on:false},{id:7,n:"Copilot",p:"GitHub",i:"🤖",d:"AI coding",dl:"6M",on:false}];
function ExtPanel(){
  const[exts,setExts]=useState(EXT),[q,setQ]=useState("");
  const toggle=id=>setExts(e=>e.map(x=>x.id===id?{...x,on:!x.on,loading:!x.on}:x));
  useEffect(()=>{const ts=exts.filter(e=>e.loading).map(e=>setTimeout(()=>setExts(ex=>ex.map(x=>x.id===e.id?{...x,loading:false}:x)),1400));return()=>ts.forEach(clearTimeout);},[exts]);
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"10px 12px",borderBottom:`1px solid ${D.bdr}`}}>
        <div style={{fontSize:11,color:D.dim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Extensions Marketplace</div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search extensions..."
          style={{width:"100%",background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:6,padding:"8px 12px",color:D.txt,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
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
    </div>
  );
}

/* ── Settings ── */
function SettingsPanel({s,set,dm,setDm,zoom,setZoom}){
  return(
    <div style={{height:"100%",overflow:"auto",WebkitOverflowScrolling:"touch"}}>
      <div style={{padding:"10px 12px",borderBottom:`1px solid ${D.bdr}`}}><div style={{fontSize:11,color:D.dim,textTransform:"uppercase",letterSpacing:".08em"}}>Settings</div></div>

      {/* View mode */}
      <div style={{padding:"12px",borderBottom:`1px solid ${D.bdr}`,background:D.hov}}>
        <div style={{fontSize:13,color:D.ac,fontWeight:600,marginBottom:10}}>View Mode</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setDm(false)} style={{flex:1,padding:"10px 0",borderRadius:8,border:`2px solid ${!dm?D.ac:D.bdr}`,background:!dm?`${D.ac}22`:"transparent",color:!dm?D.ac:D.dim,cursor:"pointer",fontSize:13,fontWeight:600}}>📱 Mobile</button>
          <button onClick={()=>setDm(true)}  style={{flex:1,padding:"10px 0",borderRadius:8,border:`2px solid ${dm?D.ac:D.bdr}`, background:dm?`${D.ac}22`:"transparent", color:dm?D.ac:D.dim, cursor:"pointer",fontSize:13,fontWeight:600}}>🖥️ Desktop</button>
        </div>
      </div>

      {/* Zoom */}
      <div style={{padding:"12px",borderBottom:`1px solid ${D.bdr}`}}>
        <div style={{fontSize:13,color:D.ac,fontWeight:600,marginBottom:10}}>🔍 Page Zoom: {Math.round(zoom*100)}%</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>setZoom(z=>Math.max(.5,+(z-.1).toFixed(1)))} style={{width:40,height:40,background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:8,color:D.txt,fontSize:20,cursor:"pointer"}}>−</button>
          <div style={{flex:1,background:D.inp,borderRadius:8,padding:"4px 8px",textAlign:"center"}}>
            <input type="range" min={50} max={200} value={Math.round(zoom*100)} onChange={e=>setZoom(+(e.target.value/100).toFixed(2))} style={{width:"100%",accentColor:D.ac}}/>
          </div>
          <button onClick={()=>setZoom(z=>Math.min(2,+(z+.1).toFixed(1)))} style={{width:40,height:40,background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:8,color:D.txt,fontSize:20,cursor:"pointer"}}>+</button>
        </div>
        <button onClick={()=>setZoom(1)} style={{width:"100%",marginTop:8,background:"transparent",border:`1px solid ${D.bdr}`,borderRadius:6,padding:6,color:D.dim,cursor:"pointer",fontSize:12}}>Reset to 100%</button>
      </div>

      {[{k:"fontSize",l:"Editor Font Size",t:"range",min:10,max:20},{k:"tabSize",l:"Tab Size",t:"sel",opts:[2,4,8]},{k:"wordWrap",l:"Word Wrap",t:"tog"},{k:"autoSave",l:"Auto Save",t:"tog"},{k:"lineNumbers",l:"Line Numbers",t:"tog"}].map(({k,l,t,min,max,opts})=>(
        <div key={k} style={{padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,borderBottom:`1px solid ${D.bdr}11`,minHeight:44}}>
          <span style={{fontSize:13,color:D.txt}}>{l}</span>
          {t==="tog"&&<div onClick={()=>set(k,!s[k])} style={{width:40,height:22,borderRadius:11,cursor:"pointer",background:s[k]?D.ac:D.bdr,position:"relative",transition:"background .2s",flexShrink:0}}><div style={{width:18,height:18,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:s[k]?20:2,transition:"left .2s"}}/></div>}
          {t==="range"&&<div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,color:D.ac,width:24,textAlign:"center"}}>{s[k]}</span><input type="range" min={min} max={max} value={s[k]} onChange={e=>set(k,+e.target.value)} style={{width:90,accentColor:D.ac}}/></div>}
          {t==="sel"&&<select value={s[k]} onChange={e=>set(k,+e.target.value)} style={{background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:6,padding:"5px 10px",color:D.txt,fontSize:13,outline:"none"}}>{opts.map(o=><option key={o}>{o}</option>)}</select>}
        </div>
      ))}
    </div>
  );
}

/* ── AI Copilot ── */
function AICopilot({file,content}){
  const[msgs,setMsgs]=useState([{r:"ai",t:`👋 AI assistant ready. I have full context of \`${file}\`. Ask me anything!`}]);
  const[q,setQ]=useState(""),[loading,setL]=useState(false),r=useRef(null);
  useEffect(()=>r.current?.scrollIntoView({behavior:"smooth"}),[msgs]);
  const send=async()=>{
    if(!q.trim()||loading)return;
    const question=q.trim();setQ("");setMsgs(m=>[...m,{r:"user",t:question}]);setL(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`Expert developer in a mobile IDE.\n\nFile: ${file}\n\`\`\`\n${(content||"").slice(0,1200)}\n\`\`\`\n\nUser: ${question}\n\nBe concise. Max 250 words.`}]})});
      const d=await res.json();setMsgs(m=>[...m,{r:"ai",t:d.content?.[0]?.text||"Error."}]);
    }catch{setMsgs(m=>[...m,{r:"ai",t:"Network error."}]);}
    setL(false);
  };
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"10px 12px",borderBottom:`1px solid ${D.bdr}`,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${D.ac},${D.pur})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>✨</div>
        <div><div style={{fontSize:13,fontWeight:600,color:D.txt}}>AI Copilot</div><div style={{fontSize:11,color:D.grn}}>● Connected · {file}</div></div>
      </div>
      <div style={{flex:1,overflow:"auto",padding:12,display:"flex",flexDirection:"column",gap:10,WebkitOverflowScrolling:"touch"}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.r==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"88%",padding:"10px 14px",borderRadius:m.r==="user"?"14px 14px 2px 14px":"14px 14px 14px 2px",background:m.r==="user"?D.ac:D.sb,color:m.r==="user"?"#fff":D.txt,fontSize:13,lineHeight:1.6,border:m.r==="ai"?`1px solid ${D.bdr}`:"none",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{m.t}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",gap:5,padding:8}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:D.ac,animation:`pulse 1s ${i*.2}s infinite`}}/>)}</div>}
        <div ref={r}/>
      </div>
      {msgs.length<=2&&<div style={{padding:"0 12px 10px",display:"flex",flexWrap:"wrap",gap:6}}>{["Explain this","Find bugs","Add types","Write tests","Refactor"].map(h=><button key={h} onClick={()=>setQ(h)} style={{background:D.sb,border:`1px solid ${D.bdr}`,borderRadius:6,padding:"6px 10px",color:D.dim,fontSize:12,cursor:"pointer"}}>{h}</button>)}</div>}
      <div style={{padding:12,borderTop:`1px solid ${D.bdr}`,display:"flex",gap:8}}>
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about your code..."
          style={{flex:1,background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:8,padding:"10px 12px",color:D.txt,fontSize:13,outline:"none",fontFamily:"inherit"}}/>
        <button onClick={send} disabled={loading} style={{background:D.ac,border:"none",borderRadius:8,width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",cursor:loading?"not-allowed":"pointer",opacity:loading?.5:1,color:"#fff",fontSize:18}}>▶</button>
      </div>
    </div>
  );
}

/* ── Command Palette ── */
const CMDS=[{id:"files",l:"Explorer",k:"⌘E",e:"📁"},{id:"search",l:"Search",k:"⌘⇧F",e:"🔍"},{id:"git",l:"Source Control",k:"⌘⇧G",e:"🔀"},{id:"extensions",l:"Extensions",k:"⌘⇧X",e:"🧩"},{id:"ai",l:"AI Copilot",k:"⌘I",e:"✨"},{id:"settings",l:"Settings",k:"⌘,",e:"⚙️"},{id:"terminal",l:"Toggle Terminal",k:"⌘J",e:"💻"},{id:"split",l:"Split Editor",k:"⌘\\",e:"⬜"},{id:"save",l:"Save File",k:"⌘S",e:"💾"},{id:"save-all",l:"Save All",k:"⌘⇧S",e:"💾"},{id:"new-file",l:"New File",k:"⌘N",e:"📄"},{id:"new-folder",l:"New Folder",k:"",e:"📁"},{id:"deploy-modal",l:"Deploy",k:"⌘D",e:"🚀"},{id:"close-tab",l:"Close Tab",k:"⌘W",e:"✕"},{id:"run",l:"Run",k:"F5",e:"▶"},{id:"zoom-in",l:"Zoom In",k:"⌘+",e:"🔍"},{id:"zoom-out",l:"Zoom Out",k:"⌘-",e:"🔎"},{id:"zoom-reset",l:"Reset Zoom",k:"⌘0",e:"⊙"}];
function CmdPalette({onClose,onCmd}){
  const[q,setQ]=useState(""),[sel,setSel]=useState(0);
  const f=CMDS.filter(c=>!q||c.l.toLowerCase().includes(q.toLowerCase()));
  useEffect(()=>setSel(0),[q]);
  const run=c=>{onCmd(c.id);onClose();};
  return(
    <div style={{position:"fixed",inset:0,background:"#00000090",zIndex:900,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:"8vh",backdropFilter:"blur(6px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{width:"min(560px,95vw)",background:D.sb,borderRadius:10,border:`1px solid ${D.bdr}`,overflow:"hidden",boxShadow:"0 24px 60px #000d"}}>
        <input autoFocus value={q} onChange={e=>setQ(e.target.value)}
          onKeyDown={e=>{if(e.key==="ArrowDown"){e.preventDefault();setSel(s=>Math.min(s+1,f.length-1));}if(e.key==="ArrowUp"){e.preventDefault();setSel(s=>Math.max(s-1,0));}if(e.key==="Enter")run(f[sel]);if(e.key==="Escape")onClose();}}
          placeholder="> Type a command or search..."
          style={{width:"100%",background:D.inp,border:"none",borderBottom:`1px solid ${D.bdr}`,padding:"14px 16px",color:D.txt,fontSize:15,outline:"none",fontFamily:"'JetBrains Mono',monospace",boxSizing:"border-box"}}/>
        <div style={{maxHeight:"55vh",overflow:"auto",WebkitOverflowScrolling:"touch"}}>
          {f.map((c,i)=>(
            <div key={c.id} onClick={()=>run(c)} onMouseEnter={()=>setSel(i)}
              style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",background:i===sel?D.sel:"transparent",color:i===sel?D.wht:D.txt,minHeight:44}}>
              <span style={{fontSize:16,width:24,textAlign:"center"}}>{c.e}</span>
              <span style={{flex:1,fontSize:14}}>{c.l}</span>
              {c.k&&<span style={{fontSize:11,color:D.dim,background:D.bdr,borderRadius:4,padding:"2px 7px"}}>{c.k}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Deploy Modal ── */
function DeployModal({onClose}){
  const[plat,setPlat]=useState(null),[step,setStep]=useState(0),[log,setLog]=useState([]),[url,setUrl]=useState("");
  const PS=[{id:"vercel",n:"Vercel",i:"▲",d:"Serverless"},{id:"netlify",n:"Netlify",i:"◆",d:"Static"},{id:"railway",n:"Railway",i:"🚂",d:"Full-Stack"},{id:"docker",n:"Docker",i:"🐳",d:"Container"},{id:"aws",n:"AWS",i:"🔶",d:"Lambda"},{id:"render",n:"Render",i:"🔷",d:"Auto-deploy"}];
  const deploy=async()=>{setStep(2);setLog([]);for(const[d,t,v]of[[200,"inf","📦 Bundling..."],[300,"grn","✓ Build OK"],[300,"out","🌐 Uploading..."],[400,"grn","✅ Deployed!"],[100,"acb",`🔗 https://codeforge.${plat.id}.app`]]){await sleep(d);setLog(l=>[...l,{t,v}]);}setUrl(`https://codeforge.${plat.id}.app`);};
  const C={inf:D.blu,out:D.txt,grn:D.grn,acb:D.acb};
  return(
    <div style={{position:"fixed",inset:0,background:"#000b",zIndex:850,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(6px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{width:"100%",maxWidth:480,background:D.sb,borderRadius:"16px 16px 0 0",border:`1px solid ${D.bdr}`,overflow:"hidden",boxShadow:"0 -8px 40px #000c",maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{padding:"16px",borderBottom:`1px solid ${D.bdr}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:15,fontWeight:700,color:D.txt}}>🚀 Deploy to Production</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:20,padding:"0 4px"}}>✕</button>
        </div>
        {step===0&&<div style={{padding:16}}><div style={{fontSize:13,color:D.dim,marginBottom:12}}>Select platform:</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{PS.map(p=><button key={p.id} onClick={()=>{setPlat(p);setStep(1);}} style={{background:D.bg,border:`1px solid ${D.bdr}`,borderRadius:10,padding:"14px 10px",cursor:"pointer",textAlign:"left",minHeight:80}} onMouseEnter={e=>e.currentTarget.style.borderColor=D.ac} onMouseLeave={e=>e.currentTarget.style.borderColor=D.bdr}><div style={{fontSize:24,marginBottom:6}}>{p.i}</div><div style={{fontSize:14,fontWeight:600,color:D.txt}}>{p.n}</div><div style={{fontSize:12,color:D.dim}}>{p.d}</div></button>)}</div></div>}
        {step===1&&plat&&<div style={{padding:16}}><div style={{fontSize:24,textAlign:"center",marginBottom:8}}>{plat.i}</div><div style={{fontSize:15,fontWeight:600,color:D.txt,textAlign:"center",marginBottom:16}}>{plat.n}</div>{[["Project","codeforge-app"],["Branch","main"],["Build","npm run build"],["Output","dist"]].map(([l,v])=><div key={l} style={{marginBottom:12}}><div style={{fontSize:11,color:D.dim,marginBottom:4,textTransform:"uppercase"}}>{l}</div><input defaultValue={v} style={{width:"100%",background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:6,padding:"10px 12px",color:D.txt,fontSize:13,outline:"none",boxSizing:"border-box"}}/></div>)}<div style={{display:"flex",gap:10,marginTop:8}}><button onClick={()=>setStep(0)} style={{flex:1,background:D.hov,border:`1px solid ${D.bdr}`,borderRadius:8,padding:"12px",color:D.dim,cursor:"pointer",fontSize:13}}>Back</button><button onClick={deploy} style={{flex:2,background:D.ac,border:"none",borderRadius:8,padding:"12px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>🚀 Deploy Now</button></div></div>}
        {step===2&&<div style={{padding:16}}><div style={{background:D.bg,borderRadius:10,padding:12,fontFamily:"monospace",fontSize:12,lineHeight:1.8,maxHeight:200,overflow:"auto",border:`1px solid ${D.bdr}`}}>{log.map((l,i)=><div key={i} style={{color:C[l.t]||D.txt}}>{l.v}</div>)}{!url&&<span style={{color:D.ac,animation:"blink 1s infinite"}}>▌</span>}</div>{url&&<div style={{marginTop:14,textAlign:"center"}}><div style={{fontSize:32}}>🎉</div><div style={{color:D.grn,fontWeight:700,fontSize:15,margin:"8px 0 4px"}}>Live!</div><div style={{color:D.ac,fontSize:13,background:D.bg,padding:"8px 14px",borderRadius:8,border:`1px solid ${D.bdr}`,marginBottom:14}}>{url}</div><button onClick={onClose} style={{background:D.ac,border:"none",borderRadius:8,padding:"10px 28px",color:"#fff",cursor:"pointer",fontWeight:600,fontSize:14}}>Done ✓</button></div>}</div>}
      </div>
    </div>
  );
}

/* ═══════════ MAIN APP ═══════════ */
export default function App(){
  const[tree,setTree]       =useState(mkTree);
  const[files,setFiles]     =useState(mkFiles);
  const[fmap,setFmap]       =useState(FMAP0);
  const[tabs,setTabs]       =useState(["src/App.tsx"]);
  const[active,setActive]   =useState("src/App.tsx");
  const[panel,setPanel]     =useState("files"); // active sidebar panel
  const[sbOpen,setSbOpen]   =useState(true);
  const[termOpen,setTO]     =useState(false);
  const[termH,setTermH]     =useState(200);
  const[tLines,setTLines]   =useState([{t:"sys",v:"CodeForge Pro — ready"},{t:"dim",v:'Type "help" for commands'}]);
  const[tInput,setTInput]   =useState("");
  const[tRun,setTRun]       =useState(false);
  const[showCmd,setShowCmd] =useState(false);
  const[showDep,setShowDep] =useState(false);
  const[split,setSplit]     =useState(false);
  const[splitT,setSplitT]   =useState("");
  const[modified,setMod]    =useState(new Set());
  const[notifs,setNotifs]   =useState([]);
  const[editId,setEditId]   =useState(null);
  const[newItem,setNI]      =useState(null);
  const[ctx,setCtx]         =useState(null);
  const[dm,setDm]           =useState(false);
  const[zoom,setZoom]       =useState(1);
  const[openMenu,setOpenMenu]=useState(null);
  const[cfg,setCfg]         =useState({fontSize:13,tabSize:2,wordWrap:true,autoSave:true,lineNumbers:true,bracketPairs:true});

  /* Pinch-to-zoom */
  const pinchRef=useRef({dist:null,z0:null});
  const handleTouchMove=useCallback(e=>{
    if(e.touches.length!==2)return;
    const dx=e.touches[0].clientX-e.touches[1].clientX;
    const dy=e.touches[0].clientY-e.touches[1].clientY;
    const dist=Math.hypot(dx,dy);
    if(pinchRef.current.dist===null){pinchRef.current.dist=dist;pinchRef.current.z0=zoom;return;}
    const newZ=Math.min(2,Math.max(.5,pinchRef.current.z0*(dist/pinchRef.current.dist)));
    setZoom(+newZ.toFixed(2));
  },[zoom]);
  const handleTouchEnd=useCallback(()=>{pinchRef.current.dist=null;pinchRef.current.z0=null;},[]);

  /* Auto-detect wide screens */
  useEffect(()=>{const f=()=>setDm(window.innerWidth>=900);f();window.addEventListener("resize",f);return()=>window.removeEventListener("resize",f);},[]);

  const note=(msg,type="info")=>{const id=Date.now();setNotifs(n=>[...n,{id,msg,type}]);setTimeout(()=>setNotifs(n=>n.filter(x=>x.id!==id)),3000);};
  const openFile=useCallback(key=>{if(!key)return;setActive(key);setTabs(t=>t.includes(key)?t:[...t,key]);if(!dm)setSbOpen(false);},[dm]);
  const closeTab=(key,e)=>{e?.stopPropagation();const idx=tabs.indexOf(key);const nt=tabs.filter(t=>t!==key);setTabs(nt);if(active===key)setActive(nt[Math.max(0,idx-1)]||nt[0]||"");};
  const edit=(key,val)=>{setFiles(f=>({...f,[key]:val}));setMod(m=>new Set([...m,key]));};
  const save=key=>{setMod(m=>{const s=new Set(m);s.delete(key);return s;});note(`Saved ${key?.split("/").pop()}`,"success");};
  const saveAll=()=>{modified.forEach(k=>save(k));};
  const togFolder=useCallback(id=>{const tog=ns=>ns.map(n=>n.id===id?{...n,open:!n.open}:n.children?{...n,children:tog(n.children)}:n);setTree(t=>tog(t));},[]);

  const findN=(ns,id)=>{for(const n of ns){if(n.id===id)return n;if(n.children){const f=findN(n.children,id);if(f)return f;}}return null;};
  const getP=(ns,id,pre="")=>{for(const n of ns){const p=pre?`${pre}/${n.name}`:n.name;if(n.id===id)return p;if(n.children){const f=getP(n.children,id,p);if(f)return f;}}return null;};
  const ins=(ns,pid,nn)=>ns.map(n=>{if(n.id===pid)return{...n,open:true,children:[...(n.children||[]),nn]};if(n.children)return{...n,children:ins(n.children,pid,nn)};return n;});
  const rem=(ns,id)=>ns.reduce((a,n)=>{if(n.id===id)return a;a.push(n.children?{...n,children:rem(n.children,id)}:n);return a;},[]);
  const ren=(ns,id,name)=>ns.map(n=>{if(n.id===id)return{...n,name};if(n.children)return{...n,children:ren(n.children,id,name)};return n;});

  const TMPL={js:"// JavaScript\nconsole.log('Hello World');",jsx:"export default function Comp() {\n  return <div>Hello</div>;\n}",ts:"// TypeScript\nconst greet = (n: string) => `Hello, ${n}!`;\nconsole.log(greet('World'));",tsx:"export default function Comp() {\n  return <div>Hello World</div>;\n}",py:"# Python\ndef greet(n):\n    return f'Hello, {n}!'\nprint(greet('World'))",css:"/* Styles */\n.container { max-width: 960px; margin: 0 auto; }",html:"<!DOCTYPE html>\n<html><head><meta charset='UTF-8'/></head>\n<body><h1>Hello</h1></body></html>",json:'{\n  "name": "project"\n}',md:"# Title\n\nContent here.",sh:"#!/bin/bash\necho 'Hello World'"};

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
    if(!confirm(`Delete "${fp||findN(tree,id)?.name}"?`))return;
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
    if(!isF){
      items.push({icon:"📄",label:"New File",  action:()=>setNI({parentId:node.id,type:"f"})});
      items.push({icon:"📁",label:"New Folder",action:()=>setNI({parentId:node.id,type:"F"})});
      items.push("---");
    }
    if(node.id!=="root"){
      items.push({icon:"✏️",label:"Rename",action:()=>setEditId(node.id)});
      items.push({icon:"🗑️",label:"Delete",action:()=>delItem(node.id,fp,isF),danger:true});
    }
    if(items.length)setCtx({x:e.clientX,y:e.clientY,items});
  };

  const runTerm=async()=>{const cmd=tInput.trim();if(!cmd)return;setTInput("");setTLines(l=>[...l,{t:"dim",v:`$ ${cmd}`}]);if(cmd.toLowerCase()==="clear"){setTLines([]);return;}setTRun(true);for await(const line of runCmd(cmd)){setTLines(l=>[...l,line]);await sleep(10);}setTRun(false);};
  const termRun=async(cmd)=>{setTO(true);setTLines(l=>[...l,{t:"dim",v:`$ ${cmd}`}]);setTRun(true);for await(const line of runCmd(cmd)){setTLines(l=>[...l,line]);await sleep(10);}setTRun(false);};

  const doAct=useCallback((act)=>{
    if(["files","search","git","extensions","ai","settings"].includes(act)){setPanel(act);setSbOpen(true);return;}
    if(act==="terminal")  {setTO(o=>!o);return;}
    if(act==="split")     {setSplit(s=>!s);return;}
    if(act==="save")      {save(active);return;}
    if(act==="save-all")  {saveAll();return;}
    if(act==="close-tab") {closeTab(active);return;}
    if(act==="close-all") {setTabs([]);setActive("");return;}
    if(act==="deploy-modal"){setShowDep(true);return;}
    if(act==="palette")   {setShowCmd(true);return;}
    if(act==="new-file")  {setNI({parentId:"src",type:"f"});setPanel("files");setSbOpen(true);return;}
    if(act==="new-folder"){setNI({parentId:"root",type:"F"});setPanel("files");setSbOpen(true);return;}
    if(act==="desktop")   {setDm(true);return;}
    if(act==="mobile")    {setDm(false);return;}
    if(act==="zoom-in")   {setZoom(z=>Math.min(2,+(z+.1).toFixed(1)));return;}
    if(act==="zoom-out")  {setZoom(z=>Math.max(.5,+(z-.1).toFixed(1)));return;}
    if(act==="zoom-reset"){setZoom(1);return;}
    if(act==="run")       {termRun("npm run dev");return;}
    if(act==="npm-install"){termRun("npm install");return;}
    if(act==="npm-dev")   {termRun("npm run dev");return;}
    if(act==="npm-build") {termRun("npm run build");return;}
    if(act==="npm-test")  {termRun("npm test");return;}
    if(act==="git-add")   {termRun("git add .");return;}
    if(act==="git-push")  {termRun("git push");return;}
    if(act==="git-pull")  {termRun("git pull");return;}
    if(act==="git-log")   {termRun("git log");return;}
    if(act==="format")    {note("Document formatted ✓","success");return;}
    if(act==="about")     {note("⚡ CodeForge Pro v5 — Built with React + Claude AI","info");return;}
    if(act==="shortcuts") {note("⌘⇧P Palette · ⌘S Save · ⌘N New · ⌘J Terminal","info");return;}
    if(act==="select-all"){document.execCommand("selectAll");return;}
    if(act==="undo")      {document.execCommand("undo");return;}
    if(act==="redo")      {document.execCommand("redo");return;}
  },[active,modified]);

  useEffect(()=>{
    const h=e=>{
      if((e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key==="p"){e.preventDefault();setShowCmd(true);}
      if((e.metaKey||e.ctrlKey)&&e.key==="s"){e.preventDefault();save(active);}
      if((e.metaKey||e.ctrlKey)&&e.key==="j"){e.preventDefault();setTO(o=>!o);}
      if((e.metaKey||e.ctrlKey)&&e.key==="n"){e.preventDefault();setNI({parentId:"src",type:"f"});}
      if((e.metaKey||e.ctrlKey)&&e.key==="w"){e.preventDefault();closeTab(active);}
      if((e.metaKey||e.ctrlKey)&&e.key==="="){e.preventDefault();setZoom(z=>Math.min(2,+(z+.1).toFixed(1)));}
      if((e.metaKey||e.ctrlKey)&&e.key==="-"){e.preventDefault();setZoom(z=>Math.max(.5,+(z-.1).toFixed(1)));}
      if((e.metaKey||e.ctrlKey)&&e.key==="0"){e.preventDefault();setZoom(1);}
    };
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[active]);

  const lang=active?gl(active):null;
  const sbW=dm?260:220;
  const fs=dm?cfg.fontSize+1:cfg.fontSize;

  /* Bottom nav for mobile */
  const bottomTabs=[
    {id:"files",     e:"📁", l:"Files"},
    {id:"search",    e:"🔍", l:"Search"},
    {id:"git",       e:"🔀", l:"Git"},
    {id:"ai",        e:"✨", l:"AI"},
    {id:"settings",  e:"⚙️", l:"Settings"},
  ];

  return(
    <div
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        height:"100dvh",display:"flex",flexDirection:"column",
        background:D.bg,color:D.txt,
        fontFamily:"'Outfit',system-ui,sans-serif",
        overflow:"hidden",
        fontSize:`${zoom}em`,
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        html,body{overscroll-behavior:none;touch-action:none}
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${D.scr};border-radius:3px}
        textarea{-webkit-text-size-adjust:none;text-size-adjust:none;touch-action:pan-y}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
        @keyframes slideIn{from{transform:translateX(-100%);opacity:0}to{transform:none;opacity:1}}
        @keyframes expandDown{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
        @keyframes fadeUp{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:2px;background:${D.bdr}}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:${D.ac};cursor:pointer}
      `}</style>

      {/* ══ TITLE BAR ══ */}
      <div style={{height:38,background:"#2c2c2c",display:"flex",alignItems:"center",paddingLeft:12,gap:8,flexShrink:0,borderBottom:`1px solid ${D.bdr}`}}>
        <div style={{display:"flex",gap:5,marginRight:2}}>{["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:11,height:11,borderRadius:"50%",background:c}}/>)}</div>
        <span style={{fontSize:13,fontWeight:700,color:D.txt}}>⚡ CodeForge Pro</span>
        <button onClick={()=>setShowCmd(true)} style={{marginLeft:"auto",background:D.inp,border:`1px solid ${D.bdr}44`,borderRadius:6,padding:"4px 12px",color:D.dim,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
          🔍 <span style={{opacity:.6}}>⌘⇧P</span>
        </button>
        <div style={{display:"flex",gap:4,paddingRight:8}}>
          {/* Zoom quick buttons */}
          <button onClick={()=>doAct("zoom-out")} style={{background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:4,padding:"3px 7px",color:D.txt,cursor:"pointer",fontSize:14}}>−</button>
          <button onClick={()=>doAct("zoom-reset")} style={{background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:4,padding:"3px 7px",color:zoom!==1?D.ac:D.dim,cursor:"pointer",fontSize:11,minWidth:38,textAlign:"center"}}>{Math.round(zoom*100)}%</button>
          <button onClick={()=>doAct("zoom-in")} style={{background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:4,padding:"3px 7px",color:D.txt,cursor:"pointer",fontSize:14}}>+</button>
          <button onClick={()=>setShowDep(true)} style={{background:`${D.ac}22`,border:`1px solid ${D.ac}55`,borderRadius:4,color:D.ac,cursor:"pointer",padding:"3px 10px",fontSize:11,fontWeight:600}}>🚀</button>
        </div>
      </div>

      {/* ══ MENU BAR ══ */}
      <MenuBar onAct={doAct} openMenu={openMenu} setOpenMenu={setOpenMenu}/>

      {/* ══ BODY ══ */}
      <div style={{flex:1,display:"flex",overflow:"hidden",position:"relative"}}>

        {/* ── Sidebar overlay on mobile ── */}
        {sbOpen&&!dm&&(
          <div style={{position:"absolute",inset:0,background:"#0006",zIndex:50}} onClick={()=>setSbOpen(false)}/>
        )}

        {/* ── Sidebar ── */}
        {(sbOpen||dm)&&(
          <div style={{
            width:sbW,background:D.sb,borderRight:`1px solid ${D.bdr}`,
            display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0,
            zIndex:dm?1:60,
            position:dm?"relative":"absolute",
            top:0,left:0,bottom:0,
            animation:dm?"none":"slideIn .2s ease",
            boxShadow:dm?"none":"4px 0 20px #0008",
          }}>
            {/* Sidebar header */}
            <div style={{padding:"8px 10px 6px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${D.bdr}`,background:"#1e1e24",flexShrink:0}}>
              <span style={{fontSize:11,color:D.dim,textTransform:"uppercase",letterSpacing:".08em",fontWeight:600}}>
                {panel==="files"?"Explorer":panel==="search"?"Search":panel==="git"?"Source Control":panel==="extensions"?"Extensions":panel==="ai"?"AI Copilot":"Settings"}
              </span>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                {panel==="files"&&<>
                  <button title="New File"   onClick={()=>setNI({parentId:"src",type:"f"})}  style={{background:"none",border:"none",cursor:"pointer",fontSize:16,padding:"3px 5px",color:D.dim,borderRadius:4}} onMouseEnter={e=>e.currentTarget.style.color=D.txt} onMouseLeave={e=>e.currentTarget.style.color=D.dim}>📄</button>
                  <button title="New Folder" onClick={()=>setNI({parentId:"src",type:"F"})} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,padding:"3px 5px",color:D.dim,borderRadius:4}} onMouseEnter={e=>e.currentTarget.style.color=D.txt} onMouseLeave={e=>e.currentTarget.style.color=D.dim}>📁</button>
                </>}
                {!dm&&<button onClick={()=>setSbOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:D.dim,fontSize:18,padding:"2px 4px",lineHeight:1}}>✕</button>}
              </div>
            </div>

            {/* Sidebar content */}
            <div style={{flex:1,overflow:"auto",WebkitOverflowScrolling:"touch"}}>
              {panel==="files"&&(
                <div>
                  {tree.map(n=>(
                    <TNode key={n.id} node={n} active={active}
                      onOpen={openFile} onToggle={togFolder} onCtx={doCtx}
                      editId={editId} onEditOk={okRen} onEditCancel={()=>setEditId(null)}
                      fmap={fmap}/>
                  ))}
                  {newItem&&(
                    <NewRow type={newItem.type} depth={1}
                      onOk={name=>createItem(name,newItem.type,newItem.parentId)}
                      onCancel={()=>setNI(null)}/>
                  )}
                </div>
              )}
              {panel==="search"    &&<SearchPanel files={files} onOpen={openFile}/>}
              {panel==="git"       &&<GitPanel modified={[...modified]}/>}
              {panel==="extensions"&&<ExtPanel/>}
              {panel==="settings"  &&<SettingsPanel s={cfg} set={(k,v)=>setCfg(s=>({...s,[k]:v}))} dm={dm} setDm={setDm} zoom={zoom} setZoom={setZoom}/>}
              {panel==="ai"        &&<AICopilot file={active} content={files[active]}/>}
            </div>

            {/* Bottom nav inside sidebar on desktop */}
            {dm&&(
              <div style={{height:44,borderTop:`1px solid ${D.bdr}`,display:"flex",background:"#1a1a1e"}}>
                {bottomTabs.map(({id,e})=>(
                  <button key={id} onClick={()=>setPanel(id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",fontSize:16,color:panel===id?D.ac:D.dim,display:"flex",alignItems:"center",justifyContent:"center",borderTop:`2px solid ${panel===id?D.ac:"transparent"}`}}>{e}</button>
                ))}
                <button onClick={()=>setSbOpen(o=>!o)} style={{flex:1,background:"none",border:"none",cursor:"pointer",fontSize:14,color:D.dim}}>⚙️</button>
              </div>
            )}
          </div>
        )}

        {/* ── Editor Area ── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>

          {/* Tabs row */}
          <div style={{height:36,background:D.tab,display:"flex",alignItems:"flex-end",overflow:"auto",flexShrink:0,borderBottom:`1px solid ${D.bdr}`}}>
            {/* Sidebar toggle on mobile */}
            {!dm&&(
              <button onClick={()=>setSbOpen(o=>!o)} style={{height:"100%",padding:"0 10px",background:"none",border:"none",borderRight:`1px solid ${D.bdr}`,color:sbOpen?D.ac:D.dim,cursor:"pointer",fontSize:16,flexShrink:0}}>☰</button>
            )}
            {tabs.map(key=>{const lg=gl(key),isA=key===active,isMod=modified.has(key);return(
              <div key={key} onClick={()=>setActive(key)}
                style={{height:34,display:"flex",alignItems:"center",gap:5,padding:"0 10px",cursor:"pointer",flexShrink:0,background:isA?D.bg:"transparent",borderTop:`2px solid ${isA?D.ac:"transparent"}`,borderRight:`1px solid ${D.bdr}`,color:isA?D.wht:D.dim,fontSize:12,maxWidth:160,minWidth:60}}>
                <span style={{fontSize:13}}>{lg.i}</span>
                <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{key.split("/").pop()}</span>
                {isMod&&<span style={{width:6,height:6,borderRadius:"50%",background:D.yel,flexShrink:0}}/>}
                <span onClick={e=>closeTab(key,e)} style={{flexShrink:0,fontSize:13,opacity:.4,padding:2,borderRadius:3,lineHeight:1}} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity=".4"}>✕</span>
              </div>
            );})}
          </div>

          {/* Breadcrumb */}
          {active&&(
            <div style={{height:22,background:"#181818",borderBottom:`1px solid ${D.bdr}`,padding:"0 12px",display:"flex",alignItems:"center",gap:4,fontSize:11,color:D.dim,flexShrink:0,overflow:"hidden"}}>
              {active.split("/").map((s,i,a)=>(
                <span key={i} style={{display:"flex",alignItems:"center",gap:4,flexShrink:i===a.length-1?0:1,overflow:"hidden"}}>
                  {i>0&&<span style={{opacity:.4,flexShrink:0}}>›</span>}
                  <span style={{color:i===a.length-1?D.txt:D.dim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s}</span>
                </span>
              ))}
            </div>
          )}

          {/* Editors */}
          <div style={{flex:1,display:"flex",overflow:"hidden"}}>
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              {active
                ?<Editor filename={active} content={files[active]||""} onChange={v=>edit(active,v)} fontSize={fs}/>
                :<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,padding:20}}>
                  <div style={{fontSize:72,opacity:.07}}>⚡</div>
                  <div style={{color:D.dim,fontSize:14,textAlign:"center"}}>Open a file from the Explorer</div>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
                    <button onClick={()=>{setPanel("files");setSbOpen(true);}} style={{background:D.sb,border:`1px solid ${D.bdr}`,borderRadius:8,padding:"10px 16px",color:D.dim,fontSize:13,cursor:"pointer"}}>📁 Explorer</button>
                    <button onClick={()=>setShowCmd(true)} style={{background:`${D.ac}22`,border:`1px solid ${D.ac}44`,borderRadius:8,padding:"10px 16px",color:D.ac,fontSize:13,cursor:"pointer"}}>⚡ Palette</button>
                  </div>
                </div>
              }
            </div>
            {split&&tabs.length>1&&(
              <>
                <div style={{width:1,background:D.bdr}}/>
                <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
                  <div style={{height:36,background:D.tab,display:"flex",alignItems:"flex-end",overflow:"auto",borderBottom:`1px solid ${D.bdr}`}}>
                    {tabs.map(key=>{const lg=gl(key),isA=key===(splitT||tabs[1]||tabs[0]);return(<div key={key} onClick={()=>setSplitT(key)} style={{height:34,display:"flex",alignItems:"center",gap:5,padding:"0 10px",cursor:"pointer",flexShrink:0,background:isA?D.bg:"transparent",borderTop:`2px solid ${isA?D.pur:"transparent"}`,borderRight:`1px solid ${D.bdr}`,color:isA?D.wht:D.dim,fontSize:12}}><span>{lg.i}</span><span style={{fontSize:12}}>{key.split("/").pop()}</span></div>);})}
                  </div>
                  <Editor filename={splitT||tabs[1]||tabs[0]} content={files[splitT||tabs[1]||tabs[0]]||""} onChange={v=>edit(splitT||tabs[1]||tabs[0],v)} fontSize={fs}/>
                </div>
              </>
            )}
          </div>

          {/* Terminal */}
          {termOpen&&(
            <div style={{height:termH,borderTop:`1px solid ${D.bdr}`,display:"flex",flexDirection:"column",flexShrink:0}}>
              <div style={{height:32,background:"#1a1a1e",display:"flex",alignItems:"center",gap:8,padding:"0 12px",borderBottom:`1px solid ${D.bdr}`,flexShrink:0}}>
                <span style={{fontSize:12,color:D.dim,fontWeight:600}}>💻 TERMINAL</span>
                <div style={{flex:1}}/>
                <button onClick={()=>setTLines([])} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:12,padding:"2px 8px"}}>Clear</button>
                <button onClick={()=>setTermH(h=>h===200?360:200)} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:14,padding:"2px 6px"}}>⬜</button>
                <button onClick={()=>setTO(false)} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:16,padding:"2px 4px"}}>✕</button>
              </div>
              <Term lines={tLines} onRun={runTerm} input={tInput} setInput={setTInput} running={tRun}/>
            </div>
          )}
        </div>
      </div>

      {/* ══ BOTTOM NAV (Mobile only) ══ */}
      {!dm&&(
        <div style={{height:52,background:"#1a1a1e",borderTop:`1px solid ${D.bdr}`,display:"flex",flexShrink:0}}>
          {bottomTabs.map(({id,e,l})=>(
            <button key={id} onClick={()=>{setPanel(id);setSbOpen(true);}} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,borderTop:`2px solid ${panel===id&&sbOpen?D.ac:"transparent"}`,color:panel===id&&sbOpen?D.ac:D.dim,transition:"all .15s",position:"relative"}}>
              <span style={{fontSize:19}}>{e}</span>
              <span style={{fontSize:9,textTransform:"uppercase",letterSpacing:".04em"}}>{l}</span>
              {id==="git"&&modified.size>0&&<span style={{position:"absolute",top:4,right:"50%",marginRight:-16,background:D.red,color:"#fff",borderRadius:"50%",width:14,height:14,fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{modified.size}</span>}
            </button>
          ))}
          <button onClick={()=>setTO(o=>!o)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,borderTop:`2px solid ${termOpen?D.grn:"transparent"}`,color:termOpen?D.grn:D.dim}}>
            <span style={{fontSize:19}}>💻</span>
            <span style={{fontSize:9,textTransform:"uppercase",letterSpacing:".04em"}}>Term</span>
          </button>
          <button onClick={()=>setShowDep(true)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,color:D.ac}}>
            <span style={{fontSize:19}}>🚀</span>
            <span style={{fontSize:9,textTransform:"uppercase",letterSpacing:".04em"}}>Deploy</span>
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
        <span>UTF-8</span>
        <button onClick={()=>setDm(m=>!m)} style={{background:"none",border:"none",color:"#ffffffaa",cursor:"pointer",fontSize:11}}>{dm?"📱":"🖥️"}</button>
        <button onClick={()=>setShowCmd(true)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:11}}>⌘⇧P</button>
      </div>

      {/* Notifications */}
      <div style={{position:"fixed",bottom:dm?26:76,right:12,zIndex:800,display:"flex",flexDirection:"column",gap:6,pointerEvents:"none"}}>
        {notifs.map(n=><div key={n.id} style={{background:D.sb,border:`1px solid ${n.type==="success"?D.grn:n.type==="error"?D.red:D.bdr}`,borderRadius:8,padding:"10px 14px",fontSize:13,color:D.txt,maxWidth:260,animation:"fadeUp .3s ease",boxShadow:"0 4px 20px #0008"}}>{n.type==="success"?"✅ ":n.type==="error"?"❌ ":"ℹ️ "}{n.msg}</div>)}
      </div>

      {ctx&&<CtxMenu x={ctx.x} y={ctx.y} items={ctx.items} onClose={()=>setCtx(null)}/>}
      {showCmd&&<CmdPalette onClose={()=>setShowCmd(false)} onCmd={id=>{doAct(id);}}/>}
      {showDep&&<DeployModal onClose={()=>setShowDep(false)}/>}
    </div>
  );
}
