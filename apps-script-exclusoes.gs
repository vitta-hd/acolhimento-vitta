/**
 * Conferência CW × Vision — lista compartilhada de exclusões
 * --------------------------------------------------------------
 * 1) Crie uma planilha Google nova (ex: "Conferencia – Exclusões")
 *    com a aba "Exclusoes" e o cabeçalho na linha 1:
 *      A: Key | B: Paciente | C: Profissional | D: Data | E: ExcluidoEm
 *
 * 2) Em Extensões → Apps Script, cole este código.
 *
 * 3) Substitua o SHEET_ID abaixo pelo ID da planilha
 *    (parte central da URL: docs.google.com/spreadsheets/d/SHEET_ID/edit).
 *
 * 4) Implantar → Nova implantação → Tipo: App da Web
 *    - Executar como: Eu (sua conta)
 *    - Quem tem acesso: Qualquer pessoa
 *    Copie a URL gerada (.../exec) e cole no conferencia.html
 *    na constante EXCLUSIONS_URL.
 */

const SHEET_ID = 'COLE_AQUI_O_ID_DA_PLANILHA';
const SHEET_NAME = 'Exclusoes';

function getSheet_() {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
}

function doGet(e) {
  const sh = getSheet_();
  const last = sh.getLastRow();
  let keys = [];
  if (last > 1) {
    keys = sh.getRange(2, 1, last - 1, 1).getValues().map(r => String(r[0])).filter(Boolean);
  }
  return ContentService
    .createTextOutput(JSON.stringify({ keys }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    if (!body.key) {
      return ContentService.createTextOutput(JSON.stringify({ ok:false, error:'missing key' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const sh = getSheet_();
    // Evita duplicar a mesma key
    const last = sh.getLastRow();
    if (last > 1) {
      const existing = sh.getRange(2, 1, last - 1, 1).getValues().map(r => String(r[0]));
      if (existing.indexOf(String(body.key)) !== -1) {
        return ContentService.createTextOutput(JSON.stringify({ ok:true, duplicate:true }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    sh.appendRow([
      String(body.key),
      String(body.paciente || ''),
      String(body.profissional || ''),
      String(body.data || ''),
      String(body.excluido_em || new Date().toISOString())
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok:true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok:false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
