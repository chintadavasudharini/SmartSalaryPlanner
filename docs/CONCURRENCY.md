# Concurrency Architecture

Python concurrency mechanisms are selected based on workload characteristics:

## 1. Workload Categorization
- **I/O-Bound Workloads**: Firestore database requests and Gemini API network calls.
- **CPU-Bound Workloads**: Heavy algorithmic analysis (DP goal optimization, Branch & Bound search).

## 2. Concurrency Mechanisms Used
1. **Asyncio (`async/await`)**: Non-blocking asynchronous I/O for FastAPI route handlers and async database streaming (`backend/app/concurrency/async_service.py`).
2. **ThreadPoolExecutor**: Concurrent parallel retrieval of independent user financial modules (Income, EMI, Household, Expenses, Savings, Investments, Goals) (`backend/app/concurrency/thread_pool.py`).
3. **Multiprocessing (`ProcessPoolExecutor`)**: Dispatches heavy CPU-bound algorithm execution across isolated CPU processes to bypass the Python Global Interpreter Lock (GIL) (`backend/app/concurrency/multi_processing.py`).
