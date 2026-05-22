const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://events-startup-project-api.onrender.com/";

export default function api(route) {
  return `${API_BASE_URL}/api${route}`;
}