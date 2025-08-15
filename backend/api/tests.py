# backend/api/tests.py
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Driver, Route, Order

class APISmokeTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user("mgr","mgr@test.com","pass1234")
        r1 = Route.objects.create(route_id=1, distance_km=10, traffic_level="High", base_time_min=30)
        Driver.objects.create(name="A", shift_hours=4, past_week_hours=[8,8,8,8,8,9,7])
        Order.objects.create(order_id=101, value_rs=1200, route=r1)
    def auth(self):
        token = self.client.post("/api/token/", {"username":"mgr","password":"pass1234"}, format="json").data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_login(self):
        res = self.client.post("/api/token/", {"username":"mgr","password":"pass1234"}, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertIn("access", res.data)

    def test_list_routes_requires_auth(self):
        res = self.client.get("/api/routes/")
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_routes_authed(self):
        self.auth()
        res = self.client.get("/api/routes/")
        self.assertEqual(res.status_code, 200)

    def test_create_driver(self):
        self.auth()
        res = self.client.post("/api/drivers/", {"name":"B","shift_hours":2,"past_week_hours":[8,9,8,8,8,8,8]}, format="json")
        self.assertEqual(res.status_code, 201)

    def test_simulate(self):
        self.auth()
        res = self.client.post("/api/simulate/", {"num_drivers":1,"start_time":"09:00","max_hours":8}, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertIn("total_profit", res.data)

