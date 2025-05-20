// import { NextRequest, NextResponse } from 'next/server';
// import { Permission, DEFAULT_PERMISSIONS } from '../../lib/rbac/models';

// // Mock data store
// let permissions: Permission[] = [...DEFAULT_PERMISSIONS];

// /**
//  * GET /api/permissions
//  * Get all permissions
//  */
// export async function GET() {
//   return NextResponse.json({ permissions }, { status: 200 });
// }

// /**
//  * POST /api/permissions
//  * Create a new permission
//  */
// export async function POST(request: NextRequest) {
//   try {
//     const data = await request.json();
    
//     // Validate request data
//     if (!data.name || !data.resource || !data.action) {
//       return NextResponse.json(
//         { error: 'Name, resource, and action are required' },
//         { status: 400 }
//       );
//     }
    
//     // Check if a permission with this resource and action already exists
//     const existingPermission = permissions.find(
//       p => p.resource === data.resource && p.action === data.action
//     );
    
//     if (existingPermission) {
//       return NextResponse.json(
//         { error: 'A permission with this resource and action already exists' },
//         { status: 400 }
//       );
//     }
    
//     // Create new permission
//     const newPermission: Permission = {
//       id: `permission-${Date.now()}`,
//       name: data.name,
//       description: data.description || '',
//       resource: data.resource,
//       action: data.action
//     };
    
//     permissions.push(newPermission);
    
//     return NextResponse.json({ permission: newPermission }, { status: 201 });
//   } catch (error) {
//     console.error('Error creating permission:', error);
//     return NextResponse.json(
//       { error: 'Failed to create permission' },
//       { status: 500 }
//     );
//   }
// } 