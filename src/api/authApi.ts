import { apiRequest } from "./apiClient";

export function sendSignupOtp(name: string, email: string) {
  return apiRequest("/auth/signup/send-otp", {
    method: "POST",
    body: JSON.stringify({ name, email }),
  });
}

export function verifySignupOtp(name: string, email: string, otp: string) {
  return apiRequest("/auth/signup/verify-otp", {
    method: "POST",
    body: JSON.stringify({ name, email, otp }),
  });
}

export function sendSigninOtp(email: string) {
  return apiRequest("/auth/signin/send-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifySigninOtp(email: string, otp: string) {
  return apiRequest<{ token: string }>("/auth/signin/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}
