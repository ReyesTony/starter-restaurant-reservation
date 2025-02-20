/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal, onCancel) {
  try {
    const url = new URL(`${API_BASE_URL}/reservations`);
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.append(key, value.toString())
    );
    const response = await fetchJson(url, { headers, signal }, []);
    const formatDate = formatReservationDate(response);
    const formatTime = formatReservationTime(formatDate);
    return formatTime;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export async function listTables(signal, onCancel) {
  try {
    const url = new URL(`${API_BASE_URL}/tables`);

    return await fetchJson(url, { headers, signal }, []);
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export async function createReservations(newData, signal, onCancel) {
  try {
    const url = new URL(`${API_BASE_URL}/reservations`);
    const response = await fetchJson(
      url,
      {
        body: JSON.stringify({ data: newData }),
        headers,
        method: "POST",
        signal,
      },
      []
    );
    const formatDate = formatReservationDate(response);
    const formatTime = formatReservationTime(formatDate);
    return formatTime;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export async function createTable(newData, signal, onCancel) {
  try {
    const url = new URL(`${API_BASE_URL}/tables`);
    return await fetchJson(
      url,
      {
        body: JSON.stringify({ data: newData }),
        headers,
        method: "POST",
        signal,
      },
      []
    );
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export async function assignReservation(table_id, reservation_id, signal, onCancel) {
  try {
    const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat/`);

    return await fetchJson(
      url,
      {
        body: JSON.stringify({ data: { reservation_id } }),
        headers,
        method: "PUT",
        signal,
      },
      []
    );
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export async function getReservation(reservation_id, signal, onCancel) {
  try {
    const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);

    const response = await fetchJson(url, { headers, signal }, []);
    const formatDate = formatReservationDate(response);
    const formatTime = formatReservationTime(formatDate);
    return formatTime;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export async function searchReservation(mobile_number, signal, onCancel) {
  try {
    const url = new URL(
      `${API_BASE_URL}/reservations/?mobile_number=${mobile_number}`
    );

    return await fetchJson(url, { headers, signal }, []);
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export async function finishTable(table_id, signal, onCancel) {
  try {
    const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
    return await fetchJson(url, { headers, method: "DELETE", signal }, []);
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export async function seatReservation(reservation_id, newStatus, signal, onCancel) {
  try {
    const url = new URL(
      `${API_BASE_URL}/reservations/${reservation_id}/status`
    );
    return await fetchJson(
      url,
      {
        body: JSON.stringify({ data: { status: newStatus } }),
        headers,
        method: "PUT",
        signal,
      },
      []
    );
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export async function assignStatus(reservation_id, status, signal, onCancel) {
  try {
    const url = new URL(
      `${API_BASE_URL}/reservations/${reservation_id}/status`
    );

    return await fetchJson(
      url,
      {
        body: JSON.stringify({ data: { status } }),
        headers,
        method: "PUT",
        signal,
      },
      []
    );
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export async function updateReservation(newRes, signal, reservation_id, onCancel) {
  try {
    const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
    return await fetchJson(
      url,
      {
        body: JSON.stringify({ data: newRes }),
        headers,
        method: "PUT",
        signal,
      },
      []
    );
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}
