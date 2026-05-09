// personas.jsx — Intelliden persona profile cards (3 mandatory roles)
// Owner · Co-resident · Guest. Each card is a self-contained 420×640
// dossier that mirrors the same visual language as the dashboards.

const PERSONAS = [
  {
    id: 'owner',
    role: 'Owner',
    name: 'June Reyes',
    mono: 'JR',
    tint: 'oklch(0.74 0.14 65)',
    here: true,
    bio: 'Set up the home in 2023. Holds the deed, the wifi password, and the blame.',
    permissions: 'full · admin',
    color: 'amber',
    capabilities: [
      { k: 'Devices',    v: 'add · remove · rename · firmware', on: true },
      { k: 'Automations',v: 'create · edit · delete',           on: true },
      { k: 'Members',    v: 'invite · revoke · change role',    on: true },
      { k: 'Cameras',    v: 'view · review · share clips',      on: true },
      { k: 'Locks',      v: 'all doors · permanent codes',      on: true },
      { k: 'Energy',     v: 'set budgets · receive reports',    on: true },
    ],
    presence: '— at home now, Studio',
    devices: 32,
    routinesOwned: 14,
    activity: [
      { t: '2m',  what: 'edited "Focus" scene → Studio sconces' },
      { t: '38m', what: 'set Focus scene · all rooms' },
      { t: '6h',  what: 'paired Sonos Five (Living Room)' },
    ],
    quote: '"Anyone who lives here should feel like the place runs itself, but I want the seams when I look for them."',
    accessGlyph: 'check',
    badge: '01 / 03',
  },
  {
    id: 'coresident',
    role: 'Co-resident',
    name: 'Theo Marek',
    mono: 'TM',
    tint: 'oklch(0.66 0.05 220)',
    here: true,
    bio: 'Moved in last spring. Cooks every other night, runs early, can\'t stand the kitchen pendants above 60%.',
    permissions: 'shared · private rooms',
    color: 'sage',
    capabilities: [
      { k: 'Devices',    v: 'control · rename in own rooms',    on: true },
      { k: 'Automations',v: 'create personal · suggest shared', on: true },
      { k: 'Members',    v: 'view roster only',                 on: false },
      { k: 'Cameras',    v: 'view live · no clip download',     on: 'limited' },
      { k: 'Locks',      v: 'front + side · own bedroom',       on: 'limited' },
      { k: 'Energy',     v: 'see own draw · monthly recap',     on: true },
    ],
    presence: '— at home now, Bedroom',
    devices: 11,
    routinesOwned: 5,
    activity: [
      { t: '14m', what: 'asked Intelliden to keep blinds half-open after 19:00' },
      { t: '1h',  what: 'turned on Floor lamp · Living Room' },
      { t: '3h',  what: 'started Morning Run routine (06:14)' },
    ],
    quote: '"My bedroom is mine. The kitchen, the lamp by the couch, the front door — those are ours together."',
    accessGlyph: 'half',
    badge: '02 / 03',
  },
  {
    id: 'guest',
    role: 'Guest',
    name: 'Marcus Reyes',
    mono: 'MR',
    tint: 'oklch(0.78 0.10 30)',
    here: false,
    bio: 'June\'s brother. In town this weekend, sleeps on the studio futon. Access expires Sunday 18:00.',
    permissions: 'temporary · scoped',
    color: 'rust',
    capabilities: [
      { k: 'Devices',    v: 'guest tile only · 6 things',       on: 'limited' },
      { k: 'Automations',v: 'use Wake & Wind down · view-only', on: 'limited' },
      { k: 'Members',    v: 'no access',                        on: false },
      { k: 'Cameras',    v: 'no access · masked from owners',   on: false },
      { k: 'Locks',      v: 'front door · 7-day pin',           on: 'limited' },
      { k: 'Energy',     v: 'no access',                        on: false },
    ],
    presence: '— away, returns 17:40',
    devices: 6,
    routinesOwned: 0,
    activity: [
      { t: '19m', what: 'unlocked Front door (pin · 4-digit)' },
      { t: '4h',  what: 'left home (geofence · 200m)' },
      { t: 'yest', what: 'received invite from June · accepted' },
    ],
    quote: '"I just want to come in, find the towel, and not break their thermostat."',
    accessGlyph: 'clock',
    badge: '03 / 03',
  },
];

function PersonaCard({ p, pal }) {
  const surface = pal.surface, surface2 = pal.surface2, line = pal.line, ink = pal.ink, muted = pal.muted;

  const dotFor = (v) => ({
    background: v === true ? 'oklch(0.66 0.14 150)' : v === 'limited' ? pal.warm : 'oklch(0.62 0.018 30)',
    opacity: v === false ? 0.45 : 1,
  });

  return (
    <div style={{
      width: '100%', height: '100%', background: pal.bg, color: ink,
      fontFamily: '"Geist", -apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased', display: 'flex', flexDirection: 'column',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* badge corner */}
      <div style={{ position: 'absolute', top: 24, right: 24,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: muted }}>
        {p.badge}
      </div>

      {/* identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: p.tint, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 600, fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          letterSpacing: '0.04em',
          boxShadow: `0 0 0 4px ${pal.bg}, 0 0 0 5px ${p.tint}33` }}>
          {p.mono}
        </div>
        <div>
          <div style={{ fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: muted,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{p.role} · {p.permissions}</div>
        </div>
      </div>

      <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 44, lineHeight: 1, letterSpacing: -0.4, marginTop: 6 }}>
        {p.name}.
      </div>
      <div style={{ fontSize: 12.5, color: muted, marginTop: 6, fontStyle: 'italic',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
        <span style={{ color: p.here ? 'oklch(0.66 0.14 150)' : 'oklch(0.62 0.018 30)' }}>●</span> {p.presence}
      </div>

      <p style={{ fontSize: 13.5, lineHeight: 1.5, color: ink, marginTop: 14, marginBottom: 0,
        textWrap: 'pretty' }}>{p.bio}</p>

      {/* stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0,
        marginTop: 18, padding: '14px 0', borderTop: `0.5px solid ${line}`, borderBottom: `0.5px solid ${line}` }}>
        <Stat2 pal={pal} label="controls" value={p.devices} unit="devices"/>
        <Stat2 pal={pal} label="routines" value={p.routinesOwned} unit="owned"/>
        <Stat2 pal={pal} label="role" value={p.color} unit={p.permissions.split(' · ')[0]}/>
      </div>

      {/* capabilities */}
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: muted,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginBottom: 8 }}>Capabilities</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {p.capabilities.map((c, i) => (
            <div key={c.k} style={{ display: 'flex', alignItems: 'baseline', gap: 10,
              padding: '7px 0', borderTop: i ? `0.5px solid ${line}` : 'none' }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, marginTop: 5, ...dotFor(c.on) }}/>
              <div style={{ width: 92, fontSize: 12, fontWeight: 500 }}>{c.k}</div>
              <div style={{ flex: 1, fontSize: 11.5, color: muted,
                fontFamily: '"JetBrains Mono", ui-monospace, monospace', textWrap: 'pretty' }}>{c.v}</div>
              <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase',
                color: c.on === true ? 'oklch(0.66 0.14 150)' : c.on === 'limited' ? pal.warm : muted,
                fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
                {c.on === true ? 'allow' : c.on === 'limited' ? 'scoped' : 'deny'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* recent */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: muted,
          fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginBottom: 6 }}>Recent</div>
        {p.activity.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12, padding: '4px 0', color: ink }}>
            <span style={{ width: 36, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{a.t}</span>
            <span style={{ flex: 1, textWrap: 'pretty' }}>{a.what}</span>
          </div>
        ))}
      </div>

      {/* quote */}
      <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: `0.5px solid ${line}` }}>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontStyle: 'italic',
          fontSize: 17, lineHeight: 1.35, color: ink, textWrap: 'pretty' }}>
          {p.quote}
        </div>
      </div>
    </div>
  );
}

function Stat2({ pal, label, value, unit }) {
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: pal.muted,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{label}</div>
      <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 30, lineHeight: 1, marginTop: 4, letterSpacing: -0.2 }}>{value}</div>
      <div style={{ fontSize: 10.5, color: pal.muted, marginTop: 2,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{unit}</div>
    </div>
  );
}

Object.assign(window, { PERSONAS, PersonaCard });
