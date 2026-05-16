const BASE = "/api/employees";

export const api = {
  getAll: (q = "") =>
    fetch(`${BASE}${q ? `?q=${encodeURIComponent(q)}` : ""}`).then((r) => r.json()),

  create: (data) =>
    fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  update: (id, data) =>
    fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  remove: (id) =>
    fetch(`${BASE}/${id}`, { method: "DELETE" }).then((r) => r.json()),
};
