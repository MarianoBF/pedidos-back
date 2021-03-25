const sql = require("./db");

const Producto = function(producto) {
    this.nombre = producto.nombre;
    this.descripcion = producto.descripcion;
    this.precio = producto.precio;
}

Producto.create = (newProducto, result) => {
    sql.query("INSERT INTO productos SET ?", newProducto, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("producto cargado: ", {id: res.insertId, ...newProducto});
        result(null, {id: res.insertId, ...newProducto})
    });
};


Producto.getAll = result => {
    sql.query("SELECT * FROM productos", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return
        }
        console.log("productos :", res);
        result(null, res)
        return
    });
};


Producto.actual = (id, actualProd, result) => {
    sql.query(`UPDATE productos SET nombre = '${actualProd.nombre}', precio = ${actualProd.precio}, descripcion =  '${actualProd.descripcion}'  WHERE id_producto=${id};`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return
        }
        console.log("productos :", res);
        result(null, res, actualProd)
        return
    });
};


module.exports = Producto;