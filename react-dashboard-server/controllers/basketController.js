const { Basket } = require('../models/models');

class BasketController {

  async getAll(req, res) {
    const baskets = await Basket.findAll()
    return res.json(baskets)
  }
}

module.exports = new BasketController()