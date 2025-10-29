import { alpha } from '@mui/material/styles';

const statusPaletteFactory = (theme) => ({
  grading: {
    border: theme.palette.warning.main,
    text: theme.palette.warning.dark,
    background: alpha(theme.palette.warning.light, 0.25)
  },
  submitted: {
    border: theme.palette.success.main,
    text: theme.palette.success.dark,
    background: alpha(theme.palette.success.light, 0.25)
  },
  open: {
    border: theme.palette.info.main,
    text: theme.palette.info.dark,
    background: alpha(theme.palette.info.light, 0.25)
  }
});

const getStatusChipStyles = (status, theme) => {
  const palette = statusPaletteFactory(theme);
  const styles = palette[status] ?? {
    border: theme.palette.divider,
    text: theme.palette.text.secondary,
    background: 'transparent'
  };

  return {
    textTransform: 'capitalize',
    fontWeight: 600,
    color: styles.text,
    borderColor: styles.border,
    backgroundColor: styles.background,
    '& .MuiChip-label': {
      color: 'inherit',
      fontWeight: 600,
      px: 1
    }
  };
};

export default getStatusChipStyles;
