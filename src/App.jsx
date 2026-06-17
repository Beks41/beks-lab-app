import React, { useState, useRef, useCallback } from "react";
import {
  MessageCircle,
  ScanFace,
  GraduationCap,
  Flame,
  User,
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  Lock,
  Sparkles,
  Settings,
  X,
} from "lucide-react";

/**
 * BEKS Lab — Telegram mini-app prototype
 * Tabs: Chat (real API), Analysis (real vision API, no numeric scores),
 * Academy (guide library mock), Calories (real API macro estimate), Profile (paywall mockup)
 */

// ---------- shared helpers ----------

async function callClaude(messages, { system, maxTokens = 1024 } = {}) {
  const body = {
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    messages,
  };
  if (system) body.system = system;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("API request failed: " + res.status);
  const data = await res.json();
  const text = (data.content || [])
    .map((b) => (b.type === "text" ? b.text : ""))
    .filter(Boolean)
    .join("\n");
  return text;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------- visual primitives ----------

function TopBar({ title = "BEKS Lab", onSettings }) {
  return (
    <div
      className="sticky top-0 z-20 backdrop-blur border-b border-white/5 px-5 py-4 flex items-center justify-between"
      style={{ backgroundColor: "rgba(10,10,12,0.95)" }}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-[#FF5E3A] flex items-center justify-center font-black text-black text-sm">
          B
        </div>
        <span className="font-extrabold tracking-tight text-[15px] text-[#F5F0EC]">
          {title}
        </span>
      </div>
      <button
        onClick={onSettings}
        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
        aria-label="Настройки"
      >
        <Settings size={15} className="text-[#C9C4BE]" />
      </button>
    </div>
  );
}

function SectionEyebrow({ children }) {
  return (
    <div
      className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2"
      style={{ color: "#FF5E3A" }}
    >
      {children}
    </div>
  );
}

function PillTag({ children, tone = "default" }) {
  const tones = {
    default: { background: "rgba(255,255,255,0.05)", color: "#C9C4BE", borderColor: "rgba(255,255,255,0.1)" },
    pro: { background: "rgba(255,180,84,0.15)", color: "#FFB454", borderColor: "rgba(255,180,84,0.3)" },
    free: { background: "rgba(255,94,58,0.15)", color: "#FF8A65", borderColor: "rgba(255,94,58,0.3)" },
  };
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border inline-block"
      style={tones[tone]}
    >
      {children}
    </span>
  );
}

// ---------- TAB 1: CHAT (paywalled) ----------

function ChatTab({ onUpgrade }) {
  const suggestions = [
    "Что даст самый быстрый прирост во внешности?",
    "Как понять мой главный минус?",
  ];

  return (
    <div className="flex flex-col h-full" style={{
      background: "radial-gradient(ellipse 160% 70% at 50% -15%, rgba(255,94,58,0.35) 0%, transparent 60%), radial-gradient(ellipse 140% 70% at 100% 110%, rgba(255,180,84,0.18) 0%, transparent 50%), #0A0A0C",
      color: "#F5F0EC",
    }}>
      <div className="px-5 pt-5 pb-2">
        <SectionEyebrow>BEKS AI</SectionEyebrow>
        <h1 className="text-[28px] font-black leading-none" style={{ color: "#F5F0EC" }}>
          Чат.
        </h1>
      </div>

      <div className="px-5 pt-3">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg, #1A1410, #161416)",
            border: "1px solid rgba(255,180,84,0.25)",
          }}
        >
          <PillTag tone="pro">BEKS PRO</PillTag>
          <div className="text-[19px] font-black mt-3" style={{ color: "#F5F0EC" }}>
            Чат доступен с подпиской
          </div>
          <p className="text-[12.5px] mt-2 leading-snug" style={{ color: "#A8A39D" }}>
            Бесплатный доступ к BEKS AI Chat сейчас отключён для аккаунтов
            без подписки. Так чат держит контекст твоего анализа, целей и
            истории вопросов — а не отвечает наугад.
          </p>
          <button
            onClick={onUpgrade}
            className="w-full font-bold rounded-xl py-3 mt-4"
            style={{ backgroundColor: "#FF5E3A", color: "#000" }}
          >
            Оформить подписку
          </button>
        </div>
      </div>

      <div className="flex-1 px-5 pt-4 overflow-hidden relative">
        <div style={{ filter: "blur(5px)", opacity: 0.4, pointerEvents: "none" }}>
          <div
            className="rounded-2xl px-4 py-3 text-[13px] leading-snug max-w-[80%] mb-3"
            style={{ backgroundColor: "#161416", border: "1px solid rgba(255,255,255,0.05)", color: "#E8E3DD" }}
          >
            У тебя сухая кожа на щеках и Т-зона жирнит — это комбинированный тип. Начни с мягкого геля для умывания без SLS, увлажняй кремом с церамидами утром и вечером.
          </div>
          <div
            className="rounded-2xl px-4 py-3 text-[13px] leading-snug max-w-[70%] ml-auto mb-3"
            style={{ backgroundColor: "#FF5E3A", color: "#000" }}
          >
            А что с бровями делать?
          </div>
          <div
            className="rounded-2xl px-4 py-3 text-[13px] leading-snug max-w-[80%] mb-3"
            style={{ backgroundColor: "#161416", border: "1px solid rgba(255,255,255,0.05)", color: "#E8E3DD" }}
          >
            Тебе подойдёт лёгкая коррекция нижней линии — убрать лишние волоски под дугой пинцетом, но не трогать верх. Форма у тебя хорошая от природы, главное не перещипать.
          </div>
          <div
            className="rounded-2xl px-4 py-3 text-[13px] leading-snug max-w-[65%] ml-auto mb-3"
            style={{ backgroundColor: "#FF5E3A", color: "#000" }}
          >
            Какую стрижку посоветуешь?
          </div>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(10,10,12,0.9) 100%)",
          }}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: "rgba(255,94,58,0.15)", border: "1px solid rgba(255,94,58,0.3)" }}>
            <Lock size={14} style={{ color: "#FF5E3A" }} />
            <span className="text-[12px] font-bold" style={{ color: "#FF5E3A" }}>Доступно с BEKS PRO</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex gap-2 overflow-x-auto mb-3 no-scrollbar">
          {suggestions.map((s, i) => (
            <span
              key={i}
              className="shrink-0 text-[12px] rounded-full px-3 py-2 whitespace-nowrap"
              style={{ color: "#8A8580", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {s}
            </span>
          ))}
        </div>
        <div className="relative">
          <input
            disabled
            placeholder="Спроси про внешность"
            className="w-full rounded-xl px-4 py-3 text-[14px] outline-none"
            style={{
              backgroundColor: "#161416",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#8A8580",
            }}
          />
          <Lock
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: "#6B6660" }}
          />
        </div>
      </div>
    </div>
  );
}

// ---------- TAB 2: ANALYSIS ----------

function ScanningOverlay() {
  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#161416] border border-white/10">
      <div className="absolute inset-0 flex items-center justify-center">
        <ScanFace size={56} className="text-white/10" />
      </div>
      <div className="absolute left-0 right-0 h-[2px] bg-[#FF5E3A] shadow-[0_0_12px_2px_rgba(255,94,58,0.7)] animate-[scan_2.2s_ease-in-out_infinite]" />
      <style>{`
        @keyframes scan {
          0% { top: 6%; opacity: 0.3; }
          50% { top: 92%; opacity: 1; }
          100% { top: 6%; opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

function AnalysisTab() {
  const [step, setStep] = useState("intro"); // intro | guide | upload | scanning | report
  const [photo, setPhoto] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setPhoto({ b64, mime: file.type, url: URL.createObjectURL(file) });
  };

  const runAnalysis = async () => {
    if (!photo) return;
    setStep("scanning");
    setError(null);
    try {
      const text = await callClaude(
        [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: photo.mime || "image/jpeg",
                  data: photo.b64,
                },
              },
              {
                type: "text",
                text:
                  "Проанализируй внешность по фото для приложения BEKS Lab по уходу за собой. Дай структурированный, конкретный, честный разбор по 4 зонам: Кожа, Брови/взгляд, Волосы/причёска, Общий стиль. Для каждой зоны: что сейчас по факту видно (1-2 предложения, прямо, без сглаживания, но уважительно), и конкретную рекомендацию что сделать. В конце — 'Главный приоритет' (одна самая значимая зона для улучшения первой) и краткое объяснение почему. Никаких числовых оценок, баллов или рейтингов (никакого X/10, никаких процентов точности). Не делай выводов о возрасте, расе, поле, теле — только зоны выше. Формат ответа: четыре заголовка зон жирным текстом, затем абзац 'Главный приоритет'.",
              },
            ],
          },
        ],
        { maxTokens: 900 }
      );
      setReport(text);
      setStep("report");
    } catch (e) {
      setError("Не удалось проанализировать фото. Попробуй другое изображение.");
      setStep("upload");
    }
  };

  if (step === "intro") {
    return (
      <div className="px-5 pt-5 pb-24">
        <SectionEyebrow>Анализ BEKS</SectionEyebrow>
        <h1 className="text-[28px] font-black text-[#F5F0EC] leading-none mb-5">
          Анализ.
        </h1>
        <div className="rounded-2xl border border-white/10 bg-[#161416] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[#FF5E3A]" />
            <span className="text-[13px] font-bold text-[#F5F0EC]">
              Новый анализ
            </span>
          </div>
          <p className="text-[13px] text-[#A8A39D] leading-snug mb-4">
            Загрузи фото лица — получишь честный разбор по зонам: кожа,
            брови, волосы, стиль. Без баллов и фейковой точности — только
            конкретные наблюдения и план действий.
          </p>
          <button
            onClick={() => setStep("guide")}
            className="w-full bg-[#FF5E3A] text-black font-bold rounded-xl py-3 flex items-center justify-center gap-2"
          >
            Начать анализ <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-6">
          <div className="text-[13px] font-bold text-[#F5F0EC] mb-2">
            Как это работает
          </div>
          <div className="space-y-2">
            {[
              "Загружаешь одно фото лица при дневном свете",
              "Смотрим кожу, брови, волосы и общий стиль",
              "Получаешь конкретные наблюдения и шаги по улучшению",
            ].map((t, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-[#161416] border border-white/5 rounded-xl px-4 py-3"
              >
                <span className="text-[#FF5E3A] font-mono text-[12px] mt-0.5">
                  {i + 1}
                </span>
                <span className="text-[13px] text-[#C9C4BE] leading-snug">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "guide") {
    return (
      <div className="px-5 pt-5 pb-24">
        <button
          onClick={() => setStep("intro")}
          className="flex items-center gap-1 text-[#8A8580] text-[12px] mb-4"
        >
          <ArrowLeft size={14} /> Назад
        </button>
        <div className="flex items-center gap-2 mb-1">
          <div className="flex gap-1">
            {[0, 1].map((i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full ${
                  i === 0 ? "w-6 bg-[#FF5E3A]" : "w-1.5 bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>
        <h1 className="text-[24px] font-black text-[#F5F0EC] mb-4">
          Как сфотографироваться
        </h1>

        <div className="rounded-2xl border border-white/10 bg-[#161416] p-4 flex gap-4 items-center mb-4">
          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-black/40 shrink-0 flex items-center justify-center">
            <div className="absolute inset-2 border-2 border-[#FF5E3A]/60 rounded-lg" />
            <ScanFace size={36} className="text-white/20" />
            <span className="absolute bottom-1 left-1 right-1 text-center text-[8px] font-mono uppercase tracking-wider text-[#FF8A65]">
              front view
            </span>
          </div>
          <div>
            <PillTag>Шаг 1</PillTag>
            <div className="text-[15px] font-bold text-[#F5F0EC] mt-2">
              Фото анфас
            </div>
            <p className="text-[12px] text-[#8A8580] mt-1 leading-snug">
              Лицо по центру, свет спереди, без сильного поворота головы.
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          {[
            "Снимай при дневном свете, без фильтров",
            "Убери очки, чёлку с глаз, держи камеру на уровне глаз",
            "Нейтральное выражение лица, смотри прямо в камеру",
          ].map((t, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-[#161416] border border-white/5 rounded-xl px-4 py-3"
            >
              <Check size={14} className="text-[#FF5E3A] mt-0.5 shrink-0" />
              <span className="text-[13px] text-[#C9C4BE] leading-snug">
                {t}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setStep("upload")}
          className="w-full bg-[#FF5E3A] text-black font-bold rounded-xl py-3"
        >
          Продолжить
        </button>
      </div>
    );
  }

  if (step === "upload") {
    return (
      <div className="px-5 pt-5 pb-24">
        <button
          onClick={() => setStep("intro")}
          className="flex items-center gap-1 text-[#8A8580] text-[12px] mb-4"
        >
          <ArrowLeft size={14} /> Назад
        </button>
        <h1 className="text-[24px] font-black text-[#F5F0EC] mb-4">
          Загрузи фото
        </h1>

        {photo ? (
          <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-4">
            <img src={photo.url} alt="upload" className="w-full object-cover" />
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full aspect-square rounded-2xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-2 mb-4"
          >
            <Upload size={28} className="text-[#8A8580]" />
            <span className="text-[13px] text-[#8A8580]">
              Нажми, чтобы выбрать фото
            </span>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
        />

        {error && (
          <p className="text-[12px] text-[#FF8A65] mb-3">{error}</p>
        )}

        <button
          onClick={runAnalysis}
          disabled={!photo}
          className="w-full bg-[#FF5E3A] text-black font-bold rounded-xl py-3 disabled:opacity-40"
        >
          Запустить анализ
        </button>
        <p className="text-[11px] text-[#6B6660] mt-3 leading-snug">
          Фото обрабатывается для анализа и не публикуется.
        </p>
      </div>
    );
  }

  if (step === "scanning") {
    return (
      <div className="px-5 pt-5 pb-24">
        <h1 className="text-[24px] font-black text-[#F5F0EC] mb-4">
          Проверяем лицо
        </h1>
        <p className="text-[13px] text-[#A8A39D] mb-4 leading-snug">
          Смотрим кожу, пропорции и общий вид. Это займёт несколько секунд.
        </p>
        <ScanningOverlay />
      </div>
    );
  }

  // report
  return (
    <div className="px-5 pt-5 pb-24">
      <button
        onClick={() => {
          setStep("intro");
          setPhoto(null);
          setReport(null);
        }}
        className="flex items-center gap-1 text-[#8A8580] text-[12px] mb-4"
      >
        <ArrowLeft size={14} /> Новый анализ
      </button>
      <SectionEyebrow>Отчёт готов</SectionEyebrow>
      <h1 className="text-[24px] font-black text-[#F5F0EC] mb-4">
        Твой разбор.
      </h1>
      <div className="rounded-2xl border border-white/10 bg-[#161416] p-5 whitespace-pre-wrap text-[13.5px] text-[#E8E3DD] leading-relaxed">
        {report}
      </div>
    </div>
  );
}

// ---------- TAB 3: ACADEMY ----------

const GUIDES = {
  soft: [
    { title: "Кожа", desc: "Тон, акне, SPF", count: 14 },
    { title: "Волосы", desc: "Стрижка и укладка", count: 9 },
    { title: "Брови", desc: "Форма и плотность", count: 8 },
    { title: "Стиль", desc: "Одежда и образ", count: 6 },
  ],
  hard: [
    { title: "Осанка", desc: "Привычки и упражнения", count: 5 },
    { title: "Сон и восстановление", desc: "Влияние на внешний вид", count: 4 },
  ],
};

function AcademyTab() {
  const [tab, setTab] = useState("soft");
  const list = GUIDES[tab];
  return (
    <div className="px-5 pt-5 pb-24">
      <SectionEyebrow>Академия BEKS</SectionEyebrow>
      <h1 className="text-[28px] font-black text-[#F5F0EC] mb-4">
        Гайды.
      </h1>
      <div className="flex gap-2 mb-4">
        {[
          { id: "soft", label: "Softmaxxing" },
          { id: "hard", label: "Hardmaxxing" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold border ${
              tab === t.id
                ? "bg-[#FF5E3A] text-black border-[#FF5E3A]"
                : "bg-[#161416] text-[#8A8580] border-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((g, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-[#161416] p-4 flex items-center justify-between"
          >
            <div>
              <PillTag>{tab === "soft" ? "Softmaxxing" : "Hardmaxxing"}</PillTag>
              <div className="text-[16px] font-bold text-[#F5F0EC] mt-2">
                {g.title}
              </div>
              <div className="text-[12px] text-[#8A8580]">{g.desc}</div>
              <div className="text-[11px] text-[#6B6660] mt-1">
                Всего гайдов: {g.count}
              </div>
            </div>
            <button
              className="text-[12px] font-bold rounded-lg px-4 py-2 whitespace-nowrap flex items-center gap-1"
              style={{ backgroundColor: "#FF5E3A", color: "#000" }}
            >
              Смотреть <ArrowRight size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- TAB 4: CALORIES ----------

function CaloriesTab() {
  const [meal, setMeal] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const target = { kcal: 2580, protein: 126, fat: 60, carbs: 384 };

  const totals = entries.reduce(
    (acc, e) => ({
      kcal: acc.kcal + e.kcal,
      protein: acc.protein + e.protein,
      fat: acc.fat + e.fat,
      carbs: acc.carbs + e.carbs,
    }),
    { kcal: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const addMeal = async () => {
    const text = meal.trim();
    if (!text || loading) return;
    setLoading(true);
    try {
      const raw = await callClaude(
        [
          {
            role: "user",
            content: `Оцени КБЖУ для одной порции блюда: "${text}". Ответь СТРОГО в JSON без markdown и пояснений, в формате {"kcal": число, "protein": число, "fat": число, "carbs": число}.`,
          },
        ],
        { maxTokens: 200 }
      );
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setEntries((list) => [
        { name: text, ...parsed },
        ...list,
      ]);
      setMeal("");
    } catch (e) {
      setEntries((list) => [
        { name: text, kcal: 0, protein: 0, fat: 0, carbs: 0, failed: true },
        ...list,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 pt-5 pb-24">
      <SectionEyebrow>Питание</SectionEyebrow>
      <h1 className="text-[28px] font-black text-[#F5F0EC] mb-4">
        Калории.
      </h1>

      <div className="rounded-2xl border border-white/10 bg-[#161416] p-5 mb-4">
        <PillTag>Today</PillTag>
        <div className="text-[28px] font-black text-[#F5F0EC] mt-2">
          {totals.kcal} / {target.kcal} ккал
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {[
            ["Белки", totals.protein, target.protein],
            ["Жиры", totals.fat, target.fat],
            ["Углеводы", totals.carbs, target.carbs],
          ].map(([label, val, max]) => (
            <div key={label} className="bg-black/30 rounded-xl p-3">
              <div className="text-[11px] text-[#8A8580]">{label}</div>
              <div className="text-[15px] font-bold text-[#FF5E3A]">
                {val}/{max}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#161416] p-5 mb-4">
        <div className="text-[13px] font-bold text-[#F5F0EC] mb-1">
          Добавить приём пищи
        </div>
        <p className="text-[12px] text-[#8A8580] mb-3 leading-snug">
          Опиши блюдо коротко: «омлет с сыром и кофе», «шаурма куриная».
        </p>
        <div className="flex gap-2">
          <input
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMeal()}
            placeholder="Введите блюдо"
            className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-[#F5F0EC] placeholder-[#6B6660] outline-none focus:border-[#FF5E3A]/50"
          />
          <button
            onClick={addMeal}
            disabled={loading}
            className="w-12 h-12 rounded-xl bg-[#FF5E3A] flex items-center justify-center disabled:opacity-50"
          >
            <Check size={18} className="text-black" />
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#0F0E0F] p-5 text-center">
          <div className="text-[13px] font-bold text-[#F5F0EC]">
            Приёмов пищи пока нет
          </div>
          <div className="text-[12px] text-[#8A8580] mt-1">
            Добавь блюдо описанием выше.
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((e, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-[#161416] p-4 flex items-center justify-between"
            >
              <span className="text-[13px] text-[#E8E3DD]">{e.name}</span>
              {e.failed ? (
                <span className="text-[11px] text-[#FF8A65]">ошибка</span>
              ) : (
                <span className="text-[12px] font-mono text-[#FF5E3A]">
                  {e.kcal} ккал
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- TAB 5: PROFILE ----------

function ProfileTab() {
  return (
    <div className="px-5 pt-5 pb-24">
      <SectionEyebrow>Аккаунт</SectionEyebrow>
      <h1 className="text-[28px] font-black text-[#F5F0EC] mb-4">
        Профиль.
      </h1>

      <div className="rounded-2xl border border-white/10 bg-[#161416] p-5 mb-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
          <User size={20} className="text-[#8A8580]" />
        </div>
        <div>
          <div className="text-[13px] font-bold text-[#F5F0EC]">
            BEKS PRO не активен
          </div>
          <div className="text-[11px] text-[#8A8580]">
            Базовые функции доступны бесплатно
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#FFB454]/30 bg-gradient-to-br from-[#1A1410] to-[#161416] p-5 mb-4">
        <PillTag tone="pro">BEKS PRO</PillTag>
        <div className="text-[20px] font-black text-[#F5F0EC] mt-2">
          Расширенный доступ
        </div>
        <p className="text-[12.5px] text-[#A8A39D] mt-1 mb-4 leading-snug">
          Безлимитный чат, история анализов и premium-гайды. Один разбор
          лица в неделю и расчёт КБЖУ остаются бесплатными навсегда.
        </p>
        <button className="w-full bg-[#FFB454] text-black font-bold rounded-xl py-3">
          Оформить BEKS PRO (макет)
        </button>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#161416] p-4 flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold text-[#F5F0EC]">
            Что бесплатно сейчас
          </div>
          <div className="text-[11px] text-[#8A8580] mt-0.5">
            1 анализ лица в неделю и трекер калорий — без подписки
          </div>
        </div>
        <PillTag tone="free">FREE</PillTag>
      </div>
    </div>
  );
}

// ---------- Settings overlay ----------

function SettingsSheet({ onClose }) {
  const [weight, setWeight] = useState("75");
  const [height, setHeight] = useState("180");
  const [age, setAge] = useState("25");
  const [goal, setGoal] = useState("balance"); // cut | balance | gain

  const goals = [
    { id: "cut", label: "Снижение" },
    { id: "balance", label: "Баланс" },
    { id: "gain", label: "Набор" },
  ];

  return (
    <div
      className="absolute inset-0 z-30 flex items-end"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
    >
      <div
        className="w-full max-h-[88%] overflow-y-auto rounded-t-3xl px-5 pt-5 pb-8 border-t border-white/10"
        style={{ backgroundColor: "#0F0E0F" }}
      >
        <div className="flex items-center justify-between mb-4">
          <PillTag>Настройки</PillTag>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
          >
            <X size={15} className="text-[#C9C4BE]" />
          </button>
        </div>
        <h1 className="text-[24px] font-black text-[#F5F0EC] mb-1">
          Твои параметры
        </h1>
        <p className="text-[12.5px] text-[#8A8580] mb-5 leading-snug">
          Используются для расчёта калорий, БЖУ и подсказок в анализе.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#8A8580]">
              Возраст
            </label>
            <input
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full mt-1 bg-[#161416] border border-white/10 rounded-xl px-4 py-3 text-[15px] font-bold text-[#F5F0EC] outline-none focus:border-[#FF5E3A]/50"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#8A8580]">
              Рост, см
            </label>
            <input
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full mt-1 bg-[#161416] border border-white/10 rounded-xl px-4 py-3 text-[15px] font-bold text-[#F5F0EC] outline-none focus:border-[#FF5E3A]/50"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[10px] uppercase tracking-wider text-[#8A8580]">
            Вес, кг
          </label>
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full mt-1 bg-[#161416] border border-white/10 rounded-xl px-4 py-3 text-[15px] font-bold text-[#F5F0EC] outline-none focus:border-[#FF5E3A]/50"
          />
        </div>

        <div className="mb-6">
          <label className="text-[10px] uppercase tracking-wider text-[#8A8580] mb-2 block">
            Режим
          </label>
          <div className="flex gap-2">
            {goals.map((g) => (
              <button
                key={g.id}
                onClick={() => setGoal(g.id)}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold border ${
                  goal === g.id
                    ? "bg-[#FF5E3A] text-black border-[#FF5E3A]"
                    : "bg-[#161416] text-[#8A8580] border-white/10"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#FF5E3A] text-black font-bold rounded-xl py-3"
        >
          Пересчитать цель
        </button>
      </div>
    </div>
  );
}

// ---------- App shell ----------

export default function App() {
  const [tab, setTab] = useState("chat");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const tabs = [
    { id: "chat", label: "Чат", icon: MessageCircle, render: ChatTab },
    { id: "analysis", label: "Анализ", icon: ScanFace, render: AnalysisTab },
    { id: "academy", label: "Академия", icon: GraduationCap, render: AcademyTab },
    { id: "calories", label: "Калории", icon: Flame, render: CaloriesTab },
    { id: "profile", label: "Профиль", icon: User, render: ProfileTab },
  ];

  const Active = tabs.find((t) => t.id === tab).render;

  return (
    <div
      className="relative w-full h-screen flex flex-col font-sans max-w-md mx-auto overflow-hidden"
      style={{
        backgroundColor: "#0A0A0C",
        color: "#F5F0EC",
        background: "radial-gradient(ellipse 160% 70% at 50% -15%, rgba(255,94,58,0.35) 0%, transparent 60%), radial-gradient(ellipse 140% 70% at 100% 110%, rgba(255,180,84,0.18) 0%, transparent 50%), radial-gradient(ellipse 100% 50% at 0% 60%, rgba(255,94,58,0.06) 0%, transparent 50%), #0A0A0C",
      }}
    >
      <style>{`
        .text-\\[\\#F5F0EC\\] { color: #F5F0EC; }
        .text-\\[\\#E8E3DD\\] { color: #E8E3DD; }
        .text-\\[\\#C9C4BE\\] { color: #C9C4BE; }
        .text-\\[\\#A8A39D\\] { color: #A8A39D; }
        .text-\\[\\#8A8580\\] { color: #8A8580; }
        .text-\\[\\#6B6660\\] { color: #6B6660; }
        .text-\\[\\#FF5E3A\\] { color: #FF5E3A; }
        .text-\\[\\#FF8A65\\] { color: #FF8A65; }
        .text-\\[\\#FFB454\\] { color: #FFB454; }
        .text-black { color: #000; }
        .text-white\\/10 { color: rgba(255,255,255,0.1); }
        .text-white\\/20 { color: rgba(255,255,255,0.2); }
        .bg-\\[\\#161416\\] { background-color: #161416; }
        .bg-\\[\\#0F0E0F\\] { background-color: #0F0E0F; }
        .bg-\\[\\#FF5E3A\\] { background-color: #FF5E3A; }
        .bg-\\[\\#FFB454\\] { background-color: #FFB454; }
        .bg-black\\/30 { background-color: rgba(0,0,0,0.3); }
        .bg-black\\/40 { background-color: rgba(0,0,0,0.4); }
        .bg-white\\/5 { background-color: rgba(255,255,255,0.05); }
        .border-white\\/5 { border-color: rgba(255,255,255,0.05); }
        .border-white\\/10 { border-color: rgba(255,255,255,0.1); }
        .border-white\\/15 { border-color: rgba(255,255,255,0.15); }
        .placeholder-\\[\\#6B6660\\]::placeholder { color: #6B6660; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <TopBar onSettings={() => setSettingsOpen(true)} />
      <div className="flex-1 overflow-y-auto">
        {tab === "chat" ? (
          <Active onUpgrade={() => setTab("profile")} />
        ) : (
          <Active />
        )}
      </div>
      <div
        className="border-t border-white/5 flex"
        style={{ backgroundColor: "#0A0A0C" }}
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = t.id === tab;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex flex-col items-center gap-1 py-3"
            >
              <Icon
                size={20}
                className={isActive ? "text-[#FF5E3A]" : "text-[#6B6660]"}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-[#FF5E3A]" : "text-[#6B6660]"
                }`}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
      {settingsOpen && (
        <SettingsSheet onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
}
