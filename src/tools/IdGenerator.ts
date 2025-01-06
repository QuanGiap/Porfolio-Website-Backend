export default function generateFileId() {
    // Using the built-in Date object for a timestamp-based ID
    const timestamp = Date.now(); 
  
    // Adding a random component to ensure uniqueness
    const randomString = Math.random().toString(36).substring(7); 
  
    // Combining the timestamp and random string to create the ID
    const fileId = `${timestamp}-${randomString}`; 
    
    return fileId;
}

export function isValidId(ids:string){
    try{
        const testId = generateFileId();
        if(ids.length != testId.length) return false;
        const id_split = ids.split('-');
        if(id_split.length!==2) return false;
        return !Number.isNaN(id_split[0]);        ;
    }catch(err){
        console.log(err);
        return false;
    }
}