const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const {User, Basket} = require('../models/models');

class UserController {

    async getAll(req, res) {
        const users = await User.findAll()
        return res.json(users)
    }

    async create(req, res, next) {
        const {email, password} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, password: hashPassword})
        await Basket.create({sum: Math.ceil(Math.random() * 100000), userId: user.id})
        return res.json(user)
    }

    async update(req, res, next) {
        const {id} = req.params
        const candidate = await User.findOne({where: {id}})
        if (!candidate) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        await User.update({email, password: hashPassword, role}, {where: {id}})
            .then((updatedRecord) => {
                if (updatedRecord[0] === 1) {
                  res.status(200).json({ message:"Updated successfully" });
                } else {
                  res.status(404).json({ message:"record not found" })
                }
            })
            .catch(function (error){
                res.status(500).json(error);
            });
    }

    async del(req, res) {
        const {id} = req.params
        await User.destroy({where: {id}})
            .then((deletedRecord) => {
                if(deletedRecord === 1){
                    res.status(200).json({message:"Deleted successfully"});
                }
                else {
                    res.status(404).json({message:"record not found"})
                }
            })
            .catch(function (error){
                res.status(500).json(error);
            });
    }
}

module.exports = new UserController()