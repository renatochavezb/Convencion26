import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/libs/mongo';

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'convencion26');
    const data = await req.json();
    if (!data.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const email = data.email.toLowerCase().trim();
    const payload = {
      ...data,
      email,
      updatedAt: new Date().toISOString()
    };
    
    // Prevent Mongo immutable _id error
    delete payload._id;

    const result = await db.collection('registrations').updateOne(
      { email },
      { $set: payload },
      { upsert: true }
    );

    // If couple modality, register the companion as a separate document
    if (payload.ticketType === 'pareja' && payload.partnerEmail && payload.partnerName) {
      const partnerEmail = payload.partnerEmail.toLowerCase().trim();
      const partnerPayload = {
        ticketId: payload.ticketId ? `${payload.ticketId}-P` : '',
        name: payload.partnerName,
        email: partnerEmail,
        phone: payload.partnerPhone || '',
        company: payload.company || '',
        city: payload.city || '',
        position: payload.position || '',
        badgeRole: 'Convencionista',
        ticketType: 'pareja',
        status: payload.status || 'pendiente',
        partnerName: payload.name,
        partnerEmail: email,
        partnerPhone: payload.phone || '',
        comprobante: payload.comprobante || undefined,
        registeredAt: payload.registeredAt || new Date().toLocaleDateString('es-MX'),
        updatedAt: new Date().toISOString()
      };
      
      await db.collection('registrations').updateOne(
        { email: partnerEmail },
        { $set: partnerPayload },
        { upsert: true }
      );
    }

    // Send to Google Sheets Webhook asynchronously if configured
    const sheetsWebhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (sheetsWebhook) {
      try {
        fetch(sheetsWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticketId: payload.ticketId || '',
            name: payload.name || '',
            email: payload.email || '',
            phone: payload.phone || '',
            company: payload.company || '',
            city: payload.city || '',
            position: payload.position || '',
            badgeRole: payload.badgeRole || '',
            ticketType: payload.ticketType || '',
            status: payload.status || 'pendiente',
            partnerName: payload.partnerName || '',
            partnerEmail: payload.partnerEmail || '',
            partnerPhone: payload.partnerPhone || '',
            nombreAcompanante: payload.partnerName || '',
            correoAcompanante: payload.partnerEmail || '',
            celularAcompanante: payload.partnerPhone || '',
            nombreacompanante: payload.partnerName || '',
            correoacompanante: payload.partnerEmail || '',
            celularacompanante: payload.partnerPhone || '',
            comprobante: payload.comprobante ? 'SÍ' : 'NO',
            registeredAt: payload.registeredAt || new Date().toLocaleDateString('es-MX'),
            updatedAt: payload.updatedAt
          }),
        }).catch(err => console.error('Google Sheets webhook post error:', err));
      } catch (sheetsErr) {
        console.error('Google Sheets sync error:', sheetsErr);
      }
    }

    return NextResponse.json({ success: true, matchedCount: result.matchedCount, upsertedCount: result.upsertedCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
