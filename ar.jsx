// ar.jsx — Intelliden AR spatial view with persona gating + interactivity.

const AR_ROOM_LABELS = {
  living: 'The Living Room',
  kitchen: 'The Kitchen',
  bed: 'The Bedroom',
  studio: 'The Studio',
  garden: 'The Garden',
};

const ROOM_GADGETS = {
  living:  ['lamp', 'sconces', 'strip', 'blinds', 'speaker', 'cam', 'air', 'door', 'energy', 'plug'],
  kitchen: ['therm', 'plug', 'air'],
  bed:     ['lamp', 'blinds', 'speaker'],
  studio:  ['lamp', 'plug'],
  garden:  ['cam', 'plug', 'air'],
};

const ROOM_DEFAULT_PANELS = {
  living:  ['lamp', 'blinds', 'speaker', 'cam'],
  kitchen: ['therm', 'plug'],
  bed:     ['lamp', 'blinds'],
  studio:  ['lamp', 'plug'],
  garden:  ['cam'],
};

const GADGET_CATALOG = [
  { id: 'lamp',     pin: 'Floor lamp',   title: 'Floor lamp',    icon: 'bulb',  x: '44%', y: '22%', anchor: 'bottom-right' },
  { id: 'therm',    pin: 'Climate',      title: 'Thermostat',    icon: 'therm', x: '76%', y: '36%', anchor: 'left' },
  { id: 'blinds',   pin: 'Blinds',       title: 'Blinds',        icon: 'blind', x: '14%', y: '44%', anchor: 'right' },
  { id: 'speaker',  pin: 'Speaker',      title: 'Speaker',       icon: 'play',  x: '68%', y: '68%', anchor: 'top-left' },
  { id: 'door',     pin: 'Front door',   title: 'Front door',    icon: 'lock',  x: '88%', y: '48%', anchor: 'left' },
  { id: 'cam',      pin: 'Camera',       title: 'Camera',        icon: 'cam',   x: '30%', y: '68%', anchor: 'top-right' },
  { id: 'air',      pin: 'Air quality',  title: 'Air quality',   icon: 'wave',  x: '55%', y: '55%', anchor: 'top-left' },
  { id: 'energy',   pin: 'Energy',       title: 'Energy today',  icon: 'bulb',  x: '20%', y: '28%', anchor: 'right' },
  { id: 'plug',     pin: 'Smart plug',   title: 'Smart plug',    icon: 'plug',  x: '60%', y: '32%', anchor: 'bottom-left' },
  { id: 'sconces',  pin: 'Sconces',      title: 'Sconces',       icon: 'lamp',  x: '35%', y: '42%', anchor: 'bottom-right' },
  { id: 'strip',    pin: 'LED strip',    title: 'LED strip',     icon: 'bulb',  x: '72%', y: '26%', anchor: 'bottom-left' },
];

function ARRoomScene({ roomId, bg, pal, lampPct }) {
  const common = (
    <React.Fragment>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '34%', background: bg.floor }}/>
      <div style={{ position: 'absolute', left: 0, right: 0, top: '66%', height: '0.5px', background: bg.line }}/>
    </React.Fragment>
  );

  if (roomId === 'kitchen') return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', right: '8%', top: '10%', width: '26%', height: '46%', background: bg.window, borderRadius: 4, boxShadow: `0 0 160px 50px ${bg.windowGlow}` }}/>
      <div style={{ position: 'absolute', right: '12%', top: '14%', width: '18%', height: '38%', borderLeft: `0.5px solid ${bg.frame}`, borderRight: `0.5px solid ${bg.frame}` }}/>
      <div style={{ position: 'absolute', right: '21%', top: '14%', width: '0.5px', height: '38%', background: bg.frame }}/>
      <div style={{ position: 'absolute', left: '6%', top: '54%', width: '55%', height: '12%', background: bg.sofa, borderRadius: '4px 4px 0 0' }}/>
      <div style={{ position: 'absolute', left: '6%', top: '22%', width: '40%', height: '24%', borderLeft: `0.5px solid ${bg.frame}`, borderRight: `0.5px solid ${bg.frame}`, borderTop: `0.5px solid ${bg.frame}`, borderRadius: 2 }}/>
      <div style={{ position: 'absolute', left: '20%', top: '16%', width: 18, height: 18, borderRadius: 9, background: pal.warm, boxShadow: `0 0 ${60*lampPct/64}px 18px ${pal.warm}55`, opacity: lampPct/100 + 0.2 }}/>
      <div style={{ position: 'absolute', left: '28%', top: '16%', width: 18, height: 18, borderRadius: 9, background: pal.warm, boxShadow: `0 0 ${60*lampPct/64}px 18px ${pal.warm}55`, opacity: lampPct/100 + 0.2 }}/>
      {common}
    </div>
  );

  if (roomId === 'bed') return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', right: '10%', top: '8%', width: '28%', height: '50%', background: bg.window, borderRadius: 4, boxShadow: `0 0 180px 50px ${bg.windowGlow}` }}/>
      <div style={{ position: 'absolute', right: '14%', top: '12%', width: '20%', height: '42%', borderLeft: `0.5px solid ${bg.frame}`, borderRight: `0.5px solid ${bg.frame}` }}/>
      <div style={{ position: 'absolute', left: '8%', top: '46%', width: '48%', height: '22%', background: bg.sofa, borderRadius: '6px 6px 2px 2px' }}/>
      <div style={{ position: 'absolute', left: '8%', top: '42%', width: '48%', height: '6%', background: bg.lamp, borderRadius: '4px 4px 0 0' }}/>
      <div style={{ position: 'absolute', left: '10%', top: '30%', width: '2px', height: '18%', background: bg.lamp, borderRadius: 2 }}/>
      <div style={{ position: 'absolute', left: '8.5%', top: '28%', width: 16, height: 16, borderRadius: 8, background: pal.warm, boxShadow: `0 0 ${70*lampPct/64}px 20px ${pal.warm}55`, opacity: lampPct/100 + 0.2 }}/>
      {common}
    </div>
  );

  if (roomId === 'studio') return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: '4%', top: '10%', width: '24%', height: '48%', background: bg.window, borderRadius: 4, boxShadow: `0 0 180px 50px ${bg.windowGlow}` }}/>
      <div style={{ position: 'absolute', left: '8%', top: '14%', width: '16%', height: '40%', border: `0.5px solid ${bg.frame}` }}/>
      <div style={{ position: 'absolute', left: '44%', top: '50%', width: '42%', height: '8%', background: bg.sofa, borderRadius: 2 }}/>
      <div style={{ position: 'absolute', left: '56%', top: '28%', width: '20%', height: '16%', background: bg.lamp, borderRadius: 2, border: `0.5px solid ${bg.frame}` }}/>
      <div style={{ position: 'absolute', left: '65%', top: '44%', width: '2px', height: '6%', background: bg.lamp }}/>
      <div style={{ position: 'absolute', left: '64%', top: '22%', width: 20, height: 20, borderRadius: 10, background: pal.warm, boxShadow: `0 0 ${70*lampPct/64}px 22px ${pal.warm}55`, opacity: lampPct/100 + 0.2 }}/>
      {common}
    </div>
  );

  if (roomId === 'garden') return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: '60%', background: bg.window, opacity: 0.4, boxShadow: `0 0 200px 60px ${bg.windowGlow}` }}/>
      <div style={{ position: 'absolute', left: '10%', top: '28%', width: '16%', height: '38%', background: 'oklch(0.26 0.05 150)', borderRadius: '50% 50% 4px 4px', opacity: 0.6 }}/>
      <div style={{ position: 'absolute', left: '68%', top: '22%', width: '20%', height: '44%', background: 'oklch(0.22 0.04 150)', borderRadius: '50% 50% 4px 4px', opacity: 0.5 }}/>
      <div style={{ position: 'absolute', left: '38%', top: '36%', width: '12%', height: '30%', background: 'oklch(0.30 0.06 150)', borderRadius: '50% 50% 2px 2px', opacity: 0.45 }}/>
      <div style={{ position: 'absolute', left: '5%', top: '62%', width: '90%', height: '1px', background: bg.frame, opacity: 0.5 }}/>
      <div style={{ position: 'absolute', left: '30%', top: '72%', width: '40%', height: '3%', background: bg.sofa, borderRadius: 2, opacity: 0.5 }}/>
      <div style={{ position: 'absolute', left: '78%', top: '58%', width: '2px', height: '12%', background: bg.lamp, borderRadius: 2 }}/>
      <div style={{ position: 'absolute', left: '77%', top: '56%', width: 14, height: 14, borderRadius: 7, background: pal.warm, boxShadow: `0 0 ${50*lampPct/64}px 14px ${pal.warm}44`, opacity: lampPct/100 + 0.2 }}/>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '34%', background: bg.floor }}/>
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: '6%', top: '8%', width: '34%', height: '60%', background: bg.window, borderRadius: 4, boxShadow: `0 0 200px 60px ${bg.windowGlow}` }}/>
      <div style={{ position: 'absolute', left: '10%', top: '12%', width: '26%', height: '52%', borderLeft: `0.5px solid ${bg.frame}`, borderRight: `0.5px solid ${bg.frame}` }}/>
      <div style={{ position: 'absolute', left: '23%', top: '12%', width: '0.5px', height: '52%', background: bg.frame }}/>
      <div style={{ position: 'absolute', left: '52%', top: '24%', width: '2px', height: '46%', background: bg.lamp, transform: 'rotate(2deg)', borderRadius: 2 }}/>
      <div style={{ position: 'absolute', left: '50%', top: '22%', width: 24, height: 24, borderRadius: 12, background: pal.warm, boxShadow: `0 0 ${80*lampPct/64}px 24px ${pal.warm}66, 0 0 200px 60px ${pal.warm}33`, opacity: lampPct/100 + 0.2 }}/>
      <div style={{ position: 'absolute', left: '60%', top: '60%', width: '32%', height: '20%', background: bg.sofa, borderRadius: 6 }}/>
      {common}
    </div>
  );
}

function ARCameraOverlay({ pal, onClose }) {
  const cams = [
    { name: 'Front door', loc: 'Entry', motion: false },
    { name: 'Garden', loc: 'Backyard', motion: true },
  ];
  return (
    <div className="int-fadein" style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 200,
    }}>
      <div style={{
        background: 'rgba(18,14,10,0.90)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        border: '0.5px solid rgba(255,255,255,0.16)', borderRadius: 24, padding: 24, width: 520,
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 28, color: '#fff' }}>Camera feeds</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginTop: 2 }}>2 live · motion detected in garden</div>
          </div>
          <button onClick={onClose} className="int-press" style={{ width: 32, height: 32, borderRadius: 16, background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.16)', color: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {cams.map(cam => (
            <div key={cam.name} style={{ borderRadius: 14, overflow: 'hidden', border: '0.5px solid rgba(255,255,255,0.10)' }}>
              <div style={{ height: 150, background: '#030303', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Glyph name="cam" size={22} stroke="rgba(255,255,255,0.08)"/>
                {cam.motion && (
                  <div style={{ position: 'absolute', top: 8, left: 8, background: pal.warm, color: '#fff', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 5, letterSpacing: '.06em', fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>MOTION</div>
                )}
                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 4, fontSize: 8.5, color: 'rgba(255,255,255,0.55)', fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: 'oklch(0.62 0.22 25)', animation: 'int-pulse 1.4s ease-in-out infinite' }}/>
                  REC
                </div>
                <div style={{ position: 'absolute', bottom: 6, left: 8, fontSize: 8.5, color: 'rgba(255,255,255,0.3)', fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>9:24:08</div>
              </div>
              <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>{cam.name}</div>
                  <div style={{ fontSize: 10, opacity: 0.45, fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginTop: 1 }}>{cam.loc}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="int-press" style={{ width: 26, height: 26, borderRadius: 13, background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Glyph name="mic" size={11} stroke="rgba(255,255,255,0.5)"/>
                  </button>
                  <button className="int-press" style={{ width: 26, height: 26, borderRadius: 13, background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Glyph name="eyeoff" size={11} stroke="rgba(255,255,255,0.5)"/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ARManageDrawer({ pal, activePanels, catalog, onAdd, onRemove, onClose }) {
  const active = (catalog || GADGET_CATALOG).filter(g => activePanels.includes(g.id));
  const available = (catalog || GADGET_CATALOG).filter(g => !activePanels.includes(g.id));

  return (
    <div className="int-fadein" style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      zIndex: 150,
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}/>
      <div className="int-fadein" style={{
        position: 'relative', width: '100%', maxWidth: 860,
        background: 'rgba(16,12,8,0.94)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
        borderLeft: '0.5px solid rgba(255,255,255,0.12)', borderRight: '0.5px solid rgba(255,255,255,0.12)',
        borderTop: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: '22px 22px 0 0', padding: '20px 28px 36px',
      }}>
        {/* Drag handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)', margin: '0 auto 20px' }}/>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 28, color: '#fff', lineHeight: 1 }}>Manage panels</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginTop: 4 }}>drag panels to reposition · click × to remove</div>
          </div>
          <button onClick={onClose} className="int-press" style={{ width: 34, height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>

        {/* Active panels */}
        <div style={{ fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginBottom: 10 }}>
          Active · {active.length} panel{active.length !== 1 ? 's' : ''}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {active.map(g => (
            <div key={g.id} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px 8px 12px', borderRadius: 12,
              background: pal.warm.replace(')', ' / 0.15)'),
              border: `0.5px solid ${pal.warm.replace(')', ' / 0.35)')}`,
            }}>
              <Glyph name={g.icon} size={12} stroke={pal.warm}/>
              <span style={{ fontSize: 12, color: '#fff', fontWeight: 500 }}>{g.title}</span>
              <button onClick={() => onRemove(g.id)} className="int-press" style={{
                width: 18, height: 18, borderRadius: 9, padding: 0,
                background: 'rgba(255,255,255,0.10)', border: '0.5px solid rgba(255,255,255,0.20)',
                color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>×</button>
            </div>
          ))}
          {active.length === 0 && (
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>No active panels</div>
          )}
        </div>

        {/* Available gadgets */}
        <div style={{ fontSize: 9, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginBottom: 12 }}>
          Add panel
        </div>
        {available.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
            {available.map(g => (
              <button key={g.id} onClick={() => { onAdd(g.id); }} className="int-press" style={{
                padding: '14px 12px', borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.10)',
                color: '#fff', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', gap: 8,
                transition: 'background .15s',
              }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Glyph name={g.icon} size={16} stroke="rgba(255,255,255,0.65)"/>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{g.title}</div>
                  <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.4)', fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginTop: 2 }}>{g.pin}</div>
                </div>
                <div style={{ alignSelf: 'flex-start', padding: '3px 8px', borderRadius: 6, background: pal.warm.replace(')', ' / 0.20)'), border: `0.5px solid ${pal.warm.replace(')', ' / 0.4)')}`, fontSize: 9, color: pal.warm, fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '.04em' }}>+ Add</div>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>All available panels are active</div>
        )}
      </div>
    </div>
  );
}

function ARIntelliden({ pal, household, perm, persona, onPersonaChange }) {
  const [focus, setFocus] = React.useState('lamp');
  const [scene, setScene] = React.useState(perm.allowedScenes.length ? perm.allowedScenes[0] : 'focus');
  const [room, setRoom] = React.useState(perm.allowedRooms.length ? perm.allowedRooms[0] : 'living');
  const [lampPct, setLampPct] = React.useState(64);
  const [thermTarget, setThermTarget] = React.useState(21.5);
  const [blinds, setBlinds] = React.useState(40);
  const [speakerPlaying, setSpeakerPlaying] = React.useState(false);
  const [sconces, setSconces] = React.useState(false);
  const [strip, setStrip] = React.useState(true);
  const [doorLocked, setDoorLocked] = React.useState(true);
  const [personaOpen, setPersonaOpen] = React.useState(false);
  const [camsOpen, setCamsOpen] = React.useState(false);
  const [manageOpen, setManageOpen] = React.useState(false);
  const [panelsByRoom, setPanelsByRoom] = React.useState({ ...ROOM_DEFAULT_PANELS });
  const [toast, showToast] = useToast();

  const bg = AR_BG[pal.time] || AR_BG.day;
  const roomData = ROOMS.find(r => r.id === room) || ROOMS[0];
  const blockedToast = (m) => showToast(m, 'blocked');

  React.useEffect(() => {
    if (perm.allowedScenes.length && !perm.allowedScenes.includes(scene)) setScene(perm.allowedScenes[0]);
    if (perm.blockedScenes.includes(scene)) setScene(visibleScenes(perm)[0]?.id || 'focus');
    if (perm.allowedRooms.length && !perm.allowedRooms.includes(room)) setRoom(perm.allowedRooms[0]);
  }, [persona]);

  React.useEffect(() => {
    const p = SCENE_PRESETS[scene];
    if (p) {
      setLampPct(p.lampPct);
      setThermTarget(p.thermTarget);
      setBlinds(p.blinds);
      setSpeakerPlaying(p.speakerPlaying);
      setSconces(p.sconcesOn);
      setStrip(p.stripOn);
    }
  }, [scene]);

  const pickScene = (s) => {
    if (perm.blockedScenes.includes(s.id)) return blockedToast(`${s.name} owner-only`);
    if (perm.allowedScenes.length && !perm.allowedScenes.includes(s.id)) return blockedToast(`${s.name} not shared`);
    setScene(s.id); showToast(`Scene · ${s.name}`);
  };
  const pickRoom = (r) => {
    if (perm.allowedRooms.length && !perm.allowedRooms.includes(r.id)) return blockedToast(`${r.name} not shared`);
    setRoom(r.id); showToast(`Room · ${r.name}`);
  };
  const lampStep = (d) => { const n = Math.max(0, Math.min(100, lampPct + d)); setLampPct(n); showToast(`Lamp ${n}%`); };
  const thermStep = (d) => { if (!perm.thermostat) return blockedToast('Climate owner-only'); const n = +(thermTarget+d).toFixed(1); setThermTarget(n); showToast(`Target ${n}°`); };
  const speakerToggle = () => { if (!perm.speakerHandoff && persona==='guest') return blockedToast('Hand-off owner-only'); setSpeakerPlaying(v=>!v); showToast(speakerPlaying?'Paused':'Playing'); };
  const tryLock = () => { if (!perm.lock) return blockedToast('Door lock owner-only'); setDoorLocked(v=>!v); showToast(doorLocked?'Door unlocked':'Door locked'); };

  const activePanels = panelsByRoom[room] || ROOM_DEFAULT_PANELS[room] || [];
  const roomCatalog = GADGET_CATALOG.filter(g => (ROOM_GADGETS[room] || []).includes(g.id));

  const addPanel = (id) => {
    setPanelsByRoom(prev => ({ ...prev, [room]: [...(prev[room] || []), id] }));
    showToast(`Panel · ${GADGET_CATALOG.find(g=>g.id===id)?.title}`);
  };
  const removePanel = (id) => {
    setPanelsByRoom(prev => ({ ...prev, [room]: (prev[room] || []).filter(p => p !== id) }));
    showToast(`Removed · ${GADGET_CATALOG.find(g=>g.id===id)?.title}`, 'blocked');
  };

  const sceneObj = SCENES.find(s=>s.id===scene);

  const renderPanel = (id) => {
    const g = GADGET_CATALOG.find(g => g.id === id);
    if (!g) return null;
    const common = {
      key: id, pal, x: g.x, y: g.y, anchor: g.anchor, pin: g.pin,
      focused: focus === id, onPick: () => setFocus(id), onRemove: () => removePanel(id),
    };
    switch(id) {
      case 'lamp': return (
        <ARPanel {...common} title="Floor lamp" big={`${lampPct}%`} sub="warm 2700K">
          <div style={{ display:'flex', gap:6, marginTop:8 }}>
            <button onClick={(e)=>{e.stopPropagation();lampStep(-10);}} style={panelBtn()}>−10%</button>
            <button onClick={(e)=>{e.stopPropagation();lampStep(10);}} style={panelBtn()}>+10%</button>
          </div>
        </ARPanel>
      );
      case 'therm': return (
        <ARPanel {...common} title="Thermostat" big={`${thermTarget.toFixed(1)}°`} sub={perm.thermostat?'auto · sun-aware':'view only · owner-only'} locked={!perm.thermostat}>
          {perm.thermostat && (
            <div style={{ display:'flex', gap:6, marginTop:8 }}>
              <button onClick={(e)=>{e.stopPropagation();thermStep(-0.5);}} style={panelBtn()}>−0.5°</button>
              <button onClick={(e)=>{e.stopPropagation();thermStep(0.5);}} style={panelBtn()}>+0.5°</button>
            </div>
          )}
        </ARPanel>
      );
      case 'blinds': return (
        <ARPanel {...common} title="Blinds" big={`${blinds}%`} sub="auto-tracking sun">
          <input type="range" min="0" max="100" value={blinds} onChange={(e)=>setBlinds(+e.target.value)} onClick={(e)=>e.stopPropagation()} style={{ width:'100%', marginTop:8, accentColor: pal.warm }}/>
        </ARPanel>
      );
      case 'speaker': return (
        <ARPanel {...common} title="Speaker" big={speakerPlaying?'playing':'paused'} sub={perm.speakerHandoff?"june's session":'shared playback'} locked={!perm.speakerHandoff && persona==='guest'}>
          <button onClick={(e)=>{e.stopPropagation();speakerToggle();}} style={panelBtn()}><Glyph name={speakerPlaying?'pause':'play'} size={11}/> {speakerPlaying?'Pause':'Play'}</button>
        </ARPanel>
      );
      case 'door': return (
        <ARPanel {...common} title="Front door" big={doorLocked?'locked':'open'} sub={perm.lock?(doorLocked?'secure · 2h':'unlocked'):'owner-only'} locked={!perm.lock}>
          {perm.lock && <button onClick={(e)=>{e.stopPropagation();tryLock();}} style={panelBtn()}><Glyph name={doorLocked?'unlock':'lock'} size={11}/> {doorLocked?'Unlock':'Lock'}</button>}
        </ARPanel>
      );
      case 'cam': return (
        <ARPanel {...common} title="Camera" big={perm.cameras?'2 live':'hidden'} sub={perm.cameras?'front · garden':'no access'} locked={!perm.cameras}>
          {perm.cameras && (
            <button onClick={(e)=>{e.stopPropagation();setCamsOpen(true);}} style={{ ...panelBtn(), marginTop: 8 }}>
              <Glyph name="cam" size={11}/> View feeds
            </button>
          )}
          {perm.cameras && <div style={{ fontSize: 10, opacity: 0.5, marginTop: 6, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>garden · motion detected</div>}
        </ARPanel>
      );
      case 'air': return (
        <ARPanel {...common} title="Air quality" big="312" sub="ppm CO₂ · rising">
          <div style={{ marginTop: 8 }}>
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '39%', background: 'oklch(0.72 0.14 70)', borderRadius: 2 }}/>
            </div>
            <div style={{ fontSize: 9.5, opacity: 0.45, marginTop: 4, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>threshold 800 ppm</div>
          </div>
        </ARPanel>
      );
      case 'energy': return (
        <ARPanel {...common} title="Energy today" big={ENERGY.todayKwh.toFixed(2)} sub="kWh · ↘ 19% vs yesterday">
          {perm.energy
            ? <div style={{ fontSize: 9.5, opacity: 0.5, marginTop: 6, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>budget {ENERGY.monthSoFar.toFixed(0)} / {ENERGY.monthBudget} kWh</div>
            : <div style={{ fontSize: 9.5, opacity: 0.4, marginTop: 6, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>energy hidden · owner-only</div>
          }
        </ARPanel>
      );
      case 'plug': return (
        <ARPanel {...common} title="Smart plug" big="42W" sub="3 active · kitchen">
          <div style={{ fontSize: 9.5, opacity: 0.45, marginTop: 6, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>coffee maker · dishwasher</div>
        </ARPanel>
      );
      case 'sconces': return (
        <ARPanel {...common} title="Sconces" big={sconces?'on':'off'} sub={sconces?'warm 3000K':'last 21:14'}>
          <button onClick={(e)=>{e.stopPropagation();setSconces(v=>!v);showToast(`Sconces ${!sconces?'on':'off'}`);}} style={panelBtn()}>
            {sconces?'Turn off':'Turn on'}
          </button>
        </ARPanel>
      );
      case 'strip': return (
        <ARPanel {...common} title="LED strip" big={strip?'amber':'off'} sub={strip?'dimmed 22%':'off'}>
          <button onClick={(e)=>{e.stopPropagation();setStrip(v=>!v);showToast(`Strip ${!strip?'on':'off'}`);}} style={panelBtn()}>
            {strip?'Turn off':'Turn on'}
          </button>
        </ARPanel>
      );
      default: return null;
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      fontFamily: '"Geist", -apple-system, system-ui, sans-serif', color: '#fff',
      background: bg.bg, WebkitFontSmoothing: 'antialiased',
    }}>
      <ARRoomScene key={room} roomId={room} bg={bg} pal={pal} lampPct={lampPct} />

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,.35) 100%)` }}/>

      {/* HUD */}
      <div style={{ position: 'absolute', top: 22, left: 32, right: 32,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 11,
        letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <span style={{ width: 7, height: 7, borderRadius: 4, background: perm.tone }}/>
          <span>Intelliden · spatial</span>
          <button onClick={() => setPersonaOpen(true)} className="int-press" style={{ marginLeft: 4, padding: '3px 10px', borderRadius: 8, background: perm.tone.replace(')', ' / 0.2)'), color: '#fff', letterSpacing: '.08em', border: `1px solid ${perm.tone.replace(')', ' / 0.3)')}`, cursor: 'pointer', fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 11, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            {household.badge}
            <svg width="8" height="5" viewBox="0 0 8 5"><path d="M1 1l3 3 3-3" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div style={{ display: 'flex', gap: 22, opacity: 0.78 }}>
          <span>FOV 110°</span>
          <span>tracking · ok</span>
          <span>{roomData.name} · pinned {perm.allowedRooms.length?2:4}</span>
          <span>{pal.todLabel}</span>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '7%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        <div style={{ fontSize: 10.5, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.6, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>You are looking into</div>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 50, lineHeight: 1, marginTop: 4, letterSpacing: -0.4 }}>{AR_ROOM_LABELS[room] || 'The Living Room'}</div>
      </div>

      {/* Room selector tabs */}
      <div style={{ position: 'absolute', top: 56, left: 32, display: 'flex', gap: 4 }}>
        {ROOMS.map(r => {
          const allowed = !perm.allowedRooms.length || perm.allowedRooms.includes(r.id);
          const sel = r.id === room;
          return (
            <button key={r.id} onClick={() => pickRoom(r)} className="int-press" style={{
              height: 26, padding: '0 10px', borderRadius: 13, border: 'none',
              background: sel ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
              color: sel ? '#fff' : (allowed ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)'),
              fontSize: 10, fontWeight: 500, fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              letterSpacing: '.06em', textTransform: 'uppercase', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4, opacity: allowed ? 1 : 0.5,
            }}>
              {!allowed && <Glyph name="lock" size={9} stroke="currentColor"/>}
              {r.name.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Dynamic panels */}
      {activePanels.map(id => renderPanel(id))}

      {/* Mini-map */}
      <div style={{ position: 'absolute', bottom: 32, left: 32, width: 220,
        background: 'rgba(20,16,12,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 12 }}>
        <div style={{ fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.6, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>Home · {household.home}</div>
        <div style={{ marginTop: 8, height: 110 }}>
          <FloorPlan pal={{ ...pal, line: 'rgba(255,255,255,0.18)', muted: 'rgba(255,255,255,0.6)', warm: pal.warm }} active={room} onPick={(id) => pickRoom(ROOMS.find(r=>r.id===id) || ROOMS[0])} perm={perm}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, opacity: 0.6, fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginTop: 4 }}>
          <span>{visibleRooms(perm).length} rooms</span><span>{activePanels.length} panels</span>
        </div>
        {perm.energy && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '0.5px solid rgba(255,255,255,0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
              <span style={{ opacity: 0.6 }}>Energy</span>
              <span style={{ color: 'oklch(0.62 0.14 150)' }}>↘ 19%</span>
            </div>
            <div style={{ fontSize: 18, fontFamily: '"Instrument Serif", Georgia, serif', marginTop: 2 }}>{ENERGY.todayKwh.toFixed(2)} <span style={{ fontSize: 10, opacity: 0.6 }}>kWh</span></div>
          </div>
        )}
        <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', fontSize: 9.5, opacity: 0.7, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
          <span>CO₂ 312 ppm</span><span style={{ color: 'oklch(0.72 0.14 70)' }}>rising</span>
        </div>
      </div>

      {/* Wrist palette */}
      <div style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(20,16,12,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '0.5px solid rgba(255,255,255,0.14)', borderRadius: 999, padding: 8,
        display: 'flex', alignItems: 'center', gap: 6 }}>
        {SCENES.map(s => {
          const sel = s.id === scene;
          const blocked = perm.blockedScenes.includes(s.id) || (perm.allowedScenes.length && !perm.allowedScenes.includes(s.id));
          return (
            <button key={s.id} onClick={()=>pickScene(s)} className="int-press" style={{
              height: 36, padding: '0 12px', borderRadius: 18, border: 'none',
              background: sel ? pal.warm : 'transparent',
              color: sel ? '#fff' : (blocked ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.85)'),
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, fontFamily:'inherit', cursor:'pointer',
              opacity: blocked ? 0.55 : 1,
            }}>
              <Glyph name={blocked?'lock':s.glyph} size={13} stroke="currentColor"/>
              {s.name}
            </button>
          );
        })}
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.14)', margin: '0 2px' }}/>
        {/* Manage panels button */}
        <button onClick={() => setManageOpen(true)} className="int-press" style={{
          height: 36, padding: '0 14px', borderRadius: 18, border: '0.5px solid rgba(255,255,255,0.18)',
          background: manageOpen ? pal.warm : 'rgba(255,255,255,0.06)',
          color: '#fff', display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontWeight: 500, fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          letterSpacing: '.04em', cursor: 'pointer',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="8" y="1" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="1" y="8" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
            <rect x="8" y="8" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          Panels
        </button>
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.14)', margin: '0 2px' }}/>
        <div style={{ height: 36, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.78)', fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '.04em' }}>
          <Glyph name="hand" size={13} stroke="currentColor"/> drag · pinch · gaze
        </div>
      </div>

      {/* Co-op rail */}
      <div style={{ position: 'absolute', right: 32, bottom: 32, width: 220,
        background: 'rgba(20,16,12,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 12 }}>
        <div style={{ fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.6, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{perm.members?'With you':'Visible to you'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
          {household.members.map(m => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: m.tint, color: '#fff', fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: m.here ? 1 : 0.3, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{m.mono}</div>
              <div style={{ flex: 1, fontSize: 12 }}>{m.name}</div>
              <div style={{ fontSize: 9.5, opacity: m.here ? 0.7 : 0.4, fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '.06em', textTransform: 'uppercase' }}>{m.here ? 'here' : 'away'}</div>
            </div>
          ))}
        </div>
        {recentFor(perm).length > 0 && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '0.5px solid rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', opacity: 0.5, fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginBottom: 6 }}>Recent</div>
            {recentFor(perm).slice(0, 2).map((r, i) => (
              <div key={i} style={{ fontSize: 11, opacity: 0.7, marginBottom: 4, lineHeight: 1.3 }}>
                <span style={{ fontWeight: 600 }}>{r.who}</span> {r.what} <span style={{ opacity: 0.5, fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 9.5 }}>{r.t}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reticle */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 22, height: 22, borderRadius: 11, border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 0 0 4px rgba(255,255,255,0.06)', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 9, borderRadius: 2, background: 'rgba(255,255,255,0.85)' }}/>
      </div>

      {manageOpen && <ARManageDrawer pal={pal} activePanels={activePanels} catalog={roomCatalog} onAdd={addPanel} onRemove={removePanel} onClose={() => setManageOpen(false)}/>}
      {camsOpen && <ARCameraOverlay pal={pal} onClose={() => setCamsOpen(false)}/>}
      {personaOpen && <PersonaSwitcherModal pal={pal} persona={persona} onPersonaChange={onPersonaChange} onClose={() => setPersonaOpen(false)} glass />}
      <Toast toast={toast} pal={pal}/>
    </div>
  );
}

function panelBtn() {
  return { height: 26, padding: '0 10px', borderRadius: 13, border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 11, fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 };
}

const AR_BG = {
  dawn: { bg: 'linear-gradient(170deg, oklch(0.32 0.04 50) 0%, oklch(0.18 0.02 30) 60%)', window: 'oklch(0.78 0.10 60)', windowGlow: 'oklch(0.78 0.10 60 / 0.6)', frame: 'oklch(0.42 0.02 50)', floor: 'linear-gradient(180deg, oklch(0.20 0.02 30) 0%, oklch(0.14 0.018 30) 100%)', line: 'rgba(255,255,255,0.08)', lamp: 'oklch(0.32 0.02 30)', sofa: 'oklch(0.20 0.018 30)' },
  day:  { bg: 'linear-gradient(170deg, oklch(0.42 0.018 240) 0%, oklch(0.22 0.02 250) 60%)', window: 'oklch(0.92 0.04 80)', windowGlow: 'oklch(0.92 0.04 80 / 0.8)', frame: 'oklch(0.52 0.02 240)', floor: 'linear-gradient(180deg, oklch(0.26 0.018 240) 0%, oklch(0.16 0.018 240) 100%)', line: 'rgba(255,255,255,0.08)', lamp: 'oklch(0.42 0.02 240)', sofa: 'oklch(0.26 0.018 240)' },
  dusk: { bg: 'linear-gradient(170deg, oklch(0.32 0.06 30) 0%, oklch(0.16 0.04 280) 65%)', window: 'oklch(0.66 0.16 30)', windowGlow: 'oklch(0.66 0.16 30 / 0.7)', frame: 'oklch(0.40 0.04 30)', floor: 'linear-gradient(180deg, oklch(0.22 0.03 280) 0%, oklch(0.12 0.02 280) 100%)', line: 'rgba(255,255,255,0.08)', lamp: 'oklch(0.30 0.03 30)', sofa: 'oklch(0.20 0.02 280)' },
  night:{ bg: 'linear-gradient(170deg, oklch(0.18 0.02 260) 0%, oklch(0.08 0.018 260) 75%)', window: 'oklch(0.30 0.05 260)', windowGlow: 'oklch(0.30 0.05 260 / 0.5)', frame: 'oklch(0.30 0.02 260)', floor: 'linear-gradient(180deg, oklch(0.12 0.018 260) 0%, oklch(0.06 0.018 260) 100%)', line: 'rgba(255,255,255,0.06)', lamp: 'oklch(0.20 0.02 260)', sofa: 'oklch(0.14 0.018 260)' },
};

function ARPanel({ pal, x, y, anchor, pin, title, big, sub, focused, onPick, locked, onRemove, children }) {
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const dragging = React.useRef(false);
  const start = React.useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  const onPointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    dragging.current = true;
    start.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const onPointerMove = (e) => {
    if (!dragging.current) return;
    setOffset({
      x: start.current.ox + (e.clientX - start.current.mx),
      y: start.current.oy + (e.clientY - start.current.my),
    });
  };
  const onPointerUp = () => { dragging.current = false; };

  const [a] = (anchor || 'top-left').split('-');
  return (
    <div
      onClick={onPick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: 'absolute', left: x, top: y,
        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
        cursor: 'grab', userSelect: 'none', touchAction: 'none',
      }}>
      <div style={{ position: 'absolute',
        width: 1, height: 36, background: 'rgba(255,255,255,0.35)',
        left: a === 'left' ? -36 : (a === 'right' ? 'calc(100% + 36px)' : '50%'),
        top: a === 'top' ? -36 : (a === 'bottom' ? 'calc(100% + 36px)' : '50%'),
        transform: a === 'left' || a === 'right' ? 'rotate(90deg)' : 'none',
        pointerEvents: 'none',
      }}/>
      <div className={focused ? 'int-fadein' : ''} style={{
        background: focused ? 'rgba(28,22,16,0.78)' : 'rgba(20,16,12,0.55)',
        backdropFilter: 'blur(24px) saturate(160%)', WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        border: focused ? `0.5px solid ${pal.warm}` : '0.5px solid rgba(255,255,255,0.16)',
        borderRadius: 18, padding: '16px 14px 14px', minWidth: 200,
        boxShadow: focused ? `0 0 0 4px ${pal.warm}22, 0 12px 40px rgba(0,0,0,0.35)` : '0 8px 24px rgba(0,0,0,0.25)',
        opacity: locked ? 0.78 : 1,
      }}>
        <div style={{ position: 'absolute', top: 7, left: '50%', transform: 'translateX(-50%)', width: 28, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.18)', pointerEvents: 'none' }}/>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.6, fontFamily: '"JetBrains Mono", ui-monospace, monospace', display:'flex', alignItems:'center', gap:4 }}>
            <Glyph name={locked?'lock':'pin'} size={10} stroke="currentColor"/> {pin}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {focused && !locked && <div style={{ width: 6, height: 6, borderRadius: 3, background: pal.warm }}/>}
            {onRemove && (
              <button onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{
                width: 18, height: 18, borderRadius: 9, padding: 0,
                background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.18)',
                color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>×</button>
            )}
          </div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}>{title}</div>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 32, lineHeight: 1, marginTop: 4, letterSpacing: -0.3 }}>{big}</div>
        <div style={{ fontSize: 10.5, opacity: 0.7, marginTop: 3 }}>{sub}</div>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { ARIntelliden, ARPanel, AR_BG, ARRoomScene, AR_ROOM_LABELS });
