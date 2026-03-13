const API = NEXT_API;

export async function getUsers() {
  const response = await fetch(`${API}/Customer`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}