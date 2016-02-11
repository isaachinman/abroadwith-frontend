module.exports = function (req, res, next, value) {
  if(isNaN(value) || parseInt(Number(value)) != value || isNaN(parseInt(value, 10))){
    res.status(404).send('Sorry, we cannot find that!');
    return;
  }
  var user_path = "../../mockups/homes/"+value+".json";
  console.log(user_path);
  try{
    req.home = require(user_path);
  }
  catch(e){
    res.status(404).send('Sorry, we cannot find that!');
    return;
  }
  next();
}
