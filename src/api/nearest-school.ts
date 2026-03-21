export async function fetchNearestSchool() {
  const response = await fetch("/api/nearest-school");

  if (!response.ok) {
    throw new Error("Could not fetch nearest school");
  }

  return await response.json();
}
