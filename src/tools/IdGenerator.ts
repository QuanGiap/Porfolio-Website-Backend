export default function generateFileId() {
    // Using the built-in Date object for a timestamp-based ID
    const timestamp = Date.now(); 
  
    // Adding a random component to ensure uniqueness
    const randomString = Math.random().toString(36).substr(2, 9); 
  
    // Combining the timestamp and random string to create the ID
    const fileId = `${timestamp}-${randomString}`; 
  
    return fileId;
}