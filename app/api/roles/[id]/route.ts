// import { NextRequest, NextResponse } from 'next/server';
// import { Role, DEFAULT_ROLES } from '../../../lib/rbac/models';

// // Mock data store
// let roles: Role[] = [...DEFAULT_ROLES];

// interface RouteParams {
//   params: {
//     id: string;
//   };
// }

// /**
//  * GET /api/roles/[id]
//  * Get a role by ID
//  */
// export async function GET(request: NextRequest, { params }: RouteParams) {
//   const { id } = params;
  
//   // Find the role
//   const role = roles.find(role => role.id === id);
  
//   if (!role) {
//     return NextResponse.json(
//       { error: 'Role not found' },
//       { status: 404 }
//     );
//   }
  
//   return NextResponse.json({ role }, { status: 200 });
// }

// /**
//  * PUT /api/roles/[id]
//  * Update a role
//  */
// export async function PUT(request: NextRequest, { params }: RouteParams) {
//   try {
//     const { id } = params;
//     const data = await request.json();
    
//     // Find the role
//     const roleIndex = roles.findIndex(role => role.id === id);
    
//     if (roleIndex === -1) {
//       return NextResponse.json(
//         { error: 'Role not found' },
//         { status: 404 }
//       );
//     }
    
//     // Update the role
//     const updatedRole: Role = {
//       ...roles[roleIndex],
//       ...data,
//       id // Ensure ID doesn't change
//     };
    
//     roles[roleIndex] = updatedRole;
    
//     return NextResponse.json({ role: updatedRole }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating role:', error);
//     return NextResponse.json(
//       { error: 'Failed to update role' },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * DELETE /api/roles/[id]
//  * Delete a role
//  */
// export async function DELETE(request: NextRequest, { params }: RouteParams) {
//   const { id } = params;
  
//   // Find the role
//   const roleIndex = roles.findIndex(role => role.id === id);
  
//   if (roleIndex === -1) {
//     return NextResponse.json(
//       { error: 'Role not found' },
//       { status: 404 }
//     );
//   }
  
//   // Remove the role
//   roles.splice(roleIndex, 1);
  
//   return NextResponse.json({ success: true }, { status: 200 });
// } 