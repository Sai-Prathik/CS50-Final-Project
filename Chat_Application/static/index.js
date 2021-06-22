import {load_login} from "./Authentication.js";  
import {load_chat_page} from "./Chat.js"; 
import {load_profile} from "./Chat.js";
import {create_group} from "./Chat.js"; 
document.addEventListener("DOMContentLoaded",()=>{
    
    fetch("/get_status").then(response=>response.json()).then(e=>{
        if(e.status){
            load_chat_page();
        }
        else{
            load_login();
        }
        
    })
    
})
 