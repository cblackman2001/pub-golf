import prisma from "@/lib/prisma";
import { submitStrokeAction } from "./actions";

export const dynamic = 'force-dynamic';

export default async function AdminStrokesPage() {
  const pubs = await prisma.pub.findMany({ orderBy: { order: 'asc' } });
  const players = await prisma.user.findMany({ orderBy: { name: 'asc' } });
  const loggedScores = await prisma.score.findMany({
    orderBy: [
      { pub: { order: 'asc' } },
      { user: { name: 'asc' } }
    ],
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
            <input type="number" name="strokes" required min={0} placeholder="e.g. 0" />

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Log / Update Score</button>
          </form>
        </section>

        {/* LOG HISTORY */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ marginBottom: 0 }}>All Logged Scores</h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{loggedScores.length} total</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {loggedScores.length === 0 && <p className="card">No scores logged.</p>}
            {loggedScores.map(score => (
              <form key={score.id} action={submitStrokeAction} className="card" style={{ padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'end' }}>
                <input type="hidden" name="pubId" value={score.pubId} />
                <input type="hidden" name="userId" value={score.userId} />
                <div style={{ flex: '1 1 150px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Hole {score.pub.order}</div>
                  <strong>{score.pub.name}</strong>
                </div>
                <div style={{ flex: '1 1 120px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Player</div>
                  <strong>{score.user.name}</strong>
                </div>
                <div style={{ width: '95px' }}>
                  <label htmlFor={`strokes-${score.id}`} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Strokes</label>
                  <input id={`strokes-${score.id}`} type="number" name="strokes" required min={0} defaultValue={score.strokes} style={{ margin: 0, padding: '0.45rem 0.6rem' }} />
                </div>
                <button type="submit" className="btn btn-secondary" style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}>Save</button>
              </form>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
