const sql = require("./db");

const Usuario = function(usuario) {
    this.nombre_usuario = usuario.nombre_usuario;
    this.password = usuario.password;
    this.nombre_completo = usuario.nombre_completo;
    this.rol = usuario.rol
}

Usuario.create = (newUsuario, result) => {
    sql.query("INSERT INTO usuarios SET ?", newUsuario, (err, res) => {
        if (err) {
          console.log(err);
          result(err, null);
            return;
        }
        result(null, {id: res.insertId, ...newUsuario})
    });
};


Usuario.getAll = result => {
    sql.query("SELECT * FROM usuarios", (err, res) => {
        if (err) {
          console.log(err);
          result(null, err);
            return
        }
        result(null, res)
        return
    });
};

Usuario.update = (id, updateUsuario, result) => {
    sql.query(
      `UPDATE usuarios SET nombre_usuario = '${updateUsuario.nombre_usuario}', password = '${updateUsuario.password}', rol =  '${updateUsuario.rol}', nombre_completo = '${updateUsuario.nombre_completo}'  WHERE id_usuario=${id};`,
      (err, res) => {
        if (err) {
          console.log(err);
          result(null, err);
          return;
        }
        result(null, res, updateUsuario);
        return;
      }
    );
  };
  
  Usuario.delete = (id, result) => {
      sql.query(
        `DELETE FROM usuarios WHERE id_usuario=${id};`,
        (err, res) => {
          if (err) {
            console.log(err);
            result(null, err);
            return;
          }
          result(`Usuario ${id} borrado`);
          return;
        }
      );
    };

    Usuario.get = (usuario, result) => {
      sql.query("SELECT * FROM usuarios WHERE nombre_usuario='"+usuario.nombre_usuario+"';", (err, res) => {
        if (err) {
          console.log(err);
          result(null, err);
            return
        }
        result(null, res)
        return
    });
    };

module.exports = Usuario;