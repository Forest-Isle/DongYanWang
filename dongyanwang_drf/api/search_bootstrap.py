# api/search_bootstrap.py（可在 AppConfig.ready 里调用一次）


from backend.dongyanwang_drf.api.search import get_search_client, ensure_index

POST_MAPPING = {
    "settings": {"number_of_shards": 1, "number_of_replicas": 0},
    "mappings": {
        "properties": {
            "title": {"type": "text"},
            "content": {"type": "text"},
            "creator_id": {"type": "integer"},
            "creator_username": {"type": "keyword"},
            "post_type": {"type": "keyword"},
            "created_time": {"type": "date"},
            "is_banned": {"type": "boolean"},
            "status": {"type": "keyword"},
        }
    },
}


def create_indices(client=None):
    if client is None:
        client = get_search_client()

    ensure_index(client, "competitionpost", POST_MAPPING)
    ensure_index(client, "journalpost", POST_MAPPING)
    ensure_index(client, "admissionspost", POST_MAPPING)
    ensure_index(client, "projectpost", POST_MAPPING)
    ensure_index(client, "skillpost", POST_MAPPING)
    # ensure_index(client, "competition", COMPETITION_MAPPING)
    # ensure_index(client, "user", USER_MAPPING)