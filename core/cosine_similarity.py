from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

def similarity(resume_text , jd_text):
  # model = SentenceTransformer("all-MiniLM-L6-v2")
  model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")


  jd = model.encode(jd_text, convert_to_tensor=True)
  resume = model.encode(resume_text, convert_to_tensor=True)

  return cosine_similarity(jd.reshape(1,-1),resume.reshape(1,-1))[0][0]