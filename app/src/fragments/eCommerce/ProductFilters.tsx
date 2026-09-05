// React resources
import { useEffect, useState } from 'react';
import client from '../../utils/client';
import { Chip, Skeleton, Stack } from '@mui/material';
import i18n from '../../../i18n';

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

function FiltersSkeleton() {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
      <Skeleton variant="rounded" width={70} height={32} sx={{ borderRadius: 16 }} />
      <Skeleton variant="rounded" width={90} height={32} sx={{ borderRadius: 16 }} />
      <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: 16 }} />
      <Skeleton variant="rounded" width={100} height={32} sx={{ borderRadius: 16 }} />
    </Stack>
  );
}

export default function ProductFilters({
  selectedCategory,
  onCategoryChange,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Traemos las categorías reales existentes en Sanity, según el idioma
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const lang = i18n.language === 'en-EN' ? 'en' : 'es';
        const result = await client.fetch(
          `*[_type == "product" && language == $lang].category`,
          { lang }
        );
        // Deduplicamos y quitamos valores vacíos/nulos en JS
        const uniqueCategories: string[] = Array.from(
          new Set(result.filter((c: string) => !!c))
        );
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [i18n.language]);

  if (loading) {
    return <FiltersSkeleton />;
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
      <Chip
        label="Todas"
        color={selectedCategory === 'all' ? 'primary' : 'default'}
        onClick={() => onCategoryChange('all')}
      />
      {categories.map((cat) => (
        <Chip
          key={cat}
          label={cat}
          color={selectedCategory === cat ? 'primary' : 'default'}
          onClick={() => onCategoryChange(cat)}
        />
      ))}
    </Stack>
  );
}