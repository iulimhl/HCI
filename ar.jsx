// ar.jsx — Intelliden AR spatial view with persona gating + interactivity.

function ARIntelliden({ pal, household, perm, persona }) {
  const [focus, setFocus] = React.useState('lamp');
  const [scene, setScene] = React.useState(perm.allowedScenes.length ? perm.allowedScenes[0] : 'focus');
  const [lampPct, setLampPct] = React.useState(64);
  const [thermTarget, setThermTarget] = React.useState(21.5);
  const [blinds, setBlinds] = React.useState(40);
  const [speakerPlaying, setSpeakerPlaying] = React.useState(false);
  const [toast, showToast] = useToast();

  const room = AR_BG[pal.time] || AR_BG.day;
  const blockedToast = (m) => showToast(m, 'blocked');

  React.useEffect(() => {
    if (perm.allowedScenes.length && !perm.allowedScenes.includes(scene)) setScene(perm.allowedScenes[0]);
    if (perm.blockedScenes.includes(scene)) setScene(visibleScenes(perm)[0]?.id || 'focus');
  }, [persona]);

  const pickScene = (s) => {
    if (perm.blockedScenes.includes(s.id)) return blockedToast(`${s.name} owner-only`);
    if (perm.allowedScenes.length && !perm.allowedScenes.includes(s.id)) return blockedToast(`${s.name} not shared`);
    setScene(s.id); showToast(`Scene · ${s.name}`);
  };
  const lampStep = (d) => { const n = Math.max(0, Math.min(100, lampPct + d)); setLampPct(n); showToast(`Lamp ${n}%`); };
  const thermStep = (d) => { if (!perm.thermostat) return blockedToast('Climate owner-only'); const n = +(thermTarget+d).toFixed(1); setThermTarget(n); showToast(`Target ${n}°`); };
  const speakerToggle = () => { if (!perm.speakerHandoff && persona==='guest') return blockedToast('Hand-off owner-only'); setSpeakerPlaying(v=>!v); showToast(speakerPlaying?'Paused':'Playing'); };

  const sceneObj = SCENES.find(s=>s.id===scene);

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      fontFamily: '"Geist", -apple-system, system-ui, sans-serif', color: '#fff',
      background: room.bg, WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Architecture */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', left: '6%', top: '8%', width: '34%', height: '60%',
          background: room.window, borderRadius: 4, boxShadow: `0 0 200px 60px ${room.windowGlow}` }}/>
        <div style={{ position: 'absolute', left: '10%', top: '12%', width: '26%', height: '52%',
          border: `0.5px solid ${room.frame}`, borderTop: 'none', borderBottom: 'none' }}/>
        <div style={{ position: 'absolute', left: '23%', top: '12%', width: '0.5px', height: '52%', background: room.frame }}/>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '34%', background: room.floor }}/>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '66%', height: '0.5px', background: room.line }}/>
        <div style={{ position: 'absolute', left: '52%', top: '24%', width: '2px', height: '46%', background: room.lamp, transform: 'rotate(2deg)', borderRadius: 2 }}/>
        <div style={{ position: 'absolute', left: '50%', top: '22%', width: 24, height: 24, borderRadius: 12, background: pal.warm, boxShadow: `0 0 ${80*lampPct/64}px 24px ${pal.warm}66, 0 0 200px 60px ${pal.warm}33`, opacity: lampPct/100 + 0.2 }}/>
        <div style={{ position: 'absolute', left: '60%', top: '60%', width: '32%', height: '20%', background: room.sofa, borderRadius: 6 }}/>
      </div>

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
          <span style={{ marginLeft: 4, padding: '3px 8px', borderRadius: 8, background: perm.tone+'30', color: '#fff', letterSpacing: '.08em' }}>{household.badge}</span>
        </div>
        <div style={{ display: 'flex', gap: 22, opacity: 0.78 }}>
          <span>FOV 110°</span>
          <span>tracking · ok</span>
          <span>Living room · pinned {perm.allowedRooms.length?2:4}</span>
          <span>{pal.todLabel}</span>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '7%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
        <div style={{ fontSize: 10.5, letterSpacing: '.24em', textTransform: 'uppercase', opacity: 0.6, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>You are looking into</div>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 50, lineHeight: 1, marginTop: 4, letterSpacing: -0.4 }}>The Living Room</div>
      </div>

      {/* Anchored panels — gated per persona */}
      <ARPanel pal={pal} x="44%" y="22%" anchor="bottom-right" pin="Floor lamp" focused={focus==='lamp'}
        title="Floor lamp" big={`${lampPct}%`} sub="warm 2700K" onPick={()=>setFocus('lamp')}>
        <div style={{ display:'flex', gap:6, marginTop:8 }}>
          <button onClick={(e)=>{e.stopPropagation();lampStep(-10);}} style={panelBtn()}>−10%</button>
          <button onClick={(e)=>{e.stopPropagation();lampStep(10);}} style={panelBtn()}>+10%</button>
        </div>
      </ARPanel>


      <ARPanel pal={pal} x="76%" y="36%" anchor="left" pin="Climate" focused={focus==='therm'}
        title="Thermostat" big={`${thermTarget.toFixed(1)}°`} sub={perm.thermostat?'auto · sun-aware':'view only · owner-only'} onPick={()=>setFocus('therm')} locked={!perm.thermostat}>
        {perm.thermostat ? (
          <div style={{ display:'flex', gap:6, marginTop:8 }}>
            <button onClick={(e)=>{e.stopPropagation();thermStep(-0.5);}} style={panelBtn()}>−0.5°</button>
            <button onClick={(e)=>{e.stopPropagation();thermStep(0.5);}} style={panelBtn()}>+0.5°</button>
          </div>
        ) : null}
      </ARPanel>

      <ARPanel pal={pal} x="14%" y="44%" anchor="right" pin="Blinds" focused={focus==='blinds'}
        title="Blinds" big={`${blinds}%`} sub="auto-tracking sun" onPick={()=>setFocus('blinds')}>
        <input type="range" min="0" max="100" value={blinds} onChange={(e)=>setBlinds(+e.target.value)} onClick={(e)=>e.stopPropagation()} style={{ width:'100%', marginTop:8, accentColor: pal.warm }}/>
      </ARPanel>

      <ARPanel pal={pal} x="68%" y="68%" anchor="top-left" pin="Speaker" focused={focus==='speaker'}
        title="Speaker" big={speakerPlaying?'playing':'paused'} sub={perm.speakerHandoff?"june's session":'shared playback'} onPick={()=>setFocus('speaker')} locked={!perm.speakerHandoff && persona==='guest'}>
        <button onClick={(e)=>{e.stopPropagation();speakerToggle();}} style={panelBtn()}><Glyph name={speakerPlaying?'pause':'play'} size={11}/> {speakerPlaying?'Pause':'Play'}</button>
      </ARPanel>

      {/* Mini-map */}
      <div style={{ position: 'absolute', bottom: 32, left: 32, width: 220,
        background: 'rgba(20,16,12,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 12 }}>
        <div style={{ fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.6, fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>Home · {household.home}</div>
        <div style={{ marginTop: 8, height: 110 }}>
          <FloorPlan pal={{ ...pal, line: 'rgba(255,255,255,0.18)', muted: 'rgba(255,255,255,0.6)', warm: pal.warm }} active="living" onPick={() => {}} perm={perm}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, opacity: 0.6, fontFamily: '"JetBrains Mono", ui-monospace, monospace', marginTop: 4 }}>
          <span>{visibleRooms(perm).length} rooms</span><span>{perm.energy?'32':'2'} devices</span>
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
        <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.14)', margin: '0 4px' }}/>
        <div style={{ height: 36, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.78)', fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '.04em' }}>
          <Glyph name="hand" size={13} stroke="currentColor"/> pinch · drag · gaze
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
      </div>

      {/* Reticle */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 22, height: 22, borderRadius: 11, border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 0 0 4px rgba(255,255,255,0.06)', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 9, borderRadius: 2, background: 'rgba(255,255,255,0.85)' }}/>
      </div>

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

function ARPanel({ pal, x, y, anchor, pin, title, big, sub, focused, onPick, locked, children }) {
  const [a] = (anchor || 'top-left').split('-');
  return (
    <div onClick={onPick} style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', cursor: 'pointer' }}>
      <div style={{ position: 'absolute',
        width: 1, height: 36, background: 'rgba(255,255,255,0.35)',
        left: a === 'left' ? -36 : (a === 'right' ? 'calc(100% + 36px)' : '50%'),
        top: a === 'top' ? -36 : (a === 'bottom' ? 'calc(100% + 36px)' : '50%'),
        transform: a === 'left' || a === 'right' ? 'rotate(90deg)' : 'none' }}/>
      <div className={focused ? 'int-fadein' : ''} style={{
        background: focused ? 'rgba(28,22,16,0.78)' : 'rgba(20,16,12,0.55)',
        backdropFilter: 'blur(24px) saturate(160%)', WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        border: focused ? `0.5px solid ${pal.warm}` : '0.5px solid rgba(255,255,255,0.16)',
        borderRadius: 18, padding: 14, minWidth: 200,
        boxShadow: focused ? `0 0 0 4px ${pal.warm}22, 0 12px 40px rgba(0,0,0,0.35)` : '0 8px 24px rgba(0,0,0,0.25)',
        opacity: locked ? 0.78 : 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 9.5, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.6, fontFamily: '"JetBrains Mono", ui-monospace, monospace', display:'flex', alignItems:'center', gap:4 }}>
            <Glyph name={locked?'lock':'pin'} size={10} stroke="currentColor"/> {pin}
          </div>
          {focused && !locked && <div style={{ width: 6, height: 6, borderRadius: 3, background: pal.warm }}/>}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}>{title}</div>
        <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 32, lineHeight: 1, marginTop: 4, letterSpacing: -0.3 }}>{big}</div>
        <div style={{ fontSize: 10.5, opacity: 0.7, marginTop: 3 }}>{sub}</div>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { ARIntelliden, ARPanel, AR_BG });
