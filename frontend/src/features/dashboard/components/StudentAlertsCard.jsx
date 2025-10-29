import PropTypes from 'prop-types';
import { Avatar, Box, Chip, Divider, Stack, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownIcon from '@mui/icons-material/TrendingDownRounded';

const StudentRow = ({ student }) => {
  const TrendIcon = student.trend === 'up' ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar alt={student.name} src={`https://i.pravatar.cc/64?u=${student.id}`} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {student.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {student.indicator}
        </Typography>
      </Box>
      <Chip
        label={student.status}
        icon={<TrendIcon fontSize="small" />}
        color={student.trend === 'up' ? 'success' : 'warning'}
        variant={student.trend === 'up' ? 'outlined' : 'filled'}
        sx={{ fontWeight: 600 }}
      />
    </Stack>
  );
};

StudentRow.propTypes = {
  student: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    indicator: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    trend: PropTypes.oneOf(['up', 'down', 'stable'])
  }).isRequired
};

const StudentAlertsCard = ({ students }) => {
  if (students.length === 0) {
    return (
      <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          Student insights
        </Typography>
        <Typography variant="body2" color="text.secondary">
          All students are on track.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" gutterBottom>
        Students needing attention
      </Typography>
      <Stack spacing={2} divider={<Divider flexItem />}> 
        {students.map((student) => (
          <StudentRow key={student.id} student={student} />
        ))}
      </Stack>
    </Box>
  );
};

StudentAlertsCard.propTypes = {
  students: PropTypes.arrayOf(StudentRow.propTypes.student).isRequired
};

export default StudentAlertsCard;
