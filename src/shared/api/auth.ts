const API = "http://localhost:5000";

export interface AuthResult {
  token: string;
  email: string;
}

export async function apiRegister(email: string, password: string): Promise<{ data: AuthResult | null; error: string | null }> {
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error ?? "Registration failed" };
    return { data: json, error: null };
  } catch {
    return { data: null, error: "Network error" };
  }
}

export async function apiLogin(email: string, password: string): Promise<{ data: AuthResult | null; error: string | null }> {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error ?? "Login failed" };
    return { data: json, error: null };
  } catch {
    return { data: null, error: "Network error" };
  }
}
