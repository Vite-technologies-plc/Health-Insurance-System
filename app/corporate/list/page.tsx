'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from '../../components/layout';
import { useAuthorization } from '../../lib/rbac/use-authorization';
import { UserType } from '../../lib/rbac/models';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '../../common/Table';
import Button from '../../common/Button';
import { Search, Plus, Edit, Trash, Eye, Users, Building, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { ComponentGate, ComponentId } from '../../lib/rbac';

// Mock data for corporate clients
const mockCorporateClients = [
  { 
    id: '1', 
    name: 'Acme Corporation', 
    industry: 'Technology', 
    employees: 1200, 
    location: 'New York', 
    status: 'Active',
    enrollmentDate: '2023-01-15',
    plan: 'Premium Enterprise'
  },
  { 
    id: '2', 
    name: 'Global Industries', 
    industry: 'Manufacturing', 
    employees: 3500, 
    location: 'Chicago', 
    status: 'Active',
    enrollmentDate: '2022-06-22',
    plan: 'Standard Business'
  },
  { 
    id: '3', 
    name: 'Sunshine Healthcare', 
    industry: 'Healthcare', 
    employees: 850, 
    location: 'Los Angeles', 
    status: 'Inactive',
    enrollmentDate: '2023-03-10',
    plan: 'Premium Enterprise'
  },
  { 
    id: '4', 
    name: 'Smith & Partners', 
    industry: 'Legal', 
    employees: 150, 
    location: 'Boston', 
    status: 'Active',
    enrollmentDate: '2023-05-05',
    plan: 'Small Business'
  },
  { 
    id: '5', 
    name: 'EcoTech Solutions', 
    industry: 'Energy', 
    employees: 720, 
    location: 'Denver', 
    status: 'Active',
    enrollmentDate: '2022-11-18',
    plan: 'Standard Business'
  },
];

const PageContainer = styled.div`
  padding: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatsCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const CardIconWrapper = styled.div`
  background: #f1f5f9;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  
  svg {
    color: #3b82f6;
  }
`;

const CardTitle = styled.h3`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
`;

const CardValue = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: #1e293b;
`;

export default function CorporateListPage() {
  const { hasUserType } = useAuthorization();
  const isInsuranceAdmin = hasUserType(UserType.INSURANCE_ADMIN);
  const isCorporateAdmin = hasUserType(UserType.CORPORATE_ADMIN);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCorporateClients = mockCorporateClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate summary stats
  const totalClients = mockCorporateClients.length;
  const activeClients = mockCorporateClients.filter(c => c.status === 'Active').length;
  const totalEmployees = mockCorporateClients.reduce((sum, client) => sum + client.employees, 0);
  
  return (
    <ComponentGate componentId={ComponentId.CORPORATE_LIST}>
      <Layout>
        <PageContainer>
          <PageHeader>
            <Title>Corporate Clients</Title>
            <Link href="/corporate/create" passHref>
              <Button>
                <Plus size={16} />
                Add New Corporate Client
              </Button>
            </Link>
          </PageHeader>
          
          <CardGrid>
            <StatsCard>
              <CardIconWrapper>
                <Building size={24} />
              </CardIconWrapper>
              <CardTitle>Total Clients</CardTitle>
              <CardValue>{totalClients}</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIconWrapper>
                <Briefcase size={24} />
              </CardIconWrapper>
              <CardTitle>Active Clients</CardTitle>
              <CardValue>{activeClients}</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIconWrapper>
                <Users size={24} />
              </CardIconWrapper>
              <CardTitle>Total Covered Employees</CardTitle>
              <CardValue>{totalEmployees.toLocaleString()}</CardValue>
            </StatsCard>
          </CardGrid>
          
          <SearchBar>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search corporate clients..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCorporateClients.map(client => (
                <TableRow key={client.id}>
                  <TableCell>{client.id}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.industry}</TableCell>
                  <TableCell>{client.employees.toLocaleString()}</TableCell>
                  <TableCell>{client.location}</TableCell>
                  <TableCell>{client.plan}</TableCell>
                  <TableCell>
                    <span style={{ 
                      color: client.status === 'Active' ? 'green' : 'red',
                      fontWeight: 500 
                    }}>
                      {client.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ActionButtons>
                      <Button variant="tertiary" title="View">
                        <Eye size={16} />
                      </Button>
                      <Button variant="tertiary" title="Edit">
                        <Edit size={16} />
                      </Button>
                      <Button variant="danger" title="Delete">
                        <Trash size={16} />
                      </Button>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PageContainer>
      </Layout>
    </ComponentGate>
  );
} 