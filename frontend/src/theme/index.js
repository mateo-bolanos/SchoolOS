import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import tokens from './tokens.json';

const resolveToken = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const tokenRefMatch = value.match(/^\{(.+)}$/);
  if (!tokenRefMatch) {
    return value;
  }

  const path = tokenRefMatch[1].split('.');
  return path.reduce((acc, key) => (acc ? acc[key] : undefined), tokens) ?? value;
};

const remToPx = (remValue, fallback = 8) => {
  if (typeof remValue !== 'string') {
    return remValue ?? fallback;
  }

  const parsed = Number.parseFloat(remValue);
  return Number.isNaN(parsed) ? fallback : Math.round(parsed * 16);
};

const palette = tokens.color;
const typography = tokens.typography;
const radius = tokens.radius;
const motion = tokens.motion;

const baseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: resolveToken(palette.primary.default.value),
      light: resolveToken(palette.primary.hover.value),
      dark: resolveToken(palette.primary.active.value),
      contrastText: resolveToken(palette.primary.on.value)
    },
    secondary: {
      main: resolveToken(palette.accent.default.value),
      light: resolveToken(palette.accent.hover.value),
      dark: resolveToken(palette.accent.active.value),
      contrastText: resolveToken(palette.accent.on.value)
    },
    success: {
      main: resolveToken(palette.success.default.value),
      light: resolveToken(palette.palette.sage['200']),
      dark: resolveToken(palette.palette.sage['700']),
      contrastText: resolveToken(palette.success.on.value)
    },
    error: {
      main: resolveToken(palette.danger.default.value),
      light: resolveToken(palette.palette.crimson['200']),
      dark: resolveToken(palette.palette.crimson['700']),
      contrastText: resolveToken(palette.danger.on.value)
    },
    warning: {
      light: resolveToken(palette.palette.gold['200']),
      main: resolveToken(palette.palette.gold['400']),
      dark: resolveToken(palette.palette.gold['800']),
      contrastText: resolveToken(palette.text.inverse.value)
    },
    info: {
      light: resolveToken(palette.palette.ink['200']),
      main: resolveToken(palette.palette.ink['500']),
      dark: resolveToken(palette.palette.ink['800']),
      contrastText: resolveToken(palette.text.inverse.value)
    },
    background: {
      default: resolveToken(palette.surface.muted.value),
      paper: resolveToken(palette.surface.elevated.value)
    },
    text: {
      primary: resolveToken(palette.text.default.value),
      secondary: resolveToken(palette.text.muted.value)
    },
    divider: resolveToken(palette.border.default.value)
  },
  typography: {
    fontFamily: typography.fontFamily.base.value,
    h1: {
      fontFamily: typography.fontFamily.brand.value,
      fontSize: typography.scale['3xl'].fontSize,
      lineHeight: typography.scale['3xl'].lineHeight,
      fontWeight: typography.weight.bold.value,
      letterSpacing: typography.letterSpacing.tight.value
    },
    h2: {
      fontFamily: typography.fontFamily.brand.value,
      fontSize: typography.scale['2xl'].fontSize,
      lineHeight: typography.scale['2xl'].lineHeight,
      fontWeight: typography.weight.semibold.value,
      letterSpacing: typography.letterSpacing.tight.value
    },
    h3: {
      fontSize: typography.scale.xl.fontSize,
      lineHeight: typography.scale.xl.lineHeight,
      fontWeight: typography.weight.semibold.value
    },
    h4: {
      fontSize: typography.scale.lg.fontSize,
      lineHeight: typography.scale.lg.lineHeight,
      fontWeight: typography.weight.semibold.value
    },
    body1: {
      fontSize: typography.scale.md.fontSize,
      lineHeight: typography.scale.md.lineHeight
    },
    body2: {
      fontSize: typography.scale.sm.fontSize,
      lineHeight: typography.scale.sm.lineHeight
    },
    button: {
      fontWeight: typography.weight.semibold.value,
      letterSpacing: typography.letterSpacing.tight.value
    },
    subtitle1: {
      fontWeight: typography.weight.medium.value,
      fontSize: typography.scale.md.fontSize
    }
  },
  shape: {
    borderRadius: remToPx(radius.md.value)
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          subtitle1: 'p',
          subtitle2: 'p',
          body1: 'p',
          body2: 'p'
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: resolveToken(palette.surface.muted.value)
        },
        a: {
          color: resolveToken(palette.text.link.value),
          textDecoration: 'none'
        },
        'a:hover': {
          color: resolveToken(palette.text.linkHover.value)
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          borderRadius: radius.sm.value,
          textTransform: 'none',
          transition: `background-color ${resolveToken(motion.duration.standard.value)} ${resolveToken(motion.easing.standard.value)}, transform ${resolveToken(motion.duration.swift.value)} ${resolveToken(motion.easing.standard.value)}`
        }
      }
    },
    MuiPaper: {
      defaultProps: {
        elevation: 1
      },
      styleOverrides: {
        root: {
          borderRadius: radius.lg.value,
          boxShadow: tokens.elevation.level1.shadow
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.md.value,
          transition: `background-color ${resolveToken(motion.duration.swift.value)} ${resolveToken(motion.easing.standard.value)}`
        }
      }
    }
  }
});

const theme = responsiveFontSizes(baseTheme);

export default theme;
