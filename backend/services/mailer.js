import nodemailer from 'nodemailer';
import { getStoreSettings } from './checkout.js';

// Build a fresh transporter each call so DB changes take effect immediately
async function getTransporter() {
  const settings = await getStoreSettings();

  const host = settings.smtpHost || process.env.SMTP_HOST;
  const port = settings.smtpPort || process.env.SMTP_PORT;
  const user = settings.smtpUser || process.env.SMTP_USER;
  const pass = settings.smtpPass || process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });
}

async function getMailFrom() {
  const settings = await getStoreSettings();
  return settings.mailFrom || process.env.MAIL_FROM || process.env.SMTP_USER;
}

async function getAdminEmail() {
  const settings = await getStoreSettings();
  return settings.adminEmail || process.env.ADMIN_EMAIL;
}

export async function sendContactNotification(submission) {
  const transporter = await getTransporter();
  if (!transporter) {
    console.log('Contact notification skipped: SMTP not configured');
    return false;
  }

  const adminEmail = await getAdminEmail();
  if (!adminEmail) {
    console.log('Contact notification skipped: adminEmail not set');
    return false;
  }

  const from = await getMailFrom();
  const { id, firstName, lastName, email, phone, subject, message, source } = submission;

  // 1. Notify admin
  await transporter.sendMail({
    from,
    to: adminEmail,
    subject: `[Somacan] Nouveau message #${id} — ${subject || 'Contact'}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1c1917;max-width:600px;">
        <h2 style="color:#033a22;margin-bottom:4px;">Nouveau message de contact</h2>
        <p style="color:#888;font-size:12px;margin-top:0;">Formulaire #${id} · Source: ${source}</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:6px 0;color:#888;width:120px;">Nom</td><td style="padding:6px 0;font-weight:bold;">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:6px 0;color:#888;">Téléphone</td><td style="padding:6px 0;">${phone}</td></tr>` : ''}
          ${subject ? `<tr><td style="padding:6px 0;color:#888;">Sujet</td><td style="padding:6px 0;">${subject}</td></tr>` : ''}
        </table>
        <div style="background:#f5f5f4;border-radius:12px;padding:16px;margin:16px 0;">
          <p style="margin:0;white-space:pre-wrap;">${message}</p>
        </div>
        <p style="margin-top:24px;">
          <a href="${process.env.SITE_URL || 'http://localhost:3000'}/admin/forms" style="background:#033a22;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;">
            Voir dans l'admin →
          </a>
        </p>
      </div>
    `,
  });

  // 2. Auto-reply to the sender
  await transporter.sendMail({
    from,
    to: email,
    subject: `Somacan — Votre message a bien été reçu`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1c1917;max-width:600px;">
        <h2 style="color:#033a22;">Merci ${firstName},</h2>
        <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
        <div style="background:#f5f5f4;border-radius:12px;padding:16px;margin:16px 0;border-left:3px solid #033a22;">
          <p style="margin:0;color:#888;font-size:12px;margin-bottom:8px;">Votre message :</p>
          <p style="margin:0;white-space:pre-wrap;">${message}</p>
        </div>
        <p>À bientôt,<br/><strong>L'équipe Somacan</strong></p>
      </div>
    `,
  });

  return true;
}

export async function sendNewsletterWelcome(subscriber) {
  const transporter = await getTransporter();
  if (!transporter) return false;

  const from = await getMailFrom();
  const { email, firstName } = subscriber;

  await transporter.sendMail({
    from,
    to: email,
    subject: 'Somacan — Bienvenue dans le cercle',
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#1c1917;max-width:600px;">
        <h2 style="color:#033a22;">Bienvenue${firstName ? ` ${firstName}` : ''} !</h2>
        <p>Vous faites maintenant partie du cercle privé Somacan. Vous serez les premiers informés de nos nouvelles collections, rituels exclusifs et offres réservées aux membres.</p>
        <p style="margin-top:24px;color:#888;font-size:12px;">Pour vous désinscrire, répondez simplement à cet email avec "Désinscription".</p>
        <p><strong>L'équipe Somacan</strong></p>
      </div>
    `,
  });

  return true;
}

export async function sendGuestOrderEmail({ order, trackUrl, claimUrl, createAccountAfterOrder }) {
  const transporter = await getTransporter();

  if (!transporter) {
    console.log('Guest order email skipped: SMTP not configured', {
      orderId: order.id,
      trackUrl,
      claimUrl,
    });
    return false;
  }

  const from = await getMailFrom();
  const accountBlock = createAccountAfterOrder && claimUrl
    ? `<p style="margin:16px 0;">Creer votre compte client : <a href="${claimUrl}">${claimUrl}</a></p>`
    : '';

  await transporter.sendMail({
    from,
    to: order.customer.email,
    subject: `Somacan - Confirmation de commande #${order.id}`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1c1917;">
        <h2 style="margin-bottom:12px;">Commande #${order.id} confirmee</h2>
        <p>Merci ${order.customer.firstName || ''}, votre commande a bien ete enregistree.</p>
        <p style="margin:16px 0;">Suivre votre commande : <a href="${trackUrl}">${trackUrl}</a></p>
        ${accountBlock}
        <p>Montant total : <strong>${Number(order.totalAmount).toFixed(2)} MAD</strong></p>
      </div>
    `,
  });

  return true;
}
