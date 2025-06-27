import { useState } from "react";
import SelectCard from "./_components/select-card";
import FormUserProfile from "./_components/form-user-profile";

export default function OnboardingPage() {
  const [selectedCard, setSelectedCard] = useState("");

  function handleSelectCard(id: string) {
    setSelectedCard(id);
  }
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4">
      {!selectedCard && <SelectCard callback={handleSelectCard} />}
      {selectedCard && <FormUserProfile />}
    </div>
  );
}
