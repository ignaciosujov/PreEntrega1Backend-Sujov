import express from 'express'


const app = express()

import fs from 'fs'

class ProductManager {
    constructor() {
        this.products = [];
        this.productIdCounter = 1;
        this.path = '../products.txt'
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        // Validar que todos los campos sean obligatorios

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('Todos los campos son obligatorios');
            return;
        }

        // Validar que el campo "code" no esté repetido

        if (this.products.some((product) => product.code === code)) {
            console.error('El código ya existe');
            return;
        }

        const product = {
            id: this.productIdCounter++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        //Guardamos en el array el producto
        this.products.push(product);

        //Escribimos en el archivo externo el array
        fs.writeFile(this.path, JSON.stringify(this.products, null, 2), (err) => {
            if(err){
                console.log('no se pudo escribir')
            }
        }) 
        console.log('Producto agregado:', product);

    }

    async getProducts() {

        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const products = JSON.parse(data)
            return products
        } catch (err){
            console.error('error al leer el archivo', err)
            throw err
        }
    }

    getProductById(id) {

        //Leemos el archivo externo

        fs.readFile(this.path, 'utf-8', (err, data) => {
            if (err){
                console.error('Error al leer archivo')
                return
            }
            try {
                //Guardamos el arhivo en una variable manipulable en formato object
                
                const arrayProducts = JSON.parse(data)

                const product = arrayProducts.find(prod => prod.id === id)

                if (!product) {
                    console.error('Producto no encontrado');
                    return;
                }
        
                return console.log(product)
            }
            catch (err){
                console.error("error al leer el archivo")
            }
            
        })

    }

    async deleteProduct(id){
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8')
    
            const products = JSON.parse(data)

            for(let i = 0; i < products.length; i++){
                if (products[i].id === id){
                    products.splice(i, 1)
                    break
                }
            }
            this.products = products
    
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8')
            console.log('producto eliminado con exito')
            return
        }
        catch(err){
            return err
        }
    }
    async updateProduct(id, title, description, price, thumbnail, code, stock){
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('Todos los campos son obligatorios');
            return;
        }else{
            const objeto = {
                id: id,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
            }
            try{
                //leemos el archivo para luego buscar el id del producto
                const data = await fs.promises.readFile(this.path, 'utf-8')
    
                const products = JSON.parse(data)
    
                for(let i = 0; i < products.length; i++){
                    if (products[i].id === id){
                        products[i] = {id, ...objeto}
                    }
                }
                this.products = products
    
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8')
                console.log('actualizacion realizada con exito')
                return
            }
            catch(err){
                return err
            }
        }

        }


}


const manager = new ProductManager();

manager.addProduct('Producto 1', 'Descripcion1', 200, 'img', 'ABC123', 10);
manager.addProduct('Producto 2', 'Descripcion2', 150, 'img', 'BCA456', 20);     
manager.addProduct('Producto 3', 'Descripcion3', 100, 'img', 'ASD456', 5);     
manager.addProduct('Producto 4', 'Descripcion4', 50, 'img', 'GRE456', 15);     


/* console.log(`Lista de productos: ${manager.getProducts()}`);    //mostrar lista de productos
console.log(manager.getProductById(2))  //obtener un producto con el id "2"


//NOTA: al querer eliminar y actualizar un producto al mismo tiempo, no parece funcionar bien, imagino que se debe a que son async las 2 y superponen tareas.
manager.deleteProduct(4)  //eliminar producto con el id "3"
 */
//manager.updateProduct(2, 'productActualizado3', 'actualizacion de producto', 400, 'img', 'ASD879', 7)  //actualizar producto con el id "2"

export default ProductManager;