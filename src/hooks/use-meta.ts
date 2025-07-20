import { supabase } from "../utils/supabase";
import { useState, useEffect } from "react";

interface GoalData {
  id: number;
  totalGoal: number;
  currentAmount: number;
  chairsSold: number;
}

export const useMeta = () => {
  const [goalData, setGoalData] = useState<GoalData>();

  async function getMetaData() {
    const { error, data } = await supabase.from("meta").select();

    if (error) {
      console.log(error);
      return;
    }

    setGoalData({
      id: data[0].id,
      totalGoal: data[0].meta_total,
      chairsSold: data[0].chairs_sold,
      currentAmount: data[0].current_amount,
    });
  }

  useEffect(() => {
    getMetaData();
  }, []);

  const progressPercentage = () => {
    if (goalData?.currentAmount === 0) {
      return 0;
    }

    if (goalData?.totalGoal && goalData.currentAmount) {
      return (goalData.currentAmount / goalData.totalGoal) * 100;
    }
  };

  const updateMetaUp = async (amount: number) => {
    if (!goalData) {
      return;
    }

    const { error } = await supabase
      .from("meta")
      .update({ current_amount: amount + goalData.currentAmount })
      .eq("id", goalData.id);

    if (error) {
      throw new Error("Erro ao atualizar meta");
    }

    getMetaData();
  };

  const updateMetaDown = async (amount: number) => {
    if (!goalData) {
      return;
    }

    const { error } = await supabase
      .from("meta")
      .update({ current_amount: goalData.currentAmount - amount })
      .eq("id", goalData.id);

    if (error) {
      throw new Error("Erro ao atualizar meta");
    }

    getMetaData();
  };

  return {
    goalData,
    getMetaData,
    progressPercentage,
    updateMetaUp,
    updateMetaDown,
  };
};
