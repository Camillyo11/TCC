const responseHandler = 
{
    success: (res,data,message = 'Sucesso',statusCode = 200) =>
    {
        res.status(statusCode).json(
            {
                success: true,
                message,
                data
            }
        );
    },
    error: (res, error, statusCode = 500) =>
    {
        console.error(error);
        res.status(statusCode).json(
            {
                success: false,
                message: error.message || "Internal Server Error"
            }
        );
    }
};

module.exports = responseHandler;