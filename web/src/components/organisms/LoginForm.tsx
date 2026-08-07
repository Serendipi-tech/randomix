'use client';

import { useActionState, useState } from 'react';
import { loginAdmin, type LoginAdminState } from '@/utils/loginAdmin';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/molecules/Input';
import { FormError } from '@/components/molecules/FormError';

const initialState: LoginAdminState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form action={formAction} className="flex w-full max-w-sm flex-col gap-4">
      <Input name="identifier" label="Email o username" value={identifier} onChangeText={setIdentifier} required />

      <Input name="password" variant="password" label="Password" value={password} onChangeText={setPassword} required />

      {state.error && <FormError message={state.error} />}

      <Button type="submit" label={isPending ? 'Accesso in corso…' : 'Accedi'} loading={isPending} />
    </form>
  );
}
