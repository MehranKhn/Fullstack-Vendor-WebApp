const nodemailer=require('nodemailer')
const sendEmail=async (to,subject,html)=>{
    const transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.USER_EMAIL,
            pass:process.env.APP_PASSWORD
        }
    });

    const mailOptions={
        from:`"Vendor-Market-App" <${process.env.USER_EMAIL}>`,
        to,
        subject,
        html
    };

    await transporter.sendMail(mailOptions);
}
module.exports=sendEmail