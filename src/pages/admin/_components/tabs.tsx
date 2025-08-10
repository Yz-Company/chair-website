import { cn } from "../../../lib/utils";

export type Tabs = "profiles" | "donations";

type Props = {
  tabSelected: Tabs;
  setTab: (tab: Tabs) => void;
};

const tabButtons = [
  {
    tab: "profiles",
    text: "Usuários",
  },
  {
    tab: "donations",
    text: "Doações",
  },
];

export function TabsAdmin({ tabSelected, setTab }: Props) {
  return (
    <div className="flex items-center gap-4">
      {tabButtons.map((item, index) => (
        <button
          key={item["tab"]}
          onClick={() => setTab(item.tab as Tabs)}
          className={cn(
            "text-gray-400 p-2 cursor-pointer rounded-xl",
            tabSelected === item.tab && "text-white bg-card-foreground"
          )}
        >
          {item.text}
        </button>
      ))}
    </div>
  );
}
