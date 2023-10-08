import ProductManager from "../src/productManager.js"
import express from 'express'
import { io } from '../src/server.js'


const router = express.Router()

const app = express()
app.use(express.json());

const manager = new ProductManager()


router.get('/', (req, res) => {  
    res.send('<div><h1 style="color: blue">Bienvenido!</h1></div>')
}) 

router.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const productos = await manager.getProducts();

        if (!isNaN(limit)) {
            // Si se proporcionó un valor válido para 'limit', devuelve solo el número de productos solicitados
            res.send(productos.slice(0, limit));
        } else {
            // Si no se proporcionó un valor para 'limit' o es inválido, devuelve todos los productos
            res.send(productos);
        }
    } catch (error) {
        // Manejar errores aquí
        res.status(500).send('Error al obtener productos', err);
    }
});

router.get('/products/:pid', async (req, res) => {

    try{
        const productos = await manager.getProducts()
        let productID = parseInt(req.params.pid)
        let product = productos.find(p => p.id === productID)

        if(!product){
            return res.send('producto no encontrado')
        }

        res.send(product)
    }catch(err){
        console.log("error al encontrar productos", err)
        res.status(500).send('error al obtener productos')
    }


})

router.post('/products', async (req, res) => {
    try{

        console.log("esto es el req.body", req.body);
        const { title, description, price, status, code, stock, category, thumbnail } = req.body;

        if (!title || !description || !price || !status || !code || !stock || !category) {
            res.status(400).json({ error: 'Todos los campos son obligatorios' });            
            return;
        }
        const productos = await manager.getProducts();
        if (productos.some((product) => product.code === code)) {
            res.status(400).json({ error: 'El código ya existe' });
            return;
        }
        

        await manager.addProduct(title, description, price, thumbnail, code, stock, category, status);
        
        io.emit('updateProducts', await manager.getProducts)

        res.status(201).json({ message: 'Producto agregado exitosamente' });

    }catch(err){
        res.status(500).json({ error: 'Error al agregar producto' });
        return err
    }
})
router.put('/products/:pid', async (req, res) => {

    try{
        const { title, description, price, status, code, stock, category, thumbnail } = req.body;
        let productID = parseInt(req.params.pid)


        if (!title || !description || !price || !thumbnail || !code || !stock || !category || !status) {
            res.status(400).json({ error: 'Todos los campos son obligatorios' });
            return
        }

        await manager.updateProduct(productID, title, description, price, thumbnail, code, stock, category, status);

        res.status(201).json({ message: 'Producto actualizado exitosamente' });


    }catch(err){
        res.status(500).json({ error: 'Error al agregar producto' });
        return err
    }
})

router.delete('/products/:pid', async (req, res) => {
    try{
        let productID = parseInt(req.params.pid)

        await manager.deleteProduct(productID)

        res.status(201).json({ message: 'Producto eliminado exitosamente' });

    }catch(err){
        res.status(500).json({ error: 'Error al eliminar producto' });

        return err
    }



})


export default router