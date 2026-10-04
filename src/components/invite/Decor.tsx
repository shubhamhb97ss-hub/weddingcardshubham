import { motion, type HTMLMotionProps } from "framer-motion";

export function TornPaperDivider({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      className={`block h-5 w-full ${flip ? "rotate-180" : ""} ${className}`}
    >
      <path
        fill="currentColor"
        d="M0 24 L0 10 L12 13 L22 7 L35 12 L48 6 L60 11 L74 5 L86 12 L99 8 L112 13 L126 6 L139 11 L150 7 L164 12 L178 5 L190 10 L204 6 L217 13 L230 8 L244 12 L256 5 L270 11 L283 7 L296 13 L310 6 L322 11 L336 7 L349 12 L362 5 L375 10 L388 7 L400 11 L400 24 Z"
      />
    </svg>
  );
}

export function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 16" className={`h-4 w-28 text-dusty ${className}`}>
      <path d="M2 8 H48 M72 8 H118" stroke="currentColor" strokeWidth="0.8" />
      <path d="M60 2 L66 8 L60 14 L54 8 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="60" cy="8" r="1.6" fill="currentColor" />
      <path d="M48 8 q4 -5 8 0 M72 8 q-4 5 -8 0" fill="none" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  );
}

export function SectionHeading({ children, flourish = false }: { children: React.ReactNode; flourish?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center"
    >
      <div className="flex items-center gap-3">
        {flourish && <span aria-hidden className="font-serif text-xl text-dusty">❦</span>}
        <h2 className="font-script text-4xl leading-tight text-wine">{children}</h2>
        {flourish && <span aria-hidden className="-scale-x-100 font-serif text-xl text-dusty">❦</span>}
      </div>
      <Ornament className="mt-1" />
    </motion.div>
  );
}

export function Reveal({ delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay }}
      {...props}
    />
  );
}

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i * 1.3) % 9,
  dur: 9 + ((i * 7) % 8),
  size: 5 + ((i * 3) % 6),
  gold: i % 3 !== 0,
}));

export function FloatingPetals() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className={`animate-fall absolute top-0 ${p.gold ? "bg-gold" : "bg-rose"}`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            borderRadius: "60% 0 60% 0",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            opacity: 0,
            boxShadow: p.gold ? "0 0 6px var(--gold)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

export function WaxSeal({ label, size = 112 }: { label: string; size?: number }) {
  return (
    <span className="seal relative grid place-items-center" style={{ width: size-20, height: size-20 }}>
      <span className="absolute inset-[12%] rounded-full border border-cream/20" />
      <span className="rose-gold-text font-script" style={{ fontSize: size * 0.2,borderWidth:0,marginLeft:-4,width:"100%" }}>
        {label}
      </span>
    </span>
  );
}
