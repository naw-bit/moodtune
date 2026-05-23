import { useState, useEffect } from "react";

const moodColors = {
  joyeux:     { bg: "#FFF176", accent: "#FF6B35", text: "#1a1a1a" },
  triste:     { bg: "#1a2a4a", accent: "#4fc3f7", text: "#e0f7fa" },
  energique:  { bg: "#1a0a2e", accent: "#ff0090", text: "#fff" },
  calme:      { bg: "#e8f5e9", accent: "#2e7d32", text: "#1b5e20" },
  nostalgique:{ bg: "#3e2723", accent: "#ff8a65", text: "#fbe9e7" },
  amoureux:   { bg: "#fce4ec", accent: "#e91e63", text: "#880e4f" },
  stresse:    { bg: "#212121", accent: "#f44336", text: "#ffebee" },
  motive:     { bg: "#0d47a1", accent: "#ffd600", text: "#fff" },
  default:    { bg: "#0f0f1a", accent: "#a78bfa", text: "#f0f0ff" },
};

function detectTheme(text) {
  const t = text.toLowerCase();
  if (/(joyeux|heureux|content|super|bien|top|rire|sourire)/.test(t)) return moodColors.joyeux;
  if (/(triste|mal|pleure|chagrin|seul|melancolique|deprime)/.test(t)) return moodColors.triste;
  if (/(energie|energique|sport|boost|pump|rapide|speed)/.test(t)) return moodColors.energique;
  if (/(calme|zen|detente|relaxe|serein|repos|paisible)/.test(t)) return moodColors.calme;
  if (/(nostalgie|souvenir|avant|passe|enfance|memoire)/.test(t)) return moodColors.nostalgique;
  if (/(amour|amoureux|romantique|coeur|crush|beau|belle)/.test(t)) return moodColors.amoureux;
  if (/(stress|anxieux|angoisse|pression|fatigue|deborde)/.test(t)) return moodColors.stresse;
  if (/(motive|objectif|focus|determine|goal|ambition)/.test(t)) return moodColors.motive;
  return moodColors.default;
}

function extractJSON(text) {
  // Essaie d'extraire le JSON même s'il y a du texte autour
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);
  throw new Error("Aucun JSON trouvé dans la réponse");
}

function LoadingBars({ accent }) {
  return (
    <>
      <style>{`@keyframes ba { 0%,100%{height:8px} 50%{height:36px} }`}</style>
      <div style={{ display:"flex", gap:5, alignItems:"flex-end", height:40, margin:"20px auto", justifyContent:"center" }}>
        {[0,1,2,3,4,5,6].map(i => (
          <div key={i} style={{
            width:6, borderRadius:3, background:accent,
            animation:`ba 0.8s ease-in-out infinite`,
            animationDelay:`${i*0.1}s`,
          }}/>
        ))}
      </div>
    </>
  );
}

function TrackCard({ track, index, accent, text }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 100);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div style={{
      display:"flex", alignItems:"center", gap:12,
      background:`${accent}18`, border:`1px solid ${accent}44`,
      borderRadius:14, padding:"12px 16px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition:"all 0.4s cubic-bezier(.22,1,.36,1)",
    }}>
      <div style={{
        width:42, height:42, borderRadius:10, flexShrink:0,
        background:`linear-gradient(135deg,${accent}99,${accent}22)`,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:18,
      }}>🎵</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:700, fontSize:14, color:text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{track.title}</div>
        <div style={{ fontSize:12, opacity:0.6, marginTop:2, color:text }}>{track.artist} · {track.genre}</div>
      </div>
      <div style={{
        fontSize:10, fontWeight:700, padding:"4px 9px", flexShrink:0,
        background:`${accent}33`, borderRadius:20, color:accent,
        letterSpacing:1, textTransform:"uppercase",
      }}>{track.vibe}</div>
    </div>
  );
}

export default function MoodTune() {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [theme, setTheme] = useState(moodColors.default);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTheme(mood.length > 2 ? detectTheme(mood) : moodColors.default);
  }, [mood]);

  async function generate() {
    if (!mood.trim() || loading) return;
    setLoading(true); setResult(null); setError(null);

    const prompt = `Tu es un expert musical. Humeur de l'utilisateur : "${mood}"

Réponds UNIQUEMENT avec ce JSON (commence directement par { sans rien avant) :
{
  "moodLabel": "label de l'humeur en 3 mots max",
  "moodEmoji": "1 emoji",
  "description": "2 phrases poétiques sur cette humeur",
  "conseil": "1 conseil bien-être musical, 15 mots max",
  "tracks": [
    { "title": "nom chanson", "artist": "artiste", "genre": "genre", "vibe": "1 mot" },
    { "title": "nom chanson", "artist": "artiste", "genre": "genre", "vibe": "1 mot" },
    { "title": "nom chanson", "artist": "artiste", "genre": "genre", "vibe": "1 mot" },
    { "title": "nom chanson", "artist": "artiste", "genre": "genre", "vibe": "1 mot" },
    { "title": "nom chanson", "artist": "artiste", "genre": "genre", "vibe": "1 mot" },
    { "title": "nom chanson", "artist": "artiste", "genre": "genre", "vibe": "1 mot" },
    { "title": "nom chanson", "artist": "artiste", "genre": "genre", "vibe": "1 mot" },
    { "title": "nom chanson", "artist": "artiste", "genre": "genre", "vibe": "1 mot" }
  ],
  "tempoLabel": "Lent",
  "colorMood": "froid"
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Erreur HTTP ${res.status}`);
      }

      const data = await res.json();
      const raw = data?.content?.map(b => b.text || "").join("") || "";

      if (!raw) throw new Error("Réponse vide de l'API");

      const parsed = extractJSON(raw);
      setResult(parsed);
    } catch (e) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  const { bg, accent, text } = theme;

  return (
    <div style={{
      minHeight:"100vh", background:bg, transition:"background 0.8s",
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"36px 18px 60px", fontFamily:"'DM Sans',sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet"/>

      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ fontSize:48, marginBottom:6 }}>🎧</div>
        <h1 style={{
          fontFamily:"'Playfair Display',serif", fontSize:52,
          fontWeight:700, color:text, margin:0, transition:"color 0.8s", lineHeight:1.1,
        }}>MoodTune</h1>
        <p style={{ color:accent, fontSize:13, letterSpacing:3, fontWeight:700, textTransform:"uppercase", margin:"6px 0 0", transition:"color 0.8s" }}>
          Powered by Claude AI
        </p>
      </div>

      {/* Input */}
      <div style={{ width:"100%", maxWidth:520 }}>
        <label style={{ display:"block", color:text, fontSize:12, fontWeight:700, marginBottom:8, opacity:0.65, letterSpacing:1.5, textTransform:"uppercase" }}>
          Comment tu te sens en ce moment ?
        </label>
        <textarea
          value={mood}
          onChange={e => setMood(e.target.value)}
          onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); generate(); }}}
          placeholder="Ex : je me sens nostalgique, un peu mélancolique..."
          rows={3}
          style={{
            width:"100%", background:`${accent}12`, border:`2px solid ${accent}50`,
            borderRadius:14, padding:"14px 16px", fontSize:15, color:text,
            fontFamily:"'DM Sans',sans-serif", resize:"none", outline:"none",
            boxSizing:"border-box", transition:"all 0.5s", lineHeight:1.6,
          }}
        />
        <button
          onClick={generate}
          disabled={loading || !mood.trim()}
          style={{
            marginTop:12, width:"100%", padding:"15px",
            background: (!mood.trim() || loading) ? `${accent}40` : accent,
            color: (!mood.trim() || loading) ? `${text}80` : bg,
            border:"none", borderRadius:13, fontSize:15, fontWeight:700,
            cursor: (!mood.trim() || loading) ? "not-allowed" : "pointer",
            transition:"all 0.3s", fontFamily:"'DM Sans',sans-serif",
          }}
        >
          {loading ? "Analyse en cours..." : "🎵 Générer ma playlist"}
        </button>
      </div>

      {loading && <LoadingBars accent={accent}/>}

      {error && (
        <div style={{
          marginTop:16, padding:"12px 16px", maxWidth:520, width:"100%",
          background:"#f4433620", border:"1.5px solid #f44336",
          borderRadius:12, color:"#f44336", fontSize:13, textAlign:"center",
        }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div style={{ width:"100%", maxWidth:520, marginTop:32 }}>
          {/* Mood card */}
          <div style={{
            textAlign:"center", marginBottom:24, padding:"22px",
            background:`${accent}15`, borderRadius:18, border:`1px solid ${accent}30`,
          }}>
            <div style={{ fontSize:40, marginBottom:6 }}>{result.moodEmoji}</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:text, margin:"0 0 8px", fontStyle:"italic" }}>
              {result.moodLabel}
            </h2>
            <p style={{ color:text, opacity:0.72, fontSize:14, lineHeight:1.6, margin:"0 0 14px" }}>
              {result.description}
            </p>
            <div style={{ display:"flex", justifyContent:"center", gap:10 }}>
              <span style={{ background:`${accent}30`, color:accent, padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700 }}>
                ⏱ {result.tempoLabel}
              </span>
              <span style={{ background:`${accent}30`, color:accent, padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700 }}>
                🌡 {result.colorMood}
              </span>
            </div>
          </div>

          {/* Conseil */}
          <div style={{
            background:`${accent}20`, borderLeft:`4px solid ${accent}`,
            borderRadius:"0 12px 12px 0", padding:"11px 15px",
            marginBottom:20, fontSize:13, color:text, fontStyle:"italic",
          }}>
            💡 {result.conseil}
          </div>

          {/* Tracks */}
          <h3 style={{ fontFamily:"'Playfair Display',serif", color:text, fontSize:17, marginBottom:12, fontWeight:700 }}>
            Ta playlist ({result.tracks?.length} titres)
          </h3>
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            {result.tracks?.map((track, i) => (
              <TrackCard key={i} track={track} index={i} accent={accent} text={text}/>
            ))}
          </div>

          <button
            onClick={() => { setResult(null); setMood(""); setTheme(moodColors.default); }}
            style={{
              marginTop:24, width:"100%", padding:"12px",
              background:"transparent", color:accent,
              border:`2px solid ${accent}50`, borderRadius:13,
              fontSize:14, fontWeight:600, cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif",
            }}
          >🔄 Nouvelle humeur</button>
        </div>
      )}
    </div>
  );
}