import simpleGit from "simple-git";

/**
 * Limpa todos os commits do repositório
 */
const cleanCommits = async () => {
  try {
    const git = simpleGit();

    console.log("🧹 Limpando todos os commits...");

    // Verifica se é um repositório Git
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      console.log("❌ Não é um repositório Git válido");
      return;
    }

    // Remove todos os commits, mantendo apenas o estado atual
    console.log("📝 Criando novo commit inicial...");

    // Remove todos os arquivos do staging
    await git.reset("--hard", ["HEAD"]);

    // Remove todos os commits, mantendo apenas o estado atual
    await git.reset("--soft", ["HEAD~1000"]); // Remove muitos commits

    // Cria um novo commit inicial
    await git.add(".");
    await git.commit("Initial commit - Clean slate");

    // Força o push para sobrescrever o histórico
    console.log("📤 Forçando push para sobrescrever histórico...");
    await git.push(["--force", "--set-upstream", "origin", "main"]);

    console.log("✅ Todos os commits foram apagados!");
    console.log("🆕 Repositório agora tem apenas 1 commit inicial");
  } catch (error) {
    console.error("❌ Erro ao limpar commits:", error.message);
  }
};

cleanCommits();
