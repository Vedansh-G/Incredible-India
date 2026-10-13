import os
import pickle
import faiss
import psycopg2

from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer

load_dotenv()

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    dbname=os.getenv("DB_NAME")
)

cursor = conn.cursor()

cursor.execute("""
SELECT *
FROM touristsite
""")

rows = cursor.fetchall()

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

documents = []

for row in rows:

    text = f"""
    Name : {row[1]}

    Category : {row[2]}

    Description : {row[3]}

    Address : {row[5]}

    Timings : {row[9]}

    Best Season : {row[10]}

    Additional Information :
    {row[11]}
    """

    documents.append(text)

embeddings = model.encode(
    documents
)

dimension = embeddings.shape[1]

index = faiss.IndexFlatL2(
    dimension
)

index.add(
    embeddings
)

faiss.write_index(
    index,
    "vector_store/tourist.index"
)

with open(
    "vector_store/docs.pkl",
    "wb"
) as f:

    pickle.dump(
        documents,
        f
    )

print(
    "Embeddings Created!"
)