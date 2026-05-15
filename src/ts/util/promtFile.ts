export async function promptFile(): Promise<File | undefined> {
    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";

        input.addEventListener("change", () => {
            resolve(input.files?.[0] ?? undefined);
        });

        input.click();
    });
}