from django.core.management.base import BaseCommand
from user_dashboard.gamification import GamificationService

class Command(BaseCommand):
    help = 'Create default achievements for gamification'

    def handle(self, *args, **options):
        self.stdout.write('Creating default achievements...')
        GamificationService.create_default_achievements()
        self.stdout.write(self.style.SUCCESS('Default achievements created successfully!'))
