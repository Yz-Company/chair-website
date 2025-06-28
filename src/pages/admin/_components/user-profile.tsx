import { ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import type { Profile } from "../../../models/profile";
import { NavLink } from "react-router";

interface UserProfileProps {
  user: Profile;
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="w-full border p-5 rounded hover:bg-slate-100 shadow flex items-center justify-between">
      <div className="flex flex-col">
        <strong> {user.username} </strong>
        <span> {user.phone} </span>
      </div>
      <div>
        <Button variant="outline" size="sm" className="group" asChild>
          <NavLink to={`/admin/${user.id}`}>
            <ArrowRight className="size-4" />
            Ver
          </NavLink>
        </Button>
      </div>
    </div>
  );
}
