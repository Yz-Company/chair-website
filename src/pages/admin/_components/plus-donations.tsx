import { Loader2, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "../../../utils/supabase";
import { useMeta } from "../../../hooks/use-meta";

export function PlusDonations() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateMetaUp } = useMeta();

  async function handleSubmit() {
    setLoading(true);
    try {
      if (amount <= 0) {
        return;
      }
      const { error } = await supabase.from("donations").insert({
        amount: amount,
        description: description,
      });

      if (error) {
        toast.error("Erro ao registrar doação");
        return;
      }

      updateMetaUp(amount);

      toast.success("Doação registrada com sucesso!");
      setOpen(false);
      setAmount(0);
      setDescription("");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao registrar doação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-full size-12">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registar doação</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                placeholder="R$ 0,00"
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Descrição</Label>
              <Textarea
                placeholder="Digite aqui uma mensagem"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button disabled={loading} onClick={handleSubmit}>
              {loading ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "Registrar"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
