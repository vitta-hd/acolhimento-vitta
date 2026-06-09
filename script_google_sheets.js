// ─────────────────────────────────────────────────────────────
// SCRIPT GOOGLE SHEETS — Envio de email para membros NÃO
//
// COMO USAR:
// 1. Abra a planilha no Google Sheets
// 2. Clique em "Extensões" → "Apps Script"
// 3. Cole TODO este código, substituindo o que tiver lá
// 4. Clique em 💾 Salvar
// 5. No menu acima, selecione "enviarPrevia" e clique ▶ Executar
//    → Chegará 1 email de teste para você
// 6. Quando estiver ok, selecione "enviarParaTodos" e clique ▶ Executar
// ─────────────────────────────────────────────────────────────

var ASSUNTO = "Acolhimento Vitta | Transição para o Plano AMIL — Informações Importantes";
var SEU_EMAIL = "andressa.matias@vitta.me"; // email de prévia

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

// ── PRÉVIA: envia só para você ──────────────────────────────
function enviarPrevia() {
  var corpo = corpEmail("Andressa");
  GmailApp.sendEmail(SEU_EMAIL, "[PRÉVIA] " + ASSUNTO, corpo);
  SpreadsheetApp.getUi().alert("✅ Prévia enviada para " + SEU_EMAIL + "!\n\nVerifique sua caixa de entrada e, se estiver ok, rode 'enviarParaTodos'.");
}

// ── ENVIO REAL: envia para todos os da planilha ─────────────
function enviarParaTodos() {
  var ui = SpreadsheetApp.getUi();
  var resposta = ui.alert(
    "Confirmar envio",
    "Isso vai enviar emails para TODOS os membros da planilha.\nTem certeza?",
    ui.ButtonSet.YES_NO
  );
  if (resposta !== ui.Button.YES) return;

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var dados = sheet.getDataRange().getValues();
  var enviados = 0;
  var erros = [];

  for (var i = 1; i < dados.length; i++) { // pula cabeçalho
    var nome  = dados[i][0];
    var email = dados[i][1];
    var jaEnviado = dados[i][2];

    if (!email || jaEnviado === "SIM") continue;

    var primeiroNome = nome.split(" ")[0];
    primeiroNome = primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase();

    try {
      GmailApp.sendEmail(email, ASSUNTO, corpEmail(primeiroNome));
      sheet.getRange(i + 1, 3).setValue("SIM"); // marca coluna Enviado
      enviados++;
      Utilities.sleep(500); // pausa entre envios
    } catch(e) {
      erros.push(nome + " (" + email + "): " + e.message);
      sheet.getRange(i + 1, 3).setValue("ERRO");
    }
  }

  var msg = "✅ " + enviados + " emails enviados com sucesso!";
  if (erros.length > 0) msg += "\n\n⚠️ Erros:\n" + erros.join("\n");
  ui.alert(msg);
}
