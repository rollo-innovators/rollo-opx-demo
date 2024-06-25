import lancedb
import pandas as pd
import pyarrow as pa
from langchain_openai import OpenAIEmbeddings


class VectorStore:
    def __init__(self):
        self.db = lancedb.connect('data/vector_store')
        self.embeddings_model = OpenAIEmbeddings()
        self._populate_db()

    def _populate_db(self):
        import os

        files = []
        for file in os.listdir(os.path.join(os.path.dirname(__file__), "public")):
            with open(os.path.join(os.path.dirname(__file__), "public", file), "r") as f:
                files.append({
                    "name": file,
                    "content": f.read()
                })
        from langchain_text_splitters import MarkdownHeaderTextSplitter
        headers_to_split_on = [
            ("#", "Header 1"),
            ("##", "Header 2"),
            ("###", "Header 3"),
        ]

        markdown_splitter = MarkdownHeaderTextSplitter(headers_to_split_on=headers_to_split_on)
        for file in files:
            file["sections"] = markdown_splitter.split_text(file["content"])
            embeddings = self.embeddings_model.embed_documents(file["content"])
            file["embeddings"] = embeddings

        data = [
            {
                "name": file["name"],
                "content": file["content"],
                "vector": file["embeddings"][0],
            }
            for file in files
        ]

        tbl = self.db.create_table("files", data=data, mode="overwrite")

    def embed(self, text):
        return self.embeddings_model.embed_query(text)

    def search(self, query) -> pd.DataFrame:
        query_embedding = self.embed(query)
        tbl = self.db.open_table("files")
        results = tbl.search(query_embedding).limit(2).to_pandas()[["name", "content"]].to_dict(orient="records")
        return results