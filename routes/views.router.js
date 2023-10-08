import express from 'express'
import productsRouter from './products.js';

const router = express.Router()


router.get('/', (req, res) => {
    res.render('home', {})
})

router.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {})
})

export default router