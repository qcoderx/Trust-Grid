# TGA SDK

A Python SDK for interacting with the Trust-Grid API.

## Installation

```bash
pip install tga
```

## Usage

```python
from tga import TrustGridClient

client = TrustGridClient(api_key="your-api-key")

# Example: Register an organization
org = client.register_organization("MyOrg")

# Example: Request data access
response = client.request_data_access(user_id="user123", data_type="email", purpose="marketing")
```

## API Reference

### TrustGridClient

- `register_organization(org_name)`: Register a new organization.
- `request_data_access(user_id, data_type, purpose)`: Request data access for a user.
- `get_api_keys()`: Retrieve API keys for the organization.
- `create_api_key(name)`: Create a new API key.
- `revoke_api_key(key_id)`: Revoke an API key.
