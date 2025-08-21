// A key to store our locations array in localStorage
const STORAGE_KEY = 'fms-device-locations';

/**
 * Retrieves all stored device locations from localStorage.
 * @returns {Array} An array of location objects.
 */
export const getAllLocations = () => {
  const locationsJSON = localStorage.getItem(STORAGE_KEY);
  return locationsJSON ? JSON.parse(locationsJSON) : [];
};

/**
 * Adds or updates a user's location in the localStorage list.
 * @param {Object} user - The user object, must contain a unique identifier like `email` or `username`.
 * @param {Object} coords - An object with `latitude` and `longitude`.
 */
export const updateUserLocation = (user, coords) => {
  const allLocations = getAllLocations();
  
  const userIdentifier = user.username || user.email; // Use username or email as the unique ID

  const existingUserIndex = allLocations.findIndex(
    loc => loc.username === userIdentifier
  );

  const newLocationEntry = {
    id: userIdentifier, // Use the identifier as a unique ID
    username: userIdentifier,
    lat: coords.latitude,
    lng: coords.longitude,
    timestamp: new Date().toISOString(), // Store the current time
  };

  if (existingUserIndex > -1) {
    // If user exists, update their entry
    allLocations[existingUserIndex] = newLocationEntry;
  } else {
    // If user is new, add them to the list
    allLocations.push(newLocationEntry);
  }

  // Save the updated array back to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allLocations));
};