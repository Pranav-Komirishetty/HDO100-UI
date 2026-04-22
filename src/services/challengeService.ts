const BASE_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getChallengeDetails(id: string) {
  const res = await fetch(`${BASE_URL}/challenges/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message,
    };
  }

  return data;
}

export async function createDraftChallenge(data: any) {
  const res = await fetch(`${BASE_URL}/challenges`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: result.message,
    };
  }

  return result;
}

export async function updateDraftChallenge(id: string, data: any) {
  const res = await fetch(`${BASE_URL}/challenges/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: result.message,
    };
  }

  return result;
}

export async function startChallenge(id: string) {
  const res = await fetch(`${BASE_URL}/challenges/${id}/start`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message,
    };
  }

  return data;
}

export async function deleteChallenge(id: string) {
  const res = await fetch(`${BASE_URL}/challenges/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message,
    };
  }

  return data;
}

export async function getDraftChallenges() {
  const res = await fetch(`${BASE_URL}/challenges?status=draft`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message,
    };
  }

  return data;
}

export async function getAllChallenges() {
  const res = await fetch(`${BASE_URL}/challenges`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message,
    };
  }

  return data;
}

export async function saveTodayLog(id: string, body: any) {
  const res = await fetch(`${BASE_URL}/challenges/${id}/log`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message,
    };
  }

  return data;
}

export async function getTodaysTasks(id: string) {
  const res = await fetch(`${BASE_URL}/challenges/${id}/today`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message || "Something went wrong",
    };
  }

  return data;
}

export async function getTasksByDate(id: string, date: string) {
  const res = await fetch(`${BASE_URL}/challenges/${id}/day/${date}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message || "Something went wrong",
    };
  }

  return data;
}

export async function setAsDefaultChallenge(id: string) {
  const res = await fetch(`${BASE_URL}/challenges/${id}/default`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message,
    };
  }

  return data;
}

export async function getChallengeAnalytics(id: string) {
  const res = await fetch(`${BASE_URL}/challenges/${id}/analytics`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message,
    };
  }

  return data;
}

export async function getCalendar(id: string) {
  const res = await fetch(`${BASE_URL}/challenges/${id}/calendar`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.message,
    };
  }

  return data;
}
