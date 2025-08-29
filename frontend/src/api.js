export async function ping() {
  const res = await fetch('/api/ping');
  if (!res.ok) throw new Error('Ping failed');
  return res.json();
}
