import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/auth";
import { uploadPhotoAction, deletePhotoAction } from "./actions";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function PubDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const pubId = resolvedParams.id;
  
  const user = await getUser();
  const isAdmin = user?.role === "ADMIN";

  const pub = await prisma.pub.findUnique({
    where: { id: pubId },
    include: {
      photos: true,
      scores: {
        include: { user: true },
        orderBy: { strokes: 'asc' }
      }
    }
  });

  if (!pub) return notFound();

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/pubs" className="btn btn-secondary" style={{ marginBottom: '1rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>&larr; Back to Map</Link>
        <h1 style={{ color: "var(--primary-color)" }}>Hole {pub.order}: {pub.name}</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>{pub.description}</p>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a href={`https://www.google.com/maps/search/?api=1&query=${pub.lat},${pub.lng}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
            📍 Google Maps
          </a>
          <a href={`http://maps.apple.com/?ll=${pub.lat},${pub.lng}&q=${encodeURIComponent(pub.name)}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
            🍏 Apple Maps
          </a>
        </div>
      </header>

      <section className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--accent-color)' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: "var(--accent-color)" }}>Challenge / Penalty</h2>
        <p>{pub.challenge}</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Scores Logged</h2>
        {pub.scores.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No strokes logged for this hole yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {pub.scores.map(s => (
              <div key={s.id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>{s.user.name}</span>
                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{s.strokes} Strokes</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Memories</h2>
        </div>

        {isAdmin && (
          <form action={async (fd) => { "use server"; await uploadPhotoAction(fd); }} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <input type="hidden" name="pubId" value={pub.id} />
            <input type="file" name="file" accept="image/*" required style={{ margin: 0, padding: '0.5rem' }} />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Upload</button>
          </form>
        )}

        {pub.photos.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No photos uploaded yet. Admins can upload memories here.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {pub.photos.map(p => (
              <div key={p.id} style={{ borderRadius: '8px', overflow: 'hidden', height: '150px', backgroundColor: 'var(--bg-card)', position: 'relative' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt="Pub Memory" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {isAdmin && (
                  <form action={async () => { "use server"; await deletePhotoAction(p.id, pub.id); }} style={{ position: 'absolute', top: '5px', right: '5px' }}>
                    <button type="submit" style={{ backgroundColor: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>X</button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
