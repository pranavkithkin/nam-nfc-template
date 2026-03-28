"use client";

const PRESETS = [
  { name: "NAM Navy + Gold", primary: "#0a1628", secondary: "#111d33", accent: "#d4a853", accentHover: "#f0c56e" },
  { name: "Midnight Slate", primary: "#0d1117", secondary: "#161b22", accent: "#58a6ff", accentHover: "#79c0ff" },
  { name: "Deep Forest", primary: "#0a1f0f", secondary: "#112213", accent: "#4ade80", accentHover: "#86efac" },
  { name: "Burgundy Black", primary: "#130a0a", secondary: "#1f1010", accent: "#e85d5d", accentHover: "#f08080" },
  { name: "Violet Night", primary: "#0d0a1f", secondary: "#130f2a", accent: "#a78bfa", accentHover: "#c4b5fd" },
  { name: "Ocean Teal", primary: "#061a1a", secondary: "#0d2424", accent: "#2dd4bf", accentHover: "#5eead4" },
];

interface Colors {
  primary: string;
  secondary: string;
  accent: string;
  accentHover: string;
}

interface Props {
  colors: Colors;
  onChange: (colors: Colors) => void;
}

export default function ThemePicker({ colors, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Preset swatches */}
      <div>
        <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Presets</p>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => onChange({ primary: p.primary, secondary: p.secondary, accent: p.accent, accentHover: p.accentHover })}
              className="flex items-center gap-3 px-3 py-2.5 nam-surface rounded-xl hover:border-gold/30 transition-all text-left"
            >
              {/* Swatch */}
              <div className="flex -space-x-1 shrink-0">
                <div className="w-5 h-5 rounded-full border border-white/10" style={{ background: p.primary }} />
                <div className="w-5 h-5 rounded-full border border-white/10" style={{ background: p.accent }} />
              </div>
              <span className="text-xs text-white/60 truncate">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual pickers */}
      <div className="space-y-4">
        <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Custom Colors</p>
        {[
          { key: "primary" as keyof Colors, label: "Background (Primary)" },
          { key: "secondary" as keyof Colors, label: "Surface (Secondary)" },
          { key: "accent" as keyof Colors, label: "Accent Color" },
          { key: "accentHover" as keyof Colors, label: "Accent Hover" },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <input
              type="color"
              value={colors[key]}
              onChange={(e) => onChange({ ...colors, [key]: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer border border-white/10 bg-transparent p-0.5"
            />
            <div className="flex-1">
              <p className="text-xs text-white/60 mb-1">{label}</p>
              <input
                type="text"
                value={colors[key]}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange({ ...colors, [key]: v });
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-gold/40 transition-all"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Live swatch preview */}
      <div
        className="rounded-xl p-4 border border-white/10"
        style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
      >
        <p className="text-xs font-medium mb-2" style={{ color: colors.accent }}>Preview</p>
        <div className="flex gap-2">
          <div className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: colors.accent, color: colors.primary }}>
            Button
          </div>
          <div className="px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: `${colors.accent}40`, color: colors.accent }}>
            Outline
          </div>
        </div>
      </div>
    </div>
  );
}
