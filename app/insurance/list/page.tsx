'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../../common/Button';
import { ComponentGate, ComponentId } from '../../lib/rbac';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  Check,
  X,
  Layout,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import CompanyEdit from '../../components/CompanyEdit';

console.log('TOKEN AT PAGE LOAD:', localStorage.getItem('token'));

const PageContainer = styled.div`
  width: 100%;
`;

const ContentContainer = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  max-width: 400px;
`;

const SearchIcon = styled.div`
  position: relative;
  left: -32px;
  display: flex;
  align-items: center;
  color: #888;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  th {
    font-weight: 600;
    color: #555;
    font-size: 14px;
  }
`;

const SortableHeader = styled.th`
  cursor: pointer;
  
  &:hover {
    color: #00AA00;
  }
  
  span {
    display: inline-flex;
    align-items: center;
  }
  
  svg {
    width: 16px;
    height: 16px;
    margin-left: 4px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const Badge = styled.span<{ type: 'success' | 'warning' }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => props.type === 'success' ? 'rgba(0, 170, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
  color: ${props => props.type === 'success' ? '#00AA00' : '#FF0000'};
`;

// Add modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(220,220,220,0.7); /* lighter gray */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 0;
  width: 80vw;
  max-width: 1100px;
`;

const PrettyModalContent = styled(ModalContent)`
  max-width: 400px;
  padding: 32px 28px 28px 28px;
  text-align: center;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  background: #fff;
`;

const ModalIcon = styled.div`
  margin-bottom: 18px;
  svg {
    width: 48px;
    height: 48px;
    display: block;
    margin: 0 auto;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #232323;
`;

const ModalText = styled.p`
  font-size: 1.05rem;
  color: #444;
  margin-bottom: 28px;
`;

const ModalButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 10px;
`;

interface InsuranceCompany {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  license: string;
  description: string;
  // Add more fields as needed from your backend response
  isActive?: boolean;
}

const InsuranceCompaniesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCompany, setEditingCompany] = useState<any | null>(null);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [companyToToggle, setCompanyToToggle] = useState<InsuranceCompany | null>(null);
  const [toggleLoading, setToggleLoading] = useState(false);
  const router = useRouter();

  // Move fetchCompanies outside of useEffect so it can be reused
  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/insurance-companies', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      setError('Could not load insurance companies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this insurance company? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/insurance-companies/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          alert('Error: ' + (errorData.message || 'Failed to delete company.'));
          return;
        }
        // Re-fetch companies after successful delete
        fetchCompanies();
      } catch (err) {
        alert('Network or server error. Please try again.');
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/insurance-companies/${id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert('Error: ' + (errorData.message || 'Failed to toggle status.'));
        return;
      }
      // Re-fetch companies after successful toggle
      fetchCompanies();
    } catch (err) {
      alert('Network or server error. Please try again.');
    }
  };

  const handleToggleClick = (company: InsuranceCompany) => {
    setCompanyToToggle(company);
    setShowToggleModal(true);
  };

  const confirmToggleActive = async () => {
    if (!companyToToggle) return;
    setToggleLoading(true);
    await handleToggleActive(companyToToggle.id);
    setToggleLoading(false);
    setShowToggleModal(false);
    setCompanyToToggle(null);
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ComponentGate componentId={ComponentId.INSURANCE_LIST}>
      <PageContainer>
        <ContentContainer>
          <PageHeader>
            <PageTitle>Insurance Companies</PageTitle>
            
            <ComponentGate componentId={ComponentId.INSURANCE_CREATE}>
              <Button
                icon={<Plus size={16} />}
                style={{ background: 'green', color: 'white' }}
                onClick={() => router.push('/insurance/create')}
              >
                Add New Company
              </Button>
            </ComponentGate>
          </PageHeader>
          
          <TableContainer>
            <SearchContainer>
              <ComponentGate componentId={ComponentId.INSURANCE_LIST}>
                <SearchInput 
                  placeholder="Search companies..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon>
                  <Search size={18} />
                </SearchIcon>
              </ComponentGate>
            </SearchContainer>
            
            <Table>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Code</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6}>Loading...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} style={{ color: 'red' }}>{error}</td>
                  </tr>
                ) : filteredCompanies.map(company => (
                  <tr key={company.id}>
                    <td>{company.name}</td>
                    <td>{company.code}</td>
                    <td>{company.email}</td>
                    <td>{company.phone}</td>
                    <td>
                      <Badge type={company.isActive ? 'success' : 'warning'}>
                        {company.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        size="small"
                        variant={company.isActive ? 'danger' : 'success'}
                        style={{ marginLeft: 8 }}
                        onClick={() => handleToggleClick(company)}
                      >
                        {company.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                    <td>
                      <ActionButtons>
                        <ComponentGate componentId={ComponentId.INSURANCE_EDIT}>
                          <Button 
                            size="small" 
                            variant="secondary"
                            icon={<Edit size={14} />}
                            onClick={() => setEditingCompany(company)}
                          >
                            Edit
                          </Button>
                        </ComponentGate>
                        <ComponentGate componentId={ComponentId.INSURANCE_DELETE}>
                          <Button 
                            size="small" 
                            variant="danger"
                            icon={<Trash2 size={14} />}
                            onClick={() => handleDelete(company.id)}
                          >
                            Delete
                          </Button>
                        </ComponentGate>
                      </ActionButtons>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
          
          {editingCompany && (
            <ComponentGate componentId={ComponentId.INSURANCE_EDIT}>
              <ModalOverlay onClick={() => setEditingCompany(null)}>
                <ModalContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  <CompanyEdit
                    company={editingCompany}
                    onClose={() => setEditingCompany(null)}
                    onUpdated={() => {
                      setEditingCompany(null);
                      fetchCompanies();
                    }}
                  />
                </ModalContent>
              </ModalOverlay>
            </ComponentGate>
          )}
          {showToggleModal && companyToToggle && (
            <ModalOverlay>
              <PrettyModalContent>
                <ModalIcon>
                  {companyToToggle.isActive ? (
                    <XCircle color="#FF3333" fill="#FFEBEB" />
                  ) : (
                    <CheckCircle color="#00AA00" fill="#E6F9ED" />
                  )}
                </ModalIcon>
                <ModalTitle>
                  {companyToToggle.isActive ? 'Deactivate' : 'Activate'} Company
                </ModalTitle>
                <ModalText>
                  Are you sure you want to {companyToToggle.isActive ? 'deactivate' : 'activate'} <b>{companyToToggle.name}</b>?
                </ModalText>
                <ModalButtonRow>
                  <Button variant="tertiary" onClick={() => setShowToggleModal(false)} disabled={toggleLoading} style={{ minWidth: 110 }}>
                    Cancel
                  </Button>
                  <Button
                    variant={companyToToggle.isActive ? 'danger' : 'success'}
                    onClick={confirmToggleActive}
                    disabled={toggleLoading}
                    style={{ minWidth: 110 }}
                  >
                    {toggleLoading ? (companyToToggle.isActive ? 'Deactivating...' : 'Activating...') : (companyToToggle.isActive ? 'Deactivate' : 'Activate')}
                  </Button>
                </ModalButtonRow>
              </PrettyModalContent>
            </ModalOverlay>
          )}
        </ContentContainer>
      </PageContainer>
    </ComponentGate>
  );
};

export default InsuranceCompaniesPage; 