/**
 * Check if id is a valid objectID
 * @param id string
 * @returns bool
 */
export default function(id=''){
    const regexId = /^[a-fA-F0-9]{24}$/;
    if(!id) return false;
    return regexId.test(id);
}