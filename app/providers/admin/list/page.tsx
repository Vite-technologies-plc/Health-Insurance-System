'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../../../components/layout';
import { useAuthorization } from '../../../lib/rbac/use-authorization';
import { UserType } from '../../../lib/rbac/models';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '../../../common/Table';
import Button from '../../../common/Button';
import { Search, Plus, Edit, Trash, Eye, Key, UserX } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ComponentGate, ComponentId } from '../../../lib/rbac';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 16px;
  width: 300px;
  
  input {
    border: none;
    background: transparent;
    margin-left: 8px;
    flex-grow: 1;
    outline: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

interface Provider {
  id: string;
  name: string;
  facilityType?: string;
  location?: string;
  status?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

const ProvidersAdminListPage: React.FC = () => {
  const router = useRouter();
  const { hasUserType } = useAuthorization();
  const isInsuranceAdmin = hasUserType(UserType.INSURANCE_ADMIN);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [adminToResetPassword, setAdminToResetPassword] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchProviders = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:3000/providers", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }
      const data = await response.json();
      setProviders(data);
    } catch (err) {
      setError('Could not load providers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const filteredProviders = providers.filter((provider) =>
    (provider.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (provider.facilityType?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (provider.location?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );
  
  const handleViewAdmin = (adminId: string) => {
    router.push(`/providers/admin/${adminId}`);
  };
  
  const handleEditAdmin = (adminId: string) => {
    router.push(`/providers/admin/edit/${adminId}`);
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
      <ComponentGate componentId={ComponentId.PROVIDER_LIST}>
        <Container>
          <Header>
            <Title>All Providers</Title>
            <Button
              icon={<Plus size={16} />}
              style={{ background: 'green', color: 'white' }}
              onClick={() => router.push('/providers/create')}
            >
              Add New Provider
            </Button>
          </Header>
          
          <SearchBar>
            <input 
              type="text" 
              placeholder="Search providers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Facility Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5}>Loading...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} style={{ color: 'red' }}>{error}</TableCell>
                </TableRow>
              ) : filteredProviders.length === 0 ? (
                <></>
              ) : (
                filteredProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>{provider.name}</TableCell>
                    <TableCell>{provider.facilityType || '-'}</TableCell>
                    <TableCell>{provider.email || '-'}</TableCell>
                    <TableCell>{provider.phone || '-'}</TableCell>
                    <TableCell>
                      <ActionButtons>
                        <Button 
                          size="small"
                          variant="secondary"
                          icon={<Edit size={14} />}
                          onClick={() => router.push(`/providers/edit/${provider.id}`)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="small"
                          variant="danger"
                          icon={<Trash size={14} />}
                          onClick={() => alert('Delete functionality not implemented')}
                        >
                          Delete
                        </Button>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {showDeleteModal && (
            <Modal>
              <ModalContent>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this provider admin? This action cannot be undone.</p>
                <ModalActions>
                  <Button variant="tertiary" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={confirmDelete}>
                    Delete
                  </Button>
                </ModalActions>
              </ModalContent>
            </Modal>
          )}
          
          {showResetPasswordModal && (
            <Modal>
              <ModalContent>
                <h2>Reset Password</h2>
                <p>Are you sure you want to reset the password for this admin? They will receive an email with instructions.</p>
                <ModalActions>
                  <Button variant="tertiary" onClick={() => setShowResetPasswordModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={confirmResetPassword}>
                    Reset Password
                  </Button>
                </ModalActions>
              </ModalContent>
            </Modal>
          )}
        </Container>
      </ComponentGate>
    </Layout>
  );
};

export default ProvidersAdminListPage; 