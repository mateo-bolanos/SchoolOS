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
  },
  draft: {
    border: theme.palette.info.main,
    text: theme.palette.info.dark,
    background: alpha(theme.palette.info.light, 0.22)
  },
  overdue: {
    border: theme.palette.error.main,
    text: theme.palette.error.dark,
    background: alpha(theme.palette.error.light, 0.25)
  }
});

const getStatusChipStyles = (status, theme) => {
  const palette = statusPaletteFactory(theme);
  const styles =
    palette[status] ?? {
      border: alpha(theme.palette.text.primary, 0.24),
      text: theme.palette.text.primary,
      background: alpha(theme.palette.text.primary, 0.08)
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
