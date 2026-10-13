import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    dbname=os.getenv("DB_NAME")
)


def get_tourist_by_id(tourist_id):

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
        name,
        description,
        timings,
        best_season,
        ai_context
        FROM touristsite
        WHERE tourist_id=%s
        """,
        [tourist_id]
    )

    return cursor.fetchone()

def get_place_city(tourist_id):

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT address
        FROM touristsite
        WHERE tourist_id=%s
        """,
        [tourist_id]
    )

    row = cursor.fetchone()

    return row[0] if row else None

def get_booking_count():

    cursor = conn.cursor()

    cursor.execute("""
    SELECT COUNT(*)
    FROM booking
    WHERE booking_status='Booked'
    """)

    result = cursor.fetchone()

    return result[0]

def slots_left(place):

    cursor = conn.cursor()

    cursor.execute("""
    SELECT
    t.name,
    t.max_daily_capacity,
    COALESCE(
        SUM(b.number_of_people),
        0
    )
    FROM touristsite t
    LEFT JOIN booking b
    ON
    t.tourist_id=b.tourist_id
    AND b.booking_status='Booked'
    WHERE LOWER(t.name)
    LIKE LOWER(%s)
    GROUP BY
    t.name,
    t.max_daily_capacity
    """,
    [f"%{place}%"])

    row = cursor.fetchone()

    if not row:
        return None

    return {
        "name":row[0],
        "capacity":row[1],
        "booked":row[2],
        "remaining":
        row[1]-row[2]
    }