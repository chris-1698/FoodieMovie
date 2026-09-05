import Products from '../components/Products';
import useTitle from '../hooks/useTitle';
import Layout from '../layouts/Header';
export default function AllProductsPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  // const { mutateAsync: sendResetEmail } = useResetPasswordEmail()
  useTitle(title + subtitle);

  return (
    <>
      <Layout title="appetizers" description="all appetizers">
        <Products />
      </Layout>
    </>
  );
}
