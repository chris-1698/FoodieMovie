//Clerk resources
import { UserProfile } from '@clerk/clerk-react';

//Project resources
import Layout from '../layouts/Layout';
import useTitle from '../hooks/useTitle';

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
