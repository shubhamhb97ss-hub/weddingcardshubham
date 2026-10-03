import { useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { invitation } from "@/data/invitation";
import { useCountdown } from "@/hooks/useCountdown";
import { FloatingPetals, Ornament, Reveal, SectionHeading, TornPaperDivider } from "./Decor";
import vine from "@/assets/vine.png";
import roseCluster from "@/assets/rose-cluster.png";
import mosque from "@/assets/mosque.png";

const pale = "text-cream";
const deep = "text-blush";

export function BlessingSection() {
  return (
    <section id="blessing" className="grain relative overflow-hidden bg-cream px-8 pb-16 pt-20 text-center">
      {/* TODO: replace with your own artwork */}
      <img src={vine} alt="" aria-hidden loading="lazy" className="absolute -left-8 -top-10 w-24 -rotate-[30deg] opacity-80" />
      <img src={vine} alt="" aria-hidden loading="lazy" className="absolute -right-8 -top-10 w-24 rotate-[30deg] -scale-x-100 opacity-80" />
      <div className="relative z-[2]">
        <Reveal>
          <p lang="ar" dir="rtl" className="font-arabic text-xl text-ink">{invitation.bismillah}</p>
        </Reveal>
        <div className="mt-8 space-y-1">
          {invitation.tagline.map((t, i) => (
            <Reveal key={t} delay={0.15 * i}>
              <p className={`font-script text-4xl text-wine ${i === 1 ? "translate-x-5" : i === 0 ? "-translate-x-5" : ""}`}>{t}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.4}>
          <Ornament className="mx-auto my-6" />
          <p className="mx-auto max-w-xs text-[15px] leading-8 text-ink">{invitation.welcomeText}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Digit({ value, label }: { value: number; label: string }) {
  const v = String(value).padStart(2, "0");
  return (
    <div className="flex w-14 flex-col items-center">
      <div className="relative h-12 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={v}
            initial={{ y: -20, opacity: 0, rotateX: 90 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: 20, opacity: 0, rotateX: -90 }}
            transition={{ duration: 0.4 }}
            className="block font-serif text-5xl font-medium leading-none text-wine"
          >
            {v}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1 font-serif text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    </div>
  );
}

export function Countdown() {
  const c = useCountdown(invitation.weddingDate);
  return (
    <section className="grain relative bg-blush px-6 py-16 text-center">
      <TornPaperDivider className={`absolute inset-x-0 -top-px ${pale}`} flip />
      <div className="relative z-[2]">
        <SectionHeading>The Celebration Begins In</SectionHeading>
        <Reveal className="mt-8">
          {c.done ? (
            <p className="font-script text-5xl text-wine">Today is the day!</p>
          ) : (
            <div className="flex items-start justify-center gap-1" aria-live="polite">
              <Digit value={c.days} label="Days" />
              <span className="font-serif text-4xl text-dusty">:</span>
              <Digit value={c.hours} label="Hours" />
              <span className="font-serif text-4xl text-dusty">:</span>
              <Digit value={c.minutes} label="Minutes" />
              <span className="font-serif text-4xl text-dusty">:</span>
              <Digit value={c.seconds} label="Seconds" />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function RoseMarker() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="var(--rose)" />
      <path d="M12 6 c4 0 5 4 2 6 c3 1 1 6 -2 5 c-3 1 -5 -4 -2 -5 c-3 -2 -2 -6 2 -6z" fill="var(--dusty)" />
      <circle cx="12" cy="11.5" r="2" fill="var(--wine)" opacity=".6" />
    </svg>
  );
}

export function Schedule() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 45%"] });
  const top = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const n = invitation.schedule.length;
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.round(v * (n - 1))));

  return (
    <section className="grain relative bg-cream px-6 py-16">
      <TornPaperDivider className={`absolute inset-x-0 -top-px ${deep}`} flip />
      <div className="relative z-[2]">
        <SectionHeading flourish>Schedule of Events</SectionHeading>
        <div ref={ref} className="relative mx-auto mt-10 w-full max-w-xs">
          <div className="absolute inset-y-3 left-1/2 w-px -translate-x-1/2 bg-ink/60" />
          <motion.div className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2" style={{ top }}>
            <RoseMarker />
          </motion.div>
          {invitation.schedule.map((e, i) => (
            <motion.div
              key={e.time}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="grid h-16 grid-cols-[1fr_2.5rem_1fr] items-center"
            >
              <span className={`text-right font-serif text-xl transition-colors ${active === i ? "text-wine" : "text-ink/70"}`}>
                {e.time}
              </span>
              <span className="grid place-items-center">
                <span
                  className={`h-2.5 w-2.5 rotate-45 border border-ink transition-colors ${active === i ? "bg-dusty" : "bg-cream"}`}
                />
              </span>
              <span className={`text-sm transition-all ${active === i ? "font-medium text-wine" : "text-ink/70"}`}>
                {e.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={`absolute h-9 w-9 text-gold ${className}`}>
      <path d="M2 38 V10 Q2 2 10 2 H38" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 34 V12 Q7 7 12 7 H34" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="10" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

export function Location() {
  const v = invitation.venue;
  return (
    <section className="grain relative overflow-hidden bg-blush px-6 pb-16 pt-16 text-center">
      <TornPaperDivider className={`absolute inset-x-0 -top-px ${pale}`} flip />
      <FloatingPetals />
      <div className="relative z-[3]">
        <SectionHeading>Location</SectionHeading>
        <Reveal className="mt-5">
          <p className="font-serif text-2xl font-semibold text-wine">{v.name}</p>
          <p className="mx-auto mt-1 max-w-[16rem] text-sm leading-6 text-ink">{v.address}</p>
        </Reveal>
        <Reveal delay={0.2}>
          {/* TODO: replace with your own venue illustration */}
          <img
            src={mosque}
            alt={`Illustration of ${v.name}`}
            loading="lazy"
            width={1024}
            height={768}
            className="mx-auto -my-4 w-full max-w-sm"
            style={{ maskImage: "linear-gradient(to bottom, black 70%, transparent)" }}
          />
        </Reveal>
        <Reveal delay={0.3} className="relative mx-auto mt-2 rounded-2xl border border-gold/70 bg-cream p-2">
          <Corner className="-left-1 -top-1" />
          <Corner className="-right-1 -top-1 rotate-90" />
          <Corner className="-bottom-1 -right-1 rotate-180" />
          <Corner className="-bottom-1 -left-1 -rotate-90" />
          <iframe
            title={`Map to ${v.name}`}
            src={v.mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-56 w-full rounded-xl border-0"
          />
        </Reveal>
        <a
          href={v.mapLink}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-wine px-5 py-2 font-serif text-sm tracking-wider text-cream transition-transform hover:scale-105 active:scale-95"
        >
          <MapPin className="h-4 w-4" aria-hidden /> Open in Maps
        </a>
      </div>
    </section>
  );
}

export function DressCode() {
  return (
    <section className="grain relative overflow-hidden bg-cream px-10 pb-28 pt-16 text-center">
      <TornPaperDivider className={`absolute inset-x-0 -top-px ${deep}`} flip />
      {/* TODO: replace with your own artwork */}
      <img src={vine} alt="" aria-hidden loading="lazy" className="absolute -right-10 top-6 w-24 opacity-90" />
      <img src={roseCluster} alt="" aria-hidden loading="lazy" className="absolute -bottom-10 -left-12 w-44" />
      <div className="relative z-[2] space-y-10">
        <div>
          <SectionHeading>Dress Code</SectionHeading>
          <Reveal><p className="mx-auto mt-4 max-w-xs leading-7 text-ink">{invitation.dressCode}</p></Reveal>
        </div>
        <div>
          <SectionHeading>Gift Preference</SectionHeading>
          <Reveal><p className="mt-4 leading-7 text-ink">{invitation.giftPreference}</p></Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="grain relative bg-blush px-6 pb-14 pt-14 text-center">
      <TornPaperDivider className={`absolute inset-x-0 -top-px ${pale}`} flip />
      <div className="relative z-[2]">
        <Reveal>
          <p className="font-script text-4xl text-wine">{invitation.closingLine}</p>
          <Ornament className="mx-auto my-3" />
          <p className="font-serif text-xl tracking-wider text-ink">{invitation.signoff}</p>
          <p className="mt-6 text-xs text-muted-foreground">Made with love</p>
        </Reveal>
      </div>
    </footer>
  );
}
