import express from 'express'
import handlebars from 'express-handlebars'
import path from 'path'
import __dirname from './util.js'
import { Server } from 'socket.io'
import router from '../routes/views.router.js'
import ProductManager from './productManager.js'
import mongoose from 'mongoose'



const app = express()



app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname+'/views'))
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/product', router)

// const io = new Server(httpServer)


mongoose.connect('mongodb+srv://ignaciosujov:4W4FIUeEU6lt1wTx@cluster0.denqn1r.mongodb.net/', {dbName: 'ecommerce'}) //aca pusimos el link que aparece en mongo de internet cuando ponemos connect y ponemos driver

    .then(() => {
        console.log('DB connected OK')
        const httpServer = app.listen(8080, () => console.log('Server activo en puerto: 8080'))
        
    })
    .catch(e => {
        console.error('Error connecting to DB')
    })



const manager = new ProductManager()


app.get('/products', async (req, res) => {
    try {
        const products = await manager.getProducts();
        res.render('home', { products });
    } catch (error) {
        console.error('Error al obtener productos', error);
        res.status(500).send('Error al obtener productos');
    }
});


app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await manager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener productos', error);
        res.status(500).send('Error al obtener productos');
    }
});

/* io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('createProduct', async ({ title, description, price, code, stock, category, thumbnail }) => {
        try {
            // Agrega el producto a través de ProductManager
            await manager.addProduct(title, description, price, code, stock, category, thumbnail);
            // Emitir la actualización a todos los clientes
            io.emit('updateProducts', await manager.getProducts());
        } catch (error) {
            console.error('Error al crear producto', error);
        }
    });

    // Maneja la eliminación de productos a través de WebSockets
    socket.on('deleteProduct', async (productId) => {
        try {
            // Elimina el producto a través de ProductManager
            await manager.deleteProduct(productId);
            // Emitir la actualización a todos los clientes
            io.emit('updateProducts', await manager.getProducts());
        } catch (error) {
            console.error('Error al eliminar producto', error);
        }
    });
});

io.emit('updateProducts', await manager.getProducts())
 */


// app.use('/', router)

