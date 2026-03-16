import json
import logging
import requests as http
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .services import get_ai_response, reset_conversation

logger  = logging.getLogger('chatbot')
TG_API  = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}"

MSG_START = """Bienvenue sur l'assistant ESMT ! 🎓

Je vous aide à gérer vos tâches collaboratives.

Commandes :
/start → ce message
/aide  → exemples d'utilisation
/reset → effacer la conversation

Posez-moi n'importe quelle question !"""

MSG_AIDE = """Exemples de questions 💡

- "Comment organiser mes révisions ?"
- "Conseils pour respecter mes deadlines"
- "Comment collaborer efficacement ?"

/reset pour recommencer une nouvelle conversation."""

def send_message(chat_id: int, text: str) -> None:
    try:
        http.post(f"{TG_API}/sendMessage",
                  json={"chat_id": chat_id, "text": text, "parse_mode": "Markdown"},
                  timeout=10)
    except Exception as e:
        logger.error(f"Erreur envoi Telegram: {e}")

def send_typing(chat_id: int) -> None:
    try:
        http.post(f"{TG_API}/sendChatAction",
                  json={"chat_id": chat_id, "action": "typing"}, timeout=5)
    except Exception:
        pass

@csrf_exempt
def telegram_webhook(request):
    if request.method != 'POST':
        return JsonResponse({'ok': True})
    try:
        data    = json.loads(request.body)
        message = data.get('message', {})
        if not message:
            return JsonResponse({'ok': True})

        chat_id = message['chat']['id']
        user_id = str(message['from']['id'])
        texte   = message.get('text', '').strip()

        if not texte:
            return JsonResponse({'ok': True})

        if texte == '/start':
            send_message(chat_id, MSG_START)
        elif texte in ['/aide', '/help']:
            send_message(chat_id, MSG_AIDE)
        elif texte == '/reset':
            reset_conversation(user_id)
            send_message(chat_id, "✅ Conversation réinitialisée !")
        else:
            send_typing(chat_id)
            reponse = get_ai_response(user_id, texte)
            send_message(chat_id, reponse)

    except Exception as e:
        logger.error(f"Erreur webhook: {e}")

    return JsonResponse({'ok': True})
