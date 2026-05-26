"use client";

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout API failed", err);
    }
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
    >
      Keluar
    </button>
  );
}
