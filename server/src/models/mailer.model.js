import { createTransport } from "nodemailer";

export class MailerModel {
  constructor() {}

  static async sendMail(data) {
    try {
      const { to, html } = data;

      const transporter = createTransport({
        service: "gmail",
        auth: {
          user: "nguyenvantien.coder@gmail.com",
          pass: "agktjblvfbbxqmyo",
        },
      });

      const mailOptions = {
        from: "nguyenvantien.coder@gmail.com",
        to,
        subject: "Đăng ký tại Bookstore",
        html,
      };

      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw error;
    }
  }
}
