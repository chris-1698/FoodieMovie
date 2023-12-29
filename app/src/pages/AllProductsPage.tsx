import useTitle from '../hooks/useTitle';
import Layout from '../layouts/Layout';
import Combos from '../components/Combos';
// import QRCode from 'react-qr-code';
import { useEffect } from 'react';
import QRCode from 'qrcode'
import ResetPasswordEmail from '../emailTemplates/passwordchange';
import { Grid, Typography } from '@mui/material';
import getBase64 from '../hooks/getBase64';
import { useResetPasswordEmail } from '../hooks/emailHooks';
import { Resend } from 'resend'
export default function AllProductsPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  // const { mutateAsync: sendResetEmail } = useResetPasswordEmail()
  useTitle(title + subtitle);
  var elqr: string;

  const resend = new Resend('re_6tKwwY5F_KVzJejsCiRjEaSkhUaU4Csz8');

  function prueba(name: string, email: string, language: string, url: string) {
    // useResetPasswordEmail(name, email, language, url);


  }
  useEffect(() => {
    console.log('Antes de enviar correo');

    resend.emails.send({
      from: 'foodiemoviecontact@gmail.com',
      to: 'letmechooseanemail1135@gmail.com',
      subject: 'aaa',
      html: '<strong>aaa</strong>'
    });
    console.log('Después de enviar correo');
    // var b: string = 'nothing';
    const a = getBase64('prueba').then((response) => {
      return response
    }
    )
    // .then(img => {
    // b = img
    // })
    // console.log('probabndo', a);
    // console.log('result', b);


    const b = async () => {
      const result = await a;
      console.log('intermedio ', result); //en base64
      // prueba('nombre', 'christopher_1698@hotmail.com', 'esp', result)

    }
    b()
    // console.log('ahora? ', b());

    const qere = document.getElementById('qrprueba')
    QRCode.toDataURL('prueba', { type: 'image/png' }).then(img => {
      elqr = img
      console.log('qué es esto ', elqr);
      //   //TODO:  Esto me da el qr del texto 'prueba' como base64. 
      //   // Hacerlo para el código de reserva con el tag <img> de html
      //   // en el correo que se le manda.
    })
    // const pngurl = qere.toDataURL('image/png')
    // QRCode
  }, [])

  return (
    <>
      <Layout title="appetizers" description="all appetizers">
        <Grid bgcolor={'red'}>
          {/* {elqr} */}
          <Typography>
            AAAAAAAAA
            {/* {elqr} */}
          </Typography>
        </Grid>
        {/* <QRCode value='prueba' id='qrprueba'></QRCode> */}
        <Combos />

      </Layout>
    </>
  );
}
