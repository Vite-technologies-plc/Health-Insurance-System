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
  padding: 24px;
`;

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <Header />
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
} 