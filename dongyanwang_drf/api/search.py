# api/search.py
import json
from django.conf import settings

try:
    from opensearchpy import OpenSearch
except Exception:
    OpenSearch = None

try:
    from elasticsearch import Elasticsearch
except Exception:
    Elasticsearch = None

from elasticsearch import Elasticsearch
from django.conf import settings

def get_search_client() -> Elasticsearch:
    """
    返回 Elasticsearch 客户端，支持安全认证
    """
    # 从 settings 中读取 ES 配置
    es_hosts = getattr(settings, "SEARCH_ENGINE", {}).get("HOSTS", ["https://localhost:9200"])
    es_user = getattr(settings, "SEARCH_ENGINE", {}).get("USER", "elastic")
    es_password = getattr(settings, "SEARCH_ENGINE", {}).get("PASSWORD", "elastic")
    verify_ssl = getattr(settings, "SEARCH_ENGINE", {}).get("VERIFY_SSL", False)

    client = Elasticsearch(
        hosts=es_hosts,
        basic_auth=(es_user, es_password),
        verify_certs=verify_ssl
    )
    return client


def index_name(model_label: str) -> str:
    return f'{settings.SEARCH_ENGINE.get("INDEX_PREFIX","")}{model_label}'

def ensure_index(client, model_label: str, mappings: dict):
    name = index_name(model_label)
    if not client.indices.exists(index=name):
        client.indices.create(index=name, body=mappings)


def index_post(post, extra=None):
    """
    更新搜索索引，extra 可以传额外字段，比如 is_banned
    """
    data = {
        "title": getattr(post, "title", ""),
        "content": getattr(post, "content", ""),
        "creator_id": getattr(post, "creator_id", None),
        "creator_username": getattr(getattr(post, "creator", None), "username", None),
        "post_type": getattr(post, "post_type", None),
        "created_time": getattr(post, "created_time", None).isoformat() if getattr(post, "created_time", None) else None,
    }
    if extra:
        data.update(extra)

    client = get_search_client()
    model_label = post.__class__.__name__.lower()
    ensure_index(client, model_label, {
        "settings": {"number_of_shards": 1, "number_of_replicas": 0}
    })
    client.index(index=index_name(model_label), id=post.id, document=data, refresh="true")

def delete_post(client, model_label: str, pk: int):
    name = index_name(model_label)
    try:
        client.delete(index=name, id=pk, refresh="true")
    except Exception:
        pass

def search_posts(client, model_label: str, query: str, page: int = 1, size: int = 10):
    name = index_name(model_label)
    body = {
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["title^3", "content", "creator_username^2"]
            }
        },
        "from": (page - 1) * size,
        "size": size
    }
    return client.search(index=name, body=body)