import nodeMailer from 'nodemailer';
import { log } from 'util';

const infoEmail = '';
const pass = '';

const emailTransporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: infoEmail,
    pass,
  },
});

export const sendMail = ({ to, subject, body }) => {
  const mailOptions = {
    to,
    from: `Farm4Me <${infoEmail}>`,
    subject,
    html: body,
  };

  emailTransporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      log(err.message);
    }
    if (info) {
      log(info);
    }
  });
};
