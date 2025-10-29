import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import tokens from './tokens.json';

const resolveToken = (token) => {
  if (token == null) {
    return token;
  }

  if (typeof token === 'object' && 'value' in token) {
    return resolveToken(token.value);
  }

  if (typeof token === 'string') {
    const match = token.match(/^\{(.+)\}$/);
    if (match) {
      const path = match[1].split('.');
      let current = tokens;
      for (const key of path) {
        current = current?.[key];
        if (current == null) {
          break;
        }
      }
      return resolveToken(current);
    }

    return token;
  }

  return token;
};

const remToPx = (value) => {
  if (typeof value !== 'string' || !value.endsWith('rem')) {
    return Number(value) || 0;
  }

  const numeric = Number.parseFloat(value.replace('rem', ''));
  return Number.isNaN(numeric) ? 0 : Math.round(numeric * 16);
};

const createSpacing = () => {
  const base = remToPx(resolveToken(tokens.spacing.sm)) / 16 || 0.5;

  return (factor) => `${base * factor}rem`;
};

const createScholarTheme = () => {
  const palette = tokens.color;
  const typography = tokens.typography;
  const motion = tokens.motion;
  const radius = tokens.radius;
  const elevation = tokens.elevation;

  const theme = createTheme({
    spacing: createSpacing(),
    palette: {
      mode: 'light',
      primary: {
        main: resolveToken(palette.primary.default),
        light: resolveToken(palette.primary.hover),
        dark: resolveToken(palette.primary.active),
        contrastText: resolveToken(palette.primary.on)
      },
      secondary: {
        main: resolveToken(palette.accent.default),
        light: resolveToken(palette.accent.hover),
        dark: resolveToken(palette.accent.active),
        contrastText: resolveToken(palette.accent.on)
      },
      success: {
        main: resolveToken(palette.success.default),
        light: resolveToken(palette.success.surface),
        contrastText: resolveToken(palette.success.on)
      },
      error: {
        main: resolveToken(palette.danger.default),
        light: resolveToken(palette.danger.surface),
        contrastText: resolveToken(palette.danger.on)
      },
      background: {
        default: resolveToken(palette.surface.muted),
        paper: resolveToken(palette.surface.base)
      },
      text: {
        primary: resolveToken(palette.text.default),
        secondary: resolveToken(palette.text.muted)
      },
      divider: resolveToken(palette.border.default)
    },
    shape: {
      borderRadius: remToPx(resolveToken(radius.lg))
    },
    typography: {
      fontFamily: resolveToken(typography.fontFamily.base),
      fontWeightRegular: resolveToken(typography.weight.regular),
      fontWeightMedium: resolveToken(typography.weight.medium),
      fontWeightSemiBold: resolveToken(typography.weight.semibold),
      fontWeightBold: resolveToken(typography.weight.bold),
      h1: {
        fontFamily: resolveToken(typography.fontFamily.brand),
        fontWeight: resolveToken(typography.weight.bold),
        fontSize: typography.scale['3xl'].fontSize,
        lineHeight: typography.scale['3xl'].lineHeight,
        letterSpacing: typography.letterSpacing.tight.value
      },
      h2: {
        fontFamily: resolveToken(typography.fontFamily.brand),
        fontWeight: resolveToken(typography.weight.semibold),
        fontSize: typography.scale['2xl'].fontSize,
        lineHeight: typography.scale['2xl'].lineHeight,
        letterSpacing: typography.letterSpacing.tight.value
      },
      h3: {
        fontWeight: resolveToken(typography.weight.semibold),
        fontSize: typography.scale.xl.fontSize,
        lineHeight: typography.scale.xl.lineHeight
      },
      h4: {
        fontWeight: resolveToken(typography.weight.semibold),
        fontSize: typography.scale.lg.fontSize,
        lineHeight: typography.scale.lg.lineHeight
      },
      subtitle1: {
        fontWeight: resolveToken(typography.weight.medium),
        fontSize: typography.scale.md.fontSize,
        lineHeight: typography.scale.md.lineHeight
      },
      subtitle2: {
        fontWeight: resolveToken(typography.weight.medium),
        fontSize: typography.scale.sm.fontSize,
        lineHeight: typography.scale.sm.lineHeight
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
        fontWeight: resolveToken(typography.weight.semibold)
      }
    },
    shadows: Array.from({ length: 25 }, (_, index) => {
      if (index === 0) return 'none';
      if (index === 1) return elevation.level1.shadow;
      if (index === 2) return elevation.level2.shadow;
      if (index === 3) return elevation.level3.shadow;
      return elevation.level2.shadow;
    }),
    transitions: {
      duration: {
        shortest: Number.parseInt(resolveToken(motion.duration.swift), 10) || 120,
        shorter: Number.parseInt(resolveToken(motion.duration.standard), 10) || 180,
        short: Number.parseInt(resolveToken(motion.duration.deliberate), 10) || 240,
        standard: Number.parseInt(resolveToken(motion.duration.deliberate), 10) || 240,
        complex: (Number.parseInt(resolveToken(motion.duration.deliberate), 10) || 240) + 120,
        enteringScreen: Number.parseInt(resolveToken(motion.duration.standard), 10) || 180,
        leavingScreen: Number.parseInt(resolveToken(motion.duration.swift), 10) || 120
      },
      easing: {
        easeInOut: resolveToken(motion.easing.standard),
        easeOut: resolveToken(motion.easing.standard),
        easeIn: resolveToken(motion.easing.exit),
        sharp: resolveToken(motion.easing.emphasized)
      }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: remToPx(resolveToken(radius.md)),
            textTransform: 'none',
            fontWeight: resolveToken(typography.weight.semibold),
            padding: `${resolveToken(tokens.spacing.xs)} ${resolveToken(tokens.spacing.lg)}`
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: remToPx(resolveToken(radius.lg)),
            boxShadow: elevation.level1.shadow
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: resolveToken(palette.primary.default),
            color: resolveToken(palette.primary.on),
            boxShadow: 'none',
            borderBottom: `1px solid ${resolveToken(palette.border.default)}`
          }
        }
      },
      MuiLink: {
        styleOverrides: {
          root: ({ ownerState, theme: muiTheme }) => ({
            color: ownerState.color === 'inherit' ? 'inherit' : resolveToken(palette.text.link),
            fontWeight: muiTheme.typography.fontWeightMedium,
            '&:hover': {
              color: resolveToken(palette.text.linkHover)
            }
          })
        }
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            borderRight: `1px solid ${resolveToken(palette.border.default)}`,
            boxShadow: 'none'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: remToPx(resolveToken(radius.lg)),
            boxShadow: elevation.level1.shadow,
            border: `1px solid ${resolveToken(palette.border.default)}`
          }
        }
      }
    }
  });

  return responsiveFontSizes(theme);
};

const theme = createScholarTheme();

export { createScholarTheme };
export default theme;
