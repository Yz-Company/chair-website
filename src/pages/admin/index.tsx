import { useEffect, useMemo, useState } from "react";
import type { Profile } from "../../models/profile";
import { supabase } from "../../utils/supabase";
import { Loader, Plus } from "lucide-react";
import UserProfile from "./_components/user-profile";
import { useMeta } from "../../hooks/use-meta";
import { Input } from "../../components/ui/input";
import { DialogCreateProfile } from "./_components/dialog-create-profile";
import { Button } from "../../components/ui/button";
import { TabsAdmin, type Tabs } from "./_components/tabs";
import { PlusDonations } from "./_components/plus-donations";
import { type Donations } from "../../models/donations";
import { DonationItem } from "./_components/donations-item";

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [donations, setDonations] = useState<Donations[]>([]);
  const [loading, setLoading] = useState(true);
  const { goalData, progressPercentage } = useMeta();
  const [tab, setTab] = useState<Tabs>("profiles");
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
  };

  const getDonations = async () => {
    const { error, data } = await supabase
      .from("donations")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Erro ao buscar doações", error);
      return;
    }

    console.log(data);

    setDonations(data as Donations[]);
  };

  async function fetchData() {
    const profilesDataPromise = getProfiles();
    const donationsDataPromise = getDonations();

    await Promise.all([profilesDataPromise, donationsDataPromise]);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const databaseProfileChannel = supabase
      .channel("database_inser_new_user")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        (payload) => {
          const newProfile = payload.new as Profile;

          // Previne perfis duplicados
          setProfiles((prev) => {
            const exists = prev.some((p) => p.id === newProfile.id);
            return exists ? prev : [newProfile, ...prev];
          });
        }
      )
      .subscribe();

    const databaseDonationsChannel = supabase
      .channel("database_inser_new_donations")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "donations" },
        (payload) => {
          const newDonations = payload.new as Donations;

          // Previne perfis duplicados
          setDonations((prev) => {
            const exists = prev.some((p) => p.id === newDonations.id);
            return exists ? prev : [...prev, newDonations];
          });
        }
      )
      .subscribe();

    return () => {
      databaseProfileChannel.unsubscribe(); // <- mais seguro que removeChannel
      databaseDonationsChannel.unsubscribe(); // <- mais seguro que removeChannel
    };
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h1 className="font-semibold text-2xl">Usuários</h1>
          <div className="flex items-center justify-center gap-2">
            <Input
              className="w-64"
              placeholder="Pesquisar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <DialogCreateProfile>
              <Button>
                <Plus className="size-3" />
                <span className="hidden md:block">Criar usuário</span>
              </Button>
            </DialogCreateProfile>
          </div>
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

        {/* Tabs */}
        <TabsAdmin tabSelected={tab} setTab={setTab} />
        {/* Lista de usuários */}
        {tab === "profiles" ? (
          filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <UserProfile key={profile.id} user={profile} />
            ))
          ) : (
            <div>
              <span>Nenhuma usuário cadastrado...</span>
            </div>
          )
        ) : (
          donations.map((donation) => (
            <DonationItem
              key={donation.id}
              donation={donation}
              fetchDonations={getDonations}
            />
          ))
        )}
      </div>
      <PlusDonations />
    </div>
  );
}
