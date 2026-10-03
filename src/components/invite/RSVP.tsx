import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { invitation, RSVP_KEY } from "@/data/invitation";
import { Reveal, SectionHeading, TornPaperDivider, WaxSeal } from "./Decor";

const schema = z
  .object({
    name: z.string().trim().min(1, "Please enter your name").max(100),
    attending: z.enum(["yes", "no"], { message: "Please choose an option" }),
    guests: z.coerce.number().optional(),
    song: z.string().max(120).optional(),
    children: z.string().max(500).optional(),
  })
  .superRefine((d, ctx) => {
    if (d.attending === "yes" && (!d.guests || d.guests < 1 || d.guests > 10))
      ctx.addIssue({ code: "custom", path: ["guests"], message: "Enter between 1 and 10 guests" });
  });
type Form = z.infer<typeof schema>;

export function RSVPSection() {
  const [open, setOpen] = useState(false);
  return (
    <section className="grain relative bg-cream px-8 py-16 text-center">
      <TornPaperDivider className="absolute inset-x-0 -top-px bg-cream text-blush" flip />
      <div className="relative z-[2]">
        <SectionHeading>Confirm Your Attendance</SectionHeading>
        <Reveal>
          <p className="mx-auto mt-4 max-w-xs leading-7 text-ink">
            To help us prepare for a joyful celebration, kindly confirm your attendance.
          </p>
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open RSVP form"
            whileHover={{ scale: 1.05, rotate: -3 }}
            whileTap={{ scale: 0.94 }}
            className="mx-auto mt-8 block rounded-full"
          >
            <WaxSeal label="RSVP" size={100} />
          </motion.button>
          <ChevronUp className="mx-auto mt-3 h-4 w-4 animate-bounce text-dusty" aria-hidden />
          <p className="font-script text-xl text-ink">Click to open</p>
        </Reveal>
      </div>
      <RSVPModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

function RSVPModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState<string | null>(null);
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema) as never,
    defaultValues: { guests: 1 },
  });
  const attending = watch("attending");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("button, input, textarea, a[href]");
        if (!f.length) return;
        const first = f[0]!, last = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  const close = () => { onClose(); setTimeout(() => { setDone(null); reset(); }, 400); };

  const submit = (d: Form) => {
    const list = JSON.parse(localStorage.getItem(RSVP_KEY) || "[]");
    list.push({ ...d, guests: d.attending === "yes" ? d.guests : 0, submittedAt: new Date().toISOString() });
    localStorage.setItem(RSVP_KEY, JSON.stringify(list));
    setDone(d.name);
  };

  const label = "mb-1 block font-serif text-base font-semibold text-ink";
  const err = (m?: string) => m && <p role="alert" className="mt-1 text-xs text-destructive">{m}</p>;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-wine/30 backdrop-blur-sm" onClick={close} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rsvp-title"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="grain relative max-h-[90svh] w-full max-w-[480px] overflow-y-auto rounded-t-3xl bg-cream px-6 pb-8 pt-6 text-left"
          >
            <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 z-10 rounded-full p-1 text-ink hover:bg-blush">
              <X className="h-5 w-5" />
            </button>
            <div className="relative z-[2]">
              {done ? (
                <div className="relative py-10 text-center">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <motion.span
                      key={i}
                      aria-hidden
                      className={`absolute left-1/2 top-1/3 h-2 w-3 ${i % 2 ? "bg-rose" : "bg-gold"}`}
                      style={{ borderRadius: "60% 0 60% 0" }}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{ x: Math.cos(i) * 140, y: Math.sin(i * 1.7) * 110 + 60, opacity: 0, rotate: 360 }}
                      transition={{ duration: 1.6, ease: "easeOut" }}
                    />
                  ))}
                  <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-script text-4xl text-wine">
                    Thank you, {done}!
                  </motion.p>
                  <p className="mt-3 text-ink">Your response has been received.</p>
                  <button type="button" onClick={close} className="mt-8 rounded-full bg-wine px-8 py-2.5 font-serif tracking-wider text-cream">
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
                  <div className="text-center">
                    <h3 id="rsvp-title" className="font-script text-4xl text-wine">Confirm Your Attendance</h3>
                    <p className="font-serif text-sm italic text-muted-foreground">Please RSVP before {invitation.rsvpDeadline}</p>
                  </div>
                  <div>
                    <label htmlFor="name" className={label}>Your name</label>
                    <input id="name" autoFocus className="field" {...register("name")} />
                    {err(errors.name?.message)}
                  </div>
                  <fieldset>
                    <legend className={label}>Will you be attending?</legend>
                    {[["yes", "Accepts with pleasure"], ["no", "Declines with regret"]].map(([v, t]) => (
                      <label key={v} className="mt-1.5 flex items-center gap-2 text-sm text-ink">
                        <input type="radio" value={v} className="accent-wine" {...register("attending")} /> {t}
                      </label>
                    ))}
                    {err(errors.attending?.message)}
                  </fieldset>
                  {attending === "yes" && (
                    <div>
                      <label htmlFor="guests" className={label}>Number of Guests Attending</label>
                      <input id="guests" type="number" min={1} max={10} className="field" {...register("guests")} />
                      {err(errors.guests?.message)}
                    </div>
                  )}
                  <div>
                    <label htmlFor="song" className={label}>A Song That Gets You Dancing</label>
                    <input id="song" className="field" {...register("song")} />
                  </div>
                  <div>
                    <label htmlFor="children" className={label}>Children Attending</label>
                    <textarea id="children" rows={3} className="field" {...register("children")} />
                    <p className="mt-1 text-xs text-muted-foreground">Please include names and ages</p>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full rounded-xl bg-wine py-3 font-serif text-lg tracking-wider text-cream"
                  >
                    Submit
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
