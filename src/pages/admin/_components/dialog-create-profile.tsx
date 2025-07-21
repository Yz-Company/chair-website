import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { applyMask } from "../../../lib/apply-mask-phone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Loader } from "lucide-react";
import { supabase } from "../../../utils/supabase";
import { toast } from "sonner";
import type { Profile } from "../../../models/profile";

export function DialogCreateProfile({
  children,
  cb,
}: {
  children: React.ReactNode;
  cb: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [chairQuantity, setChairQuantity] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(300);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Create
      const { error, data } = await supabase
        .from("profiles")
        .insert({ username: name, phone: phone })
        .select();

      if (error) {
        toast.error("Erro ao criar usuário!");
        return;
      }

      const newUser: Profile = data[0] as Profile;

      // Run create installments
      const { error: ErrorFunction } = await supabase.rpc(
        "insert_installments",
        {
          profileid: newUser.id,
          quantity: quantity,
          value: Number((price / quantity).toFixed(2)),
        }
      );

      if (ErrorFunction) {
        console.log(ErrorFunction.message);
        return;
      }

      toast.success("Usuário cadastrado com sucesso!");
      setOpen(false); // fecha o modal

      // resetar os estados
      cb();
      setName("");
      setPhone("");
      setChairQuantity(1);
      setQuantity(1);
      setPrice(300);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar usuário</DialogTitle>
          <DialogDescription>Crie seus usuário manualmente</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                autoFocus
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {/* Phone */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                placeholder="(XX) XXXXX-XXXX"
                onChange={(e) => setPhone(applyMask(e.target.value))}
              />
            </div>
            {/* Chair Amount */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantityn"
                placeholder="1"
                type="number"
                value={chairQuantity}
                min={1}
                max={100}
                onChange={(e) => {
                  const chairsQuantity =
                    Number(e.target.value) > 0 ? Number(e.target.value) : 1;
                  setPrice(300 * chairsQuantity);
                  setChairQuantity(chairsQuantity);
                }}
              />
              <span className="text-xs font-light -mt-1">
                1 cadeira = R$ 300,00
              </span>
            </div>
            {/* Parcelas */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Parcelas</Label>
              <Select
                onValueChange={(value) => setQuantity(Number(value))}
                value={quantity.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a quantidade" />
                </SelectTrigger>

                <SelectContent>
                  {[...Array(10)].map((_, index) => {
                    const parcelas = index + 1;
                    const valorParcela = price / parcelas;
                    const valorFormatado = new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(valorParcela);

                    return (
                      <SelectItem key={parcelas} value={parcelas.toString()}>
                        {parcelas}x {valorFormatado}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <Button
              disabled={!(name && phone) || loading}
              className="w-full"
              size="lg"
            >
              {loading ? <Loader className="animate-spin" /> : "Confirmar"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
