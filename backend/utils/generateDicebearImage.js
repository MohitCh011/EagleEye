/**
 * Generates a Dicebear avatar URL with initials based on the provided name and a dark blue background.
 * 
 * @param {string} name - The name to generate the avatar for.
 * @returns {string} - The URL of the Dicebear avatar with initials.
 */
const generateDicebearImage = (name) => {
    const baseUrl = "https://api.dicebear.com/5.x/initials/svg";
    const seed = encodeURIComponent(name.trim()); // Ensure the name is URL-safe
    const backgroundColor = "2e4053"; // Dark blue background (hex without #)
    const size = 128; // Avatar size in pixels

    // Construct the URL with query parameters
    return `${baseUrl}?seed=${seed}&backgroundColor=${backgroundColor}&size=${size}`;
};

module.exports = generateDicebearImage;
