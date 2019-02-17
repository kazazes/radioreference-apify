import Apify, { PseudoUrl } from "apify";
import { Page, Request } from "puppeteer";

export interface IHandlePageFnArgs {
  request: Request;
  page: Page;
  $: JQueryStatic;
}

Apify.main(async () => {
  const requestList = new Apify.RequestList({
    sources: [{ url: "https://www.radioreference.com/apps/db/" }],
  });
  await requestList.initialize();

  // Apify.openRequestQueue() is a factory to get a preconfigured RequestQueue instance.
  const requestQueue = await Apify.openRequestQueue();
  const psuedoUrls: PseudoUrl[] = [
    new PseudoUrl("https://www.radioreference.com/apps/db/?stid=[d+]", {
      key: "state",
    }),
    new PseudoUrl("https://www.radioreference.com/apps/db/?ctid=[d+]", {
      key: "county",
    }),
    new PseudoUrl("https://www.radioreference.com/apps/db/?sid=[d+]", {
      key: "system",
    }),
    new PseudoUrl(
      "https://www.radioreference.com/apps/db/?sid=[d+]&opt=all_tg",
      { key: "table" },
    ),
  ];

  const handlePageFunction = async (args: IHandlePageFnArgs) => {
    const { request, page, $ } = args;
    await page.setRequestInterception(true);
    page.on("request", (r: Request) => {
      const rUrl = r.url();
      const filters = ["analytics", "quantserve", "syndication"];
      const shouldAbort = filters.some((urlPart) => rUrl.includes(urlPart));
      if (shouldAbort) {
        r.abort();
      } else {
        r.continue();
      }
    });
    console.log(`Processing ${request.url}...`);
    const url = args.page.url();
    await page.waitForSelector(".footerText");
    await Apify.utils.puppeteer.injectJQuery(page);
    if (url === "https://www.radioreference.com/apps/db/") {
      return await handleDBRoot(page, $, requestQueue);
    } else if (url.indexOf("stid=") >= 0) {
      return await handleState(page, $, requestQueue);
    } else if (url.indexOf("ctid=") >= 0) {
      return await handleCounty(page, requestQueue, psuedoUrls);
    } else if (url.indexOf("siteId=") >= 0) {
      const site = await handleSite(page, requestQueue);
      return await Apify.pushData(site);
    } else if (url.indexOf("sid=") >= 0) {
      if (url.indexOf("opt=all_tg")) {
        const s = await handleSystemTables(page, requestQueue, $);
        console.log(`${s["System Name"]} in ${s.Location}`);
        return await Apify.pushData(s);
      } else {
        return await requestQueue.addRequest({
          url: url + "&opt=all_tg#tgs",
        });
      }
    } else {
      console.error("Where AM I?", "");
      console.log("You're at", url);
    }
  };

  // Create an instance of the PuppeteerCrawler class - a crawler
  // that automatically loads the URLs in headless Chrome / Puppeteer.
  const crawler = new Apify.PuppeteerCrawler({
    // The crawler will first fetch start URLs from the RequestList
    // and then the newly discovered URLs from the RequestQueue
    psuedoUrls,
    requestList,
    requestQueue,

    // Here you can set options that are passed to the Apify.launchPuppeteer() function.
    // For example, you can set "slowMo" to slow down Puppeteer operations to simplify debugging
    launchPuppeteerOptions: {
      devTools: true,
      headless: true,
      liveView: true,
    },

    maxConcurrency: 20,
    minConcurrency: 10,

    handlePageFunction,
  });

  // This function is called if the page processing failed more than maxRequestRetries+1 times.
  const handleFailedRequestFunction = async (args: any) => {
    const { request } = args;
    console.log(`Request ${request.url} failed too many times`);
  };

  // Run the crawler and wait for it to finish.
  await crawler.run();

  console.log("Crawler finished.");
});

async function handleSite(page: Page, requestQueue: any) {
  console.log("Scraping site...", "");
  return page.evaluate(() => {
    const siteInfo: any = {};
    $("td > .rrtable tr , th+ tr").each((idx: number, r: HTMLElement) => {
      const row = r as HTMLTableRowElement;
      const k = row.cells[0].innerText.replace(":", "");
      const v = row.cells[1].innerText;
      if (k && v) {
        siteInfo[k] = v;
      }
    });
    $(".rrtable td+ td , .rrtable span").each((idx, b) => {
      if (!siteInfo.frequencies) {
        siteInfo.frequencies = [];
      }

      const f = $(b).text();

      siteInfo.frequencies.push(f);
    });

    siteInfo.fccLicenses = $("a")
      .filter((i, a: any) => a.href.indexOf("fccCallsign") >= 0)
      .map((i, a) => $(a).text())
      .toArray();

    return siteInfo;
  });
}

async function handleSystemTables(
  page: Page,
  requestQueue: any,
  $: JQueryStatic,
) {
  await Apify.utils.enqueueLinks({
    page,
    psuedoUrls: [
      new PseudoUrl("https://www.radioreference.com/apps/db/?siteId=[d+]", {
        key: "Site",
      }),
    ],
    requestQueue,
    selector: "td a",
  });
  console.log("Scraping tables...", "");
  return page.evaluate(() => {
    const systemInfo: any = {};
    $("td > .rrtable tr , th+ tr").each((idx: number, r: HTMLElement) => {
      const row = r as HTMLTableRowElement;
      const k = row.cells[0].innerText.replace(":", "");
      const v = row.cells[1].innerText;
      if (k && v) {
        systemInfo[k] = v;
      }
    });
    $("#tabcontents td .box").each((idx, b) => {
      const box = $(b);
      const boxTitleElem = box.find("h2");
      if (boxTitleElem && typeof boxTitleElem[0] !== undefined) {
        const boxTitle = boxTitleElem[0].innerText;
        const boxKeys = box.find("th").map((i, k) => {
          return k.innerText.trim();
        });
        systemInfo[boxTitle] = [];
        box.find("tr:has(> td)").map((i, row) => {
          const vals = $(row)
            .find("td")
            .map((ind, v) => v.innerText.trim());
          const o = boxKeys.toArray().reduce(
            (acc, cur, ind) => {
              acc[cur] = vals[ind];
              return acc;
            },
            {} as any,
          );
          systemInfo[boxTitle].push(o);
        });
      }
    });
    const titles = $(".title").map((i, t) => t.innerText);
    const tables = $(".titlebox table.rrtable tbody");
    tables.each((i, t) => {
      const table = $(t);
      const rawHeaders = table
        .find("th")
        .toArray()
        .map((th) => th.innerText);
      const headers = table
        .find("th")
        .toArray()
        .map((th) => th.innerText)
        .filter((h) => h.trim().length > 0);
      const rows = $(t)
        .find("tr:has(> td)")
        .toArray()
        .reduce(
          (acc, cur) => {
            const row = $(cur);
            const data = row.find("td");
            // check for wrapped frequency rows
            let firstEmptyIdx = data
              .toArray()
              .findIndex((d) => d.innerText.trim().length === 0);
            if (firstEmptyIdx === -1) {
              firstEmptyIdx = Infinity;
            }
            const firstValueIdx = data
              .toArray()
              .findIndex((d) => d.innerText.trim().length > 0);
            if (firstValueIdx > firstEmptyIdx) {
              const prev = acc[acc.length - 1];
              const filtered = data
                .toArray()
                .filter((d) => d.innerText.trim().length > 0);
              filtered.forEach((d) => {
                const datum = $(d).text();
                let header = headers[firstValueIdx];
                if (!header) {
                  header = "Data";
                  if (prev.Data === undefined) {
                    prev.Data = [];
                  }
                }
                prev[header].push(datum);
              });
            } else {
              const datum = {} as any;
              let currentHeader: string;
              data.each((j, d) => {
                const td = $(d) as any;
                if (headers[j]) {
                  currentHeader = headers[j];

                  // check if key is array
                  if (
                    j < rawHeaders.length - 1 &&
                    rawHeaders[j + 1].trim().length === 0
                  ) {
                    datum[currentHeader] = [td.text()];
                  } else {
                    datum[currentHeader] = td.text();
                  }
                } else {
                  // this is an array, use last header
                  datum[currentHeader].push(td.text());
                }
              });
              acc.push(datum);
            }
            return acc;
          },
          [] as any[],
        );

      systemInfo[titles[i]] = rows;
    });
    return systemInfo;
  });
}

async function handleDBRoot(page: Page, $: JQueryStatic, requestQueue: any) {
  const reqs = await page.evaluate(() => {
    const stateIds = $('select[name="stid"]')
      .first()
      .children()
      .toArray()
      .map((s: any) => s.value);
    return stateIds.map((id) => {
      return {
        url: `https://www.radioreference.com/apps/db/?stid=${id}`,
      };
    });
  });
  await Promise.all(
    reqs.map((req) => {
      return requestQueue.addRequest(req);
    }),
  );
}

async function handleState(page: Page, $: JQueryStatic, requestQueue: any) {
  console.log("Scraping state...");
  const reqs = await page.evaluate(() => {
    const countyIds = $('select[name="ctid"]')
      .first()
      .children()
      .toArray()
      .map((s: any) => s.value.replace("ctid,", ""));
    return countyIds.map((id) => {
      return {
        url: `https://www.radioreference.com/apps/db/?ctid=${id}`,
      };
    });
  });
  await Promise.all(
    reqs.map((req) => {
      return requestQueue.addRequest(req);
    }),
  );
}

async function handleCounty(
  page: Page,
  requestQueue: any,
  psuedoUrls: PseudoUrl[],
) {
  console.log("Scraping county...");
  return Apify.utils.enqueueLinks({
    page,
    psuedoUrls,
    requestQueue,
    selector: "tr td.w1p:first-of-type a",
  });
}
