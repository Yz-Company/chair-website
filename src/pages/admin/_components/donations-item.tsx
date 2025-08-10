import { Loader2, Trash2 } from "lucide-react";
import type { Donations } from "../../../models/donations";
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
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "../../../utils/supabase";
import { useMeta } from "../../../hooks/use-meta";

interface Props {
  donation: Donations;
  fetchDonations: () => void;
}

export function DonationItem({ donation, fetchDonations }: Props) {
  const [loading, setLoading] = useState(false);
  const { updateMetaDown } = useMeta();

  const handleDeleteDonation = async () => {
    setLoading(false);

    try {
      const { error } = await supabase
        .from("donations")
        .delete()
        .eq("id", donation.id);

      if (error) {
        toast.error("Erro ao deletar doação");
        return;
      }

      updateMetaDown(donation.amount);

      toast.success("Doação deletada com sucesso!");
      fetchDonations();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao deletar doação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 border rounded flex items-center justify-between">
      <div className="flex flex-col max-w-sm">
        <p className="font-bold">
          Valor:{" "}
          <span className="font-normal">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(donation.amount)}
          </span>{" "}
        </p>
        {donation.description && (
          <p className="text-xs truncate line-clamp-2">
            {donation.description}
          </p>
        )}
      </div>

      <Dialog>
        <DialogTrigger className="cursor-pointer">
          <Trash2 className="text-rose-400" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar doação</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja realizar esta ação?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>

            <Button onClick={handleDeleteDonation} variant={"destructive"}>
              {loading ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "Confirmar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
