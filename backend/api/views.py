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

