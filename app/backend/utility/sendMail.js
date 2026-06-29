const nodemailer = require('nodemailer')


const EMAIL_HOST_USER=process.env.EMAIL_HOST_USER
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const EMAIL_HOST_PASSWORD = process.env.EMAIL_HOST_PASSWORD

const subject = 'Reset you password'

async function SendMail(code, email) {
    const content = `Here is your requested code : ${code}`
  try {
   


    const transporter = process.env.SMTP_PORT && nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });
    if (transporter)
        await transporter.sendMail({
        from: EMAIL_HOST_USER, 
        to: email,    
        replyTo: email,          
        subject: subject,

        text: content,
    });
    return true

  }
  catch(e){
   console.log(e)
   return false
  }
}

module.exports ={SendMail}