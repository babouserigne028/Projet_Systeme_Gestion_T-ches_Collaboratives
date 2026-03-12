from celery import shared_task
from backend_app.management.commands.rappel_deadlines import Command

@shared_task
def rappel_deadlines():
    Command().handle()
