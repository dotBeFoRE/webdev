import Link from 'next/link';
import { useRouter } from 'next/router';
import Gdpr from './Gdpr';
import LoginButton from './LoginButton';

const Layout = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();

  const links = [
    {
      href: '/contact',
      label: 'Contact',
    },
    {
      href: '/reversi',
      label: 'Play Reversi',
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-stone-900 text-stone-300">
      <header className="flex justify-center bg-stone-800">
        <div className="container flex min-h-[4rem] flex-wrap items-stretch justify-between">
          <Link href="/" className="flex items-center p-2">
            <h2 className="text-lg">Webdev CV</h2>
          </Link>
          <li className="flex list-none items-stretch">
            <ul className="flex items-stretch">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={
                    router.pathname === href
                      ? 'flex items-center bg-stone-700 p-2 transition-colors'
                      : 'flex items-center p-2 transition-colors hover:bg-stone-700 focus:bg-stone-700'
                  }>
                  {label}
                </Link>
              ))}
              <LoginButton />
            </ul>
          </li>
        </div>
      </header>
      <main className="relative flex flex-1 items-center justify-center py-5">
        {children}
        <Gdpr />
      </main>
    </div>
  );
};

export default Layout;
