import useSWR, { SWRConfiguration } from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    const info = await res.json().catch(() => ({}));
    (error as any).info = info;
    (error as any).status = res.status;
    throw error;
  }
  
  return res.json();
};

export function useFetch<Data = any, Error = any>(
  url: string | null,
  options?: SWRConfiguration
) {
  const { data, error, mutate, isValidating, isLoading } = useSWR<Data, Error>(
    url,
    fetcher,
    options
  );

  return {
    data,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  };
}
