import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

/**
 * Cria commits no Git com datas aleatórias no passado
 * @param {number} commitCount - Número de commits a serem criados
 */
const createCommits = async (commitCount) => {
  try {
    const git = simpleGit();

    // Força a configuração do remote correto
    await git.removeRemote("origin");
    await git.addRemote("origin", "https://github.com/OQAY/goGreen.git");

    // Verifica se estamos em um repositório Git
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      throw new Error("Não é um repositório Git válido");
    }

    console.log(`Iniciando criação de ${commitCount} commits...`);

    for (let i = 0; i < commitCount; i++) {
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
    process.exit(1);
  }
};

/**
 * Função principal
 */
const main = async () => {
  const commitCount = 100; // Número de commits a serem criados

  console.log("🚀 Iniciando processo de criação de commits...");
  await createCommits(commitCount);
};

// Executa o programa
main().catch((error) => {
  console.error("❌ Erro fatal:", error.message);
  process.exit(1);
});
