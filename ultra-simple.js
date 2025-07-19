import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

console.log("🚀 CRIANDO APENAS 1 COMMIT...");

// Gera data aleatória
const weeksAgo = random.int(0, 54);
const daysAgo = random.int(0, 6);

const commitDate = moment()
  .subtract(1, "y")
  .add(1, "d")
  .add(weeksAgo, "w")
  .add(daysAgo, "d")
  .format();

console.log(`📅 Data: ${commitDate}`);

// Dados
const data = { date: commitDate, message: "Single commit" };

// Executa UMA VEZ
(async () => {
  try {
    const git = simpleGit();

    // Escreve arquivo
    await jsonfile.writeFile(path, data);
    console.log("📝 Arquivo escrito");

    // Commit
    await git.add([path]);
    await git.commit(commitDate, { "--date": commitDate });
    console.log("✅ Commit criado");

    // Push
    await git.push();
    console.log("🚀 Push realizado");

    console.log("🎉 APENAS 1 COMMIT CRIADO!");
  } catch (error) {
    console.error("❌ Erro:", error.message);
  }
})();
