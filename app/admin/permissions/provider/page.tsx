'use client';

import React from 'react';
import PermissionManager from '../../../permissions/PermissionManager';
import { UserType } from '../../../lib/rbac/models';
import { ComponentGate, ComponentId } from '../../../lib/rbac';

const ProviderPermissionsPage: React.FC = () => {
  return (
    <ComponentGate componentId={ComponentId.PROVIDER_ADMIN_PERMISSIONS}>
      <PermissionManager 
        title="Provider Admin Permissions" 
        adminType={UserType.ADMIN}
        managedUserTypes={[
          UserType.PROVIDER_ADMIN, 
          UserType.PROVIDER
        ]}
      />
    </ComponentGate>
  );
};

export default ProviderPermissionsPage; 