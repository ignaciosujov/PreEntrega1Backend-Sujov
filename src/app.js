import ProductManager from "./index.js"
import express from 'express'

const app = express()
app.use(express.urlencoded({extended: true}))

const manager = new ProductManager()

console.log('estos son los prod', manager.getProducts())

app.get('/', (req, res) => {  
    res.send('<div><h1 style="color: blue">Bienvenido!</h1></div>')
}) 

app.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit); // Parsea el parámetro 'limit' como un número
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

app.get('/products/:id', async (req, res) => {

    try{
        const productos = await manager.getProducts()
        let productID = parseInt(req.params.id)
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




app.listen('8080', () => {

    console.log('servidor activo')

})