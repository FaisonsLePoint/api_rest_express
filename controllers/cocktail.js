/***********************************/
/*** Import des module nécessaires */
const DB = require('../db.config')
const Cocktail = DB.Cocktail
const User = DB.User

/**************************************/
/*** Routage de la ressource Cocktail */

exports.getAllCocktails = (req, res) => {
    Cocktail.findAll({paranoid: false})
        .then(cocktails => res.json({ data: cocktails }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.getCocktail = async (req, res) => {
    let cocktailId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!cocktailId) {
        return res.json(400).json({ message: 'Missing Parameter' })
    }

    try {
        // Récupération du cocktail
        let cocktail = await Cocktail.findOne({ where: { id: cocktailId }, include: {model: User, attributes:['id','pseudo','email']} })

        // Test si résultat
        if (cocktail === null) {
            return res.status(404).json({ message: 'This cocktail does not exist !' })
        }

        // Renvoi du Cocktail trouvé
        return res.json({ data: cocktail })
    } catch (err) {
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}

exports.addCocktail = async (req, res) => {
    const { user_id, nom, description, recette } = req.body

    // Validation des données reçues
    if (!user_id || !nom || !description || !recette) {
        return res.status(400).json({ message: 'Missing Data' })
    }

    try{
        // Vérification si le coktail existe
        let cocktail = await Cocktail.findOne({ where: { nom: nom }, raw: true })
        if (cocktail !== null) {
            return res.status(409).json({ message: `The cocktail ${nom} already exists !` })
        }

        // Céation du cocktail
        cocktail = await Cocktail.create(req.body)
        return res.json({ message: 'Cocktail Created', data: cocktail })
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}

exports.updateCocktail = async (req, res) => {
    let cocktailId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!cocktailId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    try{
        // Recherche du cocktail et vérification
        let cocktail = await Cocktail.findOne({ where: { id: cocktailId }, raw: true })
        if (cocktail === null) {
            return res.status(404).json({ message: 'This cocktail does not exist !' })
        }

        // Mise à jour du cocktail
        await Cocktail.update(req.body, { where: { id: cocktailId } })
        return res.json({ message: 'Cocktail Updated' })
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }    
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