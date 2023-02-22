import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Menu } from '@headlessui/react';

const LoginButton = () => {
  const session = useSession();

  if (session.data?.user) {
    const { name, image } = session.data.user;

    return (
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center p-2">
          {image && (
            <Image
              alt={name ? `${name}'s profile picture` : 'avatar'}
              src={image}
              width={40}
              height={40}
              className="mr-2 rounded-full"
            />
          )}
          {name && <p className="hidden sm:block">{name}</p>}
        </Menu.Button>
        <Menu.Items className="absolute right-0 z-40 w-full min-w-max origin-top-right divide-stone-700 overflow-hidden rounded-b-md bg-stone-800 shadow-lg outline-none">
          <Menu.Item>
            {({ active }) => (
              <Menu.Button
                onClick={() => {
                  void signOut();
                  console.log('click');
                }}
                type="button"
                className={`${
                  active ? 'bg-stone-700' : ''
                } flex w-full justify-between px-4 py-2 text-sm  `}
                role="menuitem">
                Sign out
              </Menu.Button>
            )}
          </Menu.Item>
        </Menu.Items>
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
