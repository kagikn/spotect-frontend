import {useRef} from 'react';
import addMemorizedPreconnectOnce from './AddPreconnectOnce';

const useAddPreconnectOnce = () => {
  const cache = useRef(addMemorizedPreconnectOnce);

  return cache.current;
};

export default useAddPreconnectOnce;
