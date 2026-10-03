import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroArch from "@/assets/hero-arch.jpg";
import { invitation } from "@/data/invitation";
import { FloatingPetals } from "./Decor";

export function Hero({ show }: { show: boolean }) {
  const rise = (d: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: show ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1.1, delay: d },
  });
  return (
    <section className="relative h-svh min-h-[640px] overflow-hidden">
      {/* TODO: replace with your own artwork */}
      <img
        src={heroArch}
        alt="Watercolor stone arch with climbing roses and two swans on a lake"
        width={864}
        height={1536}
        className="animate-bob absolute inset-0 h-full w-full scale-105 object-cover"
        style={{ animationDuration: "9s" }}
      />
      <FloatingPetals />
      <div className="relative z-[3] flex h-full flex-col items-center pt-[14%] text-center">
        <motion.p {...rise(0.2)} className="font-script text-3xl text-dusty">Wedding Day</motion.p>
        <motion.p {...rise(0.4)} className="font-serif text-sm tracking-[0.35em] text-ink">
          {invitation.displayDate}
        </motion.p>
        <div className="mt-[14%]">
          <motion.h1 {...rise(0.7)} className="-translate-x-6 font-script text-7xl leading-none text-wine">
            {invitation.groom}
          </motion.h1>
          <motion.p {...rise(0.9)} className="my-1 font-script text-3xl text-dusty">&amp;</motion.p>
          <motion.p {...rise(1.1)} className="translate-x-6 font-script text-7xl leading-none text-wine">
            {invitation.bride}
          </motion.p>
        </div>
        <motion.a
          href="#blessing"
          {...rise(1.5)}
          className="mt-auto mb-[34%] flex flex-col items-center font-script text-lg text-ink"
        >
          Scroll down
          <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden />
        </motion.a>
      </div>
    </section>
  );
}
