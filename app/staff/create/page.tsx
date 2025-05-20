'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Button from '../../common/Button';
import { useAuthorization } from '../../lib/rbac/use-authorization';
import { UserType } from '../../lib/rbac/models';
import { 
  Save, 
  ArrowLeft, 
  User, 
  Building, 
  Phone, 
  Mail, 
  Calendar, 
  Briefcase, 
  UserCheck, 
  Shield,
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { ComponentGate, ComponentId } from '../../lib/rbac';
import Layout from '@/app/components/layout';

// Styled components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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

const ButtonWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
`;

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: #334155;
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
  color: #475569;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
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
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;
  
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
  margin-top: 0.5rem;
  
  input {
    width: 1rem;
    height: 1rem;
    accent-color: #3b82f6;
  }
  
  label {
    font-size: 0.875rem;
    margin-bottom: 0;
    color: #475569;
  }
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

const CardNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const CardContainer = styled.div`
  min-height: 400px; /* Ensure consistent height between cards */
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
`;

const StepDot = styled.div<{ active: boolean }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  transition: background-color 0.2s ease;
`;

// Default staff member object
const initialStaffState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  department: '',
  employeeId: '',
  joinDate: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'USA',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  username: '',
  password: '',
  confirmPassword: '',
  accessLevel: 'standard',
  status: 'active',
  notes: '',
  receiveNotifications: true
};

const StaffCreatePage: React.FC = () => {
  const router = useRouter();
  const { hasUserType } = useAuthorization();
  const isAuthorized = hasUserType(UserType.ADMIN) || hasUserType(UserType.INSURANCE_ADMIN);
  
  const [staff, setStaff] = useState(initialStaffState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  const formRef = useRef<HTMLFormElement>(null);
  
  const steps = [
    { title: "Personal Information", description: "Enter the staff member's personal information" },
    { title: "Employment Details", description: "Enter employment details and department information" },
    { title: "Contact Information", description: "Enter contact details and emergency contact" },
    { title: "System Access", description: "Set up system access credentials and permissions" }
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setStaff({
      ...staff,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setStaff({
      ...staff,
      [name]: checked
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate passwords match
    if (staff.password !== staff.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      try {
        // In a real app, this would be an API call to create the staff member
        console.log('Staff member data to be submitted:', staff);
        
        setSuccess('Staff member created successfully!');
        setLoading(false);
        
        // Redirect to staff list page after a delay
        setTimeout(() => {
          router.push('/staff/list');
        }, 2000);
      } catch (err) {
        setError('An error occurred while creating the staff member.');
        setLoading(false);
      }
    }, 1500);
  };
  
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{steps[0].title}</CardTitle>
              <CardDescription>
                {steps[0].description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={staff.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={staff.lastName}
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
                    value={staff.email}
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
                    value={staff.phone}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormGrid>
            </CardContent>
          </Card>
        );
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{steps[1].title}</CardTitle>
              <CardDescription>
                {steps[1].description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="position">Position/Title *</Label>
                  <Input
                    id="position"
                    name="position"
                    type="text"
                    value={staff.position}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    id="department"
                    name="department"
                    value={staff.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Administration">Administration</option>
                    <option value="Primary Care">Primary Care</option>
                    <option value="Billing">Billing</option>
                    <option value="Front Desk">Front Desk</option>
                    <option value="Technical">Technical</option>
                    <option value="Medical Records">Medical Records</option>
                    <option value="Nursing">Nursing</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Human Resources">Human Resources</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    name="employeeId"
                    type="text"
                    value={staff.employeeId}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="joinDate">Join Date *</Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={staff.joinDate}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    id="status"
                    name="status"
                    value={staff.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </FormGroup>
              </FormGrid>
              
              <FormGroup>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={staff.notes}
                  onChange={handleInputChange}
                  placeholder="Any additional notes about this staff member..."
                />
              </FormGroup>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{steps[2].title}</CardTitle>
              <CardDescription>
                {steps[2].description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={staff.address}
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
                    value={staff.city}
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
                    value={staff.state}
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
                    value={staff.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    value={staff.country}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormGrid>
              
              <h3 className="text-lg font-medium mb-3 mt-6">Emergency Contact</h3>
              
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContactName"
                    name="emergencyContactName"
                    type="text"
                    value={staff.emergencyContactName}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyContactPhone"
                    name="emergencyContactPhone"
                    type="tel"
                    value={staff.emergencyContactPhone}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
                  <Input
                    id="emergencyContactRelationship"
                    name="emergencyContactRelationship"
                    type="text"
                    value={staff.emergencyContactRelationship}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormGrid>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{steps[3].title}</CardTitle>
              <CardDescription>
                {steps[3].description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={staff.username}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={staff.password}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={staff.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="accessLevel">Access Level *</Label>
                  <Select
                    id="accessLevel"
                    name="accessLevel"
                    value={staff.accessLevel}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="readonly">Read Only</option>
                    <option value="standard">Standard</option>
                    <option value="advanced">Advanced</option>
                    <option value="admin">Admin</option>
                  </Select>
                </FormGroup>
              </FormGrid>
              
              <Checkbox>
                <input
                  id="receiveNotifications"
                  name="receiveNotifications"
                  type="checkbox"
                  checked={staff.receiveNotifications}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="receiveNotifications">Receive system notifications and emails</label>
              </Checkbox>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };
  
  return (
    <ComponentGate componentId={ComponentId.STAFF_CREATE}>
      <Container>
        {error && (
          <ErrorMessage>
            <span>{error}</span>
          </ErrorMessage>
        )}
        
        {success && (
          <SuccessMessage>
            <span>{success}</span>
          </SuccessMessage>
        )}
        
        <Header>
          <Title>Add New Staff Member</Title>
          <ButtonWrapper>
            <Button 
              variant="secondary" 
              onClick={() => router.push('/staff/list')}
            >
              <ArrowLeft size={16} />
              Back to Staff List
            </Button>
            <Button 
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Save size={16} />
              {loading ? 'Saving...' : 'Save Staff'}
            </Button>
          </ButtonWrapper>
        </Header>
        
        <form ref={formRef} onSubmit={handleSubmit}>
          <StepIndicator>
            {steps.map((_, index) => (
              <StepDot key={index} active={currentStep === index} />
            ))}
          </StepIndicator>
          
          <CardContainer>
            {renderStepContent()}
          </CardContainer>
          
          <CardNavigation>
            <Button 
              variant="secondary" 
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Staff Member'}
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={nextStep}
              >
                Next
                <ChevronRight size={16} />
              </Button>
            )}
          </CardNavigation>
        </form>
      </Container>
    </ComponentGate>
  );
};

export default function StaffCreatePageWrapper() {
  return (
    <Layout>
    <StaffCreatePage />
    </Layout>
  );
} 