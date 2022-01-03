class MainError extends Error{

    constructor(errorMessage, errorType=''){
        super()
       
        this.name = this.constructor.name
        this.message = errorMessage

        switch(this.constructor.name){
            case 'AuthenticationError':
                if(errorType == 0){
                    this.statusCode = 400
                }else if(errorType == 1){
                    this.statusCode = 404
                }else{
                    this.statusCode = 401
                }
                break
            case 'UserError':
                if(errorType == 0){
                    this.statusCode = 404
                }else{
                    this.statusCode = 409
                }
                break
            case 'CocktailError':
                if(errorType == 0){
                    this.statusCode = 404
                }else{
                    this.statusCode = 409
                }
                break
            case 'RequestError':
                this.statusCode = 400
                break
            default:
                console.log('No handler for that')
        }

    }
}

class AuthenticationError extends MainError{}
class UserError extends MainError{}
class CocktailError extends MainError{}
class RequestError extends MainError{}

module.exports = { MainError, AuthenticationError, UserError, CocktailError, RequestError}