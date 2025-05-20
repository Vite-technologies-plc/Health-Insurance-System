'use client';
import React, { useEffect, useState, ReactNode } from 'react';
import styled from 'styled-components';
import { DotsLoading, SkeletonLoading, TextLoading, CardLoading } from './LoadingComponents';
import { theme } from '@/styles/theme';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const DataLoadingContainer = styled.div`
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  width: 100%;
`;

const FormLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

// Define different loading types
export type LoadingType = 
  | 'default'       // Simple dots loading
  | 'dashboard'     // Dashboard with stats and charts
  | 'table'         // Table/list data
  | 'form'          // Form with inputs
  | 'auth'          // Authentication related
  | 'details';      // Detailed view of an entity

interface PageLoadingWrapperProps {
  children: ReactNode;
  type?: LoadingType;
  loadingText?: string;
  timeout?: number;
}

const PageLoadingWrapper = ({ 
  children, 
  type = 'default',
  loadingText,
  timeout = 1000
}: PageLoadingWrapperProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  if (!isLoading) {
    return <>{children}</>;
  }

  // Render different loading UI based on the type
  switch (type) {
    case 'dashboard':
      return (
        <DataLoadingContainer>
          <SkeletonLoading.Rectangle height="60px" width="100%" />
          <div style={{ marginTop: theme.spacing.lg, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: theme.spacing.md }}>
            {[...Array(4)].map((_, i) => (
              <SkeletonLoading.Rectangle key={i} height="100px" width="100%" />
            ))}
          </div>
          <div style={{ marginTop: theme.spacing.lg, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: theme.spacing.md }}>
            <SkeletonLoading.Rectangle height="250px" width="100%" />
            <SkeletonLoading.Rectangle height="250px" width="100%" />
          </div>
        </DataLoadingContainer>
      );
      
    case 'table':
      return (
        <DataLoadingContainer>
          <SkeletonLoading.Rectangle height="50px" width="100%" />
          <div style={{ marginTop: theme.spacing.md }}>
            {[...Array(6)].map((_, i) => (
              <SkeletonLoading.Rectangle 
                key={i} 
                height="40px" 
                width="100%" 
              />
            ))}
          </div>
        </DataLoadingContainer>
      );
      
    case 'form':
      return (
        <FormLoadingContainer>
          <SkeletonLoading.Rectangle height="40px" width="70%" />
          <div style={{ marginBottom: theme.spacing.lg }}></div>
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              <SkeletonLoading.Rectangle height="20px" width="30%" />
              <div style={{ marginBottom: theme.spacing.xs }}></div>
              <SkeletonLoading.Rectangle height="20px" width="100%" />
              <div style={{ marginBottom: theme.spacing.md }}></div>
            </React.Fragment>
          ))}
          <SkeletonLoading.Rectangle height="50px" width="50%" />
          <div style={{ marginTop: theme.spacing.md }}></div>
        </FormLoadingContainer>
      );
      
    case 'auth':
      return (
        <LoadingContainer>
          <DotsLoading/>
        </LoadingContainer>
      );
      
    case 'details':
      return (
        <DataLoadingContainer>
          <SkeletonLoading.Rectangle height="50px" width="60%" />
          <div style={{ marginBottom: theme.spacing.lg }}></div>
          <div style={{ display: 'flex', gap: theme.spacing.lg }}>
            <SkeletonLoading.Circle size="100px" />
            <div style={{ flex: 1 }}>
              <SkeletonLoading.Rectangle height="30px" width="80%" />
              <div style={{ marginBottom: theme.spacing.md }}></div>
              <SkeletonLoading.Rectangle height="20px" width="60%" />
              <div style={{ marginBottom: theme.spacing.sm }}></div>
              <SkeletonLoading.Rectangle height="20px" width="40%" />
            </div>
          </div>
          <SkeletonLoading.Rectangle height="200px" width="100%" />
          <div style={{ marginTop: theme.spacing.xl }}></div>
        </DataLoadingContainer>
      );
      
    case 'default':
    default:
      return (
        <LoadingContainer>
          {loadingText ? (
            <TextLoading text={loadingText} />
          ) : (
            <DotsLoading />
          )}
        </LoadingContainer>
      );
  }
};

export default PageLoadingWrapper; 