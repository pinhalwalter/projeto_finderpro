import express from "express";
import cors from "cors";
import connection from "./db.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ==================== ROTA RAIZ ====================
app.get("/", (req, res) => {
  res.send("Servidor rodando com CORS habilitado!");
});

// ==================== CADASTRAR USUÁRIO ====================
app.post("/usuarios/cadastrar", (req, res) => {
  const { nome, email, senha, telefone } = req.body;

  if (!nome || !email || !senha || !telefone) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }

  connection.query(
    "INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)",
    [nome, email, senha, telefone],
    (err, result) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }
      res
        .status(201)
        .json({ mensagem: "Usuário cadastrado com sucesso!", id: result.insertId });
    }
  );
});

// ==================== LOGIN ====================
app.post("/usuarios/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Informe email e senha." });
  }

  connection.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    const usuario = rows[0];

    if (usuario.senha === senha) {
      res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        id_usu: usuario.id_usu,
        nome: usuario.nome,
      });
    } else {
      res.status(401).json({ erro: "Senha incorreta." });
    }
  });
});

// ==================== MUDAR SENHA ====================
app.put("/usuarios/mudar-senha", (req, res) => {
  const { email, novaSenha } = req.body;

  if (!email || !novaSenha) {
    return res.status(400).json({ erro: "Email e nova senha são obrigatórios!" });
  }

  // Verifica se o usuário existe
  connection.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao acessar o banco de dados." });
    }

    if (rows.length === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    // Atualiza a senha
    connection.query("UPDATE usuarios SET senha = ? WHERE email = ?", [novaSenha, email], (err) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao atualizar a senha." });
      }

      res.status(200).json({ mensagem: "Senha alterada com sucesso!" });
    });
  });
});

// ==================== SALVAR HISTÓRICO ====================
app.post("/historico/salvar", (req, res) => {
  const { id_usu, link } = req.body;

  if (!link) {
    return res.status(400).json({ erro: "O link é obrigatório." });
  }

  if (!id_usu) {
    return res.status(200).json({
      mensagem: "Usuário não logado. Link salvo localmente (simulado).",
      link,
    });
  }

  connection.query(
    "INSERT INTO historico (id_usu, link, data_de_salvamento) VALUES (?, ?, NOW())",
    [id_usu, link],
    (err) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }
      res.status(201).json({ mensagem: "Link salvo no histórico!" });
    }
  );
});

// ==================== EXIBIR HISTÓRICO DO USUÁRIO ====================
app.get("/historico/:id_usu", (req, res) => {
  const { id_usu } = req.params;

  connection.query(
    "SELECT * FROM historico WHERE id_usu = ? ORDER BY data_de_salvamento DESC",
    [id_usu],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }

      if (rows.length === 0) {
        return res.status(404).json({ mensagem: "Nenhum histórico encontrado." });
      }

      res.status(200).json(rows);
    }
  );
});

// ==================== DELETAR LINKS SELECIONADOS ====================
app.delete("/historico/selecionados", (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ erro: "Envie um array de IDs válidos para exclusão." });
  }

  const placeholders = ids.map(() => "?").join(",");
  const sql = `DELETE FROM historico WHERE id_his IN (${placeholders})`;

  connection.query(sql, ids, (err, result) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.status(200).json({ mensagem: "Links selecionados foram deletados com sucesso!" });
  });
});

// ==================== DELETAR HISTÓRICO COMPLETO DE UM USUÁRIO ====================
app.delete("/historico/:id_usu", (req, res) => {
  const { id_usu } = req.params;

  connection.query("DELETE FROM historico WHERE id_usu = ?", [id_usu], (err) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.status(200).json({ mensagem: "Todo o histórico do usuário foi deletado com sucesso!" });
  });
});

// ==================== DELETAR USUÁRIO ====================
app.delete("/usuarios/deletar/:id", (req, res) => {
  const { id } = req.params;

  connection.query("DELETE FROM usuarios WHERE id_usu = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }
    res.status(200).json({ mensagem: "Usuário deletado com sucesso!" });
  });
});

// ==================== LISTAR USUÁRIOS ====================
app.get("/usuarios", (req, res) => {
  connection.query(
    "SELECT id_usu, nome, email, telefone FROM usuarios",
    (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }
      res.status(200).json(rows);
    }
  );
});

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`Servidor rodando com CORS habilitado! http://localhost:${PORT}`);
});
