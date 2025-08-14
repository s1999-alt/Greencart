from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator
from django.utils import timezone



class Driver(models.Model):
  name = models.CharField(max_length=100, unique=True)
  shift_hours = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
  past_week_hours = models.JSONField(default=list)

  def __str__(self):
      return self.name
  

class Route(models.Model):
   route_id = models.PositiveIntegerField(unique=True)
   distance_km = models.PositiveIntegerField(validators=[MinValueValidator(0)])
   TRAFFIC_CHOICES = (("Low","Low"),("Medium","Medium"),("High","High"))
   traffic_level = models.CharField(max_length=10, choices=TRAFFIC_CHOICES)
   base_time_min = models.PositiveIntegerField()

   def __str__(self):
       return f"Route {self.route_id}"
   

class Order(models.Model):
   order_id = models.PositiveIntegerField(unique=True)
   value_rs = models.PositiveIntegerField()
   route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="orders")
   delivery_time = models.DateTimeField(null=True, blank=True)

   def __str__(self):
       return f"Order {self.order_id}"
   

class SimulationResult(models.Model):
   created_at = models.DateTimeField(default=timezone.now)
   input_num_drivers = models.PositiveIntegerField()
   input_start_time = models.TimeField()
   input_max_hours = models.PositiveIntegerField()

   # KPIs
   total_profit = models.IntegerField()
   efficiency_score = models.FloatField()
   on_time = models.IntegerField()
   late = models.IntegerField()
   fuel_cost_total = models.IntegerField()

   details = models.JSONField(default=dict)

   



   

