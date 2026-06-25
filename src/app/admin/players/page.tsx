import prisma from "@/lib/prisma";
import { createTeamAction, createPlayerAction, deleteTeamAction, deletePlayerAction, updatePlayerTeamAction } from "./actions";

export const dynamic = 'force-dynamic';

export default async function AdminPlayersPage() {
  const teams = await prisma.team.findMany({ include: { users: true } });
  const players = await prisma.user.findMany({ include: { team: true } });

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: "var(--text-primary)" }}>Manage Players & Teams</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* TEAMS */}
        <div>
          <section className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: "var(--primary-color)" }}>Add Team</h2>
            <form action={createTeamAction} style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" name="name" required placeholder="Team Name" style={{ margin: 0 }} />
              <button type="submit" className="btn btn-primary">Create</button>
            </form>
          </section>

          <section>
            <h2 style={{ marginBottom: '1rem' }}>Teams List</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {teams.length === 0 && <p className="card">No teams yet.</p>}
              {teams.map(team => (
                <div key={team.id} className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong>{team.name}</strong>
                    <form action={async () => { "use server"; await deleteTeamAction(team.id); }}>
                      <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', color: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>Delete</button>
                    </form>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Members: {team.users.length === 0 ? "None" : team.users.map(u => u.name).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* PLAYERS */}
        <div>
          <section className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: "var(--primary-color)" }}>Add Player / Admin</h2>
            <form action={createPlayerAction} style={{ display: 'flex', flexDirection: 'column' }}>
              <label>Name</label>
              <input type="text" name="name" required />

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label>Role</label>
                  <select name="role" required>
                    <option value="PLAYER">Player</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label>Assign Team</label>
                  <select name="teamId">
                    <option value="">No Team</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <label>4-Digit PIN</label>
              <input type="text" name="pin" required pattern="[0-9]{4}" placeholder="e.g. 1234" maxLength={4} />

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Player</button>
            </form>
          </section>

          <section>
            <h2 style={{ marginBottom: '1rem' }}>Players List</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {players.map(player => (
                <div key={player.id} className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <strong>{player.name}</strong> <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>({player.role})</span>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>PIN: {player.pin}</div>
                    </div>
                    {player.pin !== "0000" && (
                      <form action={async () => { "use server"; await deletePlayerAction(player.id); }}>
                        <button className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', color: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>Delete</button>
                      </form>
                    )}
                  </div>
                  
                  <form action={updatePlayerTeamAction} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                    <input type="hidden" name="userId" value={player.id} />
                    <select name="teamId" defaultValue={player.teamId || ""} style={{ margin: 0, padding: '0.3rem', fontSize: '0.85rem' }}>
                      <option value="">No Team</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <button type="submit" className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}>Move</button>
                  </form>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
