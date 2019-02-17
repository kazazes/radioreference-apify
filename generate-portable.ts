import { readFileSync } from "fs";

const main = readFileSync("./dist/main.js", "utf-8");

const start = main.indexOf(`const handlePageFunction = async (args) => {
        const { request, page, $ } = args;`);

console.log(`Function starts on line ${start} and ends on`);
