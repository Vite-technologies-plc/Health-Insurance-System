import React, { useState } from "react";

const initialState = {
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
    email: "",
  },
  insuranceCompanyId: "",
  contractDetails: {
    startDate: "",
    endDate: "",
    contractNumber: "",
    paymentFrequency: "",
    premiumPerEmployee: "",
    minimumEmployees: "",
    maximumEmployees: "",
  },
  coveragePlans: [
    {
      serviceType: "",
      coverageType: "",
      coverageDetails: {
        percentage: "",
        maxAmount: "",
      },
    },
  ],
  adminCredentials: {
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  },
};

const CoopratorRegister = () => {
  const [form, setForm] = useState(initialState);

  const handleChange = (e, path = []) => {
    const { name, value } = e.target;
    if (path.length === 0) {
      setForm({ ...form, [name]: value });
    } else {
      setForm((prev) => {
        let obj = { ...prev };
        let ref = obj;
        for (let i = 0; i < path.length - 1; i++) {
          ref = ref[path[i]];
        }
        ref[path[path.length - 1]] = value;
        return obj;
      });
    }
  };

  const handleCoverageChange = (e, idx, field, subfield) => {
    const { value } = e.target;
    setForm((prev) => {
      const plans = [...prev.coveragePlans];
      if (subfield) {
        plans[idx].coverageDetails[subfield] = value;
      } else {
        plans[idx][field] = value;
      }
      return { ...prev, coveragePlans: plans };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // POST to your API endpoint here
    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register Cooperator</h2>
      <input name="name" placeholder="Company Name" value={form.name} onChange={handleChange} />
      <input name="registrationNumber" placeholder="Registration Number" value={form.registrationNumber} onChange={handleChange} />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="website" placeholder="Website" value={form.website} onChange={handleChange} />

      <h3>Contact Person</h3>
      <input placeholder="Name" value={form.contactPerson.name} onChange={e => handleChange(e, ["contactPerson", "name"])} />
      <input placeholder="Position" value={form.contactPerson.position} onChange={e => handleChange(e, ["contactPerson", "position"])} />
      <input placeholder="Phone" value={form.contactPerson.phone} onChange={e => handleChange(e, ["contactPerson", "phone"])} />
      <input placeholder="Email" value={form.contactPerson.email} onChange={e => handleChange(e, ["contactPerson", "email"])} />

      <input name="insuranceCompanyId" placeholder="Insurance Company ID" value={form.insuranceCompanyId} onChange={handleChange} />

      <h3>Contract Details</h3>
      <input placeholder="Start Date" type="date" value={form.contractDetails.startDate} onChange={e => handleChange(e, ["contractDetails", "startDate"])} />
      <input placeholder="End Date" type="date" value={form.contractDetails.endDate} onChange={e => handleChange(e, ["contractDetails", "endDate"])} />
      <input placeholder="Contract Number" value={form.contractDetails.contractNumber} onChange={e => handleChange(e, ["contractDetails", "contractNumber"])} />
      <input placeholder="Payment Frequency" value={form.contractDetails.paymentFrequency} onChange={e => handleChange(e, ["contractDetails", "paymentFrequency"])} />
      <input placeholder="Premium Per Employee" type="number" value={form.contractDetails.premiumPerEmployee} onChange={e => handleChange(e, ["contractDetails", "premiumPerEmployee"])} />
      <input placeholder="Minimum Employees" type="number" value={form.contractDetails.minimumEmployees} onChange={e => handleChange(e, ["contractDetails", "minimumEmployees"])} />
      <input placeholder="Maximum Employees" type="number" value={form.contractDetails.maximumEmployees} onChange={e => handleChange(e, ["contractDetails", "maximumEmployees"])} />

      <h3>Coverage Plans</h3>
      {form.coveragePlans.map((plan, idx) => (
        <div key={idx}>
          <input placeholder="Service Type" value={plan.serviceType} onChange={e => handleCoverageChange(e, idx, "serviceType")}/>
          <input placeholder="Coverage Type" value={plan.coverageType} onChange={e => handleCoverageChange(e, idx, "coverageType")}/>
          <input placeholder="Coverage %" type="number" value={plan.coverageDetails.percentage} onChange={e => handleCoverageChange(e, idx, null, "percentage")}/>
          <input placeholder="Max Amount" type="number" value={plan.coverageDetails.maxAmount} onChange={e => handleCoverageChange(e, idx, null, "maxAmount")}/>
        </div>
      ))}

      <h3>Admin Credentials</h3>
      <input placeholder="Username" value={form.adminCredentials.username} onChange={e => handleChange(e, ["adminCredentials", "username"])} />
      <input placeholder="Email" value={form.adminCredentials.email} onChange={e => handleChange(e, ["adminCredentials", "email"])} />
      <input placeholder="Password" type="password" value={form.adminCredentials.password} onChange={e => handleChange(e, ["adminCredentials", "password"])} />
      <input placeholder="First Name" value={form.adminCredentials.firstName} onChange={e => handleChange(e, ["adminCredentials", "firstName"])} />
      <input placeholder="Last Name" value={form.adminCredentials.lastName} onChange={e => handleChange(e, ["adminCredentials", "lastName"])} />
      <input placeholder="Phone Number" value={form.adminCredentials.phoneNumber} onChange={e => handleChange(e, ["adminCredentials", "phoneNumber"])} />

      <button type="submit">Register</button>
    </form>
  );
};

export default CoopratorRegister;

