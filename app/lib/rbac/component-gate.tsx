'use client';

import React, { ReactNode } from 'react';
import { useAuth } from './auth-context';
import { ComponentId, canAccessComponent } from './component-access';

interface ComponentGateProps {
  children: ReactNode;
  componentId: ComponentId;
  fallback?: ReactNode;
}

/**
 * A component that conditionally renders its children based on
 * whether the user has access to the specified component ID
 */
export const ComponentGate: React.FC<ComponentGateProps> = ({
  children,
  componentId,
  fallback
}) => {
  const { user } = useAuth();
  
  if (!user || !user.userType) {
    return fallback ? <>{fallback}</> : null;
  }
  
  const hasAccess = canAccessComponent(
    user.userType,
    componentId,
    user.adminType
  );
  
  if (!hasAccess) {
    return fallback ? <>{fallback}</> : null;
  }
  
  return <>{children}</>;
};

/**
 * HOC that wraps a component with role-based access control
 * @param Component The component to wrap
 * @param componentId The component ID for access control
 * @param fallback Optional fallback component to render when access is denied
 */
export function withComponentAccess<P extends object>(
  Component: React.ComponentType<P>,
  componentId: ComponentId,
  fallback?: React.ReactNode
): React.FC<P> {
  return (props: P) => (
    <ComponentGate componentId={componentId} fallback={fallback}>
      <Component {...props} />
    </ComponentGate>
  );
} 