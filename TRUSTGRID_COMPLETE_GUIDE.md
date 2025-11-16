# TrustGrid Complete Developer Guide

## 🛡️ What is TrustGrid?

TrustGrid is Nigeria's AI-powered privacy compliance platform that enables organizations to request citizen data while ensuring NDPR (Nigeria Data Protection Regulation) compliance. It provides automated consent management, audit trails, and transparency for both businesses and citizens.

## 🏗️ System Architecture

```
Organization → TrustGrid SDK → AI Compliance Check → Citizen Consent → Data Access
```

### Key Components:
1. **TrustGrid SDK** - For organizations to request data
2. **AI Compliance Engine** - Validates requests against privacy policies
3. **Citizen App** - For citizens to manage consent preferences
4. **Audit System** - Immutable logs of all data requests

---

## 🚀 Getting Started

### Step 1: Organization Registration

Organizations must register and get verified before accessing citizen data.

#### Frontend Registration:
1. Visit the TrustGrid Console
2. Register your organization with basic details
3. Receive an API key (store it securely - shown only once)

#### API Registration:
```bash
curl -X POST https://trust-grid.onrender.com/api/v1/org/register \
  -H "Content-Type: application/json" \
  -d '{"org_name": "Your Company Name"}'
```

**Response:**
```json
{
  "organization": {
    "_id": "org_id_here",
    "org_name": "Your Company Name",
    "verification_status": "unverified"
  },
  "api_key": "tg_live_your_api_key_here"
}
```

### Step 2: Organization Verification

Before requesting data, organizations must be verified with:
- Company description
- Business registration number
- CAC certificate
- Privacy policy
- Data collection practices

**Status:** `unverified` → `verified` (required for data requests)

---

## 📦 TrustGrid SDK Installation & Usage

### Installation

```bash
# Python SDK
pip install requests  # TrustGrid SDK uses requests

# Or use the included TGA SDK
git clone https://github.com/your-repo/trustgrid
cd trustgrid/backend/tga-sdk
```

### Basic Usage

```python
from tga import TrustGridClient

# Initialize with your API key
client = TrustGridClient(
    api_key="tg_live_your_api_key_here",
    base_url="https://trust-grid.onrender.com"
)

# Request citizen data
response = client.request_data_access(
    user_id="citizen_username",
    data_type="email",  # or "phone", "bvn", "nin", etc.
    purpose="Account verification"
)

print(f"Status: {response['status']}")
print(f"Request ID: {response['request_id']}")
```

### Manual HTTP Requests

```python
import requests

headers = {
    "X-API-Key": "tg_live_your_api_key_here",
    "Content-Type": "application/json"
}

data = {
    "user_id": "citizen_username",
    "data_type": "email",
    "purpose": "Marketing communications"
}

response = requests.post(
    "https://trust-grid.onrender.com/api/v1/request-data",
    json=data,
    headers=headers
)
```

---

## 🔍 AI Compliance Engine

TrustGrid's AI analyzes every data request for NDPR compliance:

### Data Minimization Rules:
- **Fintech/Healthcare**: Can request BVN, NIN + basic data
- **Other Industries**: Limited to basic data (name, email, phone)
- **Purpose Validation**: AI checks if data type matches stated purpose

### AI Decision Process:
1. **Policy Analysis**: Checks organization's privacy policy
2. **Data Minimization**: Validates data type against industry standards
3. **Purpose Alignment**: Ensures purpose matches data type
4. **Compliance Score**: Generates approval/rejection with reasoning

---

## 📊 Response Status Codes & Meanings

### HTTP Status Codes

#### 🟢 200/202 - Success
```json
{
  "status": "auto_approved",
  "message": "Request auto-approved",
  "request_id": "request_id_here",
  "ai_reason": "Compliant with NDPR data minimization",
  "data": "citizen@example.com"
}
```

#### 🔴 401 - Unauthorized
**Causes:**
- Invalid API key
- Expired API key
- Missing `X-API-Key` header

```json
{"detail": "Invalid or expired API Key"}
```

**Fix:** Check your API key and ensure it's in the `X-API-Key` header.

#### 🟡 403 - Forbidden
**Causes:**
- Organization not verified
- AI compliance violation
- Data minimization failure

```json
{"detail": "COMPLIANCE VIOLATION: Your organization is not verified"}
```

```json
{"detail": "COMPLIANCE VIOLATION: Requesting BVN not justified for E-commerce"}
```

**Fix:** Complete organization verification or adjust data request to comply with NDPR.

#### 🔴 404 - Not Found
```json
{"detail": "User 'username' not found"}
```

**Fix:** Ensure the citizen username exists in the system.

---

## 👤 Citizen Consent Management

### Citizen Registration

Citizens must register and complete their profile:

```python
# Citizen registration
response = requests.post(
    "https://trust-grid.onrender.com/api/v1/citizen/register",
    json={"username": "citizen_name", "password": "secure_password"}
)

# Profile completion (required for data requests)
profile_data = {
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+2348012345678",
    "manual_approval_required": False  # Key setting!
}

requests.put(
    f"https://trust-grid.onrender.com/api/v1/citizen/{username}/profile",
    json=profile_data
)
```

### Consent Preferences

Citizens can choose their consent model:

#### Auto-Approval (Default)
- `manual_approval_required: false`
- AI-compliant requests are automatically approved
- Data returned immediately to organization

#### Manual Approval
- `manual_approval_required: true`
- All requests require explicit citizen approval
- Citizen receives notification to approve/deny

### Manual Approval Process

When `manual_approval_required: true`:

1. **Organization Request**: SDK call returns `status: "pending"`
2. **Citizen Notification**: Request appears in citizen app
3. **Citizen Decision**: Approve or deny the request
4. **Organization Polling**: Check request status periodically

```python
# Check request status
response = requests.get(
    f"https://trust-grid.onrender.com/api/v1/request-status/{request_id}",
    headers={"X-API-Key": "your_api_key"}
)

# Possible statuses: "pending", "approved", "denied", "auto_approved"
```

---

## 🔄 Complete Data Request Flow

### Scenario 1: Auto-Approved Request

```python
# 1. Organization makes request
response = client.request_data_access(
    user_id="john_doe",
    data_type="email",
    purpose="Account verification"
)

# 2. Immediate response (if AI approves + auto-approval enabled)
{
  "status": "auto_approved",
  "data": "john@example.com",
  "request_id": "req_123",
  "ai_reason": "Email request for account verification is NDPR compliant"
}
```

### Scenario 2: Manual Approval Required

```python
# 1. Organization makes request
response = client.request_data_access(
    user_id="jane_doe",  # Has manual_approval_required: true
    data_type="phone",
    purpose="SMS notifications"
)

# 2. Pending response
{
  "status": "pending",
  "request_id": "req_456",
  "message": "AI analysis passed. Awaiting user approval.",
  "ai_reason": "Phone request compliant, pending user consent"
}

# 3. Organization polls for status
status_response = requests.get(
    f"https://trust-grid.onrender.com/api/v1/request-status/req_456",
    headers={"X-API-Key": "your_api_key"}
)

# 4. After citizen approves
{
  "status": "approved",
  "data": "+2348012345678",
  "message": "Data access granted"
}
```

### Scenario 3: AI Rejection

```python
# Organization requests excessive data
response = client.request_data_access(
    user_id="user123",
    data_type="bvn",  # Sensitive financial data
    purpose="Marketing"  # Not justified
)

# AI rejects immediately
# HTTP 403 Forbidden
{
  "detail": "COMPLIANCE VIOLATION: BVN access not justified for marketing purposes. Consider requesting email instead."
}
```

---

## 📋 Audit & Transparency

### Organization Audit Logs

```python
# Get all requests made by your organization
logs = requests.get(
    "https://trust-grid.onrender.com/api/v1/org/log",
    headers={"X-API-Key": "your_api_key"}
)

# Response: List of all data requests with status, timestamps, AI reasoning
```

### Citizen Transparency

```python
# Citizens can view all requests made for their data
logs = requests.get(
    f"https://trust-grid.onrender.com/api/v1/citizen/{username}/log"
)

# Shows: organization name, data requested, purpose, approval method, timestamp
```

---

## 🔧 API Reference

### Base URL
```
Production: https://trust-grid.onrender.com
```

### Authentication
All organization endpoints require the `X-API-Key` header:
```
X-API-Key: tg_live_your_api_key_here
```

### Key Endpoints

#### Organization Endpoints
- `POST /api/v1/org/register` - Register organization
- `POST /api/v1/org/submit-for-verification` - Submit for verification
- `GET /api/v1/org/me` - Get organization details
- `POST /api/v1/request-data` - Request citizen data
- `GET /api/v1/request-status/{id}` - Check request status
- `GET /api/v1/org/log` - Get audit logs

#### Citizen Endpoints
- `POST /api/v1/citizen/register` - Register citizen
- `POST /api/v1/citizen/login` - Citizen login
- `PUT /api/v1/citizen/{id}/profile` - Update profile
- `GET /api/v1/citizen/{id}/requests` - Get pending requests
- `POST /api/v1/citizen/respond` - Approve/deny request
- `GET /api/v1/citizen/{id}/log` - Get transparency log

---

## 🚨 Common Issues & Solutions

### Issue: 401 Unauthorized
**Problem:** Invalid API key
**Solution:** 
1. Check API key format: `tg_live_...`
2. Ensure `X-API-Key` header is set
3. Verify organization is registered

### Issue: 403 Forbidden - Not Verified
**Problem:** Organization not verified
**Solution:** Complete verification process with CAC certificate and privacy policy

### Issue: 403 Forbidden - Compliance Violation
**Problem:** AI rejected request for NDPR non-compliance
**Solution:** 
1. Review data minimization principles
2. Adjust data type or purpose
3. Update privacy policy if needed

### Issue: 404 User Not Found
**Problem:** Citizen doesn't exist
**Solution:** Ensure citizen has registered and completed profile

### Issue: Request Stuck in Pending
**Problem:** Citizen hasn't responded to manual approval
**Solution:** 
1. Check if citizen has `manual_approval_required: true`
2. Notify citizen to check their app
3. Consider timeout policies

---

## 🎯 Best Practices

### For Organizations:
1. **Data Minimization**: Only request data you actually need
2. **Clear Purposes**: Be specific about why you need the data
3. **Regular Audits**: Monitor your compliance logs
4. **Proper Verification**: Complete verification before going live

### For Citizens:
1. **Profile Completion**: Fill out complete profile for better service
2. **Consent Preferences**: Choose auto vs manual approval based on your comfort
3. **Regular Reviews**: Check transparency logs periodically
4. **Prompt Responses**: Respond to manual approval requests quickly

### For Developers:
1. **Error Handling**: Implement proper error handling for all status codes
2. **Polling Strategy**: Use exponential backoff for status checking
3. **Secure Storage**: Never log or store API keys in code
4. **Testing**: Test with both auto and manual approval scenarios

---

## 📞 Support & Resources

- **API Documentation**: `/docs` endpoint on the API
- **Status Page**: Check API health at `/health`
- **GitHub**: [TrustGrid Repository](https://github.com/your-repo/trustgrid)
- **Email**: developers@trustgrid.ng

---

## 🔐 Security & Privacy

- All API communications use HTTPS/TLS
- API keys use SHA256 hashing
- User passwords use SHA256 hashing
- Audit logs are immutable
- No PII is logged in system logs
- Citizens have full transparency and control

---

*This guide covers the complete TrustGrid ecosystem. For specific implementation questions, refer to the API documentation or contact support.*