//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-satwik:test123@cluster0.qmwum.mongodb.net/todolistdb-new", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true ,useFindAndModify: false});

const  item_schema = {

name:{
  type:String,
  reuired:true
}

};

const list_schema = {
  name:String,
  list_items : [item_schema]
};


const item_object = mongoose.model("item",item_schema);
const list_object = mongoose.model("list",list_schema);

const item1 = new item_object({
  name:"welcome to todo-list"
});
const item2 = new item_object({
  name:"click + to add new to the list"
});
const item3 = new item_object({
  name:"click on checkbox to delete any item"
});

const default_item = [item1,item2,item3];

app.get("/", function(req, res) {

  item_object.find({},function(err,result){
    if(err){
      console.log(err);
    }else{
      if(result.length===0){

        item_object.insertMany(default_item,function(err){
        if(err){
          console.log(er);
        }
        else{
          console.log("successfully saved to DB.");
        }

        });
      }


      console.log(result);
    }


    res.render("list", {listTitle: "today", newListItems: result});


  });


});

app.post("/delete",function(req,res){



if(req.body.listname==="today"){
  const delete_item_id = req.body.delete_id;

  console.log(delete_item_id);

  item_object.deleteOne({_id:delete_item_id},function(err){
    if(err){
      console.log(err);
    }else{
      console.log("successfully deleted!");
    }
  })
res.redirect("/");
}else{
list_object.findOneAndUpdate({name:req.body.listname},{$pull:{list_items : {_id:req.body.delete_id}}},function(err,found){
if(!err){
  res.redirect("/"+req.body.listname);
}


});

}


});





app.post("/", function(req, res){

  const item_name = req.body.newItem;

 const item1 = new item_object({
   name:item_name
 });
// default_item.push(item1);
if(req.body.list === "today"){
  item1.save();

  res.redirect("/");

}else{
  list_object.findOne({name:req.body.list},function(err,found){
   found.list_items.push(item1);
console.log(found);
found.save();
res.redirect("/"+req.body.list);

});

}

});

app.get("/:customlistname",function(req,res){
const customlistname = _.capitalize(req.params.customlistname);


list_object.findOne({name:customlistname},function(err,found){

if(!err){
  if(!found){
    const list_new = new list_object({

    name : customlistname,
    list_items : default_item

    });
    list_new.save();
    res.redirect("/"+customlistname);
  }else{
    res.render("list",{listTitle:customlistname , newListItems : found.list_items});
  }
}

})



});





app.get("/about", function(req, res){
  res.render("about");
});


// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3000;
// }
// app.listen(port);
//

app.listen(process.env.PORT);


// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });
