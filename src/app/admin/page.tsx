import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const usersCount = await prisma.user.count();
  const pubsCount = await prisma.pub.count();
  const teamsCount = await prisma.team.count();
  const strokesCount = await prisma.score.count();

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: "var(--text-primary)" }}>Dashboard Overview</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}>{pubsCount}</h2>
          <p style={{ color: "var(--text-secondary)", fontWeight: 'bold' }}>Holes (Pubs)</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}>{playersCount(usersCount)}</h2>
          <p style={{ color: "var(--text-secondary)", fontWeight: 'bold' }}>Players</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}>{teamsCount}</h2>
          <p style={{ color: "var(--text-secondary)", fontWeight: 'bold' }}>Teams</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-color)' }}>{strokesCount}</h2>
          <p style={{ color: "var(--text-secondary)", fontWeight: 'bold' }}>Scores Logged</p>
        </div>
      </div>
    </div>
  );
}

function playersCount(total: number) {
  // admin minus 1 roughly if 1 admin, but this is just a quick stat
  return total;
}
