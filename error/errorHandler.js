const errorHandler = (err, req, res, next) => {

    // 0 - Message simple
    // 1 - Message sans error
    // 3 - Toutes les informations
    debugLevel = 0
    message = {}

    //console.log(err)

    switch(debugLevel){
        case 0:
            message = {message: err.message}
            if(err.name == 'SequelizeDatabaseError'){
                message = {message: 'Database Error'}
            }
            break
        case 1:
            message = {message: err.message}
            break;
        case 2:
            message = {message: err.message, error: err}
            break;
        default:
            console.log('bad debugLevel')
    }


    return res.status(err.statusCode || 500).json(message)
}

module.exports = errorHandler