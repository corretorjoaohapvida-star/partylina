# Lina Criativa — página de vendas

Versão pronta para GitHub e Vercel. Página estática; não precisa instalar pacotes nem compilar.

## Publicar

1. Extraia o ZIP.
2. No GitHub, crie um repositório e use **Add file → Upload files**.
3. Envie a pasta `public` e os arquivos `vercel.json`, `README.md` e `.gitignore` para a raiz do repositório. Não envie apenas o ZIP nem uma pasta extra envolvendo todo o projeto.
4. Na Vercel, selecione **Add New → Project**, importe esse repositório e clique em **Deploy**.

Se a Vercel pedir configurações: **Framework Preset: Other**; **Root Directory: raiz do repositório**; **Build Command: vazio**; **Install Command: vazio**; **Output Directory: public**. O arquivo `vercel.json` já configura esses valores. Veja a [documentação oficial da Vercel](https://vercel.com/docs/builds/configure-a-build).

## Estrutura

- `public/index.html`: página.
- `public/styles.css`: aparência e adaptação ao celular.
- `public/app.js`: carrosséis, perguntas, links e contador.
- `public/offer-config.js`: prazo da campanha.
- `public/assets/`: imagens usadas na página.
- `vercel.json`: configuração da hospedagem.

## Alterar a campanha

O contador usa um prazo fixo compartilhado, sem reiniciar ao atualizar. A campanha atual termina em **30/09/2026 às 23:13:27, horário de Brasília**. Para iniciar outra campanha, altere `endsAt` em `public/offer-config.js` para a data desejada, no formato ISO com fuso, e envie a alteração ao GitHub.

Os links dos planos estão em `public/index.html`. Os preços são US$7,90 para Basic e US$14,90 para Completo.

O Pixel Meta **2589111474848514** está instalado em `public/index.html`, com PageView ao visitar a página. Os botões de checkout disparam InitiateCheckout em `public/app.js`, com moeda USD e valor 7.90 para Basic ou 14.90 para Completo. Após publicar, confira os eventos na ferramenta Testar Eventos do Gerenciador de Eventos da Meta. O evento Purchase da compra concluída deve ser configurado na Hotmart.

A entrega de cada plano na Hotmart precisa corresponder ao que a página promete. O checkout Basic foi verificado por preço, mas seu nome ainda anunciava a coleção completa. Não foi realizada compra de teste.
