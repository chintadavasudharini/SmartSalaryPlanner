"""
Firestore Repository Implementation.
Encapsulates all Firebase Firestore database operations ensuring per-user data isolation.
Supports fallback in-memory store for isolated testing environment.
"""

import uuid
from typing import Any

from app.repositories.base import BaseRepository

# Global in-memory storage for test/demo-less operation when Firebase Admin SDK is unconfigured
_IN_MEMORY_DB: dict[str, dict[str, dict[str, Any]]] = {}


class FirestoreRepository(BaseRepository):
    """
    Concrete Repository pattern implementation for Firebase Firestore.
    """

    def __init__(self):
        self._db = None
        # Attempt to initialize Firestore DB if credentials exist
        try:
            import firebase_admin
            from firebase_admin import firestore

            if firebase_admin._apps:
                self._db = firestore.client()
        except Exception:
            self._db = None

    async def get_all(self, collection_name: str, user_id: str) -> list[dict[str, Any]]:
        """
        Retrieves all documents belonging strictly to user_id.
        User Isolation: Filtered by user_id.
        """
        if self._db:
            try:
                docs = (
                    self._db.collection("users")
                    .document(user_id)
                    .collection(collection_name)
                    .stream()
                )
                results = []
                for d in docs:
                    item = d.to_dict()
                    item["id"] = d.id
                    results.append(item)
                return results
            except Exception:
                pass

        # Fallback to isolated memory store
        user_store = _IN_MEMORY_DB.get(user_id, {}).get(collection_name, {})
        return list(user_store.values())

    async def get_by_id(
        self, collection_name: str, user_id: str, record_id: str
    ) -> dict[str, Any] | None:
        if self._db:
            try:
                doc = (
                    self._db.collection("users")
                    .document(user_id)
                    .collection(collection_name)
                    .document(record_id)
                    .get()
                )
                if doc.exists:
                    res = doc.to_dict()
                    res["id"] = doc.id
                    return res
            except Exception:
                pass

        user_store = _IN_MEMORY_DB.get(user_id, {}).get(collection_name, {})
        return user_store.get(record_id)

    async def create(
        self, collection_name: str, user_id: str, data: dict[str, Any]
    ) -> dict[str, Any]:
        record_id = data.get("id") or str(uuid.uuid4())
        data["id"] = record_id
        data["user_id"] = user_id

        if self._db:
            try:
                self._db.collection("users").document(user_id).collection(
                    collection_name
                ).document(record_id).set(data)
                return data
            except Exception:
                pass

        if user_id not in _IN_MEMORY_DB:
            _IN_MEMORY_DB[user_id] = {}
        if collection_name not in _IN_MEMORY_DB[user_id]:
            _IN_MEMORY_DB[user_id][collection_name] = {}

        _IN_MEMORY_DB[user_id][collection_name][record_id] = data
        return data

    async def update(
        self, collection_name: str, user_id: str, record_id: str, data: dict[str, Any]
    ) -> dict[str, Any]:
        data["id"] = record_id
        data["user_id"] = user_id

        if self._db:
            try:
                self._db.collection("users").document(user_id).collection(
                    collection_name
                ).document(record_id).update(data)
                return data
            except Exception:
                pass

        if user_id in _IN_MEMORY_DB and collection_name in _IN_MEMORY_DB[user_id]:
            _IN_MEMORY_DB[user_id][collection_name][record_id] = data
        return data

    async def delete(self, collection_name: str, user_id: str, record_id: str) -> bool:
        if self._db:
            try:
                self._db.collection("users").document(user_id).collection(
                    collection_name
                ).document(record_id).delete()
                return True
            except Exception:
                pass

        if user_id in _IN_MEMORY_DB and collection_name in _IN_MEMORY_DB[user_id]:
            _IN_MEMORY_DB[user_id][collection_name].pop(record_id, None)
            return True
        return False
