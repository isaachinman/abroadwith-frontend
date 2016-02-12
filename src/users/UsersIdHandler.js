var transformToStars = function(user){
  var rating = (Math.round(user.rating * 2) / 2).toFixed(1);
  var stars = [];

  var starRemainder = Math.floor(5 - rating);

  while (rating > 0) {
    if (rating >= 1) {
  	   stars.push('<i class="fa fa-star" > </i>')
    }
    else if (rating == 0.5) {
  	   stars.push('<i class="fa fa-star-half-o" > </i>')
    }
    rating--;
  }

  while (starRemainder > 0) {
    stars.push('<i class="fa fa-star-o" > </i>')
    starRemainder--;
  }
  return stars.join('');
}

module.exports = function (req, res, next, value) {
  if(!req.context) req.context = {};
  if(isNaN(value) || parseInt(Number(value)) != value || isNaN(parseInt(value, 10))){
    res.status(404).send('Not a proper user id.');
    return;
  }
  var user_path = "../../mockups/users/"+value+".json";
  try{
    req.context.user = require(user_path);
    req.context.user.ratingHTML = transformToStars(req.context.user);
  }
  catch(e){
    res.status(404).send('User not found.');
    return;
  }
  next();
}
