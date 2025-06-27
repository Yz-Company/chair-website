import { useState } from "react";
import { supabase } from "../../utils/supabase";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:5173/dashboard",
      },
    });

    if (error) {
      toast.error("Erro ao enviar link", {
        action: {
          label: "Tentar novamente",
          onClick: () => handleLogin(),
        },
      });
    } else {
      toast.success("Verifique seu e-mail com o link de login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl border p-5 rounded-lg shadow space-y-4 ">
        <h2 className="tracking-tight font-bold text-2xl text-center">Login</h2>

        <p>Entre com seu e-mail logo abaixo</p>

        <Input
          type="email"
          autoFocus
          placeholder="john@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          size="lg"
          className="w-full cursor-pointer"
          onClick={handleLogin}
          disabled={!email || loading}
        >
          {loading ? (
            <Loader className="animate-spin" />
          ) : (
            "Enviar link para esse e-mail"
          )}
        </Button>
      </div>
    </div>
  );
}
