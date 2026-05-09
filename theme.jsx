// theme.jsx — Intelliden design system + shared data
// Palette, typography, time-of-day, household, devices, scenes, permissions.

const TOD = {
  dawn:    { label: '06:42 · Dawn',    sky: 'oklch(0.92 0.04 60)',  paper: 'oklch(0.95 0.03 65)', ink: 'oklch(0.22 0.02 40)',  warm: 'oklch(0.78 0.12 50)',  cool: 'oklch(0.72 0.06 230)', tint: 'oklch(0.86 0.06 55)' },
  day:     { label: '13:08 · Daylight',sky: 'oklch(0.97 0.01 90)',  paper: 'oklch(0.96 0.014 80)', ink: 'oklch(0.18 0.018 250)', warm: 'oklch(0.74 0.14 65)', cool: 'oklch(0.66 0.05 220)', tint: 'oklch(0.94 0.02 80)' },
  dusk:    { label: '19:24 · Dusk',    sky: 'oklch(0.72 0.10 40)',  paper: 'oklch(0.93 0.04 50)', ink: 'oklch(0.22 0.03 30)',  warm: 'oklch(0.72 0.16 40)', cool: 'oklch(0.55 0.10 280)', tint: 'oklch(0.84 0.08 45)' },
  night:   { label: '23:56 · Night',   sky: 'oklch(0.18 0.02 260)', paper: 'oklch(0.16 0.018 260)', ink: 'oklch(0.94 0.01 90)',  warm: 'oklch(0.72 0.14 70)', cool: 'oklch(0.62 0.10 240)', tint: 'oklch(0.22 0.02 260)' },
};

function getPalette(themeMode, time) {
  const t = TOD[time] || TOD.day;
  if (themeMode === 'dark' || time === 'night') {
    return {
      bg: time === 'night' ? t.sky : 'oklch(0.16 0.018 260)',
      surface: time === 'night' ? 'oklch(0.21 0.02 260)' : 'oklch(0.20 0.02 260)',
      surface2: 'oklch(0.24 0.02 260)',
      ink: 'oklch(0.96 0.01 90)',
      muted: 'oklch(0.70 0.015 90)',
      faint: 'oklch(0.42 0.02 260)',
      line: 'oklch(0.30 0.02 260)',
      warm: t.warm, cool: t.cool, tint: t.tint, paper: 'oklch(0.20 0.02 260)',
      mode: 'dark', time, todLabel: t.label,
    };
  }
  return {
    bg: t.sky, surface: t.paper, surface2: 'oklch(0.99 0.005 80)',
    ink: t.ink, muted: 'oklch(0.42 0.018 250)', faint: 'oklch(0.72 0.012 80)', line: 'oklch(0.86 0.014 80)',
    warm: t.warm, cool: t.cool, tint: t.tint, paper: t.paper,
    mode: 'light', time, todLabel: t.label,
  };
}

// ─────────────────────────────────────────────────────────────
// Personas. Three roles, each with a distinct permissions surface.
// ─────────────────────────────────────────────────────────────
const HOUSEHOLDS = {
  owner: {
    home: 'Sycamore Loft',
    address: 'Apt 3·204 · two adults, one cat',
    badge: 'Owner · full access',
    members: [
      { id: 'june',   name: 'June',   role: 'Owner',   mono: 'JR', here: true,  tint: 'oklch(0.74 0.14 65)' },
      { id: 'theo',   name: 'Theo',   role: 'Partner', mono: 'TH', here: true,  tint: 'oklch(0.66 0.05 220)' },
      { id: 'marcus', name: 'Marcus', role: 'Family',  mono: 'MA', here: false, tint: 'oklch(0.66 0.05 150)' },
      { id: 'olive',  name: 'Olive',  role: 'Cat·tag', mono: 'OL', here: true,  tint: 'oklch(0.78 0.10 30)' },
    ],
  },
  family: {
    home: 'Sycamore Loft',
    address: 'You are signed in as a Family member',
    badge: 'Family · most controls',
    members: [
      { id: 'june',   name: 'June',   role: 'Owner',   mono: 'JR', here: true,  tint: 'oklch(0.74 0.14 65)' },
      { id: 'theo',   name: 'Theo',   role: 'Partner', mono: 'TH', here: true,  tint: 'oklch(0.66 0.05 220)' },
      { id: 'marcus', name: 'You',    role: 'Family',  mono: 'MA', here: true,  tint: 'oklch(0.66 0.05 150)' },
      { id: 'olive',  name: 'Olive',  role: 'Cat·tag', mono: 'OL', here: true,  tint: 'oklch(0.78 0.10 30)' },
    ],
  },
  guest: {
    home: 'Sycamore Loft',
    address: 'Visiting · access expires in 2h 14m',
    badge: 'Guest · limited',
    members: [
      // The guest only sees themselves and the inviter.
      { id: 'kira',  name: 'Kira (you)', role: 'Guest',   mono: 'KR', here: true,  tint: 'oklch(0.72 0.10 280)' },
      { id: 'june',  name: 'June',       role: 'Inviter', mono: 'JR', here: true,  tint: 'oklch(0.74 0.14 65)' },
    ],
  },
};

// What each persona can do. Dashboards read this to gate / hide / lock UI.
// allowedRooms / allowedScenes: empty array means "no restriction".
const PERMS = {
  owner: {
    label: 'Owner', tone: 'oklch(0.74 0.14 65)',
    energy: true, members: true, cameras: true, addDevice: true,
    routines: true, lock: true, thermostat: true, blinds: true,
    speakerHandoff: true, sceneAll: true,
    allowedRooms: [], allowedScenes: [],
    blockedScenes: [],
    statement: 'Everything in this home reports to you.',
  },
  family: {
    label: 'Family', tone: 'oklch(0.66 0.05 150)',
    energy: true, members: true, cameras: true, addDevice: false,
    routines: false, lock: true, thermostat: true, blinds: true,
    speakerHandoff: true, sceneAll: true,
    allowedRooms: [], allowedScenes: [],
    blockedScenes: ['away'],
    statement: 'You can run the home — June still owns automations & new devices.',
  },
  guest: {
    label: 'Guest', tone: 'oklch(0.66 0.10 280)',
    energy: false, members: false, cameras: false, addDevice: false,
    routines: false, lock: false, thermostat: false, blinds: true,
    speakerHandoff: false, sceneAll: false,
    allowedRooms: ['living', 'kitchen'],
    allowedScenes: ['focus', 'meal', 'wind'],
    blockedScenes: ['wake', 'movie', 'away'],
    statement: 'June shared two rooms and three scenes with you. Access expires in 2h.',
  },
};

const ROOMS = [
  { id: 'living',  name: 'Living Room', area: 38, devices: 9,  primary: 'Floor lamp',     temp: 21.4 },
  { id: 'kitchen', name: 'Kitchen',     area: 18, devices: 6,  primary: 'Pendants',       temp: 22.1 },
  { id: 'bed',     name: 'Bedroom',     area: 22, devices: 5,  primary: 'Bedside',        temp: 19.8 },
  { id: 'studio',  name: 'Studio',      area: 14, devices: 7,  primary: 'Desk array',     temp: 21.0 },
  { id: 'garden',  name: 'Garden',      area: 56, devices: 4,  primary: 'Path lights',    temp: 12.6 },
];

const SCENES = [
  { id: 'wake',  name: 'Wake',     glyph: 'sun',     trigger: 'sunrise + 12m'   },
  { id: 'focus', name: 'Focus',    glyph: 'square',  trigger: 'manual · cmd-F'  },
  { id: 'meal',  name: 'Mealtime', glyph: 'circle',  trigger: 'kitchen presence'},
  { id: 'wind',  name: 'Wind down',glyph: 'moon',    trigger: '21:30 weeknights'},
  { id: 'movie', name: 'Cinema',   glyph: 'tri',     trigger: 'TV → ON'         },
  { id: 'away',  name: 'Away',     glyph: 'plus',    trigger: 'all phones ←'    },
];

const RECENT_BASE = [
  { who: 'Theo',   what: 'turned on Floor lamp',        where: 'Living Room', t: '2m',  scope: 'shared' },
  { who: 'Auto',   what: 'closed blinds (sun > 60°)',   where: 'Studio',      t: '14m', scope: 'private' },
  { who: 'June',   what: 'set Focus scene',             where: 'Studio',      t: '38m', scope: 'private' },
  { who: 'Olive',  what: 'crossed garden gate',         where: 'Garden',      t: '1h',  scope: 'private' },
  { who: 'System', what: 'updated firmware · 3 devices',where: 'Kitchen',     t: '4h',  scope: 'shared' },
];

function recentFor(perm) {
  // Filter activity by perm so guest doesn't see private rooms.
  const allowedRooms = perm.allowedRooms.length ? perm.allowedRooms : null;
  return RECENT_BASE.filter(r => {
    if (allowedRooms) {
      const room = ROOMS.find(x => x.name === r.where);
      if (!room || !allowedRooms.includes(room.id)) return false;
    }
    return true;
  });
}

const ENERGY = {
  todayKwh: 7.42, yesterdayKwh: 9.18, monthBudget: 240, monthSoFar: 161.3,
  hourly: [0.18,0.16,0.14,0.13,0.12,0.14,0.22,0.34,0.41,0.38,0.33,0.31,0.36,0.29,0.27,0.26,0.31,0.38,0.46,0.52,0.49,0.40,0.30,0.22],
};

// Selectors that respect persona perms — used by every surface.
function visibleRooms(perm) {
  return perm.allowedRooms.length ? ROOMS.filter(r => perm.allowedRooms.includes(r.id)) : ROOMS;
}
function visibleScenes(perm) {
  if (perm.allowedScenes.length) return SCENES.filter(s => perm.allowedScenes.includes(s.id));
  return SCENES.filter(s => !perm.blockedScenes.includes(s.id));
}

// ─────────────────────────────────────────────────────────────
// Glyphs
// ─────────────────────────────────────────────────────────────
function Glyph({ name, size = 18, stroke = 'currentColor', sw = 1.4 }) {
  const props = { width: size, height: size, viewBox: '0 0 18 18', fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'sun':    return (<svg {...props}><circle cx="9" cy="9" r="3"/><path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.2 3.2l1.4 1.4M13.4 13.4l1.4 1.4M3.2 14.8l1.4-1.4M13.4 4.6l1.4-1.4"/></svg>);
    case 'moon':   return (<svg {...props}><path d="M14.5 11A6 6 0 1 1 7 3.5 5 5 0 0 0 14.5 11z"/></svg>);
    case 'square': return (<svg {...props}><rect x="3" y="3" width="12" height="12" rx="1.5"/></svg>);
    case 'circle': return (<svg {...props}><circle cx="9" cy="9" r="6"/></svg>);
    case 'tri':    return (<svg {...props}><path d="M9 3l6 11H3z"/></svg>);
    case 'plus':   return (<svg {...props}><path d="M9 3v12M3 9h12"/></svg>);
    case 'lamp':   return (<svg {...props}><path d="M5 7l4-4 4 4-4 4z"/><path d="M9 11v4M6 16h6"/></svg>);
    case 'bulb':   return (<svg {...props}><path d="M6 12a4 4 0 1 1 6 0c-.6.6-.8 1-.8 1.6V14H6.8v-.4c0-.6-.2-1-.8-1.6z"/><path d="M7.5 16h3"/></svg>);
    case 'therm':  return (<svg {...props}><path d="M9 2a2 2 0 0 0-2 2v7.2a3 3 0 1 0 4 0V4a2 2 0 0 0-2-2z"/><circle cx="9" cy="13.5" r="1.2"/></svg>);
    case 'blind':  return (<svg {...props}><rect x="3" y="3" width="12" height="12" rx="1"/><path d="M3 7h12M3 11h12"/></svg>);
    case 'lock':   return (<svg {...props}><rect x="3.5" y="8" width="11" height="7" rx="1.2"/><path d="M6 8V6a3 3 0 0 1 6 0v2"/></svg>);
    case 'unlock': return (<svg {...props}><rect x="3.5" y="8" width="11" height="7" rx="1.2"/><path d="M6 8V6a3 3 0 0 1 5.4-1.8"/></svg>);
    case 'cam':    return (<svg {...props}><rect x="2" y="5" width="11" height="8" rx="1.5"/><path d="M13 8l3-2v6l-3-2z"/></svg>);
    case 'speak':  return (<svg {...props}><rect x="5" y="2.5" width="8" height="13" rx="1.5"/><circle cx="9" cy="11" r="2"/><circle cx="9" cy="6" r=".6"/></svg>);
    case 'plug':   return (<svg {...props}><path d="M7 3v3M11 3v3"/><rect x="5" y="6" width="8" height="5" rx="1.2"/><path d="M9 11v4"/></svg>);
    case 'wifi':   return (<svg {...props}><path d="M2 7a11 11 0 0 1 14 0M4.5 9.5a7 7 0 0 1 9 0M7 12a3 3 0 0 1 4 0"/><circle cx="9" cy="14.5" r=".8" fill="currentColor"/></svg>);
    case 'play':   return (<svg {...props}><path d="M5 3.5v11l9-5.5z"/></svg>);
    case 'pause':  return (<svg {...props}><rect x="5" y="3.5" width="3" height="11" rx="0.6"/><rect x="10" y="3.5" width="3" height="11" rx="0.6"/></svg>);
    case 'gear':   return (<svg {...props}><circle cx="9" cy="9" r="2.5"/><path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.6 3.6l1.4 1.4M13 13l1.4 1.4M3.6 14.4l1.4-1.4M13 5l1.4-1.4"/></svg>);
    case 'home':   return (<svg {...props}><path d="M2.5 8L9 3l6.5 5v7H2.5z"/><path d="M7 15v-4h4v4"/></svg>);
    case 'plus2':  return (<svg {...props}><path d="M9 4v10M4 9h10"/></svg>);
    case 'minus':  return (<svg {...props}><path d="M4 9h10"/></svg>);
    case 'wave':   return (<svg {...props}><path d="M2 9c1.5-2 3-2 4.5 0S9.5 11 11 9s3-2 4.5 0"/></svg>);
    case 'mic':    return (<svg {...props}><rect x="6.8" y="2.5" width="4.4" height="8" rx="2.2"/><path d="M4.5 9.5a4.5 4.5 0 0 0 9 0M9 14v2"/></svg>);
    case 'arrow':  return (<svg {...props}><path d="M4 9h10M10 5l4 4-4 4"/></svg>);
    case 'check':  return (<svg {...props}><path d="M3.5 9.5l3.5 3.5 7.5-8"/></svg>);
    case 'dot':    return (<svg {...props}><circle cx="9" cy="9" r="2" fill="currentColor"/></svg>);
    case 'eye':    return (<svg {...props}><path d="M1.5 9C3.5 5 6 3.5 9 3.5S14.5 5 16.5 9C14.5 13 12 14.5 9 14.5S3.5 13 1.5 9z"/><circle cx="9" cy="9" r="2"/></svg>);
    case 'eyeoff': return (<svg {...props}><path d="M2 2l14 14M3 7c-.5.6-1 1.3-1.5 2C3.5 13 6 14.5 9 14.5c1.4 0 2.7-.3 3.8-.8M7 4c.6-.3 1.3-.5 2-.5 3 0 5.5 1.5 7.5 5.5-.4.8-.9 1.5-1.4 2"/></svg>);
    case 'hand':   return (<svg {...props}><path d="M6 11V5a1 1 0 1 1 2 0v3M8 8V3.5a1 1 0 1 1 2 0V8M10 8V4.5a1 1 0 1 1 2 0V10M12 7a1 1 0 1 1 2 0v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-3l-1-3 1.5-.5L6 11"/></svg>);
    case 'pin':    return (<svg {...props}><path d="M9 2v6M5 8l4 4 4-4M9 12v4"/></svg>);
    case 'ban':    return (<svg {...props}><circle cx="9" cy="9" r="6"/><path d="M4.8 4.8l8.4 8.4"/></svg>);
    case 'crown':  return (<svg {...props}><path d="M2 12l1-7 4 3 2-5 2 5 4-3 1 7z"/><path d="M2 14h14"/></svg>);
    default: return null;
  }
}

function sparkPath(values, w, h, pad = 2) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const r = max - min || 1;
  const dx = (w - pad * 2) / (values.length - 1);
  return values.map((v, i) => {
    const x = pad + i * dx;
    const y = h - pad - ((v - min) / r) * (h - pad * 2);
    return (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2);
  }).join(' ');
}

// Toast hook — surface-level "scene set", "blocked", "device toggled" feedback.
function useToast() {
  const [toast, setToast] = React.useState(null);
  const show = React.useCallback((msg, kind='ok') => {
    setToast({ msg, kind, key: Date.now() });
  }, []);
  React.useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(id);
  }, [toast]);
  return [toast, show];
}

function Toast({ toast, pal }) {
  if (!toast) return null;
  const isBlocked = toast.kind === 'blocked';
  return (
    <div style={{
      position: 'absolute', left: '50%', bottom: 88, transform: 'translateX(-50%)', zIndex: 80,
      background: isBlocked ? 'oklch(0.32 0.16 25)' : pal.ink,
      color: isBlocked ? '#fff' : pal.bg,
      borderRadius: 100, padding: '10px 16px',
      fontSize: 12.5, fontWeight: 500, fontFamily: '"Geist", sans-serif',
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      animation: 'twk-toast .25s cubic-bezier(.2,.7,.3,1)',
    }}>
      <Glyph name={isBlocked ? 'ban' : 'check'} size={13} stroke="currentColor" sw={1.8}/>
      {toast.msg}
    </div>
  );
}

if (typeof document !== 'undefined' && !document.getElementById('intelliden-anim')) {
  const s = document.createElement('style');
  s.id = 'intelliden-anim';
  s.textContent = `
    @keyframes twk-toast { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
    @keyframes int-pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
    @keyframes int-press { 0%{transform:scale(1)} 50%{transform:scale(.96)} 100%{transform:scale(1)} }
    .int-press:active { animation: int-press .25s cubic-bezier(.3,.7,.4,1); }
    .int-fadein { animation: twk-toast .3s cubic-bezier(.2,.7,.3,1); }
  `;
  document.head.appendChild(s);
}

Object.assign(window, {
  TOD, getPalette, HOUSEHOLDS, PERMS, ROOMS, SCENES, RECENT_BASE, recentFor, ENERGY,
  visibleRooms, visibleScenes, Glyph, sparkPath, useToast, Toast,
});
