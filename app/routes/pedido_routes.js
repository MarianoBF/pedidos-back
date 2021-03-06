module.exports = app => {

    const router = require("express").Router();
    
    const pedidos = require("../controllers/pedido_controller.js")
    
    router.get("/pedidos", pedidos.findAll);
  
    router.post("/pedido", pedidos.create);

    router.patch("/pedido/:id_pedido", pedidos.update);

    router.patch("/pedidoObs/:id_pedido", pedidos.updateObs);

    router.patch("/pedidoAmo/:id_pedido", pedidos.updateAmo);

    router.delete("/pedido/:id_pedido", pedidos.delete);

    app.use("/api/v1/", router)

    }
