'use client';

import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../lib/rbac/auth-context';
import { ComponentGate, ComponentId } from '../lib/rbac';
import { Building2, Users, FileText, Shield, Calendar, CreditCard, Activity, Briefcase, UserCheck, ClipboardList, HeartPulse, DollarSign } from 'lucide-react';
import Layout from '../components/layout';
import { useRouter } from 'next/navigation';

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 24px;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const StatsCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h3`
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
`;

const CardValue = styled.div`
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: rgba(0, 170, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  
  svg {
    width: 24px;
    height: 24px;
    color: #00AA00;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const TableTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 16px;
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

const Badge = styled.span<{ type: 'success' | 'warning' | 'danger' | 'info' }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch(props.type) {
      case 'success': return 'rgba(0, 170, 0, 0.1)';
      case 'warning': return 'rgba(255, 170, 0, 0.1)';
      case 'danger': return 'rgba(255, 0, 0, 0.1)';
      case 'info': return 'rgba(0, 100, 255, 0.1)';
      default: return 'rgba(0, 170, 0, 0.1)';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'success': return '#00AA00';
      case 'warning': return '#FFA500';
      case 'danger': return '#FF0000';
      case 'info': return '#0064FF';
      default: return '#00AA00';
    }
  }};
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin: 32px 0 16px 0;
  color: #333;
`;

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Add authentication check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
      return;
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Helper function to show welcome message based on user type
  const renderWelcomeHeader = () => {
    return (
      <div>
        <h1>Welcome, {user.username}</h1>
        <p>Your {user.userType} Dashboard</p>
      </div>
    );
  };

  return (
    <Layout>
    <PageContainer>
      <ContentContainer>
        {renderWelcomeHeader()}
        
        {/* Super Admin */}
        <ComponentGate componentId={ComponentId.DASHBOARD}>
          <SectionTitle>Overview</SectionTitle>
          <DashboardGrid>
            <StatsCard>
              <CardIcon>
                <Building2 />
              </CardIcon>
              <CardTitle>Total Insurance Companies</CardTitle>
              <CardValue>12</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <Users />
              </CardIcon>
              <CardTitle>Total Users</CardTitle>
              <CardValue>1,248</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <FileText />
              </CardIcon>
              <CardTitle>Active Claims</CardTitle>
              <CardValue>126</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <Shield />
              </CardIcon>
              <CardTitle>Active Policies</CardTitle>
              <CardValue>843</CardValue>
            </StatsCard>
          </DashboardGrid>
        </ComponentGate>
        
        {/* Insurance Admin Specific Stats */}
        <ComponentGate componentId={ComponentId.INSURANCE_ADMIN_DASHBOARD}>
          <SectionTitle>Insurance Performance</SectionTitle>
          <DashboardGrid>
            <StatsCard>
              <CardIcon>
                <DollarSign />
              </CardIcon>
              <CardTitle>Premium Revenue</CardTitle>
              <CardValue>$1.2M</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <Activity />
              </CardIcon>
              <CardTitle>Claims Ratio</CardTitle>
              <CardValue>68%</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <Calendar />
              </CardIcon>
              <CardTitle>Avg. Processing Time</CardTitle>
              <CardValue>3.2 days</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <UserCheck />
              </CardIcon>
              <CardTitle>Member Satisfaction</CardTitle>
              <CardValue>92%</CardValue>
            </StatsCard>
          </DashboardGrid>
        </ComponentGate>
        
        {/* Provider Admin Dashboard */}
        <ComponentGate componentId={ComponentId.PROVIDER_ADMIN_DASHBOARD}>
          <SectionTitle>Provider Performance</SectionTitle>
          <DashboardGrid>
            <StatsCard>
              <CardIcon>
                <HeartPulse />
              </CardIcon>
              <CardTitle>Patients Served</CardTitle>
              <CardValue>528</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <ClipboardList />
              </CardIcon>
              <CardTitle>Pending Approvals</CardTitle>
              <CardValue>37</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <DollarSign />
              </CardIcon>
              <CardTitle>Revenue This Month</CardTitle>
              <CardValue>$86.5K</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <Calendar />
              </CardIcon>
              <CardTitle>Avg. Wait Time</CardTitle>
              <CardValue>2.4 days</CardValue>
            </StatsCard>
          </DashboardGrid>
        </ComponentGate>
        
        {/* Corporate Admin Dashboard */}
        <ComponentGate componentId={ComponentId.CORPORATE_ADMIN_DASHBOARD}>
          <SectionTitle>Corporate Health Overview</SectionTitle>
          <DashboardGrid>
            <StatsCard>
              <CardIcon>
                <Users />
              </CardIcon>
              <CardTitle>Enrolled Employees</CardTitle>
              <CardValue>342</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <Briefcase />
              </CardIcon>
              <CardTitle>Departments Covered</CardTitle>
              <CardValue>8</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <CreditCard />
              </CardIcon>
              <CardTitle>Monthly Premium</CardTitle>
              <CardValue>$48.2K</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <FileText />
              </CardIcon>
              <CardTitle>Claims This Month</CardTitle>
              <CardValue>28</CardValue>
            </StatsCard>
          </DashboardGrid>
        </ComponentGate>
        
        {/* Member Dashboard */}
        <ComponentGate componentId={ComponentId.MEMBER_DASHBOARD}>
          <SectionTitle>Your Health Coverage</SectionTitle>
          <DashboardGrid>
            <StatsCard>
              <CardIcon>
                <Shield />
              </CardIcon>
              <CardTitle>Coverage Level</CardTitle>
              <CardValue>Gold</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <DollarSign />
              </CardIcon>
              <CardTitle>Deductible Remaining</CardTitle>
              <CardValue>$850</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <Calendar />
              </CardIcon>
              <CardTitle>Next Payment</CardTitle>
              <CardValue>Jun 15</CardValue>
            </StatsCard>
            
            <StatsCard>
              <CardIcon>
                <FileText />
              </CardIcon>
              <CardTitle>Open Claims</CardTitle>
              <CardValue>2</CardValue>
            </StatsCard>
          </DashboardGrid>
        </ComponentGate>
        
        {/* Staff & Insurance Staff Dashboard */}
        <ComponentGate componentId={ComponentId.STAFF_DASHBOARD}>
          <SectionTitle>Work Queue</SectionTitle>
          <TableContainer>
            <TableTitle>Tasks Requiring Attention</TableTitle>
            <Table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Member</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Claim Verification</td>
                  <td>Robert Johnson</td>
                  <td><Badge type="danger">High</Badge></td>
                  <td>Today</td>
                </tr>
                <tr>
                  <td>Policy Renewal</td>
                  <td>Maria Garcia</td>
                  <td><Badge type="warning">Medium</Badge></td>
                  <td>Tomorrow</td>
                </tr>
                <tr>
                  <td>Document Review</td>
                  <td>James Wilson</td>
                  <td><Badge type="info">Low</Badge></td>
                  <td>May 18, 2023</td>
                </tr>
                <tr>
                  <td>Approval Request</td>
                  <td>Susan Miller</td>
                  <td><Badge type="warning">Medium</Badge></td>
                  <td>May 19, 2023</td>
                </tr>
              </tbody>
            </Table>
          </TableContainer>
        </ComponentGate>
        
        {/* Recent insurance companies - only visible to super admin */}
        <ComponentGate componentId={ComponentId.INSURANCE_LIST}>
          <TableContainer>
            <TableTitle>Recent Insurance Companies</TableTitle>
            <Table>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Admin</th>
                  <th>Members</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ACME Health Insurance</td>
                  <td>John Smith</td>
                  <td>428</td>
                  <td><Badge type="success">Active</Badge></td>
                </tr>
                <tr>
                  <td>Global Insurance Co.</td>
                  <td>Sarah Johnson</td>
                  <td>356</td>
                  <td><Badge type="success">Active</Badge></td>
                </tr>
                <tr>
                  <td>Secure Health Partners</td>
                  <td>Michael Davis</td>
                  <td>0</td>
                  <td><Badge type="warning">Pending</Badge></td>
                </tr>
                <tr>
                  <td>MediCare Plus</td>
                  <td>Emily Wilson</td>
                  <td>219</td>
                  <td><Badge type="success">Active</Badge></td>
                </tr>
              </tbody>
            </Table>
          </TableContainer>
        </ComponentGate>
        
        {/* Recent admin activity - only visible to super admin */}
        <ComponentGate componentId={ComponentId.ADMIN_LIST}>
          <TableContainer>
            <TableTitle>Recent Admin Activity</TableTitle>
            <Table>
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Company</th>
                  <th>Action</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Smith</td>
                  <td>ACME Health Insurance</td>
                  <td>Created new policy</td>
                  <td>Today, 10:23 AM</td>
                </tr>
                <tr>
                  <td>Sarah Johnson</td>
                  <td>Global Insurance Co.</td>
                  <td>Approved claim #12458</td>
                  <td>Yesterday, 2:45 PM</td>
                </tr>
                <tr>
                  <td>Emily Wilson</td>
                  <td>MediCare Plus</td>
                  <td>Added new corporate client</td>
                  <td>Yesterday, 11:30 AM</td>
                </tr>
                <tr>
                  <td>John Smith</td>
                  <td>ACME Health Insurance</td>
                  <td>Updated coverage plan</td>
                  <td>May 10, 2023</td>
                </tr>
              </tbody>
            </Table>
          </TableContainer>
        </ComponentGate>
      </ContentContainer>
    </PageContainer>
    </Layout>
  );
};

export default AdminDashboard; 