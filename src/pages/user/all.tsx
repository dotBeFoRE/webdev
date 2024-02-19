import { Listbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/solid';
import type { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import ContentLoader from 'react-content-loader';
import ModeratorCheck from '../../components/Check';
import Layout from '../../components/Layout';
import { api } from '../../utils/api';

const userTypes = [
  {
    value: false,
    name: 'User',
  },
  {
    value: true,
    name: 'Moderator',
  },
] as const;

const UserItem = ({
  user: {
    name,
    email,
    image,
    emailVerified,
    isBanned,
    id,
    isAdmin,
    isModerator,
  },
}: {
  user: User;
}) => {
  const isVerified = !!emailVerified;

  const session = useSession();

  const context = api.useContext();
  const { mutate, isLoading } = api.users.edit.useMutation({
    onSettled: () => {
      context.users.getAll.invalidate().catch(() => {});
    },
    onMutate: async (newData) => {
      await context.users.getAll.cancel();
      const prev = context.users.getAll.getData();

      if (prev) {
        context.users.getAll.setData(
          undefined,
          prev.map((u) => (u.id === newData.id ? { ...u, ...newData } : u)),
        );
      }

      return prev;
    },
    onError: (err, _, prevData) => {
      console.error(err);

      if (prevData) {
        context.users.getAll.setData(undefined, prevData);
      }
    },
  });

  return (
    <div className="flex items-center justify-between gap-2 p-4">
      <div className="flex items-center gap-2">
        {image ? (
          <Image
            alt={name ? `${name}'s avatar` : 'Avatar'}
            height={40}
            width={40}
            src={image}
            className="rounded-full"
          />
        ) : (
          <div className="h-[40px] w-[40px] rounded-full bg-stone-600" />
        )}
        <Link
          href={`/user/${id}`}
          className="inline-flex text-lg font-bold hover:underline">
          {name}
        </Link>
        <span className="inline-flex items-center gap-1 self-center rounded-full bg-stone-800 p-1 px-2 text-sm text-stone-400">
          <span
            aria-label={isVerified ? 'Email verified' : 'Email not verified'}
            className={`h-2 w-2 rounded-full ${
              isVerified ? 'bg-green-700' : 'bg-red-700'
            }`}
          />
          {email}
        </span>
      </div>
      <div className="flex items-stretch gap-2">
        {!isAdmin ? (
          <Listbox
            value={isModerator ? userTypes[1] : userTypes[0]}
            as="div"
            className="relative w-32"
            onChange={(selected) => {
              mutate({
                id,
                isModerator: selected.value,
              });
            }}
            disabled={session.data?.user.isAdmin !== true}>
            <Listbox.Button className="h-full w-full rounded bg-stone-600 disabled:cursor-auto ui-open:bg-stone-600">
              {(isModerator ? userTypes[1] : userTypes[0]).name}
            </Listbox.Button>
            <Listbox.Options className="absolute right-0 z-40 w-full origin-top-right translate-y-1 overflow-clip rounded">
              {userTypes.map((ut) => (
                <Listbox.Option
                  key={ut.value.toString()}
                  value={ut}
                  as={Fragment}>
                  <li className="w-full cursor-pointer bg-stone-600 p-2 ui-active:bg-stone-500">
                    <CheckIcon className="inline h-4 w-4 text-transparent ui-selected:text-stone-300" />{' '}
                    {ut.name}
                  </li>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        ) : (
          <span className="w-32 rounded bg-stone-600 p-2 text-center">
            Admin
          </span>
        )}

        <button
          type="button"
          className="rounded bg-stone-600 p-2 transition-colors hover:bg-stone-500"
          disabled={isLoading}
          onClick={() => {
            mutate({ id, isBanned: !isBanned });
          }}>
          {isBanned ? 'Unban' : 'Ban'}
        </button>
      </div>
    </div>
  );
};

const UsersPage = () => {
  const { data: users } = api.users.getAll.useQuery();

  return (
    <ModeratorCheck>
      <Head>
        <title>Users</title>
      </Head>
      <Layout>
        <div className="container self-stretch rounded bg-stone-800 p-5 md:mx-5">
          <h1 className="mb-3 px-4 text-4xl">Users</h1>
          <div className="flex-auto divide-y divide-stone-600 rounded bg-stone-700">
            {users ? (
              users.map((u) => <UserItem key={u.id} user={u} />)
            ) : (
              <div className="p-4">
                <ContentLoader
                  className="w-full"
                  height={40}
                  backgroundColor="#44403c"
                  foregroundColor="#57534e"
                  speed={2}>
                  <circle r="20" cx={20} cy={20} />
                  <rect x={50} y={5} rx="5" ry="5" width="180" height="30" />
                  <rect
                    x={240}
                    y={10}
                    rx="10"
                    ry="10"
                    width="100"
                    height="20"
                  />
                </ContentLoader>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ModeratorCheck>
  );
};

export default UsersPage;
