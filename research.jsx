// research.jsx — Intelliden research dossier
// Three tactics, each rendered as a self-contained dossier card sharing the
// editorial language of the rest of the system: Instrument Serif headlines,
// Geist body, JetBrains Mono for metadata, ink-on-paper at every theme.

const RESEARCH = [
  {
    id: 'interviews',
    no: 'R-01',
    tactic: 'User interviews',
    method: '12 × 45-min, in-home, semi-structured',
    duration: '3 weeks · Mar–Apr 2026',
    sample: 'n=12 · 4 owners · 5 co-residents · 3 frequent guests',
    leadQ: 'Walk me through the last time the home did something you didn\'t ask it to.',
    findings: [
      { tag: 'F1', n: '11 / 12', insight: 'Mentioned a moment of "spooky" automation — a shared scene firing while one person was alone.' },
      { tag: 'F2', n: '8 / 12',  insight: 'Co-residents wanted private rooms but shared common areas, not a single shared layer.' },
      { tag: 'F3', n: '9 / 12',  insight: 'Guests wanted explicit time-bound access; no one wanted "permanent guest" as a role.' },
      { tag: 'F4', n: '6 / 12',  insight: 'AR/voice was preferred for ambient adjustments; phone reserved for setup and audits.' },
    ],
    quote: '"I love that it locks itself, I hate that I can\'t see who else just unlocked it."',
    quoteWho: 'P-07 · co-resident, 31',
    decisions: [
      'Three mandatory roles, scoped by room — not a flat ACL.',
      'Every automation shows the human or rule that triggered it.',
      'Guest access is always time-boxed; no permanent guest role.',
    ],
  },
  {
    id: 'competitive',
    no: 'R-02',
    tactic: 'Competitor analysis',
    method: 'Heuristic + task-based audit, 5 ecosystems',
    duration: '2 weeks · Apr 2026',
    sample: 'Apple Home · Google Home · SmartThings · Home Assistant · Hubitat',
    leadQ: 'Where does multi-resident control break down across the leading ecosystems?',
    findings: [
      { tag: 'C1', n: '5 / 5',   insight: 'All ship a "household" concept; only 2 distinguish co-residents from guests.' },
      { tag: 'C2', n: '4 / 5',   insight: 'Camera privacy on a per-member basis is missing or buried 4+ taps deep.' },
      { tag: 'C3', n: '5 / 5',   insight: 'No surface shows who triggered an automation in the activity log.' },
      { tag: 'C4', n: '1 / 5',   insight: 'Only one offers a true cross-surface (phone+watch+AR) parity for scenes.' },
    ],
    quote: '"Households are an afterthought everywhere. Permissions feel grafted on, not designed in."',
    quoteWho: 'audit synthesis · April 18',
    decisions: [
      'Treat co-op as the primary mode, not a feature flag.',
      'Surface attribution ("Theo turned on…") in every activity feed by default.',
      'Ship parity: any scene that exists on phone exists on watch and AR.',
    ],
  },
  {
    id: 'observational',
    no: 'R-03',
    tactic: 'Observational research',
    method: 'Diary study + in-situ shadowing',
    duration: '4 weeks · Mar–Apr 2026',
    sample: '6 households · 142 logged events · 11 hours of co-presence shadowing',
    leadQ: 'When does friction actually show up — and is it where users say it is?',
    findings: [
      { tag: 'O1', n: '38 / 142', insight: 'Friction events clustered at handoffs: someone arrived/left mid-routine.' },
      { tag: 'O2', n: '24 / 142', insight: 'Lighting overrides were re-overridden within 90s — the system "won" briefly.' },
      { tag: 'O3', n: '17 / 142', insight: 'AR pinned panels were ignored when reticle was further than 35° off-center.' },
      { tag: 'O4', n: '9 / 142',  insight: 'Watch was reached for during cooking, never on the couch.' },
    ],
    quote: '"They told me they "set it and forget it" — the diary said they corrected it 4× a day."',
    quoteWho: 'field note · household H-3',
    decisions: [
      'Routines pause for 15s on presence change, then resume — not silent override.',
      'Anchor AR panels within 35° of the user\'s gaze; relocate when they wander.',
      'Watch UI optimized for hands-busy moments (kitchen, cleaning); de-emphasize at rest.',
    ],
  },
];

function ResearchCard({ r, pal }) {
  const ink = pal.ink, muted = pal.muted, line = pal.line;
  return (
    <div style={{
      width: '100%', height: '100%', background: pal.bg, color: ink,
      fontFamily: '"Geist", -apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased', display: 'flex', flexDirection: 'column',
      padding: 28, position: 'relative', overflow: 'hidden',
    }}>
      {/* corner: number + tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 10.5,
        letterSpacing: '.18em', textTransform: 'uppercase', color: muted }}>
        <span>{r.no} · research dossier</span>
        <span>{r.duration}</span>
      </div>

      <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: 4, background: pal.warm, transform: 'translateY(-4px)' }}/>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 52, lineHeight: 0.95, letterSpacing: -0.5 }}>
          {r.tactic}.
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
        padding: '14px 0', borderTop: `0.5px solid ${line}`, borderBottom: `0.5px solid ${line}` }}>
        <Meta pal={pal} k="Method" v={r.method}/>
        <Meta pal={pal} k="Sample" v={r.sample}/>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: muted,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>Lead question</div>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontStyle: 'italic',
          fontSize: 19, lineHeight: 1.3, marginTop: 6, textWrap: 'pretty' }}>
          {r.leadQ}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: muted,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginBottom: 8 }}>Findings</div>
        {r.findings.map((f, i) => (
          <div key={f.tag} style={{ display: 'grid', gridTemplateColumns: '36px 84px 1fr', gap: 10,
            padding: '8px 0', borderTop: i ? `0.5px solid ${line}` : 'none' }}>
            <span style={{ fontSize: 10.5, color: pal.warm, fontWeight: 600,
              fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{f.tag}</span>
            <span style={{ fontSize: 11, color: muted,
              fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{f.n}</span>
            <span style={{ fontSize: 12.5, lineHeight: 1.45, textWrap: 'pretty' }}>{f.insight}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: '14px 16px', background: pal.surface,
        border: `0.5px solid ${line}`, borderRadius: 12 }}>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontStyle: 'italic',
          fontSize: 17, lineHeight: 1.35, textWrap: 'pretty' }}>
          {r.quote}
        </div>
        <div style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase',
          color: muted, marginTop: 8,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{r.quoteWho}</div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: `0.5px solid ${line}` }}>
        <div style={{ fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: muted,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginBottom: 8 }}>
          Decisions it made for Intelliden
        </div>
        {r.decisions.map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '5px 0', fontSize: 12.5, lineHeight: 1.4 }}>
            <span style={{ color: pal.warm, fontWeight: 600, width: 18,
              fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>→</span>
            <span style={{ flex: 1, textWrap: 'pretty' }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Meta({ pal, k, v }) {
  return (
    <div style={{ paddingRight: 12 }}>
      <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: pal.muted,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{k}</div>
      <div style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.3, textWrap: 'pretty' }}>{v}</div>
    </div>
  );
}

Object.assign(window, { RESEARCH, ResearchCard });
