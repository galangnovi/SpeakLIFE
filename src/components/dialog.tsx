"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

interface EmergencyDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function EmergencyDialog({ open, onClose }: EmergencyDialogProps) {
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] =useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("user_emergency").insert([
      {
        phone,
        city,
      },
    ]);

    if (error) {
    // Cek apakah error karena duplicate key
    if (error.code === "23505") { // kode Postgres untuk unique violation
      console.warn("Nomor telepon sudah terdaftar:", phone);
      alert("Kamu sudah pernah daftarkan nomor telp kamu, kami akan segera menghubungimu");
    } else {
      console.error("Error insert:", error.message);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
    setLoading(false);
    return;
  }

    setLoading(false);
    setSuccess(true);
    setPhone("");
    setCity("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-red-600">🚨 Penting: Kamu Tidak Sendiri</DialogTitle>
          <DialogDescription className="text-gray-700">
            Kami merasakan kamu sedang dalam kondisi yang sangat berat. 
            Tinggalkan nomor telepon dan nama kota/daerahmu di bawah ini. 
            Kami akan bantu ringankan masalahmu.
          </DialogDescription>
        </DialogHeader>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 08123456789"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Kota/Daerah</Label>
              <Input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Contoh: Jakarta"
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Kirim"}
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                Batal
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-semibold">
              ✅ Terima kasih, data kamu sudah kami terima.
            </p>
            <Button onClick={onClose}>Tutup</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
