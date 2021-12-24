/***********************************/
/*** Import des module nécessaires */
const checkTokenMiddleware = require('../jsonwebtoken/check')

const Cocktail = require('../models/cocktail')

/**************************************/
/*** Routage de la ressource Cocktail */

exports.getAllCocktails = (req, res) => {
    Cocktail.findAll()
        .then(cocktails => res.json({ data: cocktails }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.getCocktail = (req, res) => {
    let cocktailId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!cocktailId) {
        return res.json(400).json({ message: 'Missing Parameter' })
    }

    // Récupération du cocktail
    Cocktail.findOne({ where: { id: cocktailId }, raw: true })
        .then(cocktail => {
            if (cocktail === null) {
                return res.status(404).json({ message: 'This cocktail does not exist !' })
            }

            // Cocktail trouvé
            return res.json({ data: cocktail })
        })
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.addCocktail = (req, res) => {
    const { user_id, nom, description, recette } = req.body

    // Validation des données reçues
    if (!user_id || !nom || !description || !recette) {
        return res.status(400).json({ message: 'Missing Data' })
    }

    Cocktail.findOne({ where: { nom: nom }, raw: true })
        .then(cocktail => {
            // Vérification si le cocktail existe déjà
            if (cocktail !== null) {
                return res.status(409).json({ message: `The cocktail ${nom} already exists !` })
            }

            // Céation du cocktail
            Cocktail.create(req.body)
                .then(cocktail => res.json({ message: 'Cocktail Created', data: cocktail }))
                .catch(err => res.status(500).json({ message: 'Database Error', error: err }))

        })
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.updateCocktail = (req, res) => {
    let cocktailId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!cocktailId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    // Recherche du cocktail
    Cocktail.findOne({ where: { id: cocktailId }, raw: true })
        .then(cocktail => {
            // Vérifier si le cocktail existe
            if (cocktail === null) {
                return res.status(404).json({ message: 'This cocktail does not exist !' })
            }

            // Mise à jour du cocktail
            Cocktail.update(req.body, { where: { id: cocktailId } })
                .then(cocktail => res.json({ message: 'Cocktail Updated' }))
                .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
        })
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.untrashCocktail = (req, res) => {
    let cocktailId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!cocktailId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    Cocktail.restore({ where: { id: cocktailId } })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.trashCocktail = (req, res) => {
    let cocktailId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!cocktailId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    // Suppression du cocktail
    Cocktail.destroy({ where: { id: cocktailId } })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.deleteCocktail = (req, res) => {
    let cocktailId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!cocktailId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    // Suppression du cocktail
    Cocktail.destroy({ where: { id: cocktailId }, force: true })
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}