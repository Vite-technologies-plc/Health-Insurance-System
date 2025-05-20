'use client';

import React, { InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

// Styled components for the checkbox
const CheckboxContainer = styled.div`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

const StyledCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-right: ${theme.spacing.xs};
  accent-color: ${theme.colors.primary};
`;

const Label = styled.label`
  font-size: ${theme.typography.fontSizes.sm};
  color: ${theme.colors.textPrimary};
  cursor: pointer;
`;

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

/**
 * Reusable Checkbox component
 */
const Checkbox: React.FC<CheckboxProps> = ({ 
  label, 
  id,
  className,
  ...props 
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <CheckboxContainer className={className}>
      <StyledCheckbox 
        type="checkbox" 
        id={checkboxId}
        {...props} 
      />
      {label && <Label htmlFor={checkboxId}>{label}</Label>}
    </CheckboxContainer>
  );
};

export default Checkbox; 