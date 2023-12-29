import { Button } from "@mui/material";
import { useState } from "react";
import { Resend } from "resend";
import { useResetEmail, useResetPasswordEmail } from "../hooks/emailHooks";

export default function Sandbox() {
  const [username, setUsername] = useState('nombr3')
  const [email, setEmail] = useState('letmechooseanemail1135@gmail.com')
  const resend = new Resend('re_CkmuhCpo_LNPrxSXfVvxdzxKsJiHLQuVw')
  const { mutateAsync: sendEmailres } = useResetEmail()


  const sendEmail = () => {

    console.log('Antes de enviar correo');

    sendEmailres({
      userFirstname: 'a',
      email: 'letmechooseanemail1135@gmail.com',
      language: 'esp',
      imageLink: 'www.google.com'
    })

    console.log('Después de enviar correo');
  }

  return (
    <>
      <Button
        onClick={sendEmail}
        variant="contained">
        Click
      </Button>
    </>
  )
}