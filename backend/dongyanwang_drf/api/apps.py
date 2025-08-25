from django.apps import AppConfig



class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):

        import api.signals
        # 可选：启动时确保索引存在（生产建议用管理命令）
        # 暂时注释掉，等 Elasticsearch 配置好后再启用

        try:
            from .search import get_search_client
            from .search import ensure_index
            from .search_bootstrap import create_indices
            create_indices()
        except Exception:
            # 不阻塞启动
            pass

