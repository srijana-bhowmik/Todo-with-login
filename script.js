function gotologin(){
    window.location.href="login.html"
}

function gotoregister(){
    window.location.href="createacc.html"
}


function login(){
    let user=document.getElementById("Username").value;
    let pass=document.getElementById("Password").value;

    let saved=localStorage.getItem("users");

    if(!saved){
        document.getElementById("msg").innerText="No users found, please register first";
        return;
    }
    saved=JSON.parse(saved);   //string to array of objects

    if(user=="" || pass==""){
        document.getElementById("msg").innerText="Please fill all the fields";
        return;
    }

    // Check if user exists in array
    let found = false; 
    for(let i=0;i<saved.length;i++){
        if(saved[i].username==user && saved[i].password==pass){
            found=true;
            break;
        }
    }

    if(found){
        document.getElementById("msg").innerText = "Login successful"; 
        localStorage.setItem("loggedInUser", user); 
        window.location.href = "todo.html";
    } else {
        document.getElementById("msg").innerText = "Invalid username or password";
    }
}

function register(){
    let user=document.getElementById("Username").value;
    let pass=document.getElementById("password").value;
    let repass=document.getElementById("repassword").value;

    if(pass!=repass){
        document.getElementById("msg").innerHTML="Passwords do not match.. try again!";
        return;
    }

    if(user=="" || pass==""){
        document.getElementById("msg").innerText="Please fill all the fields";
        return;
    }

    let saved=localStorage.getItem("users");
     if(saved){
        saved = JSON.parse(saved); // convert string -> array of objects
    } else {
        saved = []; // if no users yet, start with empty array
    }
    
    let jsonobj={
        username: user,
        password:pass 
    };

      for(let i in saved){
        if(saved[i].username == user && saved[i].password == pass){
            document.getElementById("msg").innerText = "User already exists, please login";
            return;
        }
        else if(saved[i].username == user){
            document.getElementById("msg").innerText = "Username already exists, please try again";
            return;
        }
    }

    saved.push(jsonobj);

    localStorage.setItem("users",JSON.stringify(saved)); //array of objects to string
    document.getElementById("msg").innerText="Registration successful, please login. Redirecting ...";
    setTimeout(()=>{
        window.location.href="login.html";
    },1000);   
}







//todo js
function newElement(){ 
    let user=localStorage.getItem("loggedInUser"); //get logged in user

    let myinput=document.getElementById("myInput").value;
    let ul=document.getElementById("mytasks");
    let task=localStorage.getItem("tasks"+user);  //get tasks for the logged in user

    if(myinput.trim()==""){
            document.getElementById("text").innerText="You must write something!";
        return;
    }  
    if(task){
        task=JSON.parse(task);                  //string to array of objects
    }
    else{
        task=[];
    }

    for (let i = 0; i < task.length; i++) {
        if (task[i].text == myinput) {
            document.getElementById("text").innerText = "Task already exists!";
            setTimeout(function() {
                document.getElementById("text").innerText = "";
            }, 2000);
            return;
        }
    }
    
    let li=document.createElement("li");
    let checkbox=document.createElement("input");
    checkbox.type="checkbox";
    checkbox.checked=false;
    let deletebtn=document.createElement("button");
    deletebtn.innerText="❌";
    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(myinput));
    li.appendChild(deletebtn);
    ul.appendChild(li);


    let taskobj={
        text:myinput,
        done:false
    };
    task.push(taskobj);                                  //add new task object to array
    localStorage.setItem("tasks" + user,JSON.stringify(task));  //array of objects to string

    document.getElementById("myInput").value="";


    checkbox.addEventListener("change", function () {       //checkbox event listener
        if (checkbox.checked) {
            li.style.textDecoration = "line-through";
            li.style.opacity = "0.6";
            for (let i = 0; i < task.length; i++) {
                if (task[i].text == myinput) {              //Each task has its own event listener, and each event listener remembers its own myinput
                    task[i].done = true;   
                    break;
                }
            }
        } else {                                            //if user unchecks the checkbox
            li.style.textDecoration = "none";
            li.style.opacity = "1";

            for (let i = 0; i < task.length; i++) {
                if (task[i].text == myinput) {   
                    task[i].done = false; 
                    break;
                }
            }
        }

        localStorage.setItem("tasks" + user, JSON.stringify(task));
    });


    deletebtn.addEventListener("click",function(){
        ul.removeChild(li);                                     //remove from UI
        for (let i = 0; i < task.length; i++) {                 //remove from local storage
            if (task[i].text == myinput) {   
                task.splice(i,1);                     //remove 1 element at index i from the array
                break;
            }
        }
        localStorage.setItem("tasks" + user, JSON.stringify(task));
    });
}

function logout(){
    window.location.href="login.html";
    localStorage.removeItem("loggedInUser");
}

window.onload = function () {
    let user = localStorage.getItem("loggedInUser"); 
    let nameBox = document.getElementById("usernameDisplay");
    let ul = document.getElementById("mytasks");
 
    if (!user && nameBox) {
        window.location.href = "login.html";
        return;
    }
 
    if (nameBox) {
        nameBox.innerText = user;
    } 
    if (ul) {
        let savedtasks = localStorage.getItem("tasks" + user);

        if (savedtasks) {
            savedtasks = JSON.parse(savedtasks);
            loadtask(savedtasks);
        }
    }
};

 

function loadtask(savedtasks){
    let user=localStorage.getItem("loggedInUser");
    let ul=document.getElementById("mytasks");

    for(let i=0;i<savedtasks.length;i++){

        let index = i;   // FIX: Capture correct index

        let li=document.createElement("li");
        let checkbox=document.createElement("input");
        checkbox.type="checkbox";
        checkbox.checked=savedtasks[i].done;
        let text=document.createTextNode(savedtasks[i].text);
        let deletebtn=document.createElement("button");
        deletebtn.innerText="❌";

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deletebtn);
        ul.appendChild(li);


        if(checkbox.checked==true){
            li.style.textDecoration = "line-through";
            li.style.opacity = "0.6";
        }

        // ---- checkbox functionality ----
        checkbox.addEventListener("change", function () {
            savedtasks[index].done = checkbox.checked;
            if (savedtasks[index].done) {
                li.style.textDecoration = "line-through";
                li.style.opacity = "0.6";
            } else {
                li.style.textDecoration = "none";
                li.style.opacity = "1";
            }
            localStorage.setItem("tasks" + user, JSON.stringify(savedtasks));
        });

        // ---- delete functionality ----
        deletebtn.addEventListener("click", function () {
            ul.removeChild(li); 
            savedtasks.splice(index,1);    
            localStorage.setItem("tasks" + user, JSON.stringify(savedtasks));
        });
    }
}