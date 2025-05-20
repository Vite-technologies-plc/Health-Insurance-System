'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';
import Button from '../../common/Button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../../common/Table';
import { roleService } from '../../lib/services/role-service';
import { permissionService } from '../../lib/services/permission-service';
import { Role, Permission, Resource, Action } from '../../lib/rbac/models';
import { PermissionGate } from '../../lib/rbac/permission-gate';
import Checkbox from '../../common/Checkbox';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';

// Styled components
const Container = styled.div`
  padding: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
  color: ${theme.colors.textPrimary};
`;

const Card = styled.div`
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  justify-content: flex-end;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 14px;
`;

const TextArea = styled.textarea`
  padding: 8px 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 14px;
  min-height: 100px;
`;

const ActionButton = styled(Button)`
  margin-left: 8px;
`;

const PermissionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr repeat(5, auto);
  gap: 12px;
  margin-bottom: 16px;
`;

const GridHeader = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  padding: 8px 0;
`;

const GridItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
`;

interface RoleFormData {
  name: string;
  description: string;
}

const RolePage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<RoleFormData>({ name: '', description: '' });
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadRoles();
    loadPermissions();
    // Extract unique resources from Object.values(Resource)
    setResources(Object.values(Resource));
  }, []);

  const loadRoles = async () => {
    try {
      const allRoles = await roleService.getAllRoles();
      setRoles(allRoles);
    } catch (error) {
      console.error('Failed to load roles', error);
    }
  };

  const loadPermissions = async () => {
    try {
      const allPermissions = await permissionService.getAllPermissions();
      setPermissions(allPermissions);
    } catch (error) {
      console.error('Failed to load permissions', error);
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description
    });
    
    // Set selected permissions based on role permissions
    const permissionsMap: Record<string, boolean> = {};
    role.permissions.forEach(permission => {
      permissionsMap[permission.id] = true;
    });
    setSelectedPermissions(permissionsMap);
    
    setIsCreating(false);
  };

  const handleDeleteRole = async (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await roleService.deleteRole(roleId);
        loadRoles();
      } catch (error) {
        console.error('Failed to delete role', error);
      }
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setEditingRole(null);
    setFormData({ name: '', description: '' });
    setSelectedPermissions({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [permissionId]: checked
    }));
  };

  const handleResourcePermissionChange = (resource: Resource, action: Action, checked: boolean) => {
    // Find the permission with this resource and action
    const permission = permissions.find(p => p.resource === resource && p.action === action);
    if (permission) {
      handlePermissionChange(permission.id, checked);
    }
  };

  const handleToggleAllForResource = (resource: Resource, checked: boolean) => {
    // Find all permissions for this resource
    const resourcePermissions = permissions.filter(p => p.resource === resource);
    
    // Create a new permissions map
    const newPermissionsMap = { ...selectedPermissions };
    
    // Set all permissions for this resource to the checked value
    resourcePermissions.forEach(permission => {
      newPermissionsMap[permission.id] = checked;
    });
    
    setSelectedPermissions(newPermissionsMap);
  };

  const isResourceActionSelected = (resource: Resource, action: Action): boolean => {
    const permission = permissions.find(p => p.resource === resource && p.action === action);
    return permission ? !!selectedPermissions[permission.id] : false;
  };

  const areAllActionsSelected = (resource: Resource): boolean => {
    const resourcePermissions = permissions.filter(p => p.resource === resource);
    return resourcePermissions.every(p => !!selectedPermissions[p.id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get selected permissions objects
      const selectedPermissionObjects = permissions.filter(p => selectedPermissions[p.id]);
      
      if (isCreating) {
        // Create new role
        await roleService.createRole({
          name: formData.name,
          description: formData.description,
          permissions: selectedPermissionObjects
        });
      } else if (editingRole) {
        // Update existing role
        await roleService.updateRole(editingRole.id, {
          name: formData.name,
          description: formData.description,
          permissions: selectedPermissionObjects
        });
      }
      
      // Reset form and refresh roles
      setIsCreating(false);
      setEditingRole(null);
      setFormData({ name: '', description: '' });
      setSelectedPermissions({});
      loadRoles();
    } catch (error) {
      console.error('Failed to save role', error);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingRole(null);
    setFormData({ name: '', description: '' });
    setSelectedPermissions({});
  };

  return (
    <Container>
      <Title>Role Management</Title>
      
      <PermissionGate resource={Resource.ROLES} action={Action.READ}>
        <Card>
          <ButtonGroup>
            <PermissionGate resource={Resource.ROLES} action={Action.CREATE}>
              <Button 
                icon={<Plus size={16} />} 
                onClick={handleCreateNew}
                disabled={isCreating || editingRole !== null}
              >
                Create New Role
              </Button>
            </PermissionGate>
          </ButtonGroup>
          
          {(isCreating || editingRole) && (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Role Name</Label>
                <Input 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Description</Label>
                <TextArea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Permissions</Label>
                
                {resources.map(resource => (
                  <div key={resource}>
                    <h3>{resource}</h3>
                    <PermissionGrid>
                      <GridHeader>Action</GridHeader>
                      <GridHeader>Read</GridHeader>
                      <GridHeader>Create</GridHeader>
                      <GridHeader>Update</GridHeader>
                      <GridHeader>Delete</GridHeader>
                      <GridHeader>Select All</GridHeader>
                      
                      <GridItem>Resource Permissions</GridItem>
                      <GridItem>
                        <Checkbox 
                          checked={isResourceActionSelected(resource, Action.READ)}
                          onChange={(e) => handleResourcePermissionChange(
                            resource, 
                            Action.READ, 
                            e.target.checked
                          )}
                        />
                      </GridItem>
                      <GridItem>
                        <Checkbox 
                          checked={isResourceActionSelected(resource, Action.CREATE)}
                          onChange={(e) => handleResourcePermissionChange(
                            resource, 
                            Action.CREATE, 
                            e.target.checked
                          )}
                        />
                      </GridItem>
                      <GridItem>
                        <Checkbox 
                          checked={isResourceActionSelected(resource, Action.UPDATE)}
                          onChange={(e) => handleResourcePermissionChange(
                            resource, 
                            Action.UPDATE, 
                            e.target.checked
                          )}
                        />
                      </GridItem>
                      <GridItem>
                        <Checkbox 
                          checked={isResourceActionSelected(resource, Action.DELETE)}
                          onChange={(e) => handleResourcePermissionChange(
                            resource, 
                            Action.DELETE, 
                            e.target.checked
                          )}
                        />
                      </GridItem>
                      <GridItem>
                        <Checkbox 
                          checked={areAllActionsSelected(resource)}
                          onChange={(e) => handleToggleAllForResource(
                            resource,
                            e.target.checked
                          )}
                        />
                      </GridItem>
                    </PermissionGrid>
                  </div>
                ))}
              </FormGroup>
              
              <ButtonGroup>
                <Button 
                  variant="secondary" 
                  type="button"
                  onClick={handleCancel}
                  icon={<X size={16} />}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  icon={<Save size={16} />}
                >
                  Save Role
                </Button>
              </ButtonGroup>
            </Form>
          )}
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map(role => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>{role.permissions.length}</TableCell>
                  <TableCell>
                    <PermissionGate resource={Resource.ROLES} action={Action.UPDATE}>
                      <ActionButton 
                        size="small" 
                        variant="secondary"
                        icon={<Edit size={16} />}
                        onClick={() => handleEditRole(role)}
                      >
                        Edit
                      </ActionButton>
                    </PermissionGate>
                    <PermissionGate resource={Resource.ROLES} action={Action.DELETE}>
                      <ActionButton 
                        size="small" 
                        variant="danger"
                        icon={<Trash2 size={16} />}
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        Delete
                      </ActionButton>
                    </PermissionGate>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </PermissionGate>
    </Container>
  );
};

export default RolePage; 