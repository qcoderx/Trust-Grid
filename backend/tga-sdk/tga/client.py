import requests
from typing import Optional, Dict, Any, List
from pydantic import BaseModel

class Organization(BaseModel):
    id: str
    org_name: str
    verification_status: str
    # Add other fields as needed

class ApiKey(BaseModel):
    id: str
    name: str
    status: str
    created_date: str
    # Add other fields as needed

class TrustGridClient:
    def __init__(self, api_key: str, base_url: str = "http://localhost:8000"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({"Authorization": f"Bearer {api_key}"})

    def _post(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        response = self.session.post(url, json=data)
        response.raise_for_status()
        return response.json()

    def _get(self, endpoint: str) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()

    def register_organization(self, org_name: str) -> Organization:
        data = {"org_name": org_name}
        response = self._post("/api/v1/org/register", data)
        return Organization(**response["organization"])

    def request_data_access(self, user_id: str, data_type: str, purpose: str) -> Dict[str, Any]:
        data = {"user_id": user_id, "data_type": data_type, "purpose": purpose}
        return self._post("/api/v1/request-data", data)

    def get_api_keys(self) -> List[ApiKey]:
        response = self._get("/api/v1/org/api-keys")
        return [ApiKey(**key) for key in response]

    def create_api_key(self, name: str) -> Dict[str, Any]:
        data = {"name": name}
        return self._post("/api/v1/org/api-keys", data)

    def revoke_api_key(self, key_id: str) -> Dict[str, Any]:
        return self._post(f"/api/v1/org/api-keys/{key_id}/revoke", {})

    # Add more methods as needed for other endpoints
