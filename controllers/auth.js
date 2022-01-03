/***********************************/
/*** Import des module nécessaires */
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const { AuthenticationError } = require('../error/customError')

/**********************************/
/*** Routage de la ressource Auth */

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        // Validation des données reçues
        if (!email || !password) {
            throw new AuthenticationError('Bad email or password', 0)
        }

        // Vérification si l'utilisateur existe
        let user = await User.findOne({ where: { email: email }, raw: true })
        if (user === null) {
            throw new AuthenticationError('This account does not exists !', 1)
        }

        // Vérification du mot de passe
        let test = await bcrypt.compare(password, user.password)
        if (!test) {
            throw new AuthenticationError('Wrong password', 2)
        }

        // Génération du token et envoi
        const token = jwt.sign({
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING })

        return res.json({ access_token: token })
    } catch (err) {
        next(err)
    }
}