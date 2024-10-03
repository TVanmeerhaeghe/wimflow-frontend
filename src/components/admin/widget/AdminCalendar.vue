<template>
  <div class="calendar-widget">
    <h2>Calendrier des maintenances</h2>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr'; 

export default {
  components: {
    FullCalendar
  },
  setup() {
    const calendarEvents = ref([]);

    const fetchCalendarEvents = async () => {
      try {
        const response = await fetch(`${process.env.VUE_APP_API_URL}/maintenance`, {
          headers: {
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        const maintenances = await response.json();

        calendarEvents.value = maintenances
          .filter(maintenance => maintenance.Site?.maintenance_status === true)
          .map(maintenance => ({
            title: maintenance.Site?.name || 'Maintenance',
            start: maintenance.next_maintenance,
            id: maintenance.id,
            status: maintenance.status,
          }));

        calendarOptions.value.events = calendarEvents.value;
      } catch (error) {
        console.error("Erreur lors de la récupération des maintenances : ", error);
      }
    };

    const handleEventClick = (info) => {
      const maintenanceId = info.event.id;
      this.$router.push(`/admin/maintenance/edit/${maintenanceId}`);
    };

    const calendarOptions = ref({
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: frLocale,
      events: () => calendarEvents.value,
      eventClick: handleEventClick,
      eventColor: '#008f82;',
      headerToolbar: {
        left: 'title',
        center: '',
        right: 'prev,next'
      },
      displayEventTime: false,
      displayEventEnd: false,
    });

    onMounted(() => {
      fetchCalendarEvents();
    });

    return {
      calendarOptions,
    };
  }
};
</script>

<style scoped>

.calendar-widget {
  width: 600px;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 20px;
  background-color: #fff;
}

.fc {
  height: 100%;
  font-size: 0.85rem;
}

.fc .fc-toolbar-title {
  font-size: 1.2rem;
}
</style>
