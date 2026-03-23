# Estratégia de Deploy Contínuo (Pull-Based & Zero-Downtime)

Como o servidor web hospedeiro não permite conexões de entrada (inbound), não é possível utilizar *webhooks* do GitHub para CD/CI padrão. A abordagem que utilizamos aqui é a **Estratégia Pull-Based**, onde o próprio servidor toma a iniciativa de verificar se existem atualizações no `main` e baixar o código.

Para atender aos nossos requisitos de disponibilidade e segurança, optamos por um sistema de **Links Simbólicos (Symlinks)**, similar a arquiteturas blue/green.

## Estrutura do Servidor-Alvo

Para garantir que o deploy gere zero indisponibilidade (*zero-downtime*) caso a build demore, a árvore no Linux (`/var/www/lapan-website`) deve funcionar da seguinte maneira:

```text
/var/www/lapan-website/
├── repo/           # Clone do repositório Git local do webserver
├── releases/       # Arquivo de pastas "dist" das builds anteriores (backups)
│   ├── 20260315_103015_a1b2c3d/  
│   └── 20260323_110800_f8a9e0b/  
└── current         # Link simbólico que o Apache usa como DocumentRoot
```

O `Virtual Host` do Apache obrigatoriamente aponta para `/var/www/lapan-website/current`.

---

## Como Configurar e Acionar o Script

O script `lapan-deploy.sh` que está nesta pasta foi construído para lidar com todo o roteamento seguro e backup orgânico.

1. Insira ou copie o script `lapan-deploy.sh` para dentro do seu servidor (longe do seu DocumentRoot, de preferência, ou em uma pasta administrativa).
2. Garanta permissão de execução: `chmod +x lapan-deploy.sh`.
3. Configure as variáveis globais (nas primeiras linhas do bash script) conforme os caminhos da sua hospedagem.
4. Adicione a rotina de execução automática no **Cron** (`crontab -e`), de preferência no usuário que tem as permissões do webserver/pastas:
```cron
*/5 * * * * /caminho/para/lapan-deploy.sh >> /var/log/lapan-deploy.log 2>&1
```

O fluxo checará por novos pushes a cada 5 minutos, compilando com segurança a build de `npm run build` do Astro, isolada para uma pasta de release e por fim, vai rotacionar o `current` magicamente apenas se a compilação for um sucesso (e apagando de forma cíclica as construções obsoletas extremas para economizar espaço de servidor).

---

## Como Fazer Rollback (Emergência por Versão Quebrada)

Se a versão recém inserida no Git continha um erro lógico após ir para o ar, contorne as quedas em produção emergencialmente por apenas direcionar o link dinâmico a uma subpasta anterior que se mantieve imutável:

```bash
cd /var/www/lapan-website
ln -sfn /var/www/lapan-website/releases/PASTA_DA_VERSAO_ANTERIOR current
```

O site voltará a servir uma versão operante e estática perfeitamente.
