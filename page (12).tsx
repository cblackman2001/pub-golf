import prisma from "@/lib/prisma";
import { submitStrokeAction } from "./actions";

export const dynamic = 'force-dynamic';

export default async function AdminStrokesPage() {
  const pubs = await prisma.pub.findMany({ orderBy: { order: 'asc' } });
  const players = await prisma.user.findMany({ orderBy: { name: 'asc' } });
  const recentScores = await prisma.score.findMany({
    take: 20,
    orderBy: { id: "desc" },
    include: { pub: true, user: true }
  });

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: "var(--text-primary)" }}>Log Strokes</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* LOG FORM */}
        <section className="card">
          <h2 style={{ marginBottom: '1rem', color: "var(--primary-color)" }}>Submit Score</h2>
          <form action={submitStrokeAction} style={{ display: 'flex', flexDirection: 'column' }}>
            
            <label>Select Hole (Pub)</label>
            <select name="pubId" required>
              <option value="">-- Choose Pub --</option>
              {pubs.map(p => <option key={p.id} value={p.id}>{p.order}. {p.name}</option>)}
            </select>

            <label>Select Player</label>
            <select name="userId" required>
              <option value="">-- Choose Player --</option>
              {players.map(pl => <option key={pl.id} value={pl.id}>{pl.name} ({pl.role})</option>)}
            </select>

            <label>Strokes (Score)</label>
            <input type="number" name="strokes" required min={1} placeholder="e.g. 3" />

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Log Score</button>
          </form>
        </section>

        {/* LOG HISTORY */}
        <section>
          <h2 style={{ marginBottom: '1rem' }}>Recent Submissions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {recentScores.length === 0 && <p className="card">No scores logged.</p>}
            {recentScores.map(score => (
              <div key={score.id} className="card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{score.user.name}</strong>
                  <strong style={{ color: 'var(--accent-color)' }}>{score.strokes} Strokes</strong>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Hole {score.pub.order}: {score.pub.name}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
