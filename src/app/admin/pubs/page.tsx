import prisma from "@/lib/prisma";
import { createPubAction, deletePubAction } from "./actions";

export const dynamic = 'force-dynamic';

export default async function AdminPubsPage() {
  const pubs = await prisma.pub.findMany({ orderBy: { order: 'asc' } });

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: "var(--text-primary)" }}>Manage Pubs</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* ADD PUB FORM */}
        <section className="card">
          <h2 style={{ marginBottom: '1rem', color: "var(--primary-color)" }}>Add New Pub</h2>
          <form action={async (fd) => { "use server"; await createPubAction(fd); }} style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Name</label>
            <input type="text" name="name" required placeholder="The Red Lion" />

            <label>Timeline / Description</label>
            <textarea name="description" required placeholder="7:00 PM - 7:45 PM" />

            <label>Challenge / Penalty</label>
            <input type="text" name="challenge" required placeholder="+1 stroke if spilled" />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label>Order / Hole #</label>
                <input type="number" name="order" required defaultValue={pubs.length + 1} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Latitude</label>
                <input type="number" step="any" name="lat" required placeholder="51.520..." />
              </div>
              <div style={{ flex: 1 }}>
                <label>Longitude</label>
                <input type="number" step="any" name="lng" required placeholder="-0.100..." />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Pub</button>
          </form>
        </section>

        {/* LIST PUBS */}
        <section>
          <h2 style={{ marginBottom: '1rem' }}>Existing Route</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {pubs.length === 0 && <p className="card">No pubs created yet.</p>}
            {pubs.map(pub => (
              <div key={pub.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                <div>
                  <strong>{pub.order}. {pub.name}</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Lat: {pub.lat}, Lng: {pub.lng}</div>
                </div>
                <form action={async () => {
                  "use server";
                  await deletePubAction(pub.id);
                }}>
                  <button type="submit" className="btn btn-secondary" style={{ color: 'var(--accent-color)', borderColor: 'var(--accent-color)' }}>Delete</button>
                </form>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
