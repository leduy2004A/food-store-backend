import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'
config()
const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  service: 'gmail',
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.EMAIL,
    pass: process.env.PASS_EMAIL
  }
})

export const sendEmail = async ({ to, subject }: { to: string; subject: string }) => {
  try {
    const template = fs.readFileSync(path.resolve('src', 'templates', 'index.html'), 'utf-8')
    const info = await transporter.sendMail({
      from: process.env.EMAIL, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: template // html body
    })
  } catch (err) {
    console.log(err)
  }
}
