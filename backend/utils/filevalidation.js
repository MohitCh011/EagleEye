export const validateImageFile = (file) => {
    if (!file) return false;
    
    // Check if it's an image file
    if (!file.type.startsWith('image/')) {
      return "Please upload an image file";
    }
    
    // Check file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return "File size should be less than 5MB";
    }
    
    return true;
  };