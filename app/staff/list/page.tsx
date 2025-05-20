'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
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
import { Search, Plus, Edit, Trash, Eye, Users, Calendar, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { ComponentGate, ComponentId } from '../../lib/rbac';
import Layout from '@/app/components/layout';

// Mock data for staff members
const mockStaffMembers = [
  { 
    id: '1', 
    name: 'John Doe', 
    position: 'Medical Assistant',
    department: 'Primary Care',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    joinDate: '2022-05-15',
    status: 'Active'
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    position: 'Office Manager',
    department: 'Administration',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    joinDate: '2021-11-10',
    status: 'Active'
  },
  { 
    id: '3', 
    name: 'Robert Johnson', 
    position: 'Insurance Coordinator',
    department: 'Billing',
    email: 'robert.johnson@example.com',
    phone: '(555) 456-7890',
    joinDate: '2023-02-22',
    status: 'Active'
  },
  { 
    id: '4', 
    name: 'Emily Wilson', 
    position: 'Receptionist',
    department: 'Front Desk',
    email: 'emily.wilson@example.com',
    phone: '(555) 234-5678',
    joinDate: '2022-09-01',
    status: 'On Leave'
  },
  { 
    id: '5', 
    name: 'Michael Brown', 
    position: 'IT Support',
    department: 'Technical',
    email: 'michael.brown@example.com',
    phone: '(555) 876-5432',
    joinDate: '2023-01-15',
    status: 'Active'
  },
];

const PageContainer = styled.div`
  padding: 18px;
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

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ status }) => 
    status === 'Active' ? '#dcfce7' : 
    status === 'On Leave' ? '#fef9c3' : '#fee2e2'};
  color: ${({ status }) => 
    status === 'Active' ? '#166534' : 
    status === 'On Leave' ? '#854d0e' : '#b91c1c'};
`;

export default function StaffListPage() {
  const { hasUserType } = useAuthorization();
  const isAdmin = hasUserType(UserType.ADMIN);
  const isInsuranceAdmin = hasUserType(UserType.INSURANCE_ADMIN);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredStaffMembers = mockStaffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate summary stats
  const totalStaff = mockStaffMembers.length;
  const activeStaff = mockStaffMembers.filter(s => s.status === 'Active').length;
  const departments = [...new Set(mockStaffMembers.map(s => s.department))].length;
  
  return (
    <Layout>
    <ComponentGate componentId={ComponentId.STAFF_LIST}>
      <PageContainer>
        <PageHeader>
          <Title>Staff Management</Title>
          <Link href="/staff/create" passHref>
            <Button>
              <Plus size={16} />
              Add New Staff Member
            </Button>
          </Link>
        </PageHeader>
        
        <CardGrid>
          <StatsCard>
            <CardIconWrapper>
              <Users size={24} />
            </CardIconWrapper>
            <CardTitle>Total Staff</CardTitle>
            <CardValue>{totalStaff}</CardValue>
          </StatsCard>
          
          <StatsCard>
            <CardIconWrapper>
              <Users size={24} />
            </CardIconWrapper>
            <CardTitle>Active Staff</CardTitle>
            <CardValue>{activeStaff}</CardValue>
          </StatsCard>
          
          <StatsCard>
            <CardIconWrapper>
              <Calendar size={24} />
            </CardIconWrapper>
            <CardTitle>Departments</CardTitle>
            <CardValue>{departments}</CardValue>
          </StatsCard>
        </CardGrid>
        
        <SearchBar>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search staff members..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaffMembers.map(staff => (
              <TableRow key={staff.id}>
                <TableCell>{staff.id}</TableCell>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.position}</TableCell>
                <TableCell>{staff.department}</TableCell>
                <TableCell>
                  <a href={`mailto:${staff.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                    {staff.email}
                  </a>
                </TableCell>
                <TableCell>{staff.phone}</TableCell>
                <TableCell>{new Date(staff.joinDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <StatusBadge status={staff.status}>
                    {staff.status}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <Button variant="tertiary" title="View Staff Details">
                      <Eye size={16} />
                    </Button>
                    <Button variant="tertiary" title="Edit Staff">
                      <Edit size={16} />
                    </Button>
                    <Button variant="danger" title="Delete Staff">
                      <Trash size={16} />
                    </Button>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageContainer>
    </ComponentGate>
    </Layout>
  );
} 