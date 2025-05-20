'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { ComponentGate, ComponentId } from '../lib/rbac';

interface StyledButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.md};
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  
  /* Size variations */
  padding: ${props => {
    switch (props.size) {
      case 'small': return `${theme.spacing.xs} ${theme.spacing.sm}`;
      case 'large': return `${theme.spacing.md} ${theme.spacing.lg}`;
      default: return `${theme.spacing.sm} ${theme.spacing.md}`;
    }
  }};
  
  font-size: ${props => {
    switch (props.size) {
      case 'small': return theme.typography.fontSizes.xs;
      case 'large': return theme.typography.fontSizes.md;
      default: return theme.typography.fontSizes.sm;
    }
  }};
  
  /* Variant styles */
  background: ${props => {
    switch (props.variant) {
      case 'secondary': return 'transparent';
      case 'tertiary': return 'transparent';
      case 'danger': return theme.colors.warning;
      case 'success': return '#10b981'; // A green color for success
      default: return theme.colors.primary;
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'secondary': return theme.colors.primary;
      case 'tertiary': return theme.colors.textSecondary;
      default: return 'white';
    }
  }};
  
  border: ${props => {
    switch (props.variant) {
      case 'secondary': return `1px solid ${theme.colors.primary}`;
      case 'tertiary': return 'none';
      default: return 'none';
    }
  }};
  
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'secondary': return `${theme.colors.primary}1A`; // 10% opacity
        case 'tertiary': return `${theme.colors.textSecondary}1A`; // 10% opacity
        case 'danger': return `${theme.colors.warning}DD`;
        case 'success': return '#0ea271'; // Darker green on hover
        default: return `${theme.colors.primary}DD`;
      }
    }};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Add spacing for icons */
  svg {
    margin-right: ${props => props.children ? theme.spacing.xs : '0'};
  }
`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, StyledButtonProps {
  icon?: ReactNode;
  componentId?: ComponentId;
  fallback?: ReactNode;
}

/**
 * Button component with role-based access control
 */
const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  componentId,
  fallback,
  ...props
}) => {
  const button = (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      {...props}
    >
      {icon && icon}
      {children}
    </StyledButton>
  );

  // If componentId is provided, wrap with ComponentGate for role-based access control
  if (componentId) {
    return (
      <ComponentGate componentId={componentId} fallback={fallback}>
        {button}
      </ComponentGate>
    );
  }

  return button;
};

export default Button;
