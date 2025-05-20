'use client';

import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import Link from 'next/link';
import { Shield, Building, Hospital } from 'lucide-react';
import { ComponentGate } from '@/app/lib/rbac';
import { ComponentId } from '@/app/lib/rbac';

const Container = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
  color: ${theme.colors.textPrimary};
`;

const PermissionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const PermissionCard = styled.div`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${theme.colors.backgroundSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  
  svg {
    color: ${theme.colors.primary};
  }
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const CardDescription = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 14px;
  line-height: 1.5;
`;

const PermissionsIndexPage: React.FC = () => {
  return (
    <ComponentGate componentId={ComponentId.PERMISSION_EDIT}>
      <Container>
        <Title>Permissions Management</Title>
        
        <PermissionGrid>
          <ComponentGate componentId={ComponentId.INSURANCE_ADMIN_PERMISSIONS}>
            <CardLink href="/admin/permissions/insurance">
              <PermissionCard>
                <CardHeader>
                  <IconWrapper>
                    <Shield size={24} />
                  </IconWrapper>
                  <CardTitle>Insurance Companies</CardTitle>
                </CardHeader>
                <CardDescription>
                  Manage permissions for insurance company admins and staff. Control what data and features they can access.
                </CardDescription>
              </PermissionCard>
            </CardLink>
          </ComponentGate>
          
          <ComponentGate componentId={ComponentId.CORPORATE_ADMIN_PERMISSIONS}>
            <CardLink href="/admin/permissions/corporate">
              <PermissionCard>
                <CardHeader>
                  <IconWrapper>
                    <Building size={24} />
                  </IconWrapper>
                  <CardTitle>Corporate Clients</CardTitle>
                </CardHeader>
                <CardDescription>
                  Manage permissions for corporate client administrators and their employee members.
                </CardDescription>
              </PermissionCard>
            </CardLink>
          </ComponentGate>
          
          <ComponentGate componentId={ComponentId.PROVIDER_ADMIN_PERMISSIONS}>
            <CardLink href="/admin/permissions/provider">
              <PermissionCard>
                <CardHeader>
                  <IconWrapper>
                    <Hospital size={24} />
                  </IconWrapper>
                  <CardTitle>Healthcare Providers</CardTitle>
                </CardHeader>
                <CardDescription>
                  Manage permissions for healthcare provider administrators and their medical staff.
                </CardDescription>
              </PermissionCard>
            </CardLink>
          </ComponentGate>
        </PermissionGrid>
      </Container>
    </ComponentGate>
  );
};

export default PermissionsIndexPage; 