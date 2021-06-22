import { logout_view } from "./Authentication.js";  
export let loop;  
let user_name;
export function load_chat_page(){

    document.querySelector("#authentication").style.display="none";
    document.querySelector("#chat_page").style.display="block"; 
    document.querySelector("#default-page").style.display="block";
    document.querySelector("#chat-display").style.display="none";  
    document.querySelector("#profile-page").style.display="none";
    document.querySelector("#create_group").style.display="none";

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


   fetch("get_user_details").then(response=>response.json()).then(e=>{
       user_name=e.username;
       document.querySelector("#user_title").innerHTML=`${e.username}`;
   })
    

   document.querySelector("#create-group-btn").onclick=()=>{
       create_group();
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
       if(element.type=="group"){
        img.src="https://image.flaticon.com/icons/png/128/921/921347.png";
       }
       else{
        img.src="https://image.flaticon.com/icons/png/128/3011/3011270.png";
       }
       img.className="user_pic";

       var demo_text=document.createElement("div");
       demo_text.className="demo-text";
       demo_text.innerHTML=element.username
        if(element.status==true){
            demo_text.style.fontWeight="1000";
        }

       contact.appendChild(img);
       contact.appendChild(demo_text);
       contact.style.cursor="pointer";
       contact.onclick=()=>{
           
           clearInterval(loop);
           demo_text.style.fontWeight="100";
           fetch(`/set_read_status/${element.username}`)
           update_scroll(false);
         load_msg_page(element.username,element.type,element.admin) 
       }
       contact_list.appendChild(contact);

    });
}

function load_msgs(msgs,user){

    var msg_page=document.querySelector("#messages");
    msg_page.innerHTML="";
    msgs.forEach(element=>{
    var author=document.createElement("div");
    author.style.fontWeight="700";
    author.style.color="orange";

    var text=document.createElement("div");
    text.classList.add("msg-text");

    var time=document.createElement("div");
    time.classList.add("msg-time")

    var date=document.createElement("div");
    date.classList.add("msg-date");

        text.innerHTML=element.message;
        time.innerHTML=element.time;
        date.innerHTML=element.date;

       if(element.sender==user_name){
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
        author.innerHTML=element.sender;

        msg.appendChild(author);
        msg.appendChild(text);
        msg.appendChild(time);
        msg.appendChild(date);  

       }
       msg_page.appendChild(msg);
   })
}


 


function load_msg_page(user,c_type,admin){  
    document.querySelector("#authentication").style.display="none";
    document.querySelector("#chat_page").style.display="block"; 
    document.querySelector("#default-page").style.display="none";
    document.querySelector("#chat-display").style.display="block";
    document.querySelector("#create_group").style.display="none";
    console.log(c_type);
    if(c_type==="group"){
        document.querySelector("#display-pic").src="https://image.flaticon.com/icons/png/128/921/921347.png";
    }
    else{
        document.querySelector("#display-pic").src="https://image.flaticon.com/icons/png/128/3011/3011270.png";
    }
    document.querySelector("#username").innerHTML=user;
    
    if(c_type=="group"){
        document.querySelector("#leave-delete").style.display="block";
        if(admin===user_name){
            document.querySelector("#leave-delete").innerHTML="Delete Group";
            document.querySelector("#leave-delete").onclick=()=>{
                fetch(`leave_delete/delete/${user}`).then(response=>response.json()).then(e=>{
                    alert(e.Message);
                    load_chat_page();
                })
            }
        }
        else{
            document.querySelector("#leave-delete").innerHTML="Leave Group";
            document.querySelector("#leave-delete").onclick=()=>{
                fetch(`leave_delete/leave/${user}`).then(response=>response.json()).then(e=>{
                    alert(e.Message);
                    load_chat_page();
                })
            }
        }   
    }
    else{
        document.querySelector("#leave-delete").style.display="none";

    }
    

    document.querySelector("#send-btn").onclick=(e)=>{
       
            fetch(`/set_messages/${c_type}`,{
                method:"POST",
                body:JSON.stringify(
                    {
                        message:document.querySelector("#msg-box").value,
                        receiver:user,
                        type:c_type
                    }
                )
            }).then(response=>response.json()).then(e=>{
                document.querySelector("#msg-box").value="";
            })
      
        
    }   
    

    loop=setInterval(function(){
        fetch(`/get_messages/${user}/${c_type}`).then(response=>response.json()).then(e=>{ 
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


export function create_group(){
    document.querySelector("#authentication").style.display="none";
    document.querySelector("#chat_page").style.display="none"; 
    document.querySelector("#default-page").style.display="none";
    document.querySelector("#chat-display").style.display="none";  
    document.querySelector("#profile-page").style.display="none"; 
    document.querySelector("#create_group").style.display="block";

    fetch("/get_friends").then(response=>response.json()).then(e=>{
        load_members(e);
    })

    document.querySelector("#save-group-btn").onclick=()=>{

        var arr=[];
        var i=-1;
       document.querySelector("#mem-list").childNodes.forEach(e=>{
            if(e.querySelector(".select-member").checked){
                arr.push(e.childNodes[1].innerHTML);
            }
       })
       


     fetch("create_group",{
            method:"POST",
            body:JSON.stringify({
                group_title:document.querySelector("#group-title").value,
                members:arr
            })
        }) 
    }

    document.querySelector("#cancel-group-btn").onclick=()=>{
        load_chat_page();
    }


}

function load_members(e){
    var mem_list=document.querySelector("#mem-list");
    mem_list.innerHTML="";
    var i=0;
    e.forEach(element=>{
         var mem_wrap=document.createElement("div");
         mem_wrap.classList.add("add_member");

         var mem_user=document.createElement("input");
         mem_user.type="checkbox";
         mem_user.classList.add("select-member");
         mem_user.id=`${i}`;
        

         var mem_name=document.createElement("label");
         mem_name.for=`${i}`;
         mem_name.innerHTML=`${element.username}`;
         mem_name.style.marginLeft="1.5vw";
         i++;

         mem_wrap.appendChild(mem_user);
         mem_wrap.appendChild(mem_name);
         mem_list.appendChild(mem_wrap);

    })
}

export function load_profile(){
    
    document.querySelector("#authentication").style.display="none";
    document.querySelector("#chat_page").style.display="none"; 
    document.querySelector("#default-page").style.display="none";
    document.querySelector("#chat-display").style.display="none";  
    document.querySelector("#profile-page").style.display="block"; 
    document.querySelector("#create_group").style.display="none";

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