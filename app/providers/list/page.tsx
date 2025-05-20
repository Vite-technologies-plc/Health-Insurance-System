// "use client";

// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import { Edit, Trash2 } from "lucide-react";

// const Container = styled.div`
//   max-width: 1200px;
//   margin: 0 auto;
//   padding: 24px;
// `;

// const Header = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 2rem;
//   padding-bottom: 1rem;
//   border-bottom: 1px solid #e2e8f0;
// `;

// const Title = styled.h1`
//   font-size: 1.75rem;
//   font-weight: 600;
//   color: #1e293b;
// `;

// const Table = styled.table`
//   width: 100%;
//   border-collapse: collapse;
//   margin-top: 24px;
// `;

// const TableHead = styled.th`
//   background: #f5f5f5;
//   padding: 12px;
//   text-align: left;
//   border-bottom: 2px solid #e2e8f0;
// `;

// const TableRow = styled.tr``;
// const TableCell = styled.td`
//   padding: 12px;
//   border-bottom: 1px solid #e2e8f0;
// `;

// const ActionButtons = styled.div`
//   display: flex;
//   gap: 8px;
// `;

// const EditButton = styled.button`
//   display: flex;
//   align-items: center;
//   gap: 4px;
//   background: #fff;
//   color: #00AA00;
//   border: 2px solid #00AA00;
//   border-radius: 8px;
//   padding: 6px 18px;
//   font-weight: 500;
//   cursor: pointer;
//   transition: background 0.2s, color 0.2s;
//   &:hover {
//     background: #00AA00;
//     color: #fff;
//   }
// `;

// const DeleteButton = styled.button`
//   display: flex;
//   align-items: center;
//   gap: 4px;
//   background: #FF0000;
//   color: #fff;
//   border: 2px solid #FF0000;
//   border-radius: 8px;
//   padding: 6px 18px;
//   font-weight: 500;
//   cursor: pointer;
//   transition: background 0.2s, color 0.2s;
//   &:hover {
//     background: #fff;
//     color: #FF0000;
//   }
// `;

// interface Provider {
//   id: string;
//   name: string;
//   facilityType?: string;
//   email?: string;
//   phone?: string;
// }

// const ProvidersListPage: React.FC = () => {
//   const [providers, setProviders] = useState<Provider[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProviders = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch("http://localhost:3000/providers", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: "application/json",
//           },
//         });
//         if (!response.ok) {
//           throw new Error("Failed to fetch providers");
//         }
//         const data = await response.json();
//         // Map the data to match your table columns if needed
//         const mappedProviders = data.map((provider: any) => ({
//           id: provider.id,
//           name: provider.name || provider.facilityName || provider.username,
//           facilityType: provider.facilityType,
//           email: provider.email,
//           phone: provider.phone || provider.phoneNumber,
//         }));
//         setProviders(mappedProviders);
//       } catch (err: any) {
//         setError(err.message || "Could not load providers.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProviders();
//   }, []);

//   return (
//     <Container>
//       <Header>
//         <Title>All Providers</Title>
//       </Header>
//       {loading ? (
//         <div>Loading...</div>
//       ) : error ? (
//         <div style={{ color: "red" }}>{error}</div>
//       ) : (
//         <Table>
//           <thead>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Facility Type</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Phone</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </thead>
//           <tbody>
//             {providers.length > 0 ? (
//               providers.map((provider) => (
//                 <TableRow key={provider.id}>
//                   <TableCell>{provider.name}</TableCell>
//                   <TableCell>{provider.facilityType || '-'}</TableCell>
//                   <TableCell>{provider.email || '-'}</TableCell>
//                   <TableCell>{provider.phone || '-'}</TableCell>
//                   <TableCell>
//                     <ActionButtons>
//                       <EditButton>
//                         <Edit size={16} />
//                         Edit
//                       </EditButton>
//                       <DeleteButton>
//                         <Trash2 size={16} />
//                         Delete
//                       </DeleteButton>
//                     </ActionButtons>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={5}>No providers found.</TableCell>
//               </TableRow>
//             )}
//           </tbody>
//         </Table>
//       )}
//     </Container>
//   );
// };

// export default ProvidersListPage;
"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Trash2 } from "lucide-react";

// Styled Components
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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ff0000;
  color: #fff;
  border: 2px solid #ff0000;
  border-radius: 8px;
  padding: 6px 18px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #fff;
    color: #ff0000;
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 1.5rem;
`;
const ModalButton = styled.button<{ variant: "confirm" | "cancel" }>`
  padding: 8px 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid;

  background: ${(props) =>
    props.variant === "confirm" ? "#ff0000" : "#ffffff"};
  color: ${(props) =>
    props.variant === "confirm" ? "#ffffff" : "#00aa00"};
  border-color: ${(props) =>
    props.variant === "confirm" ? "#ff0000" : "#00aa00"};

  &:hover {
    background: ${(props) =>
      props.variant === "confirm" ? "#ffffff" : "#00aa00"};
    color: ${(props) =>
      props.variant === "confirm" ? "#ff0000" : "#ffffff"};
  }
`;

interface Provider {
  id: string;
  name: string;
  facilityType?: string;
  email?: string;
  phone?: string;
}

const ProvidersListPage: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<Provider | null>(
    null
  );

  const fetchProviders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/providers", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch providers");
      }

      const data = await response.json();

      const mappedProviders = data.map((provider: any) => ({
        id: provider.id,
        name: provider.name || provider.facilityName || provider.username,
        facilityType: provider.facilityType,
        email: provider.email,
        phone: provider.phone || provider.phoneNumber,
      }));

      setProviders(mappedProviders);
    } catch (err: any) {
      setError(err.message || "Could not load providers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const openModal = (provider: Provider) => {
    setProviderToDelete(provider);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setProviderToDelete(null);
  };

  const confirmDelete = async () => {
    if (!providerToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/providers/${providerToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + (errorData.message || "Failed to delete provider."));
        return;
      }

      closeModal();
      fetchProviders();
    } catch (err) {
      alert("Network or server error. Please try again.");
    }
  };

  return (
    <Container>
      <Header>
        <Title>All Providers</Title>
      </Header>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <Table>
          <thead>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Facility Type</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </thead>
          <tbody>
            {providers.length > 0 ? (
              providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>{provider.name}</TableCell>
                  <TableCell>{provider.facilityType || "-"}</TableCell>
                  <TableCell>{provider.email || "-"}</TableCell>
                  <TableCell>{provider.phone || "-"}</TableCell>
                  <TableCell>
                    <ActionButtons>
                      <DeleteButton onClick={() => openModal(provider)}>
                        <Trash2 size={16} />
                        Delete
                      </DeleteButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No providers found.</TableCell>
              </TableRow>
            )}
          </tbody>
        </Table>
      )}

      {/* Confirmation Modal */}
      {modalOpen && providerToDelete && (
        <ModalOverlay>
          <ModalBox>
            <p>
              Are you sure you want to delete <strong>{providerToDelete.name}</strong>?
              <br />
              This action cannot be undone.
            </p>
            <ModalButtons>
              <ModalButton variant="cancel" onClick={closeModal}>
                Cancel
              </ModalButton>
              <ModalButton variant="confirm" onClick={confirmDelete}>
                Yes, Delete
              </ModalButton>
            </ModalButtons>
          </ModalBox>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default ProvidersListPage;
