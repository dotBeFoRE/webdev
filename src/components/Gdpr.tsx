import { useEffect, useState } from "react";

type GpdrState = 'accepted' | 'declined' | null;

const isValid = (value: string | null): value is GpdrState => value === 'accepted' || value === 'declined' || value === null;

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
    <div className="fixed bottom-5 left-0 right-0 container mx-auto px-5">
      <div className="flex justify-between bg-stone-700 text-white p-5 rounded-md">
        <div className="flex-1">
          <p>Deze website gebruikt cookies. We gebruiken cookies om content te personaliseren, voor social media en het analyseren van verkeer op de website, advertenties.</p>
        </div>
        <div className="flex flex-col">
          <button type="button" className="bg-green-500 text-white p-2 rounded-md" onClick={accept}>Alles accepteren</button>
          <button type="button" className="bg-red-500 text-white p-2 rounded-md mt-2" onClick={decline}>Alleen essentieel</button>
        </div>
      </div>
    </div>
  );
};

export default Gdpr;
