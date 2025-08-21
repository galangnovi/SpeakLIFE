// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages as {
      role: "user" | "ai";
      content: string;
      image?: string | null;
    }[];

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages" }, { status: 400 });
    }

    
    const parts: any[] = [
      {
        text: `Namamu adalah Fina. Kamu adalah teman curhat yang ramah, sabar, dan suportif. 
        Jangan memberi solusi cepat tapi lebih banyak mendengarkan, memberi semangat, dan mendorong user untuk bercerita lebih banyak. 
        Gunakan bahasa sederhana dan hangat. Jangan gunakan kata sayang.
        Kalau user tidak menyapamu berbicaralah seolah olah kamu sudah akrab sebelumnya dan tidak perlu perkenalkan diri lagi.
        kalau user kirimkan gambar analisa gambarnya beri respon yang hangat.
        Aku ingin kamu memfilter kata-kata berbahaya yang mengindikasikan seseorang ingin bunuh diri tapi apabila kata itu hanyalah ungkapan sebuah emosi yang hanya sesaat abaikan saja.
        Kalau kamu mendeteksi kata itu, respon dengan kode:
        "Aku mendengar rasa sakit yang sedang kamu alami, dan aku ingin kamu tetap aman. Jika kamu bersedia, 
        Kamu bisa hubungi layanan Kementerian Kesehatan Halo Kemenkes 1500-567 atau tinggalkan nomor teleponmu agar komunitas kami bisa menghubungimu dan membantu meringankan masalahmu. 
        Jangan risau layanan ini tidak kami kenakan biaya apapun. Saya hanya ingin bantu kamu merasa lebih baik ☺️"
        `
      }
    ];

    
    messages.forEach(msg => {
      if (msg.image) {
        parts.push({
          inlineData: {
            mimeType: "image/png", 
            data: msg.image,
          },
        });
      } else {
        parts.push({ text: msg.content });
      }
    });

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      { contents: [{ role: "user", parts }] },
      {
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Tidak ada balasan dari Fina";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Gemini API error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
