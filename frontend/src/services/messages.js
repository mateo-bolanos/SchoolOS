import { z } from 'zod';
import { fetchJson } from '../lib/fetcher';
import { inboxMessages as messageFixtures } from '../fixtures/messages';

const messageSchema = z.array(
  z.object({
    id: z.string(),
    sender: z.string(),
    subject: z.string(),
    receivedAt: z.string(),
    unread: z.boolean()
  })
);

const useFixtures = import.meta.env.VITE_USE_FIXTURES === 'true';

export const getMessages = async () => {
  if (useFixtures) {
    return messageSchema.parse(messageFixtures);
  }

  try {
    return await fetchJson('/messages', { schema: messageSchema });
  } catch (error) {
    return messageSchema.parse(messageFixtures);
  }
};

export default getMessages;
