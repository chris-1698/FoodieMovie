import { useRef, useEffect } from 'react';

const useTitle = title => {
  const documentDefined = typeof document !== 'undefined';
  const originalTitle = useRef(documentDefined ? document.title : null);

  useEffect(() => {
    if (!documentDefined) return;
    if (document.title !== title) document.title = title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { document.title = originalTitle.current };
  }, [documentDefined, title]);
};

export default useTitle;