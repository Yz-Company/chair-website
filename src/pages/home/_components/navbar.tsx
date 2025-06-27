import { HandCoins } from "lucide-react";
import { supabase } from "../../../utils/supabase";
import { useNavigate } from "react-router";

export function Navbar() {
  const navigate = useNavigate();
  async function handleNavigate() {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      navigate("/login");
      return;
    }

    navigate("/dashboard");
  }

  return (
    <nav className="flex w-full items-center justify-between py-2 px-4">
      <div>
        <img className="w-fit h-8 object-cover" src="logo-sara.png" alt="" />
      </div>

      <button
        className="bg-black hover:bg-black/80 cursor-pointer flex justify-end items-center gap-2 p-2 pl-6 rounded-[40px]"
        onClick={handleNavigate}
      >
        <p className="font-semibold text-white text-sm">Doar</p>

        <HandCoins className="bg-[#f0f0f0] p-1 rounded-full size-6" />
      </button>
    </nav>
  );
}
