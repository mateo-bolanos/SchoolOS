import PropTypes from 'prop-types';
import { Box, Grid, Stack, Typography } from '@mui/material';

const HighlightItem = ({ highlight }) => {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        p: 2.5,
        bgcolor: 'background.default'
      }}
    >
      <Typography variant="overline" color="text.secondary">
        {highlight.title}
      </Typography>
      <Typography variant="h4" fontWeight={700}>
        {highlight.metric}
      </Typography>
      {highlight.detail ? (
        <Typography variant="body2" color="text.secondary">
          {highlight.detail}
        </Typography>
      ) : null}
    </Box>
  );
};

HighlightItem.propTypes = {
  highlight: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    metric: PropTypes.string.isRequired,
    detail: PropTypes.string
  }).isRequired
};

const HighlightsCard = ({ highlights }) => {
  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3, border: '1px solid', borderColor: 'divider' }}>
      <Stack spacing={2}>
        <Typography variant="h6">Program highlights</Typography>
        <Grid container spacing={2}>
          {highlights.map((highlight) => (
            <Grid item xs={12} sm={6} key={highlight.id}>
              <HighlightItem highlight={highlight} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};

HighlightsCard.propTypes = {
  highlights: PropTypes.arrayOf(HighlightItem.propTypes.highlight).isRequired
};

export default HighlightsCard;
