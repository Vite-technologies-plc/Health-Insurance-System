'use client';

import Login from '@/app/common/Login';
import PageLoadingWrapper from '@/app/common/PageLoadingWrapper';

export default function Home() {
  return (
    <PageLoadingWrapper type="auth" >
      <Login />
    </PageLoadingWrapper>
  );
}
