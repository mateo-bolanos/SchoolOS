import PropTypes from 'prop-types';
import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTimeRounded';
import RoomIcon from '@mui/icons-material/RoomRounded';
import dayjs from '../../../lib/dayjs';

const LessonRow = ({ lesson }) => {
  const start = dayjs(lesson.startTime).format('MMM D · h:mm A');
  const end = dayjs(lesson.endTime).format('h:mm A');

  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {lesson.title}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Chip size="small" color="primary" icon={<AccessTimeIcon fontSize="inherit" />} label={`${start} - ${end}`} />
          {lesson.room ? (
            <Chip size="small" variant="outlined" icon={<RoomIcon fontSize="inherit" />} label={lesson.room} />
          ) : null}
        </Stack>
      </Box>
    </Stack>
  );
};

LessonRow.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    room: PropTypes.string
  }).isRequired
};

const UpcomingLessonsCard = ({ lessons }) => {
  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" gutterBottom>
        Upcoming lessons
      </Typography>
      <Stack spacing={2} divider={<Divider flexItem />}> 
        {lessons.map((lesson) => (
          <LessonRow key={lesson.id} lesson={lesson} />
        ))}
      </Stack>
      {lessons.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No lessons scheduled.
        </Typography>
      ) : null}
    </Box>
  );
};

UpcomingLessonsCard.propTypes = {
  lessons: PropTypes.arrayOf(LessonRow.propTypes.lesson).isRequired
};

export default UpcomingLessonsCard;
