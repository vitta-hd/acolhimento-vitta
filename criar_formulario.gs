/**
 * Acolhimento — Hospital Digital Vitta
 * Google Apps Script para popular o formulário existente.
 *
 * COMO USAR:
 * 1. Abra o Google Forms em questão
 * 2. Clique em "⋮" (três pontos) > "Editor de script"
 * 3. Cole este código, substituindo o existente
 * 4. Clique em "Executar" (▶) e autorize quando solicitado
 * 5. As perguntas serão criadas automaticamente no formulário
 */
function criarAcolhimento() {

  // ── Usa o formulário existente (preserva logo e estilo) ──────────────────
  var form = FormApp.openById('1HDtl1EypwfcQPNb5mxlYZafPTb5t7owjbtg55HkRQDw');

  // Limpa todas as perguntas existentes antes de recriar
  form.getItems().forEach(function(item){ form.deleteItem(item); });

  form.setTitle('Acolhimento — Hospital Digital Vitta');
  form.setDescription('Para te acolher da melhor forma durante a mudança do seu plano, vamos fazer algumas perguntas rápidas. Leva poucos minutos.');
  form.setConfirmationMessage(
    'Recebemos o seu acolhimento! 💙\n\n' +
    'Nossa equipe vai dar sequência e entrar em contato pelo canal informado.\n\n' +
    'Caso precise de algum apoio, pode nos acionar através do 11 49493-6663 ou através do sac@vitta.me'
  );

  // ── SEÇÃO 1: Dados pessoais + situação ───────────────────────────────────
  form.addTextItem()
    .setTitle('Qual o nome completo do beneficiário?')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Qual o CPF do beneficiário? (somente 11 dígitos numéricos)')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Qual o seu e-mail?')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Qual o seu telefone? (informe com DDD — Ex.: 11 98765-4321)')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Qual o melhor canal e horário para contato?')
    .setRequired(true);

  // Pergunta de situação criada agora (seção 1); choices definidos ao final
  var itemSituacao = form.addMultipleChoiceItem()
    .setTitle('Qual das opções abaixo descreve melhor a sua situação para acolhimento?')
    .setRequired(true);

  // ── SEÇÃO: Gestante ───────────────────────────────────────────────────────
  var secGestante = form.addPageBreakItem().setTitle('Gestante');
  var itemGVerif = form.addMultipleChoiceItem()
    .setTitle('Você já verificou com seu médico e com o hospital/maternidade se ambos aceitam o novo plano?')
    .setRequired(true);

  var secGOk = form.addPageBreakItem()
    .setTitle('✓ Tudo certo!')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);
  form.addSectionHeaderItem()
    .setTitle('Que alegria saber disso! 💙')
    .setHelpText(
      'Ficamos felizes em poder te acompanhar nesse momento tão especial. ' +
      'Desejamos que seu parto seja tranquilo, seguro e cheio de amor. ' +
      'Assim que o novo plano estiver disponível, seu médico e hospital poderão solicitar ' +
      'os atendimentos e procedimentos na nossa rede credenciada.\n\n' +
      'Caso precise de algum apoio, pode nos acionar através do 11 49493-6663 ou através do sac@vitta.me'
    );

  var secGParc = form.addPageBreakItem()
    .setTitle('Estamos aqui para ajudar!')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);
  form.addSectionHeaderItem()
    .setTitle('Entendemos, e estamos aqui para te apoiar! 💙')
    .setHelpText(
      'Assim que o novo plano estiver disponível, basta solicitar os processos, ' +
      'atendimentos e procedimentos na nossa rede credenciada. ' +
      'Sua tranquilidade e a do bebê são nossa prioridade.\n\n' +
      'Caso precise de algum apoio, pode nos acionar através do 11 49493-6663 ou através do sac@vitta.me'
    );

  var secGCompleto = form.addPageBreakItem()
    .setTitle('Gestante — Informações adicionais')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);
  form.addTextItem().setTitle('Com quantas semanas de gestação você está?');
  form.addTextItem().setTitle('Em qual hospital/maternidade e com qual médico o parto está agendado?');
  form.addTextItem().setTitle('Você tem alguma outra preferência de médico, maternidade ou bairro?');
  form.addTextItem().setTitle('O parto está previsto para quando?');
  form.addParagraphTextItem().setTitle('Há mais alguma informação importante para localizarmos um novo profissional?');

  itemGVerif.setChoices([
    itemGVerif.createChoice('Sim, e ambos já aceitam o novo plano', secGOk),
    itemGVerif.createChoice('Sim, mas um deles ainda não aceita', secGParc),
    itemGVerif.createChoice('Ainda não verifiquei / o novo plano ainda não está disponível', secGCompleto),
  ]);

  // ── SEÇÃO: Cirurgia ───────────────────────────────────────────────────────
  var secCirurgia = form.addPageBreakItem().setTitle('Cirurgia / Procedimento');
  var itemCVerif = form.addMultipleChoiceItem()
    .setTitle('Você já verificou com seu médico e hospital se aceitam o novo plano?')
    .setRequired(true);

  var secCOk = form.addPageBreakItem()
    .setTitle('✓ Tudo certo!')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);
  form.addSectionHeaderItem()
    .setTitle('Ótima notícia! 💙')
    .setHelpText(
      'Ficamos aliviados em saber que está tudo certo. ' +
      'Desejamos que o procedimento corra muito bem e que sua recuperação seja tranquila e rápida. ' +
      'Assim que o novo plano estiver disponível, seu médico e hospital poderão solicitar ' +
      'os processos na nossa rede credenciada.\n\n' +
      'Caso precise de algum apoio, pode nos acionar através do 11 49493-6663 ou através do sac@vitta.me'
    );

  var secCParc = form.addPageBreakItem()
    .setTitle('Vamos encontrar a melhor solução!')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);
  form.addSectionHeaderItem()
    .setTitle('Entendemos, e vamos trabalhar para encontrar a melhor solução! 💙')
    .setHelpText(
      'Assim que o novo plano estiver disponível, basta solicitar os processos, ' +
      'atendimentos e procedimentos na nossa rede credenciada. Estamos com você!\n\n' +
      'Caso precise de algum apoio, pode nos acionar através do 11 49493-6663 ou através do sac@vitta.me'
    );

  var secCCompleto = form.addPageBreakItem()
    .setTitle('Cirurgia — Informações adicionais')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);
  form.addTextItem().setTitle('Qual cirurgia/procedimento está agendado e para quando?');
  form.addTextItem().setTitle('Em qual hospital e com qual médico?');
  form.addTextItem().setTitle('Caso seu médico/hospital não aceite o novo plano, você tem outra preferência de médico, hospital ou bairro?');
  form.addParagraphTextItem().setTitle('Pode enviar o seu pedido médico ou documentos do tratamento? (envie por WhatsApp no 11 49493-6663, pelo e-mail sac@vitta.me ou cole um link aqui)');
  form.addParagraphTextItem().setTitle('Deseja trazer mais alguma informação?');

  itemCVerif.setChoices([
    itemCVerif.createChoice('Sim, e ambos já aceitam o novo plano', secCOk),
    itemCVerif.createChoice('Sim, mas um deles ainda não aceita', secCParc),
    itemCVerif.createChoice('Ainda não verifiquei / o novo plano ainda não está disponível', secCCompleto),
  ]);

  // ── SEÇÃO: Tratamento contínuo ────────────────────────────────────────────
  var secTratamento = form.addPageBreakItem()
    .setTitle('Tratamento Contínuo')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);
  form.addTextItem().setTitle('Você já verificou com seu médico/hospital se aceitam o novo plano?');
  form.addTextItem().setTitle('Qual tratamento você realiza atualmente?');
  form.addTextItem().setTitle('Qual a data do próximo tratamento?');
  form.addTextItem().setTitle('Em qual hospital ou com qual médico você realiza o tratamento?');
  form.addParagraphTextItem().setTitle('Pode enviar o seu pedido médico ou documentos do tratamento? (envie por WhatsApp no 11 49493-6663, pelo e-mail sac@vitta.me ou cole um link aqui)');
  form.addParagraphTextItem().setTitle('Deseja trazer mais alguma informação?');

  // ── SEÇÃO: Medicamento ────────────────────────────────────────────────────
  var secMedicamento = form.addPageBreakItem()
    .setTitle('Medicamento Contínuo')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);
  form.addTextItem().setTitle('Quais medicamentos você utiliza atualmente com liberação da operadora?');
  form.addTextItem().setTitle('Em qual local você retira ou recebe a medicação?');
  form.addTextItem().setTitle('Qual é a data da próxima retirada ou aplicação da medicação?');
  form.addParagraphTextItem().setTitle('Consegue enviar a receita ou comprovante? (por WhatsApp no 11 49493-6663, pelo e-mail sac@vitta.me ou cole um link aqui)');
  form.addParagraphTextItem().setTitle('Deseja trazer mais alguma informação?');

  // ── SEÇÃO: Internado / Home Care ──────────────────────────────────────────
  var secInternado = form.addPageBreakItem().setTitle('Internado / Home Care');
  var itemIVerif = form.addMultipleChoiceItem()
    .setTitle('Você já verificou com o hospital/clínica se aceitam o novo plano?')
    .setRequired(true);

  var secIOk = form.addPageBreakItem()
    .setTitle('✓ Tudo certo!')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);
  form.addSectionHeaderItem()
    .setTitle('Perfeito! 💙')
    .setHelpText(
      'Você poderá confirmar com o hospital/clínica a aceitação do seu plano. ' +
      'Assim que o novo plano estiver disponível, ele poderá solicitar os processos, ' +
      'atendimentos e procedimentos na nossa rede credenciada.\n\n' +
      'Nesse momento o mais importante é o seu bem-estar. Pode contar com a gente.\n\n' +
      'Caso precise de algum apoio, pode nos acionar através do 11 49493-6663 ou através do sac@vitta.me'
    );

  var secIParc = form.addPageBreakItem()
    .setTitle('Vamos ajudar!')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);
  form.addSectionHeaderItem()
    .setTitle('Ótimo! 💙')
    .setHelpText(
      'Assim que o novo plano estiver disponível, basta solicitar os processos, ' +
      'atendimentos e procedimentos na nossa rede credenciada.\n\n' +
      'Caso precise de algum apoio, pode nos acionar através do 11 49493-6663 ou através do sac@vitta.me'
    );

  var secISemPlano = form.addPageBreakItem()
    .setTitle('Sem acesso ao novo plano')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);
  form.addSectionHeaderItem()
    .setTitle('Tudo bem, entendemos! 💙')
    .setHelpText(
      'Sabemos que esse momento pode gerar incertezas. ' +
      'Assim que você tiver acesso ao novo plano, nossa equipe estará pronta para te apoiar da melhor forma. ' +
      'Se precisar de ajuda antes disso, não hesite em procurar o RH.\n\n' +
      'Caso precise de algum apoio, pode nos acionar através do 11 49493-6663 ou através do sac@vitta.me'
    );

  var secICompleto = form.addPageBreakItem()
    .setTitle('Internado — Informações adicionais')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);
  form.addTextItem().setTitle('Em qual hospital você está internado(a) ou está em home care?');
  form.addParagraphTextItem().setTitle('Qual o motivo da internação ou do home care? (se tiver relatório/exames, cole um link)');
  form.addParagraphTextItem().setTitle('Deseja trazer mais alguma informação?');

  itemIVerif.setChoices([
    itemIVerif.createChoice('Sim, e o hospital/clínica já aceita o novo plano', secIOk),
    itemIVerif.createChoice('Sim, mas ainda não aceita', secIParc),
    itemIVerif.createChoice('Ainda não verifiquei / o novo plano ainda não está disponível', secICompleto),
    itemIVerif.createChoice('Não sei informar, pois ainda não tenho acesso ao meu novo plano', secISemPlano),
  ]);

  // ── SEÇÃO: Consultas / Exames Eletivos ────────────────────────────────────
  var secEletivos = form.addPageBreakItem().setTitle('Consultas / Exames Eletivos');
  var itemFVerif = form.addMultipleChoiceItem()
    .setTitle('Você já tem acesso ao seu novo plano?')
    .setRequired(true);

  var secEletMsg = form.addPageBreakItem()
    .setTitle('Orientações importantes')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);
  form.addSectionHeaderItem()
    .setTitle('Fique atento às orientações abaixo 💙')
    .setHelpText(
      'Como o seu plano está passando por alteração, é necessário entrar em contato com o local ' +
      'onde sua consulta ou exame está agendado para confirmar se aceitam o novo plano. ' +
      'Caso aceitem, basta aguardar a carteirinha do novo plano e apresentá-la no dia do atendimento ' +
      '(ou enviar com antecedência para garantir a autorização). ' +
      'Se o local não aceitar o novo plano, será preciso aguardar a ativação do app e verificar ' +
      'a nova rede credenciada para ser atendido em outro local. ' +
      'Nesse caso, não cabe acolhimento por parte da Vitta, sendo você o responsável por seguir ' +
      'com as orientações acima.'
    );

  var secEletSemPlano = form.addPageBreakItem()
    .setTitle('Aguardando acesso ao plano')
    .setGoToPage(FormApp.PageNavigationType.SUBMIT);
  form.addSectionHeaderItem()
    .setTitle('Tudo bem, entendemos completamente! 💙')
    .setHelpText(
      'Caso ainda não tenha acesso ao novo plano, orientamos que aguarde a troca do mesmo ' +
      'e a nova disponibilização da carteirinha no App. ' +
      'Em caso de dúvidas sobre para qual plano você irá migrar, ou qualquer outra solicitação ' +
      'relacionada à migração, você também pode procurar o RH. ' +
      'Assim que tudo estiver disponível, estaremos prontos para te ajudar!\n\n' +
      'Caso precise de algum apoio, pode nos acionar através do 11 49493-6663 ou através do sac@vitta.me'
    );

  itemFVerif.setChoices([
    itemFVerif.createChoice('Sim, já tenho acesso ao novo plano', secEletMsg),
    itemFVerif.createChoice('Ainda não tenho acesso ao novo plano', secEletSemPlano),
  ]);

  // ── Choices da pergunta de situação (definidos por último) ────────────────
  itemSituacao.setChoices([
    itemSituacao.createChoice('Estou gestante', secGestante),
    itemSituacao.createChoice('Tenho cirurgia ou procedimento cirúrgico agendado', secCirurgia),
    itemSituacao.createChoice('Faço tratamento ou acompanhamento contínuo pelo convênio', secTratamento),
    itemSituacao.createChoice('Faço uso de medicamento contínuo ou exames pelo convênio', secMedicamento),
    itemSituacao.createChoice('Estou internado(a) ou em home care', secInternado),
    itemSituacao.createChoice('Tenho consultas/exames eletivos agendados (ex.: DIU, odontológico, consultas de rotina)', secEletivos),
  ]);

  Logger.log('✅ Formulário atualizado com sucesso!');
  Logger.log('Link de edição: ' + form.getEditUrl());
  Logger.log('Link de resposta: ' + form.getPublishedUrl());
}
