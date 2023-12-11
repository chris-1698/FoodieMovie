import useTitle from '../hooks/useTitle';
import Layout from '../layouts/Layout';
import Combos from '../components/Combos';

export default function AllProductsPage({
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
