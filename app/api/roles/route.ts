import { NextRequest, NextResponse } from 'next/server';
import { Role, DEFAULT_ROLES } from '../../lib/rbac/models';

// Mock data store
let roles: Role[] = [...DEFAULT_ROLES];

/**
 * GET /api/roles
 * Get all roles
 */
export async function GET() {
  return NextResponse.json({ roles }, { status: 200 });
}

/**
 * POST /api/roles
 * Create a new role
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate request data
    if (!data.name || !data.description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }
    
    // Create new role
    const newRole: Role = {
      id: `role-${Date.now()}`,
      name: data.name,
      description: data.description,
      permissions: data.permissions || []
    };
    
    roles.push(newRole);
    
    return NextResponse.json({ role: newRole }, { status: 201 });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    );
  }
} 