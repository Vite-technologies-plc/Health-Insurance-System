'use client';
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Plus,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings,
  HelpCircle
} from 'lucide-react';
import { ComponentGate, ComponentId } from '../lib/rbac';
import { useAuth } from '../lib/rbac/auth-context';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.xs} ${theme.spacing.xs};
  background: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.border};
  height: 36px;
  width: calc(100% - 250px); // Adjust for sidebar width
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 480px;
  margin: 0 ${theme.spacing.xs};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  padding-left: 40px;
  border: none;
  border-radius: ${theme.borderRadius.md};
  background: #f5f5f5;
  font-size: ${theme.typography.fontSizes.sm};
  color: ${theme.colors.textPrimary};

  &:focus {
    outline: none;
    background: #eeeeee;
  }

  &::placeholder {
    color: ${theme.colors.textSecondary};
    opacity: 0.5;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.textSecondary};
  opacity: 0.5;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: ${theme.colors.textSecondary};
  color: ${theme.colors.background};
  cursor: pointer;
  transition: background-color ${theme.transitions.default};

  &:hover {
    background: ${props => {
    const color = theme.colors.primary;
    return `${color}dd`;
  }};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const NotificationBadge = styled.div`
  position: relative;
  cursor: pointer;

  span {
    position: absolute;
    top: -8px;
    right: -8px;
    background: ${theme.colors.warning};
    color: white;
    font-size: 8px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  transition: background-color ${theme.transitions.default};

  &:hover {
    background: ${theme.colors.inputBg};
  }

  span {
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.textSecondary};
  }
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${theme.colors.textSecondary};

  &:hover {
    color: ${theme.colors.textPrimary};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 20px;
    height: 20px;
    stroke-width: 1.5px;
  }
`;

// New styled components for user profile dropdown
const UserProfileContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  transition: background-color ${theme.transitions.default};

  &:hover {
    background: ${theme.colors.inputBg};
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary};
  font-weight: ${theme.typography.fontWeights.bold};
  font-size: ${theme.typography.fontSizes.sm};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-size: ${theme.typography.fontSizes.sm};
  font-weight: ${theme.typography.fontWeights.medium};
  color: ${theme.colors.textPrimary};
`;

const UserRole = styled.span`
  font-size: ${theme.typography.fontSizes.xs};
  color: ${theme.colors.textSecondary};
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.md};
  z-index: 100;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  margin-top: ${theme.spacing.sm};
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  color: ${theme.colors.textSecondary};
  transition: background-color ${theme.transitions.default};
  cursor: pointer;

  &:hover {
    background: ${theme.colors.inputBg};
    color: ${theme.colors.textPrimary};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.border};
  }
`;

const SignOutItem = styled(DropdownItem)`
  color: ${theme.colors.warning};

  &:hover {
    background: ${`${theme.colors.warning}10`};
    color: ${theme.colors.warning};
  }
`;

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = () => {
    logout(); // Use the centralized logout function from auth context
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    router.push('/settings/general');
    setDropdownOpen(false);
  };

  const handlePermissionsClick = () => {
    router.push('/settings/users-roles/permission-management');
    setDropdownOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return '?';
    return user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <HeaderContainer>

      <SearchContainer>
        <SearchIcon>
          <IconWrapper>
            <Search />
          </IconWrapper>
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>

      <ActionsContainer>
        <ComponentGate componentId={ComponentId.INSURANCE_CREATE}>
          <AddButton onClick={() => router.push('/admin/insurance/create')}>
            <IconWrapper>
              <Plus />
            </IconWrapper>
          </AddButton>
        </ComponentGate>

        <ComponentGate componentId={ComponentId.DASHBOARD}>
          <NotificationBadge>
            <IconWrapper>
              <Bell />
            </IconWrapper>
            <span>3</span>
          </NotificationBadge>
        </ComponentGate>

        <LanguageSelector>
          <Image
            src="/images/flags/gb.svg"
            alt="English"
            width={24}
            height={16}
          />
          <span>English</span>
          <IconWrapper>
            <ChevronDown />
          </IconWrapper>
        </LanguageSelector>

        {/* User Profile Dropdown */}
        <UserProfileContainer onClick={toggleDropdown} ref={dropdownRef}>
          <UserAvatar>{getUserInitials()}</UserAvatar>
          <IconWrapper>
            <ChevronDown />
          </IconWrapper>

          <DropdownMenu isOpen={dropdownOpen}>
            <DropdownItem onClick={handleProfileClick}>
              <User size={16} />
              <span>
                {user && (
                  <UserInfo>
                    <UserName>{user.name}</UserName>
                    <UserRole>{user.userType}</UserRole>
                  </UserInfo>
                )}
              </span> 
            </DropdownItem>
            <DropdownItem onClick={handleSettingsClick}>
              <Settings size={16} />
              <span>Settings</span>
            </DropdownItem>
            <DropdownItem onClick={handlePermissionsClick}>
              <HelpCircle size={16} />
              <span>Permissions</span>
            </DropdownItem>
            <SignOutItem onClick={handleSignOut}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </SignOutItem>
          </DropdownMenu>
        </UserProfileContainer>
      </ActionsContainer>
    </HeaderContainer>
  );
};

export default Header; 