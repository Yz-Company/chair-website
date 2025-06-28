import type { InstallMent } from "../../../models/installment";
import DialogPayInstallmet from "./dialog-pay-installment";

interface CardProps {
  installment: InstallMent;
  disabled: boolean;
}

export function Card({ installment, disabled }: CardProps) {
  return (
    <div className="w-full border rounded-sm shadow p-5 flex items-center justify-between hover:bg-slate-100">
      <div className="font-semibold">{installment.installment_number}º</div>
      <div className="flex items-center gap-4">
        <p>
          Valor:{" "}
          <span className="text-sm">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(installment.amount)}
          </span>
        </p>
        <DialogPayInstallmet installment={installment} disabled={disabled} />
      </div>
    </div>
  );
}
