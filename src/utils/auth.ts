import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  email: string;
  exp: number;
  iat: number;
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
}
