'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { AdminNotificationMutations } from '@randomix/graphql-schema';

const { ADMIN_SEND_BROADCAST_NOTIFICATION } = AdminNotificationMutations;

interface UseBroadcastFormOptions {
  onSent: () => void;
}

export function useBroadcastForm({ onSent }: UseBroadcastFormOptions) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const [sendBroadcast, { loading: sending, error }] = useMutation(ADMIN_SEND_BROADCAST_NOTIFICATION);

  const send = async () => {
    await sendBroadcast({ variables: { title, body: body || undefined } });
    setTitle('');
    setBody('');
    onSent();
  };

  return { title, setTitle, body, setBody, send, sending, error };
}
