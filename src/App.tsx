import { Routes, Route, Navigate } from "react-router-dom";

import AuthLanding from "./auth/AuthLanding";
import SignUp from "./auth/SignUp";
import VerifyOtp from "./auth/VerifyOtp";
import SignIn from "./auth/SignIn";
import VerifySignInOtp from "./auth/VerifySignInOtp";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import ChallengeEditorPage from "./pages/ChallengeEditorPage";
import CreateChallengeListPage from "./pages/CreateChallengeListPage";
import MyChallengesPage from "./pages/MychallengesPage";
import ChallengeDetailsPage from "./pages/ChallengeDetailsPage";
import TodayMarkingPage from "./pages/TodayMarkingPage";
import ChallengeInsightsPage from "./pages/ChallengeInsightsPage";
import ChallengeCalendarPage from "./pages/ChallengeCalendar";
import { LoaderProvider } from "./components/LoaderContext";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<AuthLanding />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify-signup" element={<VerifyOtp />} />

      <Route path="/signin" element={<SignIn />} />
      <Route path="/verify-signin" element={<VerifySignInOtp />} />

      <Route
        element={
          <LoaderProvider>
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          </LoaderProvider>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateChallengeListPage />} />
        <Route path="/create/new" element={<ChallengeEditorPage />} />
        <Route path="/create/:id" element={<ChallengeEditorPage />} />
        <Route path="/my-challenges" element={<MyChallengesPage />} />
        <Route
          path="/my-challenges/challenge/:id"
          element={<ChallengeDetailsPage />}
        />
        <Route
          path="/my-challenges/challenge/:id/today"
          element={<TodayMarkingPage />}
        />
        <Route
          path="/my-challenges/challenge/:id/day/:date"
          element={<TodayMarkingPage />}
        />
        <Route
          path="/my-challenges/challenge/:id/insights"
          element={<ChallengeInsightsPage />}
        />
        <Route
          path="/my-challenges/challenge/:id/calendar"
          element={<ChallengeCalendarPage />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
