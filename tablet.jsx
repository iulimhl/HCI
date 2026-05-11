// tablet.jsx — Intelliden tablet dashboard with persona gating + interactivity.

function TabletDockDevices({ pal, perm, persona, floorLamp, setFloorLamp, sconces, setSconces, strip, setStrip, blinds, setBlinds, speakerPlaying, setSpeakerPlaying, doorLocked, tryLock, showToast }) {
  const { surface, surface2, line, muted, ink } = pal;
  const rooms = visibleRooms(perm);
  const blockedToast = (m) => showToast(m, 'blocked');

  const devsByRoom = {
    living: [
      { title: 'Floor lamp', icon: 'bulb', value: floorLamp ? '64%' : 'off', sub: 'warm 2700K', on: floorLamp, onClick: () => { setFloorLamp(v => !v); showToast(`Floor lamp ${!floorLamp ? 'on' : 'off'}`); } },
      { title: 'Sconces', icon: 'lamp', value: sconces ? 'on' : 'off', sub: sconces ? 'now' : 'last 21:14', on: sconces, onClick: () => { setSconces(v => !v); showToast(`Sconces ${!sconces ? 'on' : 'off'}`); } },
      { title: 'LED strip', icon: 'bulb', value: strip ? 'amber' : 'off', sub: strip ? 'dimmed 22%' : 'off', on: strip, onClick: () => { setStrip(v => !v); showToast(`Strip ${!strip ? 'on' : 'off'}`); } },
      { title: 'Blinds', icon: 'blind', value: `${blinds}%`, sub: 'auto-tracking sun', on: blinds > 0 },
      { title: 'Speaker', icon: speakerPlaying ? 'pause' : 'play', value: speakerPlaying ? 'playing' : 'paused', sub: 'shared playback', on: speakerPlaying, locked: !perm.speakerHandoff && persona === 'guest', onClick: () => { if (!perm.speakerHandoff && persona === 'guest') return blockedToast('Hand-off owner-only'); setSpeakerPlaying(v => !v); showToast(`${!speakerPlaying ? 'Playing' : 'Paused'}`); } },
      { title: 'Front door', icon: doorLocked ? 'lock' : 'unlock', value: doorLocked ? 'locked' : 'open', sub: doorLocked ? 'secure · 2h' : 'open', on: doorLocked, locked: !perm.lock, onClick: tryLock },
      { title: 'Camera', icon: 'cam', value: perm.cameras ? '2 live' : 'hidden', sub: perm.cameras ? 'front · garden' : 'no access', on: perm.cameras, locked: !perm.cameras, onClick: () => !perm.cameras && blockedToast('Cameras owner-only') },
      { title: 'Air quality', icon: 'wave', value: '312 ppm', sub: 'CO₂ rising', on: true },
      { title: 'Smart plug', icon: 'plug', value: '42W', sub: '3 active · kitchen', on: true },
    ],
    kitchen: [
      { title: 'Pendants', icon: 'bulb', value: 'on · 80%', sub: '3 bulbs', on: true },
      { title: 'Coffee maker', icon: 'plug', value: 'standby', sub: '3W', on: false },
      { title: 'Sensor', icon: 'wave', value: '22.1°', sub: 'CO₂ ok', on: true },
    ],
    bed: [
      { title: 'Bedside', icon: 'bulb', value: 'off', sub: 'warm', on: false },
      { title: 'Blinds', icon: 'blind', value: 'closed', sub: 'manual', on: false },
      { title: 'Speaker', icon: 'play', value: 'off', sub: 'mini', on: false },
    ],
    studio: [
      { title: 'Desk lamp', icon: 'bulb', value: 'on · 40%', sub: '2700K', on: true },
      { title: 'Smart plug', icon: 'plug', value: '12W', sub: 'monitor', on: true },
    ],
    garden: [
      { title: 'Path lights', icon: 'bulb', value: 'off', sub: 'dusk-timer', on: false },
      { title: 'Garden cam', icon: 'cam', value: perm.cameras ? 'live' : 'hidden', sub: 'garden · rear', on: perm.cameras, locked: !perm.cameras, onClick: () => !perm.cameras && blockedToast('Cameras owner-only') },
    ],
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24 }}>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 42, letterSpacing: -0.5, lineHeight: 1 }}>All devices.</div>
        <div style={{ fontSize: 11, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{rooms.reduce((a, r) => a + (devsByRoom[r.id] || []).length, 0)} total · {rooms.length} rooms</div>
      </div>
      {rooms.map(r => (
        <div key={r.id} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 9.5, letterSpacing: '.22em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{r.name}</div>
            <div style={{ flex: 1, height: '0.5px', background: line }}/>
            <div style={{ fontSize: 9.5, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{(devsByRoom[r.id] || []).length} dev</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {(devsByRoom[r.id] || []).map(d => (
              <DeviceCard key={d.title} pal={pal} title={d.title} icon={d.icon} value={d.value} sub={d.sub} on={d.on} locked={d.locked} onClick={d.onClick}/>
            ))}
          </div>
        </div>
      ))}
      {perm.addDevice && (
        <button onClick={() => showToast('Pairing flow…')} className="int-press" style={{ marginTop: 4, height: 44, borderRadius: 22, background: ink, color: pal.bg, border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px' }}>
          <Glyph name="plus2" size={13} stroke={pal.bg}/> Add a device
        </button>
      )}
    </div>
  );
}

function TabletDockVoice({ pal, perm }) {
  const { muted, surface, line, ink } = pal;
  const suggestions = [
    '"Turn off all lights"',
    '"Set bedroom to 19 degrees"',
    '"Activate cinema scene"',
    '"Lock the front door"',
    '"What\'s the energy usage today?"',
    '"Dim the living room to 30%"',
    '"Who is at home?"',
    '"Set thermostat to 22 degrees"',
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36, padding: '40px 60px' }}>
      <div style={{ position: 'relative', width: 100, height: 100 }}>
        <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', background: pal.warm, opacity: 0.12, animation: 'int-pulse 2s ease-in-out infinite' }}/>
        <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: pal.warm, opacity: 0.18, animation: 'int-pulse 2s ease-in-out infinite .4s' }}/>
        <div style={{ width: 100, height: 100, borderRadius: 50, background: pal.warm, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 12px 40px ${pal.warm}55` }}>
          <Glyph name="mic" size={44} stroke="#fff" sw={1.4}/>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 34, color: ink }}>Say something…</div>
        <div style={{ fontSize: 12, color: muted, marginTop: 6, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{perm.label} · all rooms</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 620 }}>
        {suggestions.map(s => (
          <div key={s} style={{ padding: '10px 18px', borderRadius: 14, background: surface, border: `0.5px solid ${line}`, fontSize: 13, color: ink }}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabletDockCams({ pal, perm }) {
  const { muted, surface, surface2, line, ink } = pal;

  if (!perm.cameras) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, color: muted }}>
      <Glyph name="eyeoff" size={36} stroke={muted}/>
      <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 32, color: ink }}>Cameras hidden</div>
      <div style={{ fontSize: 13, maxWidth: 300, textAlign: 'center', lineHeight: 1.5, color: muted }}>Camera access is restricted for the {perm.label.toLowerCase()} persona.</div>
    </div>
  );

  const cams = [
    { name: 'Front door', loc: 'Entry', motion: false },
    { name: 'Garden', loc: 'Backyard', motion: true },
    { name: 'Garage', loc: 'Lower level', motion: false },
    { name: 'Kitchen', loc: 'Interior', motion: false },
  ];

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 42, letterSpacing: -0.5 }}>Camera feeds.</div>
        <div style={{ fontSize: 11, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>4 cameras · all live</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {cams.map(cam => (
          <div key={cam.name} style={{ borderRadius: 18, overflow: 'hidden', border: `0.5px solid ${line}` }}>
            <div style={{ height: 190, background: '#050505', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Glyph name="cam" size={28} stroke="rgba(255,255,255,0.10)"/>
              {cam.motion && (
                <div style={{ position: 'absolute', top: 10, left: 10, background: pal.warm, color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6, letterSpacing: '.06em', fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>MOTION</div>
              )}
              <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, color: 'rgba(255,255,255,0.65)', fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
                <div style={{ width: 5, height: 5, borderRadius: 3, background: 'oklch(0.62 0.22 25)', animation: 'int-pulse 1.4s ease-in-out infinite' }}/>
                REC
              </div>
              <div style={{ position: 'absolute', bottom: 8, left: 10, fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>9:24:08</div>
            </div>
            <div style={{ padding: '10px 14px', background: surface, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{cam.name}</div>
                <div style={{ fontSize: 10.5, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginTop: 2 }}>{cam.loc}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="int-press" style={{ width: 30, height: 30, borderRadius: 15, background: surface2, border: `0.5px solid ${line}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Glyph name="mic" size={13} stroke={muted}/>
                </button>
                <button className="int-press" style={{ width: 30, height: 30, borderRadius: 15, background: surface2, border: `0.5px solid ${line}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Glyph name="eyeoff" size={13} stroke={muted}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabletDockGear({ pal, perm, household, showToast }) {
  const { muted, surface, surface2, line, ink } = pal;
  const settingsCard = { background: surface, borderRadius: 18, border: `0.5px solid ${line}`, overflow: 'hidden', marginBottom: 12 };

  const SettingsGroup = ({ label, items }) => (
    <div style={settingsCard}>
      <div style={{ padding: '10px 16px', fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace', borderBottom: `0.5px solid ${line}` }}>{label}</div>
      {items.map((item, i) => (
        <div key={item.label} onClick={() => item.locked ? showToast('Owner-only', 'blocked') : showToast(`Opening ${item.label}…`)} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderTop: i ? `0.5px solid ${line}` : 'none', cursor: 'pointer', opacity: item.locked ? 0.45 : 1 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: surface2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Glyph name={item.icon} size={15} stroke={item.locked ? muted : pal.warm}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
            <div style={{ fontSize: 10.5, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginTop: 1 }}>{item.sub}</div>
          </div>
          {item.locked
            ? <Glyph name="lock" size={12} stroke={muted}/>
            : <svg width="7" height="12" viewBox="0 0 7 12"><path d="M1 1l5 5-5 5" fill="none" stroke={muted} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          }
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px 24px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
      <div>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: perm.tone, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '.04em' }}>{household.members[0]?.mono || perm.label[0]}</div>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 30, marginTop: 14, lineHeight: 1 }}>{household.home}.</div>
        <div style={{ fontSize: 12, color: muted, marginTop: 6 }}>{household.address}</div>
        <div style={{ marginTop: 12, display: 'inline-block', padding: '5px 12px', borderRadius: 8, background: perm.tone.replace(')', ' / 0.15)'), border: `1px solid ${perm.tone.replace(')', ' / 0.3)')}`, color: perm.tone, fontSize: 10.5, fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '.08em', textTransform: 'uppercase' }}>{perm.label}</div>
        <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 12, background: perm.tone.replace(')', ' / 0.10)'), borderLeft: `2px solid ${perm.tone}`, fontSize: 11.5, lineHeight: 1.5, color: ink }}>{perm.statement}</div>
        <div style={{ marginTop: 24, fontSize: 9.5, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace', lineHeight: 1.8 }}>
          Intelliden OS 4.2.1<br/>
          All systems nominal<br/>
          Last sync · just now
        </div>
      </div>
      <div>
        <SettingsGroup label="Home settings" items={[
          { label: 'Home settings', sub: 'Name, address, timezone', icon: 'home', locked: !perm.addDevice },
          { label: 'Network', sub: '14 devices connected', icon: 'wifi', locked: !perm.addDevice },
          { label: 'Routines & automations', sub: '6 active', icon: 'sun', locked: !perm.addDevice },
          { label: 'Permissions', sub: '3 roles configured', icon: 'lock', locked: !perm.addDevice },
        ]}/>
        <SettingsGroup label="System" items={[
          { label: 'Firmware updates', sub: 'All up to date', icon: 'sun', locked: false },
          { label: 'Air quality alerts', sub: 'CO₂ > 800 ppm', icon: 'wave', locked: false },
          { label: 'Privacy & data', sub: 'Local processing only', icon: 'eyeoff', locked: false },
        ]}/>
      </div>
    </div>
  );
}

function TabletIntelliden({ pal, household, perm, persona, onPersonaChange }) {
  const allowedRoom = perm.allowedRooms.length ? perm.allowedRooms[0] : 'living';
  const [room, setRoom] = React.useState(allowedRoom);
  const [scene, setScene] = React.useState(perm.allowedScenes.length ? perm.allowedScenes[0] : 'focus');
  const [floorLamp, setFloorLamp] = React.useState(true);
  const [sconces, setSconces] = React.useState(false);
  const [strip, setStrip] = React.useState(true);
  const [blinds, setBlinds] = React.useState(40);
  const [speakerPlaying, setSpeakerPlaying] = React.useState(false);
  const [thermTarget, setThermTarget] = React.useState(21.5);
  const [doorLocked, setDoorLocked] = React.useState(true);
  const [personaOpen, setPersonaOpen] = React.useState(false);
  const [dock, setDock] = React.useState('home');
  const [toast, showToast] = useToast();

  const ink = pal.ink, muted = pal.muted, line = pal.line;
  const surface = pal.surface, surface2 = pal.surface2;
  const card = { background: surface, borderRadius: 24, border: `0.5px solid ${line}`, boxSizing: 'border-box' };
  const isDark = pal.mode === 'dark';

  const roomData = ROOMS.find(r => r.id === room) || ROOMS[0];
  const sceneObj = SCENES.find(s => s.id === scene);
  const blockedToast = (m) => showToast(m, 'blocked');

  React.useEffect(() => {
    if (perm.allowedRooms.length && !perm.allowedRooms.includes(room)) setRoom(perm.allowedRooms[0]);
    if (perm.allowedScenes.length && !perm.allowedScenes.includes(scene)) setScene(perm.allowedScenes[0]);
    if (perm.blockedScenes.includes(scene)) setScene(visibleScenes(perm)[0]?.id || 'focus');
  }, [persona]);

  React.useEffect(() => {
    const p = SCENE_PRESETS[scene];
    if (p) {
      setFloorLamp(p.lampPct > 0);
      setSconces(p.sconcesOn);
      setStrip(p.stripOn);
      setBlinds(p.blinds);
      setThermTarget(p.thermTarget);
      setSpeakerPlaying(p.speakerPlaying);
    }
  }, [scene]);

  const pickRoom = (r) => {
    if (perm.allowedRooms.length && !perm.allowedRooms.includes(r.id)) return blockedToast(`${r.name} not shared`);
    setRoom(r.id);
  };
  const pickScene = (s) => {
    if (perm.blockedScenes.includes(s.id)) return blockedToast(`${s.name} is owner-only`);
    if (perm.allowedScenes.length && !perm.allowedScenes.includes(s.id)) return blockedToast(`${s.name} not shared`);
    setScene(s.id); showToast(`Scene · ${s.name}`);
  };
  const bumpTherm = (d) => {
    if (!perm.thermostat) return blockedToast('Thermostat owner-only');
    const v = +(thermTarget + d).toFixed(1); setThermTarget(v); showToast(`Target ${v}°`);
  };
  const tryLock = () => {
    if (!perm.lock) return blockedToast('Door lock is owner-only');
    setDoorLocked(v => !v); showToast(`Door ${!doorLocked ? 'locked' : 'unlocked'}`);
  };

  const TABS = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'devices', icon: 'wifi', label: 'Devices' },
    { id: 'voice', icon: 'mic', label: 'Voice' },
    { id: 'cams', icon: 'cam', label: 'Cameras' },
    { id: 'gear', icon: 'gear', label: 'Settings' },
  ];

  return (
    <div style={{
      width: '100%', height: '100%', background: pal.bg, color: ink,
      fontFamily: '"Geist", -apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased', display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 28px 0', fontSize: 11.5, color: muted,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '.06em' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ width: 7, height: 7, borderRadius: 4, background: perm.tone, boxShadow: `0 0 0 4px ${perm.tone}25` }}/>
          <span>Intelliden v4.2 · {pal.todLabel}</span>
          <button onClick={() => setPersonaOpen(true)} className="int-press" style={{ marginLeft: 6, padding: '3px 10px', borderRadius: 8, background: perm.tone.replace(')', ' / 0.15)'), color: perm.tone, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', border: `1px solid ${perm.tone.replace(')', ' / 0.3)')}`, cursor: 'pointer', fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            {household.badge}
            <svg width="8" height="5" viewBox="0 0 8 5"><path d="M1 1l3 3 3-3" fill="none" stroke={perm.tone} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div style={{ display: 'flex', gap: 18 }}>
          <span>{visibleRooms(perm).length} rooms · {perm.allowedRooms.length ? 'shared' : 'all'}</span>
          {perm.energy ? <><span>{ENERGY.todayKwh.toFixed(2)} kWh today</span><span>↘ 19% vs yest.</span></> : <span style={{opacity:.5}}>energy hidden</span>}
          <span>9:24 Sat 09 May</span>
        </div>
      </div>

      {/* Home dashboard */}
      {dock === 'home' && (
        <div style={{ flex: 1, padding: '20px 24px 8px', display: 'grid', gridTemplateColumns: '300px 1fr 300px', gap: 18, minHeight: 0, overflow: 'hidden' }}>
          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
            <div>
              <div style={{ fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>This home</div>
              <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 50, lineHeight: 1, letterSpacing: -0.6, marginTop: 4 }}>
                {household.home}.
              </div>
              <div style={{ fontSize: 12, color: muted, marginTop: 6 }}>{household.address}</div>
              <div style={{ marginTop: 10, padding: 10, borderRadius: 12, background: perm.tone.replace(')', ' / 0.12)'), borderLeft: `2px solid ${perm.tone}`, fontSize: 12, lineHeight: 1.4, color: ink }}>
                {perm.statement}
              </div>
            </div>

            <div style={{ ...card, padding: 14, flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>Floorplan</div>
                <div style={{ fontSize: 10.5, color: muted }}>level 1 · 148m²</div>
              </div>
              <div style={{ flex: 1, position: 'relative', marginTop: 10 }}>
                <FloorPlan pal={pal} active={room} onPick={(id)=>pickRoom(ROOMS.find(r=>r.id===id))} perm={perm}/>
              </div>
            </div>

            {perm.members ? (
              <div style={{ ...card, padding: 14 }}>
                <div style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: muted, marginBottom: 10, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>Household</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {household.members.map(m => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 14, background: m.tint, color: '#fff', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: m.here ? 1 : 0.32, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{m.mono}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                        <div style={{ fontSize: 10.5, color: muted }}>{m.role}</div>
                      </div>
                      <div style={{ fontSize: 10, color: m.here ? 'oklch(0.62 0.14 150)' : muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '.06em', textTransform: 'uppercase' }}>{m.here ? '· here' : '· away'}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ ...card, padding: 14 }}>
                <Glyph name="eyeoff" size={16} stroke={muted}/>
                <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 18, marginTop: 6 }}>Household hidden</div>
                <div style={{ fontSize: 11.5, color: muted, marginTop: 4 }}>Guests can't see who else lives here.</div>
              </div>
            )}
          </div>

          {/* CENTER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
            <div style={{ ...card, padding: 22, position: 'relative', overflow: 'hidden', background: pal.warm + (isDark ? '18' : '12') }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>Now in {roomData.name}</div>
                  <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 76, lineHeight: 0.95, letterSpacing: -1, marginTop: 4 }}>
                    {roomData.temp.toFixed(1)}<span style={{ fontSize: 32, color: muted }}>°c</span>
                  </div>
                  <div style={{ fontSize: 12, color: muted, marginTop: 4, display:'flex', alignItems:'center', gap:8 }}>
                    target {thermTarget.toFixed(1)}°
                    {perm.thermostat && (
                      <span style={{ display:'flex', gap:4 }}>
                        <button onClick={()=>bumpTherm(-0.5)} className="int-press" style={chipBtn(pal)}><Glyph name="minus" size={11}/></button>
                        <button onClick={()=>bumpTherm(0.5)} className="int-press" style={chipBtn(pal)}><Glyph name="plus2" size={11}/></button>
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>Scene</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                    <Glyph name={sceneObj.glyph} size={18} stroke={pal.warm} sw={1.6}/>
                    <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 28, letterSpacing: -0.3 }}>{sceneObj.name}</div>
                  </div>
                  <div style={{ fontSize: 10.5, color: muted, marginTop: 2 }}>{sceneObj.trigger}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, marginTop: 18, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 2 }}>
                {SCENES.map(s => {
                  const sel = s.id === scene;
                  const blocked = perm.blockedScenes.includes(s.id) || (perm.allowedScenes.length && !perm.allowedScenes.includes(s.id));
                  return (
                    <button key={s.id} onClick={() => pickScene(s)} className="int-press" style={{
                      height: 32, padding: '0 12px', borderRadius: 16,
                      border: `0.5px solid ${sel ? ink : line}`,
                      background: sel ? ink : 'transparent', color: sel ? pal.bg : (blocked ? muted : ink),
                      fontSize: 12, fontWeight: 500, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit',
                      opacity: blocked ? 0.5 : 1,
                    }}>
                      <Glyph name={blocked?'lock':s.glyph} size={11}/>{s.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, flex: 1 }}>
              <DeviceCard pal={pal} title="Floor lamp" icon="bulb" value={floorLamp?'64%':'off'} sub="warm 2700K" on={floorLamp} onClick={()=>{setFloorLamp(v=>!v);showToast(`Floor lamp ${!floorLamp?'on':'off'}`);}}/>
              <DeviceCard pal={pal} title="Sconces" icon="lamp" value={sconces?'on':'off'} sub={sconces?'now':'last 21:14'} on={sconces} onClick={()=>{setSconces(v=>!v);showToast(`Sconces ${!sconces?'on':'off'}`);}}/>
              <DeviceCard pal={pal} title="LED strip" icon="bulb" value={strip?'amber':'off'} sub={strip?'dimmed · 22%':'off'} on={strip} onClick={()=>{setStrip(v=>!v);showToast(`Strip ${!strip?'on':'off'}`);}}/>
              <DeviceCard pal={pal} title="Blinds" icon="blind" value={`${blinds}%`} sub="auto-tracking sun" on={blinds>0}>
                <input type="range" min="0" max="100" value={blinds} onChange={(e)=>setBlinds(+e.target.value)} onClick={(e)=>e.stopPropagation()} style={{ width: '100%', accentColor: pal.warm, marginTop: 6 }}/>
              </DeviceCard>
              <DeviceCard pal={pal} title="Speaker" icon={speakerPlaying?'pause':'play'} value={speakerPlaying?'playing':'paused'} sub={perm.speakerHandoff?"june's session":'shared playback'} on={speakerPlaying} locked={!perm.speakerHandoff && persona==='guest'}
                onClick={()=>{ if(!perm.speakerHandoff && persona==='guest') return blockedToast('Hand-off owner-only'); setSpeakerPlaying(v=>!v); showToast(`${!speakerPlaying?'Playing':'Paused'}`); }}/>
              <DeviceCard pal={pal} title="Air" icon="wave" value="312 ppm" sub="CO₂ rising" on={true}/>
              <DeviceCard pal={pal} title="Front door" icon={doorLocked?'lock':'unlock'} value={doorLocked?'locked':'unlocked'} sub={doorLocked?'secure · 2h':'open'} on={doorLocked} locked={!perm.lock}
                onClick={tryLock}/>
              <DeviceCard pal={pal} title="Camera" icon="cam" value={perm.cameras?'2 live':'hidden'} sub={perm.cameras?'front · garden':'no access'} on={perm.cameras} locked={!perm.cameras}
                onClick={()=>{ if(!perm.cameras) return blockedToast('Cameras owner-only'); setDock('cams'); }}/>
              <DeviceCard pal={pal} title="Smart plug" icon="plug" value="42W" sub="3 active · kitchen" on={true}/>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
            {perm.energy ? (
              <div style={{ ...card, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>Energy · today</div>
                  <div style={{ fontSize: 10.5, color: 'oklch(0.62 0.14 150)', fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>↘ 19%</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                  <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 50, letterSpacing: -0.4, lineHeight: 0.95 }}>{ENERGY.todayKwh.toFixed(2)}</div>
                  <div style={{ fontSize: 12, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>kWh</div>
                </div>
                <svg width="100%" height="56" viewBox="0 0 280 56" style={{ marginTop: 4 }}>
                  <path d={sparkPath(ENERGY.hourly, 280, 56, 4)} fill="none" stroke={pal.warm} strokeWidth="1.6" strokeLinejoin="round"/>
                  <line x1="0" x2="280" y1="42" y2="42" stroke={line} strokeDasharray="2 4"/>
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginTop: 2 }}>
                  <span>00</span><span>06</span><span>12</span><span>18</span><span>23</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: `0.5px solid ${line}` }}>
                  <Stat pal={pal} label="month" value={`${ENERGY.monthSoFar.toFixed(0)} / ${ENERGY.monthBudget}`} unit="kWh"/>
                  <Stat pal={pal} label="cost" value="€21.40" unit="-€4.10" right/>
                </div>
              </div>
            ) : (
              <div style={{ ...card, padding: 18 }}>
                <Glyph name="eyeoff" size={18} stroke={muted}/>
                <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 22, marginTop: 8 }}>Energy hidden</div>
                <div style={{ fontSize: 11.5, color: muted, marginTop: 4 }}>Bills are owner-only.</div>
              </div>
            )}

            <div style={{ ...card, padding: 16, flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>Activity</div>
                <div style={{ fontSize: 10.5, color: muted }}>last 4h</div>
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                {recentFor(perm).length ? recentFor(perm).map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderTop: i ? `0.5px solid ${line}` : 'none' }}>
                    <div style={{ width: 6, height: 6, borderRadius: 3, marginTop: 6, background: r.who === 'Auto' || r.who === 'System' ? pal.cool : pal.warm }}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, lineHeight: 1.3 }}><b style={{ fontWeight: 600 }}>{r.who}</b> {r.what}</div>
                      <div style={{ fontSize: 10.5, color: muted, marginTop: 1 }}>{r.where} · {r.t} ago</div>
                    </div>
                  </div>
                )) : (
                  <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>Nothing in shared rooms in the last 4h.</div>
                )}
              </div>
            </div>

            <button onClick={()=>{ if(!perm.addDevice) return blockedToast('Owner-only'); showToast('Pairing flow…'); }} className="int-press"
              style={{ height: 48, borderRadius: 24, background: perm.addDevice ? pal.ink : pal.surface2, color: perm.addDevice ? pal.bg : muted,
                border: `0.5px solid ${pal.line}`, fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: perm.addDevice ? 1 : 0.7 }}>
              <Glyph name={perm.addDevice?'plus2':'lock'} size={13} stroke={perm.addDevice ? pal.bg : muted}/>
              {perm.addDevice ? 'Add a device' : 'Adding devices is owner-only'}
            </button>
          </div>
        </div>
      )}

      {dock === 'devices' && <TabletDockDevices pal={pal} perm={perm} persona={persona} floorLamp={floorLamp} setFloorLamp={setFloorLamp} sconces={sconces} setSconces={setSconces} strip={strip} setStrip={setStrip} blinds={blinds} setBlinds={setBlinds} speakerPlaying={speakerPlaying} setSpeakerPlaying={setSpeakerPlaying} doorLocked={doorLocked} tryLock={tryLock} showToast={showToast}/>}
      {dock === 'voice' && <TabletDockVoice pal={pal} perm={perm}/>}
      {dock === 'cams' && <TabletDockCams pal={pal} perm={perm}/>}
      {dock === 'gear' && <TabletDockGear pal={pal} perm={perm} household={household} showToast={showToast}/>}

      {/* Bottom tab bar */}
      <div style={{ padding: '10px 28px 14px', display: 'flex', justifyContent: 'center', gap: 4, borderTop: `0.5px solid ${line}` }}>
        {TABS.map(tab => {
          const sel = tab.id === dock;
          return (
            <button key={tab.id} onClick={() => setDock(tab.id)} className="int-press" style={{
              height: 54, padding: '0 22px', borderRadius: 27,
              background: sel ? pal.warm : 'transparent',
              color: sel ? '#fff' : muted,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
            }}>
              <Glyph name={tab.icon} size={18} stroke={sel ? '#fff' : muted} sw={sel ? 1.8 : 1.5}/>
              <span style={{ fontSize: 9.5, fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '.04em', fontWeight: sel ? 600 : 400 }}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <Toast toast={toast} pal={pal}/>
      {personaOpen && <PersonaSwitcherModal pal={pal} persona={persona} onPersonaChange={onPersonaChange} onClose={() => setPersonaOpen(false)} />}
    </div>
  );
}

function chipBtn(pal) {
  return { width: 22, height: 22, borderRadius: 11, border: `0.5px solid ${pal.line}`, background: pal.surface, color: pal.ink, padding: 0, cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center' };
}

function FloorPlan({ pal, active, onPick, perm }) {
  const cells = [
    { id: 'living',  x: 0,   y: 0,   w: 60, h: 56, label: 'Living' },
    { id: 'kitchen', x: 60,  y: 0,   w: 40, h: 36, label: 'Kitchen' },
    { id: 'bed',     x: 0,   y: 56,  w: 44, h: 44, label: 'Bedroom' },
    { id: 'studio',  x: 60,  y: 36,  w: 40, h: 30, label: 'Studio' },
    { id: 'garden',  x: 44,  y: 66,  w: 56, h: 34, label: 'Garden' },
  ];
  const allowed = perm && perm.allowedRooms.length ? perm.allowedRooms : null;
  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      {cells.map(c => {
        const sel = c.id === active;
        const isAllowed = !allowed || allowed.includes(c.id);
        return (
          <g key={c.id} onClick={() => onPick(c.id)} style={{ cursor: 'pointer' }}>
            <rect x={c.x + 0.6} y={c.y + 0.6} width={c.w - 1.2} height={c.h - 1.2}
              fill={sel ? (pal.warm) : 'transparent'}
              stroke={sel ? pal.warm : pal.line}
              strokeWidth={sel ? 0.6 : 0.4} rx={1}
              opacity={isAllowed ? 1 : 0.35}
              strokeDasharray={isAllowed ? 'none' : '1.4 1.4'}/>
            <text x={c.x + c.w / 2} y={c.y + c.h / 2 + 1.4} textAnchor="middle"
              fill={sel ? '#fff' : pal.muted}
              opacity={isAllowed ? 1 : 0.5}
              style={{ fontSize: 4, fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '0.06em' }}>
              {c.label.toUpperCase()}
            </text>
          </g>
        );
      })}
      <circle cx="20" cy="22" r="1.4" fill={pal.warm}/>
      <circle cx="78" cy="50" r="1.4" fill="oklch(0.66 0.05 220)"/>
      <circle cx="74" cy="82" r="1.4" fill="oklch(0.78 0.10 30)"/>
    </svg>
  );
}

function DeviceCard({ pal, title, icon, value, sub, on, locked, onClick, children }) {
  return (
    <button onClick={onClick} className="int-press" style={{
      background: on ? pal.surface : pal.surface2,
      border: `0.5px solid ${pal.line}`,
      borderRadius: 18, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', color: pal.ink, opacity: locked ? 0.7 : 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 28, height: 28, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: on && !locked ? pal.warm : 'transparent', color: on && !locked ? '#fff' : pal.muted, border: on && !locked ? 'none' : `0.5px solid ${pal.line}` }}>
          <Glyph name={icon} size={14} stroke={on && !locked ? '#fff' : pal.muted} sw={1.5}/>
        </div>
        {locked ? <Glyph name="lock" size={12} stroke={pal.muted}/> : <div style={{ width: 6, height: 6, borderRadius: 3, background: on ? 'oklch(0.66 0.14 150)' : pal.faint }}/>}
      </div>
      <div>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 22, lineHeight: 1, marginTop: 10 }}>{value}</div>
        <div style={{ fontSize: 12, fontWeight: 500, marginTop: 6 }}>{title}</div>
        <div style={{ fontSize: 10.5, color: pal.muted, marginTop: 2, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{sub}</div>
        {children}
      </div>
    </button>
  );
}

function Stat({ pal, label, value, unit, right }) {
  return (
    <div style={{ textAlign: right ? 'right' : 'left' }}>
      <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: pal.muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 500, marginTop: 3 }}>{value}</div>
      <div style={{ fontSize: 10.5, color: pal.muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{unit}</div>
    </div>
  );
}

Object.assign(window, { TabletIntelliden, FloorPlan, DeviceCard, Stat });
