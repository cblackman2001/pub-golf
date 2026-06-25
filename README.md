"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { useState } from "react";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [pinInput, setPinInput] = useState("");

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // keep only numbers
    if (val.length <= 4) {
      setPinInput(val);
    }
  };

  return (
    <main className="container animate-fade-in" style={{ maxWidth: '400px', marginTop: '10vh' }}>
      <div className="card" style={{ textAlign: "center" }}>
        <h2>Sign In</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Enter your 4-digit PIN to access Pub Golf.
        </p>

        <form action={formAction}>
          <input
            type="password"
            name="pin"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="••••"
            value={pinInput}
            onChange={handlePinChange}
            style={{ fontSize: "2rem", textAlign: "center", letterSpacing: "10px" }}
            required
            autoFocus
          />

          {state?.error && (
            <div style={{ color: "var(--accent-color)", marginBottom: "1rem", fontWeight: 600 }}>
              {state.error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-full" 
            disabled={isPending || pinInput.length !== 4}
          >
            {isPending ? "Signing in..." : "Join Game"}
          </button>
        </form>
      </div>
    </main>
  );
}
