// "use client";

// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import AdminLayout from "../../admin/layout";
// import { ComponentGate, ComponentId } from "../../lib/rbac";

// const FormContainer = styled.div`
//   background: white;
//   border-radius: 8px;
//   box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//   padding: 32px;
//   max-width: 500px;
//   margin: 40px auto;
// `;

// const PageTitle = styled.h1`
//   font-size: 24px;
//   margin-bottom: 24px;
// `;

// const Label = styled.label`
//   display: block;
//   margin-bottom: 8px;
//   font-weight: 500;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 10px 14px;
//   border: 1px solid #e0e0e0;
//   border-radius: 4px;
//   font-size: 15px;
//   margin-bottom: 18px;
// `;

// const Button = styled.button`
//   background: #00AA00;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   padding: 10px 24px;
//   font-size: 16px;
//   font-weight: 600;
//   cursor: pointer;
//   margin-top: 8px;
//   &:hover { background: #008800; }
// `;

// const Message = styled.div<{ success?: boolean }>`
//   color: ${props => (props.success ? '#00AA00' : '#FF0000')};
//   margin-top: 16px;
//   font-weight: 500;
// `;

// export default function ResetPasswordPage() {
//   const [adminId, setAdminId] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [admins, setAdmins] = useState([]);

//   useEffect(() => {
//     const fetchAdmins = async () => {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:3000/admin/insurance-admins", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//         },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setAdmins(data);
//       }
//       setLoading(false);
//     };
//     fetchAdmins();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);
//     setSuccess(false);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:3000/admin/reset-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`,
//         },
//         body: JSON.stringify({ adminId, newPassword }),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to reset password");
//       }
//       setSuccess(true);
//       setMessage("Password reset successfully!");
//       setAdminId("");
//       setNewPassword("");
//     } catch (err: any) {
//       setSuccess(false);
//       setMessage(err.message || "Failed to reset password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AdminLayout>
//       <ComponentGate componentId={ComponentId.ADMIN_EDIT}>
//         <FormContainer>
//           <PageTitle>Reset Password for Insurance Company Admin</PageTitle>
//           <form onSubmit={handleSubmit}>
//             <Label htmlFor="adminId">Admin ID</Label>
//             <Input
//               id="adminId"
//               type="text"
//               value={adminId}
//               onChange={e => setAdminId(e.target.value)}
//               placeholder="Enter admin ID"
//               required
//             />
//             <Label htmlFor="newPassword">New Password</Label>
//             <Input
//               id="newPassword"
//               type="password"
//               value={newPassword}
//               onChange={e => setNewPassword(e.target.value)}
//               placeholder="Enter new password"
//               required
//             />
//             <Button type="submit" disabled={loading}>
//               {loading ? "Resetting..." : "Reset Password"}
//             </Button>
//             {message && <Message success={success}>{message}</Message>}
//           </form>
//         </FormContainer>
//       </ComponentGate>
//     </AdminLayout>
//   );
// } 