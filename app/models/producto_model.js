const sql = require("./db");

const Producto = function (producto) {
  this.nombre = producto.nombre;
  this.descripcion = producto.descripcion;
  this.precio = producto.precio;
};

Producto.create = (newProducto, result) => {
  sql.query("INSERT INTO productos SET ?", newProducto, (err, res) => {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newProducto });
  });
};

Producto.getAll = (result) => {
  sql.query("SELECT * FROM productos", (err, res) => {
    if (err) {
      console.log(err);
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
};

Producto.update = (id, updateProd, result) => {
  sql.query(
    `UPDATE productos SET nombre = '${updateProd.nombre}', precio = ${updateProd.precio}, descripcion =  '${updateProd.descripcion}'  WHERE id_producto=${id};`,
    (err, res) => {
      if (err) {
        console.log(err);
        result(null, err);
        return;
      }
      result(null, res, updateProd);
      return;
    }
  );
};

Producto.delete = (id, result) => {
    sql.query(
      `DELETE FROM productos WHERE id_producto=${id};`,
      (err, res) => {
        if (err) {
          console.log(err);
          result(null, err);
          return;
        }
        result(`Producto ${id} borrado`);
        return;
      }
    );
  };

module.exports = Producto;
