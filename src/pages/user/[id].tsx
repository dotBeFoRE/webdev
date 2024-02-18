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
import { useSession } from 'next-auth/react';
import Layout from '../../components/Layout';
import { api } from '../../utils/api';
import { editUserSchema } from '../../schemas/zodSchema';
import { LoggedInCheck } from '../../components/Check';

const UserPage = () => {
  const router = useRouter();
  const session = useSession();

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

  const { mutate: editUser } = api.users.edit.useMutation({
    onSuccess: () => {
      setIsEditing(false);
    },
    onSettled: () => {
      void context.users.invalidate();
    },
  });

  const { mutate: deleteUser } = api.users.delete.useMutation({
    onSuccess: () => {
      if (user?.id !== session.data?.user?.id) {
        void router.push('/user/all');
      } else {
        void document.location.reload();
      }
    },
    onSettled: () => {
      void context.users.invalidate();
    },
  });

  if (isLoading)
    return (
      <LoggedInCheck doRedirect={false}>
        <Layout>Loading...</Layout>
      </LoggedInCheck>
    );
  if (!user)
    return (
      <LoggedInCheck doRedirect={false}>
        <Layout>User not found</Layout>
      </LoggedInCheck>
    );

  return (
    <Layout>
      <LoggedInCheck doRedirect={false}>
        <Head>
          <title>{`${user.name || ''}'s profile`}</title>
        </Head>
        <div className="container m-5 my-auto flex flex-col place-items-stretch rounded bg-stone-800 p-5 md:mx-5">
          <div className="mb-0 place-content-center place-items-center gap-4 sm:mb-4 sm:flex">
            {user.image ? (
              <div className="mb-3 sm:mb-0">
                <Image
                  alt={user.name ? `${user.name}'s avatar` : 'Avatar'}
                  height={124}
                  width={124}
                  src={user.image}
                  className="mx-auto rounded-full sm:h-16 sm:w-16"
                />
              </div>
            ) : (
              <div className="h-[60px] w-[60px] rounded-full bg-stone-700" />
            )}
            {isEditing ? (
              <form
                onSubmit={handleSubmit((data) => {
                  editUser(data);
                })}
                className="place-content-center place-items-center gap-2 sm:flex">
                <input
                  type="text"
                  {...register('name')}
                  className="block w-full flex-auto rounded bg-stone-700 p-2 text-4xl text-stone-300"
                />
                <div className="flex place-content-center place-items-center sm:gap-2">
                  <button
                    type="submit"
                    aria-label="Save user"
                    disabled={!isValid}
                    className="p-4 disabled:cursor-not-allowed disabled:opacity-30 sm:p-0">
                    <CheckIcon className="h-6 w-6 text-stone-300" />
                  </button>
                  <button
                    type="button"
                    aria-label="Cancel edit"
                    onClick={() => cancelEdit()}
                    className="p-4 sm:p-0">
                    <XMarkIcon className="h-6 w-6 text-stone-300" />
                  </button>
                </div>
              </form>
            ) : (
              <h1 className="flex gap-2 text-4xl">
                <div className="flex flex-col">
                  {user.name}
                  <span className="text-base text-stone-500">{user.email}</span>
                </div>
                <button
                  type="button"
                  aria-label="Edit user"
                  onClick={() => startEditing()}>
                  <PencilSquareIcon className="h-6 w-6 text-stone-300" />
                </button>
              </h1>
            )}
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => {
                deleteUser(user.id);
              }}
              type="button"
              className="max-w-lg flex-auto rounded bg-red-900 p-3">
              Delete
            </button>
          </div>
        </div>
      </LoggedInCheck>
    </Layout>
  );
};

export default UserPage;
