"use client";
import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { useRouter } from 'next/navigation';

// --- FORM STYLES ---
const FormContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 40px 0;
  max-width: 900px;
  margin: 40px auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  min-height: 500px;
`;

const FormInner = styled.form`
  width: 80%;
  margin: 0 auto;
`;

const RequiredNote = styled.p`
  color: #e57373;
  font-size: 13px;
  margin-bottom: 30px;
`;

const Red = styled.span`
  color: #e74c3c;
`;

const Row = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 25px;
`;

const Group = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 7px;
  color: #222;
`;

const Input = styled.input`
  padding: 12px 14px;
  border: 1px solid #ececec;
  border-radius: 5px;
  background: #f7f8fa;
  font-size: 15px;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border: 1.5px solid #bdbdbd;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.button`
  background: #232323;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px 60px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #444;
  }
`;
// --- END FORM STYLES ---

type AdminDetailFormProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const AdminDetailForm: React.FC<AdminDetailFormProps> = ({ step, setStep }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    companyCode: '',
    licenseNumber: '',
    companyWebsite: '',
    companyEmail: '',
    contactNumber: '',
    companyAddress: '',
    description: '',
    // Step 3 fields
    adminFirstName: '',
    adminLastName: '',
    adminUserName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
    adminConfirmPassword: '',
    adminPhoto: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, adminPhoto: e.target.files[0] });
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Map formData to backend expected structure
    const companyData = {
      name: formData.companyName,
      code: formData.companyCode,
      license: formData.licenseNumber,
      website: formData.companyWebsite,
      email: formData.companyEmail,
      phone: formData.contactNumber,
      address: formData.companyAddress,
      description: formData.description,
      settings: {
        claimProcessingRules: {
          standardProcessingTime: "5 days",
          urgentProcessingTime: "2 days"
        },
        premiumCalculationRules: {
          basePremium: 100,
          ageAdjustment: {
            "18-30": 0,
            "31-45": 20,
            "46-60": 50,
            "60+": 100
          }
        }
      },
      adminCredentials: {
        username: formData.adminUserName,
        email: formData.adminEmail,
        password: formData.adminPassword,
        firstName: formData.adminFirstName,
        lastName: formData.adminLastName,
        phoneNumber: formData.adminPhone
      }
    };

    try {
      const response = await fetch('http://localhost:3000/insurance-companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(companyData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert('Error: ' + (errorData.message || 'Failed to register company.'));
        return;
      }

      // const data = await response.json();
      // alert('Company registered successfully!\n' + JSON.stringify(data, null, 2));
      router.push('/components/specific/system-admin-components/dashboard?success=Company registered successfully');
    } catch (err) {
      alert('Network or server error. Please try again.');
    }
  };

  return (
    <FormInner onSubmit={step === 3 ? handleSubmit : handleNext}>
      {step === 1 && (
        <RequiredNote>
          <Red>*</Red> All fields are required
        </RequiredNote>
      )}
      {step === 1 && (
        <>
          <Row>
            <Group>
              <Label>
                Company Name <Red>*</Red>
              </Label>
              <Input
                type="text"
                name="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </Group>
            <Group>
              <Label>
                Company Code <Red>*</Red>
              </Label>
              <Input
                type="text"
                name="companyCode"
                placeholder="Enter company code"
                value={formData.companyCode}
                onChange={handleChange}
                required
              />
            </Group>
          </Row>
          <Row>
            <Group>
              <Label>
                License Number <Red>*</Red>
              </Label>
              <Input
                type="text"
                name="licenseNumber"
                placeholder="Enter company license number"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
              />
            </Group>
            <Group>
              <Label>
                Company Website
              </Label>
              <Input
                type="text"
                name="companyWebsite"
                placeholder="Enter company website address"
                value={formData.companyWebsite}
                onChange={handleChange}
              />
            </Group>
          </Row>
          <Actions>
            <Button type="submit">Next</Button>
          </Actions>
        </>
      )}
      {step === 2 && (
        <>
          <Row>
            <Group>
              <Label>
                Company Email <Red>*</Red>
              </Label>
              <Input
                type="email"
                name="companyEmail"
                placeholder="Enter company address"
                value={formData.companyEmail}
                onChange={handleChange}
                required
              />
            </Group>
            <Group>
              <Label>
                Contact number <Red>*</Red>
              </Label>
              <Input
                type="text"
                name="contactNumber"
                placeholder="Enter contact number of the company"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </Group>
          </Row>
          <Row>
            <Group>
              <Label>
                Company Address <Red>*</Red>
              </Label>
              <Input
                type="text"
                name="companyAddress"
                placeholder="Enter company Address"
                value={formData.companyAddress}
                onChange={handleChange}
                required
              />
            </Group>
            <Group>
              <Label>
                Description
              </Label>
              <Input
                type="text"
                name="description"
                placeholder="write description of the company"
                value={formData.description}
                onChange={handleChange}
              />
            </Group>
          </Row>
          <Actions>
            <Button type="button" onClick={handleBack} style={{marginRight: 16}}>Back</Button>
            <Button type="submit">Next</Button>
          </Actions>
        </>
      )}

      {step === 3 && (
        <>
          <div style={{ textAlign: 'center', marginBottom: 2, marginTop: 16 ,color: '#232323'}}>
            <label htmlFor="adminPhoto" style={{ cursor: 'pointer', display: 'inline-block' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: '#f7f8fa', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 8px auto', fontSize: 32, color: '#3498db', border: '1.5px solid rgb(228, 31, 31)'
              }}>
                <span role="img" aria-label="camera">📷</span>
              </div>
              <div style={{ color: '#3498db', fontSize: 14 }}>Upload Photo</div>
              <input
                id="adminPhoto"
                name="adminPhoto"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
            </label>
          </div>
          <Row>
            <Group>
              <Label>First Name <Red>*</Red></Label>
              <Input
                type="text"
                name="adminFirstName"
                placeholder="Enter admin first name"
                value={formData.adminFirstName}
                onChange={handleChange}
                required
              />
            </Group>
            <Group>
              <Label>Last Name <Red>*</Red></Label>
              <Input
                type="text"
                name="adminLastName"
                placeholder="Enter admin last name"
                value={formData.adminLastName}
                onChange={handleChange}
                required
              />
            </Group>
          </Row>
          <Row>
            <Group>
              <Label>User Name <Red>*</Red></Label>
              <Input
                type="text"
                name="adminUserName"
                placeholder="Enter admin user name"
                value={formData.adminUserName}
                onChange={handleChange}
                required
              />
            </Group>
            <Group>
              <Label>Email <Red>*</Red></Label>
              <Input
                type="email"
                name="adminEmail"
                placeholder="Enter admin email"
                value={formData.adminEmail}
                onChange={handleChange}
                required
              />
            </Group>
          </Row>
          <Row>
            <Group>
              <Label>Phone Number <Red>*</Red></Label>
              <Input
                type="text"
                name="adminPhone"
                placeholder="Enter admin phone number"
                value={formData.adminPhone}
                onChange={handleChange}
                required
              />
            </Group>
            <Group>
              <Label>Password <Red>*</Red></Label>
              <Input
                type="password"
                name="adminPassword"
                placeholder="Create password"
                value={formData.adminPassword}
                onChange={handleChange}
                required
              />
            </Group>
          </Row>
          <Row>
            <Group>
              <Label>Confirm Password <Red>*</Red></Label>
              <Input
                type="password"
                name="adminConfirmPassword"
                placeholder="Write password again"
                value={formData.adminConfirmPassword}
                onChange={handleChange}
                required
              />
            </Group>
            <Group />
          </Row>
          <Actions>
            <Button type="button" onClick={handleBack} style={{marginRight: 16, background: '#232323'}}>Back</Button>
            <Button type="submit" style={{ background: '#27ae60' }}>Create</Button>
          </Actions>
        </>
      )}
    </FormInner>
  );
};

const AdminListsContainer = styled.div<{ $isStepThree?: boolean }>`
  padding: ${theme.spacing.lg};
  margin: 0 auto;
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
  width: 90%;
  height: ${({ $isStepThree }) => ($isStepThree ? '110%' : '70%')};
`;
const Title = styled.h1`
  color: ${theme.colors.textPrimary};
  font-size: ${theme.typography.fontSizes.xl};
  margin-bottom: ${theme.spacing.lg};
  font-weight: ${theme.typography.fontWeights.semibold};
`;

const WelcomeMessage = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.typography.fontSizes.md};
  margin-bottom: ${theme.spacing.xl};
`;

const CompanyRegister = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();

  // Add a function or variable to determine the title based on the step
  const getTitle = () => {
    if (step === 3) return "Add Admin Credential";
    return "Create New Insurance Company";
  };

  return (
    <AdminListsContainer $isStepThree={step === 3}>
      <Title>{getTitle()}</Title>
      <WelcomeMessage>
      </WelcomeMessage>
      <AdminDetailForm step={step} setStep={setStep} />
    </AdminListsContainer>
  );
};

export default CompanyRegister; 