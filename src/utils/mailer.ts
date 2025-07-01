import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error("SMTP_USER e SMTP_PASS precisam estar definidos no .env");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendResetEmailParams {
  to: string;
  name: string;
  code: string;
  token: string;
}

export async function sendResetEmail({
  to,
  name,
  code,
  token,
}: SendResetEmailParams) {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"Suporte LOTEAMENTO" <${process.env.SMTP_USER}>`,
      to,
      subject: "Recuperação de Senha",
      html: `
      <p>Olá ${name},</p>
      <p>Recebemos uma solicitação de recuperação de senha para sua conta.</p>
      <p><strong>Código de recuperação:</strong> ${code}</p>
      <p>Ou clique no link abaixo para redefinir sua senha:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este link expira em 15 minutos.</p>
      <p>Se você não solicitou a redefinição de senha, não se preocupe, apenas ignore este e-mail.</p>
      <p>Estamos aqui para ajudar caso precise de qualquer coisa.</p>
      <p>Abraços,<br>Equipe de Suporte LOTEAMENTO</p>
    `,
    });
  } catch {
    throw new Error("Erro ao enviar e-mail");
  }
}
