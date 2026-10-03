import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { invitation } from "@/data/invitation";

export function MusicToggle({ start }: { start: boolean }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!start || !ref.current) return;
    ref.current.volume = 0.5;
    ref.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [start]);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {});
    else { a.pause(); setPlaying(false); }
  };

  return (
    <>
      <audio ref={ref} src={invitation.musicUrl} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        className="seal fixed bottom-5 z-40 grid h-11 w-11 place-items-center text-cream"
        style={{ right: "max(1.25rem, calc(50vw - 240px + 1.25rem))" }}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
      </button>
    </>
  );
}
