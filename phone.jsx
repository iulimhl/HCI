// phone.jsx — Intelliden phone dashboard with persona gating + live state.

function PhoneDockDevices({ pal, perm, household, blockedToast }) {
  const ink = pal.ink, muted = pal.muted, line = pal.line;
  const rooms = visibleRooms(perm);
  const allDevices = [
    { room: 'Living Room', devices: [
      { icon: 'bulb', name: 'Floor lamp', status: '64% · 2700K', on: true },
      { icon: 'lamp', name: 'Sconces', status: 'off', on: false },
      { icon: 'speak', name: 'Speaker', status: 'paused', on: false },
      { icon: 'blind', name: 'Blinds', status: '40% open', on: true },
    ]},
    { room: 'Kitchen', devices: [
      { icon: 'bulb', name: 'Pendants', status: 'on · 80%', on: true },
      { icon: 'plug', name: 'Coffee maker', status: 'standby · 3W', on: true },
      { icon: 'therm', name: 'Sensor', status: '22.1°', on: true },
    ]},
    { room: 'Bedroom', devices: [
      { icon: 'bulb', name: 'Bedside', status: 'off', on: false },
      { icon: 'blind', name: 'Blinds', status: 'closed', on: false },
      { icon: 'speak', name: 'Mini speaker', status: 'off', on: false },
    ]},
    { room: 'Studio', devices: [
      { icon: 'bulb', name: 'Desk array', status: 'on · 72%', on: true },
      { icon: 'plug', name: 'Monitor', status: 'on · 28W', on: true },
    ]},
    { room: 'Garden', devices: [
      { icon: 'bulb', name: 'Path lights', status: 'auto · dusk', on: false },
      { icon: 'cam', name: 'Garden cam', status: 'recording', on: true },
    ]},
  ];
  const filtered = perm.allowedRooms.length
    ? allDevices.filter(g => {
        const r = ROOMS.find(rm => rm.name === g.room);
        return r && perm.allowedRooms.includes(r.id);
      })
    : allDevices;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 28, lineHeight: 1 }}>Devices</div>
        <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>{filtered.reduce((a, g) => a + g.devices.length, 0)} devices · {filtered.length} rooms</div>
      </div>
      {filtered.map(g => (
        <div key={g.room}>
          <div style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginBottom: 8 }}>{g.room}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {g.devices.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 14, background: pal.surface, border: `0.5px solid ${line}` }}>
                <div style={{ width: 30, height: 30, borderRadius: 15, background: d.on ? pal.warm : 'transparent', border: d.on ? 'none' : `0.5px solid ${line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Glyph name={d.icon} size={14} stroke={d.on ? '#fff' : muted} sw={1.4}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{d.name}</div>
                  <div style={{ fontSize: 10.5, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{d.status}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: d.on ? 'oklch(0.66 0.14 150)' : pal.faint }}/>
              </div>
            ))}
          </div>
        </div>
      ))}
      {perm.addDevice && (
        <div style={{ padding: '14px 0', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: pal.warm, cursor: 'pointer' }}>
            <Glyph name="plus2" size={14} stroke={pal.warm}/> Add new device
          </div>
        </div>
      )}
    </div>
  );
}

function PhoneDockVoice({ pal, perm }) {
  const muted = pal.muted;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16, textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ width: 80, height: 80, borderRadius: 40, background: pal.warm, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px 12px ${pal.warm}44`, animation: 'int-pulse 2s ease-in-out infinite' }}>
        <Glyph name="mic" size={32} stroke="#fff" sw={1.6}/>
      </div>
      <div>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 28, lineHeight: 1 }}>Listening…</div>
        <div style={{ fontSize: 12, color: muted, marginTop: 8, lineHeight: 1.5 }}>Try saying:</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        {[
          '"Turn off all lights"',
          '"Set bedroom to 19 degrees"',
          '"Activate cinema scene"',
          '"Lock the front door"',
          '"What\'s the energy usage today?"',
        ].map((cmd, i) => (
          <div key={i} style={{ padding: '10px 14px', borderRadius: 12, background: pal.surface, border: `0.5px solid ${pal.line}`, fontSize: 12.5, color: pal.ink, fontStyle: 'italic', textAlign: 'left' }}>
            {cmd}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 10.5, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginTop: 8 }}>
        {perm.label} · {perm.allowedRooms.length ? perm.allowedRooms.length + ' rooms' : 'all rooms'}
      </div>
    </div>
  );
}

function PhoneDockCams({ pal, perm, blockedToast }) {
  const muted = pal.muted, line = pal.line;
  if (!perm.cameras) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 12, textAlign: 'center', padding: 40 }}>
        <Glyph name="eyeoff" size={32} stroke={muted}/>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 24, lineHeight: 1.1 }}>Cameras hidden</div>
        <div style={{ fontSize: 12, color: muted, lineHeight: 1.4 }}>Camera feeds are restricted for {perm.label.toLowerCase()} accounts. Ask the owner to share access.</div>
      </div>
    );
  }
  const feeds = [
    { name: 'Front door', location: 'Entrance', status: 'live', motion: false },
    { name: 'Garden', location: 'Backyard', status: 'live', motion: true },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 28, lineHeight: 1 }}>Cameras</div>
        <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>{feeds.length} feeds · all recording</div>
      </div>
      {feeds.map(f => (
        <div key={f.name} style={{ borderRadius: 18, overflow: 'hidden', background: pal.surface, border: `0.5px solid ${line}` }}>
          <div style={{ height: 140, background: `linear-gradient(135deg, oklch(0.18 0.02 260) 0%, oklch(0.12 0.015 260) 100%)`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Glyph name="cam" size={28} stroke="rgba(255,255,255,0.25)" sw={1.2}/>
            <div style={{ position: 'absolute', top: 10, left: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: 'oklch(0.60 0.20 25)', animation: 'int-pulse 1.5s ease-in-out infinite' }}/>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '.06em', textTransform: 'uppercase' }}>rec</span>
            </div>
            <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>9:24:08</div>
            {f.motion && <div style={{ position: 'absolute', bottom: 10, left: 12, padding: '3px 8px', borderRadius: 6, background: 'oklch(0.50 0.18 60)', fontSize: 10, fontWeight: 600, color: '#fff', fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>MOTION</div>}
          </div>
          <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{f.name}</div>
              <div style={{ fontSize: 10.5, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{f.location}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 15, border: `0.5px solid ${line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Glyph name="speak" size={13} stroke={muted}/>
              </div>
              <div style={{ width: 30, height: 30, borderRadius: 15, border: `0.5px solid ${line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Glyph name="eye" size={13} stroke={muted}/>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PhoneDockGear({ pal, perm, household, persona, blockedToast }) {
  const muted = pal.muted, line = pal.line;
  const member = household.members.find(m => m.here) || household.members[0];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 28, lineHeight: 1 }}>Settings</div>
        <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>{household.home} · {perm.label}</div>
      </div>

      {/* Profile */}
      <div style={{ padding: 14, borderRadius: 16, background: pal.surface, border: `0.5px solid ${line}`, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: member.tint, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{member.mono}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{member.name}</div>
          <div style={{ fontSize: 11, color: muted }}>{member.role} · {household.home}</div>
        </div>
        <Glyph name="arrow" size={14} stroke={muted}/>
      </div>

      {/* Sections */}
      <div style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>Home</div>
      {[
        { icon: 'home', label: 'Home settings', sub: 'Name, address, timezone', need: 'routines' },
        { icon: 'wifi', label: 'Network', sub: '14 devices connected', need: null },
        { icon: 'gear', label: 'Routines & automations', sub: perm.routines ? '6 active' : 'Owner-only', need: 'routines' },
        { icon: 'crown', label: 'Permissions', sub: perm.routines ? '3 roles configured' : 'Owner-only', need: 'routines' },
      ].map(item => {
        const locked = item.need && !perm[item.need];
        return (
          <div key={item.label} onClick={() => locked && blockedToast(`${item.label} is owner-only`)} style={{
            padding: '12px 14px', borderRadius: 14, background: pal.surface, border: `0.5px solid ${line}`,
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', opacity: locked ? 0.6 : 1,
          }}>
            <Glyph name={locked ? 'lock' : item.icon} size={16} stroke={locked ? muted : pal.ink}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
              <div style={{ fontSize: 10.5, color: muted }}>{item.sub}</div>
            </div>
            <Glyph name="arrow" size={12} stroke={muted}/>
          </div>
        );
      })}

      <div style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginTop: 6 }}>System</div>
      {[
        { icon: 'gear', label: 'Firmware updates', sub: 'All up to date' },
        { icon: 'wave', label: 'Air quality alerts', sub: 'CO₂ > 800 ppm' },
        { icon: 'eye', label: 'Privacy & data', sub: 'Local processing only' },
      ].map(item => (
        <div key={item.label} style={{ padding: '12px 14px', borderRadius: 14, background: pal.surface, border: `0.5px solid ${line}`, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <Glyph name={item.icon} size={16} stroke={pal.ink}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
            <div style={{ fontSize: 10.5, color: muted }}>{item.sub}</div>
          </div>
          <Glyph name="arrow" size={12} stroke={muted}/>
        </div>
      ))}

      <div style={{ textAlign: 'center', padding: '10px 0', fontSize: 10.5, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
        Intelliden v4.2 · build 2024.05.09
      </div>
    </div>
  );
}

function PhoneIntelliden({ pal, household, perm, persona, onPersonaChange }) {
  const [scene, setScene] = React.useState(perm.allowedScenes.length ? perm.allowedScenes[0] : 'focus');
  const [livLamp, setLivLamp] = React.useState(true);
  const [livLampPct, setLivLampPct] = React.useState(64);
  const [livTherm, setLivTherm] = React.useState(21.4);
  const [livBlinds, setLivBlinds] = React.useState(40);
  const [doorLocked, setDoorLocked] = React.useState(true);
  const [speakerPlaying, setSpeakerPlaying] = React.useState(false);
  const [personaOpen, setPersonaOpen] = React.useState(false);
  const [room, setRoom] = React.useState(perm.allowedRooms.length ? perm.allowedRooms[0] : 'living');
  const [dock, setDock] = React.useState('home');
  const [toast, showToast] = useToast();

  const isDark = pal.mode === 'dark';
  const ink = pal.ink, muted = pal.muted, line = pal.line;
  const surface = pal.surface, surface2 = pal.surface2;
  const card = { background: surface, borderRadius: 22, border: `0.5px solid ${line}`, padding: 18, boxSizing: 'border-box' };

  const scenesList = visibleScenes(perm);
  const sceneObj = SCENES.find(s => s.id === scene) || scenesList[0];
  const roomData = ROOMS.find(r => r.id === room) || ROOMS[0];
  const recent = recentFor(perm);
  const blockedToast = (msg) => showToast(msg, 'blocked');

  React.useEffect(() => {
    const p = SCENE_PRESETS[scene];
    if (p) {
      setLivLampPct(p.lampPct);
      setLivLamp(p.lampPct > 0);
      setLivTherm(p.thermTarget);
      setLivBlinds(p.blinds);
      setSpeakerPlaying(p.speakerPlaying);
    }
  }, [scene]);

  React.useEffect(() => {
    if (perm.allowedRooms.length && !perm.allowedRooms.includes(room)) setRoom(perm.allowedRooms[0]);
  }, [persona]);

  const pickScene = (s) => {
    if (perm.blockedScenes.includes(s.id)) return blockedToast(`${s.name} is owner-only`);
    if (perm.allowedScenes.length && !perm.allowedScenes.includes(s.id)) return blockedToast(`${s.name} not shared with guests`);
    setScene(s.id);
    showToast(`${s.name} scene set`);
  };
  const tryToggleLamp = () => { setLivLamp(v => !v); showToast(`Floor lamp ${!livLamp ? 'on' : 'off'}`); };
  const tryThermBump = (d) => {
    if (!perm.thermostat) return blockedToast('Thermostat is locked for guests');
    const next = +(livTherm + d).toFixed(1);
    setLivTherm(next); showToast(`Set to ${next.toFixed(1)}°`);
  };
  const tryBlinds = (v) => { setLivBlinds(v); };
  const tryLock = () => {
    if (!perm.lock) return blockedToast('Door is owner-only');
    setDoorLocked(v => !v); showToast(`Door ${!doorLocked ? 'locked' : 'unlocked'}`);
  };
  const trySpeaker = () => {
    if (!perm.speakerHandoff && persona === 'guest') return blockedToast('Speaker is restricted');
    setSpeakerPlaying(v => !v); showToast(`Speaker ${!speakerPlaying ? 'playing' : 'paused'}`);
  };

  const dockTitle = { home: 'Home', devices: 'Devices', voice: 'Voice', cams: 'Cameras', gear: 'Settings' };

  return (
    <div style={{
      width: '100%', height: '100%', background: pal.bg, color: ink,
      fontFamily: '"Geist", -apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      <IOSStatusBar dark={isDark} time="9:24" />

      {/* Header */}
      <div style={{ padding: '6px 22px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: perm.tone, boxShadow: `0 0 0 4px ${perm.tone.replace(')', ' / 0.15)')}` }}/>
            <span>Intelliden</span>
          </div>
          <button onClick={() => setPersonaOpen(true)} className="int-press" style={{
            height: 24, padding: '0 9px', borderRadius: 12,
            background: perm.tone.replace(')', ' / 0.12)'), border: `1px solid ${perm.tone.replace(')', ' / 0.25)')}`,
            color: perm.tone, fontSize: 10, fontWeight: 600,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            letterSpacing: '.08em', textTransform: 'uppercase',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 3, background: perm.tone }} />
            {perm.label}
          </button>
        </div>
        {dock === 'home' && (
          <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 36, lineHeight: 1.0, letterSpacing: -0.4 }}>
                {household.home}
              </div>
              <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>{household.address}</div>
            </div>
            <Avatars members={household.members} pal={pal} max={3}/>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px 26px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {dock === 'home' && (
          <React.Fragment>
            {/* Hero scene */}
            <div style={{ ...card, padding: 0, overflow: 'hidden', position: 'relative', background: pal.warm + (isDark ? '20' : '14') }}>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>Active scene</div>
                    <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 38, lineHeight: 1, marginTop: 4 }}>{sceneObj.name}.</div>
                    <div style={{ fontSize: 11.5, color: muted, marginTop: 4 }}>{sceneObj.trigger}</div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 22, background: pal.warm, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Glyph name={sceneObj.glyph} size={20} stroke="#fff" sw={1.6}/>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
                  {SCENES.map(s => {
                    const blocked = perm.blockedScenes.includes(s.id) || (perm.allowedScenes.length && !perm.allowedScenes.includes(s.id));
                    const sel = s.id === scene;
                    return (
                      <button key={s.id} onClick={() => pickScene(s)} className="int-press" style={{
                        flex: '0 0 auto', height: 30, padding: '0 11px', borderRadius: 15,
                        border: `0.5px solid ${sel ? ink : line}`,
                        background: sel ? ink : 'transparent',
                        color: sel ? pal.bg : (blocked ? muted : ink),
                        fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
                        display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer',
                        opacity: blocked ? 0.5 : 1,
                      }}>
                        <Glyph name={blocked ? 'lock' : s.glyph} size={11}/>
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Tile pal={pal} icon="bulb" label="Floor lamp" sub={livLamp ? `${livLampPct}% · 2700K` : 'off'}
                on={livLamp} onClick={tryToggleLamp}>
                {livLamp && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 6, alignItems: 'center' }}>
                    <button onClick={(e)=>{e.stopPropagation();setLivLampPct(Math.max(5,livLampPct-10));showToast(`Lamp ${Math.max(5,livLampPct-10)}%`);}} style={miniBtn(pal)}>−</button>
                    <div style={{ flex: 1, height: 3, background: pal.line, borderRadius: 2 }}>
                      <div style={{ width: `${livLampPct}%`, height: '100%', background: pal.warm, borderRadius: 2 }}/>
                    </div>
                    <button onClick={(e)=>{e.stopPropagation();setLivLampPct(Math.min(100,livLampPct+10));showToast(`Lamp ${Math.min(100,livLampPct+10)}%`);}} style={miniBtn(pal)}>+</button>
                  </div>
                )}
              </Tile>
              <Tile pal={pal} icon="therm" label="Thermostat" sub={`${livTherm.toFixed(1)}° · ${perm.thermostat?'auto':'view only'}`}
                on={true} accent={pal.warm} locked={!perm.thermostat} onClick={()=>!perm.thermostat&&blockedToast('Thermostat owner-only')}>
                {perm.thermostat && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    <button onClick={(e)=>{e.stopPropagation();tryThermBump(-0.5);}} style={miniBtn(pal)}>−</button>
                    <button onClick={(e)=>{e.stopPropagation();tryThermBump(0.5);}} style={miniBtn(pal)}>+</button>
                  </div>
                )}
              </Tile>
              <Tile pal={pal} icon="blind" label="Blinds" sub={`${livBlinds}% open`} on={livBlinds > 0}>
                <input type="range" min="0" max="100" value={livBlinds} onChange={(e)=>tryBlinds(+e.target.value)} onClick={(e)=>e.stopPropagation()}
                  style={{ width: '100%', marginTop: 4, accentColor: pal.warm }}/>
              </Tile>
              <Tile pal={pal} icon={doorLocked?'lock':'unlock'} label="Front door" sub={doorLocked?'locked · 2h':'unlocked'} on={doorLocked} accent={pal.cool}
                locked={!perm.lock} onClick={tryLock}/>
              <Tile pal={pal} icon={speakerPlaying?'pause':'play'} label="Speaker" sub={speakerPlaying?'playing':'paused'}
                on={speakerPlaying} locked={!perm.speakerHandoff && persona==='guest'} onClick={trySpeaker}/>
              <Tile pal={pal} icon="wave" label="Air quality" sub="312 ppm · CO₂" on={true}/>
              <Tile pal={pal} icon="cam" label="Camera" sub={perm.cameras ? '2 live · front' : 'hidden'}
                on={perm.cameras} locked={!perm.cameras} onClick={() => perm.cameras ? setDock('cams') : blockedToast('Cameras owner-only')}/>
              <Tile pal={pal} icon="plug" label="Smart plug" sub="3 active · 42W" on={true}/>
            </div>

            {/* Energy */}
            {perm.energy ? (
              <div style={{ ...card, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>Energy today</div>
                  <div style={{ fontSize: 10.5, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{ENERGY.todayKwh.toFixed(2)} kWh · ↘ 19%</div>
                </div>
                <div style={{ width: 80, height: 24 }}>
                  <svg width="80" height="24" viewBox="0 0 80 24">
                    <path d={sparkPath(ENERGY.hourly, 80, 24, 2)} fill="none" stroke={pal.warm} strokeWidth="1.2" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ) : (
              <div style={{ ...card, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Glyph name="eyeoff" size={14} stroke={muted}/>
                <div style={{ fontSize: 12, color: muted }}>Energy data is owner-only</div>
              </div>
            )}

            {/* Rooms */}
            <div style={{ ...card, padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
                  {roomData.name} · {roomData.temp.toFixed(1)}° · {roomData.devices} dev
                </div>
                <Glyph name="arrow" size={13} stroke={muted}/>
              </div>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                {ROOMS.map((r) => {
                  const allowed = !perm.allowedRooms.length || perm.allowedRooms.includes(r.id);
                  const sel = r.id === room;
                  return (
                    <div key={r.id} onClick={() => { if (!allowed) return blockedToast(`${r.name} not shared`); setRoom(r.id); showToast(`${r.name}`); }} style={{
                      flex: '0 0 auto', width: 102, padding: 11, borderRadius: 13,
                      background: sel && allowed ? pal.ink : surface2,
                      color: sel && allowed ? pal.bg : ink,
                      border: sel && allowed ? 'none' : `0.5px solid ${line}`,
                      display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer',
                      opacity: allowed ? 1 : 0.45, position: 'relative',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', opacity: 0.6, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{r.area}m²</div>
                        {!allowed && <Glyph name="lock" size={11} stroke="currentColor"/>}
                      </div>
                      <div>
                        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 20, lineHeight: 1 }}>{r.name}</div>
                        <div style={{ fontSize: 10.5, opacity: 0.65, marginTop: 3 }}>{allowed ? `${r.devices} dev · ${r.temp.toFixed(1)}°` : 'restricted'}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity */}
            {recent.length > 0 ? (
              <div style={{ ...card, padding: 14, flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>Activity{persona==='guest'?' · shared':''}</div>
                  <div style={{ fontSize: 10.5, color: muted }}>last 4h</div>
                </div>
                {recent.slice(0, 3).map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: i ? `0.5px solid ${line}` : 'none' }}>
                    <Avatar mono={r.who.slice(0,2).toUpperCase()} pal={pal} who={r.who}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, lineHeight: 1.3 }}><b style={{ fontWeight: 600 }}>{r.who}</b> {r.what}</div>
                      <div style={{ fontSize: 10.5, color: muted, marginTop: 1 }}>{r.where}</div>
                    </div>
                    <div style={{ fontSize: 10.5, color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{r.t}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ ...card, padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Glyph name="eyeoff" size={20} stroke={muted}/>
                <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 22, marginTop: 10, lineHeight: 1.1 }}>Activity hidden</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 6, lineHeight: 1.4 }}>Guests don't see who's been doing what. {perm.statement}</div>
              </div>
            )}
          </React.Fragment>
        )}

        {dock === 'devices' && <PhoneDockDevices pal={pal} perm={perm} household={household} blockedToast={blockedToast}/>}
        {dock === 'voice' && <PhoneDockVoice pal={pal} perm={perm}/>}
        {dock === 'cams' && <PhoneDockCams pal={pal} perm={perm} blockedToast={blockedToast}/>}
        {dock === 'gear' && <PhoneDockGear pal={pal} perm={perm} household={household} persona={persona} blockedToast={blockedToast}/>}
      </div>

      <Toast toast={toast} pal={pal}/>

      {personaOpen && <PersonaSwitcherModal pal={pal} persona={persona} onPersonaChange={onPersonaChange} onClose={() => setPersonaOpen(false)} />}

      {/* Dock */}
      <div style={{ padding: '0 16px 28px' }}>
        <div style={{
          height: 54, borderRadius: 27, background: pal.ink, color: pal.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 12px',
        }}>
          {[
            { i: 'home',  k: 'home' },
            { i: 'wifi',  k: 'devices' },
            { i: 'mic',   k: 'voice', big: true },
            { i: 'cam',   k: 'cams', perm: 'cameras' },
            { i: 'gear',  k: 'gear' },
          ].map((b) => {
            const blocked = b.perm && !perm[b.perm];
            if (b.big) return (
              <button key={b.k} onClick={()=>{setDock('voice');}} className="int-press" style={{ width: 44, height: 44, borderRadius: 22, background: dock === 'voice' ? '#fff' : pal.warm, color: dock === 'voice' ? pal.warm : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                <Glyph name="mic" size={19} stroke={dock === 'voice' ? pal.warm : '#fff'} sw={1.6}/>
              </button>
            );
            return (
              <button key={b.k} onClick={()=>{ if (blocked) return blockedToast(`Restricted for ${perm.label.toLowerCase()}`); setDock(b.k); }} className="int-press"
                style={{ width: 36, height: 36, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: blocked ? 0.32 : (dock === b.k ? 1 : 0.55), background: dock === b.k ? 'rgba(255,255,255,0.14)' : 'transparent',
                  border: 'none', color: pal.bg, cursor: 'pointer' }}>
                <Glyph name={blocked ? 'lock' : b.i} size={17} stroke={pal.bg}/>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function miniBtn(pal) {
  return { width: 22, height: 22, borderRadius: 11, border: `0.5px solid ${pal.line}`, background: pal.surface2, color: pal.ink, fontSize: 13, lineHeight: 1, cursor: 'pointer', fontFamily: 'inherit', padding: 0 };
}

function Tile({ pal, icon, label, sub, on, accent, locked, onClick, children }) {
  const c = accent || pal.warm;
  return (
    <button onClick={onClick} className="int-press" style={{
      textAlign: 'left', minHeight: 96, padding: 12, borderRadius: 16,
      background: on ? pal.surface : pal.surface2,
      border: `0.5px solid ${pal.line}`,
      color: pal.ink, cursor: 'pointer', fontFamily: 'inherit',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      position: 'relative', overflow: 'hidden', opacity: locked ? 0.78 : 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ width: 26, height: 26, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: on && !locked ? c : 'transparent', color: on && !locked ? '#fff' : pal.muted, border: on && !locked ? 'none' : `0.5px solid ${pal.line}` }}>
          <Glyph name={icon} size={14} stroke={on && !locked ? '#fff' : pal.muted} sw={1.5}/>
        </div>
        {locked ? <Glyph name="lock" size={12} stroke={pal.muted}/> : <div style={{ width: 6, height: 6, borderRadius: 3, background: on ? pal.warm : pal.faint }}/>}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: pal.muted, marginTop: 2, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>{sub}</div>
        {children}
      </div>
    </button>
  );
}

function Avatar({ mono, pal, who, size = 26 }) {
  const allMembers = HOUSEHOLDS.owner.members.concat(HOUSEHOLDS.family.members, HOUSEHOLDS.guest.members);
  const m = allMembers.find(x => x.name.startsWith(who));
  const tint = m ? m.tint : pal.warm;
  return (
    <div style={{
      width: size, height: size, borderRadius: size/2,
      background: pal.mode === 'dark' ? 'oklch(0.28 0.02 260)' : 'oklch(0.92 0.018 80)',
      color: pal.ink, fontSize: size * 0.36, fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: `1.5px solid ${tint}`, fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      letterSpacing: '0.02em',
    }}>{mono}</div>
  );
}

function Avatars({ members, pal, max = 4, size = 28 }) {
  const shown = members.slice(0, max);
  return (
    <div style={{ display: 'flex' }}>
      {shown.map((m, i) => (
        <div key={m.id} style={{ marginLeft: i ? -8 : 0, position: 'relative' }}>
          <div style={{
            width: size, height: size, borderRadius: size/2,
            background: m.here ? m.tint : (pal.mode === 'dark' ? 'oklch(0.28 0.02 260)' : 'oklch(0.92 0.018 80)'),
            color: m.here ? '#fff' : pal.muted,
            border: `1.5px solid ${pal.bg}`,
            fontSize: size * 0.34, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            opacity: m.here ? 1 : 0.55,
          }}>{m.mono}</div>
          {m.here && <div style={{ position: 'absolute', right: -1, bottom: -1, width: 8, height: 8, borderRadius: 4, background: 'oklch(0.66 0.15 150)', border: `1.5px solid ${pal.bg}` }}/>}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { PhoneIntelliden, Tile, Avatar, Avatars });
