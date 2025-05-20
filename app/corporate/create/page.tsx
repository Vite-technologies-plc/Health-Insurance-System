"use client";
import React from "react";
import styled from "styled-components";
import Sidebar from '../../common/Sidebar';
import Header from '../../common/Header';
import CorporateRegister from '../../components/CoopratorRegister';

const ContentWrapper = styled.div`
  margin-left: 25px; /* Sidebar width */
  padding-top: 36px;  /* Header height */
  padding-right:31px;
  min-height: 100vh;
  background: #f7f8fa;
`;

export default function Page() {
  return (
    <>
      <Sidebar />
      <Header />
      <ContentWrapper>
        <CorporateRegister />
      </ContentWrapper>
    </>
  );
} 