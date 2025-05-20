import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// --- FORM STYLES ---
const FormContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 40px 0;
  max-width: 900px;
  margin: 40px auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  min-height: 500px;
  position: relative;
`;

const FormInner = styled.form`
  width: 80%;
  margin: 0 auto;
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
  gap: 16px;
`;

const Button = styled.button<{ variant?: string }>`
  background: ${({ variant }) => (variant === 'danger' ? '#fff' : variant === 'success' ? '#27ae60' : '#232323')};
  color: ${({ variant }) => (variant === 'danger' ? '#e74c3c' : '#fff')};
  border: ${({ variant }) => (variant === 'danger' ? '1.5px solid #e74c3c' : 'none')};
  border-radius: 10px;
  padding: 14px 60px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: ${({ variant }) => (variant === 'danger' ? '#e74c3c' : '#444')};
    color: #fff;
  }
`;
// --- END FORM STYLES ---

type CompanyEditProps = {
  company: any;
  onClose: () => void;
  onUpdated?: () => void;
};

const CompanyEdit: React.FC<CompanyEditProps> = ({ company, onClose, onUpdated }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    companyCode: '',
    licenseNumber: '',
    companyWebsite: '',
    companyEmail: '',
    contactNumber: '',
    companyAddress: '',
    description: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.name || '',
        companyCode: company.code || '',
        licenseNumber: company.license || '',
        companyWebsite: company.website || '',
        companyEmail: company.email || '',
        contactNumber: company.phone || '',
        companyAddress: company.address || '',
        description: company.description || '',
      });
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Update logic here
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/insurance-companies/${company.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: formData.companyName,
        code: formData.companyCode,
        license: formData.licenseNumber,
        website: formData.companyWebsite,
        email: formData.companyEmail,
        phone: formData.contactNumber,
        address: formData.companyAddress,
        description: formData.description,
      })
    })
    .then(response => response.json())
    .then(data => {
      alert('Company updated!\n' + JSON.stringify(data, null, 2));
      if (onUpdated) {
        onUpdated();
      } else {
        onClose();
      }
    })
    .catch(error => {
      console.error('Error updating company:', error);
      alert('Error updating company. Please try again later.');
    });
  };

  const handleDiscard = (e: React.FormEvent) => {
    e.preventDefault();
    // Discard logic here
    alert('Changes discarded!');
    onClose();
  };

  return (
    <FormContainer>
      <FormInner onSubmit={step === 2 ? handleUpdate : handleNext}>
        {step === 1 && (
          <>
            <Row>
              <Group>
                <Label>Company Name</Label>
                <Input
                  type="text"
                  name="companyName"
                  placeholder="Health Insurance"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </Group>
              <Group>
                <Label>Company Code</Label>
                <Input
                  type="text"
                  name="companyCode"
                  placeholder="EH"
                  value={formData.companyCode}
                  onChange={handleChange}
                  required
                />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>License Number</Label>
                <Input
                  type="text"
                  name="licenseNumber"
                  placeholder="TY56778990"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </Group>
              <Group>
                <Label>Company Website</Label>
                <Input
                  type="text"
                  name="companyWebsite"
                  placeholder="https://www.xh.com"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Company email</Label>
                <Input
                  type="email"
                  name="companyEmail"
                  placeholder="healthinsurance01@gmail.com"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  required
                />
              </Group>
              <Group>
                <Label>Contact Number</Label>
                <Input
                  type="text"
                  name="contactNumber"
                  placeholder="+35677698978"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Company Address</Label>
                <Input
                  type="text"
                  name="companyAddress"
                  placeholder="04, Abebe Street, Mekelle"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  required
                />
              </Group>
              <Group>
                <Label>Description</Label>
                <Input
                  type="text"
                  name="description"
                  placeholder="Lorem ipsum quick(43) vox(43) (NHJL)"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Group>
            </Row>
            <Actions>
              <Button type="button" variant="danger" onClick={handleDiscard}>Delete</Button>
              <Button type="submit">Edit</Button>
            </Actions>
          </>
        )}
        {step === 2 && (
          <>
            <Row>
              <Group>
                <Label>Company Name</Label>
                <Input
                  type="text"
                  name="companyName"
                  placeholder="Health Insurance"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </Group>
              <Group>
                <Label>Company Code</Label>
                <Input
                  type="text"
                  name="companyCode"
                  placeholder="EH"
                  value={formData.companyCode}
                  onChange={handleChange}
                  required
                />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>License Number</Label>
                <Input
                  type="text"
                  name="licenseNumber"
                  placeholder="TY56778990"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </Group>
              <Group>
                <Label>Company Website</Label>
                <Input
                  type="text"
                  name="companyWebsite"
                  placeholder="https://www.xh.com"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Company email</Label>
                <Input
                  type="email"
                  name="companyEmail"
                  placeholder="healthinsurance01@gmail.com"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  required
                />
              </Group>
              <Group>
                <Label>Contact Number</Label>
                <Input
                  type="text"
                  name="contactNumber"
                  placeholder="+35677698978"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Company Address</Label>
                <Input
                  type="text"
                  name="companyAddress"
                  placeholder="04, Abebe Street, Mekelle"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  required
                />
              </Group>
              <Group>
                <Label>Description</Label>
                <Input
                  type="text"
                  name="description"
                  placeholder="Lorem ipsum quick(43) vox(43) (NHJL)"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Group>
            </Row>
            <Actions>
              <Button type="button" variant="danger" onClick={handleDiscard}>Discard Changes</Button>
              <Button type="submit" variant="success">Update</Button>
            </Actions>
          </>
        )}
      </FormInner>
    </FormContainer>
  );
};

export default CompanyEdit; 