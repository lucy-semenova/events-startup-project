const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export default function api(route) {
  return `${API_BASE_URL}/api${route}`;
}