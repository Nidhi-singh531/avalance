import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PetsContext } from './context/PetsContext';
import { motion } from 'framer-motion';
import { useContract } from './context/ContractContext'; // <-- import contract context
import { ethers } from 'ethers';

export default function Adoption() {
  const { pets, deletePet } = useContext(PetsContext);
  const { contract, account } = useContract(); // <-- get contract and account
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [status, setStatus] = useState('');

  // -------------------------------
  // Blockchain adoption function
  // -------------------------------
  const adoptPetOnChain = async (petId) => {
    if (!contract || !account) {
      alert('Connect your wallet first!');
      return;
    }

    try {
      const donation = ethers.utils.parseEther("0.01"); // example 0.01 ETH donation
      const tx = await contract.adoptPet(petId, { value: donation });
      await tx.wait();
      alert(`Pet ${petId} adopted successfully!`);
    } catch (err) {
      console.error(err);
      alert('Adoption failed, check console for details.');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      deletePet(id);
    }
  };

  // Filter pets based on search and filters
  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.shelter.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Better animal type detection based on pet names and photos
    let petType = 'Other';
    if (pet.photo.includes('dog') || 
        ['buddy', 'mittens', 'luna', 'daisy', 'molly'].includes(pet.name.toLowerCase())) {
      petType = 'Dog';
    } else if (pet.photo.includes('cat') || 
               ['charlie', 'oliver', 'max'].includes(pet.name.toLowerCase())) {
      petType = 'Cat';
    } else if (pet.photo.includes('bird')) {
      petType = 'Bird';
    }
    
    const matchesAnimalType = animalType === '' || animalType === 'Animal Type' || animalType === petType;
    const matchesStatus = status === '' || status === 'Status' || status === 'Available'; // All pets are available for now
    
    return matchesSearch && matchesAnimalType && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setAnimalType('');
    setStatus('');
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header, Filters, Pet Grid, FAQ Section remain unchanged */}
        {/* ... (all your existing code above) ... */}

        {/* Pet Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
          padding: "0"
        }}>
          {filteredPets.map(pet => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #e2e8f0",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onClick={() => navigate(`/pet/${pet.id}`)}
            >
              {/* Pet Image */}
              <div style={{ 
                position: "relative",
                height: "200px",
                overflow: "hidden"
              }}>
                <img
                  src={pet.photo}
                  alt={pet.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Pet Info */}
              <div style={{ padding: "1.25rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#2d3748", marginBottom: "0.5rem" }}>
                  {pet.name}
                </h3>
                <p style={{ color: "#718096", fontSize: "0.9rem", marginBottom: "1rem" }}>
                  {pet.shelter}
                </p>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      adoptPetOnChain(pet.id); // <-- blockchain adoption
                    }}
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      cursor: "pointer"
                    }}
                  >
                    Adopt
                  </motion.button>

                  {pet.adminAdded && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(pet.id);
                      }}
                      style={{
                        background: "#fed7d7",
                        color: "#c53030",
                        border: "none",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        fontSize: "0.875rem",
                        cursor: "pointer"
                      }}
                    >
                      ×
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Your empty states and FAQ Section remain unchanged */}
      </div>
    </div>
  );
}

// FAQItem component remains unchanged
function FAQItem({ question, answer, isOpen: initialOpen }) {
  const [isOpen, setIsOpen] = React.useState(initialOpen);
  return (
    <div style={{
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      overflow: "hidden",
      background: "#ffffff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "1.5rem 2rem",
          border: "none",
          background: "transparent",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "1.2rem",
          fontWeight: "600",
          color: "#2d3748"
        }}
      >
        <span>{question}</span>
        <span style={{
          fontSize: "1.5rem",
          color: "#3b82f6",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
        }}>
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && <div style={{ padding: "0 2rem 1.5rem 2rem", borderTop: "1px solid #f1f5f9", background: "#fafafa" }}>
        <p style={{ margin: 0, color: "#718096", lineHeight: "1.7", fontSize: "1.05rem" }}>{answer}</p>
      </div>}
    </div>
  );
}
