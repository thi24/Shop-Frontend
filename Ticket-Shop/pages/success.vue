<template>
  <div class="flex w-full items-start justify-center pt-10">
    <div
      class="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-2xl bg-white px-6 pt-12 pb-8 shadow-lg"
    >
      <div class="text-center">
        <h1 class="text-2xl font-bold text-green-600">Zahlung erfolgreich!</h1>
        <p class="mt-2 text-gray-600 text-sm">
          Vielen Dank für Ihre Bestellung. Ihre Zahlung war erfolgreich.
        </p>
      </div>
      <div class="flex flex-col gap-3 border-b py-6 text-xs mt-4">
        <p class="flex justify-between">
          <span class="text-gray-400">Kundennummer:</span>
          <span>{{ orderNumber }}</span>
        </p>
        <p class="flex justify-between">
          <span class="text-gray-400">Event:</span>
          <span>{{ eventName }}</span>
        </p>
      </div>
      <div class="flex flex-col gap-3 pb-6 pt-2 text-xs">
        <table class="w-full text-left table-fixed" aria-label="Bought Tickets">
          <thead>
            <tr>
              <th class="w-1/2 py-2">Tickets</th>
              <th class="w-1/4 py-2 text-right">Menge</th>
              <th class="w-1/4 py-2 text-right">Gesamt</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td class="py-1">{{ product.name }}</td>
              <td class="py-1 text-right">
                {{ product.quantity }}
              </td>
              <td class="py-1 text-right">
                {{ formatPrice(product.price * product.quantity) }}
              </td>
            </tr>
          </tbody>
        </table>

        <div class="border-b border border-dashed"></div>
        <p class="flex justify-between">
          <span>Bezahlt:</span>
          <span>{{ amount.toFixed(2) }} €</span>
        </p>
        <div class="py-4 flex justify-center items-center flex-col gap-2">
          <button
            @click="goToHome"
            class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Zur Startseite
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { usePaymentStore } from "~/stores/paymentStore";
import { formatPrice } from "~/utils/formatPrice"; 
import { getParameterByName } from "~/utils/getParameterByName";

const router = useRouter();
const config = useRuntimeConfig();
const paymentStore = usePaymentStore();
const { orderNumber, eventName, amount, products } = storeToRefs(paymentStore);

onMounted(async () => {
  // Check if engine call was made
  const url = window.location.href;
  const processEngineCalled = localStorage.getItem("processEngineCalled");

  if (window.location.href == useRuntimeConfig().public.returnUrl) {
    return;
  }
  const redirectStatus = getParameterByName("redirect_status", url);
  if (processEngineCalled === "false") {
    if (redirectStatus === "succeeded") {
      const jsonString = url.split("?")[1].split("=")[0];

      // Some characters are not decoded correctly
      const replacedString = decodeURIComponent(jsonString);
      const parsedData = JSON.parse(replacedString);

      // Clear window title
      window.history.replaceState({}, document.title, window.location.pathname);
      // Call the engine
      try {
        const response = await fetch('/api/processEngineCall', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(parsedData),
        });

        const result = await response.json();
        if (result.success) {
          localStorage.setItem("processEngineCalled", "true");
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error:", error);
        router.push("../error");
      }
    } else {
      console.error("Zahlung fehlgeschlagen oder Redirect-Status ungültig.");
      router.push("../error");
    }
  }
});

function goToHome() {
  router.push("/");
}
</script>


