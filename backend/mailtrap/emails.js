import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js"

//verification email
export const sendVerificationEmail = async (email, verificationToken, name)=>{
    const recipient =[{email}]

    try {
        const reasons = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken).replace("{name}", name),
            category: "Email Verification"

        });
        console.log("Verification Email Sent Successfully", reasons);
    } catch (error) {
        console.error("Error sending verification email", error);
        
    }
}

//send a welcome email

export const sendWelcomeEmail = async  (email, name)=>{
    const recipient =[{email}];

    try {
      const  response =  await mailtrapClient.send({
        from: sender,
        to: recipient,
        template_uuid: "6260dd5d-fb6a-4fde-9d05-bfae1fead6a4",
        template_variables: {
            "company_info_name": "Auth Company",
            "name": name
          }


      });
      console.log("Welcome Email Sent Successfully", response);
        
    } catch (error) {
        console.error("Error sending welcome email", error);


        
    }

}

//send a password reset email
export const sendPasswordResetEmail = async (email, resetURL)=>{
    const recipient =[{email}];
    try {
        const reasons = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html:PASSWORD_RESET_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset Request"

            
        });
        
    } catch (error) {
        console.error("Error sending password reset email", error);
        


        
    }

}

//send a password rest success email
export const sendPasswordResetSuccessEmail = async (email)=>{
    const recipient =[{email}];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Success",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success"
        });
        //
        console.log("Password Reset Success Email Sent Successfully", response);

    }

    catch(error){
        console.error( error.message);
    }

}