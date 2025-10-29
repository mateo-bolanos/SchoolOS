import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

if (!dayjs.$isExtendedRelativeTime) {
  dayjs.extend(relativeTime);
  dayjs.$isExtendedRelativeTime = true;
}

export default dayjs;
