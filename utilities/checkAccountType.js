// utilities/checkAccountType.js
const jwt = require('jsonwebtoken');

const checkAccountType = (req, res, next) => {
  const token = req.cookies.token; // Supondo que o token JWT está nos cookies
  if (!token) {
    return res.render("accounts/login", { message: "Você precisa estar logado para acessar esta página." });
  }

  // Verificar o token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.render("accounts/login", { message: "Token inválido. Faça login novamente." });
    }

    // Verificar o tipo de conta
    if (decoded.accountType === "Employee" || decoded.accountType === "Admin") {
      req.user = decoded; // Passar informações do usuário para a próxima rota
      next(); // Continuar para a próxima função middleware ou rota
    } else {
      return res.render("accounts/login", { message: "Você não tem permissão para acessar esta página." });
    }
  });
};

module.exports = checkAccountType;
