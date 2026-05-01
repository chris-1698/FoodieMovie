// React resources
import { useEffect, useState } from 'react';
// Sanity client
import client from '../utils/client';
// MUI resources
import { Alert, Box, Grid, Skeleton } from '@mui/material';
// Project resources
import DashboardProduct from './DashboardProduct';
import { getError } from '../utils/utils';
import { ApiError } from '../typings/ApiError';
import i18n from '../../i18n';

function ProductSkeleton() {
	return (
		<Box
			sx={{
				border: '1px solid',
				borderColor: 'grey.800',
				borderRadius: 2,
				p: 2,
				bgcolor: 'grey.900',
			}}
		>
			{/* Imagen del producto */}
			<Skeleton variant="rectangular" height={220} sx={{ borderRadius: 1 }} />

			{/* Nombre del producto */}
			<Skeleton variant="text" width="50%" sx={{ fontSize: '1rem', mt: 1.5 }} />

			{/* Estrellas de valoración */}
			<Box display="flex" alignItems="center" mt={1}>
				<Skeleton variant="text" width={80} sx={{ fontSize: '0.875rem', ml: 0.5 }} />
			</Box>

			{/* Precio y botón */}
			<Box display="flex" justifyContent="space-between" alignItems="center" mt={1.5}>
				<Skeleton variant="text" width={60} sx={{ fontSize: '1.25rem' }} />
				<Skeleton variant="rounded" width={90} height={36} />
			</Box>
		</Box>
	);
}

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
				var products;
				if (i18n.language === 'en-EN') {
					products = await client.fetch(`*[_type == "product" && language == "en"]`);
				} else if (i18n.language === 'es-ES') {
					products = await client.fetch(`*[_type == "product" && language == "es"]`);
				}
				setProductState({ products, loading: false, error: '' });
			} catch (err) {
				setProductState({ products: [], loading: false, error: getError(err as ApiError) });
			}
		};
		fetchData();
	}, []);

	return (
		<Box display="flex" flex={1} alignItems="center" justifyContent="center">
			{loading ? (
				<Grid container spacing={3}>
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<Grid item md={4} key={i}>
							<ProductSkeleton />
						</Grid>
					))}
				</Grid>
			) : error ? (
				<Alert severity="error">{error}</Alert>
			) : (
				<Grid container spacing={3}>
					{products.map((product: any) => (
						<Grid item md={4} key={product.slug.current}>
							<DashboardProduct product={product} />
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	);
}