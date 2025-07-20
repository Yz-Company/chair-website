import { useEffect, useState } from "react";
import type { InstallMent } from "../../../models/installment";
import { supabase } from "../../../utils/supabase";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Loader, Trash } from "lucide-react";
import CardInstallment from "../_components/card-installment";
import { type Profile } from "../../../models/profile";
import { Button } from "../../../components/ui/button";
import DialogDeleteProfile from "../_components/dialog-delete-profile";

export default function UserPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile>();
  const [installments, setInstallments] = useState<InstallMent[]>([]);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    if (!userId) return;

    const { error, data } = await supabase
      .from("profiles")
      .select()
      .eq("id", userId);

    if (error) {
      console.log("Erro ao buscar perfil");
      return;
    }

    setProfile(data[0] as Profile);
  };

  const getInstallments = async () => {
    if (!userId) return; // Aguarda o user carregar

    const { error, data } = await supabase
      .from("installment")
      .select()
      .eq("profile_id", userId)
      .order("installment_number", { ascending: true });

    if (error) {
      console.error("Erro ao buscar parcelas:", error);
      return;
    }

    setInstallments(data as InstallMent[]);
    setLoading(false);
  };

  useEffect(() => {
    getProfile();
    getInstallments();
  }, [userId]); // adiciona user como dependência

  useEffect(() => {
    const databaseChannel = supabase
      .channel("database_change_by_user")
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
      <div className="space-y-4 w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <Button size="icon" variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>

          <DialogDeleteProfile profile={profile}>
            <Button variant="destructive">
              <Trash className="size-4" />
              <span>Deletar</span>
            </Button>
          </DialogDeleteProfile>
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold"> {profile?.username} </h3>
          <span> {profile?.phone} </span>
        </div>

        <div className="space-y-2">
          {installments.length !== 0 ? (
            <>
              {installments.map((installment) => (
                <CardInstallment
                  key={installment.id}
                  installment={installment}
                />
              ))}
            </>
          ) : (
            <>
              <p>Nenhum registro encontrado...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
