// phone.jsx — Intelliden phone dashboard with persona gating + live state.

function PhoneIntelliden({ pal, household, perm, persona }) {
  const [scene, setScene] = React.useState(perm.allowedScenes.length ? perm.allowedScenes[0] : 'focus');
  const [livLamp, setLivLamp] = React.useState(true);
  const [livLampPct, setLivLampPct] = React.useState(64);
  const [livTherm, setLivTherm] = React.useState(21.4);
  const [livBlinds, setLivBlinds] = React.useState(40);
  const [doorLocked, setDoorLocked] = React.useState(true);
  const [dock, setDock] = React.useState('home');
  const [toast, showToast] = useToast();

  const isDark = pal.mode === 'dark';
  const ink = pal.ink, muted = pal.muted, line = pal.line;
  const surface = pal.surface, surface2 = pal.surface2;
  const card = { background: surface, borderRadius: 22, border: `0.5px solid ${line}`, padding: 18, boxSizing: 'border-box' };

  const scenesList = visibleScenes(perm);
  const sceneObj = SCENES.find(s => s.id === scene) || scenesList[0];
  const recent = recentFor(perm);
  const blockedToast = (msg) => showToast(msg, 'blocked');

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: perm.tone, boxShadow: `0 0 0 4px ${perm.tone}25` }}/>
          <span>Intelliden · {household.badge}</span>
        </div>
        <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 36, lineHeight: 1.0, letterSpacing: -0.4 }}>
              {household.home}
            </div>
            <div style={{ fontSize: 12, color: muted, marginTop: 4 }}>{household.address}</div>
          </div>
          <Avatars members={household.members} pal={pal} max={3}/>
        </div>

      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 16px 26px', display: 'flex', flexDirection: 'column', gap: 10 }}>

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
        </div>

        {/* Rooms */}
        <div style={{ ...card, padding: '12px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: muted, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
              Rooms · {visibleRooms(perm).length}{perm.allowedRooms.length ? ` of ${ROOMS.length}` : ''}
            </div>
            <Glyph name="arrow" size={13} stroke={muted}/>
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {ROOMS.map((r, i) => {
              const allowed = !perm.allowedRooms.length || perm.allowedRooms.includes(r.id);
              return (
                <div key={r.id} onClick={()=>!allowed&&blockedToast(`${r.name} not shared`)} style={{
                  flex: '0 0 auto', width: 102, padding: 11, borderRadius: 13,
                  background: i === 0 && allowed ? pal.ink : surface2,
                  color: i === 0 && allowed ? pal.bg : ink,
                  border: i === 0 && allowed ? 'none' : `0.5px solid ${line}`,
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

        {/* Activity (or guest notice) */}
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
      </div>

      <Toast toast={toast} pal={pal}/>

      {/* Dock */}
      <div style={{ padding: '0 16px 28px' }}>
        <div style={{
          height: 54, borderRadius: 27, background: pal.ink, color: pal.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 12px',
        }}>
          {[
            { i: 'home',  k: 'home' },
            { i: 'wifi',  k: 'devices', perm: 'addDevice' },
            { i: 'mic',   k: 'voice', big: true },
            { i: 'cam',   k: 'cams', perm: 'cameras' },
            { i: 'gear',  k: 'gear', perm: 'routines' },
          ].map((b) => {
            const blocked = b.perm && !perm[b.perm];
            if (b.big) return (
              <button key={b.k} onClick={()=>{setDock('voice');showToast('Listening…');}} className="int-press" style={{ width: 44, height: 44, borderRadius: 22, background: pal.warm, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                <Glyph name="mic" size={19} stroke="#fff" sw={1.6}/>
              </button>
            );
            return (
              <button key={b.k} onClick={()=>{ if (blocked) return blockedToast(`Restricted for ${perm.label.toLowerCase()}`); setDock(b.k); showToast(`Opened ${b.k}`); }} className="int-press"
                style={{ width: 36, height: 36, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: blocked ? 0.32 : (dock === b.k ? 1 : 0.6), background: dock === b.k ? 'rgba(255,255,255,0.1)' : 'transparent',
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
