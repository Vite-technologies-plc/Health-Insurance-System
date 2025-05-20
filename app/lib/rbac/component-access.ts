import { Resource, UserType } from './models';

/**
 * Component access codes for role-based access control
 * Each component in the system should have a unique component ID
 */
export enum ComponentId {
  // Common components
  LOGIN = 'com.login',
  HEADER = 'com.header',
  DASHBOARD = 'com.dashboard',
  
  // User management components
  USER_LIST = 'users.list',
  USER_CREATE = 'users.create',
  USER_EDIT = 'users.edit',
  USER_DELETE = 'users.delete',
  
  // Insurance company components
  INSURANCE_LIST = 'insurance.list',
  INSURANCE_CREATE = 'insurance.create',
  INSURANCE_EDIT = 'insurance.edit',
  INSURANCE_DELETE = 'insurance.delete',
  INSURANCE_ADMIN_DASHBOARD = "insurance.admin.dashboard",
  
  // Policy components
  POLICY_LIST = 'policy.list',
  POLICY_CREATE = 'policy.create',
  POLICY_EDIT = 'policy.edit',
  POLICY_DELETE = 'policy.delete',
  
  // Claims components
  CLAIM_LIST = 'claim.list',
  CLAIM_CREATE = 'claim.create',
  CLAIM_EDIT = 'claim.edit',
  CLAIM_APPROVE = 'claim.approve',
  CLAIM_REJECT = 'claim.reject',
  
  // Corporate client components
  CORPORATE_LIST = 'corporate.list',
  CORPORATE_CREATE = 'corporate.create',
  CORPORATE_EDIT = 'corporate.edit',
  CORPORATE_DELETE = 'corporate.delete',
  CORPORATE_ADMIN_DASHBOARD = "corporate.admin.dashboard",
  
  // Coverage plan components
  COVERAGE_LIST = 'coverage.list',
  COVERAGE_CREATE = 'coverage.create',
  COVERAGE_EDIT = 'coverage.edit',
  COVERAGE_DELETE = 'coverage.delete',
  
  // Profile components
  PROFILE_VIEW = 'profile.view',
  PROFILE_EDIT = 'profile.edit',
  
  // Settings components
  SETTINGS_VIEW = 'settings.view',
  SETTINGS_EDIT = 'settings.edit',
  
  // Admin management components
  ADMIN_LIST = 'admin.list',
  ADMIN_CREATE = 'admin.create',
  ADMIN_EDIT = 'admin.edit',
  ADMIN_DELETE = 'admin.delete',
  
  // Permission management components
  PERMISSION_VIEW = 'permission-view',
  PERMISSION_EDIT = 'permission-edit',
  
  // Sidebar components
  SIDEBAR_DASHBOARD = 'sidebar.dashboard',
  SIDEBAR_INSURANCE_COMPANIES = 'sidebar.insurance_companies',
  SIDEBAR_CREATE_INSURANCE = 'sidebar.create_insurance',
  SIDEBAR_ADMINS = 'sidebar.admins',
  SIDEBAR_PROFILE = 'sidebar.profile',
  SIDEBAR_SETTINGS = 'sidebar.settings',
  
  // Provider management components
  PROVIDER_LIST = 'provider.list',
  PROVIDER_CREATE = 'provider.create',
  PROVIDER_EDIT = 'provider.edit',
  PROVIDER_DELETE = 'provider.delete',
  PROVIDER_ADMIN_DASHBOARD = 'provider.admin.dashboard',
  PROVIDER_ADMIN_LIST = 'provider.admin.list',
  PROVIDER_ADMIN_CREATE = 'provider.admin.create',
  PROVIDER_ADMIN_EDIT = 'provider.admin.edit',
  PROVIDER_ADMIN_DELETE = 'provider.admin.delete',
  PROVIDER_ADMIN_PERMISSION = 'provider.admin.permission',
  
  // Corporate management components
  CORPORATE_ADMIN_LIST = 'corporate.admin.list',
  CORPORATE_ADMIN_CREATE = 'corporate.admin.create',
  CORPORATE_ADMIN_EDIT = 'corporate.admin.edit',
  CORPORATE_ADMIN_DELETE = 'corporate.admin.delete',
  CORPORATE_ADMIN_PERMISSION = 'corporate.admin.permission',
  
  // Staff management components
  STAFF_LIST = 'staff.list',
  STAFF_CREATE = 'staff.create',
  STAFF_EDIT = 'staff.edit',
  STAFF_DELETE = 'staff.delete',
  STAFF_PERMISSION = 'staff.permission',
  STAFF_DASHBOARD = "staff.dashboard",
  
  // Member management components
  MEMBER_LIST = 'member.list',
  MEMBER_CREATE = 'member.create',
  MEMBER_EDIT = 'member.edit',
  MEMBER_DELETE = 'member.delete',
  MEMBER_DASHBOARD = "member.dashboard",
  
  // Provider member management components
  PROVIDER_MEMBER_LIST = 'provider.member.list',
  PROVIDER_MEMBER_CREATE = 'provider.member.create',
  PROVIDER_MEMBER_EDIT = 'provider.member.edit',
  PROVIDER_MEMBER_DELETE = 'provider.member.delete',
  
  // Sidebar sections for insurance admin
  SIDEBAR_PROVIDERS = 'sidebar.providers',
  SIDEBAR_PROVIDERS_ADMIN = 'sidebar.providers.admin',
  SIDEBAR_CORPORATE = 'sidebar.corporate',
  SIDEBAR_CORPORATE_ADMIN = 'sidebar.corporate.admin',
  SIDEBAR_STAFF = 'sidebar.staff',
  SIDEBAR_MEMBERS = 'sidebar.members',
  INSURANCE_ADMIN_PERMISSIONS = 'insurance-admin-permissions',
  CORPORATE_ADMIN_PERMISSIONS = 'corporate-admin-permissions',
  PROVIDER_ADMIN_PERMISSIONS = 'provider-admin-permissions',
}

/**
 * Maps user types to the components they can access
 */
export const USER_TYPE_COMPONENT_MAP: Record<UserType, ComponentId[]> = {
  [UserType.ADMIN]: [
    // Common components
    ComponentId.LOGIN,
    ComponentId.HEADER,
    ComponentId.DASHBOARD,
    
    // Insurance company management
    ComponentId.INSURANCE_LIST,
    ComponentId.INSURANCE_CREATE,
    ComponentId.INSURANCE_EDIT,
    ComponentId.INSURANCE_DELETE,
    
    // Admin management
    ComponentId.ADMIN_LIST,
    ComponentId.ADMIN_CREATE,
    ComponentId.ADMIN_EDIT,
    ComponentId.ADMIN_DELETE,
    
    // User management
    ComponentId.USER_LIST,
    ComponentId.USER_CREATE,
    ComponentId.USER_EDIT,
    ComponentId.USER_DELETE,
    
    // Permission management
    ComponentId.PERMISSION_VIEW,
    ComponentId.PERMISSION_EDIT,
    
    // Profile & Settings
    ComponentId.PROFILE_VIEW,
    ComponentId.PROFILE_EDIT,
    ComponentId.SETTINGS_VIEW,
    ComponentId.SETTINGS_EDIT,
    
    // Sidebar components
    ComponentId.SIDEBAR_DASHBOARD,
    ComponentId.SIDEBAR_INSURANCE_COMPANIES,
    ComponentId.SIDEBAR_CREATE_INSURANCE,
    ComponentId.SIDEBAR_ADMINS,
    ComponentId.SIDEBAR_PROFILE,
    ComponentId.SIDEBAR_SETTINGS,
  ],
  
  [UserType.INSURANCE_ADMIN]: [
    // Common components
    ComponentId.LOGIN,
    ComponentId.HEADER,
    ComponentId.INSURANCE_ADMIN_DASHBOARD,
  
    
    // User management
    ComponentId.USER_LIST,
    ComponentId.USER_CREATE,
    ComponentId.USER_EDIT,
    ComponentId.USER_DELETE,
    
    // Policy management
    ComponentId.POLICY_LIST,
    ComponentId.POLICY_CREATE,
    ComponentId.POLICY_EDIT,
    ComponentId.POLICY_DELETE,
    
    // Claim management
    ComponentId.CLAIM_LIST,
    ComponentId.CLAIM_EDIT,
    ComponentId.CLAIM_APPROVE,
    ComponentId.CLAIM_REJECT,
    
    // Coverage plan management
    ComponentId.COVERAGE_LIST,
    ComponentId.COVERAGE_CREATE,
    ComponentId.COVERAGE_EDIT,
    ComponentId.COVERAGE_DELETE,
    
    // Provider management
    ComponentId.PROVIDER_LIST,
    ComponentId.PROVIDER_CREATE,
    ComponentId.PROVIDER_EDIT,
    ComponentId.PROVIDER_DELETE,
    ComponentId.PROVIDER_ADMIN_LIST,
    ComponentId.PROVIDER_ADMIN_CREATE,
    ComponentId.PROVIDER_ADMIN_EDIT,
    ComponentId.PROVIDER_ADMIN_DELETE,
    ComponentId.PROVIDER_ADMIN_PERMISSION,
    
    // Corporate management
    ComponentId.CORPORATE_LIST,
    ComponentId.CORPORATE_CREATE,
    ComponentId.CORPORATE_EDIT,
    ComponentId.CORPORATE_DELETE,
    ComponentId.CORPORATE_ADMIN_LIST,
    ComponentId.CORPORATE_ADMIN_CREATE,
    ComponentId.CORPORATE_ADMIN_EDIT,
    ComponentId.CORPORATE_ADMIN_DELETE,
    ComponentId.CORPORATE_ADMIN_PERMISSION,
    
    // Staff management
    ComponentId.STAFF_LIST,
    ComponentId.STAFF_CREATE,
    ComponentId.STAFF_EDIT,
    ComponentId.STAFF_DELETE,
    ComponentId.STAFF_PERMISSION,
    
    // Member management
    ComponentId.MEMBER_LIST,
    ComponentId.MEMBER_CREATE,
    ComponentId.MEMBER_EDIT,
    ComponentId.MEMBER_DELETE,
    
    // Profile & Settings
    ComponentId.PROFILE_VIEW,
    ComponentId.PROFILE_EDIT,
    ComponentId.SETTINGS_VIEW,
    ComponentId.SETTINGS_EDIT,
    
    // Sidebar components for insurance admin
    ComponentId.SIDEBAR_DASHBOARD,
    ComponentId.SIDEBAR_PROVIDERS,
    ComponentId.SIDEBAR_PROVIDERS_ADMIN,
    ComponentId.SIDEBAR_CORPORATE,
    ComponentId.SIDEBAR_CORPORATE_ADMIN,
    ComponentId.SIDEBAR_STAFF,
    ComponentId.SIDEBAR_MEMBERS,
    ComponentId.SIDEBAR_PROFILE,
    ComponentId.SIDEBAR_SETTINGS,
  ],
  
  [UserType.INSURANCE_STAFF]: [
    ComponentId.LOGIN,
    ComponentId.HEADER,
    ComponentId.STAFF_DASHBOARD,
    ComponentId.POLICY_LIST,
    ComponentId.CLAIM_LIST,
    ComponentId.CLAIM_EDIT,
    ComponentId.PROFILE_VIEW,
    ComponentId.PROFILE_EDIT,
    ComponentId.SIDEBAR_DASHBOARD,
    ComponentId.SIDEBAR_PROFILE,
  ],
  
  [UserType.CORPORATE_ADMIN]: [
    ComponentId.LOGIN,
    ComponentId.HEADER,
    ComponentId.CORPORATE_ADMIN_DASHBOARD,
    
    // Corporate-related permissions
    ComponentId.CORPORATE_LIST,
    ComponentId.CORPORATE_EDIT,
    ComponentId.COVERAGE_LIST,
    
    // Member management
    ComponentId.MEMBER_LIST,
    ComponentId.MEMBER_CREATE,
    ComponentId.MEMBER_EDIT,
    ComponentId.MEMBER_DELETE,
    
    // Staff management (view only)
    ComponentId.STAFF_LIST,
    
    // Profile & Settings
    ComponentId.PROFILE_VIEW,
    ComponentId.PROFILE_EDIT,
    ComponentId.SETTINGS_VIEW,
    
    // Sidebar components
    ComponentId.SIDEBAR_DASHBOARD,
    ComponentId.SIDEBAR_STAFF,
    ComponentId.SIDEBAR_MEMBERS,
    ComponentId.SIDEBAR_PROFILE,
    ComponentId.SIDEBAR_SETTINGS,
  ],
  
  [UserType.PROVIDER_ADMIN]: [
    ComponentId.LOGIN,
    ComponentId.HEADER,
    ComponentId.PROVIDER_ADMIN_DASHBOARD,
    ComponentId.CLAIM_LIST,
    ComponentId.CLAIM_CREATE,
    ComponentId.CLAIM_EDIT,
    ComponentId.PROFILE_VIEW,
    ComponentId.PROFILE_EDIT,
    ComponentId.SIDEBAR_DASHBOARD,
    ComponentId.SIDEBAR_PROFILE,
    ComponentId.SIDEBAR_SETTINGS,
    ComponentId.SETTINGS_VIEW,
    ComponentId.SIDEBAR_STAFF,
    ComponentId.STAFF_LIST,
    ComponentId.SIDEBAR_MEMBERS,
    ComponentId.PROVIDER_MEMBER_LIST,
    ComponentId.PROVIDER_MEMBER_CREATE,
    ComponentId.PROVIDER_MEMBER_EDIT,
    ComponentId.PROVIDER_MEMBER_DELETE,
  ],
  
  [UserType.STAFF]: [
    ComponentId.LOGIN,
    ComponentId.HEADER,
    ComponentId.STAFF_DASHBOARD,
    ComponentId.PROFILE_VIEW,
    ComponentId.PROFILE_EDIT,
    ComponentId.INSURANCE_LIST,
    ComponentId.SIDEBAR_DASHBOARD,
    ComponentId.SIDEBAR_PROFILE,
  ],
  
  [UserType.MEMBER]: [
    ComponentId.LOGIN,
    ComponentId.HEADER,
    ComponentId.MEMBER_DASHBOARD,
    ComponentId.POLICY_LIST,
    ComponentId.CLAIM_LIST,
    ComponentId.CLAIM_CREATE,
    ComponentId.PROFILE_VIEW,
    ComponentId.PROFILE_EDIT,
    ComponentId.COVERAGE_LIST,
    ComponentId.SIDEBAR_DASHBOARD,
    ComponentId.SIDEBAR_PROFILE,
  ],
  
  [UserType.PROVIDER]: [
    ComponentId.LOGIN,
    ComponentId.HEADER,
    ComponentId.PROVIDER_ADMIN_DASHBOARD,
    ComponentId.CLAIM_LIST,
    ComponentId.CLAIM_CREATE,
    ComponentId.PROFILE_VIEW,
    ComponentId.PROFILE_EDIT,
    ComponentId.COVERAGE_LIST,
    ComponentId.SIDEBAR_DASHBOARD,
    ComponentId.SIDEBAR_PROVIDERS,
    ComponentId.SIDEBAR_PROFILE,
  ],
};

/**
 * Enhanced component access check that considers both userType and adminType
 */
export const canAccessComponent = (
    userType: UserType | string, 
    componentId: ComponentId,
    adminType?: string
): boolean => {
    // System admin check
    if (userType === UserType.ADMIN && adminType === 'SYSTEM_ADMIN') {
        return true; // System admins can access everything
    }

    // Get the components allowed for this user type
    const allowedComponents = USER_TYPE_COMPONENT_MAP[userType as UserType] || [];

    // Special handling for different admin types
    switch (adminType) {
        case 'SYSTEM_ADMIN':
            return true;
        case 'INSURANCE_ADMIN':
            return allowedComponents.includes(componentId) || [
                ComponentId.SIDEBAR_PROVIDERS,
                ComponentId.SIDEBAR_CORPORATE,
                ComponentId.SIDEBAR_STAFF,
                ComponentId.SIDEBAR_MEMBERS,
                // Add other insurance admin specific components
            ].includes(componentId);
        case 'PROVIDER_ADMIN':
            return allowedComponents.includes(componentId) || [
                ComponentId.SIDEBAR_STAFF,
                ComponentId.SIDEBAR_MEMBERS,
                ComponentId.PROVIDER_ADMIN_DASHBOARD,
                // Add other provider admin specific components
            ].includes(componentId);
        case 'CORPORATE_ADMIN':
            return allowedComponents.includes(componentId) || [
                ComponentId.SIDEBAR_MEMBERS,
                ComponentId.CORPORATE_ADMIN_DASHBOARD,
                // Add other corporate admin specific components
            ].includes(componentId);
        default:
            // Default to checking just the user type component map
  return allowedComponents.includes(componentId);
    }
};

/**
 * Helper function to check component access by resource and action
 */
export const canAccessComponentByPermission = (
  resource: Resource, 
  action: string, 
  componentId: ComponentId
): boolean => {
    // Get components allowed for this resource/action combination
    const componentsForAction = getComponentsForResourceAction(resource, action);
    return componentsForAction.includes(componentId);
};

/**
 * Helper function to get components for a resource/action combination
 */
const getComponentsForResourceAction = (
    resource: Resource,
    action: string
): ComponentId[] => {
    // Map resources and actions to component IDs
    const resourceActionMap: Record<string, Record<string, ComponentId[]>> = {
        users: {
            view: [ComponentId.USER_LIST],
            create: [ComponentId.USER_CREATE],
            edit: [ComponentId.USER_EDIT],
            delete: [ComponentId.USER_DELETE]
        },
        insurance: {
            view: [ComponentId.INSURANCE_LIST],
            create: [ComponentId.INSURANCE_CREATE],
            edit: [ComponentId.INSURANCE_EDIT],
            delete: [ComponentId.INSURANCE_DELETE]
        },
        // Add more resource/action mappings as needed
    };

    return resourceActionMap[resource]?.[action] || [];
}; 