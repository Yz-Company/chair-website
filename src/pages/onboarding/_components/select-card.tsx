import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import type { CardInstallmet } from "../models/card-installment";

const cards: CardInstallmet[] = [
  {
    title: "1º Carnê",
    price: 30,
    period: "mês",
    quantity: 10,
  },
  {
    title: "2º Carnê",
    price: 45,
    period: "mês",
    quantity: 10,
  },
  {
    title: "3º Carnê",
    price: 60,
    period: "mês",
    quantity: 10,
  },
];

interface SelectCardProps {
  callback: (id: CardInstallmet) => void;
}

export default function SelectCard({ callback }: SelectCardProps) {
  return (
    <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-4 items-center justify-center">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="w-full max-w-sm text-center cursor-pointer py-8 hover:bg-slate-100/90"
          onClick={() => callback(card)}
        >
          <CardHeader>
            <CardTitle> {card.title} </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-5xl">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(card.price)}
              <span className="text-sm font-light">/{card.period}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
