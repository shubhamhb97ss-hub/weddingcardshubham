import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { RSVP_KEY } from "@/data/invitation";

type Row = { name: string; attending: string; guests?: number; song?: string; children?: string; submittedAt: string };

export default function Admin() {
  useEffect(() => {
    document.title = "RSVP Responses — Zohan & Rose";
  }, []);
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => setRows(JSON.parse(localStorage.getItem(RSVP_KEY) || "[]")), []);
  return (
    <main className="mx-auto min-h-svh max-w-4xl bg-cream p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-script text-4xl text-wine">RSVP Responses</h1>
        <Link to="/" className="font-serif text-sm text-dusty underline">Back to invitation</Link>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{rows.length} response(s) saved in this browser.</p>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-blush font-serif">
            <tr>{["Name", "Attending", "Guests", "Song", "Children", "Submitted"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No responses yet.</td></tr>}
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.attending === "yes" ? "Accepts" : "Declines"}</td>
                <td className="p-3">{r.guests ?? 0}</td>
                <td className="p-3">{r.song || "—"}</td>
                <td className="p-3">{r.children || "—"}</td>
                <td className="p-3">{new Date(r.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 0 && (
        <button
          className="mt-4 text-xs text-destructive underline"
          onClick={() => { localStorage.removeItem(RSVP_KEY); setRows([]); }}
        >
          Clear all
        </button>
      )}
    </main>
  );
}
