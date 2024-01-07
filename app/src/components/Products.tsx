// React resources
import { Key, useEffect, useState } from 'react';

// Sanity client
import client from '../utils/client';

// MUI resources
import { Alert, CircularProgress, Grid } from '@mui/material';

// Project resources
import DashboardProduct from './DashboardProduct';
import { getError } from '../utils/utils';
import { ApiError } from '../typings/ApiError';
import i18n from '../../i18n';

export default function Products() {

	const [productState, setProductState] = useState<any>({
		products: [],
		error: '',
		loading: true,
	});

	const { products, error, loading } = productState;

	useEffect(() => {
		const fetchData = async () => {
			try {
				var products
				if (i18n.language === 'en-EN') {
					products = await client.fetch(`*[_type == "product" && language == "en"]`);
				} else if (i18n.language === 'es-ES') {
					products = await client.fetch(`*[_type == "product" && language == "es"]`)
				}
				setProductState({ products, loading: false, error: '' });
			} catch (err) {
				setProductState({ products: [], loading: false, error: getError(err as ApiError) });
			}
		};
		fetchData();
	}, []);

	return (
		<>
			{loading ? (
				<CircularProgress />
			) : error ? (
				<Alert severity="error"> {getError(error as unknown as ApiError)} </Alert>
			) : (
				<Grid container spacing={3}>
					{products.map((product: { slug: { current: Key | null | undefined; }; }) => (
						<Grid item md={4} key={product.slug.current}>
							{/* Productos: */}
							<DashboardProduct product={product}></DashboardProduct>
						</Grid>
					))}
				</Grid>
			)}
		</>
	);
}
