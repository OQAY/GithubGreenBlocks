import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
import fs from "fs";

const path = "./data.json";
const lockFile = "./git-script.lock";

// Verifica se o script já está rodando
if (fs.existsSync(lockFile)) {
  console.log("⚠️  Script já está em execução!");
  console.log(
    "💡 Aguarde a execução anterior terminar ou delete o arquivo git-script.lock"
  );
  process.exit(1);
}

// Verifica se há processos Node.js rodando (aceita até 5 processos)
import { execSync } from "child_process";
try {
  const nodeProcesses = execSync(
    'tasklist /FI "IMAGENAME eq node.exe" /FO CSV',
    { encoding: "utf8" }
  );
  const processCount = (nodeProcesses.match(/node.exe/g) || []).length;
  if (processCount > 5) {
    console.log(
      `⚠️  Há ${processCount} processos Node.js rodando! (máximo: 5)`
    );
    console.log("💡 Execute: taskkill /f /im node.exe");
    process.exit(1);
  } else {
    console.log(`✅ ${processCount} processos Node.js detectados (aceito)`);
  }
} catch (error) {
  console.log("⚠️  Não foi possível verificar processos Node.js");
}

// Cria arquivo de lock
fs.writeFileSync(lockFile, Date.now().toString());

/**
 * Cria commits no Git com datas aleatórias no passado
 * @param {number} commitCount - Número de commits a serem criados
 */
const createCommits = async (commitCount) => {
  try {
    const git = simpleGit();

    // Verifica se já existem commits recentes (TEMPORÁRIO: aceita commits existentes)
    try {
      const log = await git.log();
      if (log.all.length > 0) {
        console.log(`⚠️  Já existem ${log.all.length} commits no repositório`);
        console.log("🔄 TESTE: Continuando mesmo com commits existentes...");
        // process.exit(0); // ← COMENTADO PARA TESTE
      }
    } catch (error) {
      console.log("📝 Repositório limpo, criando novos commits...");
    }

    // Verifica se estamos em um repositório Git
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      throw new Error("Não é um repositório Git válido");
    }

    // Configura remote apenas se não existir
    try {
      await git.getRemotes();
    } catch (error) {
      await git.addRemote("origin", "https://github.com/OQAY/Test1.git");
    }

    console.log(`Iniciando criação de ${commitCount} commits...`);

    // Verifica se há commits pendentes
    const status = await git.status();
    if (status.staged.length > 0 || status.modified.length > 0) {
      console.log("⚠️  Há arquivos modificados. Fazendo commit inicial...");
      await git.add(".");
      await git.commit("Initial commit");
    }

    for (let i = 0; i < commitCount; i++) {
      // Verificação de segurança mais rigorosa
      if (i >= commitCount) {
        console.log("✅ Número de commits atingido");
        break;
      }

      // Verificação adicional de segurança
      if (i > 5) {
        console.log("⚠️  Limite de segurança atingido (5 commits)");
        break;
      }

      console.log(`🔄 Loop ${i + 1}/${commitCount}`);

      // Gera semanas e dias aleatórios para o passado
      const weeksAgo = random.int(0, 54);
      const daysAgo = random.int(0, 6);

      // Cria data no passado (1 ano atrás + semanas + dias)
      const commitDate = moment()
        .subtract(1, "y")
        .add(1, "d")
        .add(weeksAgo, "w")
        .add(daysAgo, "d")
        .format();

      const data = {
        date: commitDate,
        commitNumber: i + 1,
        totalCommits: commitCount,
      };

      console.log(`Criando commit ${i + 1}/${commitCount}: ${commitDate}`);

      // Escreve dados no arquivo
      await jsonfile.writeFile(path, data);

      // Adiciona e faz commit com a data específica
      await git.add([path]);
      await git.commit(commitDate, { "--date": commitDate });

      // Delay para evitar execução muito rápida
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Faz push para o repositório remoto
    console.log("Fazendo push para o repositório remoto...");
    try {
      await git.push(["--set-upstream", "origin", "main"]);
      console.log("✅ Push realizado com sucesso!");
    } catch (error) {
      console.log("⚠️  Erro no push:", error.message);
      console.log(
        "💡 Execute manualmente: git push --set-upstream origin main"
      );
    }

    console.log("✅ Todos os commits foram criados com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante a criação dos commits:", error.message);
  } finally {
    // Remove arquivo de lock
    if (fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
    }
  }
};

/**
 * Função principal
 */
const main = async () => {
  const commitCount = 1; // Número de commits a serem criados

  console.log("🚀 Iniciando processo de criação de commits...");
  await createCommits(commitCount);
};

// Executa o programa
main().catch((error) => {
  console.error("❌ Erro fatal:", error.message);
  process.exit(1);
});
