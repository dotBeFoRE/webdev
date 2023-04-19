import { useEffect, useState } from 'react';

type GpdrState = 'accepted' | 'declined' | null;

const isValid = (value: string | null): value is GpdrState =>
  value === 'accepted' || value === 'declined' || value === null;

const Gdpr = () => {
  const [status, setStatus] = useState<GpdrState | undefined>(undefined);

  useEffect(() => {
    const value = localStorage.getItem('gdpr');
    if (isValid(value)) {
      setStatus(value);
    }
  }, []);

  const accept = () => {
    setStatus('accepted');
    localStorage.setItem('gdpr', 'accepted');
  };

  const decline = () => {
    setStatus('declined');
    localStorage.setItem('gdpr', 'declined');
  };

  if (status || status === undefined) {
    return null;
  }

  return (
    <div className="container fixed bottom-5 left-0 right-0 mx-auto px-5">
      <div className="flex justify-between rounded-md bg-stone-700 p-5 text-white">
        <div className="flex-1">
          <p>
            Deze website gebruikt cookies. We gebruiken cookies om content te
            personaliseren. Het verkeer op de website wordt geanalyseerd enkel
            voor beveiligingsdoeleinden.
          </p>
        </div>
        <div className="flex flex-col">
          <button
            type="button"
            className="rounded-md bg-green-500 p-2 text-white"
            onClick={accept}>
            Alles accepteren
          </button>
          <button
            type="button"
            className="mt-2 rounded-md bg-red-500 p-2 text-white"
            onClick={decline}>
            Alleen essentieel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gdpr;
