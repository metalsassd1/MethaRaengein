# 👥 Employee CRUD App

React + Express (Node.js) ในโฟลเดอร์เดียวกัน

## โครงสร้างโปรเจกต์

```
crud-app/
├── server.js              ← Express API (port 3001)
├── package.json           ← scripts + dependencies ทั้งหมด
├── node_modules/
└── client/                ← React app (Vite)
    ├── index.html
    ├── vite.config.js     ← proxy /api → localhost:3001
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx
        ├── hooks/
        │   └── useEmployees.js   ← fetch GET/POST/PUT/DELETE
        └── components/
            └── Modal.jsx         ← ฟอร์ม Add / Edit
```

## วิธีรัน

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. รันทั้งสองพร้อมกัน (dev mode)
npm run dev
```

เปิดเบราว์เซอร์ไปที่ **http://localhost:5173**

> Vite จะ proxy `/api/*` → `http://localhost:3001` อัตโนมัติ

## API Endpoints

| Method | Path                  | คำอธิบาย                        |
|--------|-----------------------|---------------------------------|
| GET    | /api/employees        | ดึงทั้งหมด (รองรับ ?search=...) |
| GET    | /api/employees/:id    | ดึงรายเดียว                     |
| POST   | /api/employees        | สร้างใหม่                        |
| PUT    | /api/employees/:id    | แก้ไข                            |
| DELETE | /api/employees/:id    | ลบ                               |

## ทดสอบ API ด้วย curl

```bash
# GET ทั้งหมด
curl http://localhost:3001/api/employees

# POST สร้างใหม่
curl -X POST http://localhost:3001/api/employees \
  -H "Content-Type: application/json" \
  -d '{"name":"ทดสอบ คนใหม่","email":"test@example.com","role":"dev","dept":"Engineering"}'

# PUT แก้ไข id=1
curl -X PUT http://localhost:3001/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"สมชาย แก้ไขแล้ว","email":"somchai@example.com","role":"dev","dept":"Engineering"}'

# DELETE ลบ id=1
curl -X DELETE http://localhost:3001/api/employees/1
```
