import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

const cards = [
  {
    title: "1º Carnê",
    price: "R$30,00",
    period: "mês",
    id: "123",
  },
  {
    title: "2º Carnê",
    price: "R$45,00",
    period: "mês",
    id: "3245",
  },
  {
    title: "3º Carnê",
    price: "R$60,00",
    period: "mês",
    id: "09094",
  },
];

interface SelectCardProps {
  callback: (id: string) => void;
}

export default function SelectCard({ callback }: SelectCardProps) {
  return (
    <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-4 items-center justify-center">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="w-full max-w-sm text-center cursor-pointer hover:bg-slate-100/90"
          onClick={() => callback(card.id)}
        >
          <CardHeader>
            <CardTitle> {card.title} </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-5xl tracking-tight">
              {card.price}{" "}
              <span className="text-sm font-light -ml-2">/{card.period}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
