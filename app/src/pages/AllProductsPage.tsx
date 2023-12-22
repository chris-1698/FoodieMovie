import useTitle from '../hooks/useTitle';
import Layout from '../layouts/Layout';
import Combos from '../components/Combos';
// import QRCode from 'react-qr-code';
import { useEffect } from 'react';
import QRCode from 'qrcode'
export default function AllProductsPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  useTitle(title + subtitle);
  useEffect(() => {
    const qere = document.getElementById('qrprueba')
    // const pngurl = qere.toDataURL('image/png')
    // QRCode
  }, [])

  return (
    <>
      <Layout title="appetizers" description="all appetizers">
        {/* <QRCode value='prueba' id='qrprueba'></QRCode> */}
        <Combos />

      </Layout>
    </>
  );
}
