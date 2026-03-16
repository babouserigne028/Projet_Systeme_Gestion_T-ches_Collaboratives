from django.contrib import admin
from .models import Conversation

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display  = ['user_id', 'role', 'created_at', 'apercu']
    list_filter   = ['role']
    search_fields = ['user_id', 'content']
    ordering      = ['-created_at']

    def apercu(self, obj):
        return obj.content[:60] + ('...' if len(obj.content) > 60 else '')
    apercu.short_description = "Message"
