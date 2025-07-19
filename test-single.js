import simpleGit from "simple-git";

console.log("🧪 TESTE: Verificando se simple-git cria múltiplos commits...");

(async () => {
  try {
    const git = simpleGit();

    console.log("1️⃣ Verificando repositório...");
    const isRepo = await git.checkIsRepo();
    console.log("✅ É repositório Git:", isRepo);

    console.log("2️⃣ Verificando status...");
    const status = await git.status();
    console.log("📊 Status:", status);

    console.log("3️⃣ Verificando commits existentes...");
    const log = await git.log();
    console.log("📝 Commits existentes:", log.all.length);

    console.log("4️⃣ Criando APENAS 1 commit de teste...");

    // Cria arquivo de teste
    const fs = await import("fs");
    fs.writeFileSync("./test.txt", "teste " + Date.now());

    // Adiciona e faz commit
    await git.add(["./test.txt"]);
    await git.commit("TESTE: Commit único", {
      "--date": "2024-01-01T12:00:00Z",
    });

    console.log("✅ Commit de teste criado!");

    // Verifica novamente
    const logAfter = await git.log();
    console.log("📝 Commits após teste:", logAfter.all.length);

    console.log("🎯 TESTE CONCLUÍDO!");
  } catch (error) {
    console.error("❌ Erro no teste:", error.message);
  }
})();
