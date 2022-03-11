 const apiMessage ={
    CREATE: {
        message:"Create successfully!",
        StatusCodes:201

    },
    UPDATE: {
        message:"Update successfully!",
        StatusCodes:200
    },
    DELETE: {
        message:"Delete successfully!",
        StatusCodes:200
    },
    SERVER_ERROR: {
        message:"Server Error",
        StatusCodes:500
    },
    BAD_REQUEST: {
        message:"BAD_REQUEST",
        StatusCodes:400
    },
    INVALID_TOKEN:{
        message:"Invalid Token",
        StatusCodes:401
    }
    

}
export default apiMessage;