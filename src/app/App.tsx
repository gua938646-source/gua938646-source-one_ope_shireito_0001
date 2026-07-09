import { useState, useEffect, useRef } from "react";
import { Check, Plus, Trash2, ChevronUp, ChevronDown, Star, Zap, Moon, RefreshCw, Heart, ExternalLink } from "lucide-react";

/* ─── Ad Banner placeholder ─── */
function AdBanner({ slot = "rectangle" }: { slot?: "banner" | "rectangle" }) {
  if (slot === "rectangle") {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-dashed border-border bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center gap-1 text-gray-400" style={{ minHeight: 100 }}>
        <span className="text-[10px] font-bold tracking-widest uppercase">広告</span>
        {/* ここに Google AdSense や他の広告タグを貼る */}
        {/* <ins className="adsbygoogle" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="XXXXXXXX" /> */}
        <span className="text-[10px] text-gray-300">300 × 100</span>
      </div>
    );
  }
  return (
    <div className="w-full rounded-xl overflow-hidden border border-dashed border-border bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center gap-2 text-gray-400" style={{ height: 52 }}>
      <span className="text-[10px] font-bold tracking-widest uppercase">広告</span>
      {/* <ins className="adsbygoogle" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="XXXXXXXX" /> */}
    </div>
  );
}

/* ─── Tip button ─── */
function TipButton() {
  return (
    <a
      href="https://ko-fi.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-black rounded-2xl py-3 shadow-md active:scale-95 transition-transform"
    >
      <Heart size={16} className="fill-white" />
      このアプリを応援する（投げ銭）
      <ExternalLink size={14} className="opacity-70" />
    </a>
  );
}

type Screen = "setup" | "missionSelect" | "mission" | "complete";

interface Mission {
  id: string;
  label: string;
  points: number;
  icon: string;
  completed: boolean;
  selected: boolean;
}

const DEFAULT_MISSIONS: Omit<Mission, "completed" | "selected">[] = [
  { id: "bath", label: "おふろ", points: 3, icon: "🛁" },
  { id: "meal", label: "ごはん", points: 1, icon: "🍚" },
  { id: "meal2", label: "ぜんぶたべる", points: 2, icon: "⭐" },
  { id: "homework", label: "しゅくだい", points: 5, icon: "📚" },
  { id: "study", label: "べんきょう", points: 5, icon: "✏️" },
  { id: "play", label: "あそぶ", points: 1, icon: "🎮" },
  { id: "teeth", label: "はみがき", points: 3, icon: "🦷" },
  { id: "toilet", label: "といれ", points: 3, icon: "🚽" },
  { id: "bedroom", label: "ねるへやにいく", points: 2, icon: "🌙" },
];

function makeMissions(): Mission[] {
  return DEFAULT_MISSIONS.map((m) => ({ ...m, completed: false, selected: true }));
}

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: (i * 37 + 13) % 100,
  y: (i * 53 + 7) % 100,
  size: ((i * 7) % 3) + 1,
  opacity: ((i * 11) % 5) * 0.1 + 0.2,
  twinkle: i % 3 === 0,
}));

const BUBBLE_COLORS = ["#ff6b35", "#a855f7", "#fbbf24", "#34d399", "#60a5fa", "#f472b6"];

function StarsBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient sky */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #fdf4ff 0%, #fff9f0 50%, #fef3c7 100%)" }} />
      {/* Floating bubbles */}
      {STARS.map((s) => (
        <div
          key={s.id}
          className={`absolute rounded-full ${s.twinkle ? "animate-pulse" : ""}`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size * 4,
            height: s.size * 4,
            background: BUBBLE_COLORS[s.id % BUBBLE_COLORS.length],
            opacity: s.opacity * 0.25,
          }}
        />
      ))}
    </div>
  );
}

function PointBadge({ points, label }: { points: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-black text-primary leading-none">{points}</span>
      <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
    </div>
  );
}

/* ─── Screen 1: Setup ─── */
function SetupScreen({
  nickname, setNickname,
  bedtime, setBedtime,
  onNext,
}: {
  nickname: string; setNickname: (v: string) => void;
  bedtime: string; setBedtime: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col min-h-screen px-6 py-12">
      <div className="flex flex-col items-center mb-10">
        <div className="text-6xl mb-3">🌙</div>
        <h1 className="text-3xl font-black text-primary tracking-tight">おやすみミッション</h1>
        <p className="text-muted-foreground text-sm mt-1">はじめの設定をしよう！</p>
      </div>

      <div className="bg-card rounded-2xl p-6 space-y-6 border border-border shadow-lg">
        <div>
          <label className="block text-sm font-bold text-secondary-foreground mb-2">
            お子さまのニックネーム
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="ニックネーム"
            className="w-full bg-muted rounded-xl px-2 md:px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary text-lg font-bold box-border"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-secondary-foreground mb-2">
            寝室に入りたい時間
          </label>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="w-full bg-muted rounded-xl px-0.5 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary text-lg font-black box-border"
          />
        </div>
      </div>


      <button
        onClick={onNext}
        disabled={!nickname.trim()}
        className="mt-8 w-full bg-primary text-primary-foreground font-black text-lg rounded-2xl py-4 shadow-lg active:scale-95 transition-transform disabled:opacity-40"
      >
        つぎへ ✨
      </button>
      <div className="mt-6">
         <AdBanner slot="banner" />
      </div>
    </div>
  );
}

/* ─── Screen 2: Mission Select ─── */
function MissionSelectScreen({
  missions, setMissions,
  totalPoints, onNext,
  emergencyLabel, setEmergencyLabel,
  emergencyPoints, setEmergencyPoints,
}: {
  missions: Mission[]; setMissions: (m: Mission[]) => void;
  totalPoints: number; onNext: () => void;
  emergencyLabel: string; setEmergencyLabel: (v: string) => void;
  emergencyPoints: number; setEmergencyPoints: (v: number) => void;
}) {
  const [newLabel, setNewLabel] = useState("");
  const [newPoints, setNewPoints] = useState(1);

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...missions];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setMissions(next);
  };

  const moveDown = (idx: number) => {
    if (idx === missions.length - 1) return;
    const next = [...missions];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setMissions(next);
  };

  const toggleSelect = (id: string) => {
    setMissions(missions.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m)));
  };

  const removeMission = (id: string) => {
    setMissions(missions.filter((m) => m.id !== id));
  };

  const addMission = () => {
    if (!newLabel.trim()) return;
    setMissions([
      ...missions,
      {
        id: Date.now().toString(),
        label: newLabel,
        points: newPoints,
        icon: "⭐",
        completed: false,
        selected: true,
      },
    ]);
    setNewLabel("");
    setNewPoints(10);
  };

  const selectedCount = missions.filter((m) => m.selected).length;

  return (
    <div className="flex flex-col min-h-screen px-4 py-8">
      <div className="flex items-center justify-between mb-6 px-2">
        <h1 className="text-xl font-black text-foreground">ミッションを選ぼう</h1>
    {/*       <div className="flex items-center gap-1 bg-card rounded-xl px-3 py-1.5 border border-border">
      <Star size={14} className="text-primary fill-primary" />
        </div> */}
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden mb-4">
        {missions.map((m, idx) => (
          <div
            key={m.id}
            className={`flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 transition-opacity ${!m.selected ? "opacity-40" : ""}`}
          >
            <button
              onClick={() => toggleSelect(m.id)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${m.selected ? "bg-primary border-primary" : "border-muted-foreground"}`}
            >
              {m.selected && <Check size={12} className="text-primary-foreground" strokeWidth={3} />}
            </button>

            <span className="text-xl flex-shrink-0">{m.icon}</span>

            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground truncate">{m.label}</p>
              <p className="text-xs text-primary font-bold">{m.points}pt</p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => moveUp(idx)} className="text-muted-foreground active:text-foreground p-1">
                <ChevronUp size={16} />
              </button>
              <button onClick={() => moveDown(idx)} className="text-muted-foreground active:text-foreground p-1">
                <ChevronDown size={16} />
              </button>
              <button onClick={() => removeMission(m.id)} className="text-destructive/60 active:text-destructive p-1">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add new mission */}
      <div className="bg-card rounded-2xl border border-border p-4 mb-4">
        <p className="text-xs font-bold text-muted-foreground mb-3">ミッションを追加</p>
        <div className="flex gap-2 mb-2 w-full overflow-hidden">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="ミッション名"
            className="min-w-0 flex-1 bg-muted rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex items-center gap-1 bg-muted rounded-xl px-2 flex-shrink-0 w-20">
            <input
              type="number"
              value={newPoints}
              onChange={(e) => setNewPoints(Number(e.target.value))}
              className="w-10 bg-transparent text-sm font-bold text-primary outline-none text-center"
              min={1}
              max={99}
            />
            <span className="text-xs text-muted-foreground">pt</span>
          </div>
        </div>
        <button
          onClick={addMission}
          disabled={!newLabel.trim()}
          className="flex items-center gap-2 text-primary font-bold text-sm active:opacity-60 disabled:opacity-30 transition-opacity"
        >
          <Plus size={16} /> 追加する
        </button>
      </div>

      {/* Emergency mission setting */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-accent/30 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={16} className="text-accent" />
          <p className="text-sm font-black text-accent">スペシャルミッションを設定</p>
        </div>
        <div className="flex gap-2 w-full overflow-hidden">
          <input
            type="text"
            value={emergencyLabel}
            onChange={(e) => setEmergencyLabel(e.target.value)}
            placeholder="例：いま、おふろにはいる🛀"
            className="min-w-0 flex-1 bg-white rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent border border-accent/20"
          />
          <div className="flex items-center gap-1 bg-white rounded-xl px-2 border border-accent/20 flex-shrink-0 w-20">
            <input
              type="number"
              value={emergencyPoints}
              onChange={(e) => setEmergencyPoints(Number(e.target.value))}
              className="w-10 bg-transparent text-sm font-bold text-accent outline-none text-center"
              min={1}
              max={99}
            />
            <span className="text-xs text-muted-foreground">pt</span>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={selectedCount === 0}
        className="w-full bg-primary text-primary-foreground font-black text-lg rounded-2xl py-4 shadow-lg active:scale-95 transition-transform disabled:opacity-40"
      >
        ミッション スタート！ 🚀
      </button>
      <div className="mt-4">
        <AdBanner slot="banner" />
      </div>
    </div>
  );
}

function useCountdown(bedtime: string) {
  const [display, setDisplay] = useState({ label: "", color: "", minutes: 0 });

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const [h, m] = bedtime.split(":").map(Number);
      const target = new Date(now);
      target.setHours(h, m, 0, 0);
      const diffMs = target.getTime() - now.getTime();
      const diffMin = Math.round(diffMs / 60000);
      if (diffMin > 60) {
        const hh = Math.floor(diffMin / 60);
        const mm = String(diffMin % 60).padStart(2, "0");
        setDisplay({ label: `寝室まであと ${hh}:${mm}`, color: "text-accent", minutes: diffMin });
      } else if (diffMin > 0) {
        setDisplay({ label: `寝室まであと ${diffMin} 分`, color: diffMin <= 10 ? "text-red-500" : "text-accent", minutes: diffMin });
      } else if (diffMin === 0) {
        setDisplay({ label: "寝室に入る時間だよ！", color: "text-red-500", minutes: 0 });
      } else {
        setDisplay({ label: `${Math.abs(diffMin)} 分すぎてるよ！`, color: "text-red-500", minutes: diffMin });
      }
    };
    calc();
    const id = setInterval(calc, 10000);
    return () => clearInterval(id);
  }, [bedtime]);

  return display;
}

/* ─── Screen 3: Mission ─── */
function MissionScreen({
  nickname, missions, todayPoints, totalPoints, completeItem, onFix,
  emergencyLabel, emergencyPoints, bedtime,
}: {
  nickname: string;
  missions: Mission[];
  todayPoints: number;
  totalPoints: number;
  completeItem: (id: string) => void;
  onFix: () => void;
  emergencyLabel: string;
  emergencyPoints: number;
  bedtime: string;
}) {
  const [showEmergency, setShowEmergency] = useState(false);
  const [emergencyDone, setEmergencyDone] = useState(false);
  const [extraPoints, setExtraPoints] = useState(0);
  const countdown = useCountdown(bedtime);

  const allDone = missions.every((m) => m.completed);

  const handleEmergencyComplete = () => {
    if (!emergencyDone) {
      setEmergencyDone(true);
      setExtraPoints(emergencyPoints);
    }
    setShowEmergency(false);
  };

  const totalToday = todayPoints + extraPoints;

  return (
    <div className="flex flex-col min-h-screen px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-2">
        <div>
          <h1 className="text-2xl font-black text-foreground">{nickname}のミッション</h1>
        </div>
        <div className="flex gap-4">
          <PointBadge points={totalToday} label="今日" />
        </div>
      </div>

      {/* Countdown */}
      <div className={`text-center font-black text-lg mb-3 ${countdown.color}`}>
        {countdown.label}
      </div>

      {/* Progress bar */}
      <div className="px-2 mb-6">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${missions.length > 0 ? (missions.filter(m => m.completed).length / missions.length) * 100 : 0}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {missions.filter(m => m.completed).length} / {missions.length} クリア
        </p>
      </div>

      {/* Mission list */}
      <div className="space-y-3 flex-1 mb-4">
        {missions.map((m, idx) => {
          const cardColors = [
            "from-orange-50 to-amber-50 border-orange-200",
            "from-purple-50 to-pink-50 border-purple-200",
            "from-blue-50 to-cyan-50 border-blue-200",
            "from-green-50 to-emerald-50 border-green-200",
            "from-yellow-50 to-orange-50 border-yellow-200",
          ];
          const colorClass = cardColors[idx % cardColors.length];
          return (
          <div
            key={m.id}
            className={`bg-gradient-to-r ${colorClass} rounded-2xl border px-4 py-4 flex items-center gap-4 transition-all shadow-sm ${m.completed ? "opacity-50" : ""}`}
          >
            <span className="text-3xl">{m.icon}</span>
            <div className="flex-1">
              <p className={`font-black text-base ${m.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {m.label}
              </p>
              <p className="text-xs text-primary font-bold">+{m.points}pt</p>
            </div>
            <button
              onClick={() => completeItem(m.id)}
              disabled={m.completed}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xs transition-all active:scale-90 ${
                m.completed
                  ? "bg-green-400/30 text-green-600"
                  : "bg-primary text-primary-foreground shadow-md"
              }`}
            >
              {m.completed ? <Check size={22} strokeWidth={3} /> : "できた！"}
            </button>
          </div>
          );
        })}
      </div>

      {/* Emergency button */}
      <button
        onClick={() => setShowEmergency(true)}
        className="w-full mb-3 bg-accent/20 border border-accent/40 text-accent font-black rounded-2xl py-3 flex items-center justify-center gap-2 active:scale-95 transition-transform"
      >
        <Zap size={18} className="fill-accent" />
        スペシャルミッション発生！
      </button>

      {/* FIX button */}
      {allDone && (
        <button
          onClick={onFix}
          className="w-full bg-primary text-primary-foreground font-black text-lg rounded-2xl py-4 shadow-lg active:scale-95 transition-transform"
        >
          ぜんぶクリア！ 🌙
        </button>
      )}

      <div className="mt-3">
        <AdBanner slot="banner" />
      </div>

      {/* Emergency overlay */}
      {showEmergency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
          <div className="bg-card border-2 border-accent rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">⚡</div>
              <h2 className="text-xl font-black text-accent">スペシャルミッション！</h2>
              <p className="text-2xl font-black text-foreground mt-2">{emergencyLabel}</p>
              <p className="text-primary font-black text-lg mt-1">+{emergencyPoints}pt ゲット！</p>
            </div>
            {emergencyDone ? (
              <div className="text-center">
                <p className="text-accent font-bold mb-4">✅ クリアしてるよ！</p>
                <button
                  onClick={() => setShowEmergency(false)}
                  className="w-full bg-muted text-foreground font-bold rounded-2xl py-3"
                >
                  とじる
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEmergency(false)}
                  className="flex-1 bg-muted text-muted-foreground font-bold rounded-2xl py-3 active:scale-95 transition-transform"
                >
                  あとで
                </button>
                <button
                  onClick={handleEmergencyComplete}
                  className="flex-1 bg-accent text-accent-foreground font-black rounded-2xl py-3 active:scale-95 transition-transform"
                >
                  できた！
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Screen 5: Complete ─── */
function CompleteScreen({
  nickname, todayPoints, totalPoints, onReset, bedtime, finishedAt,
}: {
  nickname: string; todayPoints: number; totalPoints: number; onReset: () => void;
  bedtime: string; finishedAt: Date;
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (d: Date) =>
    d.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

  const [bh, bm] = bedtime.split(":").map(Number);
  const target = new Date(finishedAt);
  target.setHours(bh, bm, 0, 0);
  const diffMin = Math.round((finishedAt.getTime() - target.getTime()) / 60000);
  const fmtDiff = (min: number) => {
    const abs = Math.abs(min);
    if (abs >= 60) {
      const h = Math.floor(abs / 60);
      const m = abs % 60;
      return m > 0 ? `${h}時間${m}分` : `${h}時間`;
    }
    return `${abs}分`;
  };
  
  const earlyLate =
    diffMin < 0
      ? { text: `よていより ${fmtDiff(diffMin)} はやいね！🎉`, color: "text-green-600", bg: "bg-green-50 border-green-200" }
      : diffMin === 0
      ? { text: "ぴったり！すごい！🌟", color: "text-primary", bg: "bg-orange-50 border-orange-200" }
    　: { text: `よていより ${fmtDiff(diffMin)} おくれたよ`, color: "text-red-500", bg: "bg-red-50 border-red-200" };

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 items-center justify-center text-center">
      <div className="text-7xl mb-4 animate-bounce">🎉</div>
      <h1 className="text-3xl font-black text-primary mb-2">おつかれさま！</h1>
      <p className="text-lg font-bold text-foreground mb-1">
        {nickname}　よくがんばりました！
      </p>
      <p className="text-sm text-muted-foreground mb-6">ミッションコンプリート✨</p>

      {/* Points */}
      <div className="bg-card rounded-3xl border border-border p-6 w-full mb-4">
        <p className="text-4xl font-black text-primary">{todayPoints}</p>
        <p className="text-sm text-muted-foreground mt-1">きょうのポイント</p>
      </div>

      {/* Time info */}
      <div className="bg-card rounded-3xl border border-border p-5 w-full mb-4 text-left space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground font-bold">予定の寝室時間</span>
          <span className="font-black text-foreground text-lg">{bedtime}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground font-bold">ミッション完了</span>
          <span className="font-black text-foreground text-lg">{fmt(finishedAt)}</span>
        </div>
       {/*  <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground font-bold">いまの時刻</span>
          <span className="font-black text-foreground text-lg">{fmt(now)}</span>
        </div> */}
      </div>

      {/* Early/Late result */}
      <div className={`rounded-2xl border p-4 w-full mb-4 ${earlyLate.bg}`}>
        <p className={`font-black text-base ${earlyLate.color}`}>{earlyLate.text}</p>
      </div>

      {/* Mom message */}
     {/* <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 w-full mb-8">
        <p className="text-base font-black text-accent mb-1"> ワンオペ任務完了❤️</p>
        <p className="text-foreground font-bold text-sm">今日もお疲れ様でした！</p>
      </div>*/}

      <div className="w-full mb-4">
        <TipButton />
      </div>

      <div className="w-full mb-6">
         <AdBanner slot="banner" />
      </div>

      <button
        onClick={onReset}
        className="flex items-center gap-2 text-muted-foreground font-bold active:opacity-60 transition-opacity"
      >
        <RefreshCw size={16} />
        はじめからやりなおす
      </button>
    </div>
  );
}

/* ─── Root App ─── */
export default function App() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [nickname, setNickname] = useState("");
  const [bedtime, setBedtime] = useState("21:00");
  const [missions, setMissions] = useState<Mission[]>(makeMissions());
  const [todayPoints, setTodayPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [emergencyLabel, setEmergencyLabel] = useState("いま、おふろにはいる🛀");
  const [emergencyPoints, setEmergencyPoints] = useState(1);
  const [finishedAt, setFinishedAt] = useState<Date>(new Date());

  const selectedMissions = missions.filter((m) => m.selected);

  const completeItem = (id: string) => {
    const m = missions.find((x) => x.id === id);
    if (!m || m.completed) return;
    setMissions((prev) => prev.map((x) => (x.id === id ? { ...x, completed: true } : x)));
    setTodayPoints((p) => p + m.points);
    setTotalPoints((p) => p + m.points);
  };

  const handleFix = () => {
    setFinishedAt(new Date());
    setScreen("complete");
  };

  const handleReset = () => {
    setScreen("setup");
    setNickname("");
    setBedtime("21:00");
    setMissions(makeMissions());
    setTodayPoints(0);
    setTotalPoints(0);
  };

  return (
  <div className="min-h-screen bg-background" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
    <StarsBg />

    <div className="relative z-10 max-w-sm mx-auto min-h-screen">
      {screen === "setup" && (
        <SetupScreen
          nickname={nickname}
          setNickname={setNickname}
          bedtime={bedtime}
          setBedtime={setBedtime}
          onNext={() => setScreen("missionSelect")}
        />
      )}

      {screen === "missionSelect" && (
        <MissionSelectScreen
          missions={missions}
          setMissions={setMissions}
          totalPoints={totalPoints}
          onNext={() => setScreen("mission")}
          emergencyLabel={emergencyLabel}
          setEmergencyLabel={setEmergencyLabel}
          emergencyPoints={emergencyPoints}
          setEmergencyPoints={setEmergencyPoints}
        />
      )}

      {screen === "mission" && (
        <MissionScreen
          nickname={nickname}
          missions={selectedMissions}
          todayPoints={todayPoints}
          totalPoints={totalPoints}
          completeItem={completeItem}
          onFix={handleFix}
          emergencyLabel={emergencyLabel}
          emergencyPoints={emergencyPoints}
          bedtime={bedtime}
        />
      )}

      {screen === "complete" && (
        <CompleteScreen
          nickname={nickname}
          todayPoints={todayPoints}
          totalPoints={totalPoints}
          onReset={handleReset}
          bedtime={bedtime}
          finishedAt={finishedAt}
        />
      )}

      {/* フッターここ！ */}
      <footer className="mt-2 border-t pt-2 pb-2 text-center text-[10px] text-gray-400">
        <a href="https://bread-ear.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="mx-1 hover:underline">
          プライバシーポリシー
        </a>
        <span>｜</span>
        <a href="https://bread-ear.com/terms/" target="_blank" rel="noopener noreferrer" className="mx-1 hover:underline">
          利用規約
        </a>
        <span>｜</span>
        <a href="https://bread-ear.com/contact/" target="_blank" rel="noopener noreferrer" className="mx-1 hover:underline">
          お問い合わせ
        </a>
        <span>｜</span>
        <a href="https://bread-ear.com/profile/" target="_blank" rel="noopener noreferrer" className="mx-1 hover:underline">
          運営者情報
        </a>
      </footer>

    </div>
  </div>
);
