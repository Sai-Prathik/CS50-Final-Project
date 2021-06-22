import { load_chat_page } from "./Chat.js";
import {loop} from "./Chat.js";

export function load_login(){
     
    var toggle_btn=document.querySelector
    ("#toggle");

    var input_field=document.querySelector("#login-input");

    var pwd=document.querySelector("#login-password");

    document.querySelector("#login").style.display="block";
    document.querySelector("#profile-page").style.display="none";
    document.querySelector("#chat_page").style.display="none";
    document.querySelector("#Title").innerHTML="Login";
    document.querySelector("#create_group").style.display="none";
    document.querySelector("#register").style.display="none";

    toggle_btn.innerHTML="New here? Signup";
    toggle_btn.onclick=()=>{ 
        load_signup();
    } 
    document.querySelector("#login_form").onsubmit=(e)=>{
        e.preventDefault(); 
        fetch("/login",{
            method:"POST",
            body:JSON.stringify({
                username:input_field.value,
                password:pwd.value
            }) 
        }).then(response=>response.json()).then(e=>{  
            alert(e.Message);
            input_field.value="";
            pwd.value=""; 
            if(e.status){  
                load_chat_page();
            }
            else{
                load_login();
            }
        
        }); 
        

    } 
}


export function load_signup(){
    var toggle_btn=document.querySelector("#toggle");

    var mail=document.querySelector("#register-mail");
    document.querySelector("#chat_page").style.display="none";
    var username=document.querySelector("#register-username");

    var pwd=document.querySelector("#register-pwd");

    var cpwd=document.querySelector("#register-cpwd");

    var first_name=document.querySelector("#first-name");

    var last_name=document.querySelector("#last-name");


    document.querySelector("#login").style.display="none";
    document.querySelector("#profile-page").style.display="none";
    document.querySelector("#register").style.display="block";
    document.querySelector("#create_group").style.display="none";

    document.querySelector("#Title").innerHTML="Sign Up";

    toggle_btn.innerHTML="Already have an account? Login";

    document.querySelector("#register_form").onsubmit=(e)=>{
         e.preventDefault();
         if(pwd.value==cpwd.value){
            fetch("/register",{
                method:"POST",
                body:JSON.stringify({
                    mail:mail.value,
                    username:username.value,
                    password:pwd.value,
                    first_name:first_name.value,
                    last_name:last_name.value
                })
            }).then(response=>response.json()).then(e=>{
                alert(e.Message);
                mail.value="";
                username.value="";
                pwd.value="";
                cpwd.value="";
                first_name.value="";
                last_name.value="";
            })
         }
         else{
             alert("Passwords must match");
         }
          
         
    }
    toggle_btn.onclick=()=>{ 
        load_login();
    }
}

export function logout_view(){
    fetch("/logout").then(response=>response.json()).then(e=>{
        alert("logged out");
        clearInterval(loop);
        document.querySelector("#authentication").style.display="block";
        load_login();
    })
    
}