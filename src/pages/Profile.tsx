import { UserProfile } from '@clerk/clerk-react';
import Layout from '../layouts/Layout';
import useTitle from '../components/useTitle';

export default function Profile({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  useTitle(title + subtitle);
  return (
    <>
      <Layout title="profile" description="perfil del usuario">
        <UserProfile />
      </Layout>
    </>
  );
}
//TODO: Ver el asunto de la ruta /user/:id
