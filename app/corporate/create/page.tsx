'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Layout from '../../components/layout';
import Button from '../../common/Button';
import { useAuthorization } from '../../lib/rbac/use-authorization';
import { UserType } from '../../lib/rbac/models';
import { Save, ArrowLeft, Building, MapPin, Phone, Mail, Globe, FileText, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { ComponentGate, ComponentId } from '../../lib/rbac';

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

// Default corporate client object
const initialCorporateState = {
  name: '',
  industry: '',
  employees: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'USA',
  phone: '',
  email: '',
  website: '',
  primaryContact: '',
  contactTitle: '',
  contactPhone: '',
  contactEmail: '',
  taxId: '',
  registrationNumber: '',
  plan: 'standard',
  enrollmentDate: '',
  autoRenewal: true,
  status: 'active',
  specialRequirements: '',
  notes: ''
};

const CorporateCreatePage: React.FC = () => {
  const router = useRouter();
  const { hasUserType } = useAuthorization();
  const isAuthorized = hasUserType(UserType.ADMIN) || hasUserType(UserType.INSURANCE_ADMIN);
  
  const [corporate, setCorporate] = useState(initialCorporateState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  const formRef = useRef<HTMLFormElement>(null);
  
  const steps = [
    { title: "Company Information", description: "Enter the basic information about the corporate client" },
    { title: "Contact Information", description: "Enter the contact details for the corporate client" },
    { title: "Primary Contact Person", description: "Enter details of the main point of contact at the company" },
    { title: "Plan Information", description: "Enter details about the insurance plan and enrollment" },
    { title: "Additional Information", description: "Any special requirements or notes about this client" }
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setCorporate({
      ...corporate,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setCorporate({
      ...corporate,
      [name]: checked
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // In a real app, this would be an API call to create the corporate client
        console.log('Corporate client data to be submitted:', corporate);
        
        setSuccess('Corporate client created successfully!');
        setLoading(false);
        
        // Redirect to corporate list page after a delay
        setTimeout(() => {
          router.push('/corporate/list');
        }, 2000);
      } catch (err) {
        setError('An error occurred while creating the corporate client.');
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
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={corporate.name}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    id="industry"
                    name="industry"
                    value={corporate.industry}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Energy">Energy</option>
                    <option value="Legal">Legal</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Construction">Construction</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="employees">Number of Employees *</Label>
                  <Input
                    id="employees"
                    name="employees"
                    type="number"
                    min="1"
                    value={corporate.employees}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    id="status"
                    name="status"
                    value={corporate.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="taxId">Tax ID / EIN</Label>
                  <Input
                    id="taxId"
                    name="taxId"
                    type="text"
                    value={corporate.taxId}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    name="registrationNumber"
                    type="text"
                    value={corporate.registrationNumber}
                    onChange={handleInputChange}
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
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={corporate.address}
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
                    value={corporate.city}
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
                    value={corporate.state}
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
                    value={corporate.zipCode}
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
                    value={corporate.country}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={corporate.phone}
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
                    value={corporate.email}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={corporate.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </FormGroup>
              </FormGrid>
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
                  <Label htmlFor="primaryContact">Contact Name *</Label>
                  <Input
                    id="primaryContact"
                    name="primaryContact"
                    type="text"
                    value={corporate.primaryContact}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="contactTitle">Title / Position</Label>
                  <Input
                    id="contactTitle"
                    name="contactTitle"
                    type="text"
                    value={corporate.contactTitle}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="contactPhone">Contact Phone *</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    value={corporate.contactPhone}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={corporate.contactEmail}
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
                  <Label htmlFor="plan">Insurance Plan *</Label>
                  <Select
                    id="plan"
                    name="plan"
                    value={corporate.plan}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="basic">Basic Plan</option>
                    <option value="standard">Standard Business</option>
                    <option value="premium">Premium Enterprise</option>
                    <option value="custom">Custom Plan</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
                  <Input
                    id="enrollmentDate"
                    name="enrollmentDate"
                    type="date"
                    value={corporate.enrollmentDate}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormGrid>
              
              <Checkbox>
                <input
                  id="autoRenewal"
                  name="autoRenewal"
                  type="checkbox"
                  checked={corporate.autoRenewal}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="autoRenewal">Enable Auto-Renewal</label>
              </Checkbox>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>{steps[4].title}</CardTitle>
              <CardDescription>
                {steps[4].description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <FormGroup>
                <Label htmlFor="specialRequirements">Special Requirements</Label>
                <Textarea
                  id="specialRequirements"
                  name="specialRequirements"
                  value={corporate.specialRequirements}
                  onChange={handleInputChange}
                  placeholder="Enter any special requirements or customizations..."
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={corporate.notes}
                  onChange={handleInputChange}
                  placeholder="Enter any additional information or notes about this client..."
                />
              </FormGroup>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };
  
  return (
    <Layout>
      <ComponentGate componentId={ComponentId.CORPORATE_CREATE}>
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
            <Title>Add New Corporate Client</Title>
            <ButtonWrapper>
              <Button 
                variant="secondary" 
                onClick={() => router.push('/corporate/list')}
              >
                <ArrowLeft size={16} />
                Back to List
              </Button>
              <Button 
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save Client'}
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
                  {loading ? 'Creating...' : 'Create Corporate Client'}
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
    </Layout>
  );
};

export default function CorporateCreatePageWrapper() {
  return (
    <CorporateCreatePage />
  );
} 