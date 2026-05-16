import { useState, useEffect } from 'react'

const ROLES = [
  { value: 'dev',    label: 'Developer' },
  { value: 'design', label: 'Designer' },
  { value: 'pm',     label: 'Product Manager' },
  { value: 'qa',     label: 'QA Engineer' },
  { value: 'devops', label: 'DevOps' },
]

const EMPTY = { name: '', email: '', role: 'dev', dept: '' }

export default function Modal({ mode, initial, onClose, onSave }) {
  const [form, setForm]   = useState(EMPTY)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(initial || EMPTY)
    setError('')
  }, [initial])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.dept.trim()) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง')
      return
    }
    try {
      await onSave(form)
      onClose()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div style={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{mode === 'add' ? 'เพิ่มพนักงานใหม่' : 'แก้ไขข้อมูล'}</h2>
          <button style={styles.close} onClick={onClose}>✕</button>
        </div>

        {error && <p style={styles.err}>{error}</p>}

        <div style={styles.field}>
          <label style={styles.label}>ชื่อ-นามสกุล</label>
          <input style={styles.input} value={form.name} onChange={set('name')} placeholder="เช่น สมชาย ใจดี" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>อีเมล</label>
          <input style={styles.input} type="email" value={form.email} onChange={set('email')} placeholder="name@company.com" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>ตำแหน่ง</label>
          <select style={styles.input} value={form.role} onChange={set('role')}>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div style={styles.field}>
          <label style={styles.label}>แผนก</label>
          <input style={styles.input} value={form.dept} onChange={set('dept')} placeholder="เช่น Engineering" />
        </div>

        <div style={styles.footer}>
          <button style={styles.btnSecondary} onClick={onClose}>ยกเลิก</button>
          <button style={styles.btnPrimary} onClick={handleSave}>
            {mode === 'add' ? '+ เพิ่ม' : '✓ บันทึก'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  backdrop:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  modal:        { background: '#fff', borderRadius: 12, padding: '1.5rem', width: 380, maxWidth: '95vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' },
  title:        { fontSize: 17, fontWeight: 600 },
  close:        { border: 'none', background: 'none', fontSize: 18, color: '#78716c', lineHeight: 1, padding: '2px 6px', borderRadius: 6, cursor: 'pointer' },
  field:        { marginBottom: 12 },
  label:        { display: 'block', fontSize: 13, color: '#78716c', marginBottom: 5, fontWeight: 500 },
  input:        { width: '100%', padding: '8px 10px', border: '1px solid #e5e5e5', borderRadius: 7, fontSize: 14, outline: 'none' },
  footer:       { display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: '1.25rem' },
  btnSecondary: { padding: '8px 16px', border: '1px solid #e5e5e5', background: '#fff', borderRadius: 7, fontSize: 14, fontWeight: 500 },
  btnPrimary:   { padding: '8px 16px', border: 'none', background: '#2563eb', color: '#fff', borderRadius: 7, fontSize: 14, fontWeight: 500 },
  err:          { background: '#fef2f2', color: '#dc2626', fontSize: 13, padding: '8px 12px', borderRadius: 7, marginBottom: 12 },
}
