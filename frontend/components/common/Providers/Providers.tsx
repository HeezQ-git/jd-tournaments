import React from 'react';
import ReactQueryWrapper from './ReactQueryWrapper/ReactQueryWrapper';
import ModalsWrapper from './ModalsWrapper/ModalsWrapper';
import MantineWrapper from './MantineWrapper/MantineWrapper';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryWrapper>
      <MantineWrapper>
        <ModalsWrapper>{children}</ModalsWrapper>
      </MantineWrapper>
    </ReactQueryWrapper>
  );
}

export default Providers;
