module.exports = {
  selectOption : function (status, options) {

    return options.fn(this).replace(new RegExp('value=\"'+status+'\"'), '$&selected="selected"');
  },
  //checking if uploaded file is empty
  isEmpty: function(obj) {
    for(let key in obj){
      if(obj.hasOwnProperty(key)){
        return false;
      }
    }
    return true;
  },

isUserAuthenticated:(req,res,next)=> {
  //check to see if user is Authenticated before allowing access
  if(req.isAuthenticated()){
    next();
  }
  else{
    res.redirect('/login');
  }
}


};
