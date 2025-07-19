import simpleGit from "simple-git";

console.log("🔍 DEBUG: Teste ultra controlado...");

(async () => {
  try {
    const git = simpleGit();

    console.log("1️⃣ Status inicial:");
    const statusBefore = await git.status();
    console.log("📊 Status:", statusBefore);

    console.log("2️⃣ Commits antes:");
    const logBefore = await git.log();
    console.log("📝 Commits existentes:", logBefore.all.length);

    console.log("3️⃣ Criando arquivo de teste...");
    const fs = await import("fs");
    const testContent = `TESTE_${Date.now()}`;
    fs.writeFileSync("./debug-test.txt", testContent);
    console.log("📝 Arquivo criado:", testContent);

    console.log("4️⃣ Adicionando ao Git...");
    await git.add(["./debug-test.txt"]);
    console.log("✅ Adicionado");

    console.log("5️⃣ Fazendo commit...");
    const commitMessage = `DEBUG_TEST_${Date.now()}`;
    await git.commit(commitMessage, { "--date": "2024-01-01T12:00:00Z" });
    console.log("✅ Commit feito:", commitMessage);

    console.log("6️⃣ Verificando commits após:");
    const logAfter = await git.log();
    console.log("📝 Commits após:", logAfter.all.length);
    console.log("📊 Diferença:", logAfter.all.length - logBefore.all.length);

    console.log("7️⃣ Últimos 3 commits:");
    logAfter.all.slice(0, 3).forEach((commit, i) => {
      console.log(`   ${i + 1}. ${commit.message} (${commit.date})`);
    });

    console.log("🎯 DEBUG CONCLUÍDO!");
  } catch (error) {
    console.error("❌ Erro no debug:", error.message);
  }
})();
