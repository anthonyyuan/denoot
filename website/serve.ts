import * as Denoot from "../mod.ts";

// @deno-types="https://deno.land/x/fuse@v6.4.1/dist/fuse.d.ts"
import Fuse from "https://deno.land/x/fuse@v6.4.1/dist/fuse.esm.min.js";

const { default: views } = await import("./build.ts");

const app = Denoot.app(
    3000,
    "0.0.0.0",
    ({ localhostURL }) => console.log(localhostURL),
);

app.static("/static", {
    folder: "website/assets",
    autoIndex: true,
});


for (const view of views) {
    app.get(view.url, (req: Denoot.Request, res: Denoot.Response) => {
        return res.sendFile(view.htmlFilePath);
    });
}

app.get("/", (req: Denoot.Request, res: Denoot.Response) => {
    return res.sendFile("./website/dist/front-page.html");
});


/* search */
const options = {
    includeScore: true,
    keys: [
        {
            name: "title",
            weight: .7
        },
        {
            name: "titles",
            weight: .6
        },
        {
            name: "desc",
            weight: .4
        },
    ],
};

const fuse = new Fuse(views.map(view => {
    // not needed
    delete view.markup;

    return view
}), options);

app.get("/auto-complete/{query: string}", (req: Denoot.Request, res: Denoot.Response) => {

    const query = decodeURIComponent(req.params.get("query")?.raw ?? "");

    if (query.length < 1 || query.length > 1000)
        return res.status(404).send([]);

    const result = fuse.search(query);

    res.send(result.slice(0, 6));

});