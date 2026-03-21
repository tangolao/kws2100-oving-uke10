export async function fetchNearestSchool(lon: number, lat: number) {
  const response = await fetch(`/api/nearest-school?lon=${lon}&lat=${lat}`);

  if (!response.ok) {
    throw new Error("Could not fetch nearest school");
  }

  return await response.json();
}
