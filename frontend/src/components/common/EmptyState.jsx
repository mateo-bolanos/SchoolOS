import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInboxRounded';

const EmptyState = ({ title, description, actionLabel, onAction, icon }) => {
  return (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 3,
        px: 4,
        py: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 2,
        bgcolor: 'background.paper'
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          display: 'grid',
          placeItems: 'center'
        }}
      >
        {icon || <InboxIcon fontSize="large" />}
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
      {actionLabel && onAction ? (
        <Button variant="contained" color="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Box>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  icon: PropTypes.node
};

EmptyState.defaultProps = {
  actionLabel: undefined,
  onAction: undefined,
  icon: null
};

export default EmptyState;
