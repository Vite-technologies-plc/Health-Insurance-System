'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import Layout from '../../../components/layout';
import { useAuthorization } from '../../../lib/rbac/use-authorization';
import Button from '../../../common/Button';
import { ArrowLeft, Save, X, AlertTriangle, Plus, Trash } from 'lucide-react';
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

// Mock plans data
const availablePlans = [
  'Premium Health Plan',
  'Standard Health Plan',
  'Family Health Plan',
  'Senior Health Plan',
  'Basic Health Plan'
];

// Mock corporate data
const availableCorporates = [
  'ABC Corporation',
  'XYZ Industries',
  'Global Tech',
  'Individual'
];

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

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const FormCard = styled.div`
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormRow = styled.div`
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 4px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 16px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 16px;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
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
  position: relative;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Dependent {
  id: string;
  name: string;
  relationship: string;
  age: number;
}

export default function MemberEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const originalMember = getMemberById(id);
  const { isCorporateAdmin, isInsuranceAdmin } = useAuthorization();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    plan: '',
    corporate: '',
    status: '',
    dependents: [] as Dependent[]
  });
  
  const [nextDependentId, setNextDependentId] = useState(100); // For new dependents
  
  // Load member data into form
  useEffect(() => {
    if (originalMember) {
      setFormData({
        name: originalMember.name,
        email: originalMember.email,
        phone: originalMember.phone,
        dateOfBirth: originalMember.dateOfBirth,
        address: originalMember.address,
        plan: originalMember.plan,
        corporate: originalMember.corporate,
        status: originalMember.status,
        dependents: [...originalMember.dependents]
      });
    }
  }, [originalMember]);
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle dependent changes
  const handleDependentChange = (id: string, field: keyof Dependent, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      dependents: prev.dependents.map(dep => 
        dep.id === id ? { ...dep, [field]: value } : dep
      )
    }));
  };
  
  // Add new dependent
  const addDependent = () => {
    const newDependent: Dependent = {
      id: `new_${nextDependentId}`,
      name: '',
      relationship: '',
      age: 0
    };
    
    setFormData(prev => ({
      ...prev,
      dependents: [...prev.dependents, newDependent]
    }));
    
    setNextDependentId(prev => prev + 1);
  };
  
  // Remove dependent
  const removeDependent = (id: string) => {
    setFormData(prev => ({
      ...prev,
      dependents: prev.dependents.filter(dep => dep.id !== id)
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving member data:', formData);
    
    // In a real app, this would make an API call to update the member
    alert('Member information saved successfully!');
    router.push(`/members/view/${id}`);
  };
  
  // Handle case where member is not found
  if (!originalMember) {
    return (
      <Layout>
        <PageContainer>
          <Link href="/members/list" passHref legacyBehavior>
            <BackLink>
              <ArrowLeft size={16} />
              Back to Members
            </BackLink>
          </Link>
          
          <FormCard>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: '16px' }} />
              <Title>Member Not Found</Title>
              <p>The member you're trying to edit doesn't exist or you don't have permission to edit it.</p>
              <Link href="/members/list" passHref>
                <Button>Return to Members List</Button>
              </Link>
            </div>
          </FormCard>
        </PageContainer>
      </Layout>
    );
  }
  
  // Only corporate admins and insurance admins can edit members
  const hasAccessToEdit = isCorporateAdmin() || isInsuranceAdmin();
  
  if (!hasAccessToEdit) {
    return (
      <Layout>
        <PageContainer>
          <Link href="/members/list" passHref legacyBehavior>
            <BackLink>
              <ArrowLeft size={16} />
              Back to Members
            </BackLink>
          </Link>
          
          <FormCard>
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: '16px' }} />
              <Title>Access Denied</Title>
              <p>You don't have permission to edit member information.</p>
              <Link href={`/members/view/${id}`} passHref>
                <Button>View Member Details</Button>
              </Link>
            </div>
          </FormCard>
        </PageContainer>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <PageContainer>
        <Link href={`/members/view/${id}`} passHref legacyBehavior>
          <BackLink>
            <ArrowLeft size={16} />
            Back to Member Details
          </BackLink>
        </Link>
        
        <HeaderSection>
          <Title>Edit Member: {originalMember.name}</Title>
          <Actions>
            <Button variant="primary" onClick={handleSubmit}>
              <Save size={16} />
              Save Changes
            </Button>
            
            <Link href={`/members/view/${id}`} passHref>
              <Button variant="secondary">
                <X size={16} />
                Cancel
              </Button>
            </Link>
          </Actions>
        </HeaderSection>
        
        <form onSubmit={handleSubmit}>
          <FormCard>
            <CardTitle>Personal Information</CardTitle>
            <FormGrid>
              <FormRow>
                <FormLabel htmlFor="name">Full Name</FormLabel>
                <FormInput 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormRow>
              
              <FormRow>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <FormInput 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormRow>
              
              <FormRow>
                <FormLabel htmlFor="phone">Phone Number</FormLabel>
                <FormInput 
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </FormRow>
              
              <FormRow>
                <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
                <FormInput 
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </FormRow>
              
              <FormRow style={{ gridColumn: '1 / span 2' }}>
                <FormLabel htmlFor="address">Address</FormLabel>
                <FormTextarea 
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </FormRow>
            </FormGrid>
          </FormCard>
          
          <FormCard>
            <CardTitle>Plan Information</CardTitle>
            <FormGrid>
              <FormRow>
                <FormLabel htmlFor="plan">Health Plan</FormLabel>
                <FormSelect 
                  id="plan"
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a plan</option>
                  {availablePlans.map(plan => (
                    <option key={plan} value={plan}>{plan}</option>
                  ))}
                </FormSelect>
              </FormRow>
              
              <FormRow>
                <FormLabel htmlFor="corporate">Corporate</FormLabel>
                <FormSelect 
                  id="corporate"
                  name="corporate"
                  value={formData.corporate}
                  onChange={handleChange}
                  required
                  disabled={isCorporateAdmin()} // Corporate admins can't change this
                >
                  <option value="">Select a corporate</option>
                  {availableCorporates.map(corp => (
                    <option key={corp} value={corp}>{corp}</option>
                  ))}
                </FormSelect>
              </FormRow>
              
              <FormRow>
                <FormLabel htmlFor="status">Status</FormLabel>
                <FormSelect 
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </FormSelect>
              </FormRow>
            </FormGrid>
          </FormCard>
          
          <FormCard>
            <CardTitle>Dependents</CardTitle>
            <DependentsList>
              {formData.dependents.map(dependent => (
                <DependentCard key={dependent.id}>
                  <RemoveButton 
                    type="button" 
                    onClick={() => removeDependent(dependent.id)}
                    title="Remove Dependent"
                  >
                    <Trash size={16} />
                  </RemoveButton>
                  
                  <FormGrid>
                    <FormRow>
                      <FormLabel htmlFor={`dep-name-${dependent.id}`}>Name</FormLabel>
                      <FormInput 
                        id={`dep-name-${dependent.id}`}
                        value={dependent.name}
                        onChange={(e) => handleDependentChange(dependent.id, 'name', e.target.value)}
                        required
                      />
                    </FormRow>
                    
                    <FormRow>
                      <FormLabel htmlFor={`dep-rel-${dependent.id}`}>Relationship</FormLabel>
                      <FormSelect 
                        id={`dep-rel-${dependent.id}`}
                        value={dependent.relationship}
                        onChange={(e) => handleDependentChange(dependent.id, 'relationship', e.target.value)}
                        required
                      >
                        <option value="">Select relationship</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Child</option>
                        <option value="Parent">Parent</option>
                        <option value="Other">Other</option>
                      </FormSelect>
                    </FormRow>
                    
                    <FormRow>
                      <FormLabel htmlFor={`dep-age-${dependent.id}`}>Age</FormLabel>
                      <FormInput 
                        id={`dep-age-${dependent.id}`}
                        type="number"
                        min="0"
                        max="120"
                        value={dependent.age}
                        onChange={(e) => handleDependentChange(dependent.id, 'age', parseInt(e.target.value, 10) || 0)}
                        required
                      />
                    </FormRow>
                  </FormGrid>
                </DependentCard>
              ))}
              
              <Button 
                type="button" 
                variant="secondary" 
                onClick={addDependent}
                style={{ marginTop: '12px' }}
              >
                <Plus size={16} />
                Add Dependent
              </Button>
            </DependentsList>
          </FormCard>
        </form>
      </PageContainer>
    </Layout>
  );
} 