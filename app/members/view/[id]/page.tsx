'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import Layout from '../../../components/layout';
import { useAuthorization } from '../../../lib/rbac/use-authorization';
import Button from '../../../common/Button';
import { ArrowLeft, Edit, Trash, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';

// Mock data for a member
const getMemberById = (id: string) => {
  const members = [
    { 
      id: '1', 
      name: 'John Smith', 
      email: 'john.smith@example.com', 
      memberID: 'MEM001', 
      plan: 'Premium Health Plan', 
      corporate: 'ABC Corporation',
      status: 'Active',
      isDeleted: false,
      phone: '+1 (555) 123-4567',
      dateOfBirth: '1985-06-12',
      address: '123 Main Street, Suite 400, New York, NY 10001',
      joinDate: '2022-03-15',
      dependents: [
        { id: 'd1', name: 'Mary Smith', relationship: 'Spouse', age: 34 },
        { id: 'd2', name: 'James Smith', relationship: 'Child', age: 8 }
      ]
    },
    { 
      id: '2', 
      name: 'Sarah Johnson', 
      email: 'sarah.j@example.com', 
      memberID: 'MEM002', 
      plan: 'Standard Health Plan', 
      corporate: 'XYZ Industries',
      status: 'Active',
      isDeleted: false,
      phone: '+1 (555) 987-6543',
      dateOfBirth: '1990-11-24',
      address: '456 Park Avenue, Apartment 7B, Boston, MA 02108',
      joinDate: '2021-08-10',
      dependents: []
    }
  ];
  
  return members.find(member => member.id === id) || null;
};

const PageContainer = styled.div`
  padding: 24px;
`;

const BackLink = styled.a`
  display: flex;
  align-items: center;
  color: #64748b;
  text-decoration: none;
  margin-bottom: 24px;
  
  &:hover {
    color: #334155;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => props.status === 'Active' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.status === 'Active' ? '#14532d' : '#7f1d1d'};
  margin-left: 12px;
`;

const DeletedBadge = styled.span`
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  background-color: #fef3c7;
  color: #92400e;
  margin-left: 12px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 16px;
  color: #334155;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoRow = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 16px;
  color: #1e293b;
`;

const DependentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DependentCard = styled.div`
  padding: 16px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
`;

export default function MemberViewPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const member = getMemberById(id);
  const { isCorporateAdmin, isInsuranceAdmin } = useAuthorization();
  
  // Handle case where member is not found
  if (!member) {
    return (
      <Layout>
        <PageContainer>
          <Link href="/members/list" passHref legacyBehavior>
            <BackLink>
              <ArrowLeft size={16} />
              Back to Members
            </BackLink>
          </Link>
          
          <InfoCard>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: '16px' }} />
              <Title>Member Not Found</Title>
              <p>The member you're looking for doesn't exist or you don't have permission to view it.</p>
              <Link href="/members/list" passHref>
                <Button>Return to Members List</Button>
              </Link>
            </div>
          </InfoCard>
        </PageContainer>
      </Layout>
    );
  }
  
  const handleSoftDelete = () => {
    // In a real app, this would call an API to soft delete the member
    if (confirm('Are you sure you want to deactivate this member?')) {
      alert(`Member ${member.name} has been deactivated.`);
    }
  };
  
  const hasAccessToEdit = isCorporateAdmin() || isInsuranceAdmin();
  
  return (
    <Layout>
      <PageContainer>
        <Link href="/members/list" passHref legacyBehavior>
          <BackLink>
            <ArrowLeft size={16} />
            Back to Members
          </BackLink>
        </Link>
        
        <HeaderSection>
          <div>
            <Title>
              {member.name}
              <StatusBadge status={member.status}>{member.status}</StatusBadge>
              {member.isDeleted && <DeletedBadge>Deleted</DeletedBadge>}
            </Title>
            <div style={{ color: '#64748b', marginTop: '4px' }}>Member ID: {member.memberID}</div>
          </div>
          
          <Actions>
            {hasAccessToEdit && !member.isDeleted && (
              <>
                <Link href={`/members/edit/${member.id}`} passHref>
                  <Button>
                    <Edit size={16} />
                    Edit Member
                  </Button>
                </Link>
                
                <Button variant="danger" onClick={handleSoftDelete}>
                  <Trash size={16} />
                  Deactivate
                </Button>
              </>
            )}
            
            <Button variant="secondary">
              <FileText size={16} />
              View Claims
            </Button>
          </Actions>
        </HeaderSection>
        
        <InfoCard>
          <CardTitle>Personal Information</CardTitle>
          <InfoGrid>
            <InfoRow>
              <InfoLabel>Full Name</InfoLabel>
              <InfoValue>{member.name}</InfoValue>
            </InfoRow>
            
            <InfoRow>
              <InfoLabel>Email Address</InfoLabel>
              <InfoValue>{member.email}</InfoValue>
            </InfoRow>
            
            <InfoRow>
              <InfoLabel>Phone Number</InfoLabel>
              <InfoValue>{member.phone}</InfoValue>
            </InfoRow>
            
            <InfoRow>
              <InfoLabel>Date of Birth</InfoLabel>
              <InfoValue>{member.dateOfBirth}</InfoValue>
            </InfoRow>
            
            <InfoRow>
              <InfoLabel>Address</InfoLabel>
              <InfoValue>{member.address}</InfoValue>
            </InfoRow>
          </InfoGrid>
        </InfoCard>
        
        <InfoCard>
          <CardTitle>Plan Information</CardTitle>
          <InfoGrid>
            <InfoRow>
              <InfoLabel>Plan</InfoLabel>
              <InfoValue>{member.plan}</InfoValue>
            </InfoRow>
            
            <InfoRow>
              <InfoLabel>Corporate</InfoLabel>
              <InfoValue>{member.corporate}</InfoValue>
            </InfoRow>
            
            <InfoRow>
              <InfoLabel>Join Date</InfoLabel>
              <InfoValue>{member.joinDate}</InfoValue>
            </InfoRow>
            
            <InfoRow>
              <InfoLabel>Status</InfoLabel>
              <InfoValue style={{ color: member.status === 'Active' ? '#16a34a' : '#dc2626' }}>
                {member.status}
              </InfoValue>
            </InfoRow>
          </InfoGrid>
        </InfoCard>
        
        <InfoCard>
          <CardTitle>Dependents</CardTitle>
          {member.dependents.length > 0 ? (
            <DependentsList>
              {member.dependents.map(dependent => (
                <DependentCard key={dependent.id}>
                  <InfoGrid>
                    <InfoRow>
                      <InfoLabel>Name</InfoLabel>
                      <InfoValue>{dependent.name}</InfoValue>
                    </InfoRow>
                    
                    <InfoRow>
                      <InfoLabel>Relationship</InfoLabel>
                      <InfoValue>{dependent.relationship}</InfoValue>
                    </InfoRow>
                    
                    <InfoRow>
                      <InfoLabel>Age</InfoLabel>
                      <InfoValue>{dependent.age}</InfoValue>
                    </InfoRow>
                  </InfoGrid>
                </DependentCard>
              ))}
            </DependentsList>
          ) : (
            <p>No dependents found for this member.</p>
          )}
        </InfoCard>
      </PageContainer>
    </Layout>
  );
} 