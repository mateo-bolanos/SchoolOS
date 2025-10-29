import PropTypes from 'prop-types';
import { Box, Chip, Stack, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownwardRounded';

const TrendChip = ({ trend }) => {
  if (!trend) {
    return null;
  }

  const IconComponent = trend.direction === 'down' ? ArrowDownwardIcon : ArrowUpwardIcon;
  const color = trend.direction === 'down' ? 'error' : 'success';

  return (
    <Chip
      size="small"
      color={color}
      icon={<IconComponent fontSize="inherit" />}
      label={`${trend.direction === 'down' ? '-' : '+'}${trend.value}%`}
      sx={{
        fontWeight: 600,
        bgcolor: `${color}.light`,
        color: `${color}.dark`,
        '& .MuiChip-icon': {
          color: `${color}.dark`
        }
      }}
    />
  );
};

TrendChip.propTypes = {
  trend: PropTypes.shape({
    value: PropTypes.number.isRequired,
    direction: PropTypes.oneOf(['up', 'down']).isRequired
  })
};

TrendChip.defaultProps = {
  trend: null
};

const StatCard = ({ label, value, suffix, helperText, trend }) => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        px: 3,
        py: 3,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%'
      }}
    >
      <Stack spacing={2}>
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="baseline">
          <Typography variant="h3" fontWeight={700}>
            {value}
            {suffix ? <Typography component="span" variant="h5" color="text.secondary" sx={{ ml: 0.5 }}>{suffix}</Typography> : null}
          </Typography>
          <TrendChip trend={trend} />
        </Stack>
        {helperText ? (
          <Typography variant="body2" color="text.secondary">
            {helperText}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  suffix: PropTypes.string,
  helperText: PropTypes.string,
  trend: TrendChip.propTypes.trend
};

StatCard.defaultProps = {
  suffix: undefined,
  helperText: undefined,
  trend: null
};

export default StatCard;
