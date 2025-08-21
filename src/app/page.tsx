import ChatTemplate from "@/components/chat";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-[98%] flex justify-center">
      <img src="/background.png" alt="" className="fixed top-0 left-0 w-screen h-screen object-cover z-0 blur-xl"/>
      <div className="relative z-10 w-full h-full flex justify-center items-center">
        <ChatTemplate />
      </div>
    </div>
    
  );
}
