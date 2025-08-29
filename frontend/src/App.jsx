import { useState } from 'react'
import { ping } from './api'

export default function App() {
  const [msg, setMsg] = useState('Ready')
  const handlePing = async () => {
    try { const data = await ping(); setMsg(JSON.stringify(data)); }
    catch (e) { setMsg(e.message) }
  }
  return (
    <div style={{fontFamily:'system-ui', padding:16}}>
      <h1>Offline App (React + Laravel)</h1>
      <p>Status: {msg}</p>
      <button onClick={handlePing}>Ping API</button>
    </div>
  )
}
