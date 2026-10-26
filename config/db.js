const mongoose=require('mongoose');

 function connectTODB(){
      mongoose.connect(process.env.MONGODB_URI).then(()=>{
          console.log("Server is connected to db");
      }).catch(err=>{
           console.error("failed to connect",err.message);
           process.exit(1);
      })
  }
 
 module.exports=connectTODB;





