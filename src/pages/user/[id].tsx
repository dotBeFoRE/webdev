import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { api } from '../../utils/api';
import { editUserSchema } from '../../schemas/zodSchema';

const UserPage = () => {
  const router = useRouter();

  const id = typeof router.query.id === 'string' ? router.query.id : 'unknown';

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<z.infer<typeof editUserSchema>>({
    mode: 'onTouched',
    resolver: zodResolver(editUserSchema),
    values: {
      id,
    },
  });

  if (typeof id !== 'string')
    return (
      <Layout>
        <p>Error</p>
      </Layout>
    );

  const { data: user, isLoading } = api.users.get.useQuery(id);

  const startEditing = () => {
    setIsEditing(true);
    setValue('name', getValues('name') || user?.name || '');
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const context = api.useContext();
  const { mutate } = api.users.edit.useMutation({
    onSuccess: () => {
      setIsEditing(false);
    },
    onSettled: () => {
      void context.users.invalidate();
    },
  });

  if (isLoading) return <Layout>Loading...</Layout>;
  if (!user) return <Layout>User not found</Layout>;

  return (
    <Layout>
      <Head>
        <title>{`${user.name || ''}'s profile`}</title>
      </Head>
      <div className="container rounded bg-stone-800 p-5 md:mx-5">
        <div className="flex place-content-center place-items-center gap-4">
          {user.image ? (
            <div>
              <Image
                alt={user.name ? `${user.name}'s avatar` : 'Avatar'}
                height={60}
                width={60}
                src={user.image}
                className="rounded-full"
              />
            </div>
          ) : (
            <div className="h-[60px] w-[60px] rounded-full bg-stone-700" />
          )}
          {isEditing ? (
            <form
              onSubmit={handleSubmit((data) => {
                mutate(data);
              })}
              className="flex place-content-center place-items-center gap-2">
              <input
                type="text"
                {...register('name')}
                className="rounded bg-stone-700 p-2 text-4xl text-stone-300"
              />
              <button
                type="submit"
                aria-label="Save user"
                disabled={!isValid}
                className="disabled:cursor-not-allowed disabled:opacity-30">
                <CheckIcon className="h-6 w-6 text-stone-300" />
              </button>
              <button
                type="button"
                aria-label="Cancel edit"
                onClick={() => cancelEdit()}>
                <XMarkIcon className="h-6 w-6 text-stone-300" />
              </button>
            </form>
          ) : (
            <>
              <h1 className="text-4xl">{user.name}</h1>
              <button
                type="button"
                aria-label="Edit user"
                onClick={() => startEditing()}>
                <PencilSquareIcon className="h-6 w-6 text-stone-300" />
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserPage;
