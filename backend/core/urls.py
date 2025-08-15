from django.contrib import admin
from django.urls import path,include
from rest_framework.routers import DefaultRouter
from api.views import DriverViewSet, RouteViewSet, OrderViewSet, SimulationView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()

router.register(r"drivers", DriverViewSet, basename="drivers")
router.register(r"routes", RouteViewSet, basename="routes")
router.register(r"orders", OrderViewSet, basename="orders")


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include(router.urls)),

    path("api/simulate/", SimulationView.as_view()),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
