import PropTypes from 'prop-types';
import {
  Badge,
  Box,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Skeleton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import EmptyState from '../components/common/EmptyState';
import { getMessages } from '../services/messages';

dayjs.extend(relativeTime);

const MessagesPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({ queryKey: ['messages'], queryFn: getMessages });
  const messages = data ?? [];
  const unreadCount = messages.filter((msg) => msg.unread).length;

  const handleRefresh = () => {
    refetch();
  };

  const handleMarkAll = () => {
    queryClient.setQueryData(['messages'], (old = []) => old.map((msg) => ({ ...msg, unread: false })));
  };

  return (
    <Stack spacing={4} component="section" aria-label="Messages">
      <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Messages
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stay connected with students and staff.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh">
            <IconButton color="primary" onClick={handleRefresh} aria-label="Refresh inbox">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mark all as read">
            <IconButton color="secondary" onClick={handleMarkAll} aria-label="Mark all as read">
              <MarkEmailReadIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Card>
        <CardContent>
          {isLoading ? (
            <Stack spacing={2}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} variant="rounded" height={64} />
              ))}
            </Stack>
          ) : messages.length === 0 ? (
            <EmptyState
              title="Inbox zero"
              description="There are no messages waiting. Enjoy the quiet while it lasts."
            />
          ) : (
            <List>
              {messages.map((message) => (
                <ListItem key={message.id} divider alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {message.sender}
                        </Typography>
                        {message.unread && <Badge color="secondary" variant="dot" />}
                      </Stack>
                    }
                    secondary={`${message.subject} • ${dayjs(message.receivedAt).format('MMM D, h:mm A')}`}
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(message.receivedAt).fromNow()}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="flex-end">
        <ChipWithCount count={unreadCount} />
      </Box>
    </Stack>
  );
};

const ChipWithCount = ({ count }) => {
  return (
    <Badge color="secondary" badgeContent={count} max={99} overlap="circular">
      <Typography variant="body2" color="text.secondary">
        {count} unread messages
      </Typography>
    </Badge>
  );
};

ChipWithCount.propTypes = {
  count: PropTypes.number.isRequired
};

export default MessagesPage;
