import requests
from django.http import JsonResponse
from django.views import View
from django.utils import timezone
from django.db.models import Avg
from django.db.models.functions import TruncDate, TruncHour
import logging
from dotenv import load_dotenv
from sensor_data.models import Device, waterLevelReading

# Load environment variables
load_dotenv()

# Set up logging
logger = logging.getLogger(__name__)


class waterLevelDataView(View):
    def get(self, request, *args, **kwargs):
        try:
            query_type = request.GET.get("query_type")
            if not query_type:
                return JsonResponse({"error": "Query type is required"}, status=400)

            device_ids = {
                "water_level_kv": "eui-a8404169c187e059-water-lvl-kv",
                "water_level_rutsweiler": "6749E17352790049",
                "water_level_kreimbach_kaulbach": "6749E17125480048",
                "water_level_wolfstein": "6749D19427550061",
                "water_level_lauterecken_1": "6749E17530450043",
                "water_level_kreimbach_1": "6749E09866560038",
                "water_level_kreimbach_3": "6749E09611440028",
                "water_level_lohnweiler_1": "6749E17323330042",
                "water_level_hinzweiler_1": "6749E17419910043",
                "water_level_untersulzbach": "pegel_untersulzbach",
                "water_level_lohnweiler_rlp": "pegel_lohnweiler_land",
                "water_level_ohmbachsee": "pegel_stausee_ohmbach",
                "water_level_nanzdietschweiler": "pegel_nanzdietschweiler",
                "water_level_rammelsbach": "pegel_rammelsbach",
                "water_level_eschenau": "pegel_eschenau",
                "water_level_sulzhof": "pegel_sulzhof",
                "water_level_odenbach_steinbruch": "pegel_odenbach_steinbruch",
                "water_level_odenbach": "pegel_odenbach",
                "water_level_niedermohr": "pegel_niedermohr",
                "water_level_loellbach": "pegel_loellbach",
                "water_level_lohnweiler_lauter_landlieben": "6749E17799680048",
            }

            device_id = device_ids.get(query_type)
            if not device_id:
                return JsonResponse({"error": "Invalid query type"}, status=400)

            try:
                device = Device.objects.get(device_id=device_id)
            except Device.DoesNotExist:
                return JsonResponse({"error": "Device not found"}, status=404)

            # Get the time range from the request
            time_range = request.GET.get("time_range", "24h")
            now = timezone.now()

            if time_range == "24h":
                time_boundary = now - timezone.timedelta(hours=24)
            elif time_range == "7d":
                time_boundary = now - timezone.timedelta(days=7)
            elif time_range == "30d":
                time_boundary = now - timezone.timedelta(days=30)
            elif time_range == "365d":
                time_boundary = now - timezone.timedelta(days=365)
            else:
                time_boundary = now - timezone.timedelta(hours=24)

            # Base queryset
            readings = waterLevelReading.objects.filter(device=device, timestamp__gte=time_boundary)

            # Aggregate depending on range
            if time_range in ["24h", "7d"]:
                # Hourly averages
                readings = (
                    readings
                    .annotate(period=TruncHour("timestamp"))
                    .values("period")
                    .annotate(avg_level=Avg("water_level_value"))
                    .order_by("period")
                )
            else:
                # Daily averages
                readings = (
                    readings
                    .annotate(period=TruncDate("timestamp"))
                    .values("period")
                    .annotate(avg_level=Avg("water_level_value"))
                    .order_by("period")
                )

            if readings:
                response_data = [
                    {"timestamp": r["period"], "water_level_value": r["avg_level"]}
                    for r in readings
                ]

                latest_reading = waterLevelReading.objects.filter(device=device).last()
                latest_battery = getattr(latest_reading, "battery", None)

                return JsonResponse({
                    "readings": response_data,
                    "battery": latest_battery,
                }, safe=False)
            else:
                return JsonResponse({"message": "No data available for the selected time period."}, status=204)

        except Exception as e:
            logger.error(f"Error in water level data: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)