import { useEffect, useMemo, useState } from "react";
import type { Profile } from "../../models/profile";
import { supabase } from "../../utils/supabase";
import { Loader } from "lucide-react";
import UserProfile from "./_components/user-profile";
import { useMeta } from "../../hooks/use-meta";
import { Input } from "../../components/ui/input";

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { goalData, progressPercentage } = useMeta();
  const [search, setSearch] = useState("");

  const getProfiles = async () => {
    const { error, data } = await supabase
      .from("profiles")
      .select()
      .order("username", { ascending: true });

    if (error) {
      console.log("Erro ao buscar usuários", error);
      return;
    }

    setProfiles(data as Profile[]);
    setLoading(false);
  };

  useEffect(() => {
    getProfiles();
  }, []);

  // Filtrar os perfis
  const filteredProfiles = useMemo(() => {
    return profiles.filter((user) => {
      const username = user.username ?? "";
      return username.toLowerCase().includes(search.toLowerCase());
    });
  }, [search, profiles]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-8">
      <div className="space-y-4 w-full max-w-5xl">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <h1 className="font-semibold text-2xl">Usuários</h1>
          <Input
            className="w-96"
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {goalData && (
          <>
            <div className="w-full flex flex-col gap-4 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <span>Objetivo: </span>
                  <span>
                    {" "}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(goalData.totalGoal)}{" "}
                  </span>
                </div>
                <div>
                  <span>Valor atual: </span>
                  <span>
                    {" "}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(goalData.currentAmount)}{" "}
                  </span>
                </div>
              </div>

              <div className="h-4 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${progressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </>
        )}
        {filteredProfiles.length > 0 ? (
          filteredProfiles.map((profile) => (
            <UserProfile key={profile.id} user={profile} />
          ))
        ) : (
          <div>
            <span>Nenhuma usuário cadastrado...</span>
          </div>
        )}
      </div>
    </div>
  );
}
