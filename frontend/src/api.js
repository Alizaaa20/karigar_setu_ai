const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Calls backend Module B/C endpoint with the voice transcript and
 * returns the generated catalog listing.
 */
export async function generateListing(transcript) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/generate-listing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
    });
  } catch (networkErr) {
    throw new Error('Could not reach the server. Is the backend running?');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Server error (${response.status})`);
  }

  return response.json(); // { listing, baseline, quotedPrice, warning? }
}

/**
 * Saves a catalog item to MongoDB database.
 */
export async function saveCatalog(productData) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/catalog/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
  } catch (networkErr) {
    throw new Error('Could not reach backend server to save catalog.');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Failed to save catalog (${response.status})`);
  }

  return response.json(); // { success: true, product }
}

/**
 * Fetches all saved products from MongoDB database.
 */
export async function getSavedCatalogs() {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/catalog`);
  } catch (networkErr) {
    throw new Error('Could not fetch catalogs. Server unreachable.');
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch saved catalogs (${response.status})`);
  }

  return response.json(); // { success: true, products }
}

/**
 * Updates isPushedToONDC status to true for a given product ID in MongoDB.
 */
export async function updateOndcStatus(id) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/catalog/${id}/ondc`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (networkErr) {
    throw new Error('Could not connect to update ONDC status.');
  }

  if (!response.ok) {
    throw new Error(`Failed to update ONDC status (${response.status})`);
  }

  return response.json(); // { success: true, product }
}
