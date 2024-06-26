import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const { refundId } = getQuery(event);
  const config = useRuntimeConfig();
  const baseUrl = config.public.baseUrl;
  const token = config.public.authToken;

  try {
    const response = await fetch(
      `${baseUrl}/api/ticket-service/tickets/public/${refundId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Fehler beim Laden der Tickets.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw new Error("Fehler beim Laden der Tickets.");
  }
});