import { useState, useEffect, useCallback } from 'react'

const API = '/api/employees'

export function useEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const fetchAll = useCallback(async (search = '') => {
    setLoading(true)
    setError(null)
    try {
      const url = search ? `${API}?search=${encodeURIComponent(search)}` : API
      const res  = await fetch(url)
      const data = await res.json()
      setEmployees(data)
    } catch (e) {
      setError('โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }, [])

  const create = async (body) => {
    const res  = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    return data
  }

  const update = async (id, body) => {
    const res  = await fetch(`${API}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    return data
  }

  const remove = async (id) => {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('ลบไม่สำเร็จ')
  }

  useEffect(() => { fetchAll() }, [fetchAll])

  return { employees, loading, error, fetchAll, create, update, remove }
}
