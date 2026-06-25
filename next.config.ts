import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    include: {
      team: true,
      scores: true
    }
  });

  const teams = await prisma.team.findMany({
    include: {
      users: {
        include: {
          scores: true
        }
      }
    }
  });

  // Calculate scores (lowest is best in golf!)
  const playerStats = users.map(u => ({
    id: u.id,
    name: u.name,
    team: u.team?.name || 'Solo',
    role: u.role,
    totalStrokes: u.scores.reduce((acc, score) => acc + score.strokes, 0),
    holesPlayed: u.scores.length
  })).sort((a, b) => a.totalStrokes - b.totalStrokes); // Ascending order

  const teamStats = teams.map(t => ({
    id: t.id,
    name: t.name,
    totalStrokes: t.users.reduce((teamAcc, user) => 
      teamAcc + user.scores.reduce((acc, score) => acc + score.strokes, 0)
    , 0),
    totalHolesPlayed: t.users.reduce((teamAcc, user) => teamAcc + user.scores.length, 0),
  })).sort((a, b) => a.totalStrokes - b.totalStrokes); // Ascending order

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: "var(--primary-color)", fontSize: '3rem' }}>🏆 Leaderboard</h1>
        <p style={{ color: "var(--text-secondary)" }}>Lowest strokes win the game!</p>
      </header>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Individual Standings</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {playerStats.length === 0 && <p className="card">No players yet.</p>}
          {playerStats.map((p, idx) => (
            <div key={p.id} className="card" style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '1.2rem',
              borderColor: idx === 0 ? 'var(--primary-color)' : 'var(--border-color)',
              backgroundColor: idx === 0 ? 'rgba(0, 230, 118, 0.05)' : 'var(--bg-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '30px', color: idx === 0 ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                  #{idx + 1}
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{p.name} {idx === 0 && "👑"}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Team: {p.team} | Holes: {p.holesPlayed}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary-color)', lineHeight: 1 }}>
                  {p.totalStrokes}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Strokes</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>Team Standings</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {teamStats.length === 0 && <p className="card">No teams yet.</p>}
          {teamStats.map((t, idx) => (
            <div key={t.id} className="card" style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '1.2rem',
              borderColor: idx === 0 ? 'var(--primary-color)' : 'var(--border-color)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '30px', color: idx === 0 ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                  #{idx + 1}
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{t.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Aggregate Holes: {t.totalHolesPlayed}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary-color)', lineHeight: 1 }}>
                  {t.totalStrokes}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Strokes</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
