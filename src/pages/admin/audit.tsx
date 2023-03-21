import Head from 'next/head';
import Image from 'next/image';
import ContentLoader from 'react-content-loader';
import ModeratorCheck from '../../components/Check';
import Layout from '../../components/Layout';
import { api } from '../../utils/api';
import type { RouterOutputs } from '../../utils/api';

type AuditProps = {
  audit: RouterOutputs['audit']['getAll'][number];
};

const TargetRenderer = ({ audit }: AuditProps) => {
  const { data: targetUser } = api.users.get.useQuery(audit.target || '', {
    enabled: audit.targetType === 'user' && !!audit.target,
  });

  if (audit.targetType === 'user' && targetUser) {
    return (
      <>
        {targetUser?.image ? (
          <Image
            alt={targetUser.name ? `${targetUser.name}'s avatar` : 'Avatar'}
            height={40}
            width={40}
            src={targetUser.image}
            className="rounded-full"
          />
        ) : (
          <div className="h-[40px] w-[40px] rounded-full bg-stone-600" />
        )}
        <span>{targetUser?.name}</span>
      </>
    );
  }

  return (
    <>
      <span className="font-bold">{audit.target}</span>
      <span>{audit.targetType}</span>
    </>
  );
};

const AuditItem = ({ audit }: AuditProps) => {
  const formatter = Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return (
    <div className="flex items-center justify-between gap-2 p-4">
      <div className="flex items-center gap-2">
        {audit.user && (
          <>
            {audit.user.image ? (
              <Image
                alt={audit.user.name ? `${audit.user.name}'s avatar` : 'Avatar'}
                height={40}
                width={40}
                src={audit.user.image}
                className="rounded-full"
              />
            ) : (
              <div className="h-[40px] w-[40px] rounded-full bg-stone-600" />
            )}
            <span className="inline-flex text-lg font-bold">
              {audit.user.name}
            </span>
          </>
        )}
        <span className="inline-flex items-center gap-1 self-center rounded-full bg-stone-800 p-1 px-2 text-sm text-stone-400">
          {audit.action}
        </span>
        <TargetRenderer audit={audit} />
        <span className="shrink-0 text-sm text-stone-300">
          {formatter.format(new Date(audit.createdAt))}
        </span>
      </div>
    </div>
  );
};

const AuditItemLoader = () => (
  <div className="p-4">
    <ContentLoader
      className="w-full"
      height={40}
      backgroundColor="#44403c"
      foregroundColor="#57534e"
      speed={2}>
      <circle r="20" cx={20} cy={20} />
      <rect x={50} y={5} rx="5" ry="5" width="180" height="30" />
      <rect x={240} y={10} rx="10" ry="10" width="100" height="20" />
      <rect x={350} y={5} rx="5" ry="5" width="180" height="30" />
    </ContentLoader>
  </div>
);

const AuditPage = () => {
  const { data: items } = api.audit.getAll.useQuery();

  return (
    <ModeratorCheck>
      <Head>
        <title>Audit Log</title>
      </Head>
      <Layout>
        <div className="container self-stretch rounded bg-stone-800 p-5 md:mx-5">
          <h1 className="mb-3 px-4 text-4xl">Audit Logs</h1>
          <div className="flex-auto divide-y divide-stone-600 rounded bg-stone-700">
            {items ? (
              items.map((a) => <AuditItem key={a.id} audit={a} />)
            ) : (
              <>
                <AuditItemLoader />
                <AuditItemLoader />
                <AuditItemLoader />
              </>
            )}
          </div>
        </div>
      </Layout>
    </ModeratorCheck>
  );
};

export default AuditPage;
