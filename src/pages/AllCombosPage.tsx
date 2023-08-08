import useTitle from '../hooks/useTitle';

import Layout from '../layouts/Layout';
import Combos from '../components/Combos';
import { useSession } from '@clerk/clerk-react';
import Cookies from 'js-cookie';
// import jwt from "jsonwebtoken";

export default function AllCombosPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  // const publicKey = process.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;
  const thisSession = useSession();
  try {
    const token = thisSession.session?.getToken({
      template: 'foodie-movie-jwt',
    });
    console.log('El bendito token alv: ', token);
  } catch (e) {
    console.log(e.message);
  }
  // const publicKey = process.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;
  // const sessToken = Cookies.get('__session');
  // const
  //TODO: 26/7/2023: Ver lo de JWT para el backend y crear pedidos.
  useTitle(title + subtitle);

  return (
    <>
      <Layout title="appetizers" description="all appetizers">
        <Combos />
      </Layout>
    </>
  );
}
