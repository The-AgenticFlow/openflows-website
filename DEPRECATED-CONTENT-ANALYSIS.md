# Deprecated Content Analysis - OpenFlows Website

## 📋 Overview
Based on comparison between current website content and the OpenFlows README, several sections contain deprecated or outdated information that needs updating.

## 🚨 **High Priority Updates Needed:**

### **1. Installation Page (`/docs/getting-started/installation.astro`)**
**Current (Deprecated):**
- Multiple installation methods (npm, one-liner, Cargo, Docker)
- `openflows-setup` wizard
- `openflows-doctor` for verification

**Should be (per README):**
```bash
# 1. Start the infrastructure stack
docker compose up -d

# 2. Bootstrap OpenFlows
cargo run -p openflows --bin openflows -- bootstrap

# 3. Add a tenant
cargo run -p openflows --bin openflows -- tenant add owner/repo --name my-team
```

### **2. Getting Started Page (`/docs/getting-started/index.astro`)**
**Current issues:**
- Missing tenant concept
- Wrong binary names and workflow
- Outdated setup process
- Missing `openflows-harness` CLI mention

### **3. Binary/CLI References**
**Deprecated:** `openflows-setup`, `openflows-dashboard`, `openflows-doctor`
**Current:** `openflows` (with flags), `openflows-harness`

### **4. Core Architecture Description**
**Website focuses on:** Coder integration, AI Gateway, Registry modules
**README emphasizes:** PocketFlow engine, SharedStore contracts, Node trait pattern, flow graph architecture

## 🎯 **Specific Changes Needed:**

### **Page 1: Installation Page**
1. **Replace installation methods** with Docker Compose approach
2. **Update setup commands** to use `cargo run -- bootstrap`
3. **Add tenant concept** explanation
4. **Update verification** to match new binary structure
5. **Remove** `openflows-setup`, `openflows-dashboard`, `openflows-doctor` references

### **Page 2: Getting Started Page**
1. **Update prerequisites** to match README
2. **Revise installation steps** to Docker Compose + bootstrap
3. **Add tenant setup** section
4. **Update model registry** explanation
5. **Clarify** PocketFlow vs Coder responsibilities

### **Page 3: FAQ Page**
1. **Update** references to deprecated binaries
2. **Clarify** tenant vs repository concept
3. **Add** PocketFlow/SharedStore explanations
4. **Update** cost/scale information

## 📊 **Content Gaps Identified:**

### **Missing from Website:**
1. **Tenant system** - core multi-tenancy concept
2. **PocketFlow engine** - the actual orchestration brain
3. **SharedStore contracts** - typed Redis schemas
4. **Node trait pattern** - `prep → exec → post` separation
5. **`openflows-harness`** - workspace Redis client
6. **Skill system** - plug-and-play extension
7. **Development workflow** - `./update-binaries.sh`

### **Outdated on Website:**
1. **Binary names** and commands
2. **Setup workflow** (TUI vs bootstrap)
3. **Architecture focus** (Coder-heavy vs balanced)
4. **Multi-tenancy** approach
5. **Extension model** (skills vs modules)

## 🔧 **Recommended Update Strategy:**

### **Phase 1: High-Impact Pages**
1. Update installation page with new Docker Compose workflow
2. Update getting started page with tenant concept
3. Update FAQ with current architecture

### **Phase 2: Architecture Pages**
1. Create new pages for PocketFlow, SharedStore, Node trait
2. Update agent roles page with current implementation
3. Add skill system documentation

### **Phase 3: Reference Updates**
1. Update all CLI command references
2. Update binary name references
3. Update configuration examples

## ⚠️ **Critical Deprecation Notes:**

1. **`openflows-setup`** → Replaced by `cargo run -- bootstrap`
2. **`openflows-doctor`** → Verification integrated into bootstrap
3. **TUI wizard** → Replaced by bootstrap + tenant commands
4. **npm/Cargo install** → Docker Compose recommended approach
5. **Standalone binaries** → Integrated into single `openflows` binary with subcommands

## 📅 **Immediate Actions:**

1. **Comment out** installation tabs with deprecated methods
2. **Add warning banners** about content being updated
3. **Create placeholder** for new installation content
4. **Update** repository references to current structure
5. **Align** terminology with README (tenant, PocketFlow, SharedStore)

**Note:** The website appears to document an earlier version of OpenFlows that had different binaries and setup process. The current README shows a more integrated, Docker Compose-based approach with tenant management.