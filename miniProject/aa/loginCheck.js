




function login(){
    const email =document.getElementById('email').value ;
    const password = document.getElementById('password').value ;
    localStorage.setItem('username', email);
    localStorage.setItem('password', password);
    
    console.log(email , password);
    if(validEmail == email && validPassword==password){
        window.location.href="homePage.html";
    }else{
        console.log("error");
    }
}

