'use client';
import React from 'react';
import CompanyRegister from '../../components/CompanyRegister';

const getInitials = (name?: string) => {
  if (!name || typeof name !== 'string') return '';
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export default function InsuranceCreatePage() {
  return <CompanyRegister />;
} 