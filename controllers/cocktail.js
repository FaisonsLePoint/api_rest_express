/***********************************/
/*** Import des module nécessaires */
const Cocktail = require('../models/cocktail')
const { RequestError, CocktailError } = require('../error/customError')

/**************************************/
/*** Routage de la ressource Cocktail */

exports.getAllCocktails = (req, res, next) => {
    Cocktail.findAll()
        .then(cocktails => res.json({ data: cocktails }))
        .catch(err => next(err))
}

exports.getCocktail = async (req, res, next) => {
    try {
        let cocktailId = parseInt(req.params.id)

        // Vérification si le champ id est présent et cohérent
        if (!cocktailId) {
            throw new RequestError('Missing parameter')
        }

        // Récupération du cocktail
        let cocktail = await Cocktail.findOne({ where: { idd: cocktailId }, raw: true })

        // Test si résultat
        if (cocktail === null) {
            throw new CocktailError('This cocktail does not exist !', 0)
        }

        // Renvoi du Cocktail trouvé
        return res.json({ data: cocktail })
    } catch (err) {
        next(err)
    }
}

exports.addCocktail = async (req, res, next) => {
    try {
        const { user_id, nom, description, recette } = req.body

        // Validation des données reçues
        if (!user_id || !nom || !description || !recette) {
            throw new RequestError('Missing parameter')
        }

        // Vérification si le coktail existe
        let cocktail = await Cocktail.findOne({ where: { nom: nom }, raw: true })
        if (cocktail !== null) {
            throw new CocktailError(`The cocktail ${nom} already exists !`, 1)
        }

        // Céation du cocktail
        cocktail = await Cocktail.create(req.body)

        // Réponse du cocktail créé
        return res.json({ message: 'Cocktail Created', data: cocktail })
    } catch (err) {
        next(err)
    }
}

exports.updateCocktail = async (req, res, next) => {
    try {
        let cocktailId = parseInt(req.params.id)

        // Vérification si le champ id est présent et cohérent
        if (!cocktailId) {
            throw new RequestError('Missing parameter')
        }

        // Recherche du cocktail et vérification
        let cocktail = await Cocktail.findOne({ where: { id: cocktailId }, raw: true })
        if (cocktail === null) {
            throw new CocktailError('This cocktail does not exist !', 0)
        }

        // Mise à jour du cocktail
        await Cocktail.update(req.body, { where: { id: cocktailId } })

        // Réponse de la mise à jour
        return res.json({ message: 'Cocktail Updated' })
    } catch (err) {
        next(err)
    }
}

exports.untrashCocktail = async (req, res, next) => {
    try {
        let cocktailId = parseInt(req.params.id)

        // Vérification si le champ id est présent et cohérent
        if (!cocktailId) {
            throw new RequestError('Missing parameter')
        }

        await Cocktail.restore({ where: { id: cocktailId } })

        // Réponse de sortie de poubelle
        return res.status(204).json({})
    } catch (err) {
        next(err)
    }
}

exports.trashCocktail = async (req, res, next) => {
    try {
        let cocktailId = parseInt(req.params.id)

        // Vérification si le champ id est présent et cohérent
        if (!cocktailId) {
            throw new RequestError('Missing parameter')
        }

        // Suppression du cocktail
        await Cocktail.destroy({ where: { id: cocktailId } })

        // Réponse de la mise en poubelle
        return res.status(204).json({})
    } catch (err) {
        next(err)
    }
}

exports.deleteCocktail = async (req, res, next) => {
    try {
        let cocktailId = parseInt(req.params.id)

        // Vérification si le champ id est présent et cohérent
        if (!cocktailId) {
            throw new RequestError('Missing parameter')
        }

        // Suppression du cocktail
        await Cocktail.destroy({ where: { id: cocktailId }, force: true })

        // Réponse de la suppression
        return res.status(204).json({})
    } catch (err) {
        next(err)
    }
}