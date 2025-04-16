const nodemailer = require('nodemailer');
jest.mock('nodemailer');
const { sendMail } = require('./email');

describe('sendMail', () => {
  it('deve chamar nodemailer.sendMail com os parâmetros corretos', async () => {
    const sendMailMock = jest.fn().mockResolvedValue(true);
    const fakeTransporter = { sendMail: sendMailMock };

    const mailData = {
      to: 'lucasamerico029@gmail.com',
      subject: 'Assunto de Teste',
      html: '<b>Oi</b>'
    };

    await sendMail(mailData, fakeTransporter);

    expect(sendMailMock).toHaveBeenCalledWith({
      from: process.env.EMAIL_FROM,
      ...mailData
    });
  });
}); 