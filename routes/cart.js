import ProductManager from "../src/productManager.js"
import fs from 'fs'
import express from 'express'

const router = express.Router()

const app = express()
app.use(express.json());

const manager = new ProductManager()


const carts = []
fs.writeFile('carts.txt', JSON.stringify(carts), (err) => {
    if(err){
        console.error('no se pudo crear el archivo carts.txt', err)
    }
})

function generadorID(){
    return Math.random().toString(36).substring(2, 9)
}

router.post('/carts', (req, res) => {
    try{
        const cartID = generadorID()

        const newCart = {
            id: cartID,
            products: []
        }
        carts.push(newCart)
        console.log("estos son los carritos", carts)

        fs.writeFile('carts.txt', JSON.stringify(carts), (err) => {
            if(err){
                console.error('No se pudo actualizar carts.txt', err)
            }
        })

        res.status(201).json(newCart)

    }catch(err){
        console.error('Error al crear carrito')
        res.status(500).json({ error: 'Error al crear un nuevo carrito' });
    }
})

router.get('/carts/:cid', (req, res) => {

    try{
        const cartID = req.params.cid
        const cart = carts.find((cart) => cart.id === cartID)

        if(!cart){
            res.status(404).json({error: 'Carrito not found'})
            return
        }

        res.status(200).json({products: cart.products})
    }catch(err){
        console.error('Error al obtener prod del carrito')
        res.status(500).json({error: 'error al obtener prod del carrito'})
    }

})

//agregar producto al carrito
router.post('/carts/:cid/product/:pid', (req, res) => {
    try{
        const cartId = req.params.cid
        const productId = req.params.pid
        const cart = carts.find((cart) => cart.id === cartId)

        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }

        const productExist = cart.products.find((p) => p.product === productId);
        
        if (productExist) {
            // Si el producto ya existe, incrementar la cantidad
            productExist.quantity += 1;
        } else {
            // Si el producto no existe, agregarlo al carrito con cantidad 1
            cart.products.push({
                product: productId,
                quantity: 1 });
        }

        fs.writeFile('carts.txt', JSON.stringify(carts), (err) => {
            if(err){
                console.error('No se pudo actualizar carts.txt', err)
            }
        })

        console.log(`Este es el carrito ahora: ${JSON.stringify(cart)}`)
        console.log(`Estos son los carritos ahora: ${JSON.stringify(carts)}`)

        res.status(200).json({ message: 'Producto agregado al carrito' });
    }catch (err) {
        console.error('Error al agregar producto al carrito', err);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
})