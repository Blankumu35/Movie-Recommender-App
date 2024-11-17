from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer


def train_collaborative_filtering_model(user_item_matrix):
    model = TruncatedSVD(n_components=50)
    latent_matrix = model.fit_transform(user_item_matrix)
    return latent_matrix

def recommend_items(user_vector, latent_matrix, top_n=10):
    scores = cosine_similarity(user_vector, latent_matrix)
    recommended_items = scores.argsort()[::-1][:top_n]
    return recommended_items

def content_based_filtering(item_data, liked_items):
    vectorizer = TfidfVectorizer()
    item_vectors = vectorizer.fit_transform(item_data['description'])
    liked_item_vectors = vectorizer.transform(liked_items['description'])

    similarities = cosine_similarity(liked_item_vectors, item_vectors)
    recommended_items = similarities.mean(axis=0).argsort()[::-1][:10]
    return recommended_items

def hybrid_recommendation(user_vector, item_data, latent_matrix):
    collaborative_recs = recommend_items(user_vector, latent_matrix)
    content_recs = content_based_filtering(item_data, collaborative_recs)
    return content_recs