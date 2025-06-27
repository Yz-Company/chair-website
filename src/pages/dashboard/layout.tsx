import { Outlet } from "react-router";

export function DahsboardLayout() {
  return (
    <div className="min-h-screen">
      <title>Chair | Sara nossa Terra</title>
      <Outlet />
    </div>
  );
}
