import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  MessageCircle, ScanFace, GraduationCap, Flame, User,
  ArrowRight, ArrowLeft, Upload, Check, Lock, Sparkles, Settings, X,
} from "lucide-react";

// ============ CHANGE THIS TO YOUR RAILWAY URL ============
const API_URL = "https://web-production-3f35.up.railway.app";
// ==========================================================

function getTgId() {
  try {
    const u = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (u?.id) return u.id;
  } catch {}
  return null;
}
function getInitData() {
  try { return window.Telegram?.WebApp?.initData || ""; } catch { return ""; }
}
function apiHeaders() {
  return { "Content-Type": "application/json", "Authorization": getInitData() };
}

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.onerror = rej; r.readAsDataURL(file);
  });
}

// ---- primitives ----
function TopBar({ title = "BEKS Lab", onSettings }) {
  return (
    <div className="sticky top-0 z-20 backdrop-blur border-b border-white/5 px-5 py-4 flex items-center justify-between" style={{ backgroundColor: "rgba(10,10,12,0.95)" }}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-[#FF5E3A] flex items-center justify-center font-black text-black text-sm" style={{backgroundColor:"#FF5E3A"}}>B</div>
        <span className="font-extrabold tracking-tight text-[15px]" style={{color:"#F5F0EC"}}>{title}</span>
      </div>
      <button onClick={onSettings} className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor:"rgba(255,255,255,0.05)"}}>
        <Settings size={15} style={{color:"#C9C4BE"}} />
      </button>
    </div>
  );
}
function SectionEyebrow({ children }) {
  return <div className="text-[11px] font-mono uppercase tracking-[0.2em] mb-2" style={{color:"#FF5E3A"}}>{children}</div>;
}
function PillTag({ children, tone = "default" }) {
  const t = { default:{background:"rgba(255,255,255,0.05)",color:"#C9C4BE",borderColor:"rgba(255,255,255,0.1)"},
    pro:{background:"rgba(255,180,84,0.15)",color:"#FFB454",borderColor:"rgba(255,180,84,0.3)"},
    free:{background:"rgba(255,94,58,0.15)",color:"#FF8A65",borderColor:"rgba(255,94,58,0.3)"} };
  return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border inline-block" style={t[tone]}>{children}</span>;
}

// ---- CHAT (paywall) ----
function ChatTab({ onUpgrade }) {
  const suggestions = ["Что даст самый быстрый прирост во внешности?", "Как понять мой главный минус?"];
  return (
    <div className="flex flex-col h-full" style={{background:"radial-gradient(ellipse 160% 70% at 50% -15%,rgba(255,94,58,0.35) 0%,transparent 60%),radial-gradient(ellipse 140% 70% at 100% 110%,rgba(255,180,84,0.18) 0%,transparent 50%),#0A0A0C",color:"#F5F0EC"}}>
      <div className="px-5 pt-5 pb-2">
        <SectionEyebrow>BEKS AI</SectionEyebrow>
        <h1 className="text-[28px] font-black leading-none" style={{color:"#F5F0EC"}}>Чат.</h1>
      </div>
      <div className="px-5 pt-3">
        <div className="rounded-2xl p-5" style={{background:"linear-gradient(135deg,#1A1410,#161416)",border:"1px solid rgba(255,180,84,0.25)"}}>
          <PillTag tone="pro">BEKS PRO</PillTag>
          <div className="text-[19px] font-black mt-3" style={{color:"#F5F0EC"}}>Чат доступен с подпиской</div>
          <p className="text-[12.5px] mt-2 leading-snug" style={{color:"#A8A39D"}}>Бесплатный доступ к BEKS AI Chat отключён для аккаунтов без подписки.</p>
          <button onClick={onUpgrade} className="w-full font-bold rounded-xl py-3 mt-4" style={{backgroundColor:"#FF5E3A",color:"#000"}}>Оформить подписку</button>
        </div>
      </div>
      <div className="flex-1 px-5 pt-4 overflow-hidden relative">
        <div style={{filter:"blur(5px)",opacity:0.4,pointerEvents:"none"}}>
          <div className="rounded-2xl px-4 py-3 text-[13px] max-w-[80%] mb-3" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.05)",color:"#E8E3DD"}}>У тебя сухая кожа на щеках и Т-зона жирнит — комбинированный тип. Начни с мягкого геля без SLS.</div>
          <div className="rounded-2xl px-4 py-3 text-[13px] max-w-[70%] ml-auto mb-3" style={{backgroundColor:"#FF5E3A",color:"#000"}}>А что с бровями?</div>
          <div className="rounded-2xl px-4 py-3 text-[13px] max-w-[80%] mb-3" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.05)",color:"#E8E3DD"}}>Лёгкая коррекция нижней линии — убрать лишнее пинцетом, верх не трогай.</div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center" style={{background:"linear-gradient(180deg,transparent 0%,rgba(10,10,12,0.9) 100%)"}}>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{backgroundColor:"rgba(255,94,58,0.15)",border:"1px solid rgba(255,94,58,0.3)"}}>
            <Lock size={14} style={{color:"#FF5E3A"}} /><span className="text-[12px] font-bold" style={{color:"#FF5E3A"}}>Доступно с BEKS PRO</span>
          </div>
        </div>
      </div>
      <div className="px-5 py-3" style={{borderTop:"1px solid rgba(255,255,255,0.05)"}}>
        <div className="flex gap-2 overflow-x-auto mb-3">{suggestions.map((s,i)=><span key={i} className="shrink-0 text-[12px] rounded-full px-3 py-2 whitespace-nowrap" style={{color:"#8A8580",border:"1px solid rgba(255,255,255,0.1)"}}>{s}</span>)}</div>
        <div className="relative">
          <input disabled placeholder="Спроси про внешность" className="w-full rounded-xl px-4 py-3 text-[14px] outline-none" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.1)",color:"#8A8580"}} />
          <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2" style={{color:"#6B6660"}} />
        </div>
      </div>
    </div>
  );
}

// ---- ANALYSIS ----
function ScanningOverlay() {
  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.1)"}}>
      <div className="absolute inset-0 flex items-center justify-center"><ScanFace size={56} style={{color:"rgba(255,255,255,0.1)"}} /></div>
      <div className="absolute left-0 right-0 h-[2px] shadow-lg" style={{backgroundColor:"#FF5E3A",animation:"scan 2.2s ease-in-out infinite"}} />
      <style>{`@keyframes scan { 0%{top:6%;opacity:.3} 50%{top:92%;opacity:1} 100%{top:6%;opacity:.3} }`}</style>
    </div>
  );
}

function AnalysisTab() {
  const [step, setStep] = useState("intro");
  const [photo, setPhoto] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const onFile = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const b64 = await fileToBase64(f);
    setPhoto({ b64, mime: f.type, url: URL.createObjectURL(f) });
  };

  const runAnalysis = async () => {
    if (!photo) return; setStep("scanning"); setError(null);
    try {
      const tid = getTgId();
      const res = await fetch(`${API_URL}/api/analyze${tid ? `?tg_id=${tid}` : ""}`, {
        method: "POST", headers: apiHeaders(),
        body: JSON.stringify({ image: photo.b64, mime: photo.mime || "image/jpeg" }),
      });
      const data = await res.json();
      if (data.report) { setReport(data.report); setStep("report"); }
      else { setError(data.error || "Ошибка"); setStep("upload"); }
    } catch (e) { setError("Не удалось проанализировать фото."); setStep("upload"); }
  };

  if (step === "intro") return (
    <div className="px-5 pt-5 pb-24">
      <SectionEyebrow>Анализ BEKS</SectionEyebrow>
      <h1 className="text-[28px] font-black leading-none mb-5" style={{color:"#F5F0EC"}}>Анализ.</h1>
      <div className="rounded-2xl p-5" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.1)"}}>
        <div className="flex items-center gap-2 mb-3"><Sparkles size={16} style={{color:"#FF5E3A"}} /><span className="text-[13px] font-bold" style={{color:"#F5F0EC"}}>Новый анализ</span></div>
        <p className="text-[13px] leading-snug mb-4" style={{color:"#A8A39D"}}>Загрузи фото лица — получишь честный разбор по зонам: кожа, брови, волосы, стиль.</p>
        <button onClick={()=>setStep("guide")} className="w-full font-bold rounded-xl py-3 flex items-center justify-center gap-2" style={{backgroundColor:"#FF5E3A",color:"#000"}}>Начать анализ <ArrowRight size={16} /></button>
      </div>
      <div className="mt-6"><div className="text-[13px] font-bold mb-2" style={{color:"#F5F0EC"}}>Как это работает</div>
        <div className="space-y-2">{["Загружаешь фото лица при дневном свете","Смотрим кожу, брови, волосы и стиль","Получаешь конкретные наблюдения и шаги по улучшению"].map((t,i)=>
          <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.05)"}}>
            <span className="font-mono text-[12px] mt-0.5" style={{color:"#FF5E3A"}}>{i+1}</span>
            <span className="text-[13px] leading-snug" style={{color:"#C9C4BE"}}>{t}</span>
          </div>)}</div>
      </div>
    </div>
  );

  if (step === "guide") return (
    <div className="px-5 pt-5 pb-24">
      <button onClick={()=>setStep("intro")} className="flex items-center gap-1 text-[12px] mb-4" style={{color:"#8A8580"}}><ArrowLeft size={14} /> Назад</button>
      <h1 className="text-[24px] font-black mb-4" style={{color:"#F5F0EC"}}>Как сфотографироваться</h1>
      <div className="rounded-2xl p-4 flex gap-4 items-center mb-4" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.1)"}}>
        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 flex items-center justify-center" style={{backgroundColor:"rgba(0,0,0,0.4)"}}>
          <div className="absolute inset-2 rounded-lg" style={{border:"2px solid rgba(255,94,58,0.6)"}} />
          <ScanFace size={36} style={{color:"rgba(255,255,255,0.2)"}} />
          <span className="absolute bottom-1 left-1 right-1 text-center text-[8px] font-mono uppercase tracking-wider" style={{color:"#FF8A65"}}>front view</span>
        </div>
        <div><PillTag>Шаг 1</PillTag><div className="text-[15px] font-bold mt-2" style={{color:"#F5F0EC"}}>Фото анфас</div>
          <p className="text-[12px] mt-1 leading-snug" style={{color:"#8A8580"}}>Лицо по центру, свет спереди, без поворота.</p></div>
      </div>
      <div className="space-y-2 mb-5">{["Дневной свет, без фильтров","Убери очки, чёлку, камера на уровне глаз","Нейтральное лицо, смотри в камеру"].map((t,i)=>
        <div key={i} className="flex items-start gap-3 rounded-xl px-4 py-3" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.05)"}}>
          <Check size={14} className="mt-0.5 shrink-0" style={{color:"#FF5E3A"}} /><span className="text-[13px] leading-snug" style={{color:"#C9C4BE"}}>{t}</span>
        </div>)}</div>
      <button onClick={()=>setStep("upload")} className="w-full font-bold rounded-xl py-3" style={{backgroundColor:"#FF5E3A",color:"#000"}}>Продолжить</button>
    </div>
  );

  if (step === "upload") return (
    <div className="px-5 pt-5 pb-24">
      <button onClick={()=>setStep("intro")} className="flex items-center gap-1 text-[12px] mb-4" style={{color:"#8A8580"}}><ArrowLeft size={14} /> Назад</button>
      <h1 className="text-[24px] font-black mb-4" style={{color:"#F5F0EC"}}>Загрузи фото</h1>
      {photo ? <div className="relative rounded-2xl overflow-hidden mb-4" style={{border:"1px solid rgba(255,255,255,0.1)"}}><img src={photo.url} alt="" className="w-full object-cover" /></div>
        : <button onClick={()=>fileRef.current?.click()} className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 mb-4" style={{border:"2px dashed rgba(255,255,255,0.15)"}}>
            <Upload size={28} style={{color:"#8A8580"}} /><span className="text-[13px]" style={{color:"#8A8580"}}>Нажми, чтобы выбрать</span></button>}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      {error && <p className="text-[12px] mb-3" style={{color:"#FF8A65"}}>{error}</p>}
      <button onClick={runAnalysis} disabled={!photo} className="w-full font-bold rounded-xl py-3" style={{backgroundColor:photo?"#FF5E3A":"rgba(255,94,58,0.4)",color:"#000"}}>Запустить анализ</button>
    </div>
  );

  if (step === "scanning") return (
    <div className="px-5 pt-5 pb-24">
      <h1 className="text-[24px] font-black mb-4" style={{color:"#F5F0EC"}}>Проверяем лицо</h1>
      <p className="text-[13px] mb-4 leading-snug" style={{color:"#A8A39D"}}>Смотрим кожу, пропорции и общий вид.</p>
      <ScanningOverlay />
    </div>
  );

  return (
    <div className="px-5 pt-5 pb-24">
      <button onClick={()=>{setStep("intro");setPhoto(null);setReport(null);}} className="flex items-center gap-1 text-[12px] mb-4" style={{color:"#8A8580"}}><ArrowLeft size={14} /> Новый анализ</button>
      <SectionEyebrow>Отчёт готов</SectionEyebrow>
      <h1 className="text-[24px] font-black mb-4" style={{color:"#F5F0EC"}}>Твой разбор.</h1>
      <div className="rounded-2xl p-5 whitespace-pre-wrap text-[13.5px] leading-relaxed" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.1)",color:"#E8E3DD"}}>{report}</div>
    </div>
  );
}

// ---- ACADEMY ----
const GUIDES = {
  soft:[{title:"Кожа",desc:"Тон, акне, SPF",count:14},{title:"Волосы",desc:"Стрижка и укладка",count:9},{title:"Брови",desc:"Форма и плотность",count:8},{title:"Стиль",desc:"Одежда и образ",count:6}],
  hard:[{title:"Осанка",desc:"Привычки и упражнения",count:5},{title:"Сон и восстановление",desc:"Влияние на внешний вид",count:4}],
};
function AcademyTab() {
  const [tab, setTab] = useState("soft");
  return (
    <div className="px-5 pt-5 pb-24">
      <SectionEyebrow>Академия BEKS</SectionEyebrow>
      <h1 className="text-[28px] font-black mb-4" style={{color:"#F5F0EC"}}>Гайды.</h1>
      <div className="flex gap-2 mb-4">{[{id:"soft",l:"Softmaxxing"},{id:"hard",l:"Hardmaxxing"}].map(t=>
        <button key={t.id} onClick={()=>setTab(t.id)} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold" style={{backgroundColor:tab===t.id?"#FF5E3A":"#161416",color:tab===t.id?"#000":"#8A8580",border:tab===t.id?"1px solid #FF5E3A":"1px solid rgba(255,255,255,0.1)"}}>{t.l}</button>)}</div>
      <div className="space-y-3">{GUIDES[tab].map((g,i)=>
        <div key={i} className="rounded-2xl p-4 flex items-center justify-between" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.1)"}}>
          <div><PillTag>{tab==="soft"?"Softmaxxing":"Hardmaxxing"}</PillTag>
            <div className="text-[16px] font-bold mt-2" style={{color:"#F5F0EC"}}>{g.title}</div>
            <div className="text-[12px]" style={{color:"#8A8580"}}>{g.desc}</div>
            <div className="text-[11px] mt-1" style={{color:"#6B6660"}}>Гайдов: {g.count}</div></div>
          <button className="text-[12px] font-bold rounded-lg px-4 py-2 flex items-center gap-1" style={{backgroundColor:"#FF5E3A",color:"#000"}}>Смотреть <ArrowRight size={13} /></button>
        </div>)}</div>
    </div>
  );
}

// ---- CALORIES ----
function CaloriesTab() {
  const [meal, setMeal] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const target = { kcal:2580, protein:126, fat:60, carbs:384 };
  const totals = entries.reduce((a,e)=>({kcal:a.kcal+(e.kcal||0),protein:a.protein+(e.protein||0),fat:a.fat+(e.fat||0),carbs:a.carbs+(e.carbs||0)}),{kcal:0,protein:0,fat:0,carbs:0});

  const addMeal = async () => {
    const t = meal.trim(); if (!t||loading) return; setLoading(true);
    try {
      const tid = getTgId();
      const res = await fetch(`${API_URL}/api/calories${tid?`?tg_id=${tid}`:""}`, {
        method:"POST", headers:apiHeaders(), body:JSON.stringify({meal:t}),
      });
      const d = await res.json();
      if (d.kcal !== undefined) { setEntries(l=>[{name:t,...d},...l]); setMeal(""); }
      else { setEntries(l=>[{name:t,kcal:0,protein:0,fat:0,carbs:0,failed:true},...l]); }
    } catch { setEntries(l=>[{name:t,kcal:0,protein:0,fat:0,carbs:0,failed:true},...l]); }
    finally { setLoading(false); }
  };

  return (
    <div className="px-5 pt-5 pb-24">
      <SectionEyebrow>Питание</SectionEyebrow>
      <h1 className="text-[28px] font-black mb-4" style={{color:"#F5F0EC"}}>Калории.</h1>
      <div className="rounded-2xl p-5 mb-4" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.1)"}}>
        <PillTag>Today</PillTag>
        <div className="text-[28px] font-black mt-2" style={{color:"#F5F0EC"}}>{totals.kcal} / {target.kcal} ккал</div>
        <div className="grid grid-cols-3 gap-2 mt-4">{[["Белки",totals.protein,target.protein],["Жиры",totals.fat,target.fat],["Углеводы",totals.carbs,target.carbs]].map(([l,v,m])=>
          <div key={l} className="rounded-xl p-3" style={{backgroundColor:"rgba(0,0,0,0.3)"}}><div className="text-[11px]" style={{color:"#8A8580"}}>{l}</div><div className="text-[15px] font-bold" style={{color:"#FF5E3A"}}>{v}/{m}</div></div>)}</div>
      </div>
      <div className="rounded-2xl p-5 mb-4" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.1)"}}>
        <div className="text-[13px] font-bold mb-1" style={{color:"#F5F0EC"}}>Добавить приём пищи</div>
        <p className="text-[12px] mb-3 leading-snug" style={{color:"#8A8580"}}>Опиши блюдо: «омлет с сыром и кофе»</p>
        <div className="flex gap-2">
          <input value={meal} onChange={e=>setMeal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addMeal()} placeholder="Введите блюдо" className="flex-1 rounded-xl px-4 py-3 text-[14px] outline-none" style={{backgroundColor:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.1)",color:"#F5F0EC"}} />
          <button onClick={addMeal} disabled={loading} className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor:"#FF5E3A",opacity:loading?0.5:1}}><Check size={18} style={{color:"#000"}} /></button>
        </div>
      </div>
      {entries.length===0 ? <div className="rounded-2xl p-5 text-center" style={{backgroundColor:"#0F0E0F",border:"1px solid rgba(255,255,255,0.05)"}}>
        <div className="text-[13px] font-bold" style={{color:"#F5F0EC"}}>Приёмов пищи пока нет</div></div>
        : <div className="space-y-2">{entries.map((e,i)=><div key={i} className="rounded-xl p-4 flex items-center justify-between" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.1)"}}>
          <span className="text-[13px]" style={{color:"#E8E3DD"}}>{e.name}</span>
          {e.failed ? <span className="text-[11px]" style={{color:"#FF8A65"}}>ошибка</span> : <span className="text-[12px] font-mono" style={{color:"#FF5E3A"}}>{e.kcal} ккал</span>}
        </div>)}</div>}
    </div>
  );
}

// ---- PROFILE ----
function ProfileTab() {
  const [isPro, setIsPro] = useState(false);
  useEffect(()=>{
    const tid = getTgId(); if (!tid) return;
    fetch(`${API_URL}/api/profile?tg_id=${tid}`,{headers:apiHeaders()}).then(r=>r.json()).then(d=>{if(d.is_pro)setIsPro(true);}).catch(()=>{});
  },[]);
  return (
    <div className="px-5 pt-5 pb-24">
      <SectionEyebrow>Аккаунт</SectionEyebrow>
      <h1 className="text-[28px] font-black mb-4" style={{color:"#F5F0EC"}}>Профиль.</h1>
      <div className="rounded-2xl p-5 mb-4 flex items-center gap-3" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.1)"}}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor:"rgba(255,255,255,0.05)"}}><User size={20} style={{color:isPro?"#FFB454":"#8A8580"}} /></div>
        <div>
          <div className="text-[13px] font-bold" style={{color:"#F5F0EC"}}>{isPro ? "⭐ BEKS PRO активен" : "BEKS PRO не активен"}</div>
          <div className="text-[11px]" style={{color:"#8A8580"}}>{isPro ? "Все функции доступны" : "Базовые функции бесплатно"}</div>
        </div>
      </div>
      {!isPro && <div className="rounded-2xl p-5 mb-4" style={{background:"linear-gradient(135deg,#1A1410,#161416)",border:"1px solid rgba(255,180,84,0.3)"}}>
        <PillTag tone="pro">BEKS PRO</PillTag>
        <div className="text-[20px] font-black mt-2" style={{color:"#F5F0EC"}}>Расширенный доступ</div>
        <p className="text-[12.5px] mt-1 mb-4 leading-snug" style={{color:"#A8A39D"}}>Безлимитный чат, история анализов и premium-гайды.</p>
        <button className="w-full font-bold rounded-xl py-3" style={{backgroundColor:"#FFB454",color:"#000"}}>Оформить BEKS PRO (макет)</button>
      </div>}
      <div className="rounded-xl p-4 flex items-center justify-between" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.05)"}}>
        <div><div className="text-[13px] font-bold" style={{color:"#F5F0EC"}}>Что бесплатно сейчас</div>
          <div className="text-[11px] mt-0.5" style={{color:"#8A8580"}}>1 анализ в неделю и трекер калорий</div></div>
        <PillTag tone="free">FREE</PillTag>
      </div>
    </div>
  );
}

// ---- SETTINGS ----
function SettingsSheet({ onClose }) {
  const [age,setAge]=useState("25"); const [height,setHeight]=useState("180");
  const [weight,setWeight]=useState("75"); const [goal,setGoal]=useState("balance");
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{
    const tid = getTgId(); if (!tid) { setLoaded(true); return; }
    fetch(`${API_URL}/api/profile?tg_id=${tid}`,{headers:apiHeaders()}).then(r=>r.json()).then(d=>{
      if(d.settings){const s=d.settings;if(s.age)setAge(s.age);if(s.height)setHeight(s.height);if(s.weight)setWeight(s.weight);if(s.goal)setGoal(s.goal);}
      setLoaded(true);
    }).catch(()=>setLoaded(true));
  },[]);

  const save = () => {
    const tid = getTgId();
    if (tid) { fetch(`${API_URL}/api/settings?tg_id=${tid}`,{method:"POST",headers:apiHeaders(),body:JSON.stringify({age,height,weight,goal})}); }
    onClose();
  };

  const goals = [{id:"cut",l:"Снижение"},{id:"balance",l:"Баланс"},{id:"gain",l:"Набор"}];
  return (
    <div className="absolute inset-0 z-30 flex items-end" style={{backgroundColor:"rgba(0,0,0,0.7)"}}>
      <div className="w-full max-h-[88%] overflow-y-auto rounded-t-3xl px-5 pt-5 pb-8" style={{backgroundColor:"#0F0E0F",borderTop:"1px solid rgba(255,255,255,0.1)"}}>
        <div className="flex items-center justify-between mb-4"><PillTag>Настройки</PillTag>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor:"rgba(255,255,255,0.05)"}}><X size={15} style={{color:"#C9C4BE"}} /></button></div>
        <h1 className="text-[24px] font-black mb-1" style={{color:"#F5F0EC"}}>Твои параметры</h1>
        <p className="text-[12.5px] mb-5 leading-snug" style={{color:"#8A8580"}}>Для расчёта калорий и подсказок.</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div><label className="text-[10px] uppercase tracking-wider" style={{color:"#8A8580"}}>Возраст</label>
            <input value={age} onChange={e=>setAge(e.target.value)} className="w-full mt-1 rounded-xl px-4 py-3 text-[15px] font-bold outline-none" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.1)",color:"#F5F0EC"}} /></div>
          <div><label className="text-[10px] uppercase tracking-wider" style={{color:"#8A8580"}}>Рост, см</label>
            <input value={height} onChange={e=>setHeight(e.target.value)} className="w-full mt-1 rounded-xl px-4 py-3 text-[15px] font-bold outline-none" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.1)",color:"#F5F0EC"}} /></div>
        </div>
        <div className="mb-4"><label className="text-[10px] uppercase tracking-wider" style={{color:"#8A8580"}}>Вес, кг</label>
          <input value={weight} onChange={e=>setWeight(e.target.value)} className="w-full mt-1 rounded-xl px-4 py-3 text-[15px] font-bold outline-none" style={{backgroundColor:"#161416",border:"1px solid rgba(255,255,255,0.1)",color:"#F5F0EC"}} /></div>
        <div className="mb-6"><label className="text-[10px] uppercase tracking-wider mb-2 block" style={{color:"#8A8580"}}>Режим</label>
          <div className="flex gap-2">{goals.map(g=><button key={g.id} onClick={()=>setGoal(g.id)} className="flex-1 py-2.5 rounded-xl text-[13px] font-bold" style={{backgroundColor:goal===g.id?"#FF5E3A":"#161416",color:goal===g.id?"#000":"#8A8580",border:goal===g.id?"1px solid #FF5E3A":"1px solid rgba(255,255,255,0.1)"}}>{g.l}</button>)}</div></div>
        <button onClick={save} className="w-full font-bold rounded-xl py-3" style={{backgroundColor:"#FF5E3A",color:"#000"}}>Сохранить</button>
      </div>
    </div>
  );
}

// ---- APP ----
export default function App() {
  const [tab, setTab] = useState("chat");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const tabs = [
    {id:"chat",label:"Чат",icon:MessageCircle,render:ChatTab},
    {id:"analysis",label:"Анализ",icon:ScanFace,render:AnalysisTab},
    {id:"academy",label:"Академия",icon:GraduationCap,render:AcademyTab},
    {id:"calories",label:"Калории",icon:Flame,render:CaloriesTab},
    {id:"profile",label:"Профиль",icon:User,render:ProfileTab},
  ];
  const Active = tabs.find(t=>t.id===tab).render;
  return (
    <div className="relative w-full h-screen flex flex-col font-sans max-w-md mx-auto overflow-hidden" style={{backgroundColor:"#0A0A0C",color:"#F5F0EC",background:"radial-gradient(ellipse 160% 70% at 50% -15%,rgba(255,94,58,0.35) 0%,transparent 60%),radial-gradient(ellipse 140% 70% at 100% 110%,rgba(255,180,84,0.18) 0%,transparent 50%),#0A0A0C"}}>
      <style>{`
        .text-\\[\\#F5F0EC\\]{color:#F5F0EC}.text-\\[\\#E8E3DD\\]{color:#E8E3DD}.text-\\[\\#C9C4BE\\]{color:#C9C4BE}
        .text-\\[\\#A8A39D\\]{color:#A8A39D}.text-\\[\\#8A8580\\]{color:#8A8580}.text-\\[\\#6B6660\\]{color:#6B6660}
        .text-\\[\\#FF5E3A\\]{color:#FF5E3A}.text-\\[\\#FF8A65\\]{color:#FF8A65}.text-\\[\\#FFB454\\]{color:#FFB454}
        .text-black{color:#000}.bg-\\[\\#161416\\]{background:#161416}.bg-\\[\\#FF5E3A\\]{background:#FF5E3A}
        .bg-\\[\\#FFB454\\]{background:#FFB454}.bg-black\\/30{background:rgba(0,0,0,.3)}
        .bg-white\\/5{background:rgba(255,255,255,.05)}.border-white\\/5{border-color:rgba(255,255,255,.05)}
        .border-white\\/10{border-color:rgba(255,255,255,.1)}.border-white\\/15{border-color:rgba(255,255,255,.15)}
        .placeholder-\\[\\#6B6660\\]::placeholder{color:#6B6660}
      `}</style>
      <TopBar onSettings={()=>setSettingsOpen(true)} />
      <div className="flex-1 overflow-y-auto">{tab==="chat"?<Active onUpgrade={()=>setTab("profile")}/>:<Active/>}</div>
      <div className="flex" style={{backgroundColor:"#0A0A0C",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
        {tabs.map(t=>{const I=t.icon;const a=t.id===tab;return(
          <button key={t.id} onClick={()=>setTab(t.id)} className="flex-1 flex flex-col items-center gap-1 py-3">
            <I size={20} style={{color:a?"#FF5E3A":"#6B6660"}} />
            <span className="text-[10px] font-medium" style={{color:a?"#FF5E3A":"#6B6660"}}>{t.label}</span>
          </button>);})}</div>
      {settingsOpen && <SettingsSheet onClose={()=>setSettingsOpen(false)} />}
    </div>
  );
}
