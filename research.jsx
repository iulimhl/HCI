// research.jsx — Intelliden research dossier
// Three tactics, each rendered as a self-contained dossier card sharing the
// editorial language of the rest of the system: Instrument Serif headlines,
// Geist body, JetBrains Mono for metadata, ink-on-paper at every theme.

const RESEARCH = [
  {
    id: 'interviews',
    no: 'R-01',
    tactic: 'User acceptance',
    method: 'Interviews & Internet Survey',
    duration: 'June–August 2014',
    sample: 'n=248 · 100 Europe · 148 Asia',
    leadQ: 'Are people already familiar with smart houses and willing to live in them?',
    findings: [
      { tag: 'F1', n: '76% / 64%', insight: 'Asian (76%) and European (64%) interviewees were familiar with smart homes.' },
      { tag: 'F2', n: '86% / 92%', insight: 'Survey respondents (86% Asian, 92% European) were willing to live in a smart home.' },
      { tag: 'F3', n: '42%',  insight: '42% of survey respondents think smart homes will become everyday life in 5-10 years.' },
      { tag: 'F4', n: '21%',  insight: '21% of Asian respondents felt it will happen in the near future.' },
    ],
    quote: '"App to control everything; automatic AC, lights, heating; sound control... refrigerators can order food automatically."',
    quoteWho: 'Interviewee describing smart homes',
    decisions: [
      'High willingness to adopt, but differences exist between Asian and European users.',
      'Acceptance is heavily based on what users currently think future smart homes will be like.',
      'A single application cannot be named the most popular across all demographics.',
    ],
  },
  {
    id: 'competitive',
    no: 'R-02',
    tactic: 'Competitor Analysis',
    method: 'Quantitative Survey + AHP Model',
    duration: 'March 2023',
    sample: 'n=1,518 · 12 brands · 17 products',
    leadQ: 'How do users evaluate brand, product, and marketing power from a long-term perspective?',
    findings: [
      { tag: 'M1', n: '11.2%', insight: 'Brand awareness (11.2%) and technical functions (13.9%) have high weight in competitiveness.' },
      { tag: 'M2', n: 'Top 3', insight: 'Xiaomi (81.8), Huawei (77.2), Midea (76.6) lead the total competitiveness scores.' },
      { tag: 'M3', n: '>30%', insight: 'Smart speakers, TVs, and ACs have highest penetration rates (>30%).' },
      { tag: 'M4', n: 'Low', insight: 'Price level perception currently yields the lowest user satisfaction score (48 points).' },
    ],
    quote: '"Hardware enterprises excel in brand power, product power, and marketing power, and are characterized as all-rounders."',
    quoteWho: 'Market Competitiveness Study',
    decisions: [
      'Prioritize technical function and utility value to build core product power.',
      'Focus initial development on mature scenarios like smart home appliances and security.',
      'Traditional and pendant enterprises must strengthen brand building to compete with hardware leaders.',
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
