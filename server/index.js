const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory data store
let employees = [
  { id: 1, name: "สมชาย ใจดี", email: "somchai@example.com", role: "dev", dept: "Engineering" },
  { id: 2, name: "มาลี สวยงาม", email: "malee@example.com", role: "design", dept: "Product" },
  { id: 3, name: "วิชัย เก่งมาก", email: "wichai@example.com", role: "pm", dept: "Product" },
  { id: 4, name: "นิตยา รักงาน", email: "nittaya@example.com", role: "qa", dept: "Engineering" },
];
let nextId = 5;

// GET all employees (with optional search query)
app.get("/api/employees", (req, res) => {
  const { q } = req.query;
  let result = employees;
  if (q) {
    const term = q.toLowerCase();
    result = employees.filter(
      (e) =>
        e.name.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.dept.toLowerCase().includes(term)
    );
  }
  res.json(result);
});

// GET single employee
app.get("/api/employees/:id", (req, res) => {
  const emp = employees.find((e) => e.id === Number(req.params.id));
  if (!emp) return res.status(404).json({ error: "ไม่พบข้อมูล" });
  res.json(emp);
});

// POST create employee
app.post("/api/employees", (req, res) => {
  const { name, email, role, dept } = req.body;
  if (!name || !email || !role || !dept) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบ" });
  }
  const emp = { id: nextId++, name, email, role, dept };
  employees.push(emp);
  res.status(201).json(emp);
});

// PUT update employee
app.put("/api/employees/:id", (req, res) => {
  const idx = employees.findIndex((e) => e.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "ไม่พบข้อมูล" });
  const { name, email, role, dept } = req.body;
  if (!name || !email || !role || !dept) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบ" });
  }
  employees[idx] = { id: employees[idx].id, name, email, role, dept };
  res.json(employees[idx]);
});

// DELETE employee
app.delete("/api/employees/:id", (req, res) => {
  const idx = employees.findIndex((e) => e.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "ไม่พบข้อมูล" });
  employees.splice(idx, 1);
  res.json({ message: "ลบสำเร็จ" });
});

app.listen(PORT, () => {
  console.log(`✅  Server running at http://localhost:${PORT}`);
});
