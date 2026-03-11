from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # ── Authentification & Utilisateurs ──
    path('utilisateurs/', UtilisateurListView.as_view(), name='utilisateur-list'),
    path('utilisateurs/create/', AdminCreateUserView.as_view(), name='admin-create-user'),
    path('utilisateurs/count/', UserCountView.as_view(), name='user-count'),
    path('utilisateurs/awaitingValidation/count/', UsersAwaitingValidationView.as_view(), name='user-count-awaiting-validation'),
    path('utilisateurs/<int:user_id>/', UtilisateurDetailView.as_view(), name='utilisateur-detail'),
    path('utilisateurs/<int:user_id>/status/', UpdateUserStatusView.as_view(), name='update-user-status'),
    path('professeurs/eligible-for-prime/', EligibleProfessorsForPrimeView.as_view(), name='eligible-professors-for-prime'),
    path('statistiques/professeurs/', StatistiquesProfsView.as_view(), name='statistiques-profs'),
    path('professeur/dashboard/', ProfesseurDashboardView.as_view(), name='professeur-dashboard'),
    path('etudiant/dashboard/', EtudiantDashboardView.as_view(), name='etudiant-dashboard'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('me/photo/', UploadPhotoView.as_view(), name='upload-photo'),
    path('check-email/', CheckEmailView.as_view(), name='check-email'),
    
    # ── Projets ──
    path('projets/', ProjetListCreateView.as_view(), name='projet-list-create'),
    path('projets/<int:projet_id>/', ProjetDetailView.as_view(), name='projet-detail'),
    path('projets/<int:projet_id>/collaborateurs/', CollaborateurAddView.as_view(), name='collaborateur-add'),
    path('projets/<int:projet_id>/collaborateurs/<int:collaborateur_id>/', CollaborateurRemoveView.as_view(), name='collaborateur-remove'),
    
    # ── Tâches ──
    path('taches/', TacheListCreateView.as_view(), name='tache-list-create'),
    path('taches/<int:tache_id>/', TacheDetailView.as_view(), name='tache-detail'),
    
    # ── Chat (Messages par projet) ──
    path('projets/<int:projet_id>/messages/', MessageListCreateView.as_view(), name='message-list-create'),
    path('projets/<int:projet_id>/messages/read/', MarkChatReadView.as_view(), name='mark-chat-read'),
    path('messages/unread/', UnreadMessagesCountView.as_view(), name='unread-messages-count'),
]