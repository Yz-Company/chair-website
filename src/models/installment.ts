export interface InstallMent {
  id: string;
  amount: number;
  profile_id: string;
  installment_number: number;
  statust_installment: "pending" | "paid" | "";
  image_url?: string;
  approve: boolean;
}
