function StyleGuide({ pal }) {
  const colors = [
    { name: "Background", value: pal.bg, usage: "Main app background" },
    { name: "Surface", value: pal.surface, usage: "Cards and panels" },
    { name: "Surface 2", value: pal.surface2, usage: "Secondary cards" },
    { name: "Ink", value: pal.ink, usage: "Primary text" },
    { name: "Muted", value: pal.muted, usage: "Secondary text" },
    { name: "Faint", value: pal.faint, usage: "Inactive elements" },
    { name: "Line", value: pal.line, usage: "Borders and dividers" },
    { name: "Warm Accent", value: pal.warm, usage: "Main actions and active states" },
    { name: "Cool Accent", value: pal.cool, usage: "Secondary highlights" },
    { name: "Tint", value: pal.tint, usage: "Ambient highlights" },
    { name: "Owner Tone", value: PERMS.owner.tone, usage: "Owner role indicator" },
    { name: "Family Tone", value: PERMS.family.tone, usage: "Family role indicator" },
    { name: "Guest Tone", value: PERMS.guest.tone, usage: "Guest role indicator" },
  ];

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: pal.bg,
      color: pal.ink,
      padding: 36,
      boxSizing: "border-box",
      fontFamily: '"Geist", -apple-system, system-ui, sans-serif',
      overflowY: "auto"
    }}>

      <div style={{
        fontSize: 11,
        letterSpacing: ".18em",
        textTransform: "uppercase",
        color: pal.muted,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace'
      }}>
        Intelliden Design System · {pal.mode} · {pal.todLabel}
      </div>

      <div style={{
        fontFamily: '"Instrument Serif", Georgia, serif',
        fontSize: 56,
        lineHeight: 1,
        marginTop: 8,
        letterSpacing: -0.4
      }}>
        Style Guide.
      </div>

      <p style={{
        color: pal.muted,
        fontSize: 14,
        maxWidth: 700,
        lineHeight: 1.5,
        marginTop: 12
      }}>
        This page documents the real visual tokens used by Intelliden. The palette is generated from
        theme.jsx using OKLCH colors, so the guide changes correctly when the theme or time of day changes.
      </p>

      <SGTitle pal={pal} title="Color tokens from theme.jsx" />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12
      }}>
        {colors.map((c) => (
          <div key={c.name} style={{
            background: pal.surface,
            border: `0.5px solid ${pal.line}`,
            borderRadius: 16,
            padding: 12
          }}>
            <div style={{
              height: 58,
              borderRadius: 12,
              background: c.value,
              border: `0.5px solid ${pal.line}`,
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
            }} />
            <div style={{
              marginTop: 9,
              fontSize: 12.5,
              fontWeight: 600
            }}>
              {c.name}
            </div>
            <div style={{
              marginTop: 3,
              fontSize: 9.5,
              color: pal.muted,
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {c.value}
            </div>
            <div style={{
              marginTop: 5,
              fontSize: 10.5,
              color: pal.muted,
              lineHeight: 1.3
            }}>
              {c.usage}
            </div>
          </div>
        ))}
      </div>

      <SGTitle pal={pal} title="Typography" />

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 12
      }}>
        <SGCard pal={pal}>
          <SmallLabel pal={pal}>Display font</SmallLabel>
          <div style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 34,
            lineHeight: 1,
            marginTop: 10
          }}>
            The Living Room.
          </div>
          <p style={pStyle(pal)}>Used for expressive room names, scene names and hero titles.</p>
        </SGCard>

        <SGCard pal={pal}>
          <SmallLabel pal={pal}>Interface font</SmallLabel>
          <div style={{
            fontSize: 20,
            fontWeight: 600,
            marginTop: 10
          }}>
            Device control
          </div>
          <p style={pStyle(pal)}>Geist is used for readable UI text, cards, labels and buttons.</p>
        </SGCard>

        <SGCard pal={pal}>
          <SmallLabel pal={pal}>System font</SmallLabel>
          <div style={{
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 13,
            marginTop: 12,
            letterSpacing: ".08em"
          }}>
            OWNER · FULL ACCESS
          </div>
          <p style={pStyle(pal)}>Used for metadata, roles, technical labels and status information.</p>
        </SGCard>
      </div>

      <SGTitle pal={pal} title="Components and interaction states" />

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 12
      }}>
        <SGCard pal={pal}>
          <SmallLabel pal={pal}>Primary action</SmallLabel>
          <button style={{
            marginTop: 12,
            height: 38,
            padding: "0 18px",
            borderRadius: 19,
            border: "none",
            background: pal.warm,
            color: "#fff",
            fontWeight: 600,
            fontFamily: "inherit"
          }}>
            Wake routine
          </button>
          <p style={pStyle(pal)}>Warm accent is used for selected scenes and main actions.</p>
        </SGCard>

        <SGCard pal={pal}>
          <SmallLabel pal={pal}>Device card</SmallLabel>
          <div style={{
            marginTop: 12,
            padding: 14,
            borderRadius: 14,
            background: pal.surface2,
            border: `0.5px solid ${pal.line}`
          }}>
            <div style={{ fontSize: 12, color: pal.muted }}>Floor lamp</div>
            <div style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: 32,
              lineHeight: 1,
              marginTop: 4
            }}>
              64%
            </div>
            <div style={{
              height: 4,
              background: pal.line,
              borderRadius: 4,
              marginTop: 10,
              overflow: "hidden"
            }}>
              <div style={{
                width: "64%",
                height: "100%",
                background: pal.warm
              }} />
            </div>
          </div>
        </SGCard>

        <SGCard pal={pal}>
          <SmallLabel pal={pal}>Permission states</SmallLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            <StateRow pal={pal} color={PERMS.owner.tone} label="Owner" status="full access" />
            <StateRow pal={pal} color={PERMS.family.tone} label="Family" status="shared" />
            <StateRow pal={pal} color={PERMS.guest.tone} label="Guest" status="scoped" />
          </div>
        </SGCard>
      </div>

      <SGTitle pal={pal} title="Design rules" />

      <div style={{
        background: pal.surface,
        border: `0.5px solid ${pal.line}`,
        borderRadius: 16,
        padding: 16,
        fontSize: 12.5,
        lineHeight: 1.65,
        color: pal.ink
      }}>
        Dark-first interface, rounded cards, soft shadows, role-based colors, high contrast text,
        large tap targets and repeated interaction patterns across mobile, tablet, MR headset and smartwatch.
      </div>
    </div>
  );
}

function SGTitle({ pal, title }) {
  return (
    <div style={{
      marginTop: 24,
      marginBottom: 10,
      fontSize: 10.5,
      letterSpacing: ".18em",
      textTransform: "uppercase",
      color: pal.muted,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace'
    }}>
      {title}
    </div>
  );
}

function SGCard({ pal, children }) {
  return (
    <div style={{
      background: pal.surface,
      border: `0.5px solid ${pal.line}`,
      borderRadius: 16,
      padding: 16,
      minHeight: 132
    }}>
      {children}
    </div>
  );
}

function SmallLabel({ pal, children }) {
  return (
    <div style={{
      fontSize: 10,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: pal.muted,
      fontFamily: '"JetBrains Mono", ui-monospace, monospace'
    }}>
      {children}
    </div>
  );
}

function StateRow({ pal, color, label, status }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 12
    }}>
      <span style={{
        width: 9,
        height: 9,
        borderRadius: 5,
        background: color,
        boxShadow: `0 0 0 4px ${color}25`
      }} />
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span style={{
        marginLeft: "auto",
        color: pal.muted,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 10
      }}>
        {status}
      </span>
    </div>
  );
}

function pStyle(pal) {
  return {
    fontSize: 12,
    color: pal.muted,
    lineHeight: 1.45,
    marginTop: 10,
    marginBottom: 0
  };
}

Object.assign(window, { StyleGuide });