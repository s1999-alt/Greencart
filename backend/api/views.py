from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Driver, Route, Order, SimulationResult
from .serializers import DriverSerializer, RouteSerializer, OrderSerializer, SimulationResultSerializer
from datetime import datetime, time
from math import ceil


class DriverViewSet(viewsets.ModelViewSet):
  queryset = Driver.objects.all().order_by("id")
  serializer_class = DriverSerializer
  permission_classes = [IsAuthenticated]

class RouteViewSet(viewsets.ModelViewSet):
  queryset = Route.objects.all().order_by("route_id")
  serializer_class = RouteSerializer
  permission_classes = [IsAuthenticated]

class OrderViewSet(viewsets.ModelViewSet):
  queryset = Order.objects.select_related("route").all().order_by("order_id")
  serializer_class = OrderSerializer
  permission_classes = [IsAuthenticated]


class SimulationView(APIView):
  permission_classes  = [IsAuthenticated]

  def post(self, request):
    try:
      num_drivers = int(request.data.get("num_drivers"))
      start_time_str = request.data.get("start_time")
      max_hours = float(request.data.get("max_hours"))
      assert num_drivers > 0 and max_hours > 0
      start_h, start_m = [int(x) for x in start_time_str.split(":")]
      start_t = time(hour=start_h, minute=start_m)
    except Exception:
      return Response(
        {"detail":"Invalid input. Expect num_drivers>0, start_time 'HH:MM', max_hours>0."},
        status=status.HTTP_400_BAD_REQUEST
      )
    

    # select drivers (top N by least shift_hours to be fair)
    drivers = list(Driver.objects.all().order_by("shift_hours")[:num_drivers])
    if len(drivers) < num_drivers:
      return Response({"detail":"Not enough drivers in DB."}, status=400)
    
    # prep driver capacity and fatigue
    driver_state = []
    for d in drivers:
      yesterday= 0
      if isinstance(d.past_week_hours, list) and d.past_week_hours:
        yesterday = d.past_week_hours[-1]
      fatigued = yesterday > 8
      driver_state.append({
        "driver": d,
        "remaining_min": int(max_hours * 60),
        "fatigued": fatigued,
        "assigned": []
        })
      
      orders = list(Order.objects.select_related("route").all().order_by("order_id"))
      if not orders:
          return Response({"detail":"No orders to simulate."}, status=400)
      
      on_time = late = 0
      fuel_cost_total = 0
      total_profit = 0
      details = []

      # round-robin allocate
      i = 0
      for order in orders:
        # find next driver who has capacity for at least base time (rough check)
        picked = None
        attempts = 0

        while attempts < len(driver_state):
          cand = driver_state[i % len(driver_state)]
          attempts += 1; i += 1
          # compute predicted time considering fatigue
          base_t = order.route.base_time_min
          time_mult = 1.0
          if cand["fatigued"]:
            time_mult *= (1/0.7)  # slower ⇒ more time
          predicted_min = ceil(base_t * time_mult)

          if cand["remaining_min"] >= predicted_min:
            picked = cand
            break

        if picked is None:
          # cannot allocate within capacities ⇒ mark late & fuel anyway
          predicted_min = order.route.base_time_min
          is_late = predicted_min > (order.route.base_time_min + 10)
          on_time += 0 if is_late else 1
          late += 1 if is_late else 0

          # fuel
          fuel_per_km = 5 + (2 if order.route.traffic_level == "High" else 0)
          fuel = fuel_per_km * order.route.distance_km
          bonus = 0
          if order.value_rs > 1000 and not is_late:
            bonus = int(round(order.value_rs * 0.10))
          penalty = 50 if is_late else 0
          profit = order.value_rs + bonus - penalty - fuel
          total_profit += profit
          fuel_cost_total += fuel
          details.append({"order_id": order.order_id, "allocated": False, "late": is_late,
                          "predicted_min": predicted_min, "fuel": fuel, "bonus": bonus, "penalty": penalty, "profit": profit})
          continue

        # use picked driver
        base_t = order.route.base_time_min
        time_mult = 1.0
        if picked["fatigued"]:
            time_mult *= (1/0.7)
        predicted_min = ceil(base_t * time_mult)

        picked["remaining_min"] -= predicted_min
        picked["assigned"].append(order.order_id)

        is_late = predicted_min > (order.route.base_time_min + 10)
        on_time += 0 if is_late else 1
        late += 1 if is_late else 0

        # fuel
        fuel_per_km = 5 + (2 if order.route.traffic_level == "High" else 0)
        fuel = fuel_per_km * order.route.distance_km
        fuel_cost_total += fuel

        # bonus/penalty
        bonus = int(round(order.value_rs * 0.10)) if (order.value_rs > 1000 and not is_late) else 0
        penalty = 50 if is_late else 0

        profit = order.value_rs + bonus - penalty - fuel
        total_profit += profit

        details.append({"order_id": order.order_id, "driver": picked["driver"].name, "allocated": True,
                        "late": is_late, "predicted_min": predicted_min, "fuel": fuel,
                        "bonus": bonus, "penalty": penalty, "profit": profit})
        
    efficiency = (on_time / max(1, len(orders))) * 100.0
    sim = SimulationResult.objects.create(
      input_num_drivers=len(drivers),
      input_start_time=start_t,
      input_max_hours=int(max_hours),
      total_profit=int(total_profit),
      efficiency_score=round(efficiency,2),
      on_time=on_time, late=late,
      fuel_cost_total=int(fuel_cost_total),
      details={"orders": details}
    )

    return Response(SimulationResultSerializer(sim).data, status=200)


class SimulationResultViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SimulationResult.objects.all().order_by("-created_at")
    serializer_class = SimulationResultSerializer
    permission_classes = [IsAuthenticated]




