const addMemorizedPreconnectOnce = () => {
  const cache = new Set();
  return (url: string) => {
    if (cache.has(url)) {
      return false;
    }
    const link = document.createElement('link');
    link.href = url;
    link.rel = 'preconnect';
    link.crossOrigin = 'anonymous';
    document.getElementsByTagName('head')[0].appendChild(link);

    cache.add(url);

    return true;
  };
};

export default addMemorizedPreconnectOnce;
