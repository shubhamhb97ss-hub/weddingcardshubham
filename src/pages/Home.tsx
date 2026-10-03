import { useEffect, useState } from "react";
import { EnvelopeIntro } from "@/components/invite/EnvelopeIntro";
import { Hero } from "@/components/invite/Hero";
import { MusicToggle } from "@/components/invite/MusicToggle";
import { BlessingSection, Countdown, DressCode, Footer, Location, Schedule } from "@/components/invite/Sections";
import { RSVPSection } from "@/components/invite/RSVP";

export default function Home() {
  useEffect(() => {
    document.title = "Zohan & Rose — Wedding Invitation";
  }, []);
  const [opened, setOpened] = useState(false);
  const [gone, setGone] = useState(false);
  return (
    <main className="relative mx-auto min-h-svh w-full max-w-[480px] overflow-x-clip bg-cream shadow-2xl min-[600px]:my-0">
      <div className={gone ? "" : "h-svh overflow-hidden"}>
        <Hero show={opened} />
        {gone && (
          <>
            <BlessingSection />
            <Countdown />
            <Schedule />
            <Location />
            <DressCode />
            <RSVPSection />
            <Footer />
          </>
        )}
      </div>
      {!gone && (
        <EnvelopeIntro
          onOpened={() => {
            setOpened(true);
            setGone(true);
          }}
        />
      )}
      <MusicToggle start={opened} />
    </main>
  );
}
