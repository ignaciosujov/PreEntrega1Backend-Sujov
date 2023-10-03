import ProductManager from "./index.js"
import express from 'express'

const app = express()
// app.use(express.urlencoded({extended: true}))
app.use(express.json());

const manager = new ProductManager()

// console.log('estos son los prod', await manager.getProducts())

app.get('/', (req, res) => {  
    res.send('<div><h1 style="color: blue">Bienvenido!</h1></div>')
}) 

app.get('/api/products', async (req, res) => {
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

app.get('/api/products/:pid', async (req, res) => {

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

app.post('/api/products', async (req, res) => {
    try{
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
        
        res.status(201).json({ message: 'Producto agregado exitosamente' });

    }catch(err){
        res.status(500).json({ error: 'Error al agregar producto' });
        return err
    }
})
app.put('/api/products/:pid', async (req, res) => {

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

app.delete('/api/products/:pid', async (req, res) => {
    try{
        let productID = parseInt(req.params.pid)

        await manager.deleteProduct(productID)

        res.status(201).json({ message: 'Producto eliminado exitosamente' });

    }catch(err){
        res.status(500).json({ error: 'Error al eliminar producto' });

        return err
    }



})




app.listen('8080', () => {

    console.log('servidor activo en el puerto: 8080')

})