import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useTranslation } from 'react-i18next';
interface EmptyStateProps {
  title: string;
  subtitle: string;
  hasSubtitleLink?: boolean;
  hrefSubtitle?: string;
}
const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  hasSubtitleLink,
  hrefSubtitle
}) => {
  const { t } = useTranslation();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      textAlign="center"
      p={4}
    >
      <ShoppingCartOutlinedIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography
        variant="h6"
        color="text.secondary"
        fontWeight={'bold'}>
        {title}
      </Typography>
      {hasSubtitleLink ? (
        <Link
          href={hrefSubtitle}
          variant='subtitle1'
        >{subtitle}</Link>
      ) : (

        <Typography
          variant="subtitle1"
          color={'text.secondary'}
        >
          {t('allOrders.emptyStateDescription')}
        </Typography>
      )}
    </Box>
  );
};

export default EmptyState;
