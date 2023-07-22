import useTitle from '../components/useTitle';

import { useTranslation } from 'react-i18next';
import Layout from '../layouts/Layout';
import Combos from '../components/Combos';

export default function AllCombosPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  useTitle(title + subtitle);

  return (
    <>
      <Layout title="appetizers" description="all appetizers">
        <Combos />
      </Layout>
    </>
  );
}
