"""
Repository Design Pattern Interface.
Abstracts data access logic from business logic.
"""

from abc import ABC, abstractmethod
from typing import Any


class BaseRepository(ABC):
    """
    Abstract Base Repository interface.
    """

    @abstractmethod
    async def get_all(self, collection_name: str, user_id: str) -> list[dict[str, Any]]:
        pass

    @abstractmethod
    async def get_by_id(
        self, collection_name: str, user_id: str, record_id: str
    ) -> dict[str, Any] | None:
        pass

    @abstractmethod
    async def create(
        self, collection_name: str, user_id: str, data: dict[str, Any]
    ) -> dict[str, Any]:
        pass

    @abstractmethod
    async def update(
        self, collection_name: str, user_id: str, record_id: str, data: dict[str, Any]
    ) -> dict[str, Any]:
        pass

    @abstractmethod
    async def delete(self, collection_name: str, user_id: str, record_id: str) -> bool:
        pass
