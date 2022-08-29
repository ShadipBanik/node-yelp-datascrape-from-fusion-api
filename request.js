const request = require("request");
// const urlParams = new URLSearchParams(
//   "https://www.yelp.com/biz_redir?url=http%3A%2F%2Fwww.redlillyplumbing.com&cachebuster=1659637650&website_link_type=website&src_bizid=OBUH7Hd8YCnzmX6zstJelA&s=b86d33c8bceeaab8c6ecee6be0c1af954f673e63442cbf7c75ec2ae9b64f568d"
// );
// const myParam = urlParams.get("url");
const params = new URL(
  "https://www.yelp.com/biz_redir?url=http%3A%2F%2Fwww.redlillyplumbing.com&cachebuster=1659637650&website_link_type=website&src_bizid=OBUH7Hd8YCnzmX6zstJelA&s=b86d33c8bceeaab8c6ecee6be0c1af954f673e63442cbf7c75ec2ae9b64f568d"
).searchParams;
console.log(params.get("url"));
const statezip = " CA 90048".trim().split(" ");
console.log(statezip);
for (i = 0; i < 3; i++) {
  // If i is equal to 1, it comes
  // out of the for a loop
  if (i === 1) {
    break;
  }

  // Printing i
  console.log(i);
}
