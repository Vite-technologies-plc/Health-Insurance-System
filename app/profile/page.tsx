'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../lib/rbac/auth-context';
import { User, UserType } from '../lib/rbac/models';
import { ComponentGate, ComponentId } from '../lib/rbac';
import { Camera, Mail, User as UserIcon, Users, Building, Phone, Briefcase, Calendar, Save, Edit, X, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

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
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSidebar = styled.div`
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.div`
  width: 100%;
  height: 180px;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Avatar = styled.div<{ bgColor: string }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${props => props.bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 600;
`;

const UploadButton = styled.button`
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
`;

const ProfileInfo = styled.div`
  padding: 1.25rem;
`;

const ProfileName = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #111827;
`;

const ProfileRole = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1.25rem;
`;

const ProfileDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.875rem;
  font-size: 0.875rem;
  color: #4b5563;

  svg {
    min-width: 16px;
    color: #6b7280;
  }
`;

const Card = styled.div`
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.25rem;
`;

const CardHeader = styled.div`
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f3f4f6;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
`;

const CardContent = styled.div`
  padding: 1.25rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.375rem;
  color: #4b5563;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  transition: border-color 0.15s ease;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px #3b82f6;
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Message = styled.div<{ type: 'error' | 'success' }>`
  background-color: ${props => props.type === 'error' ? '#fee2e2' : '#dcfce7'};
  color: ${props => props.type === 'error' ? '#b91c1c' : '#166534'};
  padding: 0.75rem;
  border-radius: 0.25rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

// Enhanced user data interface
interface ExtendedUser extends User {
  phoneNumber?: string;
  address?: string;
  bio?: string;
  department?: string;
  position?: string;
  joinDate?: string;
  adminType?: string;
  name?: string;
}

// Get a color based on user type
const getUserColor = (userType: UserType): string => {
  const colors: Record<UserType, string> = {
    [UserType.ADMIN]: '#2563eb', // Blue
    [UserType.INSURANCE_ADMIN]: '#7c3aed', // Purple
    [UserType.INSURANCE_STAFF]: '#8b5cf6', // Light purple
    [UserType.CORPORATE_ADMIN]: '#db2777', // Pink
    [UserType.PROVIDER_ADMIN]: '#ea580c', // Orange
    [UserType.STAFF]: '#0d9488', // Teal
    [UserType.MEMBER]: '#16a34a', // Green
    [UserType.PROVIDER]: '#ca8a04' // Yellow
  };
  return colors[userType] || '#4b5563'; // Default gray
};

// Format user type for display
const formatUserType = (userType: UserType): string => {
  return userType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<ExtendedUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (!user || !userData) {
    return (
      <Container>
        <p>Loading profile data...</p>
      </Container>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would call an API to update the user profile
      console.log('Saving profile changes:', userData);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <ComponentGate componentId={ComponentId.PROFILE_VIEW}>
      <Container>
        {error && (
          <Message type="error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </Message>
        )}
        
        {success && (
          <Message type="success">
            <CheckCircle size={16} />
            <span>{success}</span>
          </Message>
        )}
        
        <Header>
          <Title>
            Profile
            {userData.name
              ? ` - ${userData.name}`
              : userData.username
                ? ` - ${userData.username}`
                : ''}
          </Title>
          <ComponentGate componentId={ComponentId.PROFILE_EDIT}>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} size="medium">
                <Edit size={16} />
                Edit Profile
              </Button>
            ) : (
              <ActionButtons>
                <Button variant="secondary" onClick={handleCancel} size="medium">
                  <X size={16} />
                  Discard changes
                </Button>
                <Button onClick={handleSave} disabled={loading} size="medium">
                  <Save size={16} />
                  Save changes
                </Button>
              </ActionButtons>
            )}
          </ComponentGate>
        </Header>
        
        <ProfileGrid>
          <ProfileSidebar>
            <ProfileImage>
              <Avatar bgColor={getUserColor(userData.userType)}>
                {userData.username ? userData.username[0].toUpperCase() : '?'}
              </Avatar>
              {isEditing && (
                <UploadButton>
                  <Camera size={16} />
                </UploadButton>
              )}
            </ProfileImage>
            
            <ProfileInfo>
              <ProfileName>{userData.username}</ProfileName>
              <ProfileRole>{formatUserType(userData.userType)}</ProfileRole>
              
              <ProfileDetail>
                <Mail size={16} />
                <span>{userData.email}</span>
              </ProfileDetail>
              
              {userData.adminType && (
                <ProfileDetail>
                  <span>Admin Type: {userData.adminType}</span>
                </ProfileDetail>
              )}
            </ProfileInfo>
          </ProfileSidebar>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGrid>
                  <FormGroup>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={userData.username}
                      disabled={true}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userData.email}
                      disabled={true}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="userType">Role</Label>
                    <Input
                      id="userType"
                      name="userType"
                      value={formatUserType(userData.userType)}
                      disabled={true}
                    />
                  </FormGroup>
                  
                  {userData.adminType && (
                    <FormGroup>
                      <Label htmlFor="adminType">Admin Type</Label>
                      <Input
                        id="adminType"
                        name="adminType"
                        value={userData.adminType}
                        disabled={true}
                      />
                    </FormGroup>
                  )}
                </FormGrid>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGrid>
                  <FormGroup>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={userData.phoneNumber || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={isEditing ? "Enter phone number" : ""}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={userData.address || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder={isEditing ? "Enter address" : ""}
                    />
                  </FormGroup>
                </FormGrid>
              </CardContent>
            </Card>
            
            {(userData.userType === UserType.STAFF || 
              userData.userType === UserType.INSURANCE_STAFF || 
              userData.userType === UserType.INSURANCE_ADMIN ||
              userData.userType === UserType.PROVIDER_ADMIN) && (
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormGrid>
                    <FormGroup>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={userData.department || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder={isEditing ? "Enter department" : ""}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        name="position"
                        value={userData.position || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder={isEditing ? "Enter position" : ""}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label htmlFor="joinDate">Join Date</Label>
                      <Input
                        id="joinDate"
                        name="joinDate"
                        type="date"
                        value={userData.joinDate || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </FormGroup>
                  </FormGrid>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>Bio</CardTitle>
              </CardHeader>
              <CardContent>
                <FormGroup>
                  <Label htmlFor="bio">About Me</Label>
                  <TextArea
                    id="bio"
                    name="bio"
                    value={userData.bio || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder={isEditing ? "Write a short bio about yourself" : ""}
                    style={{ minHeight: '100px' }}
                  />
                </FormGroup>
              </CardContent>
            </Card>
          </div>
        </ProfileGrid>
      </Container>
    </ComponentGate>
  );
}