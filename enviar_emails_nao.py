"""
Script para enviar email personalizado para membros classificados como NÃO.
Antes de enviar em massa, envia uma prévia para andressa.matias@vitta.me.

Uso:
  python3 enviar_emails_nao.py           # envia prévia para Andressa
  python3 enviar_emails_nao.py --enviar  # envia para todos os NÃO
"""

import re
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from getpass import getpass

# ─── Configuração ───────────────────────────────────────────────────────────
REMETENTE_EMAIL = "andressa.matias@vitta.me"   # Gmail/Google Workspace
EMAIL_PREVIA    = "andressa.matias@vitta.me"
SMTP_SERVER     = "smtp.gmail.com"
SMTP_PORT       = 587

ASSUNTO = "Acolhimento Vitta | Transição para o Plano AMIL — Informações Importantes"

def corpo_email(nome_completo: str) -> str:
    primeiro_nome = nome_completo.split()[0].capitalize() if nome_completo else "Beneficiário(a)"
    return f"""\
Olá, {primeiro_nome}!

Estou enviando este e-mail para acompanharmos as informações relacionadas ao seu formulário de acolhimento referente à troca do plano de saúde. Identificamos que você tem dúvidas referente à rede credenciada e seu plano e quer entender melhor o seu acompanhamento atual no novo convênio.


🔄 IMPORTANTE — TRANSIÇÃO PARA O PLANO AMIL A PARTIR DE 10/06

Se os locais onde você possui consultas e exames agendados aceitarem o novo plano AMIL, QUE ESTARÁ DISPONÍVEL a partir de amanhã no app Amil, basta informar a nova carteirinha ao local que está agendado para que seja solicitada autorização no novo plano.


❌ Se não aceitarem, será necessário buscar um novo prestador de sua preferência dentro da Rede Credenciada AMIL.

⚠️ Até o dia 10/06 o plano SulAmérica segue ativo normalmente.


🔍 COMO CONSULTAR A REDE CREDENCIADA AMIL

Pelo Site:
1. Acesse amil.com.br
2. Clique em "Rede Credenciada"
3. Preencha o nº do beneficiário ou CPF, localização e especialidade
4. Clique em "Buscar"

Pelo Aplicativo:
1. Entre com CPF e senha
2. Toque em "Rede" e depois em "Busca na Rede Credenciada"
3. Insira localização e especialidade
4. Toque em "Buscar"


📞 CENTRAL DE ATENDIMENTO AMIL
• 0800-021-2583 / 3004-1000 — Capitais e Regiões Metropolitanas
• 0800-721-1006 — Demais Localidades


Qualquer dúvida, estou à disposição! Em casos de dúvidas sobre o plano pode nos acionar.

Atenciosamente,
Equipe de Acolhimento Vitta
"""

# ─── Extração dos membros NÃO ────────────────────────────────────────────────
def extrair_membros_nao(html_path="elegibilidade.html"):
    with open(html_path, encoding="utf-8") as f:
        html = f.read()

    rows = re.findall(
        r'<tr data-id="\d+"[^>]*data-orig-status="nao"[^>]*>(.*?)</tr>',
        html, re.DOTALL
    )

    membros = []
    for row in rows:
        tds = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
        if len(tds) < 2:
            continue
        # Nome está no segundo TD
        nome = re.sub(r'<[^>]+>', '', tds[1]).strip().splitlines()[0].strip()

        email_match = re.search(
            r'([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})', row
        )
        email = email_match.group(1) if email_match else None

        if email:
            membros.append({"nome": nome, "email": email})

    return membros

# ─── Envio ────────────────────────────────────────────────────────────────────
def enviar(destinatario_email, destinatario_nome, senha_smtp, modo_teste=False):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = ASSUNTO
    msg["From"]    = REMETENTE_EMAIL
    msg["To"]      = destinatario_email

    texto = corpo_email(destinatario_nome)
    msg.attach(MIMEText(texto, "plain", "utf-8"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(REMETENTE_EMAIL, senha_smtp)
        server.sendmail(REMETENTE_EMAIL, destinatario_email, msg.as_string())

    print(f"  ✅ Enviado → {destinatario_nome} <{destinatario_email}>")

# ─── Main ─────────────────────────────────────────────────────────────────────
def main():
    enviar_para_todos = "--enviar" in sys.argv

    membros = extrair_membros_nao()
    print(f"\n{'='*60}")
    print(f"  Membros NÃO encontrados: {len(membros)}")
    print(f"{'='*60}")
    for m in membros:
        print(f"  • {m['nome']:<40} {m['email']}")
    print(f"{'='*60}\n")

    if not enviar_para_todos:
        print("MODO PRÉVIA — será enviado 1 email de exemplo para:")
        print(f"  {EMAIL_PREVIA}\n")
        print("Conteúdo do email (exemplo com primeiro membro):")
        print("-"*60)
        print(corpo_email(membros[0]["nome"] if membros else "Nome Exemplo"))
        print("-"*60)
        confirma = input("\nEnviar prévia para seu email agora? (s/N): ").strip().lower()
        if confirma != "s":
            print("Cancelado.")
            return
        senha = getpass(f"Senha do app Gmail para {REMETENTE_EMAIL}: ")
        enviar(EMAIL_PREVIA, membros[0]["nome"] if membros else "Andressa", senha)
        print("\n✅ Prévia enviada! Verifique sua caixa de entrada.")
        print("Para enviar para TODOS, execute: python3 enviar_emails_nao.py --enviar")
    else:
        print("⚠️  ENVIO REAL para todos os membros NÃO.")
        confirma = input(f"Confirma envio para {len(membros)} pessoas? (s/N): ").strip().lower()
        if confirma != "s":
            print("Cancelado.")
            return
        senha = getpass(f"Senha do app Gmail para {REMETENTE_EMAIL}: ")
        for m in membros:
            enviar(m["email"], m["nome"], senha)
        print(f"\n🎉 Todos os {len(membros)} emails foram enviados!")

if __name__ == "__main__":
    main()
