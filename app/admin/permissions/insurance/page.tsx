'use client';

import React from 'react';
import PermissionManager from '../../../permissions/PermissionManager';
import { UserType } from '../../../lib/rbac/models';
import { ComponentGate, ComponentId } from '../../../lib/rbac';

const InsurancePermissionsPage: React.FC = () => {
  return (
    <ComponentGate componentId={ComponentId.INSURANCE_ADMIN_PERMISSIONS}>
      <PermissionManager 
        title="Insurance Company Admin Permissions" 
        adminType={UserType.ADMIN}
        managedUserTypes={[
          UserType.INSURANCE_ADMIN, 
          UserType.INSURANCE_STAFF, 
          UserType.CORPORATE_ADMIN, 
          UserType.PROVIDER_ADMIN,
          UserType.MEMBER
        ]}
      />
    </ComponentGate>
  );
};

export default InsurancePermissionsPage; 