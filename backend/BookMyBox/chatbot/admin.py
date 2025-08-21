from django.contrib import admin
from .models import ChatConversation, ChatMessage

class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ('timestamp',)
    fields = ('message_type', 'content', 'timestamp')

@admin.register(ChatConversation)
class ChatConversationAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'user', 'created_at', 'updated_at', 'message_count')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('session_id', 'user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ChatMessageInline]
    
    def message_count(self, obj):
        return obj.messages.count()
    message_count.short_description = 'Messages'

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'message_type', 'content_preview', 'timestamp')
    list_filter = ('message_type', 'timestamp')
    search_fields = ('content',)
    readonly_fields = ('timestamp',)
    
    def content_preview(self, obj):
        return obj.content[:100] + "..." if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content Preview'
