import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────────────── */
const T = {
  bg0: "#0A0A0B",
  bg1: "#111113",
  bg2: "#18181C",
  bg3: "#222228",
  bg4: "#2C2C34",
  border: "#2E2E38",
  borderHi: "#3E3E4A",
  accent: "#7C6FFF",
  accentLo: "#7C6FFF22",
  accentMid: "#7C6FFF44",
  green: "#22C55E",
  greenLo: "#22C55E18",
  amber: "#F59E0B",
  amberLo: "#F59E0B18",
  red: "#EF4444",
  redLo: "#EF444418",
  text0: "#F4F4F6",
  text1: "#A0A0B0",
  text2: "#606070",
  white: "#FFFFFF",
};

const ALL_CATEGORIES = [
  { id: "haircut", label: "Haircut & Styling", icon: "✂", color: "#7C6FFF" },
  { id: "barbing", label: "Barbing", icon: "🪒", color: "#06B6D4" },
  { id: "braids", label: "Braids & Locs", icon: "🪢", color: "#EC4899" },
  { id: "makeup", label: "Makeup", icon: "💄", color: "#F43F5E" },
  { id: "nails", label: "Nails & Gel", icon: "💅", color: "#A855F7" },
  { id: "facials", label: "Facials & Skin", icon: "🧴", color: "#14B8A6" },
  { id: "spa", label: "Massage & Spa", icon: "🛁", color: "#3B82F6" },
  { id: "lashes", label: "Lashes & Brows", icon: "👁", color: "#F97316" },
  { id: "weaves", label: "Weaves & Wigs", icon: "👩", color: "#EAB308" },
  { id: "coloring", label: "Hair Coloring", icon: "🎨", color: "#22C55E" },
];

const PROVIDERS = [
  { id: 1, name: "Supreme Cuts", type: "Salon", location: "Lekki Phase 1", distance: "0.8km", rating: 4.9, reviews: 214, cats: ["barbing","haircut","coloring"], price: "from ₦3,500", initials: "SC", color: "#06B6D4", verified: true },
  { id: 2, name: "Zara Beauty Studio", type: "Salon", location: "Victoria Island", distance: "1.4km", rating: 4.8, reviews: 178, cats: ["braids","weaves","makeup"], price: "from ₦8,000", initials: "ZB", color: "#EC4899", verified: true },
  { id: 3, name: "Glow by Chisom", type: "Independent", location: "Ikoyi", distance: "2.1km", rating: 4.7, reviews: 91, cats: ["makeup","facials","lashes"], price: "from ₦12,000", initials: "GC", color: "#F43F5E", verified: true },
  { id: 4, name: "The Nail Bar", type: "Salon", location: "Surulere", distance: "3.6km", rating: 4.6, reviews: 63, cats: ["nails","spa"], price: "from ₦5,000", initials: "NB", color: "#A855F7", verified: false },
];

const HIRER_BOOKINGS = [
  { id: "BH-2041", provider: "Supreme Cuts", service: "Low Fade + Line Up", date: "Today, 3:00 PM", status: "upcoming", amount: "₦6,500", type: "Home Service" },
  { id: "BH-1987", provider: "Zara Beauty Studio", service: "Knotless Braids", date: "Apr 18, 10:00 AM", status: "completed", amount: "₦22,500", type: "Walk-in" },
  { id: "BH-1902", provider: "Glow by Chisom", service: "Bridal Makeup", date: "Apr 10, 11:00 AM", status: "completed", amount: "₦35,000", type: "Home Service" },
];

const PROVIDER_BOOKINGS = [
  { id: "BH-2041", client: "Amara O.", service: "Low Fade + Line Up", date: "Today, 3:00 PM", status: "upcoming", amount: "₦6,500", type: "Home Service", address: "14 Bode Thomas St, Surulere" },
  { id: "BH-2038", client: "Tunde M.", service: "Barbing + Beard Trim", date: "Today, 11:00 AM", status: "completed", amount: "₦4,500", type: "Walk-in", address: "—" },
  { id: "BH-2030", client: "Emeka N.", service: "Full Haircut", date: "Apr 21, 2:00 PM", status: "completed", amount: "₦3,500", type: "Walk-in", address: "—" },
  { id: "BH-2028", client: "David A.", service: "Low Fade", date: "Apr 20, 4:00 PM", status: "completed", amount: "₦4,000", type: "Home Service", address: "5 Allen Ave, Ikeja" },
];

const CONVERSATIONS = [
  { id: "C-091", hirer: "Amara O.", hirerPhone: "+234 801 234 5678", provider: "Supreme Cuts", providerPhone: "+234 802 345 6789", service: "Low Fade + Line Up", booking: "BH-2041", status: "active", msgs: [
    { from: "bot", text: "New enquiry from Amara O. She wants a Low Fade + Home Service. Inspiration photo attached. Reply with your price.", time: "2:14 PM" },
    { from: "provider", text: "6500 naira", time: "2:18 PM" },
    { from: "bot", text: "Quote of ₦6,500 received. Platform fee: ₦975. Total presented to client: ₦7,475.", time: "2:18 PM" },
    { from: "bot", text: "Payment confirmed ₦7,475. Client contact unlocked for provider. Booking ID: BH-2041", time: "2:31 PM" },
  ]},
  { id: "C-088", hirer: "Tunde M.", hirerPhone: "+234 803 456 7890", provider: "Zara Beauty Studio", providerPhone: "+234 804 567 8901", service: "Knotless Braids", booking: "BH-2040", status: "completed", msgs: [
    { from: "bot", text: "New enquiry from Tunde M. Knotless braids, medium length. Photo attached. Reply with price.", time: "9:10 AM" },
    { from: "provider", text: "20000", time: "9:22 AM" },
    { from: "bot", text: "Quote ₦20,000. Platform fee ₦3,000. Total ₦23,000 presented.", time: "9:22 AM" },
    { from: "bot", text: "Payment confirmed ₦23,000. Booking BH-2040 confirmed.", time: "9:45 AM" },
    { from: "bot", text: "Service completed by provider. Awaiting hirer confirmation.", time: "2:10 PM" },
    { from: "bot", text: "Hirer confirmed. Escrow released to provider: ₦20,000.", time: "2:18 PM" },
  ]},
  { id: "C-085", hirer: "Ngozi A.", hirerPhone: "+234 805 678 9012", provider: "Glow by Chisom", providerPhone: "+234 806 789 0123", service: "Bridal Makeup", booking: "BH-2035", status: "dispute", msgs: [
    { from: "bot", text: "New enquiry from Ngozi A. Bridal makeup + gele. Event date: Apr 24.", time: "Apr 19, 11:00 AM" },
    { from: "provider", text: "45000", time: "Apr 19, 11:14 AM" },
    { from: "bot", text: "Quote ₦45,000. Fee ₦6,750. Total ₦51,750.", time: "Apr 19, 11:14 AM" },
    { from: "bot", text: "Payment confirmed ₦51,750. Booking BH-2035.", time: "Apr 19, 11:30 AM" },
    { from: "hirer", text: "She didn't show up and won't pick my calls!", time: "Apr 24, 8:45 AM" },
    { from: "bot", text: "Dispute raised. Funds frozen in escrow pending admin review.", time: "Apr 24, 8:46 AM" },
  ]},
];

const ALL_USERS = [
  { id: "U-001", name: "Amara Okonkwo", type: "hirer", phone: "+234 801 234 5678", joined: "Mar 12, 2025", bookings: 3, status: "active" },
  { id: "U-002", name: "Tunde Mensah", type: "hirer", phone: "+234 803 456 7890", joined: "Feb 3, 2025", bookings: 7, status: "active" },
  { id: "U-003", name: "Ngozi Adeyemi", type: "hirer", phone: "+234 805 678 9012", joined: "Jan 18, 2025", bookings: 2, status: "flagged" },
  { id: "P-001", name: "Supreme Cuts", type: "provider", phone: "+234 802 345 6789", joined: "Dec 5, 2024", bookings: 124, status: "verified" },
  { id: "P-002", name: "Zara Beauty Studio", type: "provider", phone: "+234 804 567 8901", joined: "Jan 2, 2025", bookings: 98, status: "verified" },
  { id: "P-003", name: "Glow by Chisom", type: "provider", phone: "+234 806 789 0123", joined: "Feb 14, 2025", bookings: 41, status: "suspended" },
  { id: "P-004", name: "The Nail Bar", type: "provider", phone: "+234 807 890 1234", joined: "Mar 30, 2025", bookings: 12, status: "verified" },
];

/* ─── PRIMITIVES ─────────────────────────────────────────────────────────── */
const css = (obj) => Object.entries(obj).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';');

const Chip = ({ label, color }) => (
  <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: color + "22", color: color, fontFamily: "system-ui", fontWeight: 600, letterSpacing: 0.2 }}>{label}</span>
);

const StatusDot = ({ status }) => {
  const map = { active: T.green, upcoming: T.accent, completed: T.text2, verified: T.green, flagged: T.amber, suspended: T.red, dispute: T.red, open: T.red, resolving: T.amber };
  const label = { active: "Active", upcoming: "Upcoming", completed: "Done", verified: "Verified", flagged: "Flagged", suspended: "Suspended", dispute: "Dispute", open: "Open", resolving: "Resolving" };
  const c = map[status] || T.text2;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: c, background: c + "18", padding: "3px 9px", borderRadius: 20, fontFamily: "system-ui", fontWeight: 600 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c, display: "inline-block" }} />
      {label[status] || status}
    </span>
  );
};

const Avatar = ({ initials, color = T.accent, size = 40 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color + "28", border: `1.5px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", color: color, fontSize: size * 0.34, fontWeight: 700, fontFamily: "system-ui", flexShrink: 0 }}>{initials}</div>
);

const Btn = ({ children, onClick, variant = "primary", full = false, sm = false, style: sx = {} }) => {
  const base = { border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "system-ui", fontWeight: 600, transition: "opacity .15s", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, letterSpacing: 0.2, width: full ? "100%" : "auto" };
  const size = sm ? { fontSize: 12, padding: "8px 14px" } : { fontSize: 14, padding: "12px 20px" };
  const vars = {
    primary: { background: T.accent, color: T.white },
    ghost: { background: T.bg3, color: T.text0, border: `1px solid ${T.border}` },
    danger: { background: T.redLo, color: T.red, border: `1px solid ${T.red}44` },
    success: { background: T.greenLo, color: T.green, border: `1px solid ${T.green}44` },
    subtle: { background: "transparent", color: T.text1, border: `1px solid ${T.border}` },
  };
  return <button onClick={onClick} style={{ ...base, ...size, ...vars[variant], ...sx }}>{children}</button>;
};

const Card = ({ children, style: sx = {}, onClick }) => (
  <div onClick={onClick} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 16, padding: "16px 18px", ...sx, cursor: onClick ? "pointer" : "default" }}>{children}</div>
);

const Divider = () => <div style={{ height: 1, background: T.border, margin: "12px 0" }} />;

const Input = ({ placeholder, value, onChange, type = "text" }) => (
  <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", background: T.bg3, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", fontSize: 14, color: T.text0, fontFamily: "system-ui", outline: "none", boxSizing: "border-box" }} />
);

const Label = ({ children }) => <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{children}</div>;

const Section = ({ title, children, right }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: T.text0 }}>{title}</div>
      {right}
    </div>
    {children}
  </div>
);

/* ─── LAYOUT ─────────────────────────────────────────────────────────────── */
const Screen = ({ children, noPad = false }) => (
  <div style={{ flex: 1, overflowY: "auto", padding: noPad ? 0 : "16px 16px 88px", display: "flex", flexDirection: "column" }}>{children}</div>
);

const TopBar = ({ title, subtitle, onBack, right }) => (
  <div style={{ background: T.bg1, padding: "52px 16px 14px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {onBack && <button onClick={onBack} style={{ background: T.bg3, border: `1px solid ${T.border}`, borderRadius: 9, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.text0} strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.text0 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", marginTop: 2 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  </div>
);

const BottomNav = ({ tabs, active, setActive, color = T.accent }) => (
  <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: T.bg1, borderTop: `1px solid ${T.border}`, display: "flex", padding: "10px 0 22px", zIndex: 100 }}>
    {tabs.map(([id, icon, label]) => {
      const isActive = active === id;
      return (
        <div key={id} onClick={() => setActive(id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}>
          <div style={{ width: 40, height: 32, borderRadius: 10, background: isActive ? color + "20" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isActive ? color : T.text2} strokeWidth={isActive ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round">{NAV_ICONS[icon]}</svg>
          </div>
          <span style={{ fontSize: 10, color: isActive ? color : T.text2, fontFamily: "system-ui", fontWeight: isActive ? 700 : 400 }}>{label}</span>
        </div>
      );
    })}
  </div>
);

const NAV_ICONS = {
  home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></>,
  search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  wallet: <><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
  grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
  chat: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
  check: <polyline points="20 6 9 17 4 12"/>,
  pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>,
  camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
  upload: <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
};

const Ico = ({ name, size = 18, color = T.text0, weight = "1.8" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={weight} strokeLinecap="round" strokeLinejoin="round">{NAV_ICONS[name]}</svg>
);

/* ════════════════════════════════════════════════════════════════════════════
   SPLASH
══════════════════════════════════════════════════════════════════════════════*/
const SplashScreen = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, []);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: T.bg0, minHeight: "100vh", gap: 20 }}>
      <div style={{ position: "relative" }}>
        <div style={{ width: 80, height: 80, borderRadius: 24, background: `linear-gradient(135deg, ${T.accent}, #A78BFA)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: T.text0, letterSpacing: -0.5, fontFamily: "system-ui" }}>BeautyHub</div>
        <div style={{ fontSize: 14, color: T.text1, fontFamily: "system-ui", marginTop: 6, letterSpacing: 0.3 }}>Lagos's Beauty & Grooming Marketplace</div>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: i === 1 ? 20 : 6, height: 6, borderRadius: 3, background: i === 0 ? T.accent : T.bg4, transition: "all .4s" }} />)}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   ROLE SELECT
══════════════════════════════════════════════════════════════════════════════*/
const RoleScreen = ({ onSelect }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg0, padding: "0 16px 40px", minHeight: "100vh" }}>
    <div style={{ paddingTop: 80, marginBottom: 36 }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: T.text0, fontFamily: "system-ui", lineHeight: 1.2, marginBottom: 8 }}>Welcome back.</div>
      <div style={{ fontSize: 15, color: T.text1, fontFamily: "system-ui" }}>Choose how you're using BeautyHub today.</div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[
        { role: "hirer", icon: "search", title: "Client", sub: "Book beauty & grooming services near you", accent: T.accent },
        { role: "provider", icon: "star", title: "Provider", sub: "Salon, barbershop, or independent professional", accent: "#22C55E" },
        { role: "admin", icon: "shield", title: "Admin", sub: "Platform control & oversight", accent: "#F59E0B" },
      ].map(({ role, icon, title, sub, accent }) => (
        <div key={role} onClick={() => onSelect(role)} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "border-color .2s" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Ico name={icon} size={22} color={accent} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{title}</div>
            <div style={{ fontSize: 13, color: T.text1, fontFamily: "system-ui", marginTop: 3, lineHeight: 1.4 }}>{sub}</div>
          </div>
          <Ico name="x" size={14} color={T.text2} />
        </div>
      ))}
    </div>
    <div style={{ marginTop: 32, padding: "16px", background: T.bg2, borderRadius: 14, border: `1px solid ${T.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
      <Ico name="shield" size={16} color={T.accent} />
      <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", lineHeight: 1.6 }}>CAC-verified providers · Escrow-protected payments · WhatsApp Smart Enquiry</div>
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════════════════
   HIRER APP
══════════════════════════════════════════════════════════════════════════════*/
const HirerApp = () => {
  const [tab, setTab] = useState("home");
  const [enquiry, setEnquiry] = useState(null);
  const [filterCat, setFilterCat] = useState("all");

  if (enquiry) return <EnquiryFlow provider={enquiry} onClose={() => setEnquiry(null)} />;

  const filtered = filterCat === "all" ? PROVIDERS : PROVIDERS.filter(p => p.cats.includes(filterCat));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg0, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: T.bg1, padding: "52px 16px 16px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 13, color: T.text1, fontFamily: "system-ui" }}>Good afternoon 👋</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.text0, fontFamily: "system-ui" }}>Amara</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: T.bg3, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico name="bell" size={17} color={T.text1} />
            </div>
            <Avatar initials="AM" color={T.accent} size={38} />
          </div>
        </div>
        <div style={{ background: T.bg3, border: `1px solid ${T.border}`, borderRadius: 12, padding: "11px 14px", display: "flex", gap: 10, alignItems: "center" }}>
          <Ico name="search" size={16} color={T.text2} />
          <span style={{ fontSize: 14, color: T.text2, fontFamily: "system-ui" }}>Search salons, barbers, nail artists...</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10 }}>
          <Ico name="pin" size={13} color={T.accent} />
          <span style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui" }}>Lekki Phase 1, Lagos</span>
        </div>
      </div>

      <Screen>
        {tab === "home" && (
          <>
            {/* Hero */}
            <div style={{ background: `linear-gradient(135deg, ${T.accent}22, ${T.bg3})`, border: `1px solid ${T.accentMid}`, borderRadius: 16, padding: "18px 20px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: T.accent + "10" }} />
              <div style={{ fontSize: 13, color: T.accent, fontFamily: "system-ui", fontWeight: 600, marginBottom: 6 }}>BOOK TODAY</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.text0, fontFamily: "system-ui", lineHeight: 1.3, marginBottom: 14 }}>Your next look,<br/>delivered to your door</div>
              <Btn sm>Browse Services</Btn>
            </div>

            {/* Categories */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text0, fontFamily: "system-ui", marginBottom: 12 }}>Categories</div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                <div onClick={() => setFilterCat("all")} style={{ padding: "7px 14px", borderRadius: 20, border: `1px solid ${filterCat === "all" ? T.accent : T.border}`, background: filterCat === "all" ? T.accent : T.bg2, color: filterCat === "all" ? T.white : T.text1, fontSize: 12, fontFamily: "system-ui", fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0 }}>All</div>
                {ALL_CATEGORIES.map(c => (
                  <div key={c.id} onClick={() => setFilterCat(c.id)} style={{ padding: "7px 14px", borderRadius: 20, border: `1px solid ${filterCat === c.id ? c.color : T.border}`, background: filterCat === c.id ? c.color + "22" : T.bg2, color: filterCat === c.id ? c.color : T.text1, fontSize: 12, fontFamily: "system-ui", fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0 }}>{c.icon} {c.label}</div>
                ))}
              </div>
            </div>

            {/* Providers */}
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text0, fontFamily: "system-ui", marginBottom: 12 }}>Nearby {filtered.length === PROVIDERS.length ? "Providers" : ALL_CATEGORIES.find(c => c.id === filterCat)?.label}</div>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: T.text2, fontFamily: "system-ui", fontSize: 14 }}>No providers found for this category.</div>
              ) : filtered.map(p => (
                <Card key={p.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <Avatar initials={p.initials} color={p.color} size={46} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", marginTop: 2 }}>{p.type} · {p.location}</div>
                        </div>
                        {p.verified && <div style={{ background: T.greenLo, borderRadius: 8, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}><Ico name="check" size={11} color={T.green} /><span style={{ fontSize: 10, color: T.green, fontFamily: "system-ui", fontWeight: 700 }}>CAC</span></div>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                        <div style={{ display: "flex", gap: 1 }}>
                          {[1,2,3,4,5].map(i => <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= Math.round(p.rating) ? T.amber : T.bg4} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                        </div>
                        <span style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui" }}>{p.rating} ({p.reviews})</span>
                        <span style={{ fontSize: 12, color: T.text2, fontFamily: "system-ui" }}>·</span>
                        <span style={{ fontSize: 12, color: T.text2, fontFamily: "system-ui" }}>{p.distance}</span>
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                        {p.cats.slice(0, 3).map(cid => {
                          const cat = ALL_CATEGORIES.find(c => c.id === cid);
                          return cat ? <Chip key={cid} label={cat.label} color={cat.color} /> : null;
                        })}
                      </div>
                    </div>
                  </div>
                  <Divider />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.accent, fontFamily: "system-ui" }}>{p.price}</span>
                    <Btn sm onClick={() => setEnquiry(p)}>Send Enquiry</Btn>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {tab === "bookings" && (
          <Section title="My Bookings">
            {HIRER_BOOKINGS.map(b => (
              <Card key={b.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{b.service}</div>
                    <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", marginTop: 3 }}>{b.provider}</div>
                  </div>
                  <StatusDot status={b.status} />
                </div>
                <Divider />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui" }}>{b.date}</div>
                    <div style={{ fontSize: 11, color: T.text2, fontFamily: "system-ui", marginTop: 2 }}>{b.type} · {b.id}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{b.amount}</div>
                </div>
                {b.status === "upcoming" && (
                  <div style={{ marginTop: 12 }}>
                    <Btn full variant="ghost" sm>View Details & Contact</Btn>
                  </div>
                )}
              </Card>
            ))}
          </Section>
        )}

        {tab === "profile" && (
          <>
            <div style={{ textAlign: "center", padding: "20px 0 28px" }}>
              <Avatar initials="AM" color={T.accent} size={72} />
              <div style={{ fontSize: 22, fontWeight: 800, color: T.text0, fontFamily: "system-ui", marginTop: 12 }}>Amara Okonkwo</div>
              <div style={{ fontSize: 14, color: T.text1, fontFamily: "system-ui", marginTop: 4 }}>+234 801 234 5678</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 18 }}>
                {[["3", "Bookings"], ["2", "Faves"], ["4.8★", "Rating"]].map(([v, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: T.text0, fontFamily: "system-ui" }}>{v}</div>
                    <div style={{ fontSize: 11, color: T.text1, fontFamily: "system-ui" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            {["Saved Providers", "Payment Methods", "My Addresses", "Help & Support"].map(item => (
              <Card key={item} style={{ marginBottom: 10, cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, color: T.text0, fontFamily: "system-ui" }}>{item}</span>
                  <Ico name="x" size={14} color={T.text2} />
                </div>
              </Card>
            ))}
            <Card style={{ marginTop: 8, cursor: "pointer" }}>
              <span style={{ fontSize: 14, color: T.red, fontFamily: "system-ui" }}>Sign Out</span>
            </Card>
          </>
        )}
      </Screen>

      <BottomNav tabs={[["home","home","Home"],["bookings","calendar","Bookings"],["profile","user","Profile"]]} active={tab} setActive={setTab} color={T.accent} />
    </div>
  );
};

/* ─── ENQUIRY FLOW ──────────────────────────────────────────────────────── */
const EnquiryFlow = ({ provider, onClose }) => {
  const [step, setStep] = useState(0);
  const [serviceType, setServiceType] = useState("home");
  const [notes, setNotes] = useState("");

  const steps = ["Details", "Sent", "Quote", "Confirmed"];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg0, minHeight: "100vh" }}>
      <TopBar title="Smart Enquiry" subtitle={provider.name} onBack={onClose} />

      {/* Progress */}
      <div style={{ padding: "12px 16px", background: T.bg1, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: i < step ? T.accent : i === step ? T.accent : T.bg4, border: `1.5px solid ${i <= step ? T.accent : T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i < step ? <Ico name="check" size={12} color={T.white} weight="2.5" /> : <span style={{ fontSize: 10, fontFamily: "system-ui", color: i === step ? T.white : T.text2, fontWeight: 700 }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: 9, color: i === step ? T.accent : T.text2, fontFamily: "system-ui", marginTop: 3, fontWeight: i === step ? 700 : 400 }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div style={{ height: 1.5, width: 16, background: i < step ? T.accent : T.border, marginBottom: 14, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>

      <Screen>
        {step === 0 && (
          <>
            <Card style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <Avatar initials={provider.initials} color={provider.color} size={44} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{provider.name}</div>
                  <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", marginTop: 2 }}>{provider.type} · {provider.location}</div>
                </div>
              </div>
            </Card>

            <Card style={{ marginBottom: 14 }}>
              <Label>Service Type</Label>
              <div style={{ display: "flex", gap: 10 }}>
                {[["home", "Home Service", "We come to you"], ["walkin", "Walk-In", "Visit in-person"]].map(([v, l, s]) => (
                  <div key={v} onClick={() => setServiceType(v)} style={{ flex: 1, padding: "13px", borderRadius: 12, border: `1.5px solid ${serviceType === v ? T.accent : T.border}`, background: serviceType === v ? T.accentLo : T.bg3, cursor: "pointer", textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: serviceType === v ? T.accent : T.text0, fontFamily: "system-ui" }}>{l}</div>
                    <div style={{ fontSize: 11, color: T.text2, fontFamily: "system-ui", marginTop: 3 }}>{s}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card style={{ marginBottom: 14 }}>
              <Label>Inspiration Photo</Label>
              <div style={{ background: T.bg3, borderRadius: 12, padding: "28px", textAlign: "center", border: `1.5px dashed ${T.border}`, cursor: "pointer" }}>
                <Ico name="camera" size={26} color={T.text2} />
                <div style={{ fontSize: 13, color: T.text1, fontFamily: "system-ui", marginTop: 10 }}>Tap to upload photo</div>
                <div style={{ fontSize: 11, color: T.text2, fontFamily: "system-ui", marginTop: 4 }}>Helps provider quote accurately</div>
              </div>
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <Label>Notes for Provider</Label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Describe what you want in detail..." style={{ width: "100%", border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px", fontSize: 14, fontFamily: "system-ui", color: T.text0, background: T.bg3, resize: "none", outline: "none", boxSizing: "border-box" }} rows={3} />
            </Card>

            <div style={{ background: T.accentLo, border: `1px solid ${T.accentMid}`, borderRadius: 12, padding: "12px 14px", marginBottom: 18, display: "flex", gap: 10 }}>
              <Ico name="shield" size={15} color={T.accent} />
              <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", lineHeight: 1.6 }}>Your contact info stays hidden until after payment. All quotes are logged.</div>
            </div>

            <Btn full onClick={() => setStep(1)}>Send Enquiry via WhatsApp Bot</Btn>
          </>
        )}

        {step === 1 && (
          <div style={{ textAlign: "center", paddingTop: 32 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#25D36618", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.text0, fontFamily: "system-ui", marginBottom: 10 }}>Enquiry Sent!</div>
            <div style={{ fontSize: 14, color: T.text1, fontFamily: "system-ui", lineHeight: 1.7, marginBottom: 24, padding: "0 10px" }}>Our bot has messaged <strong style={{ color: T.text0 }}>{provider.name}</strong> on WhatsApp. They have <strong style={{ color: T.amber }}>60 minutes</strong> to respond or the request routes to nearby providers.</div>

            <Card style={{ marginBottom: 20, textAlign: "left" }}>
              <div style={{ fontSize: 12, color: T.text2, fontFamily: "system-ui", fontWeight: 600, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>Bot Conversation Preview</div>
              {[
                { from: "Bot → Provider", msg: `New client enquiry! ${serviceType === "home" ? "Home service" : "Walk-in"}. Inspiration photo attached. Reply with your price to proceed.`, color: T.accent },
              ].map((m, i) => (
                <div key={i} style={{ background: T.bg3, borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, color: T.text2, fontFamily: "system-ui", fontWeight: 600, marginBottom: 4 }}>{m.from}</div>
                  <div style={{ fontSize: 13, color: T.text0, fontFamily: "system-ui", lineHeight: 1.5 }}>{m.msg}</div>
                </div>
              ))}
              <div style={{ fontSize: 12, color: T.text2, fontFamily: "system-ui", fontStyle: "italic" }}>Awaiting provider response...</div>
            </Card>

            <Btn full onClick={() => setStep(2)}>Simulate: Quote Received ›</Btn>
          </div>
        )}

        {step === 2 && (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.text0, fontFamily: "system-ui", marginBottom: 6 }}>Quote Received!</div>
              <div style={{ fontSize: 13, color: T.text1, fontFamily: "system-ui" }}>{provider.name} has responded</div>
            </div>

            <Card style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <Avatar initials={provider.initials} color={provider.color} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ background: T.bg3, borderRadius: 12, borderTopLeftRadius: 4, padding: "11px 13px" }}>
                    <div style={{ fontSize: 13, color: T.text0, fontFamily: "system-ui", lineHeight: 1.5 }}>I can do that for <strong>₦18,000</strong>. Available today from 2pm or tomorrow 10am. All materials included.</div>
                  </div>
                  <div style={{ fontSize: 10, color: T.text2, fontFamily: "system-ui", marginTop: 4, marginLeft: 4 }}>via WhatsApp Bot · just now</div>
                </div>
              </div>
            </Card>

            <Card style={{ marginBottom: 14 }}>
              <Label>Order Breakdown</Label>
              {[["Service Fee", "₦18,000"], ["Platform Fee (15%)", "₦2,700"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 14, color: T.text1, fontFamily: "system-ui" }}>{k}</span>
                  <span style={{ fontSize: 14, color: T.text0, fontFamily: "system-ui" }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: T.accent, fontFamily: "system-ui" }}>₦20,700</span>
              </div>
            </Card>

            <div style={{ background: T.greenLo, border: `1px solid ${T.green}30`, borderRadius: 12, padding: "12px 14px", marginBottom: 18, display: "flex", gap: 10 }}>
              <Ico name="shield" size={15} color={T.green} />
              <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", lineHeight: 1.6 }}>Payment held in <strong style={{ color: T.green }}>escrow</strong>. Released to provider only after you confirm completion.</div>
            </div>

            <Btn full onClick={() => setStep(3)} style={{ marginBottom: 10 }}>Pay ₦20,700 via Paystack</Btn>
            <Btn full variant="subtle">Decline Quote</Btn>
          </>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center", paddingTop: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: T.greenLo, border: `1px solid ${T.green}44`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Ico name="check" size={36} color={T.green} weight="2.5" />
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: T.text0, fontFamily: "system-ui", marginBottom: 8 }}>Booking Confirmed!</div>
            <div style={{ fontSize: 14, color: T.text1, fontFamily: "system-ui", lineHeight: 1.7, marginBottom: 24 }}>₦20,700 is secured in escrow. Provider contact details unlocked.</div>

            <Card style={{ marginBottom: 20, textAlign: "left" }}>
              {[["Booking ID","BH-2042"],["Provider",provider.name],["Date & Time","Today, 2:00 PM"],["Service Type","Home Service"],["Provider Contact","+234 802 ••• ••••"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 13, color: T.text1, fontFamily: "system-ui" }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text0, fontFamily: "system-ui" }}>{v}</span>
                </div>
              ))}
            </Card>
            <Btn full onClick={onClose}>Back to Home</Btn>
          </div>
        )}
      </Screen>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   PROVIDER APP
══════════════════════════════════════════════════════════════════════════════*/
const ProviderApp = () => {
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState("dashboard");

  if (!onboarded) return <ProviderOnboarding onDone={() => setOnboarded(true)} />;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg0, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: T.bg1, padding: "52px 16px 16px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, color: T.text1, fontFamily: "system-ui" }}>Provider Dashboard</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text0, fontFamily: "system-ui" }}>Supreme Cuts</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ background: T.greenLo, borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
              <span style={{ fontSize: 11, color: T.green, fontFamily: "system-ui", fontWeight: 700 }}>Verified</span>
            </div>
            <Avatar initials="SC" color="#06B6D4" size={36} />
          </div>
        </div>
      </div>

      <Screen>
        {tab === "dashboard" && <ProviderDashboard setTab={setTab} />}
        {tab === "bookings" && <ProviderBookings />}
        {tab === "earnings" && <ProviderEarnings />}
      </Screen>

      <BottomNav tabs={[["dashboard","grid","Dashboard"],["bookings","calendar","Bookings"],["earnings","wallet","Earnings"]]} active={tab} setActive={setTab} color="#22C55E" />
    </div>
  );
};

const ProviderDashboard = ({ setTab }) => {
  const [enquiryState, setEnquiryState] = useState("pending"); // pending → quoted → booked

  return (
    <>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[["₦142K", "This Month", T.green], ["12", "Bookings", "#06B6D4"], ["4.9 ★", "Rating", T.amber], ["0", "Disputes", T.text2]].map(([v, l, c]) => (
          <div key={l} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: c, fontFamily: "system-ui" }}>{v}</div>
            <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Incoming Enquiry */}
      <Section title="Incoming Enquiries">
        {enquiryState === "pending" && (
          <Card style={{ border: `1px solid ${T.accent}44` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>Low Fade + Line Up</div>
              <StatusDot status="upcoming" />
            </div>
            <div style={{ fontSize: 13, color: T.text1, fontFamily: "system-ui", lineHeight: 1.5, marginBottom: 6 }}>Home Service · Lekki Phase 1. Inspiration photo attached.</div>
            <div style={{ background: T.bg3, borderRadius: 10, padding: "10px 12px", marginBottom: 12, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, color: T.text2, fontFamily: "system-ui", fontWeight: 600, marginBottom: 3 }}>WhatsApp Bot Message</div>
              <div style={{ fontSize: 12, color: T.text0, fontFamily: "system-ui", lineHeight: 1.5 }}>New enquiry from Amara O. — Low Fade, home service. Photo attached. Reply with your price.</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn full onClick={() => setEnquiryState("quoted")}>Reply with Quote (WhatsApp)</Btn>
            </div>
          </Card>
        )}
        {enquiryState === "quoted" && (
          <Card style={{ border: `1px solid ${T.amber}44` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>Low Fade + Line Up</div>
              <StatusDot status="resolving" />
            </div>
            <div style={{ background: T.bg3, borderRadius: 10, padding: "10px 12px", marginBottom: 10, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, color: T.green, fontFamily: "system-ui", fontWeight: 600, marginBottom: 3 }}>Your reply (sent via WhatsApp)</div>
              <div style={{ fontSize: 13, color: T.text0, fontFamily: "system-ui" }}>₦6,500 — home service, includes all tools</div>
            </div>
            <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui" }}>Waiting for client to pay ₦7,475 (incl. platform fee). Auto-expires in 23 mins.</div>
            <Btn sm variant="subtle" style={{ marginTop: 12 }} onClick={() => setEnquiryState("booked")}>Simulate: Client Paid →</Btn>
          </Card>
        )}
        {enquiryState === "booked" && (
          <Card style={{ border: `1px solid ${T.green}44` }}>
            <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 10 }}>
              <Ico name="check" size={15} color={T.green} weight="2.5" />
              <span style={{ fontSize: 14, fontWeight: 700, color: T.green, fontFamily: "system-ui" }}>Booking Confirmed · BH-2041</span>
            </div>
            <div style={{ fontSize: 13, color: T.text0, fontFamily: "system-ui", marginBottom: 4 }}>Amara Okonkwo · +234 801 234 5678</div>
            <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", marginBottom: 12 }}>Today, 3:00 PM · 14 Bode Thomas St, Surulere</div>
            <Btn full variant="success">Mark as Completed</Btn>
          </Card>
        )}
      </Section>

      <Section title="Recent Bookings" right={<span onClick={() => setTab("bookings")} style={{ fontSize: 12, color: T.accent, fontFamily: "system-ui", cursor: "pointer", fontWeight: 600 }}>See all</span>}>
        {PROVIDER_BOOKINGS.slice(0, 2).map(b => (
          <Card key={b.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{b.service}</div>
                <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", marginTop: 3 }}>{b.client} · {b.date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{b.amount}</div>
                <StatusDot status={b.status} />
              </div>
            </div>
          </Card>
        ))}
      </Section>
    </>
  );
};

const ProviderBookings = () => {
  const [selected, setSelected] = useState(null);

  if (selected) return (
    <div>
      <Btn variant="subtle" sm onClick={() => setSelected(null)} style={{ marginBottom: 16 }}>← Back to Bookings</Btn>
      <Card>
        <div style={{ fontSize: 18, fontWeight: 800, color: T.text0, fontFamily: "system-ui", marginBottom: 4 }}>{selected.service}</div>
        <StatusDot status={selected.status} />
        <Divider />
        {[["Booking ID", selected.id], ["Client", selected.client], ["Date", selected.date], ["Type", selected.type], ["Address", selected.address], ["Amount", selected.amount]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 13, color: T.text1, fontFamily: "system-ui" }}>{k}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text0, fontFamily: "system-ui" }}>{v}</span>
          </div>
        ))}
        {selected.status === "upcoming" && (
          <div style={{ marginTop: 16 }}>
            <Btn full variant="success">Mark as Completed</Btn>
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <Section title="All Bookings">
      {PROVIDER_BOOKINGS.map(b => (
        <Card key={b.id} onClick={() => setSelected(b)} style={{ marginBottom: 10, cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{b.service}</div>
              <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", marginTop: 3 }}>{b.client} · {b.date}</div>
              <div style={{ fontSize: 11, color: T.text2, fontFamily: "system-ui", marginTop: 2 }}>{b.type} · {b.id}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.text0, fontFamily: "system-ui", marginBottom: 6 }}>{b.amount}</div>
              <StatusDot status={b.status} />
            </div>
          </div>
        </Card>
      ))}
    </Section>
  );
};

const ProviderEarnings = () => {
  const total = 142000;
  const pending = 6500;
  const withdrawn = 118000;

  return (
    <>
      <Card style={{ background: `linear-gradient(135deg, #22C55E18, ${T.bg2})`, border: `1px solid #22C55E30`, marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: T.text1, fontFamily: "system-ui", marginBottom: 4 }}>Total Earned (April)</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: T.green, fontFamily: "system-ui" }}>₦{total.toLocaleString()}</div>
        <Divider />
        <div style={{ display: "flex", gap: 20 }}>
          <div><div style={{ fontSize: 16, fontWeight: 700, color: T.amber, fontFamily: "system-ui" }}>₦{pending.toLocaleString()}</div><div style={{ fontSize: 11, color: T.text1, fontFamily: "system-ui" }}>In Escrow</div></div>
          <div><div style={{ fontSize: 16, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>₦{withdrawn.toLocaleString()}</div><div style={{ fontSize: 11, color: T.text1, fontFamily: "system-ui" }}>Withdrawn</div></div>
        </div>
      </Card>

      <Btn full variant="success" style={{ marginBottom: 20 }}>Withdraw Available Balance</Btn>

      <Section title="Earning History">
        {PROVIDER_BOOKINGS.filter(b => b.status === "completed").map(b => (
          <Card key={b.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text0, fontFamily: "system-ui" }}>{b.service}</div>
                <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", marginTop: 2 }}>{b.client} · {b.date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.green, fontFamily: "system-ui" }}>+{b.amount}</div>
                <div style={{ fontSize: 10, color: T.text2, fontFamily: "system-ui" }}>Paid out</div>
              </div>
            </div>
          </Card>
        ))}
      </Section>
    </>
  );
};

/* ─── PROVIDER ONBOARDING ───────────────────────────────────────────────── */
const ProviderOnboarding = ({ onDone }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", type: "salon", cac: "", whatsapp: "", cats: [] });

  const next = () => step < 4 ? setStep(s => s + 1) : onDone();
  const toggleCat = (id) => setForm(f => ({ ...f, cats: f.cats.includes(id) ? f.cats.filter(c => c !== id) : [...f.cats, id] }));

  const STEPS = ["Business Info", "Services", "Portfolio", "WhatsApp", "Go Live"];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg0, minHeight: "100vh" }}>
      <TopBar title={STEPS[step]} subtitle={`Step ${step + 1} of 5`} />

      {/* Progress bar */}
      <div style={{ padding: "10px 16px", background: T.bg1, borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {STEPS.map((_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= step ? T.accent : T.bg4, transition: "background .3s" }} />)}
        </div>
      </div>

      <Screen>
        {step === 0 && (
          <>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.text0, fontFamily: "system-ui", marginBottom: 6 }}>Tell us about your business</div>
            <div style={{ fontSize: 14, color: T.text1, fontFamily: "system-ui", marginBottom: 22, lineHeight: 1.5 }}>This information will be verified and shown to clients.</div>

            <div style={{ marginBottom: 16 }}>
              <Label>Business Type</Label>
              <div style={{ display: "flex", gap: 10 }}>
                {[["salon", "Salon / Shop"], ["independent", "Independent"]].map(([v, l]) => (
                  <div key={v} onClick={() => setForm(f => ({ ...f, type: v }))} style={{ flex: 1, padding: "14px", borderRadius: 12, border: `1.5px solid ${form.type === v ? T.accent : T.border}`, background: form.type === v ? T.accentLo : T.bg3, cursor: "pointer", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: form.type === v ? T.accent : T.text0, fontFamily: "system-ui" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Label>Business Name</Label>
              <Input placeholder="e.g. Supreme Cuts, Zara Studio" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <Label>CAC Registration Number</Label>
              <Input placeholder="RC-0000000" value={form.cac} onChange={v => setForm(f => ({ ...f, cac: v }))} />
              <div style={{ fontSize: 11, color: T.text2, fontFamily: "system-ui", marginTop: 6 }}>Verifies your legal accountability on the platform</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Label>Location</Label>
              <Input placeholder="e.g. Lekki Phase 1, Lagos" value={""} onChange={() => {}} />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.text0, fontFamily: "system-ui", marginBottom: 6 }}>What services do you offer?</div>
            <div style={{ fontSize: 14, color: T.text1, fontFamily: "system-ui", marginBottom: 22, lineHeight: 1.5 }}>Select all that apply. Your portfolio will be organized by these categories.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {ALL_CATEGORIES.map(c => {
                const sel = form.cats.includes(c.id);
                return (
                  <div key={c.id} onClick={() => toggleCat(c.id)} style={{ padding: "14px 12px", borderRadius: 14, border: `1.5px solid ${sel ? c.color : T.border}`, background: sel ? c.color + "18" : T.bg2, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: sel ? c.color : T.text0, fontFamily: "system-ui", lineHeight: 1.3 }}>{c.label}</div>
                    </div>
                    {sel && <div style={{ marginLeft: "auto", flexShrink: 0 }}><Ico name="check" size={14} color={c.color} weight="2.5" /></div>}
                  </div>
                );
              })}
            </div>
            {form.cats.length > 0 && (
              <div style={{ marginTop: 16, background: T.accentLo, border: `1px solid ${T.accentMid}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: T.accent, fontFamily: "system-ui" }}>
                {form.cats.length} service{form.cats.length > 1 ? "s" : ""} selected. You'll upload portfolio photos per category next.
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.text0, fontFamily: "system-ui", marginBottom: 6 }}>Portfolio Upload</div>
            <div style={{ fontSize: 14, color: T.text1, fontFamily: "system-ui", marginBottom: 22, lineHeight: 1.5 }}>Upload at least 3 photos per service to build client trust.</div>
            {form.cats.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0", color: T.text2, fontFamily: "system-ui" }}>No categories selected. Go back and select your services.</div>
            ) : form.cats.map(cid => {
              const cat = ALL_CATEGORIES.find(c => c.id === cid);
              return (
                <Card key={cid} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 18 }}>{cat.icon}</span>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{cat.label}</div>
                    <div style={{ marginLeft: "auto", fontSize: 11, color: T.text2, fontFamily: "system-ui" }}>0 / 3 min</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ aspectRatio: "1", borderRadius: 10, background: T.bg3, border: `1.5px dashed ${T.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Ico name="upload" size={18} color={T.text2} />
                        <span style={{ fontSize: 9, color: T.text2, fontFamily: "system-ui", marginTop: 5 }}>Add photo</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.text0, fontFamily: "system-ui", marginBottom: 6 }}>Connect WhatsApp</div>
            <div style={{ fontSize: 14, color: T.text1, fontFamily: "system-ui", marginBottom: 22, lineHeight: 1.5 }}>The Smart Bot sends client enquiries directly to your WhatsApp number.</div>

            <div style={{ background: "#25D36618", border: "1px solid #25D36633", borderRadius: 14, padding: "18px", textAlign: "center", marginBottom: 20 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#25D366" style={{ marginBottom: 10 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              <div style={{ fontSize: 14, color: T.text0, fontFamily: "system-ui", fontWeight: 700, marginBottom: 6 }}>WhatsApp Smart Bot</div>
              <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", lineHeight: 1.6 }}>Client sends enquiry → Bot forwards to you → You reply with price → Bot handles booking & payment</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Label>WhatsApp Business Number</Label>
              <Input placeholder="+234 800 000 0000" value={form.whatsapp} onChange={v => setForm(f => ({ ...f, whatsapp: v }))} />
            </div>

            <div style={{ background: T.bg3, borderRadius: 12, padding: "14px", border: `1px solid ${T.border}` }}>
              {[["Receive enquiry", "With photo + details"], ["Reply with price", "e.g. just type: 6500"], ["Booking auto-created", "Client pays on platform"], ["Escrow released on completion", "Funds transferred to you"]].map(([a, b], i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 12 : 0, alignItems: "flex-start" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: T.white, fontFamily: "system-ui", fontWeight: 800 }}>{i + 1}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{a}</div>
                    <div style={{ fontSize: 12, color: T.text2, fontFamily: "system-ui" }}>{b}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <div style={{ textAlign: "center", paddingTop: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: `linear-gradient(135deg, ${T.accent}, #A78BFA)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Ico name="check" size={36} color={T.white} weight="2.5" />
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: T.text0, fontFamily: "system-ui", marginBottom: 8 }}>You're Live!</div>
            <div style={{ fontSize: 14, color: T.text1, fontFamily: "system-ui", lineHeight: 1.7, marginBottom: 24 }}><strong style={{ color: T.text0 }}>{form.name || "Your business"}</strong> is now visible to clients on BeautyHub.</div>

            <Card style={{ textAlign: "left", marginBottom: 24 }}>
              {[["Business", form.name || "—"], ["Type", form.type === "salon" ? "Salon" : "Independent"], ["CAC", form.cac || "—"], ["Services", form.cats.length > 0 ? form.cats.map(id => ALL_CATEGORIES.find(c => c.id === id)?.label).join(", ") : "—"], ["WhatsApp", form.whatsapp || "—"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 13, color: T.text1, fontFamily: "system-ui" }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text0, fontFamily: "system-ui", maxWidth: "60%", textAlign: "right", wordBreak: "break-word" }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        )}
      </Screen>

      <div style={{ padding: "14px 16px 32px", background: T.bg1, borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
        <Btn full onClick={next}>{step === 4 ? "Go to Dashboard" : "Continue"}</Btn>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   ADMIN APP
══════════════════════════════════════════════════════════════════════════════*/
const AdminApp = () => {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: T.bg0, minHeight: "100vh" }}>
      <div style={{ background: T.bg1, padding: "52px 16px 16px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 12, color: T.amber, fontFamily: "system-ui", fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>Admin Portal</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.text0, fontFamily: "system-ui" }}>BeautyHub Control</div>
          </div>
          <div style={{ background: T.amberLo, border: `1px solid ${T.amber}33`, borderRadius: 10, padding: "6px 12px" }}>
            <span style={{ fontSize: 13, color: T.amber, fontFamily: "system-ui", fontWeight: 700 }}>+23% MoM</span>
          </div>
        </div>
      </div>

      <Screen>
        {tab === "overview" && <AdminOverview />}
        {tab === "chats" && <AdminChats />}
        {tab === "users" && <AdminUsers />}
        {tab === "analytics" && <AdminAnalytics />}
      </Screen>

      <BottomNav tabs={[["overview","grid","Overview"],["chats","chat","Chats"],["users","users","Users"],["analytics","trending","Analytics"]]} active={tab} setActive={setTab} color={T.amber} />
    </div>
  );
};

const AdminOverview = () => (
  <>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
      {[["₦4.2M", "Revenue", T.green], ["₦890K", "In Escrow", T.amber], ["847", "Bookings", T.accent], ["124", "Providers", "#06B6D4"]].map(([v, l, c]) => (
        <div key={l} style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: c, fontFamily: "system-ui" }}>{v}</div>
          <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", marginTop: 4 }}>{l}</div>
        </div>
      ))}
    </div>

    <Section title="🔴 Active Disputes">
      {CONVERSATIONS.filter(c => c.status === "dispute").map(c => (
        <Card key={c.id} style={{ marginBottom: 12, border: `1px solid ${T.red}33` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{c.service}</div>
            <StatusDot status="open" />
          </div>
          <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", marginBottom: 4 }}>{c.hirer} → {c.provider}</div>
          <div style={{ fontSize: 12, color: T.red, fontFamily: "system-ui", lineHeight: 1.5, marginBottom: 12 }}>{c.msgs[c.msgs.length - 2]?.text}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn sm variant="danger">Refund Hirer</Btn>
            <Btn sm variant="success">Release Escrow</Btn>
            <Btn sm variant="ghost">View Thread</Btn>
          </div>
        </Card>
      ))}
      {CONVERSATIONS.filter(c => c.status === "dispute").length === 0 && (
        <div style={{ textAlign: "center", padding: "20px 0", color: T.text2, fontFamily: "system-ui", fontSize: 13 }}>No active disputes. ✓</div>
      )}
    </Section>

    <Section title="Escrow Summary">
      <Card>
        {[["Active Bookings", "42"], ["Funds Locked", "₦890,000"], ["Avg. Per Booking", "₦21,190"], ["Oldest Unresolved", "6 hrs ago"]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 13, color: T.text1, fontFamily: "system-ui" }}>{k}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{v}</span>
          </div>
        ))}
      </Card>
    </Section>
  </>
);

const AdminChats = () => {
  const [selected, setSelected] = useState(null);

  if (selected) return (
    <div>
      <Btn variant="subtle" sm onClick={() => setSelected(null)} style={{ marginBottom: 16 }}>← Back to Conversations</Btn>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text0, fontFamily: "system-ui", marginBottom: 4 }}>{selected.service}</div>
        <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", marginBottom: 4 }}>Booking: {selected.booking}</div>
        <div style={{ display: "flex", gap: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: T.text2, fontFamily: "system-ui" }}>Hirer</div>
            <div style={{ fontSize: 12, color: T.text0, fontFamily: "system-ui", fontWeight: 600 }}>{selected.hirer}</div>
            <div style={{ fontSize: 11, color: T.accent, fontFamily: "system-ui" }}>{selected.hirerPhone}</div>
          </div>
          <div style={{ width: 1, background: T.border }} />
          <div>
            <div style={{ fontSize: 11, color: T.text2, fontFamily: "system-ui" }}>Provider</div>
            <div style={{ fontSize: 12, color: T.text0, fontFamily: "system-ui", fontWeight: 600 }}>{selected.provider}</div>
            <div style={{ fontSize: 11, color: T.accent, fontFamily: "system-ui" }}>{selected.providerPhone}</div>
          </div>
        </div>
      </Card>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {selected.msgs.map((m, i) => {
          const isBot = m.from === "bot";
          const isHirer = m.from === "hirer";
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: isBot ? "center" : isHirer ? "flex-start" : "flex-end" }}>
              {isBot ? (
                <div style={{ background: T.accentLo, border: `1px solid ${T.accentMid}`, borderRadius: 10, padding: "8px 12px", maxWidth: "90%", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: T.accent, fontFamily: "system-ui", fontWeight: 700, marginBottom: 3 }}>BEAUTHUB BOT</div>
                  <div style={{ fontSize: 12, color: T.text0, fontFamily: "system-ui", lineHeight: 1.5 }}>{m.text}</div>
                  <div style={{ fontSize: 10, color: T.text2, fontFamily: "system-ui", marginTop: 3 }}>{m.time}</div>
                </div>
              ) : (
                <div style={{ background: isHirer ? T.bg3 : T.bg3, border: `1px solid ${T.border}`, borderRadius: 12, padding: "9px 12px", maxWidth: "80%" }}>
                  <div style={{ fontSize: 10, color: isHirer ? T.accent : T.green, fontFamily: "system-ui", fontWeight: 700, marginBottom: 3 }}>{isHirer ? selected.hirer : selected.provider}</div>
                  <div style={{ fontSize: 13, color: T.text0, fontFamily: "system-ui", lineHeight: 1.5 }}>{m.text}</div>
                  <div style={{ fontSize: 10, color: T.text2, fontFamily: "system-ui", marginTop: 3 }}>{m.time}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selected.status === "dispute" && (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <Btn full variant="danger">Refund Hirer & Suspend Provider</Btn>
          <Btn full variant="success">Release Funds to Provider</Btn>
          <Btn full variant="ghost">Mark as Resolved</Btn>
        </div>
      )}
    </div>
  );

  return (
    <Section title="All Conversations">
      {CONVERSATIONS.map(c => (
        <Card key={c.id} onClick={() => setSelected(c)} style={{ marginBottom: 12, cursor: "pointer", border: c.status === "dispute" ? `1px solid ${T.red}44` : `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{c.service}</div>
              <div style={{ fontSize: 12, color: T.text1, fontFamily: "system-ui", marginTop: 2 }}>{c.hirer} → {c.provider}</div>
            </div>
            <StatusDot status={c.status === "active" ? "active" : c.status === "completed" ? "completed" : "open"} />
          </div>
          <div style={{ fontSize: 12, color: T.text2, fontFamily: "system-ui", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {c.msgs[c.msgs.length - 1]?.text}
          </div>
          <div style={{ fontSize: 10, color: T.text2, fontFamily: "system-ui", marginTop: 6 }}>{c.msgs.length} messages · {c.booking}</div>
        </Card>
      ))}
    </Section>
  );
};

const AdminUsers = () => {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? ALL_USERS : ALL_USERS.filter(u => u.type === filter);

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[["all", "All"], ["hirer", "Clients"], ["provider", "Providers"]].map(([v, l]) => (
          <div key={v} onClick={() => setFilter(v)} style={{ padding: "7px 16px", borderRadius: 20, border: `1px solid ${filter === v ? T.accent : T.border}`, background: filter === v ? T.accentLo : T.bg2, color: filter === v ? T.accent : T.text1, fontSize: 12, fontFamily: "system-ui", fontWeight: 600, cursor: "pointer" }}>{l}</div>
        ))}
      </div>
      <div style={{ fontSize: 13, color: T.text2, fontFamily: "system-ui", marginBottom: 14 }}>{filtered.length} users</div>
      {filtered.map(u => (
        <Card key={u.id} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Avatar initials={u.name.split(" ").map(n => n[0]).join("").slice(0, 2)} color={u.type === "provider" ? T.green : T.accent} size={40} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: T.text1, fontFamily: "system-ui", marginTop: 2 }}>{u.phone} · {u.id}</div>
                </div>
                <StatusDot status={u.status} />
              </div>
              <div style={{ fontSize: 11, color: T.text2, fontFamily: "system-ui", marginTop: 6 }}>
                {u.type === "provider" ? "Provider" : "Client"} · Joined {u.joined} · {u.bookings} bookings
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                {u.status === "active" || u.status === "verified" ? (
                  <Btn sm variant="danger">Suspend</Btn>
                ) : (
                  <Btn sm variant="success">Reinstate</Btn>
                )}
                <Btn sm variant="ghost">View Profile</Btn>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </>
  );
};

const AdminAnalytics = () => (
  <>
    <Section title="Platform Health">
      {[
        { label: "Booking Completion Rate", value: 94, max: 100, color: T.green, suffix: "%" },
        { label: "Provider Response Rate", value: 88, max: 100, color: T.accent, suffix: "%" },
        { label: "Dispute Rate", value: 3, max: 100, color: T.red, suffix: "%" },
        { label: "Escrow Release Rate", value: 97, max: 100, color: T.amber, suffix: "%" },
      ].map(({ label, value, max, color, suffix }) => (
        <Card key={label} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: T.text1, fontFamily: "system-ui" }}>{label}</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: color, fontFamily: "system-ui" }}>{value}{suffix}</span>
          </div>
          <div style={{ background: T.bg3, borderRadius: 4, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 4, transition: "width 1s" }} />
          </div>
        </Card>
      ))}
    </Section>

    <Section title="Revenue Breakdown">
      <Card>
        {[["Platform Fees (15%)", "₦1.05M", T.accent], ["Provider Payouts (85%)", "₦3.15M", T.green], ["Cancellation Fees", "₦78K", T.amber], ["Dispute Reversals", "-₦32K", T.red]].map(([l, v, c]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 13, color: T.text1, fontFamily: "system-ui" }}>{l}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: c, fontFamily: "system-ui" }}>{v}</span>
          </div>
        ))}
      </Card>
    </Section>

    <Section title="Top Providers This Month">
      {PROVIDERS.slice(0, 3).map((p, i) => (
        <Card key={p.id} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text2, fontFamily: "system-ui", width: 24 }}>#{i + 1}</div>
            <Avatar initials={p.initials} color={p.color} size={38} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text0, fontFamily: "system-ui" }}>{p.name}</div>
              <div style={{ fontSize: 11, color: T.text1, fontFamily: "system-ui" }}>{p.rating}★ · {p.reviews} reviews</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.green, fontFamily: "system-ui" }}>{["₦142K", "₦98K", "₦76K"][i]}</div>
          </div>
        </Card>
      ))}
    </Section>
  </>
);

/* ════════════════════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════════════════════*/
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [role, setRole] = useState(null);

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: T.bg0,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        maxWidth: 430,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 80px rgba(0,0,0,0.8)",
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        body { background: #000; }
        input, textarea { color-scheme: dark; }
        button:active { opacity: 0.75; }
      `}</style>

      {/* Screens */}
      {screen === "splash" && (
        <SplashScreen onDone={() => setScreen("role")} />
      )}

      {screen === "role" && (
        <RoleScreen
          onSelect={(r) => {
            setRole(r);
            setScreen(r); // goes to hirer/provider/admin
          }}
        />
      )}

      {screen === "hirer" && <HirerApp />}
      {screen === "provider" && <ProviderApp />}
      {screen === "admin" && <AdminApp />}

      {/* Role switcher */}
      {screen !== "splash" && screen !== "role" && (
        <div
          onClick={() => {
            setScreen("role");
            setRole(null); // ✅ reset role (important)
          }}
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 999,
            background: T.bg3,
            border: `1px solid ${T.borderHi}`,
            borderRadius: 20,
            padding: "6px 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            backdropFilter: "blur(10px)",
          }}
        >
          <Ico name="x" size={12} color={T.text1} />
          <span
            style={{
              fontSize: 12,
              color: T.text1,
              fontFamily: "system-ui",
              fontWeight: 600,
            }}
          >
            Switch
          </span>
        </div>
      )}
    </div>
  );
}