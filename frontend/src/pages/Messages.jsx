import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Fragment, useMemo, useState } from 'react';
import { SearchRounded, RefreshRounded } from '@mui/icons-material';
import EmptyState from '../components/states/EmptyState';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { listMessages } from '../services/messages';

const Messages = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [query, setQuery] = useState('');
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['messages'], queryFn: listMessages });

  const filteredMessages = useMemo(() => {
    if (!data?.length) {
      return [];
    }

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return data;
    }

    return data.filter((message) => {
      const haystack = `${message.subject} ${message.preview} ${message.from}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [data, query]);

  if (isLoading) {
    return (
      <Paper sx={{ p: 4 }}>
        <Skeleton variant="text" width="40%" height={38} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
        <Stack spacing={2} mt={3}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={`message-row-${index}`} variant="rectangular" height={72} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      </Paper>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Messages unavailable"
        description="We're unable to load new messages. Please try refreshing or check back later."
        action={
          <Tooltip title="Retry now">
            <IconButton color="primary" onClick={() => refetch()}>
              <RefreshRounded />
            </IconButton>
          </Tooltip>
        }
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} alignItems={{ md: 'center' }}>
        <Box flexGrow={1}>
          <Typography variant="h4" component="h1" gutterBottom>
            Messages
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Scan announcements and family communications without leaving your dashboard.
          </Typography>
        </Box>
        <TextField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search messages"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded fontSize="small" />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {filteredMessages.length ? (
        <Paper>
          <List disablePadding>
            {filteredMessages.map((message, index) => (
              <Fragment key={message.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    py: 2,
                    px: 3,
                    transition: prefersReducedMotion ? 'none' : 'background-color 180ms ease',
                    '&:hover': {
                      backgroundColor: prefersReducedMotion ? 'transparent' : 'action.hover'
                    }
                  }}
                >
                  <ListItemText
                    primary={message.subject}
                    secondary={
                      <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {`${message.from} • ${new Date(message.receivedAt).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {message.preview}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
                {index < filteredMessages.length - 1 ? <Divider component="li" /> : null}
              </Fragment>
            ))}
          </List>
        </Paper>
      ) : (
        <EmptyState
          title="No messages found"
          description="Try a different search term or clear the search to see all recent messages."
        />
      )}
    </Stack>
  );
};

export default Messages;
