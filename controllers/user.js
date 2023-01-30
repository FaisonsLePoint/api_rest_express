/***********************************/
/*** Import des module nécessaires */
const bcrypt = require('bcrypt')

const DB = require('../db.config')
const User = DB.User

/**********************************/
/*** Routage de la ressource User */

exports.getAllUsers = (req, res) => {
    User.findAll()
        .then(users => res.json({ data: users }))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.getUser = async (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.json(400).json({ message: 'Missing Parameter' })
    }

    try{
        // Récupération de l'utilisateur et vérification
        let user = await User.findOne({ where: { id: userId }, attributes: ['id','pseudo','email']})
        if (user === null) {
            return res.status(404).json({ message: 'This user does not exist !' })
        }

        return res.json({ data: user })
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }    
}

exports.addUser = async (req, res) => {
    const { nom, prenom, pseudo, email, password } = req.body

    // Validation des données reçues
    if (!nom || !prenom || !pseudo || !email || !password) {
        return res.status(400).json({ message: 'Missing Data' })
    }

    try{
        // Vérification si l'utilisateur existe déjà
        const user = await User.findOne({ where: { email: email }, raw: true })
        if (user !== null) {
            return res.status(409).json({ message: `The user ${nom} already exists !` })
        }

        // Hashage du mot de passe utilisateur
        //let hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND))
        //req.body.password = hash

        // Céation de l'utilisateur
        let userc = await User.create(req.body)
        return res.json({ message: 'User Created', data: userc })

    }catch(err){
        if(err.name == 'SequelizeDatabaseError'){
            res.status(500).json({ message: 'Database Error', error: err })
        }
        res.status(500).json({ message: 'Hash Process Error', error: err})        
    }
}

exports.updateUser = async (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    try{
        // Recherche de l'utilisateur et vérification
        let user = await User.findOne({ where: {id: userId}, raw: true})
        if(user === null){
            return res.status(404).json({ message: 'This user does not exist !'})
        }

        // Mise à jour de l'utilisateur
        await User.update(req.body, { where: {id: userId}})
        return res.json({ message: 'User Updated'})
    }catch(err){
        return res.status(500).json({ message: 'Database Error', error: err })
    }
}

exports.untrashUser =  (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }
    
    User.restore({ where: {id: userId}})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.trashUser = (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    // Suppression de l'utilisateur
    User.destroy({ where: {id: userId}})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}

exports.deleteUser =  (req, res) => {
    let userId = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!userId) {
        return res.status(400).json({ message: 'Missing parameter' })
    }

    // Suppression de l'utilisateur
    User.destroy({ where: {id: userId}, force: true})
        .then(() => res.status(204).json({}))
        .catch(err => res.status(500).json({ message: 'Database Error', error: err }))
}