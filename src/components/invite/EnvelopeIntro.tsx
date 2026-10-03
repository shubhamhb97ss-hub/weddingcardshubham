import { useState, type ReactNode, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { WaxSeal } from "./Decor";
import { invitation } from "@/data/invitation";

const grain = "absolute inset-0 grain";

/* Diwali palette: rose-magenta paper, marigold, gold foil, diya-flame orange, teal + coral accents */
const gold = "oklch(0.84 0.13 85)";
const goldSoft = "oklch(0.92 0.09 90)";
const paper = "linear-gradient(145deg, oklch(0.78 0.15 8), oklch(0.62 0.21 355))";
const paperSide = "linear-gradient(160deg, oklch(0.82 0.13 20), oklch(0.66 0.2 5))";
const paperDeep = "linear-gradient(0deg, oklch(0.55 0.2 350), oklch(0.7 0.18 5))";
const topFront = "linear-gradient(180deg, oklch(0.84 0.12 30), oklch(0.68 0.2 358))";
const linerBg = [
  `radial-gradient(circle at 8px 8px, ${gold} 1.6px, transparent 2px)`,
  "linear-gradient(180deg, oklch(0.42 0.14 345), oklch(0.32 0.12 340))",
].join(",");

const marigold = "oklch(0.78 0.17 65)";
const pink = "oklch(0.7 0.2 350)";
const teal = "oklch(0.75 0.12 195)";
const coral = "oklch(0.7 0.18 25)";
const ivory = "oklch(0.98 0.02 90)";

const confetti = [marigold, pink, teal, gold, ivory, coral];
const bulbColors = [marigold, pink, gold, teal, coral, ivory];

const rnd = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/* ---------- fairy-light garland (toran) across the top ---------- */

const SWAGS = 3;
const PER_SWAG = 5;
const sag = (u: number) => 6 + 30 * Math.sin(Math.PI * u);

const wirePath =
  "M" +
  Array.from({ length: SWAGS * 24 + 1 }, (_, i) => {
    const s = Math.min(Math.floor(i / 24), SWAGS - 1);
    const u = (i - s * 24) / 24;
    return `${(((s + u) / SWAGS) * 100).toFixed(2)} ${sag(u).toFixed(1)}`;
  }).join(" L");

const bulbs = Array.from({ length: SWAGS * PER_SWAG }, (_, i) => {
  const s = Math.floor(i / PER_SWAG);
  const u = ((i % PER_SWAG) + 1) / (PER_SWAG + 1);
  return {
    x: ((s + u) / SWAGS) * 100,
    y: sag(u) + 2,
    c: bulbColors[i % bulbColors.length],
    d: (i % 5) * 0.35,
    t: 1.6 + (i % 3) * 0.45,
  };
});

/* ---------- fireworks (anar) on opening ---------- */

const bursts = [
  { x: 22, y: 26, c: marigold, d: 0 },
  { x: 78, y: 20, c: pink, d: 0.22 },
  { x: 50, y: 13, c: gold, d: 0.45 },
  { x: 28, y: 72, c: teal, d: 0.62 },
  { x: 74, y: 70, c: coral, d: 0.82 },
].map((b, bi) => ({
  ...b,
  sparks: Array.from({ length: 18 }, (_, j) => {
    const a = (j / 18) * Math.PI * 2 + bi * 0.3;
    const r = j % 2 ? 62 : 96;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r, s: j % 2 ? 4 : 5 };
  }),
}));

/* ---------- petals ---------- */

const petals = Array.from({ length: 28 }, (_, i) => {
  const a = (i / 28) * Math.PI * 2 + (i % 3) * 0.2;
  const r = 140 + ((i * 47) % 160);
  return {
    x: Math.cos(a) * r,
    y: Math.sin(a) * r + 40,
    w: 6 + (i % 4) * 2,
    h: 10 + (i % 3) * 4,
    rot: (i * 67) % 360,
    c: confetti[i % confetti.length],
    d: (i % 7) * 0.04,
  };
});

/* ---------- rising embers ---------- */

const embers = Array.from({ length: 14 }, (_, i) => ({
  x: 4 + rnd(i + 1) * 92,
  s: 2 + rnd(i + 7) * 3,
  dur: 7 + rnd(i + 3) * 5,
  d: rnd(i + 11) * 6,
}));

/* ---------- pieces ---------- */

function Flap({
  clip, bg, shadow, animate, transition, children,
}: {
  clip: string; bg: string; shadow?: string; animate: object; transition: object; children?: ReactNode;
}) {
  return (
    <motion.div className="absolute inset-0" style={{ filter: shadow }} animate={animate} transition={transition}>
      <div className={grain} style={{ clipPath: clip, background: bg }}>{children}</div>
    </motion.div>
  );
}

/* A clay diya with a flickering flame */
function Diya({ x, size, i, reduce }: { x: number; size: number; i: number; reduce: boolean | null }) {
  const flicker = reduce ? {} : { repeat: Infinity, ease: "easeInOut" as const, delay: i * 0.3 };
  return (
    <div className="absolute" style={{ left: `${x}%`, bottom: 18, width: 44, height: 36, marginLeft: -22, transform: `scale(${size})`, transformOrigin: "bottom center" }}>
      <motion.span
        aria-hidden
        className="absolute rounded-full"
        style={{
          left: "50%", top: -34, width: 90, height: 90, marginLeft: -45,
          background: "radial-gradient(circle, oklch(0.9 0.15 75 / .6), oklch(0.8 0.17 60 / .2) 45%, transparent 70%)",
        }}
        animate={reduce ? { opacity: 0.8 } : { opacity: [0.6, 1, 0.7, 1, 0.6] }}
        transition={{ duration: 1.7 + i * 0.2, ...flicker }}
      />
      <motion.span
        aria-hidden
        className="absolute"
        style={{
          left: "50%", bottom: 15, width: 11, height: 22, marginLeft: -5.5,
          transformOrigin: "50% 100%",
          borderRadius: "50% 50% 50% 50% / 68% 68% 32% 32%",
          background: "linear-gradient(0deg, oklch(0.72 0.19 50), oklch(0.88 0.15 80) 55%, oklch(0.99 0.04 95))",
          boxShadow: "0 0 10px 3px oklch(0.85 0.16 70 / .8)",
        }}
        animate={reduce ? {} : { scaleY: [1, 1.18, 0.94, 1.1, 1], scaleX: [1, 0.88, 1.06, 0.94, 1], rotate: [-3, 3, -2, 2, -3] }}
        transition={{ duration: 1.5 + (i % 3) * 0.25, ...flicker }}
      />
      <svg aria-hidden viewBox="0 0 44 20" className="absolute bottom-0 left-0 h-5 w-11">
        <path d="M1 3 H43 Q40 19 22 19 Q4 19 1 3 Z" fill="oklch(0.55 0.15 45)" stroke={gold} strokeWidth="1.2" />
        <path d="M1 3 Q22 9 43 3" fill="none" stroke={goldSoft} strokeWidth="1" />
        <circle cx="22" cy="13" r="1.6" fill={gold} />
      </svg>
    </div>
  );
}

/* Rotating gold rangoli mandala behind the seal */
function Rangoli({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="-110 -110 220 220"
      className="h-[236px] w-[236px]"
      animate={reduce ? {} : { rotate: 360 }}
      transition={{ duration: 48, ease: "linear", repeat: Infinity }}
    >
      <g fill="none" stroke={gold} strokeWidth="1.1">
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={i} cx="0" cy="-70" rx="9" ry="22" transform={`rotate(${i * 30})`} fill="oklch(0.78 0.17 65 / .2)" />
        ))}
        <circle r="46" strokeDasharray="2 5" />
        <circle r="102" strokeDasharray="1 7" strokeLinecap="round" />
      </g>
      <g fill={goldSoft}>
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return <circle key={i} cx={Math.cos(a) * 92} cy={Math.sin(a) * 92} r={i % 2 ? 1.6 : 2.6} />;
        })}
      </g>
    </motion.svg>
  );
}

export function EnvelopeIntro({ onOpened }: { onOpened: () => void }) {
  const [opening, setOpening] = useState(false);
  const reduce = useReducedMotion();
  const dur = reduce ? 0.2 : 1.1;
  const ease = [0.65, 0, 0.35, 1] as const;

  /* fireworks play first; the envelope opens after this offset */
  const S = reduce ? 0 : 1.3;

  const open = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpened, reduce ? 300 : 2500 + S * 1000);
  };

  const hidden: CSSProperties = { backfaceVisibility: "hidden" };

  return (
    <motion.div
      className="absolute inset-0 z-50 overflow-hidden bg-blush"
      style={{
        perspective: 1400,
        background:
          "radial-gradient(circle at 50% 45%, oklch(0.97 0.05 80), oklch(0.9 0.08 40) 60%, oklch(0.8 0.12 10))",
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: opening ? 0 : 1 }}
      transition={{ delay: opening ? (reduce ? 0 : 1.8 + S) : 0, duration: 0.7 }}
    >
      {/* golden light that spills out on opening */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.99 0.08 90), oklch(0.88 0.14 70 / .6) 35%, transparent 65%)",
        }}
        animate={{ opacity: opening ? 1 : 0.25, scale: opening ? 1.8 : 1 }}
        transition={{ duration: 1.4, delay: opening ? 0.5 + S : 0 }}
      />

      <Flap
        clip="polygon(0 0, 52% 50%, 0 100%)"
        bg={paperSide}
        shadow="drop-shadow(3px 0 6px oklch(0.3 0.1 350 / .35))"
        animate={opening ? { x: "-100%" } : { x: 0 }}
        transition={{ duration: dur, delay: 0.6 + S, ease }}
      >
        <Emboss side="left" />
      </Flap>

      <Flap
        clip="polygon(100% 0, 48% 50%, 100% 100%)"
        bg={paper}
        shadow="drop-shadow(-3px 0 6px oklch(0.3 0.1 350 / .35))"
        animate={opening ? { x: "100%" } : { x: 0 }}
        transition={{ duration: dur, delay: 0.6 + S, ease }}
      >
        <Emboss side="right" />
      </Flap>

      <Flap
        clip="polygon(0 100%, 50% 47%, 100% 100%)"
        bg={paperDeep}
        shadow="drop-shadow(0 -3px 6px oklch(0.3 0.1 350 / .4))"
        animate={opening ? { y: "100%" } : { y: 0 }}
        transition={{ duration: dur, delay: 0.6 + S, ease }}
      />

      {/* top flap: rose outside, patterned maroon-and-gold liner inside */}
      <motion.div
        className="absolute inset-0"
        style={{
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          filter: "drop-shadow(0 6px 8px oklch(0.3 0.1 350 / .45))",
        }}
        animate={opening ? { rotateX: 180 } : { rotateX: 0 }}
        transition={{ duration: dur, delay: 0.3 + S, ease }}
      >
        <div
          className={grain}
          style={{ ...hidden, clipPath: "polygon(0 0, 100% 0, 50% 53%)", background: topFront }}
        />
        <div
          className={grain}
          style={{
            ...hidden,
            clipPath: "polygon(0 0, 100% 0, 50% 53%)",
            background: linerBg,
            backgroundSize: "16px 16px, 100% 100%",
            transform: "rotateX(180deg)",
          }}
        />
      </motion.div>

      {/* double gold border */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-[6px]"
        style={{ border: `1.5px solid ${gold}`, boxShadow: `inset 0 0 0 4px transparent, inset 0 0 0 5px ${goldSoft}` }}
        animate={{ opacity: opening ? 0 : 0.85 }}
        transition={{ duration: 0.4, delay: opening ? S : 0 }}
      />

      {/* ---------- DIWALI ---------- */}

      {/* twinkling fairy-light garland */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[64px]"
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: 0.6, delay: opening ? S + 0.2 : 0 }}
      >
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path d={wirePath} fill="none" stroke={gold} strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
        </svg>
        {bulbs.map((b, i) => (
          <motion.span
            key={i}
            className="absolute"
            style={{
              left: `${b.x}%`, top: b.y, width: 9, height: 13, marginLeft: -4.5,
              background: b.c,
              borderRadius: "50% 50% 45% 45% / 40% 40% 60% 60%",
              boxShadow: `0 0 10px 3px ${b.c}`,
              borderTop: `2px solid ${gold}`,
            }}
            animate={
              reduce
                ? { opacity: 0.9 }
                : opening
                  ? { opacity: [0.5, 1, 0.5], scale: [0.9, 1.25, 0.9] }
                  : { opacity: [0.45, 1, 0.55, 1, 0.45], scale: [0.92, 1.08, 0.96, 1.08, 0.92] }
            }
            transition={{ duration: opening ? 0.35 : b.t, delay: opening ? 0 : b.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.div>

      {/* row of diyas along the bottom */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: 0.6, delay: opening ? S + 0.2 : 0 }}
      >
        {[
          { x: 12, size: 0.9 },
          { x: 31, size: 1 },
          { x: 50, size: 1.1 },
          { x: 69, size: 1 },
          { x: 88, size: 0.9 },
        ].map((d, i) => (
          <Diya key={i} x={d.x} size={d.size} i={i} reduce={reduce} />
        ))}
      </motion.div>

      {/* embers drifting up from the diyas */}
      {!opening && !reduce &&
        embers.map((e, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute bottom-10 z-10 rounded-full"
            style={{ left: `${e.x}%`, width: e.s, height: e.s, background: goldSoft, boxShadow: `0 0 8px 2px ${marigold}` }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: "-85vh", x: [0, 14, -10, 8], opacity: [0, 1, 1, 0] }}
            transition={{ duration: e.dur, delay: e.d, repeat: Infinity, ease: "easeOut" }}
          />
        ))}

      {/* fireworks (anar) when the seal is tapped */}
      {opening && !reduce &&
        bursts.map((b, bi) => (
          <div key={bi} aria-hidden className="pointer-events-none absolute z-20" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
            <motion.span
              className="absolute rounded-full"
              style={{
                left: -24, top: -24, width: 48, height: 48,
                background: `radial-gradient(circle, ${ivory}, ${b.c} 45%, transparent 70%)`,
              }}
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 2.2], opacity: [1, 0] }}
              transition={{ duration: 0.5, delay: b.d, ease: "easeOut" }}
            />
            {b.sparks.map((p, j) => (
              <motion.span
                key={j}
                className="absolute rounded-full"
                style={{
                  left: -p.s / 2, top: -p.s / 2, width: p.s, height: p.s,
                  background: j % 3 === 0 ? ivory : b.c,
                  boxShadow: `0 0 8px 2px ${b.c}`,
                }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{ x: p.x, y: [0, p.y, p.y + 26], opacity: [0, 1, 0], scale: [1, 1, 0.3] }}
                transition={{ duration: 1.25, delay: b.d + 0.05, ease: "easeOut", times: [0, 0.65, 1] }}
              />
            ))}
          </div>
        ))}

      {/* marigold petal burst (as the envelope opens) */}
      {opening && !reduce &&
        petals.map((p, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2"
            style={{
              width: p.w,
              height: p.h,
              background: p.c,
              borderRadius: "60% 40% 60% 40%",
              boxShadow: "0 1px 3px rgba(80,10,30,.25)",
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
            animate={{ x: p.x, y: p.y, opacity: [0, 1, 1, 0], scale: [0.4, 1.1, 1], rotate: p.rot + 180 }}
            transition={{ duration: 1.6, delay: 0.15 + S + p.d, ease: "easeOut" }}
          />
        ))}

      {/* seal with rangoli mandala and diya-glow halo */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            aria-hidden
            animate={opening ? { scale: 2.2, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: opening ? S * 0.6 : 0 }}
          >
            <Rangoli reduce={reduce} />
          </motion.div>
        </div>
        {!opening && !reduce && (
          <motion.span
            aria-hidden
            className="absolute inset-[-24px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.92 0.14 85 / .65), oklch(0.78 0.17 60 / .3) 52%, transparent 72%)",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <motion.button
          type="button"
          onClick={open}
          aria-label="Open the invitation"
          className="relative rounded-full drop-shadow-[0_8px_12px_rgba(60,10,30,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wine"
          whileHover={{ scale: 1.05, rotate: -2 }}
          whileTap={{ scale: 0.94 }}
          animate={opening ? { scale: [1, 1.12, 0.3], opacity: [1, 1, 0], rotate: [0, -6, 8] } : {}}
          transition={{ duration: 0.6, delay: opening ? S * 0.6 : 0 }}
        >
          <WaxSeal label={invitation.monogram} size={108} />
        </motion.button>
      </div>

      {!opening && (
        <p
          className="animate-softpulse absolute left-1/2 top-[calc(50%+130px)] z-10 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap font-serif text-base italic tracking-wide"
          style={{ color: ivory, textShadow: "0 1px 4px oklch(0.3 0.12 350 / .6)" }}
        >
          <span aria-hidden className="h-px w-8" style={{ background: gold }} />
          Tap the seal to open
          <span aria-hidden className="h-px w-8" style={{ background: gold }} />
        </p>
      )}
    </motion.div>
  );
}

/* Gold-foil vine with coloured marigold, pink and teal flowers */
function Emboss({ side }: { side: "left" | "right" }) {
  const rows = [
    { y: 40, c: "oklch(0.78 0.17 65)" },
    { y: 75, c: "oklch(0.92 0.07 350)" },
    { y: 110, c: "oklch(0.78 0.17 65)" },
    { y: 145, c: "oklch(0.78 0.12 195)" },
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 200"
      className={`absolute top-1/2 h-64 w-32 -translate-y-1/2 ${side === "left" ? "left-3" : "right-3 -scale-x-100"}`}
    >
      <g fill="none" stroke={gold} strokeWidth="1.4" strokeLinecap="round">
        <path d="M20 190 C 30 140, 10 100, 30 60 S 40 10, 30 5" />
        {rows.map(({ y, c }) => (
          <g key={y}>
            <path d={`M26 ${y} q 18 -10 26 4 q -14 10 -26 -4`} fill="oklch(0.7 0.14 150 / .55)" />
            <circle cx={50} cy={y - 8} r={7} fill={c} stroke={gold} />
            <circle cx={50} cy={y - 8} r={2.6} fill={goldSoft} stroke="none" />
          </g>
        ))}
      </g>
    </svg>
  );
}