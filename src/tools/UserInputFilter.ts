/**
 * clear out any key-value pair that value is undefined 
 * @param user_input
 * @return new obj that is filtered 
 */
export default function UserInputFilter(user_input:{[key:string]:any},key_not_include:string[]=[]){
    const dataUpdate:{[key:string]:any} = {};
    const set = new Set(key_not_include);
    Object.entries(user_input).forEach(([key,value])=>{
        if(value!==undefined && !set.has(key)){
            dataUpdate[key]=value;
        }
    })
    return dataUpdate;
}