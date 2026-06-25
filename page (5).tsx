import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <div style={{ backgroundColor: 'var(--primary-color)', color: '#000', padding: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>
        🛡️ ADMIN MODE
      </div>
      <div className="container" style={{ flex: 1, paddingBottom: '4rem' }}>
        <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <Link href="/admin" className="btn btn-secondary">Overview</Link>
          <Link href="/admin/pubs" className="btn btn-secondary">Pubs</Link>
          <Link href="/admin/players" className="btn btn-secondary">Players & Teams</Link>
          <Link href="/admin/strokes" className="btn btn-secondary">Log Strokes</Link>
          <Link href="/pubs" className="btn btn-primary">Exit Admin</Link>
        </nav>
        {children}
      </div>
    </div>
  );
}
