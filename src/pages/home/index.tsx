import { Body } from "./_components/chair";
import { Navbar } from "./_components/navbar";
import { ProgressFooter } from "./_components/progress";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col relative bg-gray-100">
      <Navbar />
      <Body />
      <ProgressFooter />
    </div>
  );
}
