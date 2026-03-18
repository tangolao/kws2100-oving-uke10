export async function fetchGrunnskoler() {
  const response = await fetch("/api/grunnskoler");
  if (!response.ok) {
    throw new Error(`Failed to fetch grunnskoler: ${response.status}`);
  }
  return await response.json();
}
