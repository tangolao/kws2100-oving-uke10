export async function fetchGrunnskoler() {
  const response = await fetch("/api/grunnskoler");

  if (!response.ok) {
    throw new Error("Could not fetch grunnskoler");
  }

  return await response.json();
}
