import { logout_view } from "./Authentication.js"; 

let loop; 
export function load_chat_page(){

    document.querySelector("#authentication").style.display="none";
    document.querySelector("#chat_page").style.display="block"; 
    document.querySelector("#default-page").style.display="block";
    document.querySelector("#chat-display").style.display="none"; 
    document.querySelector("#logout").onclick=()=>{
        logout_view();
    }

     fetch("/get_friends").then(response=>response.json()).then(e=>{
         load_contacts(e);
     })

    document.querySelector("#search-bar").onkeypress=(e)=>{
        if(e.key=="Enter"){
            console.log("Entered");
            get_contacts(document.querySelector("#search-bar").value);
        }
    } 


   
}

function get_contacts(user){
    fetch(`/get_contacts/${user}`).then(response=>response.json()).then(e=>{
        load_contacts(e);
    });
}

function load_contacts(contacts){
    document.querySelector("#contact-list").innerHTML="";
    let contact_list=document.querySelector("#contact-list");
    contacts.forEach(element => {
       var contact=document.createElement("div"); 
       contact.className="item";

       var img=new Image()
       img.src="https://image.flaticon.com/icons/png/128/3011/3011270.png";
       img.className="user_pic";

       var demo_text=document.createElement("div");
       demo_text.className="demo-text";
       demo_text.innerHTML=element.username


       contact.appendChild(img);
       contact.appendChild(demo_text);
       contact.style.cursor="pointer";
       contact.onclick=()=>{
           clearInterval(loop);
         load_msg_page(element.username)
       }
       contact_list.appendChild(contact);

    });
}

function load_msgs(msgs,user){
    var msg_page=document.querySelector("#messages");
    msg_page.innerHTML="";
   msgs.forEach(element=>{
       if(element.receiver==user){
           var msg=document.createElement("div");
           msg.classList.add("msg-wrap");
           msg.classList.add("msg-wrap-sender");  

           var text=document.createElement("div");
           text.innerHTML=element.message;

           var time=document.createElement("div");
           time.innerHTML=element.time;

           msg.appendChild(text);
           msg.appendChild(time);

       }
       else{
        var msg=document.createElement("div"); 
        msg.classList.add("msg-wrap");
        msg.classList.add("msg-wrap-receiver");  

        var text=document.createElement("div");
        text.innerHTML=element.message;

        var time=document.createElement("div");
        time.innerHTML=element.time;

        msg.appendChild(text);
        msg.appendChild(time); 

       }
       msg_page.appendChild(msg);
   })
}


 


function load_msg_page(user){ 
    document.querySelector("#authentication").style.display="none";
    document.querySelector("#chat_page").style.display="block"; 
    document.querySelector("#default-page").style.display="none";
    document.querySelector("#chat-display").style.display="block";
    document.querySelector("#username").innerHTML=user; 
    document.querySelector("#send-btn").onclick=(e)=>{
       
            fetch("/set_messages",{
                method:"POST",
                body:JSON.stringify(
                    {
                        message:document.querySelector("#msg-box").value,
                        receiver:user
                    }
                )
            }).then(response=>response.json()).then(e=>{
                document.querySelector("#msg-box").value="";
                
            })
      
        
    }  

    
    

    loop=setInterval(function(){
        fetch(`/get_messages/${user}`).then(response=>response.json()).then(e=>{ 
            load_msgs(e,user);   
        })
    },100) 
     
}

 