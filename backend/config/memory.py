# memory.py

import psycopg2
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
    raise RuntimeError("One or more DB env vars are missing")

class MemoryStore:
    _lock = threading.Lock()
    _connection = None

    @classmethod
    def _get_connection(cls):
        if cls._connection is None:
            with cls._lock:
                if cls._connection is None:
                    cls._connection = psycopg2.connect(
                        user=DB_USER,
                        password=DB_PASSWORD,
                        host=DB_HOST,
                        port=DB_PORT,
                        dbname=DB_NAME
                    )
        return cls._connection

    @classmethod
    def save_message(cls, user_id: str, role: str, message: str):
        conn = cls._get_connection()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO conversation_memory (user_id, role, message) VALUES (%s, %s, %s)",
                (user_id, role, message)
            )
            conn.commit()

    @classmethod
    def get_history(cls, user_id: str, limit: int = 50):
        conn = cls._get_connection()
        with conn.cursor() as cur:
            cur.execute(
                "SELECT user_id, role, message, created_at FROM conversation_memory WHERE user_id = %s ORDER BY created_at ASC LIMIT %s",
                (user_id, limit)
            )
            rows = cur.fetchall()
        return rows
