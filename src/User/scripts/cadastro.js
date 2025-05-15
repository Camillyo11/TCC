
   async function registerUser() {
  const senha = document.getElementById('senha').value;
  const repetirSenha = document.getElementById('repetir_senha').value;

  const cpf = document.getElementById('cpf').value;
    if (!validarCPF(cpf)) {
      alert('Por favor, insira um CPF válido');
      return false;
    };

  if (senha !== repetirSenha) {
    alert("As senhas não coincidem.");
    return;
  }

  if (senha.length < 8) {
    alert("A senha deve ter no mínimo 8 caracteres.");
    return;
  }

  const userData = {
    nome: document.getElementById('nome').value,
    cpf: document.getElementById('cpf').value,
    email: document.getElementById('email').value,
    senha: senha,
    ddd: document.getElementById('ddd').value,
    telefone: document.getElementById('telefone').value,
    endereco: document.getElementById('endereco').value,
    numero_casa: document.getElementById('numero_casa').value,
    complemento: document.getElementById('complemento').value,
    tipo_endereco: document.getElementById('tipo_endereco').value,
    bairro: document.getElementById('bairro').value,
    cidade: document.getElementById('cidade').value,
    estado: document.getElementById('estado').value,
    cep: document.getElementById('cep').value,
    data_nascimento: document.getElementById('data_nascimento').value
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    alert(result.message);
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    alert('Erro ao registrar usuário.');
  }
}

