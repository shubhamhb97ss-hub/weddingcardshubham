import { useState, type ReactNode, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { WaxSeal } from "./Decor";
import { invitation } from "@/data/invitation";

const grain = "absolute inset-0 grain";

/* Colourful palette: rose-magenta paper, marigold, teal, gold foil */
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

const confetti = [
  "oklch(0.78 0.17 65)", // marigold
  "oklch(0.7 0.2 350)", // pink
  "oklch(0.75 0.12 195)", // teal
  gold,
  "oklch(0.98 0.02 90)", // ivory
  "oklch(0.7 0.18 25)", // coral
];

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

// Deterministic petal burst (stable between renders)
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

export function EnvelopeIntro({ onOpened }: { onOpened: () => void }) {
  const [opening, setOpening] = useState(false);
  const reduce = useReducedMotion();
  const dur = reduce ? 0.2 : 1.1;
  const ease = [0.65, 0, 0.35, 1] as const;

  const open = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpened, reduce ? 300 : 2500);
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
      transition={{ delay: opening ? (reduce ? 0 : 1.8) : 0, duration: 0.7 }}
    >
      {/* golden-saffron light that spills out on opening */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.99 0.08 90), oklch(0.88 0.14 70 / .6) 35%, transparent 65%)",
        }}
        animate={{ opacity: opening ? 1 : 0.25, scale: opening ? 1.8 : 1 }}
        transition={{ duration: 1.4, delay: opening ? 0.5 : 0 }}
      />

      <Flap
        clip="polygon(0 0, 52% 50%, 0 100%)"
        bg={paperSide}
        shadow="drop-shadow(3px 0 6px oklch(0.3 0.1 350 / .35))"
        animate={opening ? { x: "-100%" } : { x: 0 }}
        transition={{ duration: dur, delay: 0.6, ease }}
      >
        <Emboss side="left" />
      </Flap>

      <Flap
        clip="polygon(100% 0, 48% 50%, 100% 100%)"
        bg={paper}
        shadow="drop-shadow(-3px 0 6px oklch(0.3 0.1 350 / .35))"
        animate={opening ? { x: "100%" } : { x: 0 }}
        transition={{ duration: dur, delay: 0.6, ease }}
      >
        <Emboss side="right" />
      </Flap>

      <Flap
        clip="polygon(0 100%, 50% 47%, 100% 100%)"
        bg={paperDeep}
        shadow="drop-shadow(0 -3px 6px oklch(0.3 0.1 350 / .4))"
        animate={opening ? { y: "100%" } : { y: 0 }}
        transition={{ duration: dur, delay: 0.6, ease }}
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
        transition={{ duration: dur, delay: 0.3, ease }}
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
        transition={{ duration: 0.4 }}
      />

      {/* multicolour petal burst */}
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
            transition={{ duration: 1.6, delay: 0.15 + p.d, ease: "easeOut" }}
          />
        ))}

      {/* seal with rainbow-gold halo */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        {!opening && !reduce && (
          <motion.span
            aria-hidden
            className="absolute inset-[-22px] rounded-full"
            style={{
              background: `radial-gradient(circle, oklch(0.9 0.13 85 / .6), oklch(0.75 0.2 350 / .25) 55%, transparent 72%)`,
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
          transition={{ duration: 0.6 }}
        >
          <WaxSeal label={invitation.monogram} size={108} />
        </motion.button>
      </div>

      {!opening && (
        <p
          className="animate-softpulse absolute left-1/2 top-[calc(50%+90px)] z-10 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap font-serif text-base italic tracking-wide"
          style={{ color: "oklch(0.98 0.02 90)", textShadow: "0 1px 4px oklch(0.3 0.12 350 / .6)" }}
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