import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Loader } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../../utils/supabase";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

export function FormUserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const TOTAL_PRICE = 300;

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        navigate("/", { replace: true });
        return;
      }

      if (data.session?.user) {
        setUser(data.session.user);
      } else {
        navigate("/", { replace: true });
      }
    };

    getSession();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    try {
      if (!user) return;

      const updates = {
        id: user.id,
        username: name,
        phone,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        toast.error("Erro ao atualizar!");
        return;
      }

      // Run create installments
      const { error: ErrorFunction } = await supabase.rpc(
        "insert_installments",
        {
          profileid: user.id,
          quantity: quantity,
          value: Number((TOTAL_PRICE / quantity).toFixed(2)),
        }
      );

      if (ErrorFunction) {
        console.log(ErrorFunction.message);
        return;
      }

      toast.success("Obrigado pela sua ajuda! 😊");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao salvar. Tenta novamente mais tarde!");
    } finally {
      setLoading(false);
    }
  }

  function applyMask(input: string) {
    const onlyNumbers = input.replace(/\D/g, "").slice(0, 11); // Limita a 11 dígitos

    let masked = onlyNumbers;

    if (onlyNumbers.length <= 2) {
      masked = onlyNumbers;
    } else if (onlyNumbers.length <= 7) {
      masked = `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2)}`;
    } else {
      masked = `(${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(
        2,
        7
      )}-${onlyNumbers.slice(7)}`;
    }

    setPhone(masked);
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-center">
          Preencha as informações abaixo
        </CardTitle>
        <CardContent className="mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                placeholder="(XX) XXXXX-XXXX"
                onChange={(e) => applyMask(e.target.value)}
              />
            </div>
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
                    const valorParcela = TOTAL_PRICE / parcelas;
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
        </CardContent>
      </CardHeader>
    </Card>
  );
}
