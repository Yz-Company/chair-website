import type { InstallMent } from "../../../models/installment";
import DialogVerifyInstallment from "./dialog-verify-installment";

interface CardInstallmentProps {
  installment: InstallMent;
}

export default function CardInstallment({ installment }: CardInstallmentProps) {
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
        <DialogVerifyInstallment installment={installment} />
      </div>
    </div>
  );
}
