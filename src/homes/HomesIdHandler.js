module.exports = function (req, res, next, value) {
  if(!req.context) req.context = {};
  if(isNaN(value) || parseInt(Number(value)) != value || isNaN(parseInt(value, 10))){
    res.status(404).send('Not a proper home id.');
    return;
  }
  var home_path = "../../mockups/homes/"+value+".json";
  try{
    req.context.home = require(home_path);
  }
  catch(e){
    res.status(404).send('Home not found.');
    return;
  }
  next();
}
