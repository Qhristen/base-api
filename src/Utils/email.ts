require("dotenv").config();
import nodemailer from "nodemailer";
import { User } from "../Entities/user.entity";
import config from "../../config/custom-environment-variables";
import pug from "pug";
import { convert } from "html-to-text";
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

export default class Email {
  firstName: string;
  to: string;
  from: string;
  constructor(public user: User, public url: string) {
    this.firstName = user.full_name.split(" ")[0];
    this.to = user.email;
    this.from = `support@ucheka.com`;
  }

  private async send(template: string, subject: string) {
    // Generate HTML template based on the template string
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      firstName: this.firstName,
      subject,
      url: this.url,
    });

    // Create mailOptions
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: convert(html),
      html,
    };

    // Send email
    try {
      await sendgrid.send(mailOptions);
    } catch (error) {
      console.log(error);
    }
  }

  async sendVerificationCode() {
    await this.send("verificationCode", "Your account verification code");
  }

  async sendPasswordResetToken() {
    await this.send(
      "resetPassword",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
}
