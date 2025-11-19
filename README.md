# herbX

herbX is a permissioned blockchain platform built on **Hyperledger Fabric** with integrated **smart contracts** and **AI-based herb classification**, designed to provide transparent, tamper-proof traceability of Ayurvedic herbs — from collection to final formulation.

It solves long-standing trust, quality, and transparency gaps in the herbal supply chain by ensuring every step is recorded immutably and validated with automated logic.

---

## Overview

The Ayurvedic herbs ecosystem suffers from adulteration, unreliable quality assessment, opaque sourcing, manual paperwork, and broken chain-of-custody. herbX introduces a unified, secure, and verifiable system where every participant interacts through a transparent blockchain layer backed by AI classification models.

From initial collection to lab testing to manufacturing, each step is tracked via smart contracts that enforce rules, ensure role-based permissions, and record events immutably.

---

## Problem the Platform Solves

Different actors face different bottlenecks. herbX addresses each one:

### **Farmers & Wild Collectors**
- Unfair pricing due to lack of transparent quality evaluation.
- No verifiable record of origin or authenticity.
- Difficulty proving ethical, legal, and sustainable sourcing.

### **Processors & Laboratories**
- Delays and inconsistencies in lab testing and verification.
- Paper-based workflows that break chain-of-custody.
- No unified ledger to track sample movement or validation.

### **Manufacturers & Exporters**
- Difficulty verifying raw material authenticity.
- High risk from adulterated or low-grade herbs.
- Lack of end-to-end visibility across suppliers.

### **Regulators**
- Fragmented and delayed data.
- No real-time view into sourcing, testing, and logistics.
- Hard to detect fraud or illegal harvesting practices.

### **Consumers**
- Cannot verify origin or quality.
- Low trust due to adulteration risks.
- No easy way to trace the herb journey from soil to shelf.

---

## Solution

herbX combines **blockchain + smart contracts + AI** to provide:

- **Permissioned Hyperledger Fabric network** ensuring secure, role-based access.
- **Immutable provenance tracking** for origin, collection, transport, testing, and processing.
- **AI-based herb classification** for identity & quality validation.
- **Smart contracts** that automate:
  - batch registration  
  - custody transfers  
  - lab verification  
  - risk and fraud detection  
  - rule enforcement  
- **End-to-end traceability** visible to all authorized participants.

The result is a transparent, fraud-resistant, and auditable digital supply chain.

---

## Key Features

- 🔐 **Permissioned blockchain** for secure multi-stakeholder collaboration.  
- 📜 **Immutable ledger** recording every lifecycle event of each herb batch.  
- 🤖 **AI classification module** to validate herb samples and reduce fraud.  
- 🔁 **Smart contracts** governing provenance, workflow, verification, and access rules.  
- 🔍 **End-to-end traceability** from field collection to final product formulation.  
- 🧾 **Digital documents & certificates** linked cryptographically to blockchain records.  
- 💡 **Tamper-proof audit history** for regulators and quality controllers.  
- 🛡️ **Counterfeit prevention** using secure identity and provenance proofs.

---

## Technology Stack

- **Hyperledger Fabric** – permissioned blockchain framework  
- **Chaincode (Smart Contracts)** – Go/Node.js  
- **AI Model** – Classification service (Python + ML framework)  
- **Backend API** – Node.js/Express (or matching repo structure)  
- **Storage** – Fabric ledger + optional off-chain DB for metadata  
- **Client Apps** – CLI tools, dashboards, or integration scripts  

---

## Repository Structure 

Depending on your repo content (adjust as needed):
herbX/
├── chaincode/ # Smart contracts for provenance, custody, validation
├── ai/ # AI classification model + inference service
├── api/ # Backend API integrating Fabric ledger & AI logic
├── network/ # Hyperledger Fabric network configs (peers, orgs, channels)
├── scripts/ # Automation scripts for setup, deployment, teardown
├── docs/ # Technical documentation and architecture notes
└── tests/ # Unit and integration tests for API, chaincode, and AI
---

## How It Works

1. **Collector registers herb batch**  
   → Smart contract assigns batch ID and origin metadata is recorded immutably.

2. **AI classification validates herb identity**  
   → API submits the classification result to Fabric for sealing.

3. **Processors update batch status**  
   → cleaning, drying, grading, transport, storage, etc.

4. **Laboratories issue digital testing reports**  
   → purity, moisture, chemical markers, contaminants.

5. **Manufacturers verify entire provenance**  
   → ensures authenticity before using in formulations.

6. **Regulators & consumers can query sanitized traceability data**  
   → trust is restored across the entire ecosystem.

---

## Benefits

- **Transparency for all stakeholders** across the supply chain.  
- **Fraud and adulteration prevention** through immutable logging.  
- **Fair pricing** enabled by transparent quality and origin verification.  
- **Faster compliance** for regulators with real-time access.  
- **Higher export credibility** through verifiable digital certificates.  
- **Consumer trust** enabled by trace-back to authentic sources.

---

## Getting Started

### Clone the repository
```bash
git clone https://github.com/Yashbhu/herbX.git
cd herbX


