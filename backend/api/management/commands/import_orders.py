from django.core.management.base import BaseCommand
import csv, datetime
from django.utils.dateparse import parse_datetime
from api.models import Order, Route

class Command(BaseCommand):
    def add_arguments(self, p): p.add_argument("path")
    def handle(self, *a, **o):
        with open(o["path"], newline="", encoding="utf-8") as f:
            for r in csv.DictReader(f):
                route = Route.objects.get(route_id=int(r["route_id"]))
                dt = parse_datetime(r.get("delivery_time",""))  # may be None
                Order.objects.update_or_create(
                    order_id=int(r["order_id"]),
                    defaults={"value_rs": int(r["value_rs"]), "route": route, "delivery_time": dt}
                )
        print("Orders imported")
