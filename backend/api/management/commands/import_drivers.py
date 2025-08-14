# backend/api/management/commands/import_drivers.py
from django.core.management.base import BaseCommand
import csv, json
from api.models import Driver

class Command(BaseCommand):
    help = "Import drivers.csv"

    def add_arguments(self, parser):
        parser.add_argument("path")

    def handle(self, *args, **opts):
        with open(opts["path"], newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                past = row.get("past_week_hours","")
                try:
                    past_list = json.loads(past) if past.strip().startswith("[") else [int(x) for x in past.split(",") if x.strip()]
                except:
                    past_list = []
                Driver.objects.update_or_create(
                    name=row["name"],
                    defaults={
                        "shift_hours": int(row["shift_hours"]),
                        "past_week_hours": past_list,
                    }
                )
        self.stdout.write(self.style.SUCCESS("Drivers imported"))
