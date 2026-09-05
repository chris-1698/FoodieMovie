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
import ProductFilters from '../fragments/eCommerce/ProductFilters';
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
			<Skeleton variant="rectangular" height={220} sx={{ borderRadius: 1 }} />
			<Skeleton variant="text" width="50%" sx={{ fontSize: '1rem', mt: 1.5 }} />
			<Box display="flex" alignItems="center" mt={1}>
				<Skeleton variant="text" width={80} sx={{ fontSize: '0.875rem', ml: 0.5 }} />
			</Box>
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
	const [selectedCategory, setSelectedCategory] = useState<string>('all');

	const { products, error, loading } = productState;

	useEffect(() => {
		const fetchData = async () => {
			setProductState((prev: any) => ({ ...prev, loading: true }));
			try {
				const lang = i18n.language === 'en-EN' ? 'en' : 'es';

				const query =
					selectedCategory === 'all'
						? `*[_type == "product" && language == $lang]`
						: `*[_type == "product" && language == $lang && category == $category]`;

				const params =
					selectedCategory === 'all'
						? { lang }
						: { lang, category: selectedCategory };

				const products = await client.fetch(query, params);
				setProductState({ products, loading: false, error: '' });
			} catch (err) {
				setProductState({ products: [], loading: false, error: getError(err as ApiError) });
			}
		};
		fetchData();
	}, [i18n.language, selectedCategory]);

	return (
		<Box display="flex" flexDirection="column" flex={1} alignItems="center" justifyContent="center">
			<ProductFilters
				selectedCategory={selectedCategory}
				onCategoryChange={setSelectedCategory}
			/>

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