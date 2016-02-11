module.exports = function (req, res, next, value) {
  if(isNaN(value) || parseInt(Number(value)) != value || isNaN(parseInt(value, 10))){
    res.status(404).send('Sorry, we cannot find that!');
    return;
  }
  var home_path = "../../mockups/homes/"+value+".json";
  console.log(home_path);
  try{
    req.home_info = require(home_path);
  }
  catch(e){
    res.status(404).send('Sorry, we cannot find that!');
    return;
  }
  next();
}
