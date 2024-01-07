import { Button, Typography } from "@mui/material";
import { useState } from "react";
// import { useResetEmail, useResetPasswordEmail } from "../hooks/emailHooks";
// import { google } from 'googleapis'
// import send from 'gmail-send'
import accountTransport from '../../account_transport.json';

// TODO: Quitar Nodemailer. El problema me lo da al importarlo,
// parece. ¿Otra alternativa? ¿Versión anterior?

export default function Sandbox() {


  // const mail_fm = async (callback: Function) => {
  //   // const oauth2Client = new OAuth2(
  //   //   accountTransport.auth.clientId,
  //   //   accountTransport.auth.clientSecret,
  //   //   'https://developers.google.com/oauthplayground',
  //   // );
  //   oauth2Client.setCredentials({
  //     refresh_token: accountTransport.auth.refreshToken,

  //   })
  //   oauth2Client.getAccessToken((err, token) => {
  //     if (err)
  //       return console.log(err);
  //     accountTransport.auth.accessToken = token || '';
  //     callback(nodemailer.createTransport(accountTransport))

  //   })
  // }

  return (
    <>
      <Typography> Página de pruebas </Typography>
    </>
  )
}