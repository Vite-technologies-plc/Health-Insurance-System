"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import styled from "styled-components";
// import { theme } from "@/styles/theme"; // Uncomment if you have a theme file

// --- FORM STYLES ---
const FormContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 40px 0;
  max-width: 900px;
  margin: 40px 0 40px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  min-height: 500px;
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
  border: 1px solid rgb(181, 180, 180);
  border-radius: 5px;
  background: #f7f8fa;
  font-size: 15px;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border: 3.5px solid rgb(164, 52, 52);
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.button`
  background: #00aa00; /* Use theme.colors.primary if available */
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

interface ContactPerson {
  name: string;
  position: string;
  phone: string;
  email: string;
}

interface ContractDetails {
  startDate: string;
  endDate: string;
  contractNumber: string;
  paymentFrequency: string;
  premiumPerEmployee: string;
  minimumEmployees: string;
  maximumEmployees: string;
}

interface CoverageDetails {
  percentage: string;
  maxAmount: string;
}

interface CoveragePlan {
  serviceType: string;
  coverageType: string;
  coverageDetails: CoverageDetails;
}

interface AdminCredentials {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface CorporateForm {
  name: string;
  registrationNumber: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  contactPerson: ContactPerson;
  insuranceCompanyId: string;
  contractDetails: ContractDetails;
  coveragePlans: CoveragePlan[];
  adminCredentials: AdminCredentials;
}

const initialForm: CorporateForm = {
  name: "",
  registrationNumber: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  contactPerson: {
    name: "",
    position: "",
    phone: "",
    email: ""
  },
  insuranceCompanyId: "",
  contractDetails: {
    startDate: "",
    endDate: "",
    contractNumber: "",
    paymentFrequency: "",
    premiumPerEmployee: "",
    minimumEmployees: "",
    maximumEmployees: ""
  },
  coveragePlans: [
    {
      serviceType: "",
      coverageType: "",
      coverageDetails: {
        percentage: "",
        maxAmount: ""
      }
    }
  ],
  adminCredentials: {
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: ""
  }
};

const steps = [
  "Basic Info",
  "Contact Person",
  "Contract Details",
  "Coverage Plans",
  "Admin Credentials",
  "Review & Submit"
];

const CorporateRegisterForm: React.FC = () => {
  const [form, setForm] = useState<CorporateForm>(initialForm);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle top-level fields
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle nested fields
  const handleNestedChange = (
    e: ChangeEvent<HTMLInputElement>,
    section: "contactPerson" | "adminCredentials" | "contractDetails"
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [section]: {
        ...(form[section] as unknown as Record<string, string>),
        [name]: value
      }
    });
  };

  // Handle contractDetails
  const handleContractChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      contractDetails: { ...form.contractDetails, [name]: value }
    });
  };

  // Handle coveragePlans
  const handleCoverageChange = (
    e: ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const { name, value } = e.target;
    const plans = [...form.coveragePlans];
    if (name === "percentage" || name === "maxAmount") {
      plans[idx].coverageDetails = {
        ...plans[idx].coverageDetails,
        [name]: value
      };
    } else {
      (plans[idx] as any)[name] = value;
    }
    setForm({ ...form, coveragePlans: plans });
  };

  // Add/Remove coverage plan
  const addCoveragePlan = () => {
    setForm({
      ...form,
      coveragePlans: [
        ...form.coveragePlans,
        {
          serviceType: "",
          coverageType: "",
          coverageDetails: { percentage: "", maxAmount: "" }
        }
      ]
    });
  };
  const removeCoveragePlan = (idx: number) => {
    const plans = [...form.coveragePlans];
    plans.splice(idx, 1);
    setForm({ ...form, coveragePlans: plans });
  };

  // Handle admin credentials
  const handleAdminChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      adminCredentials: { ...form.adminCredentials, [name]: value }
    });
  };

  // Submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // POST form to your API
    try {
      const res = await fetch("http://localhost:3000/corporate/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to register corporate");
      alert("Corporate registered!");
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Unknown error");
      }
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => Math.min(prev + 1, steps.length));
  };
  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Row>
              <Group>
                <Label>Name</Label>
                <Input name="name" value={form.name} onChange={handleChange} required />
              </Group>
              <Group>
                <Label>Registration Number</Label>
                <Input name="registrationNumber" value={form.registrationNumber} onChange={handleChange} required />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Address</Label>
                <Input name="address" value={form.address} onChange={handleChange} required />
              </Group>
              <Group>
                <Label>Phone</Label>
                <Input name="phone" value={form.phone} onChange={handleChange} required />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Email</Label>
                <Input name="email" value={form.email} onChange={handleChange} required />
              </Group>
              <Group>
                <Label>Website</Label>
                <Input name="website" value={form.website} onChange={handleChange} />
              </Group>
            </Row>
          </>
        );
      case 2:
        return (
          <>
            <h3>Contact Person</h3>
            <Row>
              <Group>
                <Label>Contact Name</Label>
                <Input name="name" value={form.contactPerson.name} onChange={e => handleNestedChange(e, "contactPerson")}
                  required />
              </Group>
              <Group>
                <Label>Position</Label>
                <Input name="position" value={form.contactPerson.position} onChange={e => handleNestedChange(e, "contactPerson")}
                  required />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Phone</Label>
                <Input name="phone" value={form.contactPerson.phone} onChange={e => handleNestedChange(e, "contactPerson")}
                  required />
              </Group>
              <Group>
                <Label>Email</Label>
                <Input name="email" value={form.contactPerson.email} onChange={e => handleNestedChange(e, "contactPerson")}
                  required />
              </Group>
            </Row>
          </>
        );
      case 3:
        return (
          <>
            <h3>Contract Details</h3>
            <Row>
              <Group>
                <Label>Start Date</Label>
                <Input name="startDate" value={form.contractDetails.startDate} onChange={handleContractChange} type="date" required />
              </Group>
              <Group>
                <Label>End Date</Label>
                <Input name="endDate" value={form.contractDetails.endDate} onChange={handleContractChange} type="date" required />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Contract Number</Label>
                <Input name="contractNumber" value={form.contractDetails.contractNumber} onChange={handleContractChange} required />
              </Group>
              <Group>
                <Label>Payment Frequency</Label>
                <Input name="paymentFrequency" value={form.contractDetails.paymentFrequency} onChange={handleContractChange} required />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Premium Per Employee</Label>
                <Input name="premiumPerEmployee" value={form.contractDetails.premiumPerEmployee} onChange={handleContractChange} type="number" required />
              </Group>
              <Group>
                <Label>Minimum Employees</Label>
                <Input name="minimumEmployees" value={form.contractDetails.minimumEmployees} onChange={handleContractChange} type="number" required />
              </Group>
              <Group>
                <Label>Maximum Employees</Label>
                <Input name="maximumEmployees" value={form.contractDetails.maximumEmployees} onChange={handleContractChange} type="number" required />
              </Group>
            </Row>
          </>
        );
      case 4:
        return (
          <>
            <h3>Coverage Plans</h3>
            {form.coveragePlans.map((plan, idx) => (
              <Row key={idx}>
                <Group>
                  <Label>Service Type</Label>
                  <Input name="serviceType" value={plan.serviceType} onChange={e => handleCoverageChange(e, idx)} required />
                </Group>
                <Group>
                  <Label>Coverage Type</Label>
                  <Input name="coverageType" value={plan.coverageType} onChange={e => handleCoverageChange(e, idx)} required />
                </Group>
                <Group>
                  <Label>Coverage %</Label>
                  <Input name="percentage" value={plan.coverageDetails.percentage} onChange={e => handleCoverageChange(e, idx)} type="number" required />
                </Group>
                <Group>
                  <Label>Max Amount</Label>
                  <Input name="maxAmount" value={plan.coverageDetails.maxAmount} onChange={e => handleCoverageChange(e, idx)} type="number" required />
                </Group>
                <Group>
                  <Label>&nbsp;</Label>
                  <Button type="button" onClick={() => removeCoveragePlan(idx)} style={{ background: '#e74c3c', color: '#fff', minWidth: 32, padding: '0 12px' }}>Remove</Button>
                </Group>
              </Row>
            ))}
            <Actions>
              <Button type="button" onClick={addCoveragePlan} style={{ background: '#00aa00', color: '#fff', minWidth: 32, padding: '0 12px' }}>Add Coverage Plan</Button>
            </Actions>
          </>
        );
      case 5:
        return (
          <>
            <h3>Admin Credentials</h3>
            <Row>
              <Group>
                <Label>Username</Label>
                <Input name="username" value={form.adminCredentials.username} onChange={handleAdminChange} required />
              </Group>
              <Group>
                <Label>Email</Label>
                <Input name="email" value={form.adminCredentials.email} onChange={handleAdminChange} required />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Password</Label>
                <Input name="password" value={form.adminCredentials.password} onChange={handleAdminChange} type="password" required />
              </Group>
              <Group>
                <Label>First Name</Label>
                <Input name="firstName" value={form.adminCredentials.firstName} onChange={handleAdminChange} required />
              </Group>
              <Group>
                <Label>Last Name</Label>
                <Input name="lastName" value={form.adminCredentials.lastName} onChange={handleAdminChange} required />
              </Group>
              <br/>
              <Group>
                <Label>Phone Number</Label>
                <Input name="phoneNumber" value={form.adminCredentials.phoneNumber} onChange={handleAdminChange} required />
              </Group>
            </Row>
          </>
        );
      case 6:
        return (
          <>
            <h3>Review & Submit</h3>
            <pre style={{ background: "#f7f8fa", padding: 16, borderRadius: 8, fontSize: 13 }}>
              {JSON.stringify(form, null, 2)}
            </pre>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <FormContainer>
      <FormInner onSubmit={step === steps.length ? handleSubmit : handleNext}>
        <h2>Corporate Registration</h2>
        {renderStep()}
        <Actions>
          {step > 1 && (
            <Button type="button" onClick={handleBack} style={{ marginRight: 16 }}>
              Back
            </Button>
          )}
          {step < steps.length ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit">Register Corporate</Button>
          )}
        </Actions>
      </FormInner>
    </FormContainer>
  );
};

export default CorporateRegisterForm;

