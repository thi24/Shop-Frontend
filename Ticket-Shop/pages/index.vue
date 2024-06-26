<template>
  <div class="mx-auto">
    <BannerComponent />
    <div class="flex justify-center items-center">
      <p
        id="no-results"
        class="flex justify-center text-gray-600 my-10"
        style="display: none"
      >
        Keine Suchergebnisse
      </p>
    </div>
    <div
      class="pt-4 px-4 hover:rounded-lg rounded-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-4"
    >
      <EventComponent v-for="event in events" :event="event"></EventComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { Event } from "~/classes/Event";
import { fetchEvents, fetchEventsByEventName } from "~/services/eventService";
import { useSearchStore } from "~/stores/searchStore";

import EventComponent from "~/components/events/EventComponent.vue";
import BannerComponent from "~/components/alerts/BannerComponent.vue";

const events = ref<Event[]>([]);
const searchStore = useSearchStore();

onMounted(async () => {
  try {
    const eventName = searchStore.eventName;
    writeStoreInInput(eventName);
    await loadEventsBasedOnName(eventName);
    updateNoResultsDisplay();
  } catch (error) {
    console.error("Failed to load events:", error);
  }
});

async function loadEventsBasedOnName(eventName: string) {
  if (!eventName) {
    events.value = await fetchEvents().catch(() => {});
  } else {
    events.value = await fetchEventsByEventName(eventName).catch(() => {});
  }
}

function updateNoResultsDisplay() {
  const noResultsElement = document.getElementById("no-results");
  if (noResultsElement) {
    noResultsElement.style.display =
      events.value.length === 0 ? "block" : "none";
  }
}

function writeStoreInInput(eventName: string) {
  let inputs = document.getElementsByTagName("input");

  for (let input of inputs) {
    input.value = eventName;
  }
}
</script>
