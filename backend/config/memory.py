# memory.py

import psycopg2
from psycopg2 import pool
from dotenv import load_dotenv
import os
import threading

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

if not all([DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME]):
    raise RuntimeError("❌ One or more DB environment variables are missing!")

# ✅ Create a small connection pool instead of a single connection
db_pool = psycopg2.pool.SimpleConnectionPool(
    1, 5,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT,
    database=DB_NAME
)


class MemoryStore:
    _lock = threading.Lock()

    @classmethod
    def _get_connection(cls):
        """Get a connection safely from the pool."""
        with cls._lock:
            if not db_pool:
                raise RuntimeError("Database connection pool is not initialized")
            return db_pool.getconn()

    @classmethod
    def _release_connection(cls, conn):
        """Release connection back to pool."""
        if conn:
            db_pool.putconn(conn)

    @classmethod
    def save_message(cls, user_id: str, role: str, message: str):
        conn = None
        try:
            conn = cls._get_connection()
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO conversation_memory (user_id, role, message)
                    VALUES (%s, %s, %s)
                    """,
                    (user_id, role, message)
                )
            conn.commit()
        except Exception as e:
            print(f"❌ Error saving message: {e}")
        finally:
            cls._release_connection(conn)

    @classmethod
    def get_history(cls, user_id: str, limit: int = 50):
        conn = None
        try:
            conn = cls._get_connection()
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT user_id, role, message, created_at
                    FROM conversation_memory
                    WHERE user_id = %s
                    ORDER BY created_at ASC
                    LIMIT %s
                    """,
                    (user_id, limit)
                )
                rows = cur.fetchall()
            return rows
        except Exception as e:
            print(f"❌ Error fetching history: {e}")
            return []
        finally:
            cls._release_connection(conn)
