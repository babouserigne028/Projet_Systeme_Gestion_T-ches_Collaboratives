from django.urls import path, include
from .views import *

urlpatterns = [
    path('utilisateurs/', UtilisateurListView.as_view(), name='utilisateur-list'),
    path('utilisateurs/count/', UserCountView.as_view(), name='user-count'),
    path('utilisateurs/awaitingValidation/count/', UsersAwaitingValidationView.as_view(), name='user-count-awaiting-validation'),
    path('utilisateurs/<int:user_id>/status/', UpdateUserStatusView.as_view(), name='update-user-status'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('check-email/', CheckEmailView.as_view(), name='check-email'),
]