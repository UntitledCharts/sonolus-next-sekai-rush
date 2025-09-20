import { DatabaseEngineItem } from "@sonolus/core";

export { susToUSC } from "./sus/convert.js";
export { uscToLevelData } from "./usc/convert.js";
export * from "./usc/index.js";
export { uscToUSC } from "./usc/revert.js";

export const version = "0.1.0";

export const databaseEngineItem = {
    name: "NextSEKAI-R",
    version: 13,
    title: {
        en: "NextSEKAI R",
    },
    subtitle: {
        en: "NextSEKAI R",
    },
    author: {
        en: "NextSEKAI R",
    },
    description: {
        en: [
            "Next SEKAI's expansion engine",
            `Version: ${version}`,
            "",
            "https://github.com/Next-SEKAI/sonolus-next-sekai-engine",
        ].join("\n"),
        ko: [
            "Next SEKAI의 확장 엔진",
            `버전: ${version}`,
            "",
            "https://github.com/Next-SEKAI/sonolus-next-sekai-engine",
        ].join("\n"),
    },
} as const satisfies Partial<DatabaseEngineItem>;
