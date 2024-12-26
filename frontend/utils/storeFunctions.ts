import { fetchAPI } from '@/app/api/apiFunctions';
import { verificationEndpoints } from '@/app/api/endpoints';

export const updateVerification = async (
  setIsVerified: (_: any) => void,
  username: string,
) => {
  if (!username || !setIsVerified) return;

  const data = await fetchAPI(verificationEndpoints.checkVerification, {
    params: { username },
  });

  setIsVerified(data);
};
