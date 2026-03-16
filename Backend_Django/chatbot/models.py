from django.db import models

class Conversation(models.Model):
    user_id    = models.CharField(max_length=100, db_index=True)
    role       = models.CharField(max_length=10)
    content    = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name_plural = "Conversations"

    def __str__(self):
        return f"[{self.role}] {self.user_id} — {self.content[:40]}"
