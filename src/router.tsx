import { createBrowserRouter } from "react-router";
import Home from "./pages/home";
import Auth from "./pages/auth/login";

import Dashboard from "./pages/dashboard";
import { AuthProvider } from "./providers/AuthProvider";
import OnboardingPage from "./pages/onboarding";
import { DahsboardLayout } from "./pages/dashboard/layout";

export const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Home />,
  },
  {
    path: "/login",
    element: <Auth />,
  },
  {
    path: "/",
    element: (
      <AuthProvider>
        <DahsboardLayout />
      </AuthProvider>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/onboarding",
        element: <OnboardingPage />,
      },
    ],
  },
]);
