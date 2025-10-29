import PropTypes from 'prop-types';
import { Box, Button, Typography } from '@mui/material';

const EmptyState = ({ title, description, actionLabel, onAction }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 2,
        py: 6,
        px: 2,
        bgcolor: 'background.paper',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 3
      }}
    >
      <Typography variant="h6" component="h3">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" maxWidth={360}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" color="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func
};

export default EmptyState;
