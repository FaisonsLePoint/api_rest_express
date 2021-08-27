/***********************************/
/*** Import des module nécessaires */
const express = require('express')
const bcrypt = require('bcrypt')

const User = require('../models/user')

/***************************************/
/*** Récupération du routeur d'express */
let router = express.Router()

/*********************************************/
/*** Middleware pour logger dates de requete */
router.use( (req, res, next) => {
    const event = new Date()
    console.log('User Time:', event.toString())
    next()
})


/**********************************/
/*** Routage de la ressource User */

router.get('', (req, res) => {
    User.findAll()
        .then(users => res.json({ data: users }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
})


router.get('/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.json(400).json({ message: 'Missing Parameter' })
    }

    // Récupération de l'utilisateur
    User.findOne({ where: { id: userId }, raw: true })
        .then(user => {
            if (user === null) {
                return res.status(404).json({ message: 'This user does not exist !' })
            }

            // Utilisateur trouvé
            return res.json({ data: user })
        })
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
})


router.put('', (req, res) => {
    const { nom, prenom, pseudo, email, password } = req.body

    // Validation des données reçues
    if (!nom || !prenom || !pseudo || !email || !password) {
        return res.status(400).json({ message: 'Missing Data' })
    }

    User.findOne({ where: { email: email }, raw: true })
        .then(user => {
            // Vérification si l'utilisateur existe déjà
            if (user !== null) {
                return res.status(409).json({ message: `The user ${nom} already exists !` })
            }

            // Hashage du mot de passe utilisateur
            bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
                .then(hash => {
                    req.body.password = hash

                    // Céation de l'utilisateur
                    User.create(req.body)
                        .then(user => res.json({ message: 'User Created', data: user }))
                        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
                })
                .catch(err => res.status(500).json({ message: 'Hash Process Error', error: err }))
        })
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
})


router.patch('/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    // Recherche de l'utilisateur
    User.findOne({ where: {id: userId}, raw: true})
        .then(user => {
            // Vérifier si l'utilisateur existe
            if(user === null){
                return res.status(404).json({ message: 'This user does not exist !'})
            }

            // Mise à jour de l'utilisateur
            User.update(req.body, { where: {id: userId}})
                .then(user => res.json({ message: 'User Updated'}))
                .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
        })
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
})


router.post('/untrash/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }
    
    User.restore({ where: {id: userId}})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
})


router.delete('/trash/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    // Suppression de l'utilisateur
    User.destroy({ where: {id: userId}})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
})


router.delete('/:id', (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    // Suppression de l'utilisateur
    User.destroy({ where: {id: userId}, force: true})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
})

module.exports = router