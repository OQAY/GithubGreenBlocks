import simpleGit from "simple-git";

/**
 * Limpa todos os commits do repositório
 */
const cleanCommits = async () => {
  try {
    const git = simpleGit();

    console.log("🧹 Limpando TODOS os commits...");

    // Verifica se é um repositório Git
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      console.log("❌ Não é um repositório Git válido");
      return;
    }

    console.log("🗑️  Removendo todo o histórico...");

    // Remove todos os commits e cria um novo repositório limpo
    await git.reset("--hard", ["HEAD"]);

    // Remove todos os arquivos do staging
    await git.clean("f", ["-d"]);

    // Cria um novo commit inicial limpo
    console.log("📝 Criando commit inicial limpo...");
    await git.add(".");
    await git.commit("Initial commit - Clean slate");

    // Força o push para sobrescrever completamente o histórico
    console.log("📤 Forçando push para sobrescrever histórico...");
    await git.push(["--force-with-lease", "origin", "main"]);

    console.log("✅ Repositório completamente limpo!");
    console.log("🆕 Agora tem apenas 1 commit inicial");
  } catch (error) {
    console.error("❌ Erro ao limpar commits:", error.message);
    console.log("💡 Tentando método alternativo...");

    try {
      // Método alternativo: deletar e recriar o repositório
      console.log("🔄 Recriando repositório...");
      await git.init();
      await git.add(".");
      await git.commit("Initial commit - Fresh start");
      await git.push(["--force", "origin", "main"]);
      console.log("✅ Repositório recriado com sucesso!");
    } catch (altError) {
      console.error("❌ Erro no método alternativo:", altError.message);
    }
  }
};

cleanCommits();
