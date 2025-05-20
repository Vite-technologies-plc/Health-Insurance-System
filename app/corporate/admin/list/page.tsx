'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '../../../common/Table';
import Button from '../../../common/Button';
import { Search, Plus, Edit, Trash, Eye, Key } from 'lucide-react';
import { ComponentGate, ComponentId } from '../../../lib/rbac';
import Layout from '@/app/components/layout';

// Styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  
  input {
    border: none;
    outline: none;
    width: 100%;
    margin-left: 0.5rem;
    font-size: 0.875rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => 
    props.status === 'Active' ? '#dcfce7' : 
    props.status === 'Inactive' ? '#fee2e2' : 
    props.status === 'Suspended' ? '#fef3c7' : '#f3f4f6'};
  color: ${props => 
    props.status === 'Active' ? '#166534' : 
    props.status === 'Inactive' ? '#b91c1c' : 
    props.status === 'Suspended' ? '#92400e' : '#374151'};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 28rem;
`;

const ModalHeader = styled.div`
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
`;

const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

// Mock data for corporate admins
const mockCorporateAdmins = [
  { 
    id: '1', 
    username: 'acme_admin', 
    name: 'John Smith', 
    email: 'john.smith@acmecorp.com', 
    corporate: 'Acme Corporation',
    lastLogin: '2023-06-15 09:32 AM',
    status: 'Active'
  },
  { 
    id: '2', 
    username: 'global_admin', 
    name: 'Sarah Johnson', 
    email: 'sarah.j@globalindustries.com', 
    corporate: 'Global Industries',
    lastLogin: '2023-06-14 02:45 PM',
    status: 'Active'
  },
  { 
    id: '3', 
    username: 'sunshine_admin', 
    name: 'Michael Chen', 
    email: 'm.chen@sunshinehealthcare.org', 
    corporate: 'Sunshine Healthcare',
    lastLogin: '2023-06-10 11:20 AM',
    status: 'Inactive'
  },
  { 
    id: '4', 
    username: 'nexus_admin', 
    name: 'Emily Rodriguez', 
    email: 'e.rodriguez@nexusfinancial.com', 
    corporate: 'Nexus Financial',
    lastLogin: '2023-06-13 04:15 PM',
    status: 'Suspended'
  },
  { 
    id: '5', 
    username: 'vertex_admin', 
    name: 'David Wilson', 
    email: 'd.wilson@vertexenergy.com', 
    corporate: 'Vertex Energy',
    lastLogin: '2023-06-12 10:05 AM',
    status: 'Active'
  }
];

export default function CorporateAdminList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [adminToResetPassword, setAdminToResetPassword] = useState<string | null>(null);
  
  const filteredAdmins = mockCorporateAdmins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.corporate.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleViewAdmin = (adminId: string) => {
    router.push(`/corporate/admin/${adminId}`);
  };
  
  const handleEditAdmin = (adminId: string) => {
    router.push(`/corporate/admin/edit/${adminId}`);
  };
  
  const handleDeleteClick = (adminId: string) => {
    setAdminToDelete(adminId);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    // In a real app, this would call an API to delete the admin
    console.log(`Deleting admin with ID: ${adminToDelete}`);
    setShowDeleteModal(false);
    setAdminToDelete(null);
    // You could show a success message here
  };
  
  const handleResetPasswordClick = (adminId: string) => {
    setAdminToResetPassword(adminId);
    setShowResetPasswordModal(true);
  };
  
  const confirmResetPassword = () => {
    // In a real app, this would call an API to reset the password
    console.log(`Resetting password for admin with ID: ${adminToResetPassword}`);
    setShowResetPasswordModal(false);
    setAdminToResetPassword(null);
    // You could show a success message here
  };
  
  return (
    <Layout>
    <ComponentGate componentId={ComponentId.CORPORATE_ADMIN_LIST}>
      <PageContainer>
        <PageHeader>
          <Title>Corporate Admin Management</Title>
        </PageHeader>
        
        <SearchBar>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search admin by name, email, corporate..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Corporate</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.map(admin => (
              <TableRow key={admin.id}>
                <TableCell>{admin.id}</TableCell>
                <TableCell>{admin.username}</TableCell>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.corporate}</TableCell>
                <TableCell>{admin.lastLogin}</TableCell>
                <TableCell>
                  <StatusBadge status={admin.status}>{admin.status}</StatusBadge>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <Button 
                      variant="tertiary" 
                      title="View"
                      onClick={() => handleViewAdmin(admin.id)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button 
                      variant="tertiary" 
                      title="Edit"
                      onClick={() => handleEditAdmin(admin.id)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="tertiary" 
                      title="Reset Password"
                      onClick={() => handleResetPasswordClick(admin.id)}
                    >
                      <Key size={16} />
                    </Button>
                    <Button 
                      variant="tertiary" 
                      title="Delete"
                      onClick={() => handleDeleteClick(admin.id)}
                    >
                      <Trash size={16} color="red" />
                    </Button>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {showDeleteModal && (
          <Modal>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Confirm Deletion</ModalTitle>
              </ModalHeader>
              <ModalBody>
                Are you sure you want to delete this admin? This action cannot be undone.
              </ModalBody>
              <ModalFooter>
                <Button variant="tertiary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={confirmDelete}>
                  Delete
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
        
        {showResetPasswordModal && (
          <Modal>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Reset Password</ModalTitle>
              </ModalHeader>
              <ModalBody>
                Are you sure you want to reset the password for this admin? They will receive an email with instructions to set a new password.
              </ModalBody>
              <ModalFooter>
                <Button variant="tertiary" onClick={() => setShowResetPasswordModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={confirmResetPassword}>
                  Reset Password
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </PageContainer>
    </ComponentGate>
    </Layout>
  );
}
