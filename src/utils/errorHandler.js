const errorHandler = (err, req, res, next)=>{
    console.log(err);

    if(err.name==="ValidationError"){
        const messages = Object.values(err.errors).map(val=>val.message);
        return res.status(400).json({
            success:false,
            message: messages.join(' ,')
        })
    }

    else if(err.code===11000){
        const field = Object.keys(err.keyValue);
        return res.status(400).json({
            success:false,
            message: `${field} already exists`
        });
    }

    else if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`
    });
  }

  else if(err.statusCode){
    return res.status(err.statusCode).json({
        success:false,
        message:err.message
    });
  }

  else{
    return res.status(500).json({
        success:false,
        message: 'Something went wrong'
    });
  }
}

module.exports = {
    errorHandler
}