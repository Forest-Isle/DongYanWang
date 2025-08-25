# api/admin.py
from django.contrib import admin
from api.models.competition import (
    Competition, CompetitionMetric, CompetitionCategory,
    CompetitionModerator, CompetitionPost, CompetitionPostAttachment
)
from api.models.article import Comment, Interaction
from api.models.content import ContentStats


@admin.register(Competition)
class CompetitionAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "organizer", "last_update", "is_national")
    search_fields = ("name", "organizer")
    list_filter = ("is_national", "is_math_contest", "is_edu_ministry")


admin.site.register(CompetitionMetric)
admin.site.register(CompetitionCategory)
admin.site.register(CompetitionModerator)
admin.site.register(CompetitionPost)
admin.site.register(CompetitionPostAttachment)
admin.site.register(Comment)
admin.site.register(Interaction)
admin.site.register(ContentStats)
