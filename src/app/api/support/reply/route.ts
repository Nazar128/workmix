import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { ticketId, message, targetEmail } = await req.json();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { error: msgError } = await supabase
      .from('ticket_messages')
      .insert([{
        ticket_id: ticketId,
        sender_id: user.id,
        message: message,
        is_admin_reply: true
      }]);

    if (msgError) {
      console.error("DB Mesaj Hatası:", msgError);
      throw new Error("Mesaj kaydedilemedi.");
    }


    const { error: updateError } = await supabase
      .from('tickets')
      .update({ 
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);

    if (updateError) {
      console.error("DB Güncelleme Hatası:", updateError);
      throw new Error("Ticket güncellenemedi.");
    }

    if (targetEmail) {
      try {
        await resend.emails.send({
          from: 'WorkMix Destek <onboarding@resend.dev>',
          to: targetEmail,
          subject: 'Destek Talebiniz Yanıtlandı!',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
              <h2 style="color: #7c3aed;">Merhaba,</h2>
              <p>Destek talebinize bir yanıt verildi:</p>
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #7c3aed; font-style: italic;">
                "${message}"
              </div>
              <p style="margin-top: 20px;">Detayları görmek için WorkMix panelinize giriş yapabilirsiniz.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <small style="color: #9ca3af;">Bu otomatik bir bildirimdir, lütfen bu maili yanıtlamayın.</small>
            </div>
          `
        });
      } catch (mailErr) {
        console.error("Mail gönderim hatası (Mesaj DB'ye kaydedildi):", mailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Genel Hata:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}