//const BASE_URL = "http://192.168.29.69:4000"; //winnie
//const BASE_URL = "http://192.168.0.141:4000"; //tuffy
//const BASE_URL = "http://192.168.137.1:4000"; //s24
//VITE_API_URL=https://hdo100-be-qa.onrender.com https://hdo100-be-qa.onrender.com
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
