import { toast } from "sonner";
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
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { cn } from "../../../lib/utils";
import type { InstallMent } from "../../../models/installment";
import ImageUpload from "../../../components/comp-125";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { FileWithPreview } from "../../../hooks/use-file-upload";
import { supabase } from "../../../utils/supabase";
import { v4 as uuid } from "uuid";

interface DialogPayInstallmetProps {
  installment: InstallMent;
  disabled: boolean;
}

export default function DialogPayInstallmet({
  installment,
  disabled,
}: DialogPayInstallmetProps) {
  const PIX = "07925542000114";
  const [isCopy, setIsCopy] = useState(false);
  const [open, setOpen] = useState(false);

  function handleCopyPix() {
    navigator.clipboard
      .writeText(PIX)
      .then(() => {
        toast.success("Copiado com sucesso!");
        setIsCopy(true);
        setTimeout(() => {
          setIsCopy(false);
        }, 4000);
      })
      .catch(() => {
        toast.error("Erro ao copiar");
      });
  }

  async function uploadFile(file: FileWithPreview[]) {
    if (!file || file.length === 0) {
      throw new Error("Você deve selecionar uma imagem para upload");
    }

    const image = file[0].file;

    if (!(image instanceof File)) {
      throw new Error("O arquivo não é valido");
    }
    const imageExt = image.name.split(".").pop();
    const fileName = `${uuid()}.${imageExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("comprovantes")
      .upload(filePath, image);

    if (uploadError) {
      console.log(uploadError);
      return;
    }

    const { error } = await supabase
      .from("installment")
      .update({
        image_url: `https://smrkubxhpqllmoqhcjkx.supabase.co/storage/v1/object/public/comprovantes//${filePath}`,
      })
      .eq("id", installment.id);

    if (error) {
      console.log(error);
    }

    if (error || uploadError) {
      toast.error("Erro ao fazer upload do comprovante.");
    } else {
      toast.success("Comprovante enviado com sucesso!");
    }
  }

  async function handleConfirmPayment() {
    try {
      const { error } = await supabase
        .from("installment")
        .update({ statust_installment: "paid" })
        .eq("id", installment.id);

      if (error) {
        throw new Error("Erro ao atualizar carnê");
      }

      toast.success("Carnê atualizado para pago!");
      setOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar carnê");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "cursor-pointer disabled:cursor-not-allowed",
            installment.statust_installment === "paid" && "bg-green-500"
          )}
          size="sm"
          disabled={disabled}
        >
          {installment.statust_installment === "paid" ? "Pago" : "Pagar"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-start">
          <DialogTitle>Pagar carnê</DialogTitle>
          <DialogDescription>Copie e cole o conteúdo abaixo</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="pix">Pix</Label>
            <Input id="pix" defaultValue={PIX} readOnly />
            <span className="text-xs font-light text-gray-500">
              Comunidade Evang. Sara Nossa Terra de Teresina - PI
            </span>
          </div>
          <ImageUpload callback={uploadFile} imageUrl={installment.image_url} />
        </div>
        <DialogFooter className="flex flex-row items-center justify-end">
          <Button
            aria-label="Copiar chave Pix"
            className="w-fit"
            onClick={handleCopyPix}
          >
            {!isCopy ? (
              <Copy className="size-4" />
            ) : (
              <Check className="size-4" />
            )}
            Copiar
          </Button>
          <Button
            variant="outline"
            className="w-fit"
            onClick={handleConfirmPayment}
          >
            Confirmar pagemento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
