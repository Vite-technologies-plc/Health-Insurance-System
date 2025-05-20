'use client';

import React from 'react';
import styled from 'styled-components';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 16%; // Width of the sidebar
  min-height: 100vh;
  background-color: #f9fafb;

`;

const ContentWrapper = styled.div`
  padding: 18px;
`;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <LayoutContainer>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <MainContent>
          <ContentWrapper>
            {children}
          </ContentWrapper>
        </MainContent>
      </div>
    </LayoutContainer>
  );
}