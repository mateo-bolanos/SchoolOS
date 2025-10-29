import {
  Badge,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import dayjs from '../lib/dayjs';
import useMessages from '../features/messages/useMessages';
import EmptyState from '../components/common/EmptyState';

const srOnly = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0
};

const MessagesSkeleton = () => (
  <Stack spacing={3}>
    <Typography component="h1" sx={srOnly}>
      Loading messages
    </Typography>
    <Skeleton variant="text" width="40%" />
    {Array.from({ length: 3 }).map((_, index) => (
      <Skeleton key={`message-skeleton-${index}`} variant="rectangular" height={100} sx={{ borderRadius: 3 }} />
    ))}
  </Stack>
);

const MessagesPage = () => {
  const { data, isLoading, isError, refetch } = useMessages();

  if (isLoading) {
    return <MessagesSkeleton />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Messages unavailable"
        description="We can't show your inbox right now. Please try again soon."
        actionLabel="Retry"
        onAction={refetch}
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="Inbox zero"
        description="You're all caught up. We'll notify you when new messages arrive."
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Messages
      </Typography>
      <Stack spacing={2}>
        {data.map((message) => (
          <Card key={message.id} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardActionArea>
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color={message.unread ? 'primary.main' : 'text.primary'}>
                      {message.subject}
                    </Typography>
                    <Chip size="small" variant="outlined" label={dayjs(message.lastMessageAt).fromNow()} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {message.participants.join(', ')}
                  </Typography>
                  <Box>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {message.preview}
                    </Typography>
                  </Box>
                  {message.unread ? (
                    <Badge color="primary" badgeContent="" variant="dot" sx={{ alignSelf: 'flex-start' }}>
                      <Typography variant="caption" color="primary">
                        Unread
                      </Typography>
                    </Badge>
                  ) : null}
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};

export default MessagesPage;
