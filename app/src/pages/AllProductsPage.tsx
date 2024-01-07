import Products from '../components/Products';
import useTitle from '../hooks/useTitle';
import Layout from '../layouts/Layout';
export default function AllProductsPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  // const { mutateAsync: sendResetEmail } = useResetPasswordEmail()
  useTitle(title + subtitle);

  // TODO: Checkbox y que aparezca el elegir sala y butaca. Probar que se refleje en la BBDD
  // TODO: Traducciones
  // TODO: Borrar Stripe?
  // TODO: Pagar en efectivo y estados de pedido?m

  return (
    <>
      <Layout title="appetizers" description="all appetizers">
        <Products />
      </Layout>
    </>
  );
}
