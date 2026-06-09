var ASSUNTO = "Acolhimento Vitta | Transição para o Plano AMIL — Informações Importantes";

function corpEmail(primeiroNome) {
  return "Olá, " + primeiroNome + "!\n\n" +
"Estou enviando este e-mail para acompanharmos as informações relacionadas ao seu formulário de acolhimento referente à troca do plano de saúde. Identificamos que você tem dúvidas referente à rede credenciada e seu plano e quer entender melhor o seu acompanhamento atual no novo convênio.\n\n\n" +
"🔄 IMPORTANTE — TRANSIÇÃO PARA O PLANO AMIL A PARTIR DE 10/06\n\n" +
"Se os locais onde você possui consultas e exames agendados aceitarem o novo plano AMIL, QUE ESTARÁ DISPONÍVEL a partir de amanhã no app Amil, basta informar a nova carteirinha ao local que está agendado para que seja solicitada autorização no novo plano.\n\n\n" +
"❌ Se não aceitarem, será necessário buscar um novo prestador de sua preferência dentro da Rede Credenciada AMIL.\n\n" +
"⚠️ Até o dia 10/06 o plano SulAmérica segue ativo normalmente.\n\n\n" +
"🔍 COMO CONSULTAR A REDE CREDENCIADA AMIL\n\n" +
"Pelo Site:\n" +
"1. Acesse amil.com.br\n" +
"2. Clique em \"Rede Credenciada\"\n" +
"3. Preencha o nº do beneficiário ou CPF, localização e especialidade\n" +
"4. Clique em \"Buscar\"\n\n" +
"Pelo Aplicativo:\n" +
"1. Entre com CPF e senha\n" +
"2. Toque em \"Rede\" e depois em \"Busca na Rede Credenciada\"\n" +
"3. Insira localização e especialidade\n" +
"4. Toque em \"Buscar\"\n\n\n" +
"📞 CENTRAL DE ATENDIMENTO AMIL\n" +
"• 0800-021-2583 / 3004-1000 — Capitais e Regiões Metropolitanas\n" +
"• 0800-721-1006 — Demais Localidades\n\n\n" +
"Qualquer dúvida, estou à disposição! Em casos de dúvidas sobre o plano pode nos acionar.\n\n" +
"Atenciosamente,\n" +
"Equipe de Acolhimento Vitta";
}

function enviarEmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var dados = sheet.getDataRange().getValues();
  var enviados = 0;
  var erros = [];

  for (var i = 1; i < dados.length; i++) {
    var nome      = dados[i][0];
    var email     = dados[i][1];
    var jaEnviado = dados[i][2];

    if (!email || jaEnviado === "SIM") continue;

    var primeiroNome = nome.split(" ")[0];
    primeiroNome = primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase();

    try {
      GmailApp.sendEmail(email, ASSUNTO, corpEmail(primeiroNome));
      sheet.getRange(i + 1, 3).setValue("SIM");
      enviados++;
      Utilities.sleep(500);
    } catch(e) {
      erros.push(nome + " (" + email + "): " + e.message);
      sheet.getRange(i + 1, 3).setValue("ERRO");
    }
  }

  var msg = "✅ " + enviados + " emails enviados!";
  if (erros.length > 0) msg += "\n\n⚠️ Erros:\n" + erros.join("\n");
  SpreadsheetApp.getUi().alert(msg);
}
