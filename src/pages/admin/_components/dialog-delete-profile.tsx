import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import type { Profile } from "../../../models/profile";
import { supabase } from "../../../utils/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

interface DialogDeleteProfileProps {
  children: React.ReactNode;
  profile?: Profile;
}

export default function DialogDeleteProfile({
  children,
  profile,
}: DialogDeleteProfileProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleDeleteProfile = async () => {
    if (!profile) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profile.id);

      if (error) {
        toast.error("Erro ao deletar perfil.");
        console.error(error);
        return;
      }

      toast.success("Perfil deletado com sucesso!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Deletar usuário <strong> {profile?.username} </strong>{" "}
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja realizar esta ação?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>

          <Button onClick={handleDeleteProfile} variant={"destructive"}>
            {loading ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
