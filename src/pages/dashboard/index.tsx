import { useContext, useEffect, useState } from "react";
import type { InstallMent } from "../../models/installment";
import { supabase } from "../../utils/supabase";
import { AuthContext } from "../../providers/AuthProvider";
import { useNavigate } from "react-router";
import { Loader } from "lucide-react";

import { Card } from "./_components/card";

export default function Dashboard() {
  const navigate = useNavigate();
  const [installments, setInstallments] = useState<InstallMent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const getInstallments = async () => {
    if (!user?.id) return; // Aguarda o user carregar

    const { error, data } = await supabase
      .from("installment")
      .select()
      .eq("profile_id", user.id)
      .order("installment_number", { ascending: true });

    if (error) {
      console.error("Erro ao buscar parcelas:", error);
      return;
    }

    // Redireciona se não houver dados
    if (!data || data.length === 0) {
      navigate("/onboarding");
      return;
    }

    setInstallments(data as InstallMent[]);
    setLoading(false);
  };

  useEffect(() => {
    getInstallments();
  }, [user]); // adiciona user como dependência

  useEffect(() => {
    const databaseChannel = supabase
      .channel("database_change")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "installment" },
        (payload) => {
          const newData = payload.new as InstallMent;
          setInstallments((prevInstallments) =>
            prevInstallments.map((installment) =>
              installment.id == newData.id ? newData : installment
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(databaseChannel);
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col  items-center px-4 py-8">
      <div className="space-y-2 w-full max-w-5xl">
        <h1 className="font-semibold text-2xl">Meus carnês</h1>
        {installments.map((installment, index) => {
          // Verifica se há alguma parcela anterior ainda pendente
          const hasPreviousPending = installments
            .slice(0, index) // todas as anteriores
            .some((i) => i.statust_installment !== "paid");

          // Desabilita o botão se a atual estiver paga ou anterior estiver pendente
          const disabled =
            installment.statust_installment === "paid" || hasPreviousPending;

          return (
            <Card
              key={installment.id}
              installment={installment}
              disabled={disabled}
            />
          );
        })}
      </div>
    </div>
  );
}
