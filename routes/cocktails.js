/***********************************/
/*** Import des module nécessaires */
const express = require('express')
const checkTokenMiddleware = require('../jsonwebtoken/check')
const cocktailCtrl = require('../controllers/cocktail')

/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router()

/*********************************************/
/*** Middleware pour logger dates de requete */
router.use( (req, res, next) => {
    const event = new Date()
    console.log('Cocktail Time:', event.toString())
    next()
})

/**************************************/
/*** Routage de la ressource Cocktail */

router.get('', cocktailCtrl.getAllCocktails)

router.get('/:id', cocktailCtrl.getCocktail)

router.put('', cocktailCtrl.addCocktail)

router.patch('/:id', cocktailCtrl.updateCocktail)

router.post('/untrash/:id', cocktailCtrl.untrashCocktail)
    
router.delete('/trash/:id', cocktailCtrl.trashCocktail)

router.delete('/:id', cocktailCtrl.deleteCocktail)

module.exports = router