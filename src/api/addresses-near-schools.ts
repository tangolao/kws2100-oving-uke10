export async function fetchAddressesNearSchools() {
  const response = await fetch("/api/addresses-near-schools");

  if (!response.ok) {
    throw new Error("Could not fetch addresses near schools");
  }

  return await response.json();
}
