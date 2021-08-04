// importação de dependência(s)
import express from 'express';
import fs from 'fs';

// variáveis globais deste módulo
const PORT = 3000
const db = {}
const app = express();
const clientDir = "./client"


// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 1-4 linhas de código (você deve usar o módulo de filesystem (fs))
fs.readFile('./server/data/jogadores.json', (erro, dados)=> {
    if (erro)
        console.log('erro');

    else {
        db.jogadores = JSON.parse(dados.toString());
    }
});

fs.readFile('./server/data/jogosPorJogador.json', (erro, dados) => {
    if (erro)
        console.log('erro');

    else {
        db.jogosPorJogador = JSON.parse(dados.toString());
    }
});

// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???qual-templating-engine???');
//app.set('views', '???caminho-ate-pasta???');
// dica: 2 linhas
app.set('view engine', 'hbs');
app.set('views', 'server/views')

// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json (~3 linhas)
app.get('/', function (req, res) {
    res.render('index', db.jogadores, function (err, html) {
        res.send(html)
    })
})


// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter ~15 linhas de código
app.get('/jogador/:id', (req, res) => {
    const { id } = req.params;
    const player = db.jogadores.players.find(p => p.steamid === id);

    const jogos = db.jogosPorJogador[player.steamid];
    player.top  = jogos.games.sort((b,a) => a.playtime_forever - b.playtime_forever).filter((el, index) => index < 5);
    res.render('jogador', player);
})

// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código
app.use(express.static(`${clientDir}`));
// abrir servidor na porta 3000 (constante PORT)
// dica: 1-3 linhas de código
const server = app.listen(3000, () => {
    console.log('Executando em :HTTPS://localhost:3000');
})