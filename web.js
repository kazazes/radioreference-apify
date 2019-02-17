function pageFunction(context) {
        console.log(`Processing ${request.url}...`);
        const url = args.page.url();
        const systems = [];
        await page.waitForSelector(".footerText");
        await apify_1.default.utils.puppeteer.injectJQuery(page);
        if (url === "https://www.radioreference.com/apps/db/") {
            await handleDBRoot(page, $, requestQueue);
        } else if (url.indexOf("stid=") >= 0) {
            await handleState(page, $, requestQueue);
        } else if (url.indexOf("ctid=") >= 0) {
            await handleCounty(page, requestQueue, psuedoUrls);
        } else if (url.indexOf("opt=all_tg") >= 0) {
            const s = await handleSystemTables(page, $);
            await apify_1.default.pushData(s);
        } else {
            console.log("Where AM I?", "");
        }
        }
