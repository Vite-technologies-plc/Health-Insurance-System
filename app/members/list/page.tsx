'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../common/Table';
import Button from '../../common/Button';
import { useAuthorization } from '../../lib/rbac/use-authorization';
import { UserType } from '../../lib/rbac/models';
import { Search, Pencil, Trash2, Eye, UserCheck, RefreshCw } from 'lucide-react';
import { UserTypeBasedRoute } from '../../lib/rbac/protected-route';

// Styled components
const Container = styled.div`
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 0.5rem;
  flex: 1;

  input {
    border: none;
    outline: none;
    width: 100%;
    margin-left: 0.5rem;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const CardDescription = styled.p`
  color: #64748b;
  font-size: 0.875rem;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' }>`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => props.status === 'active' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.status === 'active' ? '#166534' : '#991b1b'};
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px dashed #d1d5db;
`;

const DeleteConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

const DialogContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 28rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const DialogHeader = styled.div`
  margin-bottom: 1rem;
`;

const DialogTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const DialogDescription = styled.p`
  color: #64748b;
  font-size: 0.875rem;
`;

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

// Mock data
interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  membershipId: string;
  policyNumber: string;
  createdAt: string;
  updatedAt: string;
}

const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    status: 'active',
    membershipId: 'MEM-001',
    policyNumber: 'POL-12345',
    createdAt: '2023-01-15',
    updatedAt: '2023-06-20'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    status: 'active',
    membershipId: 'MEM-002',
    policyNumber: 'POL-67890',
    createdAt: '2023-02-10',
    updatedAt: '2023-05-15'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    phone: '(555) 456-7890',
    status: 'inactive',
    membershipId: 'MEM-003',
    policyNumber: 'POL-54321',
    createdAt: '2023-03-05',
    updatedAt: '2023-04-12'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    phone: '(555) 789-0123',
    status: 'active',
    membershipId: 'MEM-004',
    policyNumber: 'POL-09876',
    createdAt: '2023-01-20',
    updatedAt: '2023-06-18'
  },
  {
    id: '5',
    name: 'Robert Brown',
    email: 'robert.brown@example.com',
    phone: '(555) 321-6547',
    status: 'inactive',
    membershipId: 'MEM-005',
    policyNumber: 'POL-13579',
    createdAt: '2023-02-28',
    updatedAt: '2023-03-15'
  },
];

const MembersListPage: React.FC = () => {
  const router = useRouter();
  const { hasUserType } = useAuthorization();

  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMembers(MOCK_MEMBERS);
      setFilteredMembers(MOCK_MEMBERS);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter members based on search term and status
    let result = members;
    
    if (searchTerm) {
      result = result.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.membershipId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(member => 
        member.status === statusFilter
      );
    }
    
    setFilteredMembers(result);
  }, [searchTerm, statusFilter, members]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleViewMember = (memberId: string) => {
    router.push(`/members/${memberId}`);
  };

  const handleEditMember = (memberId: string) => {
    router.push(`/members/edit?id=${memberId}`);
  };

  const handleDeleteMember = (member: Member) => {
    setMemberToDelete(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (memberToDelete) {
      // In a real application, this would be an API call
      const updatedMembers = members.map(member => {
        if (member.id === memberToDelete.id) {
          return { ...member, status: 'inactive' as 'active' | 'inactive' };
        }
        return member;
      });
      
      setMembers(updatedMembers);
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  return (
    <Container>
      <Header>
        <Title>Members</Title>
        <Button onClick={() => router.push('/members/create')}>
          <UserCheck size={16} style={{ marginRight: '0.5rem' }} />
          Add New Member
        </Button>
      </Header>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Members</CardTitle>
          <CardDescription>
            View and manage member information, policies, and claims
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <SearchBar>
            <SearchInput>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Search by name, email, ID or policy number..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchInput>
            
            <FilterSelect value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </FilterSelect>
            
            <Button 
              variant="secondary" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
              Reset
            </Button>
          </SearchBar>
          
          {loading ? (
            <LoadingState>
              <div>Loading members...</div>
            </LoadingState>
          ) : filteredMembers.length === 0 ? (
            <EmptyState>
              <UserCheck size={24} color="#9ca3af" style={{ marginBottom: '0.5rem' }} />
              <p style={{ color: '#4b5563', marginBottom: '0.25rem' }}>No members found</p>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Try adjusting your search or filters</p>
            </EmptyState>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Membership ID</TableHead>
                  <TableHead>Policy Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.membershipId}</TableCell>
                    <TableCell>{member.policyNumber}</TableCell>
                    <TableCell>
                      <StatusBadge status={member.status}>
                        {member.status === 'active' ? 'Active' : 'Inactive'}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="tertiary" 
                        title="View" 
                        onClick={() => handleViewMember(member.id)}
                      >
                        <Eye size={16} />
                      </Button>
                      
                      <Button 
                        variant="tertiary" 
                        title="Edit" 
                        onClick={() => handleEditMember(member.id)}
                      >
                        <Pencil size={16} />
                      </Button>
                      
                      <Button 
                        variant="danger" 
                        title="Deactivate" 
                        onClick={() => handleDeleteMember(member)}
                        disabled={member.status === 'inactive'}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        
        <CardFooter>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Showing {filteredMembers.length} of {members.length} members
          </div>
        </CardFooter>
      </Card>
      
      {isDeleteDialogOpen && (
        <DeleteConfirmDialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to deactivate this member?</DialogTitle>
              <DialogDescription>
                This will mark the member as inactive. The member's data will be preserved but they will no longer have access to the system.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Deactivate
              </Button>
            </DialogFooter>
          </DialogContent>
        </DeleteConfirmDialog>
      )}
    </Container>
  );
};

export default function MembersPage() {
  return (
    <UserTypeBasedRoute 
      userTypes={[
        UserType.ADMIN,
        UserType.INSURANCE_ADMIN,
        UserType.CORPORATE_ADMIN,
        UserType.PROVIDER_ADMIN
      ]}
    >
      <MembersListPage />
    </UserTypeBasedRoute>
  );
} 