from django.contrib import admin
from django.urls import path,include
from rest_framework.routers import DefaultRouter
from api.views import DriverViewSet, RouteViewSet, OrderViewSet, SimulationView, SimulationResultViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()

router.register(r"api/drivers", DriverViewSet, basename="drivers")
router.register(r"api/routes", RouteViewSet, basename="routes")
router.register(r"api/orders", OrderViewSet, basename="orders")
router.register(r"api/simulationresult", SimulationResultViewSet, basename="simulationresult")


urlpatterns = [
    path('admin/', admin.site.urls),
    path("/", include(router.urls)),

    path("api/simulate/", SimulationView.as_view()),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
