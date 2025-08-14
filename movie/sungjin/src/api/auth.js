const API = import.meta.env.VITE_API_BASE;

export const register = (body) =>
  fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(async r => (r.ok ? r.json() : Promise.reject(await r.json())));

export const login = (body) =>
  fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(async r => (r.ok ? r.json() : Promise.reject(await r.json())));