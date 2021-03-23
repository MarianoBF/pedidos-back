const sql = require("./db");

const Pedido = function(pedido) {
    this.estado = pedido.estado;
    this.hora = pedido.hora;
    this.pago_via = pedido.pago_via;
    this.pago_monto = pedido.pago_monto;
    this.usuario = pedido.usuario;
    this.productos = pedido.productos;
}

Pedido.create = (newPedido, result) => {
    sql.query("INSERT INTO pedidos SET ?", newPedido, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log("Pedido cargado: ", {id: res.insertId, ...newPedido});
        result(null, {id: res.insertId, ...newPedido})
    });
};


Pedido.getAll = result => {
    sql.query("SELECT * FROM pedidos", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return
        }
        console.log("Pedidos :", res);
        result(null, res)
        return
    });
};

module.exports = Pedido;