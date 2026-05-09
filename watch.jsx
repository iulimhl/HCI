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
  return (
    <div style={{
      width: '100%', height: '100%', background: '#1a1916',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Geist", -apple-system, system-ui, sans-serif', position: 'relative', WebkitFontSmoothing: 'antialiased',
    }}>
      <div style={{ position: 'absolute', right: 16, top: '38%', width: 12, height: 36, background: '#3a3835', borderRadius: 3 }}/>
      <div style={{ position: 'absolute', right: 18, top: '52%', width: 10, height: 22, background: '#2a2825', borderRadius: 2 }}/>

      <div style={{ width: SIZE + 22, height: SIZE + 22, borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 25%, #4a4744 0%, #1a1916 70%)',
        padding: 11, boxSizing: 'border-box',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
        <div style={{
          width: SIZE, height: SIZE, borderRadius: '50%', background: '#000',
          position: 'relative', overflow: 'hidden', color: '#fff',
        }}>
          <div style={{ position: 'absolute', left: '50%', top: '34%', transform: 'translate(-50%,-50%)',
            width: 220, height: 220, borderRadius: '50%',
            background: `radial-gradient(circle, ${pal.warm}55 0%, ${pal.warm}00 60%)`, pointerEvents: 'none' }}/>

          <div style={{ position: 'absolute', top: 18, left: 0, right: 0, padding: '0 28px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: muted,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
            <span style={{ display:'flex', gap: 4, alignItems:'center' }}><span style={{width:5,height:5,borderRadius:3,background:perm.tone}}/>{perm.label}</span>
            <span>9:24</span>
            <span>78%</span>
          </div>

          <div style={{ position: 'absolute', left: '50%', top: 56, transform: 'translateX(-50%)', textAlign: 'center' }}>
            <div className="int-fadein" key={sceneObj.id} style={{ width: 54, height: 54, borderRadius: 27, background: pal.warm, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Glyph name={sceneObj.glyph} size={26} stroke="#fff" sw={1.6}/>
            </div>
            <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 32, lineHeight: 1, marginTop: 10 }}>{sceneObj.name}</div>
            <div style={{ fontSize: 10.5, color: muted, marginTop: 4, fontFamily: '"JetBrains Mono", ui-monospace, monospace', letterSpacing: '.06em' }}>scene · 38m</div>
          </div>

          <div style={{ position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', justifyContent: 'center', gap: 24,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: 10, color: muted, letterSpacing: '.06em' }}>
            <Mini icon="therm" v={perm.thermostat?'21.4°':'—'}/>
            <Mini icon="bulb"  v={perm.energy?'8/14':'2/4'}/>
            <Mini icon={perm.lock?'lock':'eyeoff'}  v={perm.lock?'ok':'hidden'}/>
          </div>

          <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {SCENES.map((s) => {
              const i = allowed.findIndex(a=>a.id===s.id);
              const sel = i === sceneIdx;
              const blocked = i === -1;
              return (
                <button key={s.id} onClick={()=>{ if (blocked) { showToast('Not shared', 'blocked'); return; } setSceneIdx(i); showToast(`Scene · ${s.name}`); }} className="int-press" style={{
                  width: sel ? 36 : 24, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', transition: 'all .18s',
                  background: sel ? pal.warm : (blocked ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.12)'),
                  color: sel ? '#fff' : (blocked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: blocked ? 0.5 : 1,
                }}>
                  <Glyph name={blocked?'lock':s.glyph} size={12} stroke="currentColor" sw={1.6}/>
                </button>
              );
            })}
          </div>

          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r = SIZE / 2 - 6;
            const x = SIZE / 2 + Math.sin(a) * r;
            const y = SIZE / 2 - Math.cos(a) * r;
            return <div key={i} style={{ position: 'absolute', left: x - 1, top: y - 4, width: 2, height: i % 3 === 0 ? 8 : 4, background: i % 3 === 0 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)' }}/>;
          })}

          {toast && (
            <div className="int-fadein" key={toast.key} style={{ position: 'absolute', left: '50%', top: 14, transform: 'translateX(-50%)', background: toast.kind==='blocked'?'oklch(0.32 0.16 25)':pal.warm, color:'#fff', borderRadius: 100, padding: '4px 10px', fontSize: 10, fontWeight: 500 }}>
              {toast.msg}
            </div>
          )}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 22, left: 0, right: 0, textAlign: 'center',
        fontSize: 10.5, color: 'rgba(255,255,255,0.45)', fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        letterSpacing: '.16em', textTransform: 'uppercase' }}>
        rotate crown · {allowed.length} scenes
      </div>
    </div>
  );
}

function Mini({ icon, v }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <Glyph name={icon} size={13} stroke="rgba(255,255,255,0.65)"/>
      <span style={{ color: '#fff', fontSize: 10.5 }}>{v}</span>
    </div>
  );
}

Object.assign(window, { WatchIntelliden });
