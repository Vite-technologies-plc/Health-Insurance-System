// import { NextRequest, NextResponse } from 'next/server';
// import { User, MOCK_USERS, Role, DEFAULT_ROLES } from '../../../../lib/rbac/models';

// // Mock data stores
// let users: User[] = [...MOCK_USERS];
// let roles: Role[] = [...DEFAULT_ROLES];

// interface RouteParams {
//   params: {
//     id: string;
//   };
// }

// /**
//  * GET /api/users/[id]/roles
//  * Get roles for a user
//  */
// export async function GET(request: NextRequest, { params }: RouteParams) {
//   const { id } = params;
  
//   // Find the user
//   const user = users.find(user => user.id === id);
  
//   if (!user) {
//     return NextResponse.json(
//       { error: 'User not found' },
//       { status: 404 }
//     );
//   }
  
//   return NextResponse.json({ roles: user.roles }, { status: 200 });
// }

// /**
//  * PUT /api/users/[id]/roles
//  * Update roles for a user
//  */
// export async function PUT(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = params;
//     const data = await request.json();
    
//     // Validate request data
//     if (!data.roleIds || !Array.isArray(data.roleIds)) {
//       return NextResponse.json(
//         { error: 'roleIds array is required' },
//         { status: 400 }
//       );
//     }
    
//     // Find the user
//     const userIndex = users.findIndex(user => user.id === id);
    
//     if (userIndex === -1) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }
    
//     // Get the role objects from role IDs
//     const userRoles = roles.filter(role => data.roleIds.includes(role.id));
    
//     // Update the user's roles
//     users[userIndex] = {
//       ...users[userIndex],
//       roles: userRoles
//     };
    
//     return NextResponse.json({ 
//       user: users[userIndex],
//       roles: userRoles 
//     }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating user roles:', error);
//     return NextResponse.json(
//       { error: 'Failed to update user roles' },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * POST /api/users/[id]/roles
//  * Assign a role to a user
//  */
// export async function POST(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = params;
//     const data = await request.json();
    
//     // Validate request data
//     if (!data.roleId) {
//       return NextResponse.json(
//         { error: 'roleId is required' },
//         { status: 400 }
//       );
//     }
    
//     // Find the user
//     const userIndex = users.findIndex(user => user.id === id);
    
//     if (userIndex === -1) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }
    
//     // Find the role
//     const role = roles.find(role => role.id === data.roleId);
    
//     if (!role) {
//       return NextResponse.json(
//         { error: 'Role not found' },
//         { status: 404 }
//       );
//     }
    
//     // Check if user already has this role
//     if (users[userIndex].roles.some(r => r.id === data.roleId)) {
//       return NextResponse.json(
//         { error: 'User already has this role' },
//         { status: 400 }
//       );
//     }
    
//     // Add the role to the user
//     users[userIndex].roles.push(role);
    
//     return NextResponse.json({ 
//       user: users[userIndex],
//       roles: users[userIndex].roles 
//     }, { status: 200 });
//   } catch (error) {
//     console.error('Error assigning role to user:', error);
//     return NextResponse.json(
//       { error: 'Failed to assign role to user' },
//       { status: 500 }
//     );
//   }
// } 