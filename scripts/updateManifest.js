const fs = require('fs');
const path = require('path');

const NOVO_VENDOR = 'sj';

const atualizarVendor = (arquivo) => {
    try {
        const conteudo = fs.readFileSync(arquivo, 'utf-8');
        const json = JSON.parse(conteudo);

        if (json.vendor && json.vendor !== NOVO_VENDOR) {
            json.vendor = NOVO_VENDOR;
            fs.writeFileSync(arquivo, JSON.stringify(json, null, 2));
            console.log(`✅ Vendor atualizado: ${arquivo}`);
        } else {
            console.log(`ℹ️ Vendor já estava correto: ${arquivo}`);
        }
    } catch (erro) {
        console.error(`❌ Erro no arquivo ${arquivo}: ${erro.message}`);
    }
};

const varrerPastas = (pasta) => {
    fs.readdirSync(pasta, { withFileTypes: true }).forEach((entrada) => {
        const caminhoCompleto = path.join(pasta, entrada.name);

        if (entrada.isDirectory()) {
            varrerPastas(caminhoCompleto);
        } else if (entrada.isFile() && entrada.name === 'manifest.json') {
            atualizarVendor(caminhoCompleto);
        }
    });
};

// Inicia no diretório atual
varrerPastas(path.resolve('.'));
