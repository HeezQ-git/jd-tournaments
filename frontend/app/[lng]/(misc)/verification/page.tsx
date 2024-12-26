import Verification from '@/components/Guest/Verification/Verification';
import { setPageTitle } from '@/utils/setPageTitle';

export async function generateMetadata() {
  return setPageTitle('auth.verification');
}

export default Verification;
