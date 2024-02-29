import http, { IncomingMessage, ServerResponse } from "http";
import {
	createPokemon,
	deletePokemon,
	getAllPokemon,
	getHome,
	getOnePokemon,
	updatePokemon,
} from "./controller";
const hostname = "127.0.0.1";
const port = 3000;

interface RouteHandler {
	(req: IncomingMessage, res: ServerResponse): void;
}

interface Routes {
	[method: string]: {
		[path: string]: RouteHandler;
	};
}

const routes: Routes = {
	GET: {},
	POST: {},
	PUT: {},
	DELETE: {},
};

const handleRequest = (req: IncomingMessage, res: ServerResponse) => {
	console.log(`${req.method} ${req.url}`);

	let url = req.url?.startsWith("/pokemon/") ? "/pokemon/:id" : req.url;
	url = url?.split("?")[0]; // Get rid of query parameters.
	const handler = routes[req.method ?? "GET"][url ?? "/"];

	if (handler) {
		handler(req, res);
	} else {
		res.statusCode = 404;
		res.end(JSON.stringify({ message: "Route not found" }, null, 2));
	}
};

routes.GET["/"] = getHome;
routes.GET["/pokemon"] = getAllPokemon;
routes.GET["/pokemon/:id"] = getOnePokemon;
routes.POST["/pokemon"] = createPokemon;
routes.PUT["/pokemon/:id"] = updatePokemon;
routes.DELETE["/pokemon/:id"] = deletePokemon;

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
