import { Check } from "lucide-react";
import { useMeta } from "../../../hooks/use-meta";

export function ProgressFooter() {
  const { goalData, progressPercentage } = useMeta();

  return (
    <div className="absolute bottom-2 w-full">
      <div className="flex flex-col sm:flex-row mx-3 items-center justify-between">
        {/* Esquerda */}
        <div className="hidden sm:flex justify-start items-center gap-3 bg-black p-4 px-8  rounded-[20px] shadow">
          <div className="bg-[#EDEDED] p-3 rounded-full">
            <img src="Frame.png" className="size-[32px]" alt="" />
          </div>
          <div className="flex flex-col text-white">
            <p className="text-sm">Meta da doação</p>
            <span className="font-bold">
              {goalData
                ? new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(goalData.totalGoal)
                : "R$ 120.000,00"}
            </span>
          </div>
        </div>

        {/* Direita */}
        <div className="w-full sm:w-fit flex justify-end items-center gap-3 bg-black p-4 px-8  rounded-[20px] text-white shadow">
          <div className="w-full max-w-[400px]">
            <div className="flex justify-between items-center gap-4">
              <p className="text-sm">
                {goalData
                  ? new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(goalData.currentAmount)
                  : "R$ 120.000,00"}
              </p>

              <div className="flex items-center">
                <Check className="bg-green-600 rounded-full p-0.5 size-4" />
                <span className="text-sm ml-1">
                  {progressPercentage()?.toFixed(0)}% concluída
                </span>
              </div>
            </div>

            <div className="h-6 bg-[#808080] overflow-hidden rounded-[40px] mt-4">
              <div
                className="w-full h-full bg-green-600"
                style={{ width: `${progressPercentage()}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
