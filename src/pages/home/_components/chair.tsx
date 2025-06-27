import { ArrowDown } from "lucide-react";

export function Body() {
  return (
    <div className="w-full flex flex-grow px-4 mt-2">
      <div className="w-full bg-white rounded-[40px] flex flex-col items-center relative overflow-hidden">
        {/* Title */}
        <div className="self-center mt-8 flex flex-col justify-center items-center px-4 text-center">
          <span className="text-[#8E8E8E] text-sm md:text-base">Projeto</span>
          <h2 className="text-[#8E8E8E] text-2xl md:text-4xl font-semibold">
            Juntos plantamos{" "}
            <span className="text-black">
              conforto e <br className="hidden md:block" />
              colhemos comunhão
            </span>
          </h2>
        </div>

        {/* Cadeira ao centro */}
        <div className="overflow-hidden mt-8 mx-auto w-full max-w-[700px] px-4">
          <div className="relative h-[220px] md:h-[290px] rounded-[40px] bg-[#EBEBEB] mt-4 mx-auto p-6">
            <span className="text-[#8E8E8E] font-medium text-sm md:text-base">
              Adote sua <span className="text-black">cadeira</span>
            </span>
            <img
              className="absolute -top-[20px] md:-top-[29px] left-1/2 -translate-x-1/2 h-[120%] object-contain"
              src="chair.png"
              alt="Cadeira"
            />
          </div>
        </div>

        {/* Botão + texto */}
        <div className="flex items-center gap-2 mt-8 text-sm md:text-base">
          <div className="p-2 rounded-full bg-[#EAEAEA] animate-bounce">
            <ArrowDown />
          </div>
          <span className="font-semibold">Mais informações</span>
        </div>

        {/* Pastor */}
        {/* <div className="hidden lg:flex gap-3 items-center bg-[#EBEBEB] p-2 rounded-[20px] w-[290px] absolute left-4 xl:left-16 top-28 border border-[#D8D8D8]">
          <img
            src="pastor.png"
            alt="Pastor Genilson"
            className="w-[89px] h-[89px] object-cover rounded-[10px]"
          />
          <div className="flex flex-col">
            <p className="font-semibold text-base">Pastor Genilson</p>
            <span className="font-normal text-sm">
              Conforto para nossos visitantes
            </span>
          </div>
        </div> */}

        {/* Casal orando */}
        {/* <div className="hidden lg:block absolute right-4 xl:right-12 top-48 bg-[#F2F2F2] rounded-[20px] pt-12 border border-[#D8D8D8]">
          <img
            src="casal-orando.png"
            className="w-[180px] md:w-[220px] lg:w-[252px] object-contain"
            alt="Casal Orando"
          />
        </div> */}
      </div>
    </div>
  );
}
