const nodemailer = require('nodemailer');
const dayjs = require('dayjs');
const { getFullName } = require('../utils/parser');
const { encryptData } = require('../encryption');
const { HttpStatusCode, MailerMessages } = require('../../../constants');
const Subject = MailerMessages.SUBJECT;
const From = MailerMessages.FROM;
const appUrl = process.env.APP_URL;
const EmailWrapper = (template, subject) => `
<html>
<div>
    <div style="padding:30px;color:#444;max-width: 1000px;margin: 0 auto;">
        <div style="padding:15px;color:#444;">
            <h3 style="font-size: 24px; text-align: center;margin-top:0px">${subject}</h3>
            ${template}
            <p style="font-size: 14px;font-weight: 300;">Kind regards,</p>
            <p style="font-size: 14px;font-weight: 900;">The Brokers Team</p>
            <div
                style="text-align:center;border-top: 1px solid rgba(255, 255, 255, 0.24);padding-top:10px;color:#444;font-size:13px;padding-bottom: 10px;">
                &copy; <a style="color:#444;text-decoration:none" href="${appUrl}">Broker ${dayjs().format(
  'YYYY'
)}</a>
            </div>
        </div>
    </div>
</div>
</html>`;
const AdminInvitationTemplate = (url, name, subject) => {
  const template = `
    <h3 style="font-size: 18px; ">Dear ${name}</h3>
     <p style="font-size: 14px;">
    Welcome to the "Brokers Portal".<br />
  </p>
  <p style="font-size: 14px;">
    An admin account has been created for you by Brokers. Please accept your invitation.<br />
  </p>
    <a href=${url}
        style="border-radius:3px;background: #1976d2;color:#fff;font-weight:600;font-size: 18px;line-height:24px;margin: 30px auto;padding: 12px 6px;text-decoration:none;width: 60%;text-align:center;display: block;"
        target="_blank">Accept Invitation</a>
  `;
  return EmailWrapper(template, subject);
};

const ForgotPasswordTemplate = (url, name, subject) => {
  const template = `
    <h3 style="font-size: 18px; ">Dear ${name}</h3>
    <p style="font-size: 14px;">
      You're receiving this email because you requested a password reset for your account. Click on the button below to reset your password.<br />
    </p>
    <a href=${url}
        style="border-radius:3px;background: #E3804E;color:#444;font-weight:600;font-size: 18px;line-height:24px;margin: 30px auto;padding: 12px 6px;text-decoration:none;width: 60%;text-align:center;display: block;"
        target="_blank">Reset Password</a>
        <p style="font-size: 14px;">
      If you did not make this request, please ignore this email. Your password will remain unchanged.<br />
    </p>`;
  return EmailWrapper(template, subject);
};
const ResetPasswordTemplate = (name, subject) => {
  const template = `
    <h3 style="font-size: 18px; ">Dear ${name}</h3>
    <p style="font-size: 14px;">
      This is a courtesy email to let you know that your Brokers account password was recently updated.
    </p>
    <p style="font-size: 14px;">
      If this change was made by you, you don't need to do anything else.
    </p>
    <p style="font-size: 14px;">
      If it wasn't you, it could be that your account has been accessed by an unauthorised person. To reset your password, visit <a href="${appUrl}" style="color:#444;">Brokers</a> immediately, click on the Sign In link, and go through the Forgotten Password process.
    </p>`;
  return EmailWrapper(template, subject);
};

const SendEmail = (
  email,
  subject,
  template,
  fileName = '',
  filePath = null
) => {
  return new Promise((resolve, reject) => {
    try {
      var transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAILER_EMAIL,
          pass: process.env.MAILER_EMAIL_PASSWORD
        }
      });
      var mailOptions = {
        from: From,
        to: email,
        subject: subject,
        html: template
      };
      if (fileName && filePath) {
        mailOptions.attachments = {
          filename: fileName,
          path: filePath
        };
      }
      transport.verify(function(error) {
        if (error) {
          console.log(error);
          return reject({ code: HttpStatusCode.BAD_REQUEST });
        } else {
          console.log('Server is ready to take our messages');
        }
      });

      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return reject({ code: HttpStatusCode.BAD_REQUEST });
        }
        console.log(info);
        console.log(email);
        console.log('Message sent: %s', info.messageId);
        return resolve({ code: HttpStatusCode.OK });
      });
    } catch (error) {
      console.log(error);
      return reject({ code: HttpStatusCode.BAD_REQUEST });
    }
  });
};

exports.SendInvitationEmail = user => {
  return new Promise((resolve, reject) => {
    const site_url = appUrl + '/confirmation';
    const data = {
      email: user.email,
      id: user._id,
      dateTime: dayjs().valueOf()
    };
    encryptData(data)
      .then(token => {
        const url = `${site_url}?confirmToken=${token}`;
        SendEmail(
          user.email,
          MailerMessages.SUBJECT,
          AdminInvitationTemplate(url, getFullName(user), Subject)
        )
          .then(res => resolve(res))
          .catch(err => reject(err));
      })
      .catch(() => reject({ code: HttpStatusCode.BAD_REQUEST }));
  });
};

exports.ForgotPasswordEmail = user => {
  return new Promise((resolve, reject) => {
    const site_url = appUrl + '/reset-password';
    const data = {
      email: user.email,
      id: user._id,
      dateTime: dayjs().valueOf()
    };
    encryptData(data)
      .then(token => {
        const url = `${site_url}?confirmToken=${token}`;
        SendEmail(
          user.email,
          MailerMessages.RESET_PASSWORD,
          ForgotPasswordTemplate(
            url,
            getFullName(user),
            MailerMessages.RESET_PASSWORD
          )
        )
          .then(res => resolve(res))
          .catch(err => reject(err));
      })
      .catch(() => reject({ code: HttpStatusCode.BAD_REQUEST }));
  });
};
exports.PasswordSuccessfullyResetEmail = user => {
  return new Promise((resolve, reject) => {
    SendEmail(
      user.email,
      MailerMessages.SUCCESSFULLY_RESET_PASSWORD,
      ResetPasswordTemplate(
        getFullName(user),
        MailerMessages.SUCCESSFULLY_RESET_PASSWORD
      )
    )
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};
