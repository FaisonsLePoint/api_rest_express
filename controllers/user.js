/***********************************/
/*** Import des module nécessaires */
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { RequestError, UserError } = require('../error/customError')

/**********************************/
/*** Routage de la ressource User */

exports.getAllUsers = (req, res, next) => {
    User.findAll()
        .then(users => res.json({ data: users }))
        .catch(err => next(err))
}

exports.getUser = async (req, res, next) => {
    try {
        let userId = parseInt(req.params.id)

        // Vérification si le champ id est présent et cohérent
        if (!userId) {
            throw new RequestError('Missing parameter')
        }

        // Récupération de l'utilisateur et vérification
        let user = await User.findOne({ where: { id: userId }, raw: true })

        // Test si résultat
        if (user === null) {
            throw new UserError('This user does not exist !', 0)
        }

        // Renvoi de l'Utilisateur trouvé
        return res.json({ data: user })
    } catch (err) {
        next(err)
    }
}

exports.addUser = async (req, res, next) => {
    try {
        const { nom, prenom, pseudo, email, password } = req.body

        // Validation des données reçues
        if (!nom || !prenom || !pseudo || !email || !password) {
            throw new RequestError('Missing parameter')
        }

        // Vérification si l'utilisateur existe déjà
        let user = await User.findOne({ where: { email: email }, raw: true })
        if (user !== null) {
            throw new UserError(`The user ${nom} already exists !`, 1)
        }

        // Hashage du mot de passe utilisateur
        let hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
        req.body.password = hash

        // Céation de l'utilisateur
        let User = await User.create(req.body)

        // Réponse du user créé
        return res.json({ message: 'User Created', data: user })

    } catch (err) {
        next(err)
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        let userId = parseInt(req.params.id)

        // Vérification si le champ id est présent et cohérent
        if (!userId) {
            throw new RequestError('Missing parameter')
        }

        // Recherche de l'utilisateur et vérification
        let user = await User.findOne({ where: { id: userId }, raw: true })
        if (user === null) {
            throw new UserError('This user does not exist !', 0)
        }

        // Mise à jour de l'utilisateur
        await User.update(req.body, { where: { id: userId } })

        // Réponse de la mise à jour
        return res.json({ message: 'User Updated' })
    } catch (err) {
        next(err)
    }
}

exports.untrashUser = async (req, res, next) => {
    try {
        let userId = parseInt(req.params.id)

        // Vérification si le champ id est présent et cohérent
        if (!userId) {
            throw new RequestError('Missing parameter')
        }

        await User.restore({ where: { id: userId } })

        // Réponse de la sortie de poubelle
        return res.status(204).json({})
    } catch (err) {
        next(err)
    }
}

exports.trashUser = async (req, res, next) => {
    try {
        let userId = parseInt(req.params.id)

        // Vérification si le champ id est présent et cohérent
        if (!userId) {
            throw new RequestError('Missing parameter')
        }

        // Suppression de l'utilisateur
        await User.destroy({ where: { id: userId } })

        // Réponse de la mise en poubelle
        return res.status(204).json({})
    } catch (err) {
        next(err)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        let userId = parseInt(req.params.id)

        // Vérification si le champ id est présent et cohérent
        if (!userId) {
            throw new RequestError('Missing parameter')
        }

        // Suppression de l'utilisateur
        await User.destroy({ where: { id: userId }, force: true })
        
        // Réponse de la suppression
        return res.status(204).json({})            
    } catch (err) {
        next(err)
    }
}