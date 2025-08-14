from django.contrib import admin
from .models import Driver, Route, Order, SimulationResult


admin.site.register([Driver, Route, Order, SimulationResult])
