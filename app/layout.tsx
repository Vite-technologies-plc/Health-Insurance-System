'use client';
import { Inter } from 'next/font/google';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import StyledComponentsRegistry from './lib/registry';
import { AuthProvider } from './lib/rbac';

const inter = Inter({ subsets: ['latin'] });

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <LayoutContainer>
                <MainContent>
                  <ContentWrapper>
                    {children}
                  </ContentWrapper>
                </MainContent>
              </LayoutContainer>
            </AuthProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
