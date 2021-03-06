const Pedido = require("../models/pedido_model.js");
const chequearToken = require("../middleware/auth");

const ESTADOSPOSIBLES = [
  "nuevo",
  "confirmado",
  "preparando",
  "enviando",
  "cancelado",
  "entregado",
];

exports.create = (req, res) => {
  try {
    const validacion = chequearToken(req.headers["x-access-token"]);
    if (validacion.resultado === "Autorizado") {
      const pedido = new Pedido({
        estado: "nuevo", //Todos los pedidos se crean obligatoriamente con estado nuevo, el Admin debe modificarlo luego
        // hora: new Date(),
        pago_via: req.body.pago_via,
        pago_monto: 0, /// CALCULADO
        id_usuario: validacion.id_usuario,
        observaciones: req.body.observaciones,
      });
      Pedido.create(pedido, (err, data) => {
        if (err) {
          res.status(500).send("Error al procesar");
        } else {
          res.send(data);
        }
      });
    } else {
      res.status(401).send("Token inválido");
    }
  } catch {
    res.status(400).send("Hubo un problema, revise los datos y reintente");
  }
};

exports.findAll = (req, res) => {
  try {
    const validacion = chequearToken(req.headers["x-access-token"]);
    if (validacion.rol === "administrador") {
      Pedido.getAll((err, data) => {
        if (err) {
          res.status(500).send("Error al procesar");
        } else {
          res.send(data);
        }
      });
    } else if (validacion.rol === "usuario") {
      Pedido.getAllFromOne(validacion.id_usuario, (err, data) => {
        if (err) {
          res.status(500).send("Error al procesar");
        } else {
          res.send(data);
        }
      });
    } else {
      res.status(401).send("Token inválido");
    }
  } catch {
    res.status(400).send("Hubo un problema, revise los datos y reintente");
  }
};

exports.update = (req, res) => {
  try {
    const validacion = chequearToken(req.headers["x-access-token"]);
    const id = req.params.id_pedido;
    const estado = req.body.estado;
    if (validacion.rol === "administrador") {
      if (ESTADOSPOSIBLES.includes(estado.toLowerCase())) {
        Pedido.update(id, estado, (err, data) => {
          if (err) {
            res.status(500).send("Error al procesar");
          } else if (data.affectedRows === 0) {
            res
              .status(500)
              .send("No se pudo actualizar, revise los datos ingresados");
          } else {
            res.send(data);
          }
        });
      } else {
        res.status(400).send("Estado de pedido enviado no es válido");
      }
    } else if (validacion.resultado === "Autorizado") {
      res.status(403).send("No tiene permisos para editar pedidos");
    } else {
      res.status(401).send("Token inválido");
    }
  } catch {
    res.status(400).send("Hubo un problema, revise los datos y reintente");
  }
};

exports.updateObs = (req, res) => {
  try {
    const validacion = chequearToken(req.headers["x-access-token"]);
    const id = req.params.id_pedido;
    const observaciones = req.body.observaciones;
    console.log("updateObs", observaciones, id);
    if (validacion.rol === "administrador") {
      Pedido.updateObs(id, observaciones, (err, data) => {
        if (err) {
          res.status(500).send("Error al procesar");
        } else if (data.affectedRows === 0) {
          res
            .status(500)
            .send("No se pudo actualizar, revise los datos ingresados");
        } else {
          res.send(data);
        }
      });
    } else if (validacion.resultado === "Autorizado") {
      res.status(403).send("No tiene permisos para editar pedidos");
    } else {
      res.status(401).send("Token inválido");
    }
  } catch {
    res.status(400).send("Hubo un problema, revise los datos y reintente");
  }
};

exports.updateAmo = (req, res) => {
  console.log("updateAmo")
  try {
    const validacion = chequearToken(req.headers["x-access-token"]);
    const id = req.params.id_pedido;
    const pago_monto = req.body.pago_monto;
    console.log("updateAmo", pago_monto, id);
    if (validacion.rol === "administrador") {
      Pedido.updateAmo(id, pago_monto, (err, data) => {
        if (err) {
          res.status(500).send("Error al procesar");
        } else if (data.affectedRows === 0) {
          res
            .status(500)
            .send("No se pudo actualizar, revise los datos ingresados");
        } else {
          res.send(data);
        }
      });
    } else if (validacion.rol === "usuario") {
      Pedido.getOne(req.params.id_pedido, (err, data) => {
        if (err) {
          res.status(500).send("Error al procesar");
        }
        if (data.length === 0) {
          res.status(500).send("Error al procesar");
        } else {
          if (+data[0].id_usuario !== +validacion.id_usuario) {
            res
              .status(403)
              .send("No tiene permisos para agregar en ese pedido");
          } else {
            Pedido.updateAmo(id, pago_monto, (err, data) => {
              if (err) {
                res.status(500).send("Error al procesar");
              } else if (data.affectedRows === 0) {
                res
                  .status(500)
                  .send("No se pudo actualizar, revise los datos ingresados");
              } else {
                res.send(data);
              }
            });
          }
        }
      });
    } else {
      res.status(401).send("Token inválido");
    }
  } catch {
    res.status(400).send("Hubo un problema, revise los datos y reintente");
  }
};

//       res.status(403).send("No tiene permisos para editar pedidos");
//     } else {
//       res.status(401).send("Token inválido");
//     }
//   } catch {
//     res.status(400).send("Hubo un problema, revise los datos y reintente");
//   }
// };

exports.delete = (req, res) => {
  try {
    const validacion = chequearToken(req.headers["x-access-token"]);
    if (validacion.rol === "administrador") {
      const id = req.params.id_pedido;
      Pedido.delete(id, (err, data) => {
        if (data.errno) {
          res.status(500).send("Error al procesar");
        } else {
          res.status(204).send();
        }
      });
    } else if (validacion.resultado === "Autorizado") {
      res.status(403).send("No tiene permisos para borrar pedidos");
    } else {
      res.status(401).send("Token inválido");
    }
  } catch {
    res.status(400).send("Hubo un problema, revise los datos y reintente");
  }
};
