import useTitle from '../hooks/useTitle';
import Layout from '../layouts/Layout';
import Combos from '../components/Combos';
// import QRCode from 'react-qr-code';
import { useEffect } from 'react';
import QRCode from 'qrcode'
import { Grid, Typography } from '@mui/material';
import getBase64 from '../hooks/getBase64';
export default function AllProductsPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  useTitle(title + subtitle);
  var elqr: string;
  useEffect(() => {
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
      console.log('intermedio ', result);

    }
    // b()
    // console.log('ahora? ', b());

    // const qere = document.getElementById('qrprueba')
    // QRCode.toDataURL('prueba', { type: 'image/png' }).then(img => {
    //   elqr = img
    //   console.log(elqr);
    //   //TODO:  Esto me da el qr del texto 'prueba' como base64. 
    //   // Hacerlo para el código de reserva con el tag <img> de html
    //   // en el correo que se le manda.
    // })
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
            {elqr}
          </Typography>
        </Grid>
        {/* <QRCode value='prueba' id='qrprueba'></QRCode> */}
        <Combos />

      </Layout>
    </>
  );
}
