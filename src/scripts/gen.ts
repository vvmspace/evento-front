(async () => {
  const fs = require("fs");
  const path = require("path");
  const top = await fetch(
    `${
      process.env.API_PREFIX
    }/events?ssr=true&active=true&start_from=${new Date(
      Date.now() + 0.1 * 7 * 24 * 60 * 60 * 1000,
    ).toISOString()}&price_min_from=100&price_currency=EUR&size=1&sort=price_min_desc`,
  ).then((res) => res.json());
  const featured = await fetch(
    `${
      process.env.API_PREFIX
    }/events?ssr=true&active=true&start_from=${new Date(
      Date.now() + 0.1 * 7 * 24 * 60 * 60 * 1000,
    ).toISOString()}&size=1&sort=price_min_asc`,
  ).then((res) => res.json());
  fs.writeFileSync(
    path.join(__dirname, "..", "src", "data", "front.json"),
    JSON.stringify(top),
  );
})();
