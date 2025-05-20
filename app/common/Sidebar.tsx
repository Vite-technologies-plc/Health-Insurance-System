'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  Building2,
  Plus,
  Users,
  UserCog,
  Settings,
  ChevronDown,
  Shield,
  FileText,
  User,
  UserPlus,
  Building,
  Hospital,
  Briefcase,
  UserCheck,
  Menu
} from 'lucide-react';
import { ComponentGate, ComponentId } from '../lib/rbac';
import { theme } from '../../styles/theme';
import { useAuthorization } from '../lib/rbac/use-authorization';
import { UserType } from '../lib/rbac/models';

interface SidebarContainerProps {
  collapsed: boolean;
}

const SidebarContainer = styled.div<SidebarContainerProps>`
  width: ${props => props.collapsed ? '70px' : '250px'};
  height: 100vh;
  background: ${theme.colors.background};
  border-right: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.md} 0;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  z-index: 50;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  transition: width 0.3s ease;
`;

const Logo = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${theme.spacing.lg};
  padding: 0 ${theme.spacing.md};
  
  h1 {
    font-size: ${theme.typography.fontSizes.lg};
    font-weight: ${theme.typography.fontWeights.bold};
    color: ${theme.colors.primary};
  }
`;

const NavSection = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

interface SectionTitleProps {
  collapsed: boolean;
}

const SectionTitle = styled.h3<SectionTitleProps>`
  font-size: ${theme.typography.fontSizes.xs};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  padding: ${theme.spacing.sm} ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.sm};
  text-align: ${props => props.collapsed ? 'center' : 'left'};
  overflow: hidden;
  white-space: nowrap;
`;

interface NavItemProps {
  active?: boolean;
  collapsed?: boolean;
}

const NavItem = styled.a<NavItemProps>`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.sm} ${props => props.collapsed ? theme.spacing.sm : theme.spacing.xl};
  color: ${props => props.active ? theme.colors.primary : theme.colors.textSecondary};
  text-decoration: none;
  font-size: ${theme.typography.fontSizes.sm};
  position: relative;
  cursor: pointer;
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${props => props.active ? theme.colors.primary : 'transparent'};
  }
  
  &:hover {
    background: ${theme.colors.backgroundSecondary};
    color: ${theme.colors.primary};
  }
  
  svg {
    margin-right: ${props => props.collapsed ? '0' : theme.spacing.md};
    width: 18px;
    height: 18px;
  }
`;

interface DropdownProps {
  collapsed: boolean;
}

const Dropdown = styled.div<DropdownProps>`
  margin-left: ${props => props.collapsed ? '0' : theme.spacing.xl};
  display: ${props => props.collapsed ? 'flex' : 'block'};
  flex-direction: ${props => props.collapsed ? 'column' : 'row'};
  align-items: ${props => props.collapsed ? 'center' : 'flex-start'};
`;

interface DropdownToggleProps {
  collapsed: boolean;
}

const DropdownToggle = styled.div<DropdownToggleProps>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.collapsed ? 'center' : 'space-between'};
  padding-right: ${props => props.collapsed ? '0' : theme.spacing.md};
  width: 100%;
  
  svg.toggle-icon {
    margin-right: 0;
    display: ${props => props.collapsed ? 'none' : 'block'};
  }
  
  div {
    display: flex;
    align-items: center;
  }
`;

const CollapseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background: transparent;
  border: none;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

interface SidebarProps {
  className?: string;
}

/**
 * Sidebar component with role-based access control
 */
const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasUserType, isCorporateAdmin, isAdmin, isInsuranceAdmin } = useAuthorization();
  const [collapsed, setCollapsed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = React.useState<Record<string, boolean>>({
    'insurance': false,
    'admin': false,
    'profile': false,
    'settings': false,
    'providers': false,
    'providers_admin': false,
    'corporate': false,
    'corporate_admin': false,
    'staff': false,
    'members': false,
    'users_roles': false
  });

  const toggleDropdown = (key: string) => {
    if (collapsed) {
      setCollapsed(false);
    }
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <SidebarContainer className={className} collapsed={collapsed}>
      <CollapseButton onClick={toggleCollapse}>
        <Menu size={18} />
      </CollapseButton>

      <Logo>
        {!collapsed && <h1>Health Insurance</h1>}
      </Logo>

      <NavSection>
        <SectionTitle collapsed={collapsed}>{collapsed ? '' : 'Main'}</SectionTitle>

        <ComponentGate componentId={ComponentId.SIDEBAR_DASHBOARD}>
          <Link href="/dashboard" passHref legacyBehavior>
            <NavItem active={pathname === '/dashboard'} collapsed={collapsed}>
              <Home />
              {!collapsed && 'Dashboard'}
            </NavItem>
          </Link>
        </ComponentGate>

        {/* Insurance Admin specific menu items */}
        {isInsuranceAdmin() && (
          <>
            {/* Providers Section */}
            <ComponentGate componentId={ComponentId.SIDEBAR_PROVIDERS}>
              <NavItem
                onClick={() => toggleDropdown('providers')}
                active={pathname.includes('/providers')}
                collapsed={collapsed}
              >
                <DropdownToggle collapsed={collapsed}>
                  <div>
                    <Hospital />
                    {!collapsed && 'Providers'}
                  </div>
                  <ChevronDown className="toggle-icon" size={16} />
                </DropdownToggle>
              </NavItem>

              {openDropdowns.providers && (
                <Dropdown collapsed={collapsed}>
                  <Link href="/providers/create" passHref legacyBehavior>
                    <NavItem active={pathname === '/providers/create'} collapsed={collapsed}>
                      {!collapsed && 'Create Provider'}
                    </NavItem>
                  </Link>
                  <Link href="/providers/list" passHref legacyBehavior>
                    <NavItem active={pathname === '/providers/list'} collapsed={collapsed}>
                      {!collapsed && 'All Providers'}
                    </NavItem>
                  </Link>
                  <Link href="/providers/admin/list" passHref legacyBehavior>
                    <NavItem active={pathname === '/providers/admin/list'} collapsed={collapsed}>
                      {!collapsed && 'Provider Admins'}
                    </NavItem>
                  </Link>
                </Dropdown>
              )}
            </ComponentGate>
            {/* Corporate Section */}
            <ComponentGate componentId={ComponentId.SIDEBAR_CORPORATE}>
              <NavItem
                onClick={() => toggleDropdown('corporate')}
                active={pathname.includes('/corporate')}
                collapsed={collapsed}
              >
                <DropdownToggle collapsed={collapsed}>
                  <div>
                    <Building />
                    {!collapsed && 'Corporate'}
                  </div>
                  <ChevronDown className="toggle-icon" size={16} />
                </DropdownToggle>
              </NavItem>

              {openDropdowns.corporate && (
                <Dropdown collapsed={collapsed}>
                  <Link href="/corporate/create" passHref legacyBehavior>
                    <NavItem active={pathname === '/corporate/create'} collapsed={collapsed}>
                      {!collapsed && 'Create Corporate'}
                    </NavItem>
                  </Link>

                  <Link href="/corporate/list" passHref legacyBehavior>
                    <NavItem active={pathname === '/corporate/list'} collapsed={collapsed}>
                      {!collapsed && 'All Corporates'}
                    </NavItem>
                  </Link>
                  <Link href="/corporate/admin/list" passHref legacyBehavior>
                    <NavItem active={pathname === '/corporate/admin/list'} collapsed={collapsed}>
                      {!collapsed && 'Corporate Admins'}
                    </NavItem>
                  </Link>
                </Dropdown>
              )}
            </ComponentGate>

            {/* Staff Section */}
            <ComponentGate componentId={ComponentId.SIDEBAR_STAFF}>
              <NavItem
                onClick={() => toggleDropdown('staff')}
                active={pathname.includes('/staff')}
                collapsed={collapsed}
              >
                <DropdownToggle collapsed={collapsed}>
                  <div>
                    <Briefcase />
                    {!collapsed && 'Staff'}
                  </div>
                  <ChevronDown className="toggle-icon" size={16} />
                </DropdownToggle>
              </NavItem>

              {openDropdowns.staff && (
                <Dropdown collapsed={collapsed}>

                  <Link href="/staff/create" passHref legacyBehavior>
                    <NavItem active={pathname === '/staff/create'} collapsed={collapsed}>
                      {!collapsed && 'New Staff'}
                    </NavItem>
                  </Link>

                  <Link href="/staff/list" passHref legacyBehavior>
                    <NavItem active={pathname === '/staff/list'} collapsed={collapsed}>
                      {!collapsed && ' All Staffs'}
                    </NavItem>
                  </Link>
                </Dropdown>
              )}
            </ComponentGate>

            {/* Members Section */}
            <ComponentGate componentId={ComponentId.SIDEBAR_MEMBERS}>
              <NavItem
                onClick={() => toggleDropdown('members')}
                active={pathname.includes('/members')}
                collapsed={collapsed}
              >
                <DropdownToggle collapsed={collapsed}>
                  <div>
                    <UserCheck />
                    {!collapsed && 'Members'}
                  </div>
                  <ChevronDown className="toggle-icon" size={16} />
                </DropdownToggle>
              </NavItem>

              {openDropdowns.members && (
                <Dropdown collapsed={collapsed}>

                  <Link href="/members/create" passHref legacyBehavior>
                    <NavItem active={pathname === '/members/create'} collapsed={collapsed}>
                      {!collapsed && 'New Member'}
                    </NavItem>
                  </Link>

                  <Link href="/members/list" passHref legacyBehavior>
                    <NavItem active={pathname === '/members/list'} collapsed={collapsed}>
                      {!collapsed && ' All Members'}
                    </NavItem>
                  </Link>
                </Dropdown>
              )}
            </ComponentGate>
          </>
        )}

        {/* Corporate Admin specific menu items */}
        {isCorporateAdmin() && (
          <>
            {/* Staff Section */}
            <ComponentGate componentId={ComponentId.SIDEBAR_STAFF}>
              <NavItem
                onClick={() => toggleDropdown('staff')}
                active={pathname.includes('/staff')}
                collapsed={collapsed}
              >
                <DropdownToggle collapsed={collapsed}>
                  <div>
                    <Briefcase />
                    {!collapsed && 'Staff'}
                  </div>
                  <ChevronDown className="toggle-icon" size={16} />
                </DropdownToggle>
              </NavItem>

              {openDropdowns.staff && (
                <Dropdown collapsed={collapsed}>
                  <Link href="/staff/list" passHref legacyBehavior>
                    <NavItem active={pathname === '/staff/list'} collapsed={collapsed}>
                      {!collapsed && 'View All Staff'}
                    </NavItem>
                  </Link>
                </Dropdown>
              )}
            </ComponentGate>

            {/* Members Section for Corporate Admin */}
            <ComponentGate componentId={ComponentId.SIDEBAR_MEMBERS}>
              <NavItem
                onClick={() => toggleDropdown('members')}
                active={pathname.includes('/members')}
                collapsed={collapsed}
              >
                <DropdownToggle collapsed={collapsed}>
                  <div>
                    <UserCheck />
                    {!collapsed && 'Members'}
                  </div>
                  <ChevronDown className="toggle-icon" size={16} />
                </DropdownToggle>
              </NavItem>

              {openDropdowns.members && (
                <Dropdown collapsed={collapsed}>
                  <Link href="/members/list" passHref legacyBehavior>
                    <NavItem active={pathname === '/members/list'} collapsed={collapsed}>
                      {!collapsed && 'View All Members'}
                    </NavItem>
                  </Link>
                  <Link href="/members/create" passHref legacyBehavior>
                    <NavItem active={pathname === '/members/create'} collapsed={collapsed}>
                      {!collapsed && 'Create Member'}
                    </NavItem>
                  </Link>
                  <Link href="/members/edit" passHref legacyBehavior>
                    <NavItem active={pathname === '/members/edit'} collapsed={collapsed}>
                      {!collapsed && 'Edit Member'}
                    </NavItem>
                  </Link>
                </Dropdown>
              )}
            </ComponentGate>
          </>
        )}

        {/* Provider Admin specific menu items */}
        {hasUserType(UserType.PROVIDER_ADMIN) && (
          <>
            {/* Staff Section */}
            <ComponentGate componentId={ComponentId.SIDEBAR_STAFF}>
              <NavItem
                onClick={() => toggleDropdown('staff')}
                active={pathname.includes('/staff')}
                collapsed={collapsed}
              >
                <DropdownToggle collapsed={collapsed}>
                  <div>
                    <Briefcase />
                    {!collapsed && 'Staff'}
                  </div>
                  <ChevronDown className="toggle-icon" size={16} />
                </DropdownToggle>
              </NavItem>

              {openDropdowns.staff && (
                <Dropdown collapsed={collapsed}>
                  <Link href="/staff/list" passHref legacyBehavior>
                    <NavItem active={pathname === '/staff/list'} collapsed={collapsed}>
                      {!collapsed && 'View All Staff'}
                    </NavItem>
                  </Link>
                </Dropdown>
              )}
            </ComponentGate>

            {/* Members Section for Provider Admin */}
            <ComponentGate componentId={ComponentId.SIDEBAR_MEMBERS}>
              <NavItem
                onClick={() => toggleDropdown('members')}
                active={pathname.includes('/members')}
                collapsed={collapsed}
              >
                <DropdownToggle collapsed={collapsed}>
                  <div>
                    <UserCheck />
                    {!collapsed && 'Members'}
                  </div>
                  <ChevronDown className="toggle-icon" size={16} />
                </DropdownToggle>
              </NavItem>

              {openDropdowns.members && (
                <Dropdown collapsed={collapsed}>
                  <Link href="/members/list" passHref legacyBehavior>
                    <NavItem active={pathname === '/members/list'} collapsed={collapsed}>
                      {!collapsed && 'View All Members'}
                    </NavItem>
                  </Link>
                  <Link href="/members/create" passHref legacyBehavior>
                    <NavItem active={pathname === '/members/create'} collapsed={collapsed}>
                      {!collapsed && 'Create Member'}
                    </NavItem>
                  </Link>
                  <Link href="/members/edit" passHref legacyBehavior>
                    <NavItem active={pathname === '/members/edit'} collapsed={collapsed}>
                      {!collapsed && 'Edit Member'}
                    </NavItem>
                  </Link>
                </Dropdown>
              )}
            </ComponentGate>
          </>
        )}

        {/* These components will not appear for Provider Admin, only for other roles */}
        {!hasUserType(UserType.PROVIDER_ADMIN) && (
          <>
            <ComponentGate componentId={ComponentId.SIDEBAR_INSURANCE_COMPANIES}>
              <NavItem
                onClick={() => toggleDropdown('insurance')}
                active={pathname.includes('/insurance')}
                collapsed={collapsed}
              >
                <DropdownToggle collapsed={collapsed}>
                  <div>
                    <Building2 />
                    {!collapsed && 'Insurance Companies'}
                  </div>
                  <ChevronDown className="toggle-icon" size={16} />
                </DropdownToggle>
              </NavItem>

              {openDropdowns.insurance && (
                <Dropdown collapsed={collapsed}>
                  <Link href="/insurance/list" passHref legacyBehavior>
                    <NavItem active={pathname === '/insurance/list'} collapsed={collapsed}>
                      {!collapsed && 'View All Companies'}
                    </NavItem>
                  </Link>

                  <ComponentGate componentId={ComponentId.SIDEBAR_CREATE_INSURANCE}>
                    <Link href="/insurance/create" passHref legacyBehavior>
                      <NavItem active={pathname === '/insurance/create'} collapsed={collapsed}>
                        {!collapsed && 'Create New Company'}
                      </NavItem>
                    </Link>
                  </ComponentGate>
                </Dropdown>
              )}
            </ComponentGate>

            <ComponentGate componentId={ComponentId.SIDEBAR_ADMINS}>
              <NavItem
                onClick={() => toggleDropdown('admin')}
                active={pathname.includes('/admin')}
                collapsed={collapsed}
              >
                <DropdownToggle collapsed={collapsed}>
                  <div>
                    <UserCog />
                    {!collapsed && 'Admins'}
                  </div>
                  <ChevronDown className="toggle-icon" size={16} />
                </DropdownToggle>
              </NavItem>

              {openDropdowns.admin && (
                <Dropdown collapsed={collapsed}>
                  <Link href="/admin/insurance-admins" passHref legacyBehavior>
                    <NavItem active={pathname === '/admin/insurance-admins'} collapsed={collapsed}>
                      {!collapsed && 'Insurance Company Admins'}
                    </NavItem>
                  </Link>

                  <Link href="/admin/create" passHref legacyBehavior>
                    <NavItem active={pathname === '/admin/create'} collapsed={collapsed}>
                      {!collapsed && 'Create New Admin'}
                    </NavItem>
                  </Link>
                </Dropdown>
              )}
            </ComponentGate>
          </>
        )}
      </NavSection>

      {/* User section */}
      <NavSection>
        <SectionTitle collapsed={collapsed}>{collapsed ? '' : 'User'}</SectionTitle>

        <ComponentGate componentId={ComponentId.SIDEBAR_PROFILE}>
          <Link href="/profile" passHref legacyBehavior>
            <NavItem active={pathname === '/profile'} collapsed={collapsed}>
              <Users />
              {!collapsed && 'Profile'}
            </NavItem>
          </Link>
        </ComponentGate>


        <ComponentGate componentId={ComponentId.SIDEBAR_SETTINGS}>
          <NavItem
            onClick={() => toggleDropdown('settings')}
            active={pathname.includes('/settings')}
            collapsed={collapsed}
          >
            <DropdownToggle collapsed={collapsed}>
              <div>
                <Settings />
                {!collapsed && 'Settings'}
              </div>
              <ChevronDown className="toggle-icon" size={16} />
            </DropdownToggle>
          </NavItem>

          {openDropdowns.settings && (
            <Dropdown collapsed={collapsed}>
              <Link href="/settings/general" passHref legacyBehavior>
                <NavItem active={pathname === '/settings/general'} collapsed={collapsed}>
                  {!collapsed && 'General Settings'}
                </NavItem>
              </Link>

              <Link href="/settings/security" passHref legacyBehavior>
                <NavItem active={pathname === '/settings/security'} collapsed={collapsed}>
                  {!collapsed && 'Security'}
                </NavItem>
              </Link>

              <Link href="/settings/notifications" passHref legacyBehavior>
                <NavItem active={pathname === '/settings/notifications'} collapsed={collapsed}>
                  {!collapsed && 'Notifications'}
                </NavItem>
              </Link>

              <NavItem
                onClick={() => toggleDropdown('users_roles')}
                active={pathname.includes('/settings/users-roles')}
                collapsed={collapsed}
              >
                <DropdownToggle collapsed={collapsed}>
                  <div>
                    {!collapsed && 'Users & Roles'}
                  </div>
                  <ChevronDown className="toggle-icon" size={16} />
                </DropdownToggle>
              </NavItem>

              {openDropdowns.users_roles && (
                <Dropdown collapsed={collapsed}>
                  <Link href="/settings/users-roles/permission-management" passHref legacyBehavior>
                    <NavItem active={pathname === '/settings/users-roles/permission-management'} collapsed={collapsed}>
                      {!collapsed && 'Permission Management'}
                    </NavItem>
                  </Link>

                  <Link href="/settings/users-roles/roles" passHref legacyBehavior>
                    <NavItem active={pathname === '/settings/users-roles/roles'} collapsed={collapsed}>
                      {!collapsed && 'Role Management'}
                    </NavItem>
                  </Link>

                  <Link href="/settings/users-roles/user-roles" passHref legacyBehavior>
                    <NavItem active={pathname === '/settings/users-roles/user-roles'} collapsed={collapsed}>
                      {!collapsed && 'User Role Assignment'}
                    </NavItem>
                  </Link>
                </Dropdown>
              )}
            </Dropdown>
          )}
        </ComponentGate>
      </NavSection>
    </SidebarContainer>
  );
};

export default Sidebar;