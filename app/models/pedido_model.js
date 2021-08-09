const sql = require("./db");

const Pedido = function (pedido) {
  this.estado = pedido.estado;
  this.hora = pedido.hora;
  this.pago_via = pedido.pago_via;
  this.pago_monto = pedido.pago_monto;
  this.id_usuario = pedido.id_usuario;
  this.observaciones = pedido.observaciones
};

Pedido.create = (newPedido, result) => {
  sql.query("INSERT INTO pedidos SET ?", newPedido, (err, res) => {
    if (err) {
      console.log(err);
      result(err, null);
      return;
    }
    result(null, { id_pedido: res.insertId, ...newPedido });
  });
};

Pedido.getAll = (result) => {
  sql.query("SELECT * FROM pedidos", (err, res) => {
    if (err) {
      console.log(err);
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
};

Pedido.getAllFromOne = (id, result) => {
  sql.query(`SELECT * FROM pedidos WHERE id_usuario=${id}`, (err, res) => {
    if (err) {
      console.log(err);
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
};

Pedido.getOne = (id_pedido, result) => {
  sql.query(`SELECT * FROM pedidos WHERE id_pedido=${id_pedido};`, (err, res) => {
    if (err) {
      console.log(err);
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
};

Pedido.update = (id, estado, result) => {
  sql.query(
    `UPDATE pedidos SET estado = '${estado}' WHERE id_pedido=${id};`,
    (err, res) => {
      if (res.affectedRows === 0) {
        console.log("no match!");
        result(null, res);
        return;
      }
      if (err) {
        console.log(err);
        result(null, err);
        return;
      }
      result(null, {estado: estado});
      return;
    }
  );
};

Pedido.delete = (id, result) => {
  sql.query(`DELETE FROM pedidos WHERE id_pedido=${id};`, (err, res) => {
    if (err) {
      console.log(err);
      result(null, err);
      return;
    }
    result(null, res);
    return;
  });
};

module.exports = Pedido;
