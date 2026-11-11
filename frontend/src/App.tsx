import { FormEvent, useMemo, useState } from "react";

type Page = "overview" | "validate" | "mvp" | "customers" | "team" | "funding" | "finance" | "scale";
type Finance = { cash: number; revenue: number; expenses: number; oneoff: number };

const pages: { id: Page; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "▦" },
  { id: "validate", label: "Validate idea", icon: "⌕" },
  { id: "mvp", label: "Build MVP", icon: "◇" },
  { id: "customers", label: "First users", icon: "♙" },
  { id: "team", label: "Team & company", icon: "♧" },
  { id: "funding", label: "Govt. schemes", icon: "₹" },
  { id: "finance", label: "Cash & runway", icon: "↗" },
  { id: "scale", label: "Grow & scale", icon: "⌁" },
];

const formatMoney = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

function App() {
  const [page, setPage] = useState<Page>("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [interviews, setInterviews] = useState(12);
  const [users, setUsers] = useState(24);
  const [finance, setFinance] = useState<Finance>({ cash: 500000, revenue: 0, expenses: 50000, oneoff: 0 });
  const [toast, setToast] = useState("");

  const runway = useMemo(() => {
    const netBurn = finance.expenses - finance.revenue;
    const months = netBurn > 0 ? (finance.cash - finance.oneoff) / netBurn : Infinity;
    return { netBurn, months };
  }, [finance]);

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "open" : ""}`} aria-label="Primary navigation">
        <div className="brand">Founder<span>Path</span></div>
        <p className="subbrand">Your startup operating system</p>
        <nav className="nav">
          <p className="nav-label">Workspace</p>
          {pages.map((item) => (
            <button className={`nav-item ${page === item.id ? "active" : ""}`} key={item.id} onClick={() => navigate(item.id)}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="side-card"><strong>FounderPath Mentor</strong><small>Make your next move with clarity.</small><button className="button button-primary button-full" onClick={() => notify("Mentor mode is ready in the workspace")}>Ask AI mentor →</button></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="menu-button" aria-label="Open navigation" aria-expanded={mobileNav} onClick={() => setMobileNav(!mobileNav)}>☰</button>
          <div className="breadcrumb">Workspace / <strong>{pages.find((item) => item.id === page)?.label}</strong></div>
          <div className="user"><span className="muted small">Demo workspace</span><div className="avatar">FP</div></div>
        </header>
        <div className="content">
          {page === "overview" && <Overview navigate={navigate} interviews={interviews} finance={finance} runway={runway.months} />}
          {page === "validate" && <Validate interviews={interviews} setInterviews={setInterviews} notify={notify} />}
          {page === "mvp" && <Mvp />}
          {page === "customers" && <Customers users={users} setUsers={setUsers} notify={notify} />}
          {page === "team" && <ContentPage eyebrow="Stage 6 · Foundation" title="Set up the company thoughtfully" description="Make clear decisions on roles, ownership and compliance before they become expensive." cards={["Define the bottleneck", "Document agreements", "Choose the right structure"]} />}
          {page === "funding" && <Funding notify={notify} />}
          {page === "finance" && <FinancePage finance={finance} setFinance={setFinance} runway={runway} />}
          {page === "scale" && <ContentPage eyebrow="Stage 8 · Scale" title="Grow with healthy economics" description="Scale the parts of the business that are repeatable, measurable and profitable." cards={["Measure repeat use", "Test one channel", "Protect contribution margin"]} />}
        </div>
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function Overview({ navigate, interviews, finance, runway }: { navigate: (page: Page) => void; interviews: number; finance: Finance; runway: number }) {
  return <section className="page" aria-labelledby="overview-title">
    <div className="eyebrow">Founder workspace</div>
    <div className="page-heading"><div><h1 id="overview-title">Good morning, Founder 👋</h1><p className="muted">Your startup journey, in one place. Make your next move with clarity.</p></div><button className="button button-primary" onClick={() => navigate("validate")}>＋ Add startup idea</button></div>
    <div className="stats-grid">
      <Stat label="Startup readiness" value="62/100" detail="↑ 8 points this month" />
      <Stat label="Available cash" value={`₹${(finance.cash / 100000).toFixed(1)}L`} detail="Based on your current plan" />
      <Stat label="Estimated runway" value={Number.isFinite(runway) ? `${runway.toFixed(1)} months` : "Positive"} detail="At current net burn" />
      <Stat label="Customer interviews" value={String(interviews)} detail="Milestone achieved ✓" />
    </div>
    <div className="section-heading"><div><h2>Your startup journey</h2><p className="muted small">Move through milestones; revisit any stage whenever your startup needs it.</p></div><span className="badge badge-good">Stage 3 · MVP building</span></div>
    <div className="stage-grid">{[
      ["validate", "01 · COMPLETE", "Find & validate", "Problem evidence and market demand"],
      ["validate", "02 · COMPLETE", "Validate market", "Competition, pricing and demand"],
      ["mvp", "03 · IN PROGRESS", "Build the MVP", "Scope, roadmap and costs"],
      ["customers", "04 · NEXT", "First users", "Feedback and acquisition"],
      ["customers", "05 · READY", "Product-market fit", "Retention and repeat usage"],
      ["team", "06 · READY", "Team & company", "People, equity and compliance"],
      ["funding", "07 · READY", "Funding", "Scheme eligibility and readiness"],
      ["scale", "08 · FUTURE", "Grow & scale", "Unit economics and experiments"],
    ].map(([target, status, title, copy], index) => <button className={`stage ${index === 2 ? "active" : ""}`} key={title} onClick={() => navigate(target as Page)}><span>{status}</span><strong>{title}</strong><small>{copy}</small></button>)}</div>
    <div className="two-column dashboard-panels"><article className="card"><div className="section-heading compact"><h2>Priority actions</h2><span className="badge badge-warn">3 need attention</span></div>{[["Complete your MVP cost plan", "mvp"], ["Check government scheme eligibility", "funding"], ["Review monthly cash burn", "finance"]].map(([label, target]) => <div className="list-row" key={label}><div><strong>{label}</strong><small>Take the next measurable step.</small></div><button className="button button-secondary button-small" onClick={() => navigate(target as Page)}>Open</button></div>)}</article><article className="card"><h2>Founder mentor insight</h2><div className="callout">Your next constraint may be execution capacity, not idea quality. Keep the MVP narrow.</div></article></div>
  </section>;
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) { return <article className="card stat-card"><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="positive">{detail}</span></article>; }

function Validate({ interviews, setInterviews, notify }: { interviews: number; setInterviews: (value: number) => void; notify: (message: string) => void }) {
  const [result, setResult] = useState(""); const [note, setNote] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); setResult(`${data.get("who")} struggle with ${data.get("what")} because ${data.get("why")}`); };
  return <section className="page"><div className="eyebrow">Stage 1–2 · Discover & validate</div><h1>Validate the opportunity</h1><p className="muted intro">Build a case from customer evidence, market signals and competitor gaps—not an AI guess.</p><div className="two-column"><article className="card"><h2>Problem statement builder</h2><form onSubmit={submit}><label>Who experiences the problem?<input name="who" defaultValue="Small local retailers" required /></label><label>What do they struggle with?<input name="what" defaultValue="Tracking orders and repeat customers" required /></label><label>Why does this happen?<textarea name="why" defaultValue="They rely on notebooks and scattered messaging apps." rows={2} required /></label><button className="button button-primary">Generate problem statement</button></form>{result && <div className="callout result"><strong>Problem statement</strong><br />{result}</div>}</article><article className="card"><h2>Customer discovery tracker</h2><div className="metric-row"><div><strong className="stat-value">{interviews}</strong><small>Interviews logged</small></div><span className="badge badge-good">Milestone passed</span></div><div className="progress"><span style={{ width: "100%" }} /></div><form onSubmit={(event) => { event.preventDefault(); if (!note.trim()) return notify("Add an interview insight first"); setInterviews(interviews + 1); setNote(""); notify("Interview insight logged"); }}><label>Interview insight<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} placeholder="What did the customer say?" /></label><button className="button button-secondary">＋ Log interview insight</button></form></article></div><div className="section-heading"><h2>Market intelligence</h2></div><div className="three-column"><Signal title="Demand signal" value="Growing" width="76%" /><Signal title="Competition" value="Moderate" width="54%" warning /><Signal title="Pain evidence" value="Strong" width="75%" /></div></section>;
}

function Signal({ title, value, width, warning = false }: { title: string; value: string; width: string; warning?: boolean }) { return <article className="card signal"><span className={`badge ${warning ? "badge-warn" : "badge-good"}`}>{title}</span><strong>{value}</strong><p>Illustrative demo evidence; validate before making decisions.</p><div className="bar"><i style={{ width }} /></div></article>; }

function Mvp() { const [costs, setCosts] = useState([45000, 5000, 8000, 2000]); const monthly = costs.slice(1).reduce((sum, value) => sum + value, 0); return <section className="page"><div className="eyebrow">Stage 3 · Build</div><h1>Build a focused MVP</h1><p className="muted intro">Turn your strongest evidence into the smallest testable product.</p><div className="two-column"><article className="card"><h2>MVP scope planner</h2><label>What are you building?<input defaultValue="A lightweight order and customer tracker for local retailers" /></label><button className="button button-primary" onClick={() => alert("Keep the core workflow, onboarding and activity view. Defer advanced analytics.")}>Generate MVP scope</button></article><article className="card"><h2>Three-month cost plan</h2><div className="form-grid">{["Build cost (one-time)", "Tools / month", "Marketing / month", "Other / month"].map((label, index) => <label key={label}>{label}<input type="number" value={costs[index]} onChange={(event) => setCosts(costs.map((cost, i) => i === index ? Number(event.target.value) : cost))} /></label>)}</div><div className="mini-grid"><div><small>One-time</small><strong>{formatMoney(costs[0])}</strong></div><div><small>Monthly</small><strong>{formatMoney(monthly)}</strong></div><div><small>Three months</small><strong>{formatMoney(costs[0] + monthly * 3)}</strong></div></div></article></div></section>; }

function Customers({ users, setUsers, notify }: { users: number; setUsers: (value: number) => void; notify: (message: string) => void }) { const [name, setName] = useState(""); return <section className="page"><div className="eyebrow">Stage 4–5 · Learn</div><h1>Find your first users</h1><p className="muted intro">Track early adopters and turn feedback into product decisions.</p><div className="two-column"><article className="card"><h2>Add an early user</h2><form onSubmit={(event) => { event.preventDefault(); if (!name.trim()) return; setUsers(users + 1); setName(""); notify("Customer added"); }}><label>Name or identifier<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Retailer #25" required /></label><label>Acquisition channel<select><option>Referral</option><option>Direct outreach</option><option>Community</option></select></label><button className="button button-primary">＋ Add customer</button></form><div className="metric-row"><div><strong className="stat-value">{users}</strong><small>Early users</small></div><span className="badge badge-good">18 active this week</span></div></article><article className="card"><h2>Feedback loop</h2><p className="muted">Review repeated pain points weekly and prioritize the smallest change that can create a measurable improvement.</p><div className="callout">Tip: ask what workaround the customer uses today.</div></article></div></section>; }

function Funding({ notify }: { notify: (message: string) => void }) { return <section className="page"><div className="eyebrow">Stage 7 · Capital</div><h1>Explore government schemes</h1><p className="muted intro">Use your profile to create a shortlist, then verify every rule on the official portal.</p><article className="card"><div className="form-grid"><label>State<select><option>Karnataka</option><option>Maharashtra</option><option>Telangana</option></select></label><label>Sector<select><option>Technology</option><option>Retail</option><option>Manufacturing</option></select></label><label>Stage<select><option>Idea</option><option>MVP</option><option>Early revenue</option></select></label><label>Registered?<select><option>Not yet</option><option>Yes</option></select></label></div><button className="button button-primary" onClick={() => notify("Profile matched against demo catalogue")}>Find matching routes</button><div className="callout result">No automated eligibility claim is made. Verify current programme rules on official portals.</div></article></section>; }

function FinancePage({ finance, setFinance, runway }: { finance: Finance; setFinance: (value: Finance) => void; runway: { netBurn: number; months: number } }) { return <section className="page"><div className="eyebrow">Finance cockpit</div><h1>Understand your cash runway</h1><p className="muted intro">Use conservative assumptions to decide what you can afford next.</p><article className="card"><h2>Monthly assumptions</h2><div className="form-grid">{(Object.keys(finance) as (keyof Finance)[]).map((key) => <label key={key}>{key === "oneoff" ? "One-time spend" : key[0].toUpperCase() + key.slice(1)}<input type="number" value={finance[key]} onChange={(event) => setFinance({ ...finance, [key]: Number(event.target.value) })} /></label>)}</div><div className="mini-grid"><div><small>Net burn</small><strong>{formatMoney(runway.netBurn)}</strong></div><div><small>Runway</small><strong>{Number.isFinite(runway.months) ? `${runway.months.toFixed(1)} months` : "Positive"}</strong></div><div><small>Cash after one-time</small><strong>{formatMoney(finance.cash - finance.oneoff)}</strong></div></div><div className="callout warning result">{runway.months < 6 ? "Warning: runway is below 6 months." : "Plan milestones and funding needs early; revisit projections monthly."}</div></article></section>; }

function ContentPage({ eyebrow, title, description, cards }: { eyebrow: string; title: string; description: string; cards: string[] }) { return <section className="page"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="muted intro">{description}</p><div className="three-column">{cards.map((card, index) => <article className="card" key={card}><span className={`badge ${index === 1 ? "badge-warn" : "badge-good"}`}>{index === 1 ? "Focus" : "Ready"}</span><h2>{card}</h2><p className="muted">Make this decision explicit, measurable and review it every week.</p></article>)}</div></section>; }

export default App;
