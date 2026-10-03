# Lina Criativa — página de vendas

Projeto completo para GitHub e Vercel: 21 arquivos, incluindo as 14 imagens da página. O contador corrigido e o Pixel estão incluídos. Página estática; não precisa instalar pacotes nem compilar.

## Publicar

1. Extraia o ZIP.
2. No GitHub, abra seu repositório (ou crie um) e use **Add file → Upload files**.
3. Envie a pasta `public` e os arquivos `vercel.json`, `README.md` e `.gitignore` para a raiz do repositório. Não envie apenas o ZIP nem uma pasta extra envolvendo todo o projeto.
4. Clique em **Commit changes** no GitHub. Se o projeto já estiver conectado à Vercel, acompanhe o novo deploy em **Deployments**. Para publicar pela primeira vez, na Vercel selecione **Add New → Project**, importe esse repositório e clique em **Deploy**.

Confira se a pasta `public` no GitHub contém `index.html`, `styles.css`, `app.js`, `offer-config.js` e a pasta `assets` com 14 imagens. O arquivo `vercel.json` precisa ficar na raiz do repositório, ao lado de `public`.

Se a Vercel pedir configurações: **Framework Preset: Other**; **Root Directory: raiz do repositório**; **Build Command: vazio**; **Install Command: vazio**; **Output Directory: public**. O arquivo `vercel.json` já configura esses valores. Veja a [documentação oficial da Vercel](https://vercel.com/docs/builds/configure-a-build).

## Estrutura

- `public/index.html`: página.
- `public/styles.css`: aparência e adaptação ao celular.
- `public/app.js`: carrosséis, perguntas, links e contador.
- `public/offer-config.js`: duração do ciclo do contador.
- `public/assets/`: imagens usadas na página.
- `vercel.json`: configuração da hospedagem.

## Alterar a campanha

O contador renova automaticamente a cada 24 horas e nunca bloqueia os botões de compra. Ao recarregar, mantém a contagem salva neste navegador; se o ciclo já terminou, começa outro de 24 horas. Funciona também quando o navegador não permite armazenamento local. O topo informa a renovação da oferta. A duração pode ser alterada em `durationHours`, no arquivo `public/offer-config.js`.

Os links dos planos estão em `public/index.html`. Os preços são US$7,90 para Basic e US$14,90 para Completo.

O Pixel Meta **2589111474848514** está instalado em `public/index.html`, com PageView ao visitar a página. Os botões de checkout disparam InitiateCheckout em `public/app.js`, com moeda USD e valor 7.90 para Basic ou 14.90 para Completo. Após publicar, confira os eventos na ferramenta Testar Eventos do Gerenciador de Eventos da Meta. O evento Purchase da compra concluída deve ser configurado na Hotmart.

A entrega de cada plano na Hotmart precisa corresponder ao que a página promete. O checkout Basic foi verificado por preço, mas seu nome ainda anunciava a coleção completa. Não foi realizada compra de teste.
