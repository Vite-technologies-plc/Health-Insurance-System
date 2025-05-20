"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { useRouter } from "next/navigation";
import { Trash2 } from 'lucide-react';

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
  border: 1px solid rgb(181, 180, 180);
  border-radius: 5px;
  background: #f7f8fa;
  font-size: 15px;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border: 3.5px solidrgb(164, 52, 52);
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.button`
  background: ${theme.colors.primary};
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

type ProviderFormType = {
  username: string;
  email: string;
  password: string;
  userType: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  facilityName: string;
  category: string;
  facilityType: string;
  name: string;
  phone: string;
  address: string;
  licenseNumber: string;
  healthFacilityType: string;
  specialties: string[];
  services: Record<string, any>;
  facilityServices: string[];
  active: boolean;
  licenseExpiryDate: string;
  taxId: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  operatingHours: {
    day: string;
    openingTime: string;
    closingTime: string;
    isClosed: boolean;
  }[];
  accreditations: Record<string, any>;
  admin: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
};

const initialForm: ProviderFormType = {
  username: "",
  email: "",
  password: "",
  userType: "PROVIDER",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  isActive: true,
  facilityName: "",
  category: "",
  facilityType: "",
  name: "",
  phone: "",
  address: "",
  licenseNumber: "",
  healthFacilityType: "",
  specialties: [""],
  services: {},
  facilityServices: [""],
  active: true,
  licenseExpiryDate: "",
  taxId: "",
  location: {
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  },
  operatingHours: [
    { day: "", openingTime: "", closingTime: "", isClosed: false },
  ],
  accreditations: {},
  admin: {
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  },
};

const steps = [
  "Provider User Info",
  "Facility Info",
  "Location & Operating Hours",
  "Admin Info",
  "Review & Submit",
];

const ProviderRegister: React.FC = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ProviderFormType>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Handlers for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };
  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, admin: { ...form.admin, [e.target.name]: e.target.value } });
  };
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, location: { ...form.location, [e.target.name]: e.target.value } });
  };
  // Array helpers
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: "specialties" | "facilityServices", idx: number) => {
    const arr = [...form[field]];
    arr[idx] = e.target.value;
    setForm({ ...form, [field]: arr });
  };
  const addArrayItem = (field: "specialties" | "facilityServices") => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };
  const removeArrayItem = (field: "specialties" | "facilityServices", idx: number) => {
    const arr = [...form[field]];
    arr.splice(idx, 1);
    setForm({ ...form, [field]: arr });
  };
  // Operating hours helpers
  const handleOperatingHourChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const arr = [...form.operatingHours];
    const key = e.target.name as keyof typeof arr[0];
    (arr[idx][key] as any) = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, operatingHours: arr });
  };
  const addOperatingHour = () => {
    setForm({ ...form, operatingHours: [...form.operatingHours, { day: "", openingTime: "", closingTime: "", isClosed: false }] });
  };
  const removeOperatingHour = (idx: number) => {
    const arr = [...form.operatingHours];
    arr.splice(idx, 1);
    setForm({ ...form, operatingHours: arr });
  };

  // Navigation
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };
  const handleBack = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step - 1);
  };

  // Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      console.log("Submitting provider:", form);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/providers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create provider");
      }
      setSuccess("Provider created successfully!");
      router.push("/providers/list");
    } catch (err: any) {
      setError(err.message || "Error creating provider");
    } finally {
      setLoading(false);
    }
  };

  // Step content
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <RequiredNote>
              <Red>*</Red> All fields are required
            </RequiredNote>
            <Row>
              <Group>
                <Label>Username <Red>*</Red></Label>
                <Input name="username" value={form.username} onChange={handleChange} required placeholder="Enter username" />
              </Group>
              <Group>
                <Label>Email <Red>*</Red></Label>
                <Input name="email" value={form.email} onChange={handleChange} required placeholder="Enter email address" />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Password <Red>*</Red></Label>
                <Input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Enter password" />
              </Group>
              <Group>
                <Label>First Name</Label>
                <Input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Enter first name" />
              </Group>
              <Group>
                <Label>Last Name</Label>
                <Input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Enter last name" />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Phone Number</Label>
                <Input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Enter phone number" />
              </Group>
              <Group>
                <Label>Active</Label>
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
              </Group>
            </Row>
          </>
        );
      case 2:
        return (
          <>
            <Row>
              <Group>
                <Label>Facility Name</Label>
                <Input name="facilityName" value={form.facilityName} onChange={handleChange} placeholder="Enter facility name" />
              </Group>
              <Group>
                <Label>Category</Label>
                <Input name="category" value={form.category} onChange={handleChange} placeholder="Enter category" />
              </Group>
              <Group>
                <Label>Facility Type</Label>
                <Input name="facilityType" value={form.facilityType} onChange={handleChange} placeholder="Enter facility type" />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Legal Name</Label>
                <Input name="name" value={form.name} onChange={handleChange} placeholder="Enter legal name" />
              </Group>
              <Group>
                <Label>Facility Phone</Label>
                <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Enter facility phone" />
              </Group>
              <Group>
                <Label>Facility Address</Label>
                <Input name="address" value={form.address} onChange={handleChange} placeholder="Enter facility address" />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>License Number</Label>
                <Input name="licenseNumber" value={form.licenseNumber} onChange={handleChange} placeholder="Enter license number" />
              </Group>
              <Group>
                <Label>Health Facility Type</Label>
                <Input name="healthFacilityType" value={form.healthFacilityType} onChange={handleChange} placeholder="Enter health facility type" />
              </Group>
            </Row>
            <Row>
              <Group style={{ flex: 2 }}>
                <Label>Specialties</Label>
                {form.specialties.map((spec, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <Input value={spec} onChange={e => handleArrayChange(e, "specialties", idx)} placeholder="Enter specialty" />
                    <Button
                      type="button"
                      style={{ background: '#e74c3c', color: '#fff', minWidth: 32, padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      aria-label="Remove specialty"
                      onClick={() => removeArrayItem("specialties", idx)}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addArrayItem("specialties")}>Add Specialty</Button>
              </Group>
              <Group style={{ flex: 2 }}>
                <Label>Facility Services</Label>
                {form.facilityServices.map((svc, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <Input value={svc} onChange={e => handleArrayChange(e, "facilityServices", idx)} placeholder="Enter service" />
                    <Button
                      type="button"
                      style={{ background: '#e74c3c', color: '#fff', minWidth: 32, padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      aria-label="Remove service"
                      onClick={() => removeArrayItem("facilityServices", idx)}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={() => addArrayItem("facilityServices")}>Add Service</Button>
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Active</Label>
                <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
              </Group>
              <Group>
                <Label>License Expiry Date</Label>
                <Input name="licenseExpiryDate" type="date" value={form.licenseExpiryDate} onChange={handleChange} placeholder="Select license expiry date" />
              </Group>
              <Group>
                <Label>Tax ID</Label>
                <Input name="taxId" value={form.taxId} onChange={handleChange} placeholder="Enter tax ID" />
              </Group>
            </Row>
          </>
        );
      case 3:
        return (
          <>
            <Row>
              <Group>
                <Label>Location Address</Label>
                <Input name="address" value={form.location.address} onChange={handleLocationChange} placeholder="Enter location address" />
              </Group>
              <Group>
                <Label>City</Label>
                <Input name="city" value={form.location.city} onChange={handleLocationChange} placeholder="Enter city" />
              </Group>
              <Group>
                <Label>State</Label>
                <Input name="state" value={form.location.state} onChange={handleLocationChange} placeholder="Enter state" />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Country</Label>
                <Input name="country" value={form.location.country} onChange={handleLocationChange} placeholder="Enter country" />
              </Group>
              <Group>
                <Label>Postal Code</Label>
                <Input name="postalCode" value={form.location.postalCode} onChange={handleLocationChange} placeholder="Enter postal code" />
              </Group>
            </Row>
            <Row style={{ flexDirection: "column" }}>
              <Label>Operating Hours</Label>
              {form.operatingHours.map((oh, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <Input name="day" placeholder="Day" value={oh.day} onChange={e => handleOperatingHourChange(e, idx)} />
                  <Input name="openingTime" placeholder="Opening Time" value={oh.openingTime} onChange={e => handleOperatingHourChange(e, idx)} />
                  <Input name="closingTime" placeholder="Closing Time" value={oh.closingTime} onChange={e => handleOperatingHourChange(e, idx)} />
                  <label style={{ display: "flex", alignItems: "center" }}>
                    <input type="checkbox" name="isClosed" checked={oh.isClosed} onChange={e => handleOperatingHourChange(e, idx)} /> Closed
                  </label>
                  <Button
                    type="button"
                    style={{ background: '#e74c3c', color: '#fff', minWidth: 32, padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    aria-label="Remove operating hour"
                    onClick={() => removeOperatingHour(idx)}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addOperatingHour}>Add Operating Hour</Button>
            </Row>
          </>
        );
      case 4:
        return (
          <>
            <Row>
              <Group>
                <Label>Admin Username <Red>*</Red></Label>
                <Input name="username" value={form.admin.username} onChange={handleAdminChange} required placeholder="Enter admin username" />
              </Group>
              <Group>
                <Label>Admin Email <Red>*</Red></Label>
                <Input name="email" value={form.admin.email} onChange={handleAdminChange} required placeholder="Enter admin email address" />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Admin Password <Red>*</Red></Label>
                <Input name="password" type="password" value={form.admin.password} onChange={handleAdminChange} required placeholder="Enter admin password" />
              </Group>
              <Group>
                <Label>Admin First Name</Label>
                <Input name="firstName" value={form.admin.firstName} onChange={handleAdminChange} placeholder="Enter admin first name" />
              </Group>
              <Group>
                <Label>Admin Last Name</Label>
                <Input name="lastName" value={form.admin.lastName} onChange={handleAdminChange} placeholder="Enter admin last name" />
              </Group>
            </Row>
            <Row>
              <Group>
                <Label>Admin Phone Number</Label>
                <Input name="phoneNumber" value={form.admin.phoneNumber} onChange={handleAdminChange} placeholder="Enter admin phone number" />
              </Group>
            </Row>
          </>
        );
      case 5:
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
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Register New Provider</h2>
      <FormInner onSubmit={step === 5 ? handleSubmit : handleNext}>
        {renderStep()}
        <Actions>
          {step > 1 && (
            <Button type="button" onClick={handleBack} style={{ marginRight: 16, background: "#232323" }}>
              Back
            </Button>
          )}
          {step < 5 && <Button type="submit">Next</Button>}
          {step === 5 && <Button type="submit" style={{ background: theme.colors.primary }}>Submit</Button>}
        </Actions>
        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
        {success && <div style={{ color: "green", marginTop: 10 }}>{success}</div>}
      </FormInner>
    </FormContainer>
  );
};

export default ProviderRegister; 