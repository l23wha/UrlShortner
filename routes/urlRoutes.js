const express=require("express");
const Url=require("../models/url");
const {nanoid}=require("nanoid");
const router=express.Router();

//Create short url
router.post('/create',async(req,res)=>{
     try{
       const {url}=req.body;
       if(!url){
         return res.status(400).json({message:"Url is required for shortening"});
       }

        //Generate 6 to 8 character short code
        const shortId=nanoid(7);

        const newUrl=await Url.create({
              shortId,
             redirectURL:url
             
        });

        return res.status(201).json({
             message:"Short Url created successfully",
             shortId,
             shortUrl:`http://localhost:3000/${shortId}`,
             createdAt:newUrl.createdAt,
             updatedAt:newUrl.updatedAt
        });
    }catch(error){
         console.error(error);
          return res.status(500).json({message:"Internal server error"});
    }
});

// Now we have to retrieve the Original Url from a short url using the get method
//get /shorten/abc123
router.get('/shorten/:shortId',async(req,res)=>{

      try{
          const {shortId}=req.params;
           if(!shortId){
             return res.status(400).json({message:"Short Id is required to check whether it's exist or not."})
           }

             const urlRecord=await URL.findOneAndUpdate(
                 {shortId},
                 {$inc:{accessCount:1}},
                 {new:true}
             );
             
              if(!urlRecord){
                 return res.status(404).json({message:"Invalid short Id"});
              }

              const originalUrl=urlRecord.redirectURL;

              return res.redirect(302,originalUrl);
         
      }catch(error){
         console.error("Error redirecting:",error);
         return res.status(500).json({message:"Server error"});
      }
});


//Update shortenUrl

router.put('/shorten/:shortId',async (req,res)=>{
     try{
          const {shortId}=req.params;
           const {url}=req.body;
           if(!shortId || !url){
              return res.status(400).json({message:"both fields are required"});
           }

           const urlRecord=await Url.findOneAndUpdate(
             {shortId},
             {redirectURL:url},
            
             {new:true}
           );
           if(!urlRecord){
             return res.status(404).json({message:"failed to update"});
           }
           return res.status(200).json({
             id:urlRecord._id,
             url:urlRecord.redirectURL,
             shortCode:urlRecord.shortId,
             createdAt:urlRecord.createdAt,
             updatedAt:urlRecord.updatedAt
           });
     }catch(error){
          console.error("Error :",error.message);
          return res.status(500).json({message:"Internal Server error"});
     }
});


//Delete short url

router.delete('/shorten/:shortId',async (req,res)=>{
      try{
          const {shortId}=req.params;

          if(!shortId){
             return res.status(400).json({message:"ShortId or ShortCode is required to delete"});
          }

          const urlRecord=await Url.findOneAndDelete({shortId});
           if(!urlRecord){
             return res.status(404).json({message:"No record found with this shortId"});
           }

           return res.status(204).json({message:"Deleted Successfully"});
      }catch(error){
         console.error(error);
          return res.status(500).json({message:"Internal Server error"});
      }
});

router.get('/shorten/:shortId/stats',async (req,res)=>{
      try{
          const {shortId}=req.params;
           
          if(!shortId){
             return res.status(400).json({message:"Short ID is required"});

          }

          const urlRecord=await Url.findOne({shortId});
          if(!urlRecord){
             return res.status(404).json({message:"Short url not found"});
          }

          return res.status(200).json({
             shortCode:urlRecord.shortId,
             originalUrl:urlRecord.redirectURL,
             accessCount:urlRecord.accessCount,
             createdAt:urlRecord.createdAt,
             updatedAt:urlRecord.updatedAt
          });
         
      }catch(error){
         console.log(error);
          return res.status(500).json({message:"Internal server error"});
      }
})

module.exports=router;