import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

const EmptyState = ({ title, description, action }) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 6,
        px: 3,
        borderRadius: 3,
        border: '1px dashed',
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" maxWidth={480} mx="auto">
        {description}
      </Typography>
      {action ? <Box mt={3}>{action}</Box> : null}
    </Box>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.node
};

export default EmptyState;
