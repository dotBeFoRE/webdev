import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Menu } from '@headlessui/react';
import Link from 'next/link';

const LoginButton = () => {
  const session = useSession();

  if (session.data?.user) {
    const { name, image } = session.data.user;

    const isModerator =
      session.data.user.isModerator || session.data.user.isAdmin;

    return (
      <Menu as="div" className="relative">
        {() => (
          <>
            <Menu.Button className="flex h-full items-center p-2 transition-colors open:bg-stone-700 hover:bg-stone-700 active:bg-stone-700">
              {image && (
                <Image
                  alt={name ? `${name}'s profile picture` : 'avatar'}
                  src={image}
                  width={40}
                  height={40}
                  className="mr-0 rounded-full sm:mr-2"
                />
              )}
              {name && <p className="hidden sm:block">{name}</p>}
            </Menu.Button>
            <Menu.Items className="absolute right-0 z-40 w-full min-w-max origin-top-right divide-stone-600 overflow-hidden rounded-b-md shadow-lg outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href={`/user/${session.data.user.id}`}
                    className={`${
                      active ? 'bg-stone-600' : 'bg-stone-700'
                    } flex w-full justify-between px-4 py-2 text-sm transition-colors`}>
                    Profile
                  </Link>
                )}
              </Menu.Item>
              {isModerator && (
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/user/all"
                      className={`${
                        active ? 'bg-stone-600' : 'bg-stone-700'
                      } flex w-full justify-between px-4 py-2 text-sm transition-colors`}>
                      Users
                    </Link>
                  )}
                </Menu.Item>
              )}
              {isModerator && (
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/admin/audit"
                      className={`${
                        active ? 'bg-stone-600' : 'bg-stone-700'
                      } flex w-full justify-between px-4 py-2 text-sm transition-colors`}>
                      Audit Logs
                    </Link>
                  )}
                </Menu.Item>
              )}
              <Menu.Item>
                {({ active }) => (
                  <Menu.Button
                    onClick={() => signOut()}
                    type="button"
                    className={`${
                      active ? 'bg-stone-600' : 'bg-stone-700'
                    } flex w-full justify-between px-4 py-2 text-sm transition-colors`}
                    role="menuitem">
                    Sign out
                  </Menu.Button>
                )}
              </Menu.Item>
            </Menu.Items>
          </>
        )}
      </Menu>
    );
  }

  return (
    <button
      type="button"
      className="p-2 transition-colors hover:bg-stone-700 focus:bg-stone-700"
      onClick={() => void signIn('github')}>
      Login
    </button>
  );
};

export default LoginButton;
