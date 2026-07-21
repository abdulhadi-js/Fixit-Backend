import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend | null = null;
  private readonly fromEmail: string;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    this.fromEmail = this.config.get<string>('MAIL_FROM', 'onboarding@resend.dev');

    if (apiKey && apiKey !== 'REPLACE_WITH_RESEND_API_KEY') {
      this.resend = new Resend(apiKey);
      this.logger.log('Resend mail service initialized ✅');
    } else {
      this.logger.warn('⚠️  RESEND_API_KEY not set — emails will be logged to console only (dev mode)');
    }
  }

  async sendOtp(email: string, otpCode: string): Promise<void> {
    await this.send(email, 'Your FixIt OTP Code', this.buildOtpHtml(otpCode, 'Verify your account'));
  }

  async sendForgotPasswordOtp(email: string, otpCode: string): Promise<void> {
    await this.send(email, 'FixIt Password Reset Code', this.buildOtpHtml(otpCode, 'Reset your password'));
  }

  async sendOtpEmail(email: string, otpCode: string): Promise<void> {
    return this.sendOtp(email, otpCode);
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.resend) {
      this.logger.warn(
        `\n${'='.repeat(60)}\n` +
        `⚠️  [DEV FALLBACK] Resend not configured — Email NOT sent\n` +
        `   Recipient : ${to}\n` +
        `   Subject   : ${subject}\n` +
        `${'='.repeat(60)}`,
      );
      return;
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
      });

      if (error) {
        throw new Error(error.message);
      }

      this.logger.log(`✅ Email sent to ${to} (id: ${data?.id})`);
    } catch (error: any) {
      this.logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
      this.logger.warn(
        `\n${'='.repeat(60)}\n` +
        `⚠️  [FALLBACK] Email failed — check RESEND_API_KEY in Railway vars\n` +
        `   Recipient : ${to}\n` +
        `${'='.repeat(60)}`,
      );
    }
  }

  private buildOtpHtml(otpCode: string, action: string): string {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">🔧 FixIt</h1>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="color: #111827; margin: 0 0 8px;">${action}</h2>
          <p style="color: #6b7280; margin: 0 0 24px;">Use the code below. It expires in <strong>5 minutes</strong>.</p>
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 10px; text-align: center; padding: 20px; background: #f9fafb; border-radius: 8px; color: #4f46e5; margin-bottom: 24px;">
            ${otpCode}
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
    `;
  }
}
