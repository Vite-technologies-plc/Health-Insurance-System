"use client";

import React from "react";
import styled from "styled-components";

// Styled Components (copied from Provider List)
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;
`;

const TableHead = styled.th`
  background: #f5f5f5;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
`;

const TableRow = styled.tr``;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
`;

// Mock data for provider admins
const mockData = [
  {
    id: "1",
    username: "provider_101112",
    email: "james.brown@example.com",
    facilityName: "Green Valley Health Center",
    createdAt: "2025-05-19T09:58:03.527Z",
    admin: {
      id: "a1",
      username: "admin.greenvalley",
      email: "admin.greenvalley@ehi.com",
      createdAt: "2025-05-19T09:58:03.469Z"
    }
  },
  {
    id: "2",
    username: "new_unique_provider_user",
    email: "newproviderunique@example.com",
    facilityName: "Harmony Health Center",
    createdAt: "2025-05-19T18:17:26.633Z",
    admin: {
      id: "a2",
      username: "new_admin_username",
      email: "newadmin@example.com",
      createdAt: "2025-05-19T18:17:25.869Z"
    }
  }
];

const ProvidersAdminListPage = () => {
  return (
    <Container>
      <Header>
        <Title>Provider Admins</Title>
      </Header>
      <Table>
        <thead>
          <TableRow>
            <TableHead>Admin Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Facility</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </thead>
        <tbody>
          {mockData.map((item) => (
            <TableRow key={item.admin.id}>
              <TableCell>{item.admin.username}</TableCell>
              <TableCell>{item.admin.email}</TableCell>
              <TableCell>{item.facilityName}</TableCell>
              <TableCell>{new Date(item.admin.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProvidersAdminListPage;
