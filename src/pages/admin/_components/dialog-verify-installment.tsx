import { Image, Loader } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { cn } from "../../../lib/utils";
import type { InstallMent } from "../../../models/installment";
import { useState } from "react";
import { supabase } from "../../../utils/supabase";
import { toast } from "sonner";

interface DialogVerifyInstallmentProps {
  installment: InstallMent;
}

export default function DialogVerifyInstallment({
  installment,
}: DialogVerifyInstallmentProps) {
  const [loading, setLoading] = useState(false);

  const handleApproveInstallment = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("installment")
        .update({ approve: true })
        .eq("id", installment.id);

      if (error) {
        throw new Error("Erro ao aprovar carnê");
      }
      toast.success("Carnê aprovado");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao aprovar carnê");
    } finally {
      setLoading(false);
    }
  };

  const handleDisapproveInstallment = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("installment")
        .update({ approve: false })
        .eq("id", installment.id);

      if (error) {
        throw new Error("Erro ao desaprovar carnê");
      }
      toast.success("Carnê marcado como desaprovado");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao aprovar carnê");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className={cn(
            "",
            installment.approve && "bg-green-500 hover:bg-green-500/90"
          )}
        >
          {installment.approve ? "Aprovado" : "Verificar"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-start">
          <DialogTitle>Verificar carnê</DialogTitle>
          <DialogDescription>Aprove os pagamentos do carnê</DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex flex-col space-y-2">
            <span className="font-semibold">Foto do comprovante</span>
            {installment.image_url ? (
              <>
                <img src={installment.image_url} alt="Foto do comprovante" />
              </>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <Image className="opacity-80" />{" "}
                <span>Nenhuma foto registrada</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end w-full">
          {!installment.approve ? (
            <Button
              onClick={handleApproveInstallment}
              variant="outline"
              className="self-end"
            >
              {loading ? <Loader className="animate-spin" /> : "Aprovar"}
            </Button>
          ) : (
            <Button
              onClick={handleDisapproveInstallment}
              variant="destructive"
              className="self-end"
            >
              {loading ? <Loader className="animate-spin" /> : "Desaprovar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
