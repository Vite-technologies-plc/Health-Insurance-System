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
import { Role, Resource, Action, User, UserType, MOCK_USERS } from '../../lib/rbac/models';
import { PermissionGate } from '../../lib/rbac/permission-gate';
import { Save, X, Edit, Search } from 'lucide-react';
import { useAuth } from '../../lib/rbac/auth-context';

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
  padding: 16px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
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

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  font-size: 14px;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  margin-bottom: 24px;
  font-size: ${theme.typography.fontSizes.sm};
`;

const ActionButton = styled(Button)`
  margin-left: 8px;
`;

const RoleChip = styled.span`
  background-color: ${theme.colors.primaryLight};
  color: ${theme.colors.primary};
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.full};
  font-size: 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  display: inline-block;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const SearchIcon = styled.div`
  color: ${theme.colors.textSecondary};
`;

const UserRolePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { refreshUser } = useAuth();

  useEffect(() => {
    // In a real app, you would fetch users from an API
    setUsers(MOCK_USERS);
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const allRoles = await roleService.getAllRoles();
      setRoles(allRoles);
    } catch (error) {
      console.error('Failed to load roles', error);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setSelectedRoles(user.roles.map(role => role.id));
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roleId = e.target.value;
    if (!roleId) return;
    
    // Don't add if already selected
    if (selectedRoles.includes(roleId)) return;
    
    setSelectedRoles(prev => [...prev, roleId]);
  };

  const handleRemoveRole = (roleId: string) => {
    setSelectedRoles(prev => prev.filter(id => id !== roleId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser) return;
    
    // Find the user in our local state
    const userIndex = users.findIndex(u => u.id === editingUser.id);
    if (userIndex === -1) return;
    
    // Get the selected role objects
    const selectedRoleObjects = roles.filter(role => selectedRoles.includes(role.id));
    
    // Update the user
    const updatedUser = {
      ...users[userIndex],
      roles: selectedRoleObjects
    };
    
    // Update local state
    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    setUsers(updatedUsers);
    
    // In a real app, you would save this to your API
    
    // If the user being edited is the current user, refresh their context
    await refreshUser();
    
    // Reset form
    setEditingUser(null);
    setSelectedRoles([]);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setSelectedRoles([]);
  };

  // Filter users by search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Title>User Role Assignment</Title>
      
      <PermissionGate resource={Resource.USERS} action={Action.READ}>
        <Card>
          <SearchContainer>
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
            <SearchInput 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          {editingUser && (
            <Form onSubmit={handleSubmit}>
              <h3>Edit Roles for {editingUser.name}</h3>
              
              <FormGroup>
                <Label>Assign Role</Label>
                <Select 
                  onChange={handleRoleChange}
                  value=""
                >
                  <option value="">Select a role to assign...</option>
                  {roles.map(role => (
                    <option 
                      key={role.id} 
                      value={role.id}
                      disabled={selectedRoles.includes(role.id)}
                    >
                      {role.name} - {role.description}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Assigned Roles</Label>
                <div>
                  {selectedRoles.length === 0 ? (
                    <p>No roles assigned</p>
                  ) : (
                    selectedRoles.map(roleId => {
                      const role = roles.find(r => r.id === roleId);
                      return role ? (
                        <RoleChip key={roleId}>
                          {role.name}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveRole(roleId)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '4px' }}
                          >
                            ×
                          </button>
                        </RoleChip>
                      ) : null;
                    })
                  )}
                </div>
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
                  Save Roles
                </Button>
              </ButtonGroup>
            </Form>
          )}
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.userType}</TableCell>
                  <TableCell>
                    {user.roles.map(role => (
                      <RoleChip key={role.id}>{role.name}</RoleChip>
                    ))}
                  </TableCell>
                  <TableCell>
                    <PermissionGate resource={Resource.USERS} action={Action.UPDATE}>
                      <ActionButton 
                        size="small" 
                        variant="secondary"
                        icon={<Edit size={16} />}
                        onClick={() => handleEditUser(user)}
                      >
                        Edit Roles
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

export default UserRolePage; 