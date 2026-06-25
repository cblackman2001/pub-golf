import prisma from "@/lib/prisma";
import DynamicMap from "@/components/DynamicMap";
import { getUser } from "@/lib/auth";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function PubsPage() {
  const user = await getUser();
  const pubs = await prisma.pub.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: "var(--primary-color)" }}>Pub Timeline</h1>
          <p style={{ color: "var(--text-secondary)" }}>View the route and challenge details.</p>
        </div>
        {user?.role === "ADMIN" && (
          <Link href="/admin" className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>Admin Dashboard</Link>
        )}
      </header>

      {pubs.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <h2>No Pubs Yet</h2>
          <p>The admin hasn&apos;t added any pubs to the route yet!</p>
        </div>
      ) : (
        <>
          <DynamicMap pubs={pubs} />

          <div style={{ marginTop: "2rem" }}>
            <h2>The Agenda 🍻</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              {pubs.map((pub) => (
                <div key={pub.id} className="card" style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{ 
                    backgroundColor: "var(--primary-color)", 
                    color: "#000", 
                    fontWeight: "bold",
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "50%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "1.2rem"
                  }}>
                    {pub.order}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: "0.2rem" }}>{pub.name}</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "0.8rem" }}>
                      {pub.description}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${pub.lat},${pub.lng}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                        📍 Google Maps
                      </a>
                      <a href={`http://maps.apple.com/?ll=${pub.lat},${pub.lng}&q=${encodeURIComponent(pub.name)}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                        🍏 Apple Maps
                      </a>
                    </div>
                    <div style={{ backgroundColor: "var(--bg-card-hover)", padding: "0.8rem", borderRadius: "8px", borderLeft: "4px solid var(--accent-color)" }}>
                      <strong style={{ display: "block", marginBottom: "0.3rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--accent-color)" }}>
                        Challenge / Penalty
                      </strong>
                      <span style={{ fontSize: "0.95rem" }}>{pub.challenge}</span>
                    </div>
                  </div>
                  <div>
                    <Link href={`/pubs/${pub.id}`} className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
