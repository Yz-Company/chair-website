import { useState } from "react";
import SelectCard from "./_components/select-card";
import FormUserProfile from "./_components/form-user-profile";
import type { CardInstallmet } from "./models/card-installment";

export default function OnboardingPage() {
  const [selectedCard, setSelectedCard] = useState<CardInstallmet>();

  function handleSelectCard(installment: CardInstallmet) {
    setSelectedCard(installment);
  }
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4">
      {!selectedCard && <SelectCard callback={handleSelectCard} />}
      {selectedCard && <FormUserProfile installment={selectedCard} />}
    </div>
  );
}
