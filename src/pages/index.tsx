import type { GetServerSideProps} from 'next';
import { type NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import avatar from '../../public/image.jpg';

const Home: NextPage = () => (
  <>
    <Head>
      <title>CV Ayrton-Taede Tromp</title>
      <meta name="description" content="CV Ayrton-Taede Tromp" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className="flex min-h-screen justify-center items-center text-white bg-stone-900">
      <div className="container md:flex px-10">
        <section className="my-5 flex-1 self-center px-5">
          <div className="my-5 flex justify-center">
            <Image src={avatar} alt="Developer Image" className="rounded-full w-48 " />
          </div>
          <h1 className="text-center text-3xl font-bold">Ayrton-Taede Tromp</h1>
        </section>
        <div className="flex-1 bg-stone-800 px-5 overflow-auto mb-5">
          <section className="my-5 flex-1">
            <h2 className="font-bold text-lg">Profiel</h2>
            <p>Hallo ik ben een student van Windesheim en heb deze website gemaakt :0</p>
          </section>
          <section className="my-5 flex-1">
            <h2 className="font-bold text-lg">Skills</h2>
            <ul className="list-disc list-inside">
              <li>React</li>
              <li>NextJS</li>
              <li>Typescript</li>
              <li>Discord.js</li>
              <li>CS:GO</li>
              <li>Rainbow-Six: Siege</li>
              <li>Webdev nooit afmaken</li>
              <li>Ei aan brood maken</li>
              <li>Uitstellen</li>
              <li>Nog een item</li>
              <li>En nog één (1)</li>
              <li>En doe er nog maar eens eentje</li>
              <li>Lijsten maken</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  </>
);

export const getServerSideProps : GetServerSideProps = async ({res, req}) => {
  const visistsRaw = req.cookies.visists;
  const visists = visistsRaw !== undefined ? Number.parseInt(visistsRaw, 10) : 0;

  res.setHeader('set-cookie', [`visists=${visists + 1}`])

  return {props: {}};
}

export default Home;
