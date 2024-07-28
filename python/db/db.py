# from sqlalchemy import create_engine, text
# from sqlalchemy.orm import sessionmaker
# from contextlib import contextmanager

# class DB:
#     def __init__(self, user, password, host, database):
#         self.database_url = f"mssql+pyodbc://{user}:{password}@{host}/{database}?driver=SQL+Server"
#         self.engine = create_engine(self.database_url)
#         self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)

#     @contextmanager
#     def get_session(self):
#         """Context manager to provide a transactional scope around a series of operations."""
#         session = self.SessionLocal()
#         try:
#             yield session
#             session.commit()
#         except Exception as e:
#             session.rollback()
#             raise
#         finally:
#             session.close()

#     def execute_query(self, query, params=None):
#         """Execute a raw SQL query and return the results as a list of dictionaries."""
#         with self.get_session() as session:
#             result = session.execute(text(query), params)
#             columns = result.keys()
#             rows = result.fetchall()
#             result_dicts = [dict(zip(columns, row)) for row in rows]
#             return result_dicts

#     def execute_update(self, query, params=None):
#         """Execute a raw SQL update/insert/delete."""
#         with self.get_session() as session:
#             session.execute(text(query), params)
#             session.commit()

# db_instance = DB(
#     user="sa",
#     password="2027",
#     host="LAPTOP-L96AKFUV",
#     database="Inte2DB"
# )