import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import tokens from './tokens.json';

const getTokenValue = (path) => {
  const segments = path
    .replace(/[{}]/g, '')
    .replace('color.', 'color.')
    .split('.');
  return segments.reduce((acc, key) => (acc ? acc[key] : undefined), tokens);
};

const resolveValue = (value) => {
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    const resolved = getTokenValue(value.slice(1, -1));
    if (resolved?.value) {
      return resolveValue(resolved.value);
    }
    return resolved;
  }
  return value;
};

const scholarTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: resolveValue(tokens.color.primary.default.value),
      light: resolveValue(tokens.color.palette.ink['400']),
      dark: resolveValue(tokens.color.palette.ink['800']),
      contrastText: resolveValue(tokens.color.primary.on.value)
    },
    secondary: {
      main: resolveValue(tokens.color.accent.default.value),
      light: resolveValue(tokens.color.palette.gold['300']),
      dark: resolveValue(tokens.color.palette.gold['600']),
      contrastText: resolveValue(tokens.color.accent.on.value)
    },
    success: {
      main: resolveValue(tokens.color.success.default.value),
      contrastText: resolveValue(tokens.color.success.on.value)
    },
    error: {
      main: resolveValue(tokens.color.danger.default.value),
      contrastText: resolveValue(tokens.color.danger.on.value)
    },
    background: {
      default: resolveValue(tokens.color.surface.muted.value),
      paper: resolveValue(tokens.color.surface.base.value)
    },
    text: {
      primary: resolveValue(tokens.color.text.default.value),
      secondary: resolveValue(tokens.color.text.muted.value)
    },
    divider: resolveValue(tokens.color.border.default.value)
  },
  typography: {
    fontFamily: resolveValue(tokens.typography.fontFamily.base.value),
    fontWeightMedium: resolveValue(tokens.typography.weight.medium.value),
    fontWeightBold: resolveValue(tokens.typography.weight.bold.value),
    h1: {
      fontFamily: resolveValue(tokens.typography.fontFamily.brand.value),
      fontWeight: resolveValue(tokens.typography.weight.bold.value),
      fontSize: tokens.typography.scale['3xl'].fontSize,
      lineHeight: tokens.typography.scale['3xl'].lineHeight,
      letterSpacing: tokens.typography.letterSpacing.tight.value
    },
    h2: {
      fontFamily: resolveValue(tokens.typography.fontFamily.brand.value),
      fontWeight: resolveValue(tokens.typography.weight.semibold.value),
      fontSize: tokens.typography.scale['2xl'].fontSize,
      lineHeight: tokens.typography.scale['2xl'].lineHeight,
      letterSpacing: tokens.typography.letterSpacing.tight.value
    },
    h3: {
      fontWeight: resolveValue(tokens.typography.weight.semibold.value),
      fontSize: tokens.typography.scale.xl.fontSize,
      lineHeight: tokens.typography.scale.xl.lineHeight
    },
    body1: {
      fontSize: tokens.typography.scale.md.fontSize,
      lineHeight: tokens.typography.scale.md.lineHeight
    },
    body2: {
      fontSize: tokens.typography.scale.sm.fontSize,
      lineHeight: tokens.typography.scale.sm.lineHeight
    },
    button: {
      textTransform: 'none',
      fontWeight: resolveValue(tokens.typography.weight.semibold.value)
    }
  },
  shape: {
    borderRadius: parseFloat(tokens.radius.lg.value)
  },
  spacing: (factor) => {
    const key = Object.keys(tokens.spacing)[factor] ?? 'md';
    return tokens.spacing[key]?.value ?? `${0.25 * factor}rem`;
  },
  shadows: [
    'none',
    tokens.elevation.level1.shadow,
    tokens.elevation.level2.shadow,
    tokens.elevation.level3.shadow,
    ...Array(21).fill(tokens.elevation.level1.shadow)
  ],
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.md.value,
          paddingInline: tokens.spacing.lg.value,
          paddingBlock: tokens.spacing.xs.value
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          borderRadius: tokens.radius.lg.value,
          backgroundColor: resolveValue(tokens.color.surface.base.value),
          boxShadow: tokens.elevation.level1.shadow,
          border: `1px solid ${resolveValue(tokens.color.border.default.value)}`
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: resolveValue(tokens.color.text.link.value),
          '&:hover': {
            color: resolveValue(tokens.color.text.linkHover.value)
          }
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: resolveValue(tokens.color.surface.muted.value)
        }
      }
    }
  }
});

const theme = responsiveFontSizes(scholarTheme);

export default theme;
