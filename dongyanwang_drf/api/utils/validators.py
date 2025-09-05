import imghdr
from django.core.exceptions import ValidationError

# 允许的扩展/类型
ALLOWED_IMAGE_EXTS = {"jpg", "jpeg", "png", "gif", "webp"}
ALLOWED_IMAGE_MIME = {
    "image/jpeg", "image/png", "image/gif", "image/webp"
}

def validate_image_size(file_obj, max_size_mb: int =10):
    size_mb = file_obj.size / (1024 * 1024)
    if size_mb > max_size_mb:
        raise ValidationError(f"图片过大：{size_mb:.2f}MB > {max_size_mb}MB")

def validate_image_mime(file_obj):
    # 有的存储后端会带 content_type。若没有，则用 imghdr 兜底
    ct = getattr(file_obj, "content_type", None)
    guessed = imghdr.what(file_obj)
    if ct and ct not in ALLOWED_IMAGE_MIME:
        raise ValidationError("不支持的图片类型")
    if not ct and guessed is None:
        raise ValidationError("无法识别的图片文件")

def validate_image_dimensions(get_dims_callable, max_w: int, max_h: int):
    w, h = get_dims_callable()
    if w > max_w or h > max_h:
        raise ValidationError(f"图片尺寸过大：{w}x{h}，最大允许 {max_w}x{max_h}")
