const handlePreviewClick = async () => {
  setIsPreviewing(true);
  setError("");

  try {
    let wc = webcontainer;
    if (!wc) {
      wc = await getWebContainerInstance();
      setWebcontainer(wc);
    }

    const fileMap = toWebContainerMount(files);
    await wc.mount(fileMap);

    // Step 1: Run npm install
    const installProcess = await wc.spawn("npm", ["install"]);
    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log("[install]", data);
        },
      })
    );
    await installProcess.exit;

    // Step 2: Determine project type
    const hasReact = files.some(f => f.content.includes("react"));
    const hasVite = files.some(f => f.path.includes("vite.config"));
    const hasExpress = files.some(f => f.content.includes("express"));
    const isReactApp = hasReact || hasVite;
    const isNodeApp = hasExpress || files.some(f => f.name.includes("server"));

    // Step 3: Run the appropriate command
    let devProcess;

    if (isReactApp) {
      devProcess = await wc.spawn("npm", ["run", "dev"]);
    } else if (isNodeApp) {
      const pkg = files.find(f => f.path === "package.json");
      const startScript = pkg?.content.includes('"start":')
        ? ["start"]
        : ["server.js"];
      devProcess = await wc.spawn("npm", startScript);
    } else {
      throw new Error("Could not detect project type");
    }

    // Step 4: Capture the local server URL
    devProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log("[dev]", data);
          const match = data.match(/(http:\/\/localhost:\d+)/);
          if (match && !previewUrl) {
            setPreviewUrl(match[1]);
          }
        },
      })
    );
  } catch (err) {
    console.error(err);
    setError("Failed to launch preview.");
  } finally {
    setIsPreviewing(false);
  }
};
