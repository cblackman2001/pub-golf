export default function Home() {
  return (
    <main className="container animate-fade-in">
      <h1>Pub Golf 2026</h1>
      <p>Welcome to the ultimate pub golf tracking app.</p>
      <br />
      <div className="card">
        <h2>Ready to play?</h2>
        <p>Sign in with your 4-digit PIN below.</p>
        <br />
        <a href="/login" className="btn btn-primary btn-full" style={{ textAlign: "center" }}>Enter PIN</a>
      </div>
    </main>
  );
}
