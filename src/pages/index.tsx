import type { GetServerSideProps } from 'next';
import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import avatar from '../../public/images/avatar.jpg';
import { api } from '../utils/api';

const Home: NextPage = () => {
  const { data: message } = api.example.hello.useQuery({
    text: 'World!',
  });

  return (
    <>
      <Head>
        <title>CV Ayrton-Taede Tromp</title>
        <meta name="description" content="CV Ayrton-Taede Tromp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="container px-5 md:flex">
          <section className="flex-1 self-center p-5 pt-0">
            <div className="flex justify-center">
              <Image
                src={avatar}
                alt="Developer Image"
                className="w-48 rounded-full "
              />
            </div>
            <h1 className="text-center text-3xl font-bold">
              Ayrton-Taede Tromp
            </h1>
          </section>
          <div className="flex-1 rounded-md bg-stone-800 px-5 py-1">
            <section className="my-5 flex-1">
              <h2 className="text-lg font-bold">Profiel</h2>
              <p className="mb-2">
                Ayrton is the epitome of cool. He has an effortless charm that
                draws people to him like a magnet. He walks with a confident
                swagger and always has a mischievous twinkle in his eye that
                suggests he is up for anything. Ayrton is the kind of guy who
                seems to have life all figured out, and everyone wants to be
                around him to soak up some of his coolness.
              </p>
              <p className="mb-2">
                Ayrton&apos;s coolness is not just a façade; it is ingrained in
                his personality. He is a skilled musician, and his guitar solos
                leave audiences in awe. He is also an accomplished surfer, and
                his moves on the waves are nothing short of breathtaking.
              </p>
              <p>
                Despite his many talents, Ayrton remains humble and
                approachable. He has a heart of gold and is always willing to
                lend a hand to those in need. Ayrton is more than just a cool
                dude; he is a true friend to all who know him.
              </p>
            </section>
            <section className="my-5 flex-1">
              <h2 className="text-lg font-bold">Skills</h2>
              <ul className="list-inside list-disc">
                <li>React</li>
                <li>NextJS</li>
                <li>Typescript</li>
                <li>Discord.js</li>
                <li>CS:GO</li>
                <li>Rainbow-Six: Siege</li>
                <li>Webdev nooit afmaken</li>
                <li>Uitstellen</li>
                <li>Nog een item</li>
                <li>En nog één (1)</li>
                <li>En doe er nog maar eens eentje</li>
                <li>Lijsten maken</li>
              </ul>
            </section>
            <section className="my-5 flex-1">
              <h2 className="text-lg font-bold">Message</h2>
              <p>{message?.greeting || 'loading...'}</p>
            </section>
            <section className="my-5 flex-1">
              <Link
                href="/contact"
                className="cursor-pointer
                rounded-md bg-stone-700 p-2
                text-left transition-opacity
                hover:opacity-90
                active:opacity-80
                disabled:cursor-not-allowed disabled:opacity-50
                disabled:hover:opacity-50
                disabled:active:opacity-50">
                Go to contact
              </Link>
            </section>
          </div>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const visistsRaw = req.cookies.visists;
  const visists =
    visistsRaw !== undefined ? Number.parseInt(visistsRaw, 10) : 0;

  res.setHeader('set-cookie', [`visists=${visists + 1}`]);

  return { props: {} };
};

export default Home;
