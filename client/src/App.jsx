import { useState, useRef } from 'react'
import { useEmployees } from './hooks/useEmployees'
import Modal from './components/Modal'

const ROLE_LABEL = { dev: 'Developer', design: 'Designer', pm: 'Product Manager', qa: 'QA Engineer', devops: 'DevOps' }
const ROLE_COLOR = {
  dev:    { bg: '#eff6ff', text: '#1d4ed8' },
  design: { bg: '#fdf2f8', text: '#9d174d' },
  pm:     { bg: '#f0fdf4', text: '#15803d' },
  qa:     { bg: '#fffbeb', text: '#b45309' },
  devops: { bg: '#f5f3ff', text: '#6d28d9' },
}

function initials(name) {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

export default function App() {
  const { employees, loading, error, fetchAll, create, update, remove } = useEmployees()
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(null)   // null | { mode, initial }
  const [deleting, setDeleting] = useState(null)
  const searchRef = useRef()

  const handleSearch = (e) => {
    setSearch(e.target.value)
    fetchAll(e.target.value)
  }

  const openAdd  = () => setModal({ mode: 'add', initial: null })
  const openEdit = (emp) => setModal({ mode: 'edit', initial: emp })

  const handleSave = async (form) => {
    if (modal.mode === 'add') {
      await create(form)
    } else {
      await update(modal.initial.id, form)
    }
    fetchAll(search)
  }

  const handleDelete = async (emp) => {
    if (!window.confirm(`ลบ "${emp.name}" ใช่ไหม?`)) return
    setDeleting(emp.id)
    try {
      await remove(emp.id)
      fetchAll(search)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.topbar}>
        <div style={s.brand}>
          <span style={s.brandIcon}>👥</span>
          <span style={s.brandName}>Employee CRUD</span>
        </div>
        <span style={s.counter}>{employees.length} คน</span>
      </div>

      {/* Main card */}
      <div style={s.card}>
        {/* Toolbar */}
        <div style={s.toolbar}>
          <input
            ref={searchRef}
            style={s.search}
            placeholder="🔍  ค้นหาชื่อ, อีเมล, แผนก…"
            value={search}
            onChange={handleSearch}
          />
          <button style={s.btnAdd} onClick={openAdd}>+ เพิ่มพนักงาน</button>
        </div>

        {/* Error */}
        {error && <div style={s.errBar}>{error}</div>}

        {/* Table */}
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>พนักงาน</th>
                <th style={s.th}>ตำแหน่ง</th>
                <th style={s.th}>แผนก</th>
                <th style={{ ...s.th, textAlign: 'right' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={4} style={s.empty}>กำลังโหลด…</td></tr>
              )}
              {!loading && employees.length === 0 && (
                <tr><td colSpan={4} style={s.empty}>ไม่พบข้อมูล</td></tr>
              )}
              {!loading && employees.map(emp => {
                const rc = ROLE_COLOR[emp.role] || ROLE_COLOR.dev
                return (
                  <tr key={emp.id} style={s.row}>
                    <td style={s.td}>
                      <div style={s.person}>
                        <div style={s.avatar}>{initials(emp.name)}</div>
                        <div>
                          <div style={s.name}>{emp.name}</div>
                          <div style={s.email}>{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, background: rc.bg, color: rc.text }}>
                        {ROLE_LABEL[emp.role] || emp.role}
                      </span>
                    </td>
                    <td style={{ ...s.td, color: '#78716c' }}>{emp.dept}</td>
                    <td style={{ ...s.td, textAlign: 'right' }}>
                      <button style={s.btnEdit} onClick={() => openEdit(emp)}>แก้ไข</button>
                      <button
                        style={{ ...s.btnDel, opacity: deleting === emp.id ? 0.5 : 1 }}
                        onClick={() => handleDelete(emp)}
                        disabled={deleting === emp.id}
                      >ลบ</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <Modal
          mode={modal.mode}
          initial={modal.initial}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

const s = {
  page:     { minHeight: '100vh', background: '#f5f5f4', padding: '0 0 3rem' },
  topbar:   { background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '0 2rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  brand:    { display: 'flex', alignItems: 'center', gap: 8 },
  brandIcon:{ fontSize: 20 },
  brandName:{ fontWeight: 700, fontSize: 16 },
  counter:  { fontSize: 13, color: '#78716c', background: '#f5f5f4', padding: '3px 12px', borderRadius: 20, border: '1px solid #e5e5e5' },
  card:     { maxWidth: 860, margin: '2rem auto', background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5', overflow: 'hidden' },
  toolbar:  { display: 'flex', gap: 10, padding: '1rem 1.25rem', borderBottom: '1px solid #e5e5e5' },
  search:   { flex: 1, padding: '8px 12px', border: '1px solid #e5e5e5', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fafaf9' },
  btnAdd:   { padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap' },
  errBar:   { background: '#fef2f2', color: '#dc2626', padding: '10px 1.25rem', fontSize: 14, borderBottom: '1px solid #fecaca' },
  tableWrap:{ overflowX: 'auto' },
  table:    { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th:       { padding: '10px 1rem', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#78716c', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e5e5', background: '#fafaf9' },
  row:      { borderBottom: '1px solid #f5f5f4' },
  td:       { padding: '12px 1rem', verticalAlign: 'middle' },
  person:   { display: 'flex', alignItems: 'center', gap: 10 },
  avatar:   { width: 34, height: 34, borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 },
  name:     { fontWeight: 600, fontSize: 14 },
  email:    { fontSize: 12, color: '#78716c', marginTop: 1 },
  badge:    { fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 500 },
  btnEdit:  { padding: '5px 12px', border: '1px solid #e5e5e5', background: '#fff', borderRadius: 6, fontSize: 13, marginRight: 6, fontWeight: 500 },
  btnDel:   { padding: '5px 12px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', borderRadius: 6, fontSize: 13, fontWeight: 500 },
  empty:    { textAlign: 'center', padding: '2.5rem', color: '#78716c', fontSize: 14 },
}
