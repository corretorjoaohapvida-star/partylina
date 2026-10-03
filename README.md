# Lina Criativa — nova página para teste B

Esta é uma nova versão para revisão. A página anterior permanece em `outputs/lina-vercel`.

## Ver a página

Abra `http://127.0.0.1:5174/` enquanto o servidor de prévia estiver funcionando. A versão para publicar usa exatamente os arquivos de `public/`.

## Arquivos para GitHub e Vercel

Extraia o ZIP. Coloque o conteúdo extraído na raiz do repositório, mantendo as pastas:

```
public/
  index.html
  styles.css
  app.js
  offer-config.js
  assets/            todas as imagens ficam aqui
vercel.json
.gitignore
README.md
REVISAO-PT.md
entrega-bonus/       PDF do novo bônus 01 para adicionar à Hotmart
```

Não coloque as imagens soltas na raiz. Não envie o ZIP como se ele fosse o site. Não crie outra pasta acima de `public/` dentro do repositório.

No Vercel, a pasta raiz é a raiz do repositório. O projeto é estático: o `vercel.json` define saída em `public`, sem instalação ou comando de build. Se existirem configurações antigas de outro projeto, confira que o diretório de saída é `public`.

## Oferta

- Basic: 100 designs, US$7,90, sem bônus. Hotmart `off=dn5l2k7z`.
- Complete: 1.000+ designs, US$14,90, quatro bônus. Hotmart `off=c6fxrgcu`.
- Garantia: 7 dias, ambos os planos.
- Pixel Meta: `2589111474848514`.
- Eventos: PageView no carregamento; ViewContent quando a área dos planos entra na tela; InitiateCheckout somente nos links que levam à Hotmart, com valor do plano.
- Identificação de versão nos eventos: `b-2026-10`. Campanhas recebidas na URL continuam no checkout; sem `src` anterior, usa `lina-lp-b`.
- Contador: a exibição renova em 24 horas. A compra permanece disponível; o contador não desativa botão nem modifica preço.

Depois de aprovar a versão, publique-a e confira os dois preços na Hotmart no país de venda. Não há mudanças automáticas em anúncios, orçamento ou checkout.

## Novo bônus 01

O arquivo `entrega-bonus/party-planner-lina.pdf` tem quatro páginas A4 em inglês: planejamento da festa, checklist de preparação, controle da produção e cronograma. Adicione esse PDF à entrega do Completo na Hotmart antes de publicar a versão que anuncia o bônus. O arquivo está fora de `public/`, para acompanhar o pacote de entrega sem ficar aberto na página de vendas.

A hero usa uma nova imagem de coleção gerada com a ferramenta integrada, otimizada em WebP. O prompt final e as referências estão em `HERO-PROMPT.md`.
