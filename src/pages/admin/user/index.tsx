import type { User } from '@prisma/client';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../../components/Layout';
import { api } from '../../../utils/api';

const UserItem = ({
  user: { name, email, image, emailVerified },
}: {
  user: User;
}) => {
  const isVerified = emailVerified || emailVerified === null;

  return (
    <div className="flex items-center gap-2 p-4">
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
      <span className="inline-flex text-lg font-bold">{name}</span>
      <span className="inline-flex items-center gap-1 self-center rounded-full bg-stone-800 p-1 px-2 text-sm text-neutral-400">
        <span
          aria-label={isVerified ? 'Email verified' : 'Email not verified'}
          className={`h-2 w-2 rounded-full ${
            isVerified ? 'bg-green-700' : 'bg-red-700'
          }`}
        />
        {email}
      </span>
    </div>
  );
};

const UsersPage = () => {
  const { data: users } = api.users.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <Layout>
        <div className="container rounded bg-stone-800 p-5 md:mx-5">
          <h1 className="mb-3 text-4xl">Users</h1>
          <div className="rounded bg-stone-700">
            {users ? (
              users.map((u) => <UserItem key={u.id} user={u} />)
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default UsersPage;
