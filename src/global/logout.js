function logOut() {

  console.log('logging out')

  // If a JWT is in localStorage, delete it
  localStorage.getItem('JWT') !== null ? localStorage.removeItem('JWT') : null;

  location.reload();

}

$('.logout-btn').click(function() {
  console.log('test')
  logOut()
})
