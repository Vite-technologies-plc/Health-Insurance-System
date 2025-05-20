'use client';

import React from 'react';
import PermissionManager from '../../../permissions/PermissionManager';
import { UserType } from '../../../lib/rbac/models';
import { ComponentGate, ComponentId } from '../../../lib/rbac';

const CorporatePermissionsPage: React.FC = () => {
  return (
    <ComponentGate componentId={ComponentId.CORPORATE_ADMIN_PERMISSIONS}>
      <PermissionManager 
        title="Corporate Admin Permissions" 
        adminType={UserType.ADMIN}
        managedUserTypes={[
          UserType.CORPORATE_ADMIN, 
          UserType.MEMBER
        ]}
      />
    </ComponentGate>
  );
};

export default CorporatePermissionsPage; 