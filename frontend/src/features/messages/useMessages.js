import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { withMockFallback } from '../../lib/fetcher';
import { messagesFixture } from '../../mocks/data';

const MessageSchema = z.object({
  id: z.string(),
  subject: z.string(),
  participants: z.array(z.string()),
  lastMessageAt: z.string(),
  unread: z.boolean(),
  preview: z.string()
});

const parseMessages = (payload) => z.array(MessageSchema).parse(payload);

export const fetchMessages = async () => {
  const data = await withMockFallback('/messages', () => messagesFixture);
  return parseMessages(data);
};

const useMessages = () => {
  return useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages
  });
};

export default useMessages;
