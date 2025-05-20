'use client';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/rbac';
import { DotsLoading } from './LoadingComponents';


const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${theme.colors.background};
  font-family: ${theme.typography.fontFamily};
`;

const LoginCard = styled.div`
  background: ${theme.colors.background};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  width: 100%;
  max-width: 350px;
  min-height: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSizes.xl};
  font-weight: ${theme.typography.fontWeights.semibold};
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xl};
  font-size: ${theme.typography.fontSizes.sm};
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSizes.sm};
  font-weight: ${theme.typography.fontWeights.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSizes.sm};
  background-color: ${theme.colors.inputBg};
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontFamily};
  transition: border-color ${theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.textSecondary};
    opacity: 0.5;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const Checkbox = styled.input`
  margin-right: ${theme.spacing.sm};
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSizes.sm};
  cursor: pointer;
`;

const SignInButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.sm};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.background};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSizes.md};
  font-weight: ${theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: background-color ${theme.transitions.default};
  font-family: ${theme.typography.fontFamily};

  &:hover {
    background-color: ${props => {
      const color = theme.colors.primary;
      return `${color}dd`; // Add transparency for hover effect
    }};
  }

  &:disabled {
    background-color: ${theme.colors.background};
    cursor: not-allowed;
  }
`;

const ForgotPassword = styled.a`
  color: ${theme.colors.textSecondary};
  text-decoration: none;
  font-size: ${theme.typography.fontSizes.sm};
  float: right;
  margin-top: -${theme.spacing.lg};
  transition: color ${theme.transitions.default};
  
  &:hover {
    color: ${props => {
      const color = theme.colors.primary;
      return `${color}dd`; // Add transparency for hover effect
    }};
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.warning};
  font-size: ${theme.typography.fontSizes.sm};
  margin-top: ${theme.spacing.xs};
`;



const PasswordContainer = styled.div`
  position: relative;
  width: 100%;
`;

const EyeIcon = styled.button`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${theme.colors.textSecondary};
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${theme.colors.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Login: React.FC = () => {
  const router = useRouter();
  const { login, error: authError, isLoading: authLoading, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Update local error state when auth error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Use the login function from auth context
      const success = await login(username, password);
      // No need to set the token here, it's handled in the auth context
      // Navigation is handled by the useEffect when isAuthenticated changes
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Login to Account</Title>
        <Subtitle>Please enter username and password to continue</Subtitle>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>User Name</Label>
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <PasswordContainer>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <EyeIcon
                type="button"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </EyeIcon>
            </PasswordContainer>
            <ForgotPassword href="#" onClick={(e) => e.preventDefault()}>Forget Password?</ForgotPassword>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <CheckboxLabel htmlFor="rememberMe">Remember Password</CheckboxLabel>
          </CheckboxContainer>

          <SignInButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
              <DotsLoading/>
              </>
            ) : (
              'Login'
            )}
          </SignInButton>
        </form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
