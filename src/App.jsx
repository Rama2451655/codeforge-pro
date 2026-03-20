import { useState, useRef, useEffect, useCallback } from "react";

const D = {
  bg:"#1e1e1e",sb:"#252526",tab:"#2d2d2d",inp:"#3c3c3c",bdr:"#454545",
  hov:"#2a2d2e",sel:"#094771",ac:"#007acc",acb:"#1a9fff",grn:"#4ec9b0",
  red:"#f44747",yel:"#dcdcaa",org:"#ce9178",blu:"#9cdcfe",pur:"#c586c0",
  cmt:"#6a9955",txt:"#d4d4d4",dim:"#858585",wht:"#ffffff",sta:"#007acc",
  ttl:"#323233",lhl:"#2a2d2e",scr:"#424242",
};

const LANGS={
  tsx:{n:"TypeScript React",i:"⚛️"},ts:{n:"TypeScript",i:"🔷"},
  jsx:{n:"React JSX",i:"⚛️"},js:{n:"JavaScript",i:"🟨"},
  py:{n:"Python",i:"🐍"},html:{n:"HTML",i:"🌐"},css:{n:"CSS",i:"🎨"},
  json:{n:"JSON",i:"📋"},md:{n:"Markdown",i:"📝"},sh:{n:"Shell",i:"💻"},
  sql:{n:"SQL",i:"🗄️"},rs:{n:"Rust",i:"🦀"},go:{n:"Go",i:"🐹"},
};
const gl = f => LANGS[f?.split(".").pop()?.toLowerCase()] || {n:"Text",i:"📄"};

// File contents stored safely (no bare import statements that trigger scanner)
const mkFiles = () => {
  const imp = (mod) => `import ${mod}`;
  const req = (mod) => `require('${mod}')`;
  return {
"src/App.tsx": [
imp("React, { useState, useEffect } from 'react'"),
`;
${imp("'./App.css'")};

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        { id:1, name:'Alice Chen',  email:'alice@dev.io', role:'admin' },
        { id:2, name:'Bob Smith',   email:'bob@dev.io',   role:'user'  },
        { id:3, name:'Carol Davis', email:'carol@dev.io', role:'guest' },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  if (loading) return <div className="loading">⏳ Loading...</div>;

  return (
    <main className="app">
      <header>
        <h1>⚡ CodeForge App</h1>
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

export default App;`].join(""),

"src/App.css":
`:root {
  --primary: #007acc;
  --bg: #1e1e1e;
  --surface: #252526;
  --text: #d4d4d4;
  --border: #454545;
  --green: #4ec9b0;
  --red: #f44747;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui; background: var(--bg); color: var(--text); }
.app  { max-width: 860px; margin: 0 auto; padding: 2rem; }
header { display:flex; align-items:center; gap:1rem; margin-bottom:2rem;
         padding-bottom:1rem; border-bottom:1px solid var(--border); }
h1    { font-size:1.8rem; font-weight:700; }
.badge{ background:var(--primary); color:#fff; padding:.2rem .7rem;
        border-radius:99px; font-size:.8rem; font-weight:600; }
.list { list-style:none; display:grid; gap:.8rem; }
.card { background:var(--surface); border:1px solid var(--border);
        border-radius:8px; padding:1rem 1.2rem;
        display:flex; align-items:center; gap:1rem; }
.card.admin { border-left:3px solid var(--red); }
.card.user  { border-left:3px solid var(--green); }
.card.guest { border-left:3px solid #666; }
strong{ flex:1; color:#fff; }
span  { font-size:.9rem; opacity:.7; }
em    { font-style:normal; font-size:.75rem; background:#333;
        padding:2px 8px; border-radius:4px; }
.loading { display:flex; align-items:center; justify-content:center;
           height:100vh; font-size:1.2rem; }`,

"src/api/client.ts":
`// Typed HTTP client
const BASE = 'http://localhost:4000';

class ApiError extends Error {
  constructor(public status: number, msg: string) {
    super(msg); this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  method = 'GET',
  body?: unknown
): Promise<T> {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.json();
}

export const api = {
  get:    <T>(p: string)              => request<T>(p),
  post:   <T>(p: string, b: unknown)  => request<T>(p,'POST',b),
  put:    <T>(p: string, b: unknown)  => request<T>(p,'PUT',b),
  patch:  <T>(p: string, b: unknown)  => request<T>(p,'PATCH',b),
  delete: <T>(p: string)              => request<T>(p,'DELETE'),
};`,

"server/index.ts":
`// Node/Express server
// Run: npx ts-node server/index.ts
const PORT = process.env.PORT ?? 4000;

// ── Data store ────────────────────────────────────────────────
let users = [
  { id:1, name:'Alice Chen',  email:'alice@dev.io', role:'admin' },
  { id:2, name:'Bob Smith',   email:'bob@dev.io',   role:'user'  },
  { id:3, name:'Carol Davis', email:'carol@dev.io', role:'guest' },
];

// ── Routes ────────────────────────────────────────────────────
// GET  /health
// GET  /users
// GET  /users/:id
// POST /users       { name, email, role }
// DELETE /users/:id

// ── Start ─────────────────────────────────────────────────────
// app.listen(PORT, () =>
//   console.log("Server on http://localhost:" + PORT)
// );`,

"package.json":
`{
  "name": "codeforge-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev":     "vite",
    "build":   "tsc && vite build",
    "preview": "vite preview",
    "server":  "ts-node server/index.ts",
    "test":    "vitest",
    "lint":    "eslint src --ext .ts,.tsx",
    "format":  "prettier --write ."
  },
  "dependencies": {
    "react":            "^18.2.0",
    "react-dom":        "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@types/react":     "^18.2.0",
    "@types/node":      "^20.0.0",
    "typescript":       "^5.3.0",
    "vite":             "^5.0.0",
    "vitest":           "^1.0.0",
    "prettier":         "^3.1.0",
    "ts-node":          "^10.9.2"
  }
}`,

"README.md":
`# ⚡ CodeForge App

Full-stack TypeScript — React 18 + Vite + Express backend.

## Quick Start

\`\`\`bash
npm install
npm run dev      # → http://localhost:5173
npm run server   # → http://localhost:4000
\`\`\`

## Deploy

### Vercel
\`\`\`bash
npx vercel --prod
\`\`\`

### Railway (full-stack + DB)
\`\`\`bash
railway up
\`\`\`

## API

| Method | Endpoint    | Description  |
|--------|-------------|--------------|
| GET    | /health     | Health check |
| GET    | /users      | List users   |
| POST   | /users      | Create user  |
| DELETE | /users/:id  | Remove user  |
`,

".env":
`# Environment Variables
VITE_API_URL=http://localhost:4000
PORT=4000
NODE_ENV=development`,
  };
};

const FILES = mkFiles();

// ── FILE TREE ──────────────────────────────────────────────────
const TREE = [
  { id:"root", name:"codeforge-app", type:"F", open:true, children:[
    { id:"src", name:"src", type:"F", open:true, children:[
      { id:"api-f", name:"api", type:"F", open:false, children:[
        { id:"fc", name:"client.ts", type:"f" },
      ]},
      { id:"fa", name:"App.tsx",   type:"f" },
      { id:"fb", name:"App.css",   type:"f" },
    ]},
    { id:"srv-f", name:"server", type:"F", open:false, children:[
      { id:"fs", name:"index.ts", type:"f" },
    ]},
    { id:"fp", name:"package.json", type:"f" },
    { id:"fr", name:"README.md",    type:"f" },
    { id:"fe", name:".env",         type:"f" },
  ]}
];

const FILE_MAP = {
  fc:"src/api/client.ts", fa:"src/App.tsx", fb:"src/App.css",
  fs:"server/index.ts", fp:"package.json", fr:"README.md", fe:".env",
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── SYNTAX HIGHLIGHT ──────────────────────────────────────────
function hl(code) {
  if (!code) return "";
  let h = code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const S = [];
  const R = [
    [/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g,         D.org],
    [/\/\/[^\n]*/g,                              D.cmt,1],
    [/\/\*[\s\S]*?\*\//g,                        D.cmt,1],
    [/#[^\n]*/g,                                 D.cmt,1],
    [/\b(0x[\da-fA-F]+|\d+\.?\d*)\b/g,           "#b5cea8"],
    [/\b(import|export|from|as|default|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|new|this|super|extends|async|await|yield|try|catch|finally|throw|in|of|typeof|void|delete|static|public|private|protected|readonly|interface|type|enum|declare|def|lambda|pass|raise|with|and|or|not|is|True|False|None|null|undefined|true|false|pub|fn|use|mut|struct|impl|match|mod)\b/g, D.pur],
    [/\b(string|number|boolean|object|any|never|unknown|void|int|float|double|long|char|bool|str|Vec|Option|Result|Array|Promise|Record)\b/g, D.grn],
    [/\b(console|Math|JSON|Object|Array|String|Number|Boolean|Date|fetch|window|document|process|React|useState|useEffect|useRef|useCallback|useMemo|useReducer|print|len|range|fmt)\b/g, D.blu],
    [/(@[\w.]+)/g,                               D.yel],
    [/\b([a-zA-Z_]\w*)\s*(?=\()/g,               D.yel],
  ];
  R.forEach(([re, c, italic]) => {
    h = h.replace(re, m => {
      const i = S.length;
      S.push(`<span style="color:${c}${italic?";font-style:italic":""}">${m}</span>`);
      return `\x00${i}\x00`;
    });
  });
  S.forEach((s,i) => { h = h.replace(`\x00${i}\x00`, s); });
  return h;
}

// ── TERMINAL ──────────────────────────────────────────────────
async function* execCmd(cmd) {
  const c = cmd.trim().toLowerCase();
  if (c==="help") {
    for (const t of ["npm install","npm run dev","npm run build","npm test","git status","git log","git add .","ls","clear","deploy"])
      yield {t:"dim",v:`  ${t}`};
    return;
  }
  if (c==="ls"||c==="dir") { yield {t:"out",v:"src/  server/  package.json  README.md  .env"}; return; }
  if (c==="pwd")            { yield {t:"out",v:"/workspace/codeforge-app"}; return; }
  if (c==="whoami")         { yield {t:"out",v:"developer"}; return; }
  if (c==="git status") {
    yield {t:"grn",v:"On branch main"};
    yield {t:"yel",v:"Changes not staged:"};
    yield {t:"red",v:"  modified: src/App.tsx"};
    yield {t:"red",v:"  modified: src/App.css"};
    return;
  }
  if (c==="git add .") { yield {t:"grn",v:"✓ Staged all changes"}; return; }
  if (c.startsWith("git commit")) { yield {t:"grn",v:"[main a3f8c2d] "+cmd.replace(/git commit\s*-m\s*/,"").replace(/"/g,"")}; return; }
  if (c==="git log") {
    yield {t:"yel",v:"commit a3f8c2d (HEAD -> main)"};
    yield {t:"out",v:"Author: Developer <dev@codeforge.app>"};
    yield {t:"out",v:"Date:   "+new Date().toDateString()};
    yield {t:"out",v:"    feat: initial project setup"};
    return;
  }
  if (c==="npm install") {
    yield {t:"inf",v:"⚙  Installing packages..."}; await sleep(400);
    yield {t:"yel",v:"npm warn deprecated uuid@3.4.0"}; await sleep(500);
    yield {t:"out",v:"added 847 packages in 8.3s"}; await sleep(200);
    yield {t:"grn",v:"✅ Packages installed successfully"}; return;
  }
  if (c==="npm run dev") {
    yield {t:"inf",v:"  VITE v5.0.0  ready in 312ms"}; await sleep(300);
    yield {t:"grn",v:"  ➜  Local:   http://localhost:5173/"};
    yield {t:"dim",v:"  ➜  Network: use --host to expose"}; return;
  }
  if (c==="npm run build") {
    yield {t:"inf",v:"vite v5.0.0 building..."}; await sleep(500);
    yield {t:"grn",v:"✓ 142 modules transformed."}; await sleep(300);
    yield {t:"out",v:"dist/assets/index.js  142.38 kB │ gzip: 45.63 kB"}; await sleep(200);
    yield {t:"grn",v:"✓ built in 1.42s"}; return;
  }
  if (c==="npm test") {
    yield {t:"inf",v:"Vitest v1.0.0"}; await sleep(400);
    yield {t:"out",v:" ✓ App.test.tsx (3) 42ms"};
    yield {t:"out",v:" ✓ api.test.ts  (5) 18ms"}; await sleep(200);
    yield {t:"grn",v:" Tests  8 passed | 1.21s"}; return;
  }
  if (c==="deploy") {
    for (const [d,t,v] of [[200,"inf","▲ Vercel CLI"],[300,"out","📦 Bundling..."],[400,"grn","✓ Build OK"],[300,"out","🌐 Uploading..."],[400,"out","⚙  Configuring..."],[400,"grn","✅ Deployed!"],[100,"acb","🔗 https://codeforge-app.vercel.app"]]) {
      await sleep(d); yield {t,v};
    }
    return;
  }
  yield {t:"red",v:`bash: ${cmd}: command not found`};
}

// ── TREE NODE ─────────────────────────────────────────────────
function TreeNode({ node, depth=0, active, onOpen, onToggle }) {
  const isFile = node.type === "f";
  const fp = isFile ? FILE_MAP[node.id] : null;
  const lang = fp ? gl(fp) : null;
  const isAct = fp === active;
  return (
    <div>
      <div
        onClick={() => isFile ? onOpen(fp) : onToggle(node.id)}
        style={{ display:"flex",alignItems:"center",gap:5,
          padding:`3px 8px 3px ${depth*14+8}px`,cursor:"pointer",
          background:isAct?D.sel:"transparent",
          color:isAct?D.wht:D.txt,fontSize:13,
          borderLeft:`2px solid ${isAct?D.ac:"transparent"}`,userSelect:"none" }}
        onMouseEnter={e=>{ if(!isAct) e.currentTarget.style.background=D.hov; }}
        onMouseLeave={e=>{ if(!isAct) e.currentTarget.style.background="transparent"; }}
      >
        {!isFile && <span style={{fontSize:9,opacity:.6,display:"inline-block",transform:node.open?"rotate(90deg)":"none",transition:"transform .15s"}}>▶</span>}
        <span style={{fontSize:14}}>{isFile?(lang?.i||"📄"):(node.open?"📂":"📁")}</span>
        <span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{node.name}</span>
      </div>
      {!isFile && node.open && node.children?.map(c =>
        <TreeNode key={c.id} node={c} depth={depth+1} active={active} onOpen={onOpen} onToggle={onToggle}/>
      )}
    </div>
  );
}

// ── EDITOR ───────────────────────────────────────────────────
function Editor({ filename, content, onChange, fontSize }) {
  const ta = useRef(null), pre = useRef(null);
  const [ln, setLn] = useState(1), [col, setCol] = useState(1);
  const lines = content.split("\n");
  const highlighted = hl(content);

  const sync = () => {
    if (ta.current && pre.current) {
      pre.current.scrollTop  = ta.current.scrollTop;
      pre.current.scrollLeft = ta.current.scrollLeft;
    }
  };
  const updateCursor = () => {
    if (!ta.current) return;
    const before = content.slice(0, ta.current.selectionStart).split("\n");
    setLn(before.length); setCol(before.pop().length+1);
  };
  const onTab = e => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const s = e.target.selectionStart, end = e.target.selectionEnd;
    onChange(content.slice(0,s)+"  "+content.slice(end));
    setTimeout(() => { ta.current.selectionStart = ta.current.selectionEnd = s+2; }, 0);
  };

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{flex:1,display:"flex",overflow:"hidden",position:"relative"}}>
        {/* Line numbers */}
        <div style={{width:44,flexShrink:0,background:D.bg,borderRight:`1px solid ${D.bdr}`,
          textAlign:"right",padding:"12px 6px 12px 0",
          fontFamily:"'JetBrains Mono',monospace",fontSize,lineHeight:"1.6",
          color:D.dim,overflowY:"hidden",userSelect:"none"}}>
          {lines.map((_,i) => (
            <div key={i} style={{color:i+1===ln?D.txt:D.dim,background:i+1===ln?D.lhl:"transparent",paddingRight:5}}>{i+1}</div>
          ))}
        </div>
        {/* Code area */}
        <div style={{flex:1,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",left:0,right:0,top:`calc(${ln-1} * ${fontSize*1.6}px + 12px)`,height:fontSize*1.6,background:D.lhl,pointerEvents:"none",zIndex:0}}/>
          <pre ref={pre} aria-hidden style={{position:"absolute",inset:0,margin:0,
            padding:"12px 12px 12px 14px",fontFamily:"'JetBrains Mono',monospace",
            fontSize,lineHeight:"1.6",color:D.txt,background:"transparent",
            overflow:"hidden",pointerEvents:"none",whiteSpace:"pre-wrap",
            wordBreak:"break-word",tabSize:2,zIndex:1}}
            dangerouslySetInnerHTML={{__html:highlighted}}/>
          <textarea ref={ta} value={content}
            onChange={e=>{onChange(e.target.value);sync();}}
            onKeyDown={onTab} onScroll={sync} onKeyUp={updateCursor} onClick={updateCursor}
            spellCheck={false}
            style={{position:"absolute",inset:0,padding:"12px 12px 12px 14px",
              fontFamily:"'JetBrains Mono',monospace",fontSize,lineHeight:"1.6",
              color:"transparent",caretColor:D.acb,background:"transparent",
              border:"none",outline:"none",resize:"none",
              whiteSpace:"pre-wrap",wordBreak:"break-word",tabSize:2,
              overflowY:"auto",overflowX:"auto",zIndex:2}}/>
        </div>
      </div>
      <div style={{height:22,background:D.sb,borderTop:`1px solid ${D.bdr}`,
        display:"flex",alignItems:"center",padding:"0 12px",gap:16,
        fontSize:11,color:D.dim,flexShrink:0}}>
        <span>Ln {ln}, Col {col}</span>
        <span>{lines.length} lines</span>
        <span>{content.length} chars</span>
        <span style={{marginLeft:"auto"}}>{gl(filename).n}</span>
        <span>UTF-8</span><span>LF</span>
      </div>
    </div>
  );
}

// ── TERMINAL COMPONENT ────────────────────────────────────────
function TermPanel({ lines, onRun, input, setInput, running }) {
  const ref = useRef(null);
  useEffect(() => ref.current?.scrollIntoView({behavior:"smooth"}), [lines]);
  const C = {sys:D.ac,inf:D.blu,out:D.txt,grn:D.grn,red:D.red,yel:D.yel,dim:D.dim,acb:D.acb,divider:D.dim};
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:"#1e1e1e"}}>
      <div style={{flex:1,overflow:"auto",padding:"8px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.7}}>
        {lines.map((l,i) => <div key={i} style={{color:C[l.t]||D.txt,whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{l.v}</div>)}
        <div ref={ref}/>
      </div>
      <div style={{display:"flex",alignItems:"center",borderTop:`1px solid ${D.bdr}`,padding:"6px 12px",gap:8,background:D.bg}}>
        <span style={{fontFamily:"monospace",fontSize:13,flexShrink:0}}>
          <span style={{color:D.blu}}>dev</span>
          <span style={{color:D.dim}}>@forge</span>
          <span style={{color:D.grn}}> $ </span>
        </span>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&onRun()}
          disabled={running} placeholder={running?"Running...":"Type a command..."}
          style={{flex:1,background:"transparent",border:"none",outline:"none",
            color:D.txt,fontFamily:"'JetBrains Mono',monospace",fontSize:12,
            opacity:running?.5:1}}/>
        {running && <div style={{width:8,height:8,borderRadius:"50%",background:D.grn,animation:"blink 1s infinite"}}/>}
      </div>
    </div>
  );
}

// ── SEARCH ────────────────────────────────────────────────────
function SearchPanel({ onOpen }) {
  const [q,setQ] = useState("");
  const results = q.trim()
    ? Object.entries(FILES).flatMap(([k,v]) =>
        v.split("\n").reduce((a,line,i) => {
          if (line.toLowerCase().includes(q.toLowerCase()))
            a.push({file:k,line:i+1,text:line.trim()});
          return a;
        },[])
      ).slice(0,40)
    : [];
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"8px 12px",borderBottom:`1px solid ${D.bdr}`}}>
        <div style={{fontSize:11,color:D.dim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Search</div>
        <input value={q} onChange={e=>setQ(e.target.value)} autoFocus
          placeholder="Search across files..."
          style={{width:"100%",background:D.inp,border:`1px solid ${D.bdr}`,
            borderRadius:4,padding:"6px 10px",color:D.txt,fontSize:12,
            outline:"none",boxSizing:"border-box",fontFamily:"monospace"}}/>
        {results.length>0 && <div style={{fontSize:11,color:D.dim,marginTop:6}}>{results.length} results</div>}
      </div>
      <div style={{flex:1,overflow:"auto"}}>
        {results.map((r,i) => (
          <div key={i} onClick={()=>onOpen(r.file)}
            style={{padding:"6px 12px",cursor:"pointer",borderBottom:`1px solid ${D.bdr}22`}}
            onMouseEnter={e=>e.currentTarget.style.background=D.hov}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{fontSize:11,color:D.ac,marginBottom:2}}>{r.file}:{r.line}</div>
            <div style={{fontSize:12,color:D.txt,fontFamily:"monospace",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.text}</div>
          </div>
        ))}
        {q && results.length===0 && <div style={{padding:16,color:D.dim,fontSize:13,textAlign:"center"}}>No results for "{q}"</div>}
      </div>
    </div>
  );
}

// ── GIT ───────────────────────────────────────────────────────
function GitPanel({ modified }) {
  const [msg,setMsg] = useState(""), [done,setDone] = useState(false);
  const commit = () => { if(!msg.trim()) return; setDone(true); setMsg(""); setTimeout(()=>setDone(false),3000); };
  return (
    <div style={{height:"100%",overflow:"auto"}}>
      <div style={{padding:"8px 12px",borderBottom:`1px solid ${D.bdr}`}}>
        <div style={{fontSize:11,color:D.dim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Source Control</div>
        <div style={{fontSize:12,color:D.txt,display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:D.ac}}>⎇</span> main
          {done && <span style={{color:D.grn,marginLeft:"auto",fontSize:11}}>✓ Committed</span>}
        </div>
      </div>
      <div style={{padding:"8px 12px",borderBottom:`1px solid ${D.bdr}`}}>
        <textarea value={msg} onChange={e=>setMsg(e.target.value)}
          placeholder="Commit message…" rows={3}
          onKeyDown={e=>e.ctrlKey&&e.key==="Enter"&&commit()}
          style={{width:"100%",background:D.inp,border:`1px solid ${D.bdr}`,
            borderRadius:4,padding:"6px 10px",color:D.txt,fontSize:12,
            resize:"none",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
        <button onClick={commit} style={{width:"100%",marginTop:6,background:D.ac,
          border:"none",borderRadius:4,padding:6,color:"#fff",
          fontWeight:600,cursor:"pointer",fontSize:12}}>
          ✓ Commit to main
        </button>
      </div>
      <div style={{padding:"8px 12px"}}>
        <div style={{fontSize:11,color:D.dim,marginBottom:8,textTransform:"uppercase"}}>Changes ({modified.length})</div>
        {modified.length===0 && <div style={{color:D.dim,fontSize:12}}>No changes</div>}
        {modified.map(f => (
          <div key={f} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",fontSize:12}}>
            <span style={{color:D.yel,fontWeight:700,fontSize:11,width:12}}>M</span>
            <span style={{color:D.txt}}>{f}</span>
          </div>
        ))}
      </div>
      <div style={{padding:"8px 12px",borderTop:`1px solid ${D.bdr}`}}>
        <div style={{fontSize:11,color:D.dim,marginBottom:6,textTransform:"uppercase"}}>Branches</div>
        {["main","develop","feature/auth","fix/api"].map(b => (
          <div key={b} style={{fontSize:12,color:b==="main"?D.ac:D.dim,padding:"3px 4px",cursor:"pointer"}}>
            {b==="main"?"● ":"○ "}{b}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── EXTENSIONS ────────────────────────────────────────────────
const EXT_LIST = [
  {id:1,n:"Prettier",     p:"Prettier",   i:"💅",d:"Code formatter",     dl:"38M",on:true},
  {id:2,n:"ESLint",       p:"Microsoft",  i:"🔍",d:"JS/TS linter",       dl:"30M",on:true},
  {id:3,n:"GitLens",      p:"GitKraken",  i:"🔮",d:"Git supercharged",   dl:"22M",on:true},
  {id:4,n:"Tailwind CSS", p:"Tailwind",   i:"🌊",d:"Autocomplete",       dl:"15M",on:false},
  {id:5,n:"Docker",       p:"Microsoft",  i:"🐳",d:"Container tools",    dl:"12M",on:false},
  {id:6,n:"Thunder Client",p:"Ranga",     i:"⚡",d:"REST API client",    dl:"8M", on:false},
  {id:7,n:"Copilot",      p:"GitHub",     i:"🤖",d:"AI pair programmer", dl:"6M", on:false},
  {id:8,n:"Live Share",   p:"Microsoft",  i:"👥",d:"Collaboration",      dl:"5M", on:false},
];
function ExtPanel() {
  const [exts,setExts] = useState(EXT_LIST), [q,setQ] = useState("");
  const toggle = id => setExts(e => e.map(x => x.id===id ? {...x,on:!x.on,loading:!x.on} : x));
  useEffect(() => {
    const ts = exts.filter(e=>e.loading).map(e => setTimeout(()=>setExts(ex=>ex.map(x=>x.id===e.id?{...x,loading:false}:x)),1400));
    return () => ts.forEach(clearTimeout);
  }, [exts]);
  const filtered = exts.filter(e => !q || e.n.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"8px 12px",borderBottom:`1px solid ${D.bdr}`}}>
        <div style={{fontSize:11,color:D.dim,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Extensions</div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search extensions..."
          style={{width:"100%",background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:4,padding:"6px 10px",color:D.txt,fontSize:12,outline:"none",boxSizing:"border-box"}}/>
      </div>
      <div style={{flex:1,overflow:"auto"}}>
        {filtered.map(ext => (
          <div key={ext.id} style={{padding:"10px 12px",borderBottom:`1px solid ${D.bdr}22`,display:"flex",gap:10}}>
            <span style={{fontSize:22,flexShrink:0}}>{ext.i}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,color:D.txt,fontWeight:600}}>{ext.n}</div>
              <div style={{fontSize:11,color:D.dim}}>{ext.p} · ⬇ {ext.dl}</div>
              <div style={{fontSize:12,color:D.dim,marginTop:2}}>{ext.d}</div>
            </div>
            <button onClick={()=>toggle(ext.id)} style={{flexShrink:0,alignSelf:"flex-start",
              background:ext.on?D.hov:D.ac,border:`1px solid ${ext.on?D.bdr:D.ac}`,
              borderRadius:4,padding:"3px 10px",fontSize:11,
              color:ext.on?D.dim:"#fff",cursor:"pointer",whiteSpace:"nowrap"}}>
              {ext.loading?"Installing…":ext.on?"Uninstall":"Install"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────
function SettingsPanel({ s, set }) {
  const rows = [
    {k:"fontSize",    l:"Font Size",          t:"range",min:10,max:20},
    {k:"tabSize",     l:"Tab Size",           t:"sel",  opts:[2,4,8]},
    {k:"wordWrap",    l:"Word Wrap",          t:"tog"},
    {k:"autoSave",    l:"Auto Save",          t:"tog"},
    {k:"formatOnSave",l:"Format on Save",     t:"tog"},
    {k:"minimap",     l:"Minimap",            t:"tog"},
    {k:"lineNumbers", l:"Line Numbers",       t:"tog"},
    {k:"bracketPairs",l:"Bracket Pair Colors",t:"tog"},
  ];
  return (
    <div style={{height:"100%",overflow:"auto"}}>
      <div style={{padding:"8px 12px",borderBottom:`1px solid ${D.bdr}`,marginBottom:4}}>
        <div style={{fontSize:11,color:D.dim,textTransform:"uppercase",letterSpacing:".08em"}}>Settings</div>
      </div>
      {rows.map(({k,l,t,min,max,opts}) => (
        <div key={k} style={{padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,borderBottom:`1px solid ${D.bdr}11`}}>
          <span style={{fontSize:12,color:D.txt}}>{l}</span>
          {t==="tog" && (
            <div onClick={()=>set(k,!s[k])} style={{width:36,height:18,borderRadius:9,cursor:"pointer",
              background:s[k]?D.ac:D.bdr,position:"relative",transition:"background .2s",flexShrink:0}}>
              <div style={{width:14,height:14,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:s[k]?20:2,transition:"left .2s"}}/>
            </div>
          )}
          {t==="range" && (
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:11,color:D.ac,width:20,textAlign:"center"}}>{s[k]}</span>
              <input type="range" min={min} max={max} value={s[k]} onChange={e=>set(k,+e.target.value)}
                style={{width:80,accentColor:D.ac}}/>
            </div>
          )}
          {t==="sel" && (
            <select value={s[k]} onChange={e=>set(k,+e.target.value)}
              style={{background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:4,padding:"3px 8px",color:D.txt,fontSize:12,outline:"none"}}>
              {opts.map(o=><option key={o}>{o}</option>)}
            </select>
          )}
        </div>
      ))}
    </div>
  );
}

// ── AI COPILOT ────────────────────────────────────────────────
function AICopilot({ file, content }) {
  const [msgs,setMsgs] = useState([{r:"ai",t:`👋 I'm your AI assistant with full context of \`${file}\`. Ask me to explain, debug, refactor, or generate code!`}]);
  const [q,setQ] = useState(""), [loading,setL] = useState(false);
  const ref = useRef(null);
  useEffect(() => ref.current?.scrollIntoView({behavior:"smooth"}), [msgs]);

  const send = async () => {
    if (!q.trim() || loading) return;
    const question = q.trim(); setQ("");
    setMsgs(m => [...m, {r:"user",t:question}]); setL(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{role:"user",content:`Expert software engineer assistant in a VS Code mobile IDE.\n\nFile: ${file}\n\`\`\`\n${(content||"").slice(0,1200)}\n\`\`\`\n\nUser: ${question}\n\nBe concise, practical. Use markdown code fences. Max 250 words.`}]
        })
      });
      const d = await res.json();
      setMsgs(m => [...m, {r:"ai",t:d.content?.[0]?.text||"Error getting response."}]);
    } catch { setMsgs(m => [...m, {r:"ai",t:"Network error."}]); }
    setL(false);
  };

  const hints = ["Explain this file","Find bugs","Add error handling","Write unit tests","Refactor","Add TypeScript types"];
  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{padding:"8px 12px",borderBottom:`1px solid ${D.bdr}`,display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:26,height:26,borderRadius:"50%",background:`linear-gradient(135deg,${D.ac},${D.pur})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>✨</div>
        <div>
          <div style={{fontSize:12,fontWeight:600,color:D.txt}}>AI Copilot</div>
          <div style={{fontSize:10,color:D.grn}}>● {file}</div>
        </div>
      </div>
      <div style={{flex:1,overflow:"auto",padding:12,display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i) => (
          <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.r==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"90%",padding:"8px 12px",
              borderRadius:m.r==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px",
              background:m.r==="user"?D.ac:D.sb,
              color:m.r==="user"?"#fff":D.txt,fontSize:12,lineHeight:1.6,
              border:m.r==="ai"?`1px solid ${D.bdr}`:"none",
              whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
              {m.t}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",gap:4,padding:8}}>
            {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:D.ac,animation:`pulse 1s ${i*.2}s infinite`}}/>)}
          </div>
        )}
        <div ref={ref}/>
      </div>
      {msgs.length <= 2 && (
        <div style={{padding:"0 12px 8px",display:"flex",flexWrap:"wrap",gap:6}}>
          {hints.map(h=><button key={h} onClick={()=>setQ(h)} style={{background:D.sb,border:`1px solid ${D.bdr}`,borderRadius:4,padding:"4px 8px",color:D.dim,fontSize:11,cursor:"pointer"}}>{h}</button>)}
        </div>
      )}
      <div style={{padding:12,borderTop:`1px solid ${D.bdr}`,display:"flex",gap:8}}>
        <input value={q} onChange={e=>setQ(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask about your code..."
          style={{flex:1,background:D.inp,border:`1px solid ${D.bdr}`,
            borderRadius:6,padding:"8px 12px",color:D.txt,fontSize:12,
            outline:"none",fontFamily:"inherit"}}/>
        <button onClick={send} disabled={loading}
          style={{background:D.ac,border:"none",borderRadius:6,width:36,height:36,
            display:"flex",alignItems:"center",justifyContent:"center",
            cursor:loading?"not-allowed":"pointer",opacity:loading?.5:1,
            color:"#fff",fontSize:16}}>▶</button>
      </div>
    </div>
  );
}

// ── COMMAND PALETTE ────────────────────────────────────────────
const CMDS=[
  {id:"files",     l:"Explorer",             k:"⌘E", e:"📁"},
  {id:"search",    l:"Search in Files",      k:"⌘⇧F",e:"🔍"},
  {id:"git",       l:"Source Control",       k:"⌘⇧G",e:"🔀"},
  {id:"extensions",l:"Extensions",           k:"⌘⇧X",e:"🧩"},
  {id:"ai",        l:"AI Copilot",           k:"⌘I", e:"✨"},
  {id:"settings",  l:"Settings",             k:"⌘,", e:"⚙️"},
  {id:"terminal",  l:"Toggle Terminal",      k:"⌘J", e:"💻"},
  {id:"split",     l:"Split Editor",         k:"⌘\\",e:"⬜"},
  {id:"save",      l:"Save File",            k:"⌘S", e:"💾"},
  {id:"deploy",    l:"Deploy to Production", k:"⌘D", e:"🚀"},
  {id:"close-tab", l:"Close Active Tab",     k:"⌘W", e:"✕"},
  {id:"run",       l:"Run in Terminal",      k:"F5",  e:"▶"},
];
function CmdPalette({ onClose, onCmd }) {
  const [q,setQ] = useState(""), [sel,setSel] = useState(0);
  const f = CMDS.filter(c => !q || c.l.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => setSel(0), [q]);
  const run = c => { onCmd(c.id); onClose(); };
  return (
    <div style={{position:"fixed",inset:0,background:"#00000088",zIndex:200,
      display:"flex",alignItems:"flex-start",justifyContent:"center",
      paddingTop:"12vh",backdropFilter:"blur(4px)"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{width:"min(540px,94vw)",background:D.sb,borderRadius:8,
        border:`1px solid ${D.bdr}`,overflow:"hidden",boxShadow:"0 20px 60px #0009"}}>
        <input autoFocus value={q} onChange={e=>setQ(e.target.value)}
          onKeyDown={e=>{
            if(e.key==="ArrowDown"){e.preventDefault();setSel(s=>Math.min(s+1,f.length-1));}
            if(e.key==="ArrowUp")  {e.preventDefault();setSel(s=>Math.max(s-1,0));}
            if(e.key==="Enter")    run(f[sel]);
            if(e.key==="Escape")   onClose();
          }}
          placeholder="> Type a command..."
          style={{width:"100%",background:D.inp,border:"none",
            borderBottom:`1px solid ${D.bdr}`,padding:"12px 16px",
            color:D.txt,fontSize:14,outline:"none",
            fontFamily:"'JetBrains Mono',monospace",boxSizing:"border-box"}}/>
        <div style={{maxHeight:300,overflow:"auto"}}>
          {f.map((c,i) => (
            <div key={c.id} onClick={()=>run(c)} onMouseEnter={()=>setSel(i)}
              style={{padding:"8px 16px",display:"flex",alignItems:"center",gap:12,
                cursor:"pointer",background:i===sel?D.sel:"transparent",
                color:i===sel?D.wht:D.txt}}>
              <span style={{fontSize:15,width:22,textAlign:"center"}}>{c.e}</span>
              <span style={{flex:1,fontSize:13}}>{c.l}</span>
              {c.k && <span style={{fontSize:11,color:D.dim,background:D.bdr,borderRadius:3,padding:"1px 6px"}}>{c.k}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DEPLOY MODAL ──────────────────────────────────────────────
function DeployModal({ onClose }) {
  const [plat,setPlat] = useState(null), [step,setStep] = useState(0);
  const [log,setLog] = useState([]), [url,setUrl] = useState("");
  const platforms = [
    {id:"vercel", n:"Vercel",     i:"▲",d:"Frontend & Serverless"},
    {id:"netlify",n:"Netlify",    i:"◆",d:"JAMstack & Static"},
    {id:"railway",n:"Railway",    i:"🚂",d:"Full-Stack + Database"},
    {id:"docker", n:"Docker Hub", i:"🐳",d:"Containerized Apps"},
    {id:"aws",    n:"AWS Lambda", i:"🔶",d:"Serverless at Scale"},
    {id:"render", n:"Render",     i:"🔷",d:"Auto Git Deploy"},
  ];
  const deploy = async () => {
    setStep(2); setLog([]);
    for (const [d,t,v] of [
      [200,"inf","📦 Bundling application..."],
      [350,"out","⚙  Running pre-deploy checks..."],
      [300,"grn","✓ TypeScript compiled"],
      [300,"grn","✓ Tests passed (8/8)"],
      [400,"out","🌐 Uploading artifacts..."],
      [350,"out",`🚀 Deploying to ${plat.n}...`],
      [400,"grn","✅ Deployment successful!"],
    ]) { await sleep(d); setLog(l=>[...l,{t,v}]); }
    setUrl(`https://codeforge-app.${plat.id}.app`);
  };
  const C={inf:D.blu,out:D.txt,grn:D.grn,red:D.red};
  return (
    <div style={{position:"fixed",inset:0,background:"#000a",zIndex:150,
      display:"flex",alignItems:"center",justifyContent:"center",
      padding:16,backdropFilter:"blur(4px)"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{width:"min(460px,96vw)",background:D.sb,borderRadius:12,
        border:`1px solid ${D.bdr}`,overflow:"hidden",boxShadow:"0 20px 60px #0009"}}>
        <div style={{padding:"14px 16px",borderBottom:`1px solid ${D.bdr}`,
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:14,fontWeight:700,color:D.txt}}>🚀 Deploy to Production</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:18}}>✕</button>
        </div>
        {step===0 && (
          <div style={{padding:16}}>
            <div style={{fontSize:12,color:D.dim,marginBottom:12}}>Select deployment target:</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {platforms.map(p => (
                <button key={p.id} onClick={()=>{setPlat(p);setStep(1);}}
                  style={{background:"#1e1e1e",border:`1px solid ${D.bdr}`,borderRadius:8,
                    padding:"12px 10px",cursor:"pointer",textAlign:"left",transition:"border-color .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=D.ac}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=D.bdr}>
                  <div style={{fontSize:22,marginBottom:6}}>{p.i}</div>
                  <div style={{fontSize:13,fontWeight:600,color:D.txt}}>{p.n}</div>
                  <div style={{fontSize:11,color:D.dim,marginTop:2}}>{p.d}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        {step===1 && plat && (
          <div style={{padding:16}}>
            <div style={{fontSize:22,textAlign:"center",marginBottom:8}}>{plat.i}</div>
            <div style={{fontSize:14,fontWeight:600,color:D.txt,textAlign:"center",marginBottom:16}}>Configure {plat.n}</div>
            {[["Project","codeforge-app"],["Branch","main"],["Build","npm run build"],["Output","dist"]].map(([l,v]) => (
              <div key={l} style={{marginBottom:10}}>
                <div style={{fontSize:11,color:D.dim,marginBottom:4,textTransform:"uppercase",letterSpacing:".05em"}}>{l}</div>
                <input defaultValue={v} style={{width:"100%",background:D.inp,border:`1px solid ${D.bdr}`,borderRadius:4,padding:"7px 10px",color:D.txt,fontSize:12,outline:"none",boxSizing:"border-box"}}/>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <button onClick={()=>setStep(0)} style={{flex:1,background:D.hov,border:`1px solid ${D.bdr}`,borderRadius:6,padding:8,color:D.dim,cursor:"pointer",fontSize:12}}>Back</button>
              <button onClick={deploy} style={{flex:2,background:D.ac,border:"none",borderRadius:6,padding:8,color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12}}>🚀 Deploy Now</button>
            </div>
          </div>
        )}
        {step===2 && (
          <div style={{padding:16}}>
            <div style={{background:"#1e1e1e",borderRadius:8,padding:12,fontFamily:"monospace",
              fontSize:12,lineHeight:1.8,maxHeight:240,overflow:"auto",border:`1px solid ${D.bdr}`}}>
              {log.map((l,i) => <div key={i} style={{color:C[l.t]||D.txt}}>{l.v}</div>)}
              {!url && <span style={{color:D.ac,animation:"blink 1s infinite"}}>▌</span>}
            </div>
            {url && (
              <div style={{marginTop:14,textAlign:"center"}}>
                <div style={{fontSize:28,marginBottom:6}}>🎉</div>
                <div style={{color:D.grn,fontWeight:700,fontSize:14,marginBottom:4}}>Live in Production!</div>
                <div style={{color:D.ac,fontSize:12,marginBottom:14,background:"#1e1e1e",
                  padding:"6px 12px",borderRadius:6,border:`1px solid ${D.bdr}`}}>{url}</div>
                <button onClick={onClose} style={{background:D.ac,border:"none",borderRadius:6,padding:"8px 24px",color:"#fff",cursor:"pointer",fontWeight:600}}>Done ✓</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function VSCodeMobile() {
  const [tree,setTree]       = useState(TREE);
  const [files,setFiles]     = useState(FILES);
  const [tabs,setTabs]       = useState(["src/App.tsx","src/App.css"]);
  const [active,setActive]   = useState("src/App.tsx");
  const [sbTab,setSbTab]     = useState("files");
  const [sbOpen,setSbOpen]   = useState(true);
  const [termOpen,setTO]     = useState(true);
  const [termH,setTermH]     = useState(180);
  const [tLines,setTLines]   = useState([
    {t:"sys",v:"CodeForge Pro Terminal  —  ready"},
    {t:"dim",v:'Type "help" for available commands'},
  ]);
  const [tInput,setTInput]   = useState("");
  const [tRunning,setTR]     = useState(false);
  const [showCmd,setShowCmd] = useState(false);
  const [showDeploy,setSD]   = useState(false);
  const [split,setSplit]     = useState(false);
  const [splitTab,setSTb]    = useState("src/App.css");
  const [modified,setMod]    = useState(new Set(["src/App.tsx"]));
  const [notifs,setNotifs]   = useState([]);
  const [settings,setSettings] = useState({
    fontSize:13,tabSize:2,wordWrap:true,autoSave:true,
    formatOnSave:true,minimap:false,lineNumbers:true,bracketPairs:true,
  });

  const notify = (msg,type="info") => {
    const id = Date.now();
    setNotifs(n => [...n,{id,msg,type}]);
    setTimeout(() => setNotifs(n => n.filter(x=>x.id!==id)), 3500);
  };

  const openFile = useCallback(key => {
    if (!key || !files[key] === undefined) return;
    setActive(key);
    setTabs(t => t.includes(key) ? t : [...t,key]);
  }, [files]);

  const closeTab = (key, e) => {
    e?.stopPropagation();
    const idx = tabs.indexOf(key);
    const nt = tabs.filter(t=>t!==key);
    setTabs(nt);
    if (active===key) setActive(nt[Math.max(0,idx-1)] || nt[0] || "");
  };

  const edit = (key, val) => {
    setFiles(f => ({...f,[key]:val}));
    setMod(m => new Set([...m,key]));
  };

  const save = key => {
    setMod(m => { const s=new Set(m); s.delete(key); return s; });
    notify(`Saved ${key?.split("/").pop()}`, "success");
  };

  const toggleFolder = useCallback(id => {
    const tog = nodes => nodes.map(n => n.id===id ? {...n,open:!n.open} : n.children ? {...n,children:tog(n.children)} : n);
    setTree(t => tog(t));
  }, []);

  const runTerm = async () => {
    const cmd = tInput.trim(); if (!cmd) return;
    setTInput("");
    setTLines(l => [...l,{t:"dim",v:`$ ${cmd}`}]);
    if (cmd.toLowerCase()==="clear") { setTLines([]); return; }
    setTR(true);
    for await (const line of execCmd(cmd)) {
      setTLines(l => [...l,line]);
      await sleep(10);
    }
    setTR(false);
  };

  const handleCmd = id => {
    if (["files","search","git","extensions","ai","settings"].includes(id)) { setSbTab(id); setSbOpen(true); }
    if (id==="terminal") setTO(o=>!o);
    if (id==="split")    setSplit(s=>!s);
    if (id==="save")     save(active);
    if (id==="deploy")   setSD(true);
    if (id==="close-tab") closeTab(active);
    if (id==="run")      { setTO(true); setTLines(l=>[...l,{t:"sys",v:`▶ Running ${active}...`},{t:"grn",v:"✓ No errors."}]); }
  };

  useEffect(() => {
    const h = e => {
      if ((e.metaKey||e.ctrlKey)&&e.shiftKey&&e.key==="p") { e.preventDefault(); setShowCmd(true); }
      if ((e.metaKey||e.ctrlKey)&&e.key==="s")              { e.preventDefault(); save(active); }
      if ((e.metaKey||e.ctrlKey)&&e.key==="j")              { e.preventDefault(); setTO(o=>!o); }
    };
    window.addEventListener("keydown",h);
    return () => window.removeEventListener("keydown",h);
  }, [active]);

  const lang = active ? gl(active) : null;
  const sideIcons = [
    {id:"files",     e:"📁",tip:"Explorer"},
    {id:"search",    e:"🔍",tip:"Search"},
    {id:"git",       e:"🔀",tip:"Source Control"},
    {id:"extensions",e:"🧩",tip:"Extensions"},
    {id:"ai",        e:"✨",tip:"AI Copilot"},
  ];

  return (
    <div style={{height:"100dvh",display:"flex",flexDirection:"column",
      background:D.bg,color:D.txt,
      fontFamily:"'Outfit',system-ui,sans-serif",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Outfit:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${D.scr};border-radius:3px}
        textarea{-webkit-text-size-adjust:none;text-size-adjust:none}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}
        @keyframes slideIn{from{transform:translateX(-8px);opacity:0}to{transform:none;opacity:1}}
        @keyframes fadeUp{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:2px;background:${D.bdr}}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:${D.ac}}
      `}</style>

      {/* TITLE BAR */}
      <div style={{height:36,background:D.ttl,display:"flex",alignItems:"center",
        paddingLeft:12,gap:8,flexShrink:0,borderBottom:`1px solid ${D.bdr}`}}>
        <div style={{display:"flex",gap:6,marginRight:4}}>
          {["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
        </div>
        <button onClick={()=>setShowCmd(true)} style={{flex:1,maxWidth:300,background:D.inp,
          border:`1px solid ${D.bdr}44`,borderRadius:5,padding:"3px 12px",
          color:D.dim,fontSize:12,cursor:"pointer",textAlign:"center",
          display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <span>🔍</span><span>codeforge-app</span><span style={{fontSize:10,opacity:.5}}>⌘⇧P</span>
        </button>
        <div style={{marginLeft:"auto",display:"flex",gap:6,paddingRight:8}}>
          <button onClick={()=>setSplit(s=>!s)} style={{
            background:split?`${D.ac}22`:"none",
            border:`1px solid ${split?D.ac:D.bdr}`,borderRadius:4,
            color:split?D.ac:D.dim,cursor:"pointer",padding:"3px 8px",fontSize:12}}>⬜ Split</button>
          <button onClick={()=>setSD(true)} style={{
            background:`${D.ac}22`,border:`1px solid ${D.ac}44`,
            borderRadius:4,color:D.ac,cursor:"pointer",
            padding:"3px 10px",fontSize:11,fontWeight:600}}>🚀 Deploy</button>
        </div>
      </div>

      {/* BODY */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* Activity Bar */}
        <div style={{width:42,background:D.sb,borderRight:`1px solid ${D.bdr}`,
          display:"flex",flexDirection:"column",alignItems:"center",
          paddingTop:8,gap:2,flexShrink:0}}>
          {sideIcons.map(({id,e,tip}) => (
            <button key={id} title={tip}
              onClick={()=>{setSbTab(id);setSbOpen(o=>sbTab===id?!o:true)}}
              style={{width:34,height:34,background:"none",border:"none",
                cursor:"pointer",fontSize:16,
                borderLeft:`2px solid ${sbTab===id&&sbOpen?D.ac:"transparent"}`,
                color:sbTab===id&&sbOpen?D.wht:D.dim,
                display:"flex",alignItems:"center",justifyContent:"center",
                borderRadius:"0 4px 4px 0",transition:"all .15s",position:"relative"}}>
              {e}
              {id==="git"&&modified.size>0&&(
                <span style={{position:"absolute",top:2,right:2,background:D.ac,
                  color:"#fff",borderRadius:"50%",width:13,height:13,
                  fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",
                  fontWeight:700}}>{modified.size}</span>
              )}
            </button>
          ))}
          <div style={{flex:1}}/>
          <button title="Settings" onClick={()=>{setSbTab("settings");setSbOpen(true)}}
            style={{width:34,height:34,background:"none",border:"none",cursor:"pointer",
              fontSize:16,color:sbTab==="settings"&&sbOpen?D.wht:D.dim,
              display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}>⚙️</button>
        </div>

        {/* Sidebar */}
        {sbOpen && (
          <div style={{width:210,background:D.sb,borderRight:`1px solid ${D.bdr}`,
            display:"flex",flexDirection:"column",overflow:"hidden",
            flexShrink:0,animation:"slideIn .15s ease"}}>
            <div style={{flex:1,overflow:"auto"}}>
              {sbTab==="files" && (
                <div>
                  <div style={{padding:"6px 12px 4px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:11,color:D.dim,textTransform:"uppercase",letterSpacing:".08em"}}>Explorer</span>
                  </div>
                  {tree.map(n => <TreeNode key={n.id} node={n} active={active} onOpen={openFile} onToggle={toggleFolder}/>)}
                </div>
              )}
              {sbTab==="search"     && <SearchPanel onOpen={openFile}/>}
              {sbTab==="git"        && <GitPanel modified={[...modified]}/>}
              {sbTab==="extensions" && <ExtPanel/>}
              {sbTab==="settings"   && <SettingsPanel s={settings} set={(k,v)=>setSettings(s=>({...s,[k]:v}))}/>}
              {sbTab==="ai"         && <AICopilot file={active} content={files[active]}/>}
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

          {/* Tabs */}
          <div style={{height:37,background:D.tab,display:"flex",alignItems:"flex-end",
            overflow:"auto",flexShrink:0,borderBottom:`1px solid ${D.bdr}`}}>
            {tabs.map(key => {
              const lg=gl(key), isA=key===active, isMod=modified.has(key);
              return (
                <div key={key} onClick={()=>setActive(key)}
                  style={{height:35,display:"flex",alignItems:"center",gap:6,
                    padding:"0 10px",cursor:"pointer",flexShrink:0,
                    background:isA?D.bg:"transparent",
                    borderTop:`1px solid ${isA?D.ac:"transparent"}`,
                    borderRight:`1px solid ${D.bdr}`,
                    color:isA?D.wht:D.dim,fontSize:12,maxWidth:160,minWidth:70}}>
                  <span style={{fontSize:13}}>{lg.i}</span>
                  <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{key.split("/").pop()}</span>
                  {isMod && <span style={{width:7,height:7,borderRadius:"50%",background:D.yel,flexShrink:0}}/>}
                  <span onClick={e=>closeTab(key,e)}
                    style={{flexShrink:0,fontSize:12,opacity:.5,padding:2,borderRadius:3,lineHeight:1}}
                    onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.background=D.bdr}}
                    onMouseLeave={e=>{e.currentTarget.style.opacity=".5";e.currentTarget.style.background="transparent"}}>✕</span>
                </div>
              );
            })}
          </div>

          {/* Breadcrumb */}
          {active && (
            <div style={{height:24,background:D.bg,borderBottom:`1px solid ${D.bdr}`,
              padding:"0 12px",display:"flex",alignItems:"center",gap:4,
              fontSize:12,color:D.dim,flexShrink:0}}>
              {active.split("/").map((seg,i,arr) => (
                <span key={i} style={{display:"flex",alignItems:"center",gap:4}}>
                  {i>0 && <span style={{opacity:.4,fontSize:10}}>›</span>}
                  <span style={{color:i===arr.length-1?D.txt:D.dim}}>{seg}</span>
                </span>
              ))}
            </div>
          )}

          {/* Editors */}
          <div style={{flex:1,display:"flex",overflow:"hidden"}}>
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              {active
                ? <Editor filename={active} content={files[active]||""} onChange={v=>edit(active,v)} fontSize={settings.fontSize}/>
                : <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14}}>
                    <div style={{fontSize:60,opacity:.1}}>⚡</div>
                    <div style={{color:D.dim,fontSize:14}}>Open a file from Explorer</div>
                    <button onClick={()=>setShowCmd(true)} style={{background:D.sb,border:`1px solid ${D.bdr}`,borderRadius:6,padding:"8px 16px",color:D.dim,fontSize:12,cursor:"pointer"}}>⌘⇧P  Command Palette</button>
                  </div>
              }
            </div>
            {split && (
              <>
                <div style={{width:1,background:D.bdr}}/>
                <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
                  <div style={{height:37,background:D.tab,display:"flex",alignItems:"flex-end",overflow:"auto",borderBottom:`1px solid ${D.bdr}`}}>
                    {tabs.map(key => {
                      const lg=gl(key), isA=key===splitTab;
                      return (
                        <div key={key} onClick={()=>setSTb(key)}
                          style={{height:35,display:"flex",alignItems:"center",gap:6,padding:"0 10px",cursor:"pointer",flexShrink:0,
                            background:isA?D.bg:"transparent",
                            borderTop:`1px solid ${isA?D.pur:"transparent"}`,
                            borderRight:`1px solid ${D.bdr}`,
                            color:isA?D.wht:D.dim,fontSize:12}}>
                          <span>{lg.i}</span>
                          <span style={{fontSize:12}}>{key.split("/").pop()}</span>
                        </div>
                      );
                    })}
                  </div>
                  <Editor filename={splitTab} content={files[splitTab]||""} onChange={v=>edit(splitTab,v)} fontSize={settings.fontSize}/>
                </div>
              </>
            )}
          </div>

          {/* Terminal */}
          {termOpen && (
            <div style={{height:termH,borderTop:`1px solid ${D.bdr}`,display:"flex",flexDirection:"column",flexShrink:0}}>
              <div style={{height:30,background:D.sb,display:"flex",alignItems:"center",
                gap:8,padding:"0 12px",borderBottom:`1px solid ${D.bdr}`,flexShrink:0}}>
                <span style={{fontSize:12,color:D.dim}}>💻 TERMINAL</span>
                <div style={{flex:1}}/>
                <button onClick={()=>setTLines([])} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:11,padding:"2px 6px"}}>Clear</button>
                <button onClick={()=>setTermH(h=>h===180?340:180)} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:14,padding:"2px 4px"}}>⬜</button>
                <button onClick={()=>setTO(false)} style={{background:"none",border:"none",color:D.dim,cursor:"pointer",fontSize:16,padding:"2px 4px"}}>✕</button>
              </div>
              <TermPanel lines={tLines} onRun={runTerm} input={tInput} setInput={setTInput} running={tRunning}/>
            </div>
          )}
        </div>
      </div>

      {/* STATUS BAR */}
      <div style={{height:22,background:D.sta,display:"flex",alignItems:"center",
        padding:"0 10px",gap:12,fontSize:11,color:"#fff",flexShrink:0}}>
        <span style={{cursor:"pointer"}}>⎇ main</span>
        <span>
          {modified.size>0
            ? <span style={{color:"#ffdd57"}}>⚠ {modified.size} unsaved</span>
            : <span style={{color:"#4ec9b0"}}>✓ All saved</span>
          }
        </span>
        <div style={{flex:1}}/>
        {lang && <span>{lang.i} {lang.n}</span>}
        <span>UTF-8</span><span>LF</span>
        <button onClick={()=>setTO(o=>!o)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:11,padding:"0 2px"}}>💻</button>
        <button onClick={()=>setShowCmd(true)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:11,padding:"0 2px"}}>⌘⇧P</button>
      </div>

      {/* NOTIFICATIONS */}
      <div style={{position:"fixed",bottom:28,right:12,zIndex:300,display:"flex",flexDirection:"column",gap:6,pointerEvents:"none"}}>
        {notifs.map(n => (
          <div key={n.id} style={{background:D.sb,
            border:`1px solid ${n.type==="success"?D.grn:n.type==="error"?D.red:D.bdr}`,
            borderRadius:6,padding:"8px 12px",fontSize:12,color:D.txt,
            maxWidth:220,animation:"fadeUp .3s ease",boxShadow:"0 4px 16px #0006"}}>
            {n.type==="success"?"✅ ":n.type==="error"?"❌ ":"ℹ️ "}{n.msg}
          </div>
        ))}
      </div>

      {/* MODALS */}
      {showCmd   && <CmdPalette onClose={()=>setShowCmd(false)} onCmd={handleCmd}/>}
      {showDeploy && <DeployModal onClose={()=>setSD(false)}/>}
    </div>
  );
}
