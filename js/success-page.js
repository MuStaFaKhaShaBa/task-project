$(document).ready(_=>{
   const emailVal= window.localStorage.getItem('userEmail');
    $('#email').text(emailVal);
})