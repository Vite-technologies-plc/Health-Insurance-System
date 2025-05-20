'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import Button from '../../common/Button';
import { useAuthorization } from '../../lib/rbac/use-authorization';
import { UserType } from '../../lib/rbac/models';
import { Save, ArrowLeft, User, Mail, Phone, FileText, X } from 'lucide-react';
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

const ButtonWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  
  input {
    width: 1rem;
    height: 1rem;
  }
  
  label {
    font-size: 0.875rem;
    margin-bottom: 0;
  }
`;

const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessMessage = styled.div`
  background-color: #dcfce7;
  color: #166534;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Mock member data
interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipId: string;
  policyNumber: string;
  status: 'active' | 'inactive';
  insuranceCardId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  primaryCare: string;
  emergencyContact: string;
  emergencyPhone: string;
}

const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    membershipId: 'MEM-001',
    policyNumber: 'POL-12345',
    status: 'active',
    insuranceCardId: 'INS-001-123',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '90210',
    dateOfBirth: '1980-05-15',
    gender: 'male',
    primaryCare: 'Dr. Sarah Johnson',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '(555) 987-6543'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    membershipId: 'MEM-002',
    policyNumber: 'POL-67890',
    status: 'active',
    insuranceCardId: 'INS-002-456',
    address: '456 Oak Ave',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    dateOfBirth: '1985-10-20',
    gender: 'female',
    primaryCare: 'Dr. Michael Brown',
    emergencyContact: 'John Smith',
    emergencyPhone: '(555) 123-4567'
  }
];

const MemberEditPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberId = searchParams.get('id');
  
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formChanged, setFormChanged] = useState<boolean>(false);
  
  useEffect(() => {
    // Simulate API call to fetch member data
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      const foundMember = MOCK_MEMBERS.find(m => m.id === memberId);
      
      if (foundMember) {
        setMember(foundMember);
      } else {
        setError('Member not found. Please try again or contact support.');
      }
      
      setLoading(false);
    }, 1000);
  }, [memberId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (member) {
      setMember({
        ...member,
        [name]: value
      });
      setFormChanged(true);
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (member) {
      setMember({
        ...member,
        status: checked ? 'active' : 'inactive'
      });
      setFormChanged(true);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call to update member
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    setTimeout(() => {
      // In a real app, this would be an API call
      console.log('Updated member:', member);
      
      setSuccess('Member updated successfully!');
      setLoading(false);
      setFormChanged(false);
      
      // After 2 seconds, clear the success message
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    }, 1000);
  };
  
  if (loading && !member) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading member information...
        </div>
      </Container>
    );
  }
  
  if (error && !member) {
    return (
      <Container>
        <ErrorMessage>
          <X size={16} />
          {error}
        </ErrorMessage>
        <Button variant="secondary" onClick={() => router.push('/members/list')}>
          <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
          Return to Members List
        </Button>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <Title>Edit Member</Title>
        <ButtonWrapper>
          <Button variant="secondary" onClick={() => router.push('/members/list')}>
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !formChanged}>
            <Save size={16} style={{ marginRight: '0.5rem' }} />
            Save Changes
          </Button>
        </ButtonWrapper>
      </Header>
      
      {error && (
        <ErrorMessage>
          <X size={16} />
          {error}
        </ErrorMessage>
      )}
      
      {success && (
        <SuccessMessage>
          <Save size={16} />
          {success}
        </SuccessMessage>
      )}
      
      {member && (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Edit the member's personal and contact information
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={member.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={member.email}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={member.phone}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={member.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    id="gender"
                    name="gender"
                    value={member.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </FormGroup>
                
                <div></div>
                
                <FormGroup>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={member.address}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    value={member.city}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    value={member.state}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={member.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormGrid>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Membership Information</CardTitle>
              <CardDescription>
                Edit the member's insurance and membership details
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="membershipId">Membership ID</Label>
                  <Input
                    id="membershipId"
                    name="membershipId"
                    type="text"
                    value={member.membershipId}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Input
                    id="policyNumber"
                    name="policyNumber"
                    type="text"
                    value={member.policyNumber}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="insuranceCardId">Insurance Card ID</Label>
                  <Input
                    id="insuranceCardId"
                    name="insuranceCardId"
                    type="text"
                    value={member.insuranceCardId}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="primaryCare">Primary Care Provider</Label>
                  <Input
                    id="primaryCare"
                    name="primaryCare"
                    type="text"
                    value={member.primaryCare}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <div className="col-span-2">
                  <Checkbox>
                    <input
                      id="status"
                      name="status"
                      type="checkbox"
                      checked={member.status === 'active'}
                      onChange={handleCheckboxChange}
                    />
                    <Label htmlFor="status">Member is active</Label>
                  </Checkbox>
                </div>
              </FormGrid>
            </CardContent>
            
            <CardFooter>
              <Button variant="secondary" type="button" onClick={() => router.push('/members/list')}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !formChanged}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </Container>
  );
};

export default function MemberEditPageWrapper() {
  return (
    <UserTypeBasedRoute 
      userTypes={[
        UserType.ADMIN,
        UserType.INSURANCE_ADMIN,
        UserType.CORPORATE_ADMIN,
        UserType.PROVIDER_ADMIN
      ]}
    >
      <MemberEditPage />
    </UserTypeBasedRoute>
  );
} 