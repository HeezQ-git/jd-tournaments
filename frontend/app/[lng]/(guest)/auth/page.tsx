import Loading from '@/components/common/Loading/Loading';
import AuthenticationForm from '@/components/Guest/AuthenticationForm/AuthenticationForm';
import { setPageTitle } from '@/utils/setPageTitle';
import React, { Suspense } from 'react';

export async function generateMetadata() {
  return setPageTitle('auth.auth');
}

const page = ({ params: { lng } }: { params: { lng: string } }) => (
  <Suspense fallback={<Loading />}>
    <AuthenticationForm lng={lng} />
  </Suspense>
);

export default page;
