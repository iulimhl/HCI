// tablet.jsx — Intelliden tablet dashboard with persona gating + interactivity.

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
  const [toast, showToast] = useToast();

  const ink = pal.ink, muted = pal.muted, line = pal.line;
  const surface = pal.surface, surface2 = pal.surface2;
  const card = { background: surface, borderRadius: 24, border: `0.5px solid ${line}`, boxSizing: 'border-box' };
  const isDark = pal.mode === 'dark';

  const roomData = ROOMS.find(r => r.id === room) || ROOMS[0];
  const sceneObj = SCENES.find(s => s.id === scene);
  const blockedToast = (m) => showToast(m, 'blocked');

  // Sync room / scene if persona switch invalidates them
  React.useEffect(() => {
    if (perm.allowedRooms.length && !perm.allowedRooms.includes(room)) setRoom(perm.allowedRooms[0]);
    if (perm.allowedScenes.length && !perm.allowedScenes.includes(scene)) setScene(perm.allowedScenes[0]);
    if (perm.blockedScenes.includes(scene)) setScene(visibleScenes(perm)[0]?.id || 'focus');
  }, [persona]);

  // Scene presets — update device states when scene changes
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
          <button onClick={() => setPersonaOpen(true)} className="int-press" style={{ marginLeft: 6, padding: '3px 10px', borderRadius: 8, background: perm.tone+'22', color: perm.tone, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', border: `1px solid ${perm.tone}44`, cursor: 'pointer', fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
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

      <div style={{ flex: 1, padding: '20px 24px 24px', display: 'grid', gridTemplateColumns: '300px 1fr 300px', gap: 18, minHeight: 0 }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <div>
            <div style={{ fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>This home</div>
            <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 50, lineHeight: 1, letterSpacing: -0.6, marginTop: 4 }}>
              {household.home}.
            </div>
            <div style={{ fontSize: 12, color: muted, marginTop: 6 }}>{household.address}</div>
            <div style={{ marginTop: 10, padding: 10, borderRadius: 12, background: perm.tone+'18', borderLeft: `2px solid ${perm.tone}`, fontSize: 12, lineHeight: 1.4, color: ink }}>
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

            <div style={{ display: 'flex', gap: 6, marginTop: 18, flexWrap: 'wrap' }}>
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
              onClick={()=>!perm.cameras&&blockedToast('Cameras owner-only')}/>
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
