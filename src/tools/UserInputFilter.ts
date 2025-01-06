/**
 * clear out any key-value pair that value is undefined 
 * @param user_input
 * @return new obj that is filtered 
 */
export default function UserInputFilter(user_input:{[key:string]:any}){
    const dataUpdate:{[key:string]:any} = {};
    Object.entries(user_input).forEach(([key,value])=>{
        if(value!==undefined){
            dataUpdate[key]=value;
        }
    })
    return dataUpdate;
}