import { logout_view } from "./Authentication.js";  
export let loop;  
export function load_chat_page(){

    document.querySelector("#authentication").style.display="none";
    document.querySelector("#chat_page").style.display="block"; 
    document.querySelector("#default-page").style.display="block";
    document.querySelector("#chat-display").style.display="none";  
    document.querySelector("#profile-page").style.display="none";

    document.querySelector("#logout").onclick=()=>{
        logout_view();
    }

    var c_loop=setInterval(get_list(),1000)

    document.querySelector("#search-bar").onkeypress=(e)=>{
        document.querySelector("#back-button-search").style.display="block";
        if(e.key=="Enter"){
            clearInterval(c_loop); 

            get_contacts(document.querySelector("#search-bar").value);

            
        }
        document.querySelector("#back-button-search").onclick=()=>{
            document.querySelector("#search-bar").value="";
            document.querySelector("#back-button-search").style.display="none";
            document.querySelector("#search-bar").style.border="solid gray";
            setInterval(get_list(),1000);
        }
    } 

    
    document.querySelector("#dropdown").style.display="none";
    var clicked=true;
    document.querySelector("#three-dots").onclick=()=>{
        if(clicked){
             document.querySelector("#dropdown").style.display="block"; 
             document.querySelector("#profile-div").onclick=()=>{
                 load_profile();
             }
             clicked=false;
        }
        else{
            document.querySelector("#dropdown").style.display="none";
             clicked=true;
        }
    }
    
    document.querySelector("#msg-box").onkeydown=(e)=>{
        
         if(document.querySelector("#msg-box").value.length==0){
                document.querySelector("#msg-box").style.border="solid gray";
            }
         else{
            console.log(document.querySelector("#msg-box").value.length);
            document.querySelector("#msg-box").style.border="solid white";
        }   
    }

    document.querySelector("#search-bar").onkeydown=(e)=>{
        
        if(document.querySelector("#search-bar").value.length==0){
               document.querySelector("#search-bar").style.border="solid gray";
           }
        else{
           console.log(document.querySelector("#search-bar").value.length);
           document.querySelector("#search-bar").style.border="solid white";
       }   
   }
    
   
}


function get_list(){
    fetch("/get_friends").then(response=>response.json()).then(e=>{
        load_contacts(e);
    }) 
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
        if(element.status==false){
            demo_text.style.fontWeight="bolder";
        }

       contact.appendChild(img);
       contact.appendChild(demo_text);
       contact.style.cursor="pointer";
       contact.onclick=()=>{
           clearInterval(loop);
           demo_text.style.fontWeight="none";
           fetch(`/set_read_status/${element.username}`)
           update_scroll(false);
         load_msg_page(element.username) 
       }
       contact_list.appendChild(contact);

    });
}

function load_msgs(msgs,user){

    var msg_page=document.querySelector("#messages");
    msg_page.innerHTML="";
   msgs.forEach(element=>{
    var text=document.createElement("div");
    text.classList.add("msg-text");

    var time=document.createElement("div");
    time.classList.add("msg-time")

    var date=document.createElement("div");
    date.classList.add("msg-date");

        text.innerHTML=element.message;
        time.innerHTML=element.time;
        date.innerHTML=element.date;

       if(element.receiver==user){
           var msg=document.createElement("div");
           msg.classList.add("msg-wrap");
           msg.classList.add("msg-wrap-sender");  
           
           
           

           msg.appendChild(text);
           msg.appendChild(time); 
           msg.appendChild(date);
       }
       else{
        var msg=document.createElement("div"); 
        msg.classList.add("msg-wrap");
        msg.classList.add("msg-wrap-receiver");  

        

      

        msg.appendChild(text);
        msg.appendChild(time);
        msg.appendChild(date); 

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
    
   update_scroll(false);
     
}

 
function update_scroll(scrolled){
    if(!scrolled){
        var element=document.querySelector("#messages");
        element.scrollTop=element.scrollHeight;
    }
}


export function load_profile(){
    
    document.querySelector("#authentication").style.display="none";
    document.querySelector("#chat_page").style.display="none"; 
    document.querySelector("#default-page").style.display="none";
    document.querySelector("#chat-display").style.display="none";  
    document.querySelector("#profile-page").style.display="block"; 
    document.querySelector("#back-button").onclick=()=>{
        load_chat_page();
    } 
    fetch("/get_user_details").then(response=>response.json()).then(e=>{
         document.querySelector("#edit-username").value=e.username;
         document.querySelector("#edit-email").value=e.Email;
         document.querySelector("#edit-first").value=e.first_name;
         document.querySelector("#edit-second").value=e.second_name;
    })

    document.querySelector("#save-changes").onclick=()=>{
        fetch("/get_user_details",{
            method:"POST",
            body:JSON.stringify({
                username:document.querySelector("#edit-username").value,
                Email:document.querySelector("#edit-email").value,
                first_name:document.querySelector("#edit-first").value,
                last_name:document.querySelector("#edit-second").value
            })
        }).then(response=>response.json()).then(e=>{alert(e.Message)})
    }
}