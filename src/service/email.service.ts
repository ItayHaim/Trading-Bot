import { createTransport, SendMailOptions } from 'nodemailer'

export class EmailService {
    private email = process.env.EMAIL_USERNAME
    private password = process.env.EMAIL_PASSWORD
    private toEmail = process.env.TO_EMAIL

    private connection = createTransport({
        service: 'gmail',
        auth: {
            user: this.email,
            pass: this.password
        }
    })
    sendEmail() {
        try {
            const mail: SendMailOptions = {
                from: this.email,
                to: this.toEmail,
                subject: '',
                text: ''
            }
            this.connection.sendMail({}, (err, info) => {
                if (err) {
                    throw err
                } else {
                    console.log('Mail sent successfully ' + info)
                }
            })
        } catch (err) {
            console.error('Failed to send mail: ' + err)
            throw err
        }
    }
}