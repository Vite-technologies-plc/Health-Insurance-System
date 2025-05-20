"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AuthProvider } from "../../lib/rbac/auth-context";
import { ComponentGate, ComponentId } from "../../lib/rbac";
import Button from "../../common/Button";
import { Search, ArrowUpDown, Edit, Trash, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import AdminLayout from '../layout';

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: flex-start;
`;

const ContentContainer = styled.div`
  flex: 1;
  margin: 0 auto;
  padding: 24px;
  max-width: 900px;
  width: 100%;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  max-width: 400px;
`;

const SearchIcon = styled.div`
  position: relative;
  left: -32px;
  display: flex;
  align-items: center;
  color: #888;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  th {
    font-weight: 600;
    color: #555;
    font-size: 14px;
  }
`;

const SortableHeader = styled.th`
  cursor: pointer;
  &:hover {
    color: #00AA00;
  }
  span {
    display: inline-flex;
    align-items: center;
  }
  svg {
    width: 16px;
    height: 16px;
    margin-left: 4px;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

interface InsuranceAdmin {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  adminType: string;
  __insuranceCompany__?: {
    id: string;
    name: string;
    code: string;
    email: string;
    isActive: boolean;
  } | null;
}

const InsuranceAdminsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState<InsuranceAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [adminToResetPassword, setAdminToResetPassword] = useState<InsuranceAdmin | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/admin/insurance-admins", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch admins");
      }
      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      setError("Could not load insurance admins.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter((admin) =>
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (admin.__insuranceCompany__?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleResetPasswordClick = (admin: InsuranceAdmin) => {
    setAdminToResetPassword(admin);
    setShowResetPasswordModal(true);
    setResetMessage(null);
    setResetSuccess(null);
    setNewPassword("");
    setPasswordError(null);
  };

  const confirmResetPassword = async () => {
    if (!adminToResetPassword) return;
    if (!newPassword || newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }
    setResetLoading(true);
    setResetMessage(null);
    setResetSuccess(null);
    setPasswordError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ adminId: adminToResetPassword.id, newPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }
      setResetSuccess(true);
      setResetMessage("Password reset successfully!");
    } catch (err: any) {
      setResetSuccess(false);
      setResetMessage(err.message || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <AdminLayout>
      <ComponentGate componentId={ComponentId.ADMIN_LIST}>
        <PageHeader>
          <PageTitle>Insurance Company Admins</PageTitle>
        </PageHeader>
        <TableContainer>
          <SearchContainer>
            <SearchInput
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon>
              <Search size={18} />
            </SearchIcon>
          </SearchContainer>
          <Table>
            <thead>
              <tr>
                <SortableHeader>
                  <span>
                    Name
                    <ArrowUpDown />
                  </span>
                </SortableHeader>
                <th>Email</th>
                <th>Company</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} style={{ color: "red" }}>{error}</td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={5}>No admins found.</td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td>{admin.username}</td>
                    <td>{admin.email}</td>
                    <td>{admin.__insuranceCompany__?.name || "N/A"}</td>
                    <td>{admin.createdAt}</td>
                    <td>
                      <Button
                        size="small"
                        variant="secondary"
                        icon={<Key size={14} />}
                        onClick={() => handleResetPasswordClick(admin)}
                      >
                        Reset Password
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableContainer>
        {showResetPasswordModal && (
          <Modal>
            <ModalContent>
              <h3>Reset Password</h3>
              <p>Enter a new password for <b>{adminToResetPassword?.username}</b>:</p>
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: 8, marginTop: 8, marginBottom: 4, border: '1px solid #e0e0e0', borderRadius: 4 }}
                disabled={resetLoading || resetSuccess === true}
              />
              {passwordError && <div style={{ color: 'red', marginBottom: 8 }}>{passwordError}</div>}
              {resetMessage && (
                <div style={{ color: resetSuccess ? '#00AA00' : 'red', marginTop: 12 }}>{resetMessage}</div>
              )}
              <ModalActions>
                <Button variant="tertiary" onClick={() => setShowResetPasswordModal(false)} disabled={resetLoading}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={confirmResetPassword} disabled={resetLoading || resetSuccess === true}>
                  {resetLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </ModalActions>
            </ModalContent>
          </Modal>
        )}
      </ComponentGate>
    </AdminLayout>
  );
};

export default InsuranceAdminsPage; 