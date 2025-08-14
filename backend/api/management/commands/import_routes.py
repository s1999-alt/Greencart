from django.core.management.base import BaseCommand
import csv
from api.models import Route

class Command(BaseCommand):
    def add_arguments(self, p): p.add_argument("path")
    def handle(self, *a, **o):
        with open(o["path"], newline="", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                Route.objects.update_or_create(
                    route_id=int(r["route_id"]),
                    defaults={
                        "distance_km": int(r["distance_km"]),
                        "traffic_level": r["traffic_level"],
                        "base_time_min": int(r["base_time_min"]),
                    }
                )
        print("Routes imported")
