# api/admin.py
from django.contrib import admin
from api.models.competition import (
    Competition, CompetitionMetric, CompetitionCategory,
    CompetitionModerator, CompetitionPost, CompetitionPostAttachment
)
from api.models.journal import (
    Journal, JournalMetric, JournalCategory,
    JournalModerator, JournalPost, JournalPostAttachment
)
from api.models.admissions import (
    Admissions, AdmissionsMetric, AdmissionsCategory,
    AdmissionsModerator, AdmissionsPost, AdmissionsPostAttachment
)
from api.models.project import (
    Project, ProjectMetric, ProjectCategory,
    ProjectModerator, ProjectPost, ProjectPostAttachment, ProjectEnrollment
)
from api.models.skill import (
    Skill, SkillCategory, SkillModerator, SkillPost, SkillPostAttachment
)
from api.models.ops import ConsultationService, ConsultationOrder
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

# Journal
@admin.register(Journal)
class JournalAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "issn", "publisher", "last_update", "is_sci")
    search_fields = ("name", "issn", "publisher")

admin.site.register(JournalMetric)
admin.site.register(JournalCategory)
admin.site.register(JournalModerator)
admin.site.register(JournalPost)
admin.site.register(JournalPostAttachment)

# Admissions
@admin.register(Admissions)
class AdmissionsAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "organizer", "location", "sub_status", "last_update")
    search_fields = ("name", "organizer", "location")

admin.site.register(AdmissionsMetric)
admin.site.register(AdmissionsCategory)
admin.site.register(AdmissionsModerator)
admin.site.register(AdmissionsPost)
admin.site.register(AdmissionsPostAttachment)

# Project
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "code", "funding_agency", "sub_status", "last_update")
    search_fields = ("name", "code", "funding_agency")

admin.site.register(ProjectMetric)
admin.site.register(ProjectCategory)
admin.site.register(ProjectModerator)
admin.site.register(ProjectPost)
admin.site.register(ProjectPostAttachment)
admin.site.register(ProjectEnrollment)

# Skill
@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "skill_type", "difficulty", "last_update")
    search_fields = ("name",)

admin.site.register(SkillCategory)
admin.site.register(SkillModerator)
admin.site.register(SkillPost)
admin.site.register(SkillPostAttachment)

# Consultation
admin.site.register(ConsultationService)
admin.site.register(ConsultationOrder)
