// watch.jsx — Intelliden smartwatch with persona gating + scene picker.

function WatchIntelliden({ pal, household, perm, persona }) {
  const allowed = perm.allowedScenes.length ? SCENES.filter(s => perm.allowedScenes.includes(s.id))
    : SCENES.filter(s => !perm.blockedScenes.includes(s.id));
  const [sceneIdx, setSceneIdx] = React.useState(0);
  const [toast, showToast] = useToast();

  React.useEffect(() => { setSceneIdx(0); }, [persona]);

  const sceneObj = allowed[sceneIdx] || SCENES[1];
  const muted = 'rgba(255,255,255,0.55)';

  const SIZE = 326;
  const R = SIZE / 2;
  return (
    <div style={{
      width: '100%', height: '100%', background: '#1a1916',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Geist", -apple-system, system-ui, sans-serif', position: 'relative', WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Crown & side button */}
      <div style={{ position: 'absolute', right: 14, top: '36%', width: 14, height: 40, background: 'linear-gradient(180deg, #4a4744 0%, #2a2825 100%)', borderRadius: '0 4px 4px 0', boxShadow: '2px 0 6px rgba(0,0,0,0.3)' }}/>
      <div style={{ position: 'absolute', right: 16, top: '52%', width: 10, height: 20, background: '#2a2825', borderRadius: '0 3px 3px 0', boxShadow: '1px 0 4px rgba(0,0,0,0.2)' }}/>

      {/* Watch casing */}
      <div style={{ width: SIZE + 22, height: SIZE + 22, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 25%, #4a4744 0%, #2a2825 50%, #1a1916 100%)',
        padding: 11, boxSizing: 'border-box',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)' }}>

        {/* Watch face */}
        <div style={{
          width: SIZE, height: SIZE, borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 40%, #111110 0%, #000 100%)',
          position: 'relative', overflow: 'hidden', color: '#fff',
        }}>
          {/* Ambient glow */}
          <div style={{ position: 'absolute', left: '50%', top: '30%', transform: 'translate(-50%,-50%)',
            width: 200, height: 200, borderRadius: '50%',
            background: `radial-gradient(circle, ${pal.warm}44 0%, ${pal.warm}00 65%)`, pointerEvents: 'none' }}/>

          {/* Status bar */}
          <div style={{ position: 'absolute', top: 22, left: 0, right: 0, padding: '0 36px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: 9, letterSpacing: '.14em', textTransform: 'uppercase', color: muted,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
            <span style={{ display:'flex', gap: 4, alignItems:'center' }}><span style={{width:5,height:5,borderRadius:3,background:perm.tone}}/>{perm.label}</span>
            <span>9:24</span>
            <span>78%</span>
          </div>

          {/* Scene display */}
          <div style={{ position: 'absolute', left: '50%', top: 60, transform: 'translateX(-50%)', textAlign: 'center' }}>
            <div key={sceneObj.id} className="int-fadein" style={{ width: 50, height: 50, borderRadius: 25, background: pal.warm, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 24px 6px ${pal.warm}44` }}>
              <Glyph name={sceneObj.glyph} size={24} stroke="#fff" sw={1.6}/>
            </div>
            <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 30, lineHeight: 1, marginTop: 8 }}>{sceneObj.name}</div>
            <div style={{ fontSize: 10, color: muted, marginTop: 4, fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '.06em' }}>scene · 38m</div>
          </div>

          {/* Mini stats */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 202, display: 'flex', justifyContent: 'center', gap: 28,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 10, color: muted, letterSpacing: '.06em' }}>
            <Mini icon="therm" v={perm.thermostat?'21.4°':'—'}/>
            <Mini icon="bulb"  v={perm.energy?'8/14':'2/4'}/>
            <Mini icon={perm.lock?'lock':'eyeoff'}  v={perm.lock?'ok':'hidden'}/>
          </div>

          {/* Scene picker dots */}
          <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
            {SCENES.map((s) => {
              const i = allowed.findIndex(a=>a.id===s.id);
              const sel = i === sceneIdx;
              const blocked = i === -1;
              return (
                <button key={s.id} onClick={()=>{ if (blocked) { showToast('Not shared', 'blocked'); return; } setSceneIdx(i); showToast(`Scene · ${s.name}`); }} className="int-press" style={{
                  width: sel ? 32 : 22, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                  background: sel ? pal.warm : (blocked ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.10)'),
                  color: sel ? '#fff' : (blocked ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.65)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: blocked ? 0.5 : 1,
                  transition: 'width .2s ease',
                }}>
                  <Glyph name={blocked?'lock':s.glyph} size={10} stroke="currentColor" sw={1.6}/>
                </button>
              );
            })}
          </div>

          {/* Tick marks */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = i * 30;
            const h = i % 3 === 0 ? 10 : 5;
            return <div key={i} style={{
              position: 'absolute',
              left: R - 1, top: 6,
              width: 2, height: h,
              background: i % 3 === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)',
              borderRadius: 1,
              transformOrigin: `1px ${R - 6}px`,
              transform: `rotate(${angle}deg)`,
            }}/>;
          })}

          {/* Toast */}
          {toast && (
            <div className="int-fadein" key={toast.key} style={{ position: 'absolute', left: '50%', top: 18, transform: 'translateX(-50%)', background: toast.kind==='blocked'?'oklch(0.32 0.16 25)':pal.warm, color:'#fff', borderRadius: 100, padding: '4px 10px', fontSize: 9.5, fontWeight: 500, whiteSpace: 'nowrap', zIndex: 10 }}>
              {toast.msg}
            </div>
          )}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center',
        fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        letterSpacing: '.14em', textTransform: 'uppercase' }}>
        rotate crown · {allowed.length} scenes
      </div>
    </div>
  );
}

function Mini({ icon, v }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <Glyph name={icon} size={13} stroke="rgba(255,255,255,0.6)"/>
      <span style={{ color: '#fff', fontSize: 10.5 }}>{v}</span>
    </div>
  );
}

Object.assign(window, { WatchIntelliden });
