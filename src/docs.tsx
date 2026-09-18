import { useEffect, useMemo, useRef, useState } from 'react';

type NavItem = { id: string; title: string; group: string; keywords: string };

const NAV: NavItem[] = [
  { id: 'welcome', title: 'Overview', group: 'Start', keywords: 'overview cmoble os byts by5 bvm' },
  { id: 'whats-new', title: "What's new", group: 'Start', keywords: 'release v0.7 v0.8 forge auth renderer framebuffer' },
  { id: 'quick-start', title: 'Build your first app', group: 'Start', keywords: 'quick start first app forge publish' },
  { id: 'architecture', title: 'Platform architecture', group: 'Platform', keywords: 'architecture store aether cmobfs forge bvm sandbox' },
  { id: 'by5', title: 'BY5 language', group: 'Language', keywords: 'by5 five glyph alphabet checksum encoding' },
  { id: 'encoding', title: 'Five-glyph encoding', group: 'Language', keywords: 'base5 byte checksum encode' },
  { id: 'bvm1', title: 'BVM1 instruction set', group: 'Language', keywords: 'opcode clear rect text movi addi state click jump' },
  { id: 'permissions', title: 'Permissions', group: 'Platform', keywords: 'storage files clipboard network notifications clock input' },
  { id: 'project-file', title: 'forge.project.json', group: 'Project', keywords: 'manifest project metadata package id version channel description' },
  { id: 'media', title: 'Store media', group: 'Project', keywords: 'logo screenshots video png jpeg webp mp4' },
  { id: 'forge', title: 'Forge build pipeline', group: 'Build', keywords: 'compile header ed25519 signing package publish' },
  { id: 'signing', title: 'Signing & publisher identity', group: 'Build', keywords: 'ed25519 key pem auto identity aether' },
  { id: 'package-format', title: 'BYTS package format', group: 'Build', keywords: 'header manifest sha256 package 256 kib 64 code' },
  { id: 'runtime', title: 'Runtime & events', group: 'Runtime', keywords: 'registers events frame click key instruction budget' },
  { id: 'state', title: 'Persistent state', group: 'Runtime', keywords: 'state slots private storage cmobfs persistence' },
  { id: 'installer', title: 'Install & security flow', group: 'Runtime', keywords: 'download extract publisher integrity permissions version sealed' },
  { id: 'counter-example', title: 'Five Glyph Counter', group: 'Examples', keywords: 'counter real example code app' },
  { id: 'minimal-example', title: 'Minimal app', group: 'Examples', keywords: 'clear halt example source' },
  { id: 'builder-example', title: 'BY5 byte builder', group: 'Examples', keywords: 'typescript encode helper bytes app' },
  { id: 'errors', title: 'Compiler errors', group: 'Reference', keywords: 'B5001 B5002 B5003 B5004 B5H BVM errors' },
  { id: 'limits', title: 'Limits & guarantees', group: 'Reference', keywords: 'limits slots package code fields strings' },
  { id: 'publishing', title: 'Publishing checklist', group: 'Reference', keywords: 'publish checklist media account store' },
];

const PROJECT_JSON = `{
  "packageId": "schoolgit.byts.five-glyph-counter",
  "fullName": "Five Glyph Counter",
  "shortName": "five-glyph-counter",
  "version": "1.0.0",
  "channel": "stable",
  "publisher": "CMOB*LE Forge Demonstration Publisher",
  "slogan": "Five glyphs. Too many ways to fail.",
  "motto": "Compile carefully.",
  "shortDescription": "A real BY5 demo app compiled from five glyphs.",
  "fullDescription": "A reference BYTS application for CMOB*LE OS.",
  "permissions": 65,
  "flags": 0,
  "minOs": [0, 7, 0],
  "stateSlots": 1,
  "recommended": true
}`;

const ENCODER = `const ALPHABET = '<>+-!';

function encodeByte(value: number) {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new Error('byte must be 0..255');
  }

  let v = value;
  const d0 = Math.floor(v / 125); v %= 125;
  const d1 = Math.floor(v / 25);  v %= 25;
  const d2 = Math.floor(v / 5);
  const d3 = v % 5;

  const check = (d0 + 2*d1 + 3*d2 + 4*d3) % 5;
  return ALPHABET[d0] + ALPHABET[d1] + ALPHABET[d2] + ALPHABET[d3] + ALPHABET[check];
}

function encodeProgram(bytes: number[]) {
  return bytes.map(encodeByte).join('');
}`;

const MINIMAL_SOURCE = `<<->-<>!>-<>>+-<<!<+<<<<<<<<<<`;
const MINIMAL_BYTES = `[0x10, 0x2E, 0x20, 0x14, 0x00, 0x00]
// CLEAR 0x0014202E
// HALT`;

const COUNTER_SOURCE = `<<->-<>>+-<<->-<<+><+<><<<<-++<>+>+<<<<<<>+>+<<<<<<!!<<<<<-+>!-!!<<<>!<+<>-<><!-<<!>>+<><<<<-++<+>>><<<<<<+>>><<<<<<-><!<<<-+<-+>><<<<<<--<<<>!-><>>!>+<><<<<--><-<--<<<<<<-<--<<<<<<<<-++<><<+<><<+<><<+<><<<<--><+!<><+!--<-+>><+-!!<>>+-<+!><<-<><<-+!-<-><!<+!+!<>>+-<+-+><-<!+<-+<+<-<--<->!<<+-!!<->++<<--><-<--<<<<<<!->><<<<<<<<>!+<><<>--><><--++<><<<+<>-<+-<-<>>+-<!+!<<!<>+<-!+><!>--<>>+-<+->+<-+!-<+<-><>>+-<!+++<!+!<<!+>-<!<-<<!+!<<-!+><!>!+<+>-!<>>+-<!+>-<!+<!<!>--<!!>!<>>+-<++<<<>>+-<+++-<>>+-<>---<>>+-<>!<!<>>+-<>>-+<>>+-<!<>+<!!<<<!><><!-<+<!->><>>+-<!><><!+<!<>>+-<!-<+<!+>-<!-+<<!+!<<-!!!<!<>+<>!>-<<--><-<--<<<<<>++><<<<<<<<<>!>+-++>>--!>><!!+<><<<<!-!<-><!<+-!!<->++<->-><+!--<->-><->!<<+-!!<-<--<->!<<>>+-<->-><->!<<+-<-<->!<<+-!!<>>+-<->-><-<><<-<!+<->!<<>>+-<>!-><>>!><<<<<<<<<<<<--><-<--<<<<<>!<>-<<<<<<<<+-+<><<>!><+>--+!+<><<<<><-<+-+><-<!+<-+<+<-<--<->!<<<-!<>!><+<<<<<>----<<<<<<<<!>+<><<+<><<+<><<+<><<<<<<<<<-++<-<--<<<<<<+!!+<<<>!>>+!<<<<>!<--+-<<<<<>!-+><++>!<--+-+<><<<<--><!+<!<<<<<<!<!!<<<>!<<<+-+<><<+<><<+<><<+<><<<<!>><-><!<-+<+<-<--<+-+><+!+!<>>+-<->!<<+!+!<+-!!<>>+-<+!<><+!--<-+>><+-!!<>>+-<+!><<-<><<-+!-<-><!<+!+!<->-><>!!<<-<--<<<<<<+!!+<<<>!>>+!<<<<>!<--+-<<<<<<<++!<<<<<<>>!><<<<<<<<<<<>>-+<<<<<<<<>!<<<<<<<<<<<<<<<<>+<-<<<<<<<<<<<<--><-<--<<<<<>-+!!<<<>!<<<>!>>--!><+!-><<+!+<><<<>++><+->+<-+!-<+<-><>>+-<>!<!<+++-<>>+-<+->+<-+>><-<+!<>!!<<>>+-<>!<!<+++-<>>+-<+->+<-+!-<->!<<->-><>>+-<>!++<>>+-<+-+><-<+!<-<!+<+->+<>-+!<-<><<+-!!<>>+-<->-><+-<-<-<--<+--<<+->+<-<!+<-+-!<<<<<`;

const BYTE_BUILDER = `const bytes: number[] = [];
const u8 = (n:number) => bytes.push(n & 0xff);
const u16 = (n:number) => { u8(n); u8(n >> 8); };
const u32 = (n:number) => { u8(n); u8(n >> 8); u8(n >> 16); u8(n >> 24); };

// CLEAR(color)
u8(0x10);
u32(0x0014202E);

// RECT(x, y, w, h, color)
u8(0x11);
u16(40); u16(40); u16(300); u16(80);
u32(0x00F6C453);

// HALT
u8(0x00);

const implementationBy5 = encodeProgram(bytes);
console.log(implementationBy5);`;

const FORGE_FLOW = `Developer supplies
  implementation.by5
  forge.project.json
  logo
  exactly 5 screenshots
  MP4 preview
        │
        ▼
BYTS Forge
  validates five-glyph source
  generates interface.by5h
  verifies BVM1 control flow
  checks permissions
  creates/reuses account Ed25519 identity
  hashes media
  signs manifest
  builds .BYTS
  verifies final package
        │
        ▼
Immutable BYTS Store version
        │
        ▼
CMOB*LE secure installer
        │
        ▼
BVM1 sandbox`;

const ARCH = `Public developer
      │
      ▼
BYTS Forge
      │ compile + sign + publish
      ▼
School-GIT / AETHER
      │ immutable app/version records
      ▼
CMOB*LE BYTS Store
      │ download exact version
      ▼
Secure installer
      │ verify + permission review
      ▼
CMOBFS installed package
      │
      ▼
BVM1 sandbox runtime`;

const opcodes = [
  ['0x00', 'HALT', '—', 'Stop execution.'],
  ['0x10', 'CLEAR', 'color:u32', 'Clear the app surface to a 32-bit color.'],
  ['0x11', 'RECT', 'x:u16 y:u16 w:u16 h:u16 color:u32', 'Draw a filled rectangle.'],
  ['0x12', 'TEXT', 'x:u16 y:u16 scale:u8 color:u32 len:u8 bytes[len]', 'Draw UTF-8/byte text, maximum 95 bytes per instruction.'],
  ['0x13', 'TEXTREG', 'x:u16 y:u16 scale:u8 color:u32 reg:u8', 'Draw the unsigned decimal value of a register.'],
  ['0x20', 'MOVI', 'reg:u8 value:u32', 'Load an immediate value into one of 8 registers.'],
  ['0x21', 'ADDI', 'reg:u8 value:i32', 'Add a signed immediate to a register.'],
  ['0x22', 'LOADSTATE', 'reg:u8 slot:u8', 'Load a persistent state slot. Requires PRIVATE_STORAGE.'],
  ['0x23', 'SAVESTATE', 'reg:u8 slot:u8', 'Save a persistent state slot. Requires PRIVATE_STORAGE.'],
  ['0x30', 'IF_EVENT', 'type:u8 skip:u16', 'Execute the following block only for a matching event type. Requires INPUT.'],
  ['0x31', 'IF_CLICK', 'x:u16 y:u16 w:u16 h:u16 skip:u16', 'Execute the following block only when the current click lands in the rectangle. Requires INPUT.'],
  ['0x32', 'JUMP', 'relative:i16', 'Relative branch; the target must land exactly on an instruction boundary.'],
];

const permissions = [
  ['0', '1', 'PRIVATE_STORAGE', 'Persistent per-app state. Directly required by LOADSTATE/SAVESTATE.'],
  ['1', '2', 'USER_FILES', 'Declares access to user files for platform services.'],
  ['2', '4', 'CLIPBOARD', 'Declares clipboard capability.'],
  ['3', '8', 'NETWORK', 'Declares network capability.'],
  ['4', '16', 'NOTIFICATIONS', 'Declares notification capability.'],
  ['5', '32', 'CLOCK', 'Declares clock/time capability.'],
  ['6', '64', 'INPUT', 'Required by IF_EVENT and IF_CLICK.'],
];

const fieldLimits = [
  ['packageId', '47 UTF-8 bytes'], ['fullName', '63 UTF-8 bytes'], ['shortName', '23 UTF-8 bytes'],
  ['version', '19 UTF-8 bytes'], ['channel', '11 UTF-8 bytes'], ['publisher', '47 UTF-8 bytes'],
  ['slogan', '63 UTF-8 bytes'], ['motto', '63 UTF-8 bytes'], ['shortDescription', '127 UTF-8 bytes'],
  ['fullDescription', '511 UTF-8 bytes'],
];

function CodeBlock({ code, language = 'text', compact = false }: { code: string; language?: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }
  return (
    <div className={`code ${compact ? 'compact' : ''}`}>
      <div className="codebar"><span>{language}</span><button onClick={copy}>{copied ? 'COPIED' : 'COPY'}</button></div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow?: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="doc-section"><div className="anchor-offset" />{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h2>{title}</h2>{children}</section>;
}

function Callout({ tone = 'info', title, children }: { tone?: 'info' | 'warn' | 'good'; title: string; children: React.ReactNode }) {
  return <div className={`callout ${tone}`}><strong>{title}</strong><div>{children}</div></div>;
}

export default function Docs() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('welcome');
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(x => x.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]?.target?.id) setActive(visible[0].target.id);
    }, { rootMargin: '-96px 0px -70% 0px', threshold: [0, .1] });
    document.querySelectorAll('.doc-section').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return NAV;
    return NAV.filter(x => `${x.title} ${x.group} ${x.keywords}`.toLowerCase().includes(q));
  }, [query]);

  const groups = useMemo(() => [...new Set(filtered.map(x => x.group))], [filtered]);

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileOpen(false);
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileOpen(v => !v)} aria-label="Toggle navigation">☰</button>
        <a className="brand" href="#welcome" onClick={(e) => { e.preventDefault(); jump('welcome'); }}>
          <span className="brand-mark">C</span><span><b>CMOB*LE</b><small>OS DEVELOPER DOCS</small></span>
        </a>
        <div className="top-actions">
          <a className="ghost-link" href="https://school-git.packarcade.win/cdn/cmoble/byts-forge" target="_blank" rel="noreferrer">OPEN FORGE ↗</a>
          <span className="version-pill">CURRENT: v0.8.6</span>
        </div>
      </header>

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="search-wrap"><span>⌕</span><input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search docs…" /><kbd>/</kbd></div>
        <nav>
          {groups.map(group => <div className="nav-group" key={group}><div className="nav-group-title">{group}</div>{filtered.filter(x => x.group === group).map(item => <button key={item.id} className={active === item.id ? 'active' : ''} onClick={() => jump(item.id)}>{item.title}</button>)}</div>)}
          {filtered.length === 0 && <div className="empty-search">No section matches “{query}”.</div>}
        </nav>
        <div className="sidebar-foot"><span className="status-dot" /> Public ABI docs. Kernel source remains private.</div>
      </aside>

      <main className="content">
        <section id="welcome" className="doc-section hero">
          <div className="anchor-offset" />
          <div className="hero-kicker">OFFICIAL DEVELOPER INTERFACE</div>
          <h1>Build native-feeling apps for <span>CMOB*LE OS</span>.</h1>
          <p className="lede">CMOB*LE apps ship as signed <b>.BYTS</b> packages, are authored in the five-glyph <b>BY5</b> language, and execute inside the capability-gated <b>BVM1</b> sandbox. You do not need the private CMOB*LE kernel source to build an app.</p>
          <div className="hero-grid">
            <div><b>5</b><span>legal BY5 glyphs</span></div><div><b>13</b><span>BVM1 opcodes</span></div><div><b>16</b><span>persistent state slots</span></div><div><b>256 KiB</b><span>max BYTS package</span></div>
          </div>
          <div className="hero-actions"><button onClick={() => jump('quick-start')}>BUILD YOUR FIRST APP</button><button className="secondary" onClick={() => jump('bvm1')}>READ THE ABI</button></div>
          <Callout tone="info" title="Public contract, private implementation">These docs intentionally publish the application ABI, package format, build workflow, security rules, and examples developers need. They do not publish the private CMOB*LE kernel or backend implementation.</Callout>
        </section>

        <Section id="whats-new" eyebrow="CURRENT PLATFORM" title="What's new in the current CMOB*LE developer platform">
          <div className="timeline">
            <div><b>v0.7</b><span>Introduced BYTS applications, Store versions, the secure installer, BVM1 sandbox execution, account-backed Store access, and local-first app state.</span></div>
            <div><b>v0.8 / Forge</b><span>Introduced BY5, the coder/compiler toolchain, Workbench, web Forge, Ed25519 signing, media validation, package inspection, and the real Five Glyph Counter reference app.</span></div>
            <div><b>v0.8.1–0.8.3</b><span>Automatic account detection replaced manual JWT entry; School-GIT and CMOB*LE OS identities no longer have to match; Forge received the IDE-style editor and Asset Vault.</span></div>
            <div><b>v0.8.4+</b><span>Forge generates the interface header, publisher keypair, hashes, signature and .BYTS package itself. Developers no longer upload PEM keys or prebuilt packages.</span></div>
            <div><b>v0.8.6</b><span>Current native release. The framebuffer/runtime memory layout was moved out of the PC legacy hardware hole; developer-facing BYTS/Forge contracts remain compatible.</span></div>
          </div>
        </Section>

        <Section id="quick-start" eyebrow="START HERE" title="Build your first real app">
          <p>A normal developer authors only the project definition and BY5 implementation, then supplies Store media. Forge generates the rest.</p>
          <div className="steps">
            <div><span>01</span><h3>Create a project</h3><p>Choose a package ID, names, version, descriptions, permission mask, and persistent-state slot count.</p></div>
            <div><span>02</span><h3>Write BY5</h3><p>Your <code>implementation.by5</code> contains only <code>&lt; &gt; + - !</code>. Every five glyphs checksum-encode one byte of BVM1 program data.</p></div>
            <div><span>03</span><h3>Add Store media</h3><p>Upload one logo, exactly five screenshots, and one MP4 preview. Forge validates the actual file signatures and sizes.</p></div>
            <div><span>04</span><h3>Build release</h3><p>Forge generates <code>interface.by5h</code>, compiles/verifies BVM1, creates or reuses your Ed25519 publisher identity, signs the release and produces <code>.BYTS</code>.</p></div>
            <div><span>05</span><h3>Publish</h3><p>The Store creates an immutable app-version record. Older published versions remain individually addressable.</p></div>
            <div><span>06</span><h3>Install on CMOB*LE</h3><p>The native installer performs its security stages, seals the package into CMOBFS and opens it inside BVM1.</p></div>
          </div>
          <a className="big-link" href="https://school-git.packarcade.win/cdn/cmoble/byts-forge" target="_blank" rel="noreferrer">Open BYTS Forge →</a>
        </Section>

        <Section id="architecture" eyebrow="PLATFORM" title="Platform architecture">
          <CodeBlock code={ARCH} />
          <p>Normal Store applications do <b>not</b> execute arbitrary kernel-native code. The package contains BVM1 program bytes plus a signed manifest. That keeps the app surface narrow enough for CMOB*LE to validate control flow, permission requirements and package integrity before execution.</p>
          <div className="cards three"><div><h3>Forge</h3><p>Authoring, validation, header generation, signing, packaging and publishing.</p></div><div><h3>Store + AETHER</h3><p>Immutable versions, media, publisher identity references and account-scoped data.</p></div><div><h3>CMOB*LE + BVM1</h3><p>Secure installation, CMOBFS persistence and sandboxed app execution.</p></div></div>
        </Section>

        <Section id="by5" eyebrow="LANGUAGE" title="BY5: five characters, byte-level semantics">
          <p>BY5 source has exactly five legal glyphs and no whitespace, identifiers, keywords or comments:</p>
          <div className="glyphs"><span>&lt;</span><span>&gt;</span><span>+</span><span>-</span><span>!</span></div>
          <p>The alphabet maps to base-5 digits in that exact order: <code>&lt;=0</code>, <code>&gt;=1</code>, <code>+=2</code>, <code>-=3</code>, <code>!=4</code>. Four glyphs encode the byte value and the fifth is a checksum.</p>
          <Callout tone="warn" title="There is no forgiving parser">An illegal glyph, missing glyph, forbidden value above 255, checksum mismatch, stale interface binding, invalid branch target, missing permission or malformed instruction is a build error.</Callout>
        </Section>

        <Section id="encoding" eyebrow="LANGUAGE" title="Five-glyph byte encoding">
          <p>For digits <code>d0 d1 d2 d3</code>, the decoded value is:</p>
          <div className="formula">value = d0×125 + d1×25 + d2×5 + d3</div>
          <p>The fifth digit is:</p>
          <div className="formula">checksum = (d0 + 2×d1 + 3×d2 + 4×d3) mod 5</div>
          <p>Examples: byte <code>0x00</code> becomes <code>&lt;&lt;&lt;&lt;&lt;</code>. Opcode <code>0x10</code> (CLEAR) becomes <code>&lt;&lt;-&gt;-</code>.</p>
          <CodeBlock code={ENCODER} language="TypeScript — educational encoder" />
        </Section>

        <Section id="bvm1" eyebrow="ABI REFERENCE" title="BVM1 instruction set">
          <p>All multibyte numeric operands are little-endian. BVM1 v1 exposes eight 32-bit registers (<code>r0..r7</code>) and a 4,096-instruction execution budget per run.</p>
          <div className="table-wrap"><table><thead><tr><th>Opcode</th><th>Name</th><th>Operands</th><th>Behavior</th></tr></thead><tbody>{opcodes.map(r => <tr key={r[0]}>{r.map((c,i) => <td key={i}><code>{c}</code></td>)}</tr>)}</tbody></table></div>
          <Callout tone="info" title="Event types">The runtime currently defines <code>0 = frame</code>, <code>1 = click</code>, and <code>2 = key</code>. BVM1 v1 can branch on a key event being present, but it does not yet expose an opcode that copies the actual key character into a register.</Callout>
        </Section>

        <Section id="permissions" eyebrow="CAPABILITIES" title="BYTS permission mask">
          <div className="table-wrap"><table><thead><tr><th>Bit</th><th>Value</th><th>Name</th><th>Meaning</th></tr></thead><tbody>{permissions.map(r => <tr key={r[0]}>{r.map((c,i) => <td key={i}>{i < 3 ? <code>{c}</code> : c}</td>)}</tr>)}</tbody></table></div>
          <p>To combine permissions, OR the numeric values. For example, the Five Glyph Counter uses private storage plus input: <code>1 | 64 = 65</code>.</p>
          <Callout tone="info" title="Current VM surface">BVM1 v1 directly enforces the storage requirement for state opcodes and the input requirement for event/click opcodes during Forge verification. Other permission bits are declared at the package/platform level for surrounding services and future VM bindings.</Callout>
        </Section>

        <Section id="project-file" eyebrow="PROJECT" title="forge.project.json">
          <p>This file defines the public Store identity and runtime requirements of the app. Forge validates the field lengths before packaging.</p>
          <CodeBlock code={PROJECT_JSON} language="JSON" />
          <div className="table-wrap"><table><thead><tr><th>Field</th><th>Maximum</th></tr></thead><tbody>{fieldLimits.map(r => <tr key={r[0]}><td><code>{r[0]}</code></td><td>{r[1]}</td></tr>)}</tbody></table></div>
          <p><code>version</code> must be semantic versioning such as <code>1.0.0</code> or a supported prerelease form. <code>packageId</code> must use safe alphanumeric/dot/underscore/dash segments.</p>
        </Section>

        <Section id="media" eyebrow="STORE LISTING" title="Required Store media">
          <div className="cards three"><div><h3>Logo</h3><p>1 PNG, JPEG or WebP. Maximum 8 MiB.</p></div><div><h3>Screenshots</h3><p>Exactly 5 signed screenshots. PNG, JPEG or WebP. Maximum 16 MiB each.</p></div><div><h3>Preview</h3><p>1 MP4 with a valid <code>ftyp</code> container signature. Maximum 64 MiB.</p></div></div>
          <p>Forge hashes the actual media bytes and binds those hashes into the signed BYTS manifest. Renaming arbitrary data to <code>.png</code> or <code>.mp4</code> is not enough.</p>
          <Callout tone="good" title="You do not upload compiler-generated artifacts">Public Forge should not ask you for a PEM file, generated <code>interface.by5h</code>, manifest, hashes, signature or prebuilt <code>.BYTS</code>. Forge generates those.</Callout>
        </Section>

        <Section id="forge" eyebrow="BUILD" title="What Forge does when you press Build / Publish">
          <CodeBlock code={FORGE_FLOW} />
          <p>The generated interface header is 96 decoded bytes and is itself encoded into BY5 glyphs. It binds the source to the package ID, permission mask, state-slot count, code length, source-glyph count and SHA-256 of the decoded code.</p>
          <p>That is why changing valid BY5 source without regenerating its interface causes a stale-header failure rather than silently building a different program.</p>
        </Section>

        <Section id="signing" eyebrow="SECURITY" title="Publisher identity and Ed25519 signing">
          <p>Forge creates an Ed25519 keypair for the authenticated publisher account when one does not already exist. The identity is stored privately in AETHER and reused for future releases from that account.</p>
          <p>The developer does <b>not</b> manually obtain or upload a PEM key. Forge signs the package server-side and places the publisher-key identifier plus the 64-byte Ed25519 signature into the manifest.</p>
          <Callout tone="warn" title="Account rule">On the public Forge site, a valid School-GIT publisher session is sufficient. A separate CMOB*LE OS account may also be detected, but it does not have to match the School-GIT account.</Callout>
        </Section>

        <Section id="package-format" eyebrow="BINARY FORMAT" title="BYTS v1 package structure">
          <p>The native runtime currently defines a maximum package size of <b>256 KiB</b> and maximum BVM code size of <b>64 KiB</b>. Large Store media is not embedded directly into that package; its SHA-256 hashes are bound into the manifest while media is stored separately by the Store backend.</p>
          <div className="package-map"><div><b>Header</b><span>magic, version, offsets, sizes, package SHA-256, manifest SHA-256</span></div><div><b>Manifest</b><span>identity, version, permissions, media hashes, publisher key id, Ed25519 signature</span></div><div><b>Code</b><span>decoded BVM1 bytes produced from implementation.by5</span></div><div><b>Resources</b><span>optional package-local resource bytes</span></div></div>
          <p>The magic is <code>BYTS</code> and format version is <code>1</code>. The native parser validates section ranges and SHA-256 integrity before trusting manifest identity fields.</p>
        </Section>

        <Section id="runtime" eyebrow="RUNTIME" title="BVM1 execution model">
          <p>A BYTS app executes against its own drawing surface. It can clear, draw rectangles, draw text, display register values, work with eight registers, persist small integer state and branch on events/click regions.</p>
          <p>The VM stops after HALT, an error, end-of-code, or the 4,096-instruction budget. Invalid registers, state slots, truncated operands or invalid jumps halt execution.</p>
          <div className="stat-row"><div><b>8</b><span>32-bit registers</span></div><div><b>16</b><span>32-bit state slots</span></div><div><b>4096</b><span>instruction budget</span></div><div><b>95</b><span>max TEXT bytes/instruction</span></div></div>
        </Section>

        <Section id="state" eyebrow="RUNTIME" title="Persistent state">
          <p>BVM1 exposes 16 native state slots, each stored as a 32-bit value. Your project declares how many slots it intends to use, and Forge rejects state instructions that reference a slot outside the declared range.</p>
          <p>Use <code>LOADSTATE</code> and <code>SAVESTATE</code> with the <code>PRIVATE_STORAGE</code> permission. The native runtime saves app state into CMOBFS using a package-derived state filename. The broader BYTS bridge also provides account-backed state get/put plumbing for synchronized experiences.</p>
        </Section>

        <Section id="installer" eyebrow="NATIVE OS" title="Seven-stage secure installation">
          <div className="install-flow"><span>1 Downloaded</span><i>→</i><span>2 Extracted</span><i>→</i><span>3 Publisher verified</span><i>→</i><span>4 Integrity verified</span><i>→</i><span>5 Permissions reviewed</span><i>→</i><span>6 Version confirmed</span><i>→</i><span>7 Installed / sealed</span></div>
          <p>The package cannot advance past publisher verification unless the Store/host has verified the release signature, and it cannot advance past integrity verification unless the guest parser accepts the package digest.</p>
        </Section>

        <Section id="counter-example" eyebrow="REAL EXAMPLE" title="Five Glyph Counter">
          <p>The reference app is a real BVM1 program. Its implementation is 1,515 glyphs, decodes to 303 program bytes and uses 17 BVM instructions. It draws UI, loads state slot 0, displays the counter, detects a click, increments the value and saves it.</p>
          <details className="source-details"><summary>Show the complete implementation.by5 source</summary><CodeBlock code={COUNTER_SOURCE} language="BY5" compact /></details>
          <p>Its project permission mask is <code>65</code>: <code>PRIVATE_STORAGE (1)</code> + <code>INPUT (64)</code>. It declares one persistent state slot.</p>
        </Section>

        <Section id="minimal-example" eyebrow="EXAMPLE" title="Smallest useful visual app">
          <p>This program clears its app surface to color <code>0x0014202E</code> and halts.</p>
          <CodeBlock code={MINIMAL_BYTES} language="Decoded BVM1 bytes" />
          <CodeBlock code={MINIMAL_SOURCE} language="implementation.by5" />
          <p>Notice that even this tiny program has no readable opcode names in its final source. The five-glyph representation is the application source format.</p>
        </Section>

        <Section id="builder-example" eyebrow="EXAMPLE" title="Generate BY5 from BVM1 bytes">
          <p>Developers can use Forge's editor directly, or build local tooling that emits valid BVM1 bytes and then encodes them with the public BY5 rule. This does not require the private OS source.</p>
          <CodeBlock code={BYTE_BUILDER} language="TypeScript" />
          <p>Forge remains the authority for final interface generation, permission verification, signing and packaging.</p>
        </Section>

        <Section id="errors" eyebrow="REFERENCE" title="Compiler and verifier errors">
          <div className="error-grid">
            <div><code>B5001</code><span>Illegal glyph.</span></div><div><code>B5002</code><span>Source length is not divisible by five.</span></div><div><code>B5003</code><span>Encoded cell represents a forbidden byte above 255.</span></div><div><code>B5004</code><span>Five-glyph checksum mismatch.</span></div>
            <div><code>B5H100</code><span>Decoded interface header is not 96 bytes.</span></div><div><code>B5H101</code><span>Bad <code>B5H1</code> magic.</span></div><div><code>B5H200</code><span>Header permission mask differs from project.</span></div><div><code>B5H201</code><span>Stale decoded code-byte count.</span></div><div><code>B5H202</code><span>Stale source-glyph count.</span></div><div><code>B5H203</code><span>Stale code SHA-256.</span></div>
            <div><code>BVM000</code><span>Unknown opcode.</span></div><div><code>BVM001</code><span>Truncated instruction.</span></div><div><code>BVM004</code><span>State slot out of declared range.</span></div><div><code>BVM010</code><span>State opcode without PRIVATE_STORAGE.</span></div><div><code>BVM011</code><span>Input opcode without INPUT.</span></div><div><code>BVM021</code><span>Branch target is invalid or not an instruction boundary.</span></div>
          </div>
        </Section>

        <Section id="limits" eyebrow="REFERENCE" title="Important limits and guarantees">
          <ul className="check-list">
            <li>BY5 source accepts only <code>&lt; &gt; + - !</code>.</li>
            <li>Every encoded byte consumes exactly five glyphs.</li>
            <li>BVM1 exposes 8 registers and at most 16 persistent state slots.</li>
            <li>Native BYTS package maximum: 256 KiB.</li>
            <li>BVM code maximum: 64 KiB.</li>
            <li>TEXT payload maximum: 95 bytes per instruction.</li>
            <li>Execution budget: 4,096 instructions per VM run.</li>
            <li>Forge v1 requires exactly 5 signed screenshots, 1 logo and 1 MP4 preview.</li>
            <li>Published versions are immutable and can coexist side-by-side.</li>
            <li>Normal BYTS apps do not receive arbitrary kernel memory or unrestricted I/O.</li>
          </ul>
        </Section>

        <Section id="publishing" eyebrow="SHIP IT" title="Pre-publish checklist">
          <div className="publish-checks">
            <label><input type="checkbox" readOnly /> packageId is stable and unique</label>
            <label><input type="checkbox" readOnly /> version is valid semantic versioning</label>
            <label><input type="checkbox" readOnly /> full/short names and descriptions are complete</label>
            <label><input type="checkbox" readOnly /> permissions match the opcodes the app actually uses</label>
            <label><input type="checkbox" readOnly /> stateSlots covers every referenced state slot</label>
            <label><input type="checkbox" readOnly /> BY5 source passes glyph/checksum verification</label>
            <label><input type="checkbox" readOnly /> logo is a real PNG/JPEG/WebP under 8 MiB</label>
            <label><input type="checkbox" readOnly /> exactly 5 valid screenshots are supplied</label>
            <label><input type="checkbox" readOnly /> preview is a valid MP4 under 64 MiB</label>
            <label><input type="checkbox" readOnly /> signed-in School-GIT publisher session is active</label>
          </div>
          <Callout tone="good" title="Then let Forge do the generated work">Header generation, publisher keys, media digests, package digest, Ed25519 signature and the final .BYTS are Forge's job—not the developer's upload burden.</Callout>
          <div className="final-cta"><a href="https://school-git.packarcade.win/cdn/cmoble/byts-forge" target="_blank" rel="noreferrer">OPEN BYTS FORGE</a><button onClick={() => jump('welcome')}>BACK TO TOP ↑</button></div>
        </Section>

        <footer><b>CMOB*LE OS Developer Documentation</b><span>BYTS v1 · BY5 ABI 1 · BVM1</span><small>Documentation describes the public app-development contract. Private implementation details are intentionally not included.</small></footer>
      </main>
    </div>
  );
}
