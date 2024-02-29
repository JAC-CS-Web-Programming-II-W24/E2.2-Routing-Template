import { IncomingMessage, ServerResponse } from "http";
import { party } from "./model";

export const getHome = (req: IncomingMessage, res: ServerResponse) => {
	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.end(
		JSON.stringify(
			{
				message: "Hello from the Pokemon Server!",
			},
			null,
			2,
		),
	);
};

export const getAllPokemon = (req: IncomingMessage, res: ServerResponse) => {
	const url = new URL(req.url!, `http://${req.headers.host}`); // Use URL parsing
	const queryParams = url.searchParams;
	const typeFilter = queryParams.get("type");
	const sortBy = queryParams.get("sortBy");

	// Apply basic filtering using 'if' if we have a `typeFilter`:
	if (typeFilter) {
		const filteredParty = party.filter(
			(pokemon) => pokemon.type === typeFilter,
		);
		res.end(JSON.stringify(filteredParty, null, 2));
		return;
	}

	if (sortBy === "name") {
		const sortedParty = [...party].sort((a, b) =>
			a.name.localeCompare(b.name),
		);
		res.end(JSON.stringify(sortedParty, null, 2));
		return;
	} // ... (you can handle sorting by other properties if needed)

	res.statusCode = 200;
	res.setHeader("Content-Type", "application/json");
	res.end(
		JSON.stringify({ message: "All Pokemon", payload: party }, null, 2),
	);
};

export const getOnePokemon = (req: IncomingMessage, res: ServerResponse) => {
	const id = Number(req.url?.split("/")[2]);
	const foundPokemon = party.find((pokemon) => pokemon.id === id);

	if (foundPokemon) {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.end(
			JSON.stringify(
				{
					message: "Pokemon found",
					payload: foundPokemon,
				},
				null,
				2,
			),
		);
	} else {
		res.statusCode = 404;
		res.end(JSON.stringify({ message: "Pokemon not found" }, null, 2));
	}
};

export const createPokemon = (req: IncomingMessage, res: ServerResponse) => {
	let body = "";

	req.on("data", (chunk) => {
		body += chunk.toString();
	});

	req.on("end", () => {
		const newPokemon = JSON.parse(body);
		newPokemon.id = party.length + 1; // Simple ID assignment
		party.push(newPokemon);

		res.statusCode = 201; // 'Created'
		res.setHeader("Content-Type", "application/json");
		res.end(
			JSON.stringify(
				{
					message: "Pokemon created!",
					payload: newPokemon,
				},
				null,
				2,
			),
		);
	});
};

export const updatePokemon = (req: IncomingMessage, res: ServerResponse) => {
	const id = Number(req.url?.split("/")[2]);
	let body = "";

	req.on("data", (chunk) => {
		body += chunk.toString();
	});

	req.on("end", () => {
		const updatedPokemon = JSON.parse(body);
		const foundIndex = party.findIndex((p) => p.id === id);
		if (foundIndex !== -1) {
			party[foundIndex] = {
				...party[foundIndex],
				...updatedPokemon,
			};
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.end(
				JSON.stringify(
					{
						message: "Pokemon updated!",
						payload: party[foundIndex],
					},
					null,
					2,
				),
			);
		} else {
			res.statusCode = 404;
			res.end(JSON.stringify({ message: "Pokemon not found" }, null, 2));
		}
	});
};

export const deletePokemon = (req: IncomingMessage, res: ServerResponse) => {
	const id = Number(req.url?.split("/")[2]);
	const foundIndex = party.findIndex((p) => p.id === id);

	if (foundIndex !== -1) {
		const deletedPokemon = party.splice(foundIndex, 1); // Remove the Pokemon
		res.statusCode = 200;
		res.end(
			JSON.stringify(
				{ message: "Pokemon deleted", payload: deletedPokemon },
				null,
				2,
			),
		);
	} else {
		res.statusCode = 404;
		res.end(JSON.stringify({ message: "Pokemon not found" }, null, 2));
	}
};
