import logging
from groq import Groq
from django.conf import settings
from .models import Conversation

logger = logging.getLogger('chatbot')

client = Groq(api_key=settings.GROQ_API_KEY)

SYSTEM_INSTRUCTION = """Tu es l'assistant IA du Système de Gestion des Tâches
Collaboratives de l'ESMT (Dakar, Sénégal).
Tu aides les étudiants et enseignants à gérer leurs tâches et projets.
Règles : réponds TOUJOURS en français, sois concis (2-3 phrases max)."""

def get_ai_response(user_id: str, message: str) -> str:
    try:
        historique = Conversation.objects.filter(
            user_id=user_id
        ).order_by('-created_at')[:20]

        messages = [{"role": "system", "content": SYSTEM_INSTRUCTION}]
        for msg in reversed(list(historique)):
            role = 'assistant' if msg.role == 'assistant' else 'user'
            messages.append({"role": role, "content": msg.content})
        messages.append({"role": "user", "content": message})

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=500,
            temperature=0.7,
        )
        texte = response.choices[0].message.content.strip()

        Conversation.objects.create(user_id=user_id, role='user',      content=message)
        Conversation.objects.create(user_id=user_id, role='assistant', content=texte)
        return texte

    except Exception as e:
        logger.error(f"Erreur Groq user={user_id}: {e}")
        return "Désolé, une erreur est survenue. Réessaie dans un instant. 🙏"

def reset_conversation(user_id: str) -> None:
    Conversation.objects.filter(user_id=user_id).delete()
