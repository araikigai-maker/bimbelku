export function isAdmin() {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("user");
  if (!stored) return false;
  try {
    const user = JSON.parse(stored);
    return user?.role === "ADMIN";
  } catch {
    return false;
  }
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
