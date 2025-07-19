import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

/**
 * Script SIMPLES para criar commits
 */
const createSimpleCommit = async () => {
  try {
    const git = simpleGit();

    console.log("🚀 Criando 1 commit simples...");

    // Gera data aleatória no passado
    const weeksAgo = random.int(0, 54);
    const daysAgo = random.int(0, 6);

    const commitDate = moment()
      .subtract(1, "y")
      .add(1, "d")
      .add(weeksAgo, "w")
      .add(daysAgo, "d")
      .format();

    // Dados do commit
    const data = {
      date: commitDate,
      message: "Simple commit",
    };

    console.log(`📅 Data do commit: ${commitDate}`);

    // Escreve arquivo
    await jsonfile.writeFile(path, data);

    // Adiciona e faz commit
    await git.add([path]);
    await git.commit(commitDate, { "--date": commitDate });

    // Push
    await git.push();

    console.log("✅ Commit criado com sucesso!");
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
};

// Executa
createSimpleCommit();
