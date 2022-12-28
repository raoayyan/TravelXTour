module.exports = ftn =>{
    return (req,res,next)=>{
        ftn(req,res,next).catch(next)
    }
}