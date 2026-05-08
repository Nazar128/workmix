import { Resend } from 'resend';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const supabase = await createClient();
  const { subject, message } = await req.json();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });

  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .insert([{ 
      user_id: user.id, 
      subject, 
      status: 'open',
      priority: 'medium' 
    }])
    .select()
    .single();

  if (ticketError) return NextResponse.json({ error: ticketError.message }, { status: 500 });

  await supabase.from('ticket_messages').insert([{
    ticket_id: ticket.id,
    sender_id: user.id,
    message: message,
    is_admin_reply: false
  }]);

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: 'workmixsupport@gmail.com', 
      subject: ` Yeni Destek Talebi: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2>Yeni Destek Talebi</h2>
          <p><strong>Kullanıcı:</strong> ${user.email}</p>
          <p><strong>Konu:</strong> ${subject}</p>
          <p><strong>Mesaj:</strong> ${message}</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/support/${ticket.id}" 
             style="display:inline-block; padding:10px 20px; background:#000; color:#fff; border-radius:5px; text-decoration:none;">
             Talebe Git
          </a>
        </div>`
    });
  } catch (err) { console.error("Mail hatası:", err); }

  return NextResponse.json({ success: true, ticketId: ticket.id });
}