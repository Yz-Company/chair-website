import { Loader } from "lucide-react";

export default function LoaderComponent() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
}
