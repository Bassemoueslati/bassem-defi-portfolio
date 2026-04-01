async function main() {
  const Dex = await ethers.getContractFactory("Dex");
  const dex = await Dex.deploy();
  await dex.waitForDeployment();

  console.log("DEX deployed to:", dex.target);
}

main();
