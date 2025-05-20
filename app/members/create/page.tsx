'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Button from '../../common/Button';
import { useAuthorization } from '../../lib/rbac/use-authorization';
import { UserType } from '../../lib/rbac/models';
import { Save, ArrowLeft, UserPlus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserTypeBasedRoute } from '../../lib/rbac/protected-route';

// Styled components
const Container = styled.div`
  padding: 1rem;
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
  justify-content: space-between;
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

const CardContainer = styled.div`
  display: flex;
  overflow: hidden;
  position: relative;
  width: 100%;
`;

const CardSlide = styled.div<{ active: boolean }>`
  flex: 0 0 100%;
  transition: transform 0.3s ease;
  display: ${props => props.active ? 'block' : 'none'};
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

// Default member object
const initialMemberState = {
  name: '',
  email: '',
  phone: '',
  membershipId: '',
  policyNumber: '',
  status: 'active' as 'active' | 'inactive',
  insuranceCardId: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  dateOfBirth: '',
  gender: 'male' as 'male' | 'female' | 'other',
  primaryCare: '',
  emergencyContact: '',
  emergencyPhone: ''
};

const MemberCreatePage: React.FC = () => {
  const router = useRouter();
  
  const [member, setMember] = useState(initialMemberState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setMember({
      ...member,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setMember({
      ...member,
      status: checked ? 'active' : 'inactive'
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!member.name || !member.email || !member.phone) {
      setError('Please fill in all required fields.');
      return;
    }
    
    // Simulate API call to create member
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    setTimeout(() => {
      try {
        // Generate a unique membership ID if not provided
        if (!member.membershipId) {
          member.membershipId = `MEM-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        }
        
        // In a real app, this would be an API call
        console.log('Created member:', member);
        
        setSuccess('Member created successfully!');
        setLoading(false);
        
        // Reset form after successful submission
        setMember(initialMemberState);
        
        // Navigate to the member list after 2 seconds
        setTimeout(() => {
          router.push('/members/list');
        }, 2000);
      } catch (err) {
        setError('An error occurred while creating the member. Please try again.');
        setLoading(false);
      }
    }, 1000);
  };

  const nextStep = () => {
    setCurrentStep(1);
  };

  const prevStep = () => {
    setCurrentStep(0);
  };
  
  return (
    <Container>
      <Header>
        <Title>Add New Member</Title>
        <ButtonWrapper>
          <Button variant="secondary" onClick={() => router.push('/members/list')}>
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            <UserPlus size={16} style={{ marginRight: '0.5rem' }} />
            Create Member
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
      
      <form onSubmit={handleSubmit}>
        <CardContainer>
          <CardSlide active={currentStep === 0}>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Enter the member's personal and contact information
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <FormGrid>
                  <FormGroup>
                    <Label htmlFor="name">Full Name *</Label>
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
                    <Label htmlFor="email">Email Address *</Label>
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
                    <Label htmlFor="phone">Phone Number *</Label>
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
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
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
                    <Label htmlFor="gender">Gender *</Label>
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
                    <Label htmlFor="address">Address *</Label>
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
                    <Label htmlFor="city">City *</Label>
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
                    <Label htmlFor="state">State *</Label>
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
                    <Label htmlFor="zipCode">ZIP Code *</Label>
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
              
              <CardFooter>
                <Button variant="secondary" type="button" onClick={() => router.push('/members/list')}>
                  Cancel
                </Button>
                <Button type="button" onClick={nextStep}>
                  Next <ChevronRight size={16} style={{ marginLeft: '0.5rem' }} />
                </Button>
              </CardFooter>
            </Card>
          </CardSlide>
          
          <CardSlide active={currentStep === 1}>
            <Card>
              <CardHeader>
                <CardTitle>Membership Information</CardTitle>
                <CardDescription>
                  Enter the member's insurance and membership details
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
                      placeholder="Will be auto-generated if left blank"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="policyNumber">Policy Number *</Label>
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
                    <Label htmlFor="insuranceCardId">Insurance Card ID *</Label>
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
                  
                  <FormGroup>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      type="text"
                      value={member.emergencyContact}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      name="emergencyPhone"
                      type="tel"
                      value={member.emergencyPhone}
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
                <Button variant="secondary" type="button" onClick={prevStep}>
                  <ChevronLeft size={16} style={{ marginRight: '0.5rem' }} /> Previous
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Member'}
                </Button>
              </CardFooter>
            </Card>
          </CardSlide>
        </CardContainer>
      </form>
    </Container>
  );
};

export default function MemberCreatePageWrapper() {
  return (
    <UserTypeBasedRoute 
      userTypes={[
        UserType.ADMIN,
        UserType.INSURANCE_ADMIN,
        UserType.CORPORATE_ADMIN,
        UserType.PROVIDER_ADMIN
      ]}
    >
      <MemberCreatePage />
    </UserTypeBasedRoute>
  );
} 