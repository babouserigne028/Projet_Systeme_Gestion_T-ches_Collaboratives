import json
import logging
import requests as http
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.contrib.auth import authenticate
from backend_app.models import Projet
from .services import get_ai_response, reset_conversation

# Stocke l'état d'authentification de chaque utilisateur en mémoire
AUTH_STATE = {}
# Structure : { user_id: { 'step': 'email'|'password', 'email': '...' } }

KEYWORDS_PROJETS = ['projet', 'projets', 'liste des projets', 'voir les projets', 'tous les projets']

def demande_projets(texte: str) -> bool:
    texte = texte.lower()
    return any(kw in texte for kw in KEYWORDS_PROJETS)

def liste_projets_text() -> str:
    projets = Projet.objects.select_related('createur').all()
    if not projets:
        return "Aucun projet trouvé dans l'application."
    lignes = [
        f"📁 *{p.titre}*\n   _{p.description[:60]}..._\n   👤 {p.createur.prenom} {p.createur.nom}"
        for p in projets
    ]
    return "📋 *Voici tous les projets de l'application :*\n\n" + "\n\n".join(lignes)

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
            etat = AUTH_STATE.get(user_id)

            if etat and etat['step'] == 'email':
                AUTH_STATE[user_id]['email'] = texte
                AUTH_STATE[user_id]['step'] = 'password'
                send_message(chat_id, "Merci ! Maintenant entrez votre mot de passe 🔒")

            elif etat and etat['step'] == 'password':
                email = AUTH_STATE[user_id]['email']
                utilisateur = authenticate(username=email, password=texte)
                del AUTH_STATE[user_id]

                if utilisateur and utilisateur.role == 'administrateur':
                    send_typing(chat_id)
                    send_message(chat_id, liste_projets_text())
                else:
                    send_message(chat_id, "❌ Accès refusé. Identifiants incorrects ou vous n'êtes pas administrateur.")

            elif demande_projets(texte):
                AUTH_STATE[user_id] = {'step': 'email'}
                send_message(chat_id, "Pour accéder aux projets, je dois vérifier votre identité.\n\nQuel est votre email ? 📧")

            else:
                send_typing(chat_id)
                reponse = get_ai_response(user_id, texte)
                send_message(chat_id, reponse)

    except Exception as e:
        logger.error(f"Erreur webhook: {e}")

    return JsonResponse({'ok': True})
