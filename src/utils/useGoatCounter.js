import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useGoatCounter = () => {
  const location = useLocation();

  useEffect(() => {
    const triggerGoatCounter = () => {
      // Make sure the script has loaded
      if (window.goatcounter) {
        window.goatcounter.allowLocal = true; // ✅ override the block
        window.goatcounter.count({
          path: location.pathname,
          title: document.title,
          referrer: document.referrer,
        });
      }
    };

    setTimeout(triggerGoatCounter, 200); // slight delay to ensure script is ready
  }, [location]);
};

export default useGoatCounter;
