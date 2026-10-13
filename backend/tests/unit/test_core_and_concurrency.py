"""
Unit tests for core utilities, decorators, generators, context managers, and concurrency.
"""

import pytest
import asyncio
from app.core.decorators import measure_execution_time, validate_positive_income
from app.core.context_managers import PerformanceTimer
from app.core.generators import financial_record_generator, chunked_record_iterator
from app.concurrency.async_service import fetch_parallel_async, simulate_async_db_fetch
from app.concurrency.thread_pool import parallel_module_retrieval
from app.repositories.firestore_repository import FirestoreRepository


def test_measure_execution_time_decorator():
    @measure_execution_time
    def sample_fn():
        return {"data": 123}

    res = sample_fn()
    assert res["data"] == 123
    assert "_execution_time_ms" in res


def test_validate_positive_income_decorator():
    @validate_positive_income
    def calc_income(amount: float):
        return amount * 2

    assert calc_income(50.0) == 100.0
    with pytest.raises(ValueError):
        calc_income(-10.0)


def test_performance_timer_context_manager():
    with PerformanceTimer("test_block") as timer:
        x = sum(range(1000))
    assert timer.elapsed_time_ms >= 0.0


def test_financial_record_generator():
    records = [
        {"id": "1", "amount": 100, "category": "Food"},
        {"id": "2", "amount": -50, "category": "Invalid"},  # Should be skipped
        {"id": "3", "amount": 200, "category": "Tech"}
    ]
    gen = list(financial_record_generator(records))
    assert len(gen) == 2
    assert gen[0]["name"] == "Record"


def test_chunked_record_iterator():
    records = [{"id": str(i)} for i in range(12)]
    chunks = list(chunked_record_iterator(records, chunk_size=5))
    assert len(chunks) == 3
    assert len(chunks[0]) == 5
    assert len(chunks[2]) == 2


def test_async_service():
    async def _test():
        async def sample_coro(val):
            await asyncio.sleep(0.001)
            return val * 2

        results = await fetch_parallel_async([sample_coro(5), sample_coro(10)])
        assert results == [10, 20]

        sim_res = await simulate_async_db_fetch("income", "u1")
        assert sim_res == []

    asyncio.run(_test())


def test_thread_pool_retrieval():
    def fetch_inc():
        return [{"id": "inc1", "amount": 5000}]

    def fetch_exp():
        return [{"id": "exp1", "amount": 2000}]

    results = parallel_module_retrieval({"income": fetch_inc, "expenses": fetch_exp})
    assert len(results["income"]) == 1
    assert len(results["expenses"]) == 1


def test_repository_in_memory_fallback():
    async def _test():
        repo = FirestoreRepository()
        user_id = "test_repo_user"

        # Create
        created = await repo.create("test_col", user_id, {"name": "Test Record", "amount": 100})
        rec_id = created["id"]
        assert rec_id is not None

        # Get by ID
        item = await repo.get_by_id("test_col", user_id, rec_id)
        assert item is not None
        assert item["name"] == "Test Record"

        # Get All
        all_items = await repo.get_all("test_col", user_id)
        assert len(all_items) == 1

        # Update
        updated = await repo.update("test_col", user_id, rec_id, {"name": "Updated Record", "amount": 200})
        assert updated["name"] == "Updated Record"

        # Delete
        deleted = await repo.delete("test_col", user_id, rec_id)
        assert deleted is True

        # Confirm deleted
        assert await repo.get_by_id("test_col", user_id, rec_id) is None

    asyncio.run(_test())
