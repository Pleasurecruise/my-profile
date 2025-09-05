import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === "true", // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS,
    },
});

type SendEmailOptions = {
    to: string;
    subject: string;
    text?: string;
    html?: string;
};

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
    try {
        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM, // 发件人
            to,
            subject,
            text,
            html,
        });

        console.log("Email sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}
