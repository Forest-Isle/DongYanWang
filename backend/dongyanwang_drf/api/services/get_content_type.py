from django.contrib.contenttypes.models import ContentType

def get_ct_and_model_by_params(app_label: str, model: str):
    """
    通过 app_label + model 获取 ContentType 与 Model
    """
    ct = ContentType.objects.get_by_natural_key(app_label, model.lower())
    model_class = ct.model_class()
    return ct, model_class

def ensure_obj_exists(ct, object_id):
    model = ct.model_class()
    return model.objects.filter(pk=object_id).exists()