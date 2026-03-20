const BASE_URL = import.meta.env.VITE_API_URL

export const getDashboard = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message,
    };
  }

  return data;
};
